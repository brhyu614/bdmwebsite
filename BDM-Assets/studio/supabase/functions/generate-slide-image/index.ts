// ============================================================
// generate-slide-image · Replicate Flux Schnell로 슬라이드 이미지 생성
// - 스타일 프로필의 visual_guidelines, color_signature, typography를
//   프롬프트에 주입하여 스타일에 맞는 이미지 생성
// - 1장 생성 (추가로 원하면 다시 호출)
// - Replicate CDN URL을 다운로드 → Supabase Storage에 저장
// - generations.slide_media 업데이트
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

// Flux Schnell: Black Forest Labs의 빠르고 저렴한 이미지 모델
// 4 steps, ~2-5초, ~$0.003/장
const REPLICATE_MODEL = 'black-forest-labs/flux-schnell';
const REPLICATE_URL = `https://api.replicate.com/v1/models/${REPLICATE_MODEL}/predictions`;

interface SlideData {
  role?: string;     // 'cover' | 'slide' | 'outro'
  tag?: string;
  heading?: string;
  body?: string;
  video_keyword?: string;
  variant?: string;  // 'dark' | 'light' | 'green' | ...
  media_type?: string;
}

interface StyleProfile {
  overall_tone?: string;
  color_signature?: string[];
  typography?: string;
  visual_guidelines?: string[];
  dos?: string[];
  donts?: string[];
  [k: string]: unknown;
}

function buildImagePrompt(slide: SlideData, style: StyleProfile | null): string {
  const parts: string[] = [];

  // 1. 슬라이드 주제
  if (slide.video_keyword) parts.push(slide.video_keyword);
  if (slide.heading) parts.push(`concept: ${slide.heading}`);

  // 2. 스타일 주입
  if (style) {
    if (style.overall_tone) parts.push(`tone: ${style.overall_tone}`);
    if (Array.isArray(style.color_signature) && style.color_signature.length > 0) {
      parts.push(`colors: ${style.color_signature.slice(0, 4).join(', ')}`);
    }
    if (Array.isArray(style.visual_guidelines) && style.visual_guidelines.length > 0) {
      parts.push(style.visual_guidelines.slice(0, 3).join('. '));
    }
  }

  // 3. 형식 고정
  parts.push('instagram carousel slide background');
  parts.push('4:5 vertical aspect ratio');
  parts.push('high quality, professional, editorial');

  // 4. 변형별 가이드
  if (slide.variant === 'dark') parts.push('dark moody atmosphere, muted tones');
  else if (slide.variant === 'light') parts.push('bright clean light, minimal');
  else if (slide.variant === 'green') parts.push('natural green tones, fresh');

  // 5. 주의사항
  parts.push('no text, no typography, no logos, no watermarks');

  return parts.join(', ');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const startTime = Date.now();

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
    if (!REPLICATE_TOKEN) return errorResponse('REPLICATE_API_TOKEN 미설정', 500);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('인증 토큰 필요', 401);

    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return errorResponse('유효하지 않은 토큰', 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const {
      generation_id,
      slide_index,   // 0=cover, 1..n=slides, -1=outro
      slide,         // 슬라이드 데이터 (role, tag, heading, body, video_keyword, variant)
      custom_prompt_hint, // 유저가 프롬프트에 추가로 붙이고 싶은 힌트
    } = body as {
      generation_id?: string;
      slide_index?: number;
      slide?: SlideData;
      custom_prompt_hint?: string;
    };
    if (!generation_id || typeof slide_index !== 'number' || !slide) {
      return errorResponse('generation_id, slide_index, slide 필수', 400);
    }

    // ─ Generation 소유권 + 스타일 조회
    const { data: gen } = await admin
      .from('generations')
      .select('id, carousel_id, slide_media, carousels!inner(user_id, style_id, styles(analyzed))')
      .eq('id', generation_id)
      .maybeSingle() as any;
    if (!gen || gen.carousels.user_id !== user.id) return errorResponse('generation 없음 또는 권한 없음', 404);

    const styleProfile: StyleProfile | null = gen.carousels?.styles?.analyzed ?? null;

    // ─ 프롬프트 구성
    let prompt = buildImagePrompt(slide, styleProfile);
    if (custom_prompt_hint) prompt += ', ' + custom_prompt_hint;

    // ─ Replicate 호출 (sync 대기)
    const replicateResp = await fetch(REPLICATE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=60',   // 60초까지 서버 대기 (sync 모드)
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: '4:5',
          num_outputs: 1,
          output_format: 'webp',
          output_quality: 90,
          num_inference_steps: 4,
        },
      }),
    });

    if (!replicateResp.ok) {
      const errText = await replicateResp.text();
      await admin.from('api_calls').insert({
        user_id: user.id,
        operation: 'generate_image',
        model: 'flux-schnell',
        success: false,
        error_message: `Replicate ${replicateResp.status}: ${errText.slice(0, 500)}`,
        duration_ms: Date.now() - startTime,
      });
      return errorResponse(`Replicate 호출 실패 (${replicateResp.status})`, 502, { detail: errText.slice(0, 500) });
    }

    const result = await replicateResp.json();
    // Flux Schnell은 output이 string[] (url 배열)
    const outputUrl: string | null =
      Array.isArray(result.output) ? result.output[0] : (typeof result.output === 'string' ? result.output : null);

    if (!outputUrl) {
      return errorResponse('Replicate 응답에서 이미지 URL을 찾지 못함', 502, {
        detail: { status: result.status, error: result.error, keys: Object.keys(result) },
      });
    }

    // ─ 이미지 다운로드 → Supabase Storage에 저장
    const imgResp = await fetch(outputUrl);
    if (!imgResp.ok) return errorResponse('Replicate 이미지 다운로드 실패', 502);
    const bytes = new Uint8Array(await imgResp.arrayBuffer());
    const storagePath = `${user.id}/${generation_id}/slide-${slide_index}-${Date.now()}.webp`;
    const { error: upErr } = await admin.storage.from('slide-images').upload(storagePath, bytes, {
      contentType: 'image/webp',
      upsert: false,
    });
    if (upErr) return errorResponse('이미지 저장 실패: ' + upErr.message, 500);

    // ─ generations.slide_media 업데이트
    const existing: unknown[] = Array.isArray(gen.slide_media) ? gen.slide_media : [];
    const filtered = existing.filter((m: any) => m.index !== slide_index);
    const newEntry = {
      index: slide_index,
      role: slide.role,
      source: 'ai',
      model: 'flux-schnell',
      storage_path: storagePath,
      prompt,
      created_at: new Date().toISOString(),
    };
    const updated = [...filtered, newEntry];
    await admin.from('generations').update({ slide_media: updated }).eq('id', generation_id);

    // ─ 비용 로깅 (~$0.003)
    await admin.from('api_calls').insert({
      user_id: user.id,
      operation: 'generate_image',
      model: 'flux-schnell',
      input_tokens: 0,
      output_tokens: 1,
      cost_usd: 0.003,
      duration_ms: Date.now() - startTime,
      success: true,
    });

    // ─ Signed URL 반환 (클라이언트가 즉시 렌더링)
    const { data: signed } = await admin.storage.from('slide-images').createSignedUrl(storagePath, 3600);

    return jsonResponse({
      generation_id,
      slide_index,
      storage_path: storagePath,
      signed_url: signed?.signedUrl,
      prompt,
      source: 'ai',
      model: 'flux-schnell',
    });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
