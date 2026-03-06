import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Research',
  description: '빅데이터마케팅 랩(BDM Lab) 연구 영역. AI 매출 예측, LLM 멀티 에이전트 시뮬레이션, 인과분석 기반 마케팅 연구.',
}

/* ── tiny helper ── */
function Arrow() {
  return (
    <div className="flex items-center justify-center text-muted">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  )
}

function ArrowDown() {
  return (
    <div className="flex items-center justify-center py-1 text-muted">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  )
}

function PipelineStep({ label, sub, accent }: { label: string; sub: string; accent?: boolean }) {
  return (
    <div className={`flex flex-col items-center rounded-lg border px-3 py-2.5 text-center ${
      accent ? 'border-accent bg-accent-bg' : 'border-border bg-surface'
    }`}>
      <span className={`text-xs font-bold ${accent ? 'text-accent' : 'text-text'}`}>{label}</span>
      <span className="mt-0.5 text-[10px] text-muted">{sub}</span>
    </div>
  )
}

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Research</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          연구실에서 하는 일
        </h1>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          BDM Lab은 세 가지 축으로 연구한다.
          머신러닝으로 미래를 예측하고, LLM 에이전트로 가상 실험을 설계하고,
          계량경제학으로 인과관계를 밝힌다.
          공통점은 하나 — <strong className="text-text">직감이 아니라 데이터로 답을 찾는 것.</strong>
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════
          1. AI/ML Prediction
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-20 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">1</span>
          <h2 className="text-xl font-bold text-text">AI/ML 기반 예측</h2>
        </div>

        {/* WHY */}
        <div className="mt-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Why</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            기업은 매일 의사결정을 한다. 신규 매장을 어디에 열지, 다음 달 재고를 얼마나 준비할지,
            어떤 연예인과 계약할지. 전통적으로는 담당자의 경험과 직감에 의존했다.
            문제는 <strong className="text-text">직감은 틀리고, 경험은 편향된다</strong>는 것이다.
            변수가 수십 개만 넘어가도 사람의 머리로는 최적 답을 찾을 수 없다.
          </p>
        </div>

        {/* HOW */}
        <div className="mt-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">How</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            XGBoost, LightGBM 같은 앙상블 알고리즘은 수백 개의 변수를 동시에 고려해서 패턴을 찾는다.
            과거 데이터에서 &ldquo;어떤 조건에서 매출이 올랐는지&rdquo;를 학습하고, 새로운 상황에 적용한다.
            단순히 숫자를 뱉는 게 아니다.
            <strong className="text-text"> SHAP value로 &ldquo;왜 이런 예측이 나왔는지&rdquo;까지 해석</strong>해서,
            의사결정에 실제로 쓸 수 있는 근거를 함께 만든다.
          </p>
        </div>

        {/* DIAGRAM — ML Pipeline */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface p-6">
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted">ML Prediction Pipeline</p>
          {/* Mobile: vertical */}
          <div className="flex flex-col items-center gap-1 sm:hidden">
            <PipelineStep label="데이터 수집" sub="POS · 주문 · GIS · 리뷰" />
            <ArrowDown />
            <PipelineStep label="피처 엔지니어링" sub="변수 설계 · 정제 · 통합" />
            <ArrowDown />
            <PipelineStep label="모델 학습" sub="XGBoost · LightGBM" />
            <ArrowDown />
            <PipelineStep label="예측" sub="매출 · 수요 · 트렌드" accent />
            <ArrowDown />
            <PipelineStep label="해석" sub="SHAP · Feature Importance" accent />
          </div>
          {/* Desktop: horizontal */}
          <div className="hidden items-center justify-center gap-2 sm:flex">
            <PipelineStep label="데이터 수집" sub="POS · 주문 · GIS" />
            <Arrow />
            <PipelineStep label="피처 엔지니어링" sub="변수 설계 · 정제" />
            <Arrow />
            <PipelineStep label="모델 학습" sub="XGBoost · LightGBM" />
            <Arrow />
            <PipelineStep label="예측" sub="매출 · 수요" accent />
            <Arrow />
            <PipelineStep label="해석" sub="SHAP value" accent />
          </div>
        </div>

        {/* PROJECTS */}
        <div className="mt-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Projects</p>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">BBQ 매장별 채널 매출 예측</h3>
              <p className="mt-1 text-sm text-subtext">
                배달 · 픽업 · 매장 내 식사, 채널별로 매출을 따로 예측한다.
                온라인 주문 데이터 + 오프라인 매장 데이터 + GIS 지리정보를 통합한 빅데이터 플랫폼.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">XGBoost · GIS · 빅데이터 플랫폼</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">포토이즘 — 연예인 IP 매출 예측</h3>
              <p className="mt-1 text-sm text-subtext">
                어떤 연예인 IP가 매출을 올리고, 어떤 요인이 IP 인기 상승/하락을 결정하는지.
                IP 계약 전에 데이터로 가치를 추정한다.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">AI 예측 · IP 가치 분석</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">GS슈퍼 — 매장 최적 입지 선정</h3>
              <p className="mt-1 text-sm text-subtext">
                내부 데이터 + 상권 특성을 반영해서 신규 매장 입지를 데이터로 최적화.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">계량경제학 · 상권분석</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. LLM Multi-Agent Simulation
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-24 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">2</span>
          <h2 className="text-xl font-bold text-text">LLM 멀티 에이전트 시뮬레이션</h2>
        </div>

        {/* WHY */}
        <div className="mt-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Why</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            마케팅 연구의 이상적인 방법은 필드 실험이다.
            실제 소비자에게 다른 조건을 주고, 행동 변화를 관찰하는 것.
            문제는 <strong className="text-text">비용이 수억 원이고, 시간은 수개월이 걸린다</strong>는 것이다.
            가격을 바꿔보고 싶으면 진짜 매장에서 진짜 가격을 바꿔야 한다.
            리뷰 정렬 정책을 실험하려면 진짜 플랫폼을 설득해야 한다.
            그래서 많은 연구가 시도조차 못 한다.
          </p>
          <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
            BDM Lab은 이 한계를 <strong className="text-text">LLM으로 돌파</strong>한다.
            GPT 기반 AI 에이전트에게 소비자, 매장, 플랫폼 역할을 부여하고
            가상의 마켓을 통째로 만든다.
            이 안에서 가격을 바꾸고, 정책을 실험하고, 경쟁을 시뮬레이션하면서
            소비자와 기업의 행동을 관찰한다.
            현실에서 수억 원짜리 실험을 가상에서 수십만 원에 돌린다.
          </p>
        </div>

        {/* HOW */}
        <div className="mt-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">How</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            네 단계로 진행한다.
            먼저 에이전트를 설계한다 — 각 AI에게 성격, 선호도, 예산, 과거 경험을 부여한다.
            그 다음 환경을 구축한다 — 레스토랑, 리뷰 시스템, 경쟁 구조 등 시장을 코드로 만든다.
            시뮬레이션을 돌리면 에이전트들이 <strong className="text-text">자율적으로 의사결정하고, 서로 상호작용</strong>한다.
            마지막으로 수십~수백 일치 데이터를 분석해서 시장 역학을 발견한다.
          </p>
        </div>

        {/* DIAGRAM — Agent Simulation */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface p-6">
          <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-widest text-muted">Multi-Agent Simulation Architecture</p>
          <div className="flex flex-col items-center gap-4">
            {/* Row 1: Agents */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
                <span className="text-sm">🧑‍💼</span>
                <div>
                  <p className="text-[11px] font-bold text-text">소비자 에이전트</p>
                  <p className="text-[9px] text-muted">성격 · 선호 · 예산 · 기억</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
                <span className="text-sm">🏪</span>
                <div>
                  <p className="text-[11px] font-bold text-text">매장 에이전트</p>
                  <p className="text-[9px] text-muted">메뉴 · 가격 · 전략 · 광고</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
                <span className="text-sm">📱</span>
                <div>
                  <p className="text-[11px] font-bold text-text">플랫폼 에이전트</p>
                  <p className="text-[9px] text-muted">리뷰 정렬 · 추천 · 정책</p>
                </div>
              </div>
            </div>
            <ArrowDown />
            {/* Row 2: Virtual Market */}
            <div className="w-full rounded-lg border-2 border-dashed border-accent/30 bg-accent-bg/50 px-4 py-3 text-center">
              <p className="text-xs font-bold text-accent">가상 마켓</p>
              <p className="mt-1 text-[10px] text-subtext">
                에이전트들이 자율적으로 선택 · 거래 · 리뷰 · 경쟁 · 학습
              </p>
            </div>
            <ArrowDown />
            {/* Row 3: Output */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-lg border border-accent bg-accent-bg px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-accent">시장 점유율</p>
              </div>
              <div className="rounded-lg border border-accent bg-accent-bg px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-accent">전환율 · 충성도</p>
              </div>
              <div className="rounded-lg border border-accent bg-accent-bg px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-accent">경쟁 역학 패턴</p>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="mt-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Projects</p>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">리뷰 정렬 정책과 소비자 의사결정</h3>
              <p className="mt-1 text-sm text-subtext">
                AI 고객 에이전트 200명이 반복적으로 레스토랑을 선택하는 가상 시장.
                리뷰를 최고 평점순으로 보여줄 때 vs. 최신순으로 보여줄 때,
                시장 점유율이 어떻게 달라지는지 시뮬레이션.
                동일 품질에서 정렬 정책만으로 20:1 매출 차이가 발생했다.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">GPT-4 · Beta-Bernoulli 모델 · 200명 × 20일</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">연우-한국투자증권 — 가상 건설 리스크 분석</h3>
              <p className="mt-1 text-sm text-subtext">
                BIM 품질에 따라 건설 프로젝트의 리스크가 어떻게 달라지는지
                가상공간에서 건물을 지어서 평가한다.
                27개 리스크 이벤트, 360일 시뮬레이션, 5단계 BIM 품질 비교.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">멀티 에이전트 · BIM · 리스크 정량화</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">LLM 경쟁 역학 시뮬레이션</h3>
              <p className="mt-1 text-sm text-subtext">
                GPT-4가 운영하는 두 레스토랑이 50명의 AI 고객을 두고 15일간 경쟁.
                가격 전략, 메뉴 차별화, 광고 — 에이전트들이 스스로 전략을 세우고 실행한다.
                경쟁이 품질을 올리는 메커니즘, 승자 독식 구조가 자연스럽게 나타났다.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">GPT-4 · 차별화 · 매튜 효과</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. Causal Inference
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-24 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">3</span>
          <h2 className="text-xl font-bold text-text">인과분석 (Causal Inference)</h2>
        </div>

        {/* WHY */}
        <div className="mt-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Why</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            마케팅에서 가장 위험한 착각은 상관관계를 인과관계로 오해하는 것이다.
            &ldquo;새벽배송을 도입한 지역에서 매출이 올랐다&rdquo; —
            하지만 그 지역이 원래 소비력이 높은 곳이었을 수 있다.
            <strong className="text-text">단순 비교로는 진짜 효과를 알 수 없다.</strong>
          </p>
          <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
            &ldquo;이 캠페인이 효과 있었나?&rdquo; &ldquo;이 서비스가 진짜 매출을 올렸나?&rdquo;
            — 기업이 가장 알고 싶은 질문이지만, 제대로 답하려면 단순 전후 비교가 아닌
            인과적 분석이 필요하다.
          </p>
        </div>

        {/* HOW */}
        <div className="mt-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">How</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            핵심 아이디어는 <strong className="text-text">&ldquo;비교 가능한 대조군&rdquo;</strong>을 찾는 것이다.
            처리를 받은 그룹과 비슷하지만 받지 않은 그룹을 찾아서,
            두 그룹의 변화 차이를 측정한다.
            이중차분법(Difference-in-Differences), 회귀불연속설계(RDD),
            도구변수법(IV) 등 준실험(quasi-experiment) 설계를 사용해서
            관찰 불가능한 교란 변수를 통제하고 순수한 인과 효과를 추정한다.
          </p>
        </div>

        {/* DIAGRAM — DID */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface p-6">
          <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-widest text-muted">Difference-in-Differences (이중차분법)</p>
          <div className="mx-auto max-w-md">
            {/* Graph-like visualization */}
            <div className="relative flex h-48 items-end">
              {/* Y axis */}
              <div className="absolute bottom-0 left-0 top-0 flex flex-col items-end justify-between pb-2 pr-3 pt-2">
                <span className="text-[9px] text-muted">높음</span>
                <span className="text-[9px] text-muted">매출</span>
                <span className="text-[9px] text-muted">낮음</span>
              </div>
              {/* Chart area */}
              <div className="ml-10 flex flex-1 items-end justify-around">
                {/* Before */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-20 w-10 rounded-t bg-accent/60" />
                      <span className="mt-1 text-[9px] text-accent">처리군</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-[72px] w-10 rounded-t bg-border" />
                      <span className="mt-1 text-[9px] text-muted">대조군</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-subtext">도입 전</span>
                </div>
                {/* Intervention line */}
                <div className="flex flex-col items-center justify-end self-stretch">
                  <div className="h-full w-px border-l border-dashed border-accent/40" />
                  <span className="mt-1 text-[9px] font-bold text-accent">처리</span>
                </div>
                {/* After */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-36 w-10 rounded-t bg-accent" />
                      <span className="mt-1 text-[9px] text-accent">처리군</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-[78px] w-10 rounded-t bg-border" />
                      <span className="mt-1 text-[9px] text-muted">대조군</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-subtext">도입 후</span>
                </div>
              </div>
            </div>
            {/* Explanation */}
            <div className="mt-4 rounded-lg bg-accent-bg/50 px-4 py-3 text-center">
              <p className="text-[11px] text-subtext">
                <strong className="text-accent">인과 효과</strong> = (처리군 변화) − (대조군 변화)
              </p>
              <p className="mt-1 text-[10px] text-muted">
                대조군도 자연적으로 변하므로, 단순 전후 비교가 아닌 &ldquo;차이의 차이&rdquo;를 측정
              </p>
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="mt-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Projects</p>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">새벽배송이 오프라인 리테일러에 미치는 영향</h3>
              <p className="mt-1 text-sm text-subtext">
                새벽배송 확산이 대형마트, 슈퍼마켓, 편의점의 생존에 실제로 영향을 주는지.
                소비자 구매 데이터로 이코노메트릭 모델을 검증했다.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">Quasi-experiment · 소비자 구매 데이터</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">모바일 채널이 오프라인·온라인 매출에 미치는 영향</h3>
              <p className="mt-1 text-sm text-subtext">
                슈퍼마켓의 모바일 앱 도입이 기존 오프라인과 온라인 채널의 매출을 어떻게 바꾸는지.
                채널 간 대체 효과와 보완 효과를 분리해서 추정했다.
              </p>
              <p className="mt-2 font-mono text-xs text-accent">Journal of Retailing (2021)</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">과거 소비 행태와 커머스 멤버십 가입</h3>
              <p className="mt-1 text-sm text-subtext">
                커머스 멤버십, 누가 가입하는가?
                4,597명의 카드 결제 데이터로 과거 소비 패턴이 가입을 예측하는지 검증.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">유통연구 (2025) · 계량경제학</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">AI 앱 사용이 소비자 구매행동에 미치는 영향</h3>
              <p className="mt-1 text-sm text-subtext">
                ChatGPT 등 AI 도구를 쓰는 소비자의 구매 행동이 달라지는지.
                사용 전후의 소비 패턴 변화를 인과적으로 분석.
              </p>
              <p className="mt-2 font-mono text-xs text-muted">진행중 · Causal inference</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Publications
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-20 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Publications</p>
        <h2 className="mt-3 text-xl font-bold text-text">주요 논문</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-subtext">
          <div className="border-l-2 border-accent pl-4">
            <p className="text-text">
              Lim, Boram, Ying Xie, and Ernan Haruvy (2021)
            </p>
            <p>&ldquo;The Impact of Mobile Channel Adoption on Physical and Online Channels&rdquo;</p>
            <p className="font-mono text-xs text-accent">Journal of Retailing</p>
          </div>
          <div className="border-l-2 border-border pl-4">
            <p className="text-text">
              Lim, Boram, Ernan Haruvy, and Peter T.L. Popkowski Leszczyc (2021)
            </p>
            <p>&ldquo;The Effect of Surcharge on Price in Online Auctions&rdquo;</p>
            <p className="font-mono text-xs text-muted">Electronic Commerce Research</p>
          </div>
          <div className="border-l-2 border-border pl-4">
            <p className="text-text">
              Hong, E., Park, J., &amp; Lim, Boram (2025)
            </p>
            <p>&ldquo;Exploring Perceived Value&apos;s Impact on Attitudes in Autonomous Public Transportation Services&rdquo;</p>
            <p className="font-mono text-xs text-muted">Total Quality Management &amp; Business Excellence</p>
          </div>
          <div className="border-l-2 border-border pl-4">
            <p className="text-text">
              임보람, 한상린, 박우현, 홍근혜 (2025)
            </p>
            <p>&ldquo;과거 소비 행태가 온라인 커머스 멤버십 가입에 미치는 영향&rdquo;</p>
            <p className="font-mono text-xs text-muted">유통연구</p>
          </div>
          <div className="border-l-2 border-border pl-4">
            <p className="text-text">
              김민혜, 이윤지, Khin Chan Myae Nyein, 임보람 (2025)
            </p>
            <p>&ldquo;식료품 리테일러의 새벽배송 서비스 제공 효과 분석&rdquo;</p>
            <p className="font-mono text-xs text-muted">서비스 연구</p>
          </div>
        </div>
      </section>
    </div>
  )
}
