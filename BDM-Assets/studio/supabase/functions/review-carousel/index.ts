// ============================================================
// review-carousel · Gemini 2.0 Flash 자체 평가 Edge Function
// - JWT 검증
// - 쿼터 체크 없음 (Gemini 무료 티어 사용, 비용 ~$0.001/건)
// - 평가 결과 반환 (DB 저장은 클라이언트가 ratings 테이블로 직접)
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Gemini 2.5 Flash 가격 (per 1M tokens)
const PRICE_INPUT_PER_MTOK = 0.3;
const PRICE_OUTPUT_PER_MTOK = 2.5;

const REVIEW_PROMPT = `당신은 인스타그램 캐러셀 콘텐츠 전문 편집장입니다. 아래 캐러셀을 평가하세요.

평가 기준:
1. 훅 강도 (1-5): 첫 슬라이드를 보고 3초 안에 스크롤을 멈추는가? 숫자/의외성이 있는가?
2. 데이터 근거 (1-5): 주장에 구체적 수치/출처가 있는가?
3. 흐름 논리성 (1-5): HOOK→PROBLEM→INSIGHT→SOLUTION→CTA 흐름이 자연스러운가?
4. CTA 명확성 (1-5): 마지막에 구체적 행동(웹사이트 방문, 저장 등)을 유도하는가?

반드시 아래 형식의 유효한 JSON만 출력하세요. 다른 텍스트 없이 JSON만 출력하세요.

{"hook":N,"data":N,"flow":N,"cta":N,"total":N,"feedback":"한줄 피드백","suggestions":["개선사항1","개선사항2"]}`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_KEY) return errorResponse('GEMINI_API_KEY 미설정', 500);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('인증 토큰 필요', 401);

    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return errorResponse('유효하지 않은 토큰', 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json();
    const { carousel, carousel_id = null, generation_id = null } = body;
    if (!carousel) return errorResponse('carousel 객체 필수', 400);

    const userMsg = `다음 캐러셀을 평가하세요:\n\n${JSON.stringify(carousel, null, 2)}`;

    const resp = await fetch(`${ENDPOINT}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: REVIEW_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      await admin.from('api_calls').insert({
        user_id: user.id,
        operation: 'review',
        model: MODEL,
        success: false,
        error_message: `Gemini ${resp.status}: ${errText.slice(0, 500)}`,
        duration_ms: Date.now() - startTime,
        carousel_id,
      });
      return errorResponse(`Gemini 호출 실패 (${resp.status})`, 502, { detail: errText.slice(0, 500) });
    }

    const data = await resp.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
    const cost =
      (inputTokens / 1_000_000) * PRICE_INPUT_PER_MTOK +
      (outputTokens / 1_000_000) * PRICE_OUTPUT_PER_MTOK;

    let review: unknown;
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      review = JSON.parse(cleaned);
    } catch (e) {
      await admin.from('api_calls').insert({
        user_id: user.id,
        operation: 'review',
        model: MODEL,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost_usd: cost,
        success: false,
        error_message: 'JSON 파싱 실패',
        duration_ms: Date.now() - startTime,
        carousel_id,
      });
      return errorResponse('Gemini 응답 JSON 파싱 실패', 502, { raw: raw.slice(0, 1000) });
    }

    await admin.from('api_calls').insert({
      user_id: user.id,
      operation: 'review',
      model: MODEL,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: cost,
      duration_ms: Date.now() - startTime,
      success: true,
      carousel_id,
    });

    return jsonResponse({
      review,
      generation_id,
      usage: { input_tokens: inputTokens, output_tokens: outputTokens, cost_usd: cost },
    });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
