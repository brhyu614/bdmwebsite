import type { Metadata } from 'next'
import Image from 'next/image'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Research',
  description: '빅데이터마케팅 랩(BDM Lab) 연구 영역. 인과분석, AI 예측, LLM 멀티 에이전트 시뮬레이션 기반 마케팅 연구.',
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
      </section>

      {/* Lab Photo */}
      <div className="mx-auto mt-8 max-w-[720px] overflow-hidden rounded-2xl">
        <Image
          src="/images/lab-photo.jpg"
          alt="빅데이터마케팅 랩 연구실"
          width={720}
          height={480}
          className="w-full object-cover"
          priority
        />
      </div>

      {/* Philosophy */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <div className="space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            데이터 분석에는 두 가지 질문이 있다.
          </p>
          <p>
            첫째, <strong className="text-text">&ldquo;무엇이 일어날까?&rdquo;</strong>{' '}
            — 머신러닝이 잘하는 일이다. 과거 패턴을 학습해서 미래를 예측한다.
            내일 매출이 얼마일지, 어떤 고객이 이탈할지. 유용하다.
            하지만 이건 <em>상관관계</em>의 세계다.
            &ldquo;A와 B가 함께 움직인다&rdquo;는 걸 발견할 뿐,
            A가 B를 <em>만들었는지</em>는 알 수 없다.
          </p>
          <p>
            둘째, <strong className="text-text">&ldquo;왜 일어났을까?&rdquo;</strong>{' '}
            — 이건 훨씬 어렵다.
            광고를 했더니 매출이 올랐다. 광고 <em>때문</em>일까, 성수기라서 어차피 올랐을까?
            새벽배송이 시작되고 동네 슈퍼가 문을 닫았다. 새벽배송 <em>때문</em>일까, 인구 변화 때문일까?
            이게 <em>인과관계</em>의 질문이다.
            대부분의 데이터 분석은 첫 번째 질문에서 멈춘다.{' '}
            <strong className="text-text">BDM Lab은 두 번째 질문에 답한다.</strong>
          </p>
          <p>
            그리고 세 번째 질문도 던진다 —{' '}
            <strong className="text-text">&ldquo;만약 ~했다면 어떻게 됐을까?&rdquo;</strong>{' '}
            현실에서는 시간을 되돌릴 수 없다. 하지만 AI로 가상 세계를 만들면,
            인과관계와 AI를 결합해서 현실에서 불가능한 실험을 돌릴 수 있다.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          1. Causal Inference
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-20 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">1</span>
          <h2 className="text-xl font-bold text-text">인과분석 (Causal Inference)</h2>
        </div>

        {/* WHY */}
        <div className="mt-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Why</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            마케팅에서 가장 위험한 착각은 상관관계를 인과관계로 오해하는 것이다.
            &ldquo;이 캠페인 이후 매출이 20% 올랐다&rdquo; — 캠페인 때문일까?
            같은 시기에 경쟁사가 가격을 올렸거나, 계절 효과이거나, 아니면 그냥 우연일 수 있다.
            <strong className="text-text"> 단순 전후 비교로는 진짜 효과를 절대 알 수 없다.</strong>
          </p>
          <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
            인과분석은 &ldquo;만약 그 캠페인을 하지 않았어도 매출이 올랐을까?&rdquo;라는
            반사실적(counterfactual) 질문에 답하는 방법론이다.
            기업이 가장 알고 싶지만 제대로 답하기 가장 어려운 질문.
            <strong className="text-text">BDM Lab의 연구 핵심이 여기에 있다.</strong>
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
          <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
            여기에 <strong className="text-text">구조 모델링(Structural Modeling)</strong>도 함께 쓴다.
            New Empirical IO라고도 불리는 이 접근법은
            소비자와 기업의 의사결정 구조를 경제학 이론으로 모형화하고,
            데이터로 추정한다. 단순히 &ldquo;무엇이 일어났는지&rdquo;가 아니라
            &ldquo;왜, 어떤 메커니즘으로 일어나는지&rdquo;까지 밝힐 수 있다.
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

        <div className="mt-6">
          <a href="/projects" className="text-sm text-accent hover:underline">관련 프로젝트 보기 →</a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. AI/ML Prediction
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-24 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">2</span>
          <h2 className="text-xl font-bold text-text">AI/ML 기반 예측</h2>
        </div>

        {/* WHY */}
        <div className="mt-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Why</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            인과관계를 모른다고 예측을 못 하는 건 아니다.
            &ldquo;왜&rdquo;를 몰라도 &ldquo;무엇이 일어날지&rdquo;는 데이터 패턴만으로 추정할 수 있다.
            신규 매장을 어디에 열지, 다음 달 재고를 얼마나 준비할지,
            어떤 연예인 IP가 매출을 올릴지 —
            <strong className="text-text">정확히 예측하면 기업에겐 바로 돈이 된다.</strong>
          </p>
          <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
            전통적으로는 담당자의 경험과 직감에 의존했다.
            문제는 변수가 수십 개만 넘어가도 사람의 머리로는 최적 답을 찾을 수 없다는 것이다.
            머신러닝은 이 한계를 넘는다.
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

        <div className="mt-6">
          <a href="/projects" className="text-sm text-accent hover:underline">관련 프로젝트 보기 →</a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. LLM Multi-Agent Simulation
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto mt-24 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">3</span>
          <h2 className="text-xl font-bold text-text">LLM 멀티 에이전트 시뮬레이션</h2>
        </div>

        {/* WHY */}
        <div className="mt-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">Why</p>
          <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
            인과관계를 밝히는 가장 이상적인 방법은 실험이다.
            조건을 바꿔보고, 결과가 달라지는지 직접 관찰하는 것.
            문제는 <strong className="text-text">현실 실험은 비용이 수억 원이고, 시간은 수개월이 걸린다</strong>는 것이다.
            가격을 바꿔보려면 진짜 매장에서 진짜 가격을 바꿔야 하고,
            리뷰 정렬 정책을 실험하려면 진짜 플랫폼을 설득해야 한다.
            그래서 많은 연구가 시도조차 못 한다.
          </p>
          <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
            BDM Lab은 이 한계를 <strong className="text-text">인과분석 + AI의 결합</strong>으로 돌파한다.
            GPT 기반 AI 에이전트에게 소비자, 매장, 플랫폼 역할을 부여하고
            가상의 마켓을 통째로 만든다.
            이 안에서 가격을 바꾸고, 정책을 실험하고, 경쟁을 시뮬레이션하면서
            소비자와 기업의 행동을 관찰하고, 인과관계를 검증한다.
            현실에서 수억 원짜리 실험을, 가상에서 수십만 원에 돌린다.
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
            마지막으로 수십~수백 일치 데이터를 분석해서
            &ldquo;이 정책이 시장을 어떻게 바꾸는지&rdquo; 인과적 메커니즘을 발견한다.
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
                <p className="text-[11px] font-bold text-accent">인과 효과 검증</p>
              </div>
              <div className="rounded-lg border border-accent bg-accent-bg px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-accent">시장 역학 패턴</p>
              </div>
              <div className="rounded-lg border border-accent bg-accent-bg px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-accent">정책 시뮬레이션</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a href="/projects" className="text-sm text-accent hover:underline">관련 프로젝트 보기 →</a>
        </div>
      </section>

    </div>
  )
}
