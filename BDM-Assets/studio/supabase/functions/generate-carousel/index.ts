// ============================================================
// generate-carousel · Claude 프록시 Edge Function
// - Google OAuth JWT 검증
// - 월간 쿼터 체크 (usage_this_month < monthly_quota)
// - 일일 시스템 비용 상한 체크 ($30/day)
// - engine_versions에서 활성 시스템 프롬프트 로드
// - Claude API 호출
// - api_calls 로그 + users.usage_this_month 증가
// - carousels + generations row 생성
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

// Claude Sonnet 4 가격 (per 1M tokens, USD)
const PRICE_INPUT_PER_MTOK = 3.0;
const PRICE_OUTPUT_PER_MTOK = 15.0;

// 시스템 일일 비용 상한 (모든 유저 합산)
const DAILY_COST_CAP_USD = 30.0;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // ── 1. 환경변수 확인
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_KEY) return errorResponse('ANTHROPIC_API_KEY 미설정', 500);

    // ── 2. JWT 검증 → user 조회
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('인증 토큰 필요', 401);

    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return errorResponse('유효하지 않은 토큰', 401);

    // ── 3. Service role 클라이언트 (관리자 권한 DB 작업용)
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // ── 4. 요청 파싱
    const body = await req.json();
    const {
      topic,
      body_text = '',
      category = '',
      tone = '',
      length = '7-10',
      carousel_id = null,
      style_id = null, // 명시적 스타일 선택 (null이면 유저의 is_default 스타일 사용)
      mode = 'generate', // 'generate' | 'regenerate'
      feedback = '',
      previous_output = null,
    } = body;

    if (!topic || typeof topic !== 'string') {
      return errorResponse('topic 필수', 400);
    }

    // ── 5. 유저 쿼터 확인
    const { data: userRow, error: userErr } = await admin
      .from('users')
      .select('id, email, monthly_quota, usage_this_month, is_admin')
      .eq('id', user.id)
      .single();
    if (userErr || !userRow) return errorResponse('유저 정보 조회 실패', 500);

    if (!userRow.is_admin && userRow.usage_this_month >= userRow.monthly_quota) {
      return errorResponse(
        `이번 달 쿼터 소진 (${userRow.usage_this_month}/${userRow.monthly_quota}). 다음 달 1일에 리셋됩니다.`,
        429,
        { quota_exceeded: true }
      );
    }

    // ── 6. 시스템 일일 상한 체크
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayCalls } = await admin
      .from('api_calls')
      .select('cost_usd')
      .eq('success', true)
      .gte('created_at', today.toISOString());
    const todayCost = (todayCalls ?? []).reduce((s, r) => s + Number(r.cost_usd ?? 0), 0);
    if (todayCost >= DAILY_COST_CAP_USD) {
      return errorResponse(
        `시스템 일일 한도 도달 ($${todayCost.toFixed(2)} / $${DAILY_COST_CAP_USD}). 내일 다시 시도하세요.`,
        503,
        { system_cap_hit: true }
      );
    }

    // ── 7. 활성 엔진 버전 로드
    const { data: engine, error: engineErr } = await admin
      .from('engine_versions')
      .select('version_tag, system_prompt')
      .eq('is_active', true)
      .single();
    if (engineErr || !engine) return errorResponse('활성 엔진 버전 없음', 500);

    // ── 7-2. 적용할 스타일 선택
    // 우선순위: 요청의 style_id > is_default=true > 없음
    let styleQuery = admin
      .from('styles')
      .select('id, name, description, analyzed, item_count')
      .eq('user_id', user.id);
    styleQuery = style_id ? styleQuery.eq('id', style_id) : styleQuery.eq('is_default', true);
    const { data: styleRow } = await styleQuery.maybeSingle();

    // 요청한 style_id가 있는데 못 찾으면 에러 (다른 유저 스타일이거나 삭제됨)
    if (style_id && !styleRow) return errorResponse('지정한 스타일을 찾을 수 없음', 404);

    // ── 8. 시스템 프롬프트 구성 (선택된 스타일 주입)
    let systemPrompt = engine.system_prompt;
    if (styleRow?.analyzed) {
      systemPrompt += `\n\n## 사용자 개인 스타일: "${styleRow.name}"`;
      if (styleRow.description) systemPrompt += `\n(${styleRow.description})`;
      systemPrompt += `\n이 스타일은 ${styleRow.item_count}개의 레퍼런스를 분석하여 도출된 규칙입니다. 아래 규칙을 반드시 반영하여 생성하세요:\n${JSON.stringify(styleRow.analyzed, null, 2)}`;
    }
    systemPrompt += `\n\nYou must respond with valid JSON only, no other text.`;

    // ── 9. 유저 메시지 구성
    let userMsg = `다음 콘텐츠를 인스타그램 캐러셀로 만들어주세요.\n\n제목: ${topic}`;
    if (body_text) userMsg += `\n\n본문:\n${body_text}`;
    if (category) userMsg += `\n\n카테고리: ${category}`;
    if (tone) userMsg += `\n톤: ${tone}`;
    if (length) userMsg += `\n분량: ${length} 슬라이드`;

    if (mode === 'regenerate' && previous_output && feedback) {
      userMsg += `\n\n## 이전 생성 결과\n${JSON.stringify(previous_output)}\n\n## 피드백\n${feedback}\n\n위 피드백을 반영하여 캐러셀을 수정해주세요.`;
    }

    // ── 10. Claude API 호출
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    if (!anthropicResp.ok) {
      const errText = await anthropicResp.text();
      await admin.from('api_calls').insert({
        user_id: user.id,
        operation: mode,
        model: MODEL,
        success: false,
        error_message: `Anthropic ${anthropicResp.status}: ${errText.slice(0, 500)}`,
        duration_ms: Date.now() - startTime,
        carousel_id,
      });
      return errorResponse(`Claude 호출 실패 (${anthropicResp.status})`, 502, { detail: errText.slice(0, 500) });
    }

    const apiResult = await anthropicResp.json();
    const raw = apiResult.content?.[0]?.text ?? '';
    const inputTokens = apiResult.usage?.input_tokens ?? 0;
    const outputTokens = apiResult.usage?.output_tokens ?? 0;
    const cost =
      (inputTokens / 1_000_000) * PRICE_INPUT_PER_MTOK +
      (outputTokens / 1_000_000) * PRICE_OUTPUT_PER_MTOK;

    // ── 11. JSON 파싱 (markdown 코드펜스 제거)
    let output: unknown;
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      output = JSON.parse(cleaned);
    } catch (e) {
      await admin.from('api_calls').insert({
        user_id: user.id,
        operation: mode,
        model: MODEL,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost_usd: cost,
        success: false,
        error_message: 'JSON 파싱 실패: ' + (e as Error).message,
        duration_ms: Date.now() - startTime,
        carousel_id,
      });
      return errorResponse('Claude 응답 JSON 파싱 실패', 502, { raw: raw.slice(0, 1000) });
    }

    // ── 12. carousels + generations DB 저장
    let finalCarouselId = carousel_id;
    let nextVersion = 1;

    if (mode === 'generate' || !finalCarouselId) {
      const { data: newCarousel, error: cErr } = await admin
        .from('carousels')
        .insert({
          user_id: user.id,
          topic,
          category,
          tone,
          length,
          style_id: styleRow?.id ?? null,
          status: 'drafting',
        })
        .select('id')
        .single();
      if (cErr || !newCarousel) return errorResponse('carousel 저장 실패', 500, { detail: cErr?.message });
      finalCarouselId = newCarousel.id;
    } else {
      const { data: maxV } = await admin
        .from('generations')
        .select('version')
        .eq('carousel_id', finalCarouselId)
        .order('version', { ascending: false })
        .limit(1)
        .single();
      nextVersion = (maxV?.version ?? 0) + 1;
    }

    const { data: gen, error: gErr } = await admin
      .from('generations')
      .insert({
        carousel_id: finalCarouselId,
        version: nextVersion,
        prompt_used: systemPrompt,
        engine_version: engine.version_tag,
        output,
      })
      .select('id, version')
      .single();
    if (gErr || !gen) return errorResponse('generation 저장 실패', 500, { detail: gErr?.message });

    // ── 13. api_calls 로그 + 쿼터 증가
    await admin.from('api_calls').insert({
      user_id: user.id,
      operation: mode,
      model: MODEL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: cost,
      duration_ms: Date.now() - startTime,
      success: true,
      carousel_id: finalCarouselId,
    });

    if (mode === 'generate') {
      await admin.rpc('increment_usage', { user_uuid: user.id }).then(
        () => {},
        async () => {
          // RPC 없으면 직접 UPDATE (fallback)
          await admin
            .from('users')
            .update({ usage_this_month: userRow.usage_this_month + 1 })
            .eq('id', user.id);
        }
      );
    }

    return jsonResponse({
      carousel_id: finalCarouselId,
      generation_id: gen.id,
      version: gen.version,
      output,
      engine_version: engine.version_tag,
      style: styleRow ? { id: styleRow.id, name: styleRow.name, item_count: styleRow.item_count } : null,
      usage: { input_tokens: inputTokens, output_tokens: outputTokens, cost_usd: cost },
      quota: {
        used: userRow.usage_this_month + (mode === 'generate' ? 1 : 0),
        limit: userRow.monthly_quota,
      },
    });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
