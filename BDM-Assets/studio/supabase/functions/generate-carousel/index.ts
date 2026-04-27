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

interface Attachment { name?: string; type?: string; media_type?: string; base64?: string; }
function buildContent(text: string, attachments: Attachment[] | undefined) {
  const arr: unknown[] = [{ type: 'text', text }];
  if (!Array.isArray(attachments) || attachments.length === 0) return arr;
  for (const a of attachments) {
    const mt = a.media_type || '';
    if (mt.startsWith('image/') && a.base64) {
      arr.push({ type: 'image', source: { type: 'base64', media_type: mt, data: a.base64 } });
    } else if (mt === 'application/pdf' && a.base64) {
      arr.push({ type: 'document', source: { type: 'base64', media_type: mt, data: a.base64 } });
    } else if ((mt.startsWith('text/') || mt.includes('markdown')) && a.base64) {
      try {
        const decoded = new TextDecoder('utf-8').decode(Uint8Array.from(atob(a.base64), c => c.charCodeAt(0)));
        arr.push({ type: 'text', text: `\n\n## 첨부 파일: ${a.name || 'untitled.txt'}\n\n${decoded.slice(0, 12000)}` });
      } catch (_) {}
    }
  }
  return arr;
}

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
      attachments = [],
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

    // ── 7. 활성 엔진 버전 로드 (migration 012 이후 channel 필터 필수)
    const { data: engine, error: engineErr } = await admin
      .from('engine_versions')
      .select('version_tag, system_prompt')
      .eq('channel', 'carousel')
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

    // ── 7-3. 사용자 개인 학습 프롬프트 로드 (031 마이그레이션)
    // 사용자가 "이 피드백을 내 스타일로 학습" 한 누적 규칙이 있으면 systemPrompt 끝에 합침
    const { data: personRow } = await admin
      .from('user_personalization')
      .select('summary_prompt, is_enabled, rules_count')
      .eq('user_id', user.id)
      .eq('channel', 'carousel')
      .maybeSingle();

    // ── 8. 시스템 프롬프트 구성 (선택된 스타일 주입)
    let systemPrompt = engine.system_prompt;
    if (styleRow?.analyzed) {
      systemPrompt += `\n\n## 사용자 개인 스타일: "${styleRow.name}"`;
      if (styleRow.description) systemPrompt += `\n(${styleRow.description})`;
      systemPrompt += `\n이 스타일은 ${styleRow.item_count}개의 레퍼런스를 분석하여 도출된 규칙입니다. 아래 규칙을 반드시 반영하여 생성하세요:\n${JSON.stringify(styleRow.analyzed, null, 2)}`;
    }

    // ── 8-a. 사용자 개인 학습 프롬프트 (031 마이그레이션) — 누적된 사용자 선호 자동 적용
    if (personRow?.summary_prompt && personRow.is_enabled !== false && personRow.rules_count > 0) {
      systemPrompt += `\n\n${personRow.summary_prompt}\n(위 규칙은 이 사용자가 "내 스타일로 학습"으로 누적한 ${personRow.rules_count}개 피드백에서 추출됨. 매번 같은 지시를 반복하지 않도록 자동 적용된다.)`;
    }

    // ── 8-b. 커버(첫 슬라이드) 품질 강화 — 사용자 강한 지적 ("타이틀 페이지 100중 90 most important")
    systemPrompt += `

## 🌟 커버(cover) 슬라이드 — 절대 원칙 (가장 중요)
캐러셀에서 커버는 전체 노출의 90%를 결정한다. 다음 규칙을 반드시 따른다:

1) **헤딩(cover.heading)은 "스크롤 멈추는 한 줄"이다.**
   - 12~20자 한국어. 약속이 아니라 결론으로. (X) "팔로워 수에 대한 이야기" → (O) "팔로워 수는 죽었다"
   - 명사구로 끝내거나, 도발적 단언/숫자/대비 사용. 형용사·부사·"~에 대해" 같은 약한 표현 금지.

2) **서브헤드(cover.subhead)는 헤딩을 보완하는 1줄.**
   - 헤딩이 단언이면 서브헤드는 근거의 단서(누가/언제/얼마나).
   - 헤딩이 질문이면 서브헤드는 답의 힌트.
   - 헤딩과 같은 말 반복 절대 금지.

3) **금지어(커버에서):** "여러분", "오늘은", "이번 시간", "~에 대해 알아봅시다", "함께", "Hello", "안녕하세요".

4) **헤딩의 형태 패턴 — 둘 중 하나로 시작:**
   - (A) 단언/도발: "X는 Y다", "X는 끝났다", "X가 진실이다"
   - (B) 숫자/대비: "73%가 모르는 X", "X 1, Y 99", "5분 만에 X"

5) **이모지는 헤딩에 1개 이하 (없는 게 디폴트). 서브헤드에는 0개.**

6) **JSON 출력 시 cover.heading 은 반드시 위 규칙을 충족해야 한다.** 검증 후 출력.
`;

    // ── 8b. 이미지 의미매칭 강제 (사용자 피드백: "텍스트와 이미지 연계성 제로")
    systemPrompt += `

## 🖼 슬라이드 이미지 의미매칭 (반드시 출력)

**모든 슬라이드 (cover 포함, outro 제외)** 마다 \`image_prompt\` 필드를 반드시 출력한다.

### 규칙:
1) \`image_prompt\` = **영어 명사구 2~5개**, 쉼표로 구분.
2) 이 키워드는 **그 슬라이드의 heading + body 의미를 시각적으로 표현**해야 한다.
   - 추상 개념은 metaphor 객체로 (예: "검색의 종말" → "vintage broken search bar, abandoned newspaper")
   - 데이터/통계는 차트·그래프로 (예: "ROI -41%" → "red declining stock chart, financial dashboard")
   - 사람 행동은 행위 장면으로 (예: "광고업체 실수" → "confused businessman, marketing meeting whiteboard")
3) **금지**: 한글, 슬라이드 번호, 추상 형용사 단독, "AEO" 같은 약어.
4) **권장**: 구체적 객체 + 분위기/색조 (예: "data dashboard, red graph, decline, dark moody")

### 예시 출력:
- 슬라이드 "키워드 광고 ROI 급락" → \`"image_prompt": "red stock chart crashing, financial decline, broken graph, dark"\`
- 슬라이드 "AI가 답변을 직접 생성" → \`"image_prompt": "ai chatbot interface, conversation bubble, futuristic technology, blue glow"\`
- 슬라이드 "결론 — 답변을 만드세요" → \`"image_prompt": "open road sunrise, forward arrow, horizon, hopeful mood"\`

이 규칙은 시스템 필수다. \`image_prompt\` 비어있으면 사용자가 본 결과는 무관한 스톡 사진으로 채워진다.
`;

    systemPrompt += `\n\nYou must respond with valid JSON only, no other text.`;

    // ── 9. 유저 메시지 구성
    let userMsg = `다음 콘텐츠를 인스타그램 캐러셀로 만들어주세요.\n\n제목: ${topic}`;
    if (body_text) userMsg += `\n\n본문:\n${body_text}`;
    if (category) userMsg += `\n\n카테고리: ${category}`;
    if (tone) userMsg += `\n톤: ${tone}`;
    if (length) userMsg += `\n분량: ${length} 슬라이드`;

    if (mode === 'regenerate' && previous_output && feedback) {
      userMsg += `

## 이전 생성 결과 (V_prev)
${JSON.stringify(previous_output)}

## 사용자 피드백 (이번 라운드의 변경 지시)
${feedback}

## 🔒 재생성 절대 원칙 (반드시 따를 것 — 위반 금지)

1) **변경 범위 최소화 원칙 — 피드백에 명시된 부분만 수정한다.**
   - 사용자가 언급하지 않은 슬라이드/필드는 V_prev 의 값을 글자 단위로 그대로 복사한다.
   - "말투만 바꿔" 라고 하면 어조만 수정, 내용/구조/예시/순서는 V_prev 그대로 유지.
   - "[커버] 제목 더 강하게" 라고 하면 cover.heading 만 수정, 다른 슬라이드는 V_prev 그대로.
   - 사용자가 명시하지 않았는데 슬라이드 #N 의 본문을 새로 쓰는 것 = 위반.
   - 절대로 "전체적으로 다시 작성" 하지 않는다.

2) **피드백이 비어있는 필드를 지적하면 반드시 채운다.**
   - 예: "커버페이지 타이틀 없어?" / "cover heading 비어있어" → cover.heading 이 비었거나 약하면 강력한 단언/숫자/대비 한 줄로 반드시 채운다.
   - cover.heading, cover.subhead 는 절대 빈 문자열로 출력 금지 (시스템 필수 필드).

3) **본인 출력의 자체 검증 (출력 전 반드시 확인):**
   - [ ] cover.heading 이 비어있지 않은가?
   - [ ] 사용자가 언급하지 않은 슬라이드의 heading/body 가 V_prev 와 동일한가?
   - [ ] 변경 범위가 피드백에 적힌 만큼만인가?
   체크 통과한 후에만 출력한다.
`;
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
        messages: [{ role: 'user', content: buildContent(userMsg, attachments) }],
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
