// ============================================================
// submit-bug-report · 베타 테스터(조교/학생)의 🐛 문제 제보
// - 입력: { step, description, reproduction?, url?, user_agent?,
//          generation_id?, carousel_id?, style_id? }
// - 로그인된 사용자 누구나 가능 (generation 소유권 검증 X)
// - description 필수, 2000자 제한
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

const ALLOWED_STEPS = new Set(['step1', 'step2', 'step3', 'step4', 'styles', 'login', 'other']);

function clean(s: unknown, max: number): string | null {
  if (typeof s !== 'string') return null;
  const t = s.trim().slice(0, max);
  return t || null;
}

function cleanUuid(s: unknown): string | null {
  if (typeof s !== 'string') return null;
  const t = s.trim();
  return /^[0-9a-fA-F-]{36}$/.test(t) ? t : null;
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

    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const description = clean(body.description, 2000);
    if (!description) return errorResponse('description 필수', 400);

    const step = typeof body.step === 'string' && ALLOWED_STEPS.has(body.step) ? body.step : 'other';

    const row = {
      user_id: user.id,
      user_email: user.email ?? null,
      step,
      description,
      reproduction: clean(body.reproduction, 2000),
      url: clean(body.url, 500),
      user_agent: clean(body.user_agent, 500),
      generation_id: cleanUuid(body.generation_id),
      carousel_id: cleanUuid(body.carousel_id),
      style_id: cleanUuid(body.style_id),
    };

    const { data: inserted, error: insErr } = await admin
      .from('bug_reports')
      .insert(row)
      .select('id, created_at')
      .single();

    if (insErr) return errorResponse('제보 저장 실패: ' + insErr.message, 500);

    return jsonResponse({ ok: true, id: inserted.id, created_at: inserted.created_at });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
