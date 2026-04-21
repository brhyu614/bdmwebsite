// ============================================================
// analyze-style-items · Claude Vision으로 스타일 레퍼런스 분석
// - 입력: { style_id }
// - 처리:
//   1. style_items 중 analyzed IS NULL + source_kind='screenshot' 한꺼번에 Vision 분석
//   2. generation 타입은 output JSON으로 텍스트 요약
//   3. url 타입은 이번 MVP에서 skip (수동 레이블만)
//   4. 모든 아이템 분석 결과를 종합해 styles.analyzed 에 집계 저장
// - 쿼터: user.vision_quota / vision_usage 사용 (스크린샷 수만큼 차감)
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

const VISION_MODEL = 'claude-sonnet-4-20250514';
const PRICE_INPUT_PER_MTOK = 3.0;
const PRICE_OUTPUT_PER_MTOK = 15.0;
const MAX_SCREENSHOTS_PER_CALL = 12; // 1회 분석 한도

const PER_ITEM_PROMPT = `당신은 인스타그램 캐러셀 스타일 분석 전문가입니다. 아래 이미지(인스타 캐러셀 한 장)를 보고 스타일을 분석하세요.

반드시 아래 형식의 유효한 JSON만 출력하세요. 다른 텍스트 없이 JSON만.

{
  "role": "cover|slide|outro",
  "tone": "한 단어 또는 한 구절로 톤 묘사",
  "hook_style": "첫 문장/헤드라인이 어떻게 관심을 끄는지",
  "color_palette": ["hex 또는 색상명"],
  "background": "단색 | 사진 | 일러스트 | 그라데이션 등",
  "text_density": "low | medium | high",
  "font_feel": "산세리프 진한 / 세리프 부드러운 / 손글씨 등",
  "message_structure": "문제제기 | 인사이트 | 데이터제시 | 비교대조 | 행동지침 등",
  "notable_patterns": ["특이 패턴 2-3개"],
  "text_sample": "가장 중요한 문구 1-2문장"
}`;

const AGGREGATION_PROMPT = `당신은 인스타 캐러셀 스타일 가이드 작성 전문가입니다. 아래는 한 사용자가 모아둔 여러 레퍼런스 캐러셀 슬라이드 분석 결과입니다. 이를 종합하여 재생성에 쓸 **스타일 프로필**을 만드세요.

반드시 아래 JSON 형식만 출력하세요. 다른 텍스트 없이.

{
  "overall_tone": "전체적인 톤 2-3문장 요약",
  "recurring_hooks": ["반복되는 훅 패턴 3-5개"],
  "color_signature": ["대표 색상 3-5개 hex/명칭"],
  "typography": "폰트/글씨체 느낌 1-2문장",
  "structure_rules": ["슬라이드 구조 규칙 3-5개. 예: '첫 슬라이드는 숫자로 시작', '마지막은 행동 유도'"],
  "voice_guidelines": ["목소리/어조 규칙 3-5개"],
  "visual_guidelines": ["비주얼 규칙 3-5개. 예: '배경은 어두운 단색', '큰 제목 위 작은 본문'"],
  "dos": ["반드시 지킬 것 3-5개"],
  "donts": ["절대 피할 것 3-5개"],
  "summary_for_prompt": "재생성 시 시스템 프롬프트에 주입할 짧은 스타일 요약 (5-10문장)"
}`;

interface AnalyzedItem {
  item_id: string;
  role?: string;
  tone?: string;
  hook_style?: string;
  color_palette?: string[];
  background?: string;
  text_density?: string;
  font_feel?: string;
  message_structure?: string;
  notable_patterns?: string[];
  text_sample?: string;
  [k: string]: unknown;
}

async function callClaudeJSON(apiKey: string, content: unknown, system?: string): Promise<{
  text: string;
  inputTokens: number;
  outputTokens: number;
}> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      max_tokens: 1024,
      system: (system ?? '') + '\n\nYou must respond with valid JSON only, no other text.',
      messages: [{ role: 'user', content }],
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Claude ${resp.status}: ${txt.slice(0, 500)}`);
  }

  const data = await resp.json();
  return {
    text: data.content?.[0]?.text ?? '',
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
  };
}

function parseJSON(s: string): unknown {
  const cleaned = s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_KEY) return errorResponse('ANTHROPIC_API_KEY 미설정', 500);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('인증 토큰 필요', 401);

    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return errorResponse('유효하지 않은 토큰', 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const { style_id } = body as { style_id?: string };
    if (!style_id) return errorResponse('style_id 필수', 400);

    // 스타일 소유권 확인
    const { data: style } = await admin
      .from('styles')
      .select('id, name, user_id, needs_reanalyze')
      .eq('id', style_id)
      .maybeSingle();
    if (!style || style.user_id !== user.id) return errorResponse('스타일 없음 또는 권한 없음', 404);

    // 유저 vision 쿼터
    const { data: userRow } = await admin
      .from('users')
      .select('vision_quota, vision_usage, is_admin')
      .eq('id', user.id)
      .single();
    if (!userRow) return errorResponse('유저 정보 조회 실패', 500);

    // 분석 대상 아이템
    const { data: items } = await admin
      .from('style_items')
      .select('id, source_kind, screenshot_path, source_url, analyzed, generation_id, label')
      .eq('style_id', style_id);
    if (!items || items.length === 0) {
      return errorResponse('분석할 아이템이 없습니다. 먼저 레퍼런스를 추가하세요.', 400);
    }

    const toAnalyzeScreenshots = items.filter(
      (it) => it.source_kind === 'screenshot' && it.screenshot_path && (style.needs_reanalyze || !it.analyzed)
    );
    const generationItems = items.filter((it) => it.source_kind === 'generation' && it.analyzed);
    const urlItems = items.filter((it) => it.source_kind === 'url');

    if (toAnalyzeScreenshots.length > MAX_SCREENSHOTS_PER_CALL) {
      return errorResponse(`한 번에 분석 가능한 스크린샷은 최대 ${MAX_SCREENSHOTS_PER_CALL}장입니다.`, 400);
    }

    // Vision 쿼터 체크
    const visionNeeded = toAnalyzeScreenshots.length;
    if (!userRow.is_admin && userRow.vision_usage + visionNeeded > userRow.vision_quota) {
      return errorResponse(
        `Vision 쿼터 초과 (${userRow.vision_usage}+${visionNeeded}/${userRow.vision_quota})`,
        429
      );
    }

    let totalIn = 0;
    let totalOut = 0;
    const itemResults: AnalyzedItem[] = [];

    // 각 스크린샷을 Vision으로 분석
    for (const item of toAnalyzeScreenshots) {
      // Storage에서 signed URL 생성 후 binary fetch → base64
      const { data: signed, error: signErr } = await admin
        .storage.from('style-screenshots')
        .createSignedUrl(item.screenshot_path!, 300);
      if (signErr || !signed) {
        await admin.from('api_calls').insert({
          user_id: user.id, operation: 'vision_analyze', model: VISION_MODEL,
          success: false, error_message: `signed URL 실패: ${signErr?.message}`, duration_ms: Date.now() - startTime,
        });
        continue;
      }

      const imgResp = await fetch(signed.signedUrl);
      if (!imgResp.ok) continue;
      const buf = new Uint8Array(await imgResp.arrayBuffer());
      const base64 = btoa(String.fromCharCode(...buf));
      const mediaType = item.screenshot_path!.toLowerCase().endsWith('.jpg') ||
                         item.screenshot_path!.toLowerCase().endsWith('.jpeg')
        ? 'image/jpeg'
        : item.screenshot_path!.toLowerCase().endsWith('.webp')
        ? 'image/webp'
        : 'image/png';

      try {
        const r = await callClaudeJSON(ANTHROPIC_KEY, [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: PER_ITEM_PROMPT },
        ]);
        totalIn += r.inputTokens;
        totalOut += r.outputTokens;

        const analyzed = parseJSON(r.text) as Record<string, unknown>;
        await admin.from('style_items').update({ analyzed }).eq('id', item.id);
        itemResults.push({ item_id: item.id, ...analyzed });
      } catch (e) {
        await admin.from('api_calls').insert({
          user_id: user.id, operation: 'vision_analyze', model: VISION_MODEL,
          success: false, error_message: (e as Error).message.slice(0, 500), duration_ms: Date.now() - startTime,
        });
      }
    }

    // generation 타입은 기존 analyzed 그대로 포함 (이미 JSON 출력이 있음)
    for (const g of generationItems) {
      itemResults.push({ item_id: g.id, from_generation: true, analyzed: g.analyzed });
    }
    // url 타입: 레이블만 포함 (MVP는 자동 fetch 안 함)
    for (const u of urlItems) {
      itemResults.push({ item_id: u.id, from_url: u.source_url, label: u.label });
    }

    // 집계: 모든 아이템 분석을 종합해서 스타일 프로필 만들기
    let styleProfile: unknown = null;
    if (itemResults.length > 0) {
      try {
        const aggInput = `분석할 레퍼런스: ${itemResults.length}개\n\n${JSON.stringify(itemResults, null, 2)}`;
        const r = await callClaudeJSON(ANTHROPIC_KEY, aggInput, AGGREGATION_PROMPT);
        totalIn += r.inputTokens;
        totalOut += r.outputTokens;
        styleProfile = parseJSON(r.text);
      } catch (e) {
        await admin.from('api_calls').insert({
          user_id: user.id, operation: 'vision_analyze', model: VISION_MODEL,
          success: false, error_message: 'aggregation 실패: ' + (e as Error).message.slice(0, 400),
          duration_ms: Date.now() - startTime,
        });
      }
    }

    // styles.analyzed 저장 + 메타 업데이트
    if (styleProfile) {
      await admin.from('styles').update({
        analyzed: styleProfile,
        needs_reanalyze: false,
        last_analyzed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', style_id);
    }

    // 쿼터 차감 (vision 사용)
    if (!userRow.is_admin && visionNeeded > 0) {
      await admin.from('users').update({
        vision_usage: userRow.vision_usage + visionNeeded,
      }).eq('id', user.id);
    }

    const cost =
      (totalIn / 1_000_000) * PRICE_INPUT_PER_MTOK +
      (totalOut / 1_000_000) * PRICE_OUTPUT_PER_MTOK;

    await admin.from('api_calls').insert({
      user_id: user.id,
      operation: 'vision_analyze',
      model: VISION_MODEL,
      input_tokens: totalIn,
      output_tokens: totalOut,
      cost_usd: cost,
      duration_ms: Date.now() - startTime,
      success: true,
    });

    return jsonResponse({
      style_id,
      analyzed_items: toAnalyzeScreenshots.length,
      total_items: items.length,
      style_profile: styleProfile,
      usage: { input_tokens: totalIn, output_tokens: totalOut, cost_usd: cost },
      vision_quota: {
        used: userRow.vision_usage + visionNeeded,
        limit: userRow.vision_quota,
      },
    });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
