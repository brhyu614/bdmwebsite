import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Research',
  description: '빅데이터마케팅 랩(BDM Lab) 연구 영역. AI 매출 예측, LLM 멀티 에이전트 시뮬레이션, 인과분석 기반 마케팅 연구.',
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

      {/* 1. AI/ML Prediction */}
      <section className="mx-auto mt-16 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">1</span>
          <h2 className="text-xl font-bold text-text">AI/ML 기반 예측</h2>
        </div>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          XGBoost, LightGBM 등 머신러닝 알고리즘으로 기업의 미래를 예측한다.
          &ldquo;이 매장 다음 달 매출이 얼마일까?&rdquo; &ldquo;이 IP는 오를까 내릴까?&rdquo;
          — 이런 질문에 데이터로 답을 만든다.
        </p>
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-text">BBQ 매장별 채널 매출 예측</h3>
                <p className="mt-1 text-sm text-subtext">
                  배달 · 픽업 · 매장 내 식사, 채널별로 매출을 따로 예측한다.
                  온라인 주문 데이터 + 오프라인 매장 데이터 + GIS 지리정보를 통합한 빅데이터 플랫폼.
                </p>
              </div>
            </div>
            <p className="mt-2 font-mono text-xs text-muted">XGBoost · GIS · 빅데이터 플랫폼</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">포토이즘 — 연예인 IP 매출 예측</h3>
            <p className="mt-1 text-sm text-subtext">
              어떤 연예인 IP가 매출을 올리고, 어떤 요인이 IP 인기 상승/하락을 결정하는지 분석.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">AI 예측 · IP 가치 분석</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">GS슈퍼 — 매장 최적 입지 선정</h3>
            <p className="mt-1 text-sm text-subtext">
              GS슈퍼 내부 데이터 + 상권 특성을 반영해서 신규 매장 입지를 데이터로 최적화.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">계량경제학 · 상권분석 · 입지 최적화</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">AI 텍스트 분석</h3>
            <p className="mt-1 text-sm text-subtext">
              리뷰, 댓글, 소셜 미디어 텍스트에서 소비자 감정과 의견을 자동으로 추출하고 분석.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">NLP · 감성분석 · 토픽모델링</p>
          </div>
        </div>
      </section>

      {/* 2. LLM Multi-Agent */}
      <section className="mx-auto mt-16 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">2</span>
          <h2 className="text-xl font-bold text-text">LLM 멀티 에이전트 시뮬레이션</h2>
        </div>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          기존 필드 실험의 가장 큰 한계는 비용이다.
          실제 소비자를 모으고, 실제 매장에서 실험하고, 실제 데이터를 수집하려면
          시간과 돈이 엄청나게 든다. 그래서 많은 연구가 시도조차 못 한다.
        </p>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          BDM Lab은 이 한계를 LLM으로 돌파한다.
          GPT 기반 AI 에이전트에게 소비자 역할, 매장 역할, 플랫폼 역할을 부여하고
          <strong className="text-text">가상의 마켓을 통째로 만든다.</strong>{' '}
          이 안에서 가격을 바꿔보고, 정책을 실험하고, 경쟁 상황을 시뮬레이션하면서
          소비자와 기업의 행동을 관찰한다.
          현실에서 수억 원짜리 실험을 가상에서 수십만 원에 돌리는 것이다.
        </p>
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">리뷰 정렬 정책과 소비자 의사결정</h3>
            <p className="mt-1 text-sm text-subtext">
              AI 고객 에이전트 200명이 반복적으로 레스토랑을 선택하는 가상 시장.
              리뷰를 최고 평점순으로 보여줄 때 vs. 최신순으로 보여줄 때,
              시장 점유율이 어떻게 달라지는지 시뮬레이션한다.
              동일 품질에서 정렬 정책만으로 20:1 매출 차이가 발생했다.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">GPT-4 에이전트 · Beta-Bernoulli 모델 · 200명 × 20일</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">연우-한국투자증권 — 가상 건설 리스크 분석</h3>
            <p className="mt-1 text-sm text-subtext">
              BIM(Building Information Modeling) 품질에 따라 건설 프로젝트의 리스크가 어떻게 달라지는지
              가상공간에서 건물을 지어서 평가한다.
              27개 리스크 이벤트, 360일 시뮬레이션, 5단계 BIM 품질 수준 비교.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">멀티 에이전트 · BIM · 리스크 정량화</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">LLM 경쟁 역학 시뮬레이션</h3>
            <p className="mt-1 text-sm text-subtext">
              GPT-4 에이전트가 운영하는 두 레스토랑이 50명의 AI 고객을 두고 경쟁.
              가격 전략, 메뉴 차별화, 광고 — 에이전트들이 스스로 전략을 세우고 실행한다.
              경쟁이 제품 품질을 올리는 메커니즘, 승자 독식 구조가 자연스럽게 드러난다.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">GPT-4 에이전트 · 차별화 · 매튜 효과</p>
          </div>
        </div>
      </section>

      {/* 3. Causal Inference */}
      <section className="mx-auto mt-16 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">3</span>
          <h2 className="text-xl font-bold text-text">인과분석 (Causal Inference)</h2>
        </div>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          &ldquo;A를 했더니 B가 올랐다&rdquo;는 상관관계일 뿐이다.
          A가 <em>진짜로</em> B를 올렸는지 밝히려면 인과분석이 필요하다.
          BDM Lab은 준실험(quasi-experiment) 설계와 계량경제학 모델로 마케팅의 인과관계를 검증한다.
        </p>
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">새벽배송이 오프라인 리테일러에 미치는 영향</h3>
            <p className="mt-1 text-sm text-subtext">
              새벽배송 확산이 대형마트, 중소형 슈퍼마켓, 편의점의 생존에 실제로 영향을 주는지.
              소비자 구매 데이터로 이코노메트릭 모델을 검증했다.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">Quasi-experiment · 소비자 구매 데이터</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">모바일 채널이 오프라인·온라인 매출에 미치는 영향</h3>
            <p className="mt-1 text-sm text-subtext">
              슈퍼마켓의 모바일 앱 도입이 기존 오프라인과 온라인 채널의 매출을 어떻게 바꾸는지 분석.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">Journal of Retailing (2021)</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">과거 소비 행태와 커머스 멤버십 가입</h3>
            <p className="mt-1 text-sm text-subtext">
              쿠팡 로켓와우 같은 커머스 멤버십, 누가 가입하는가?
              4,597명의 카드 결제 데이터로 과거 소비 패턴이 멤버십 가입을 예측하는지 검증.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">유통연구 (2025) · 계량경제학</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">AI 앱 사용이 소비자 구매행동에 미치는 영향</h3>
            <p className="mt-1 text-sm text-subtext">
              ChatGPT 등 AI 앱을 사용하는 소비자의 구매 행동이 달라지는지.
              AI 도구 사용 전후의 소비 패턴 변화를 인과적으로 분석.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">진행중 · Causal inference</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">소셜 미디어 사용과 오프라인 대인관계</h3>
            <p className="mt-1 text-sm text-subtext">
              소셜 미디어 사용 시간과 오프라인 대인관계 사이의 인과 관계.
              &ldquo;쉬어가기&rdquo; 알림이 SNS 중독을 줄이는지도 함께 연구.
            </p>
            <p className="mt-2 font-mono text-xs text-muted">진행중 · Field experiment</p>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
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
