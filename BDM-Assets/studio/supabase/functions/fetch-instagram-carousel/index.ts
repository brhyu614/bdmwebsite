// ============================================================
// fetch-instagram-carousel · 인스타 URL → 캐러셀 이미지 전체 다운로드
// - 사용 서비스: Apify (apify/instagram-scraper actor, sync endpoint)
// - 입력: { instagram_url, style_id }
// - 처리:
//   1. Apify에서 해당 URL 스크레이핑 (sync, 최대 ~60초)
//   2. 응답의 images[] 배열(캐러셀 각 슬라이드 URL) 추출
//   3. 각 이미지 → fetch → Storage(style-screenshots) 업로드 → style_items insert
//   4. styles.needs_reanalyze = true
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

const APIFY_ACTOR = 'apify~instagram-scraper';  // '/'는 URL에서 '~'로 표기
const APIFY_SYNC_URL = (token: string) =>
  `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${token}&timeout=90`;

interface ApifyPost {
  type?: string;          // 'Sidecar' | 'Image' | 'Video'
  shortCode?: string;
  caption?: string;
  displayUrl?: string;
  images?: string[];      // Sidecar(캐러셀)일 때
  videoUrl?: string;
  ownerUsername?: string;
  [k: string]: unknown;
}

function extractImageUrls(posts: ApifyPost[]): string[] {
  if (!Array.isArray(posts) || posts.length === 0) return [];
  const p = posts[0];
  if (Array.isArray(p.images) && p.images.length > 0) return p.images;
  if (p.displayUrl) return [p.displayUrl];
  return [];
}

function urlToExt(url: string): string {
  const m = url.toLowerCase().match(/\.(jpg|jpeg|png|webp)(\?|$)/);
  return m ? m[1].replace('jpeg', 'jpg') : 'jpg';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN');
    if (!APIFY_TOKEN) return errorResponse('APIFY_TOKEN 미설정 (Apify 계정 + 토큰 필요)', 500);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('인증 토큰 필요', 401);

    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return errorResponse('유효하지 않은 토큰', 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const { instagram_url, style_id } = body as { instagram_url?: string; style_id?: string };
    if (!instagram_url || !style_id) return errorResponse('instagram_url, style_id 필수', 400);

    // 간단한 URL 검증
    if (!/^https?:\/\/(www\.)?instagram\.com\/(p|reel)\//.test(instagram_url)) {
      return errorResponse('유효한 instagram.com 게시물 URL이어야 합니다 (/p/... 또는 /reel/...)', 400);
    }

    // 스타일 소유권 확인
    const { data: style } = await admin
      .from('styles')
      .select('id, user_id')
      .eq('id', style_id)
      .maybeSingle();
    if (!style || style.user_id !== user.id) return errorResponse('스타일 없음 또는 권한 없음', 404);

    // ── Apify 호출 (sync actor run)
    const apifyInput = {
      directUrls: [instagram_url],
      resultsType: 'posts',
      resultsLimit: 1,
      addParentData: false,
    };

    const apifyResp = await fetch(APIFY_SYNC_URL(APIFY_TOKEN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apifyInput),
    });

    if (!apifyResp.ok) {
      const errText = await apifyResp.text();
      await admin.from('api_calls').insert({
        user_id: user.id,
        operation: 'scrape_instagram',
        model: 'apify:instagram-scraper',
        success: false,
        error_message: `Apify ${apifyResp.status}: ${errText.slice(0, 500)}`,
        duration_ms: Date.now() - startTime,
      });
      return errorResponse(`Apify 호출 실패 (${apifyResp.status})`, 502, { detail: errText.slice(0, 500) });
    }

    const posts = (await apifyResp.json()) as ApifyPost[];
    if (!Array.isArray(posts) || posts.length === 0) {
      return errorResponse('Apify 응답이 비어 있습니다 (게시물 비공개이거나 URL이 유효하지 않을 수 있음)', 502);
    }

    const imageUrls = extractImageUrls(posts);
    if (imageUrls.length === 0) {
      return errorResponse('이미지 URL을 찾지 못했습니다. 비공개 계정이거나 릴스(영상)일 수 있습니다.', 422, {
        detail: { first_post_keys: Object.keys(posts[0]) },
      });
    }

    const meta = posts[0];
    const label = `@${meta.ownerUsername ?? 'unknown'} · ${meta.shortCode ?? ''}${meta.caption ? ' · ' + meta.caption.slice(0, 60) : ''}`;

    // ── 각 이미지 다운로드 → Storage → style_items insert
    const insertedItems: string[] = [];
    for (const imgUrl of imageUrls) {
      try {
        const imgResp = await fetch(imgUrl);
        if (!imgResp.ok) continue;
        const bytes = new Uint8Array(await imgResp.arrayBuffer());
        const ext = urlToExt(imgUrl);
        const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

        const path = `${user.id}/${style_id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await admin.storage
          .from('style-screenshots')
          .upload(path, bytes, { contentType, upsert: false });
        if (upErr) continue;

        const { data: item } = await admin
          .from('style_items')
          .insert({
            user_id: user.id,
            style_id,
            source_kind: 'screenshot',
            screenshot_path: path,
            source_url: instagram_url,
            label,
          })
          .select('id')
          .single();
        if (item?.id) insertedItems.push(item.id);
      } catch (_e) {
        // 개별 이미지 실패는 skip
      }
    }

    // 재분석 필요 플래그
    await admin.from('styles').update({ needs_reanalyze: true, updated_at: new Date().toISOString() }).eq('id', style_id);

    // 로깅 (Apify 비용은 대략 고정 — 운영 중 실측치 넣기)
    await admin.from('api_calls').insert({
      user_id: user.id,
      operation: 'scrape_instagram',
      model: 'apify:instagram-scraper',
      input_tokens: 0,
      output_tokens: imageUrls.length,
      cost_usd: 0.003,  // 대략값 — 실비 반영은 추후
      duration_ms: Date.now() - startTime,
      success: true,
    });

    return jsonResponse({
      instagram_url,
      style_id,
      fetched_images: imageUrls.length,
      inserted_items: insertedItems.length,
      item_ids: insertedItems,
      label,
      caption_preview: meta.caption?.slice(0, 200) ?? null,
      owner: meta.ownerUsername ?? null,
      post_type: meta.type ?? null,
    });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
