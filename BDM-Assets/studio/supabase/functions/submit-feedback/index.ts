// ============================================================
// submit-feedback · 컨펌된 캐러셀에 대한 집단지성 피드백 수집
// - 입력: { generation_id, topic_fit_score?, style_consistency_score?,
//         hook_strength_score?, theme_slugs?, theme_custom?, free_feedback? }
// - 같은 (generation_id, user_id) 이미 있으면 upsert (UPDATE)
// - 점수: 1~5 범위, 테마 slug: feedback_themes에 존재하는 것만
// - "기타" 자유입력은 별도 필드 → 나중에 카테고리 승격 재료
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

function clampScore(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const i = Math.round(n);
  if (i < 1 || i > 5) return null;
  return i;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('인증 토큰 필요', 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return errorResponse('유효하지 않은 토큰', 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const {
      generation_id,
      topic_fit_score,
      style_consistency_score,
      hook_strength_score,
      theme_slugs,
      theme_custom,
      free_feedback,
    } = body as Record<string, unknown>;

    if (!generation_id || typeof generation_id !== 'string') {
      return errorResponse('generation_id 필수', 400);
    }

    // generation 소유권 + carousel_id 확인
    const { data: gen, error: genErr } = await admin
      .from('generations')
      .select('id, carousel_id, carousels!inner(user_id)')
      .eq('id', generation_id)
      .maybeSingle() as any;
    if (genErr || !gen) return errorResponse('generation 없음', 404);
    if (gen.carousels.user_id !== user.id) return errorResponse('권한 없음', 403);

    // 테마 slug 유효성 검증
    let validSlugs: string[] = [];
    if (Array.isArray(theme_slugs) && theme_slugs.length > 0) {
      const requested = theme_slugs.filter((s): s is string => typeof s === 'string').slice(0, 10);
      if (requested.length > 0) {
        const { data: themes } = await admin
          .from('feedback_themes')
          .select('slug')
          .eq('is_active', true)
          .in('slug', requested);
        validSlugs = (themes ?? []).map((t: any) => t.slug);
      }
    }

    const row = {
      user_id: user.id,
      generation_id,
      carousel_id: gen.carousel_id,
      topic_fit_score: clampScore(topic_fit_score),
      style_consistency_score: clampScore(style_consistency_score),
      hook_strength_score: clampScore(hook_strength_score),
      theme_slugs: validSlugs,
      theme_custom: typeof theme_custom === 'string' ? theme_custom.trim().slice(0, 300) || null : null,
      free_feedback: typeof free_feedback === 'string' ? free_feedback.trim().slice(0, 2000) || null : null,
    };

    // Upsert (기존 피드백 덮어쓰기)
    const { data: upserted, error: upErr } = await admin
      .from('generation_feedback')
      .upsert(row, { onConflict: 'generation_id,user_id' })
      .select()
      .single();
    if (upErr) return errorResponse('피드백 저장 실패: ' + upErr.message, 500);

    return jsonResponse({ ok: true, feedback: upserted });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
