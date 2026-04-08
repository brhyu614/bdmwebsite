import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — BDM Lab',
  description: 'BDM Lab의 데이터 분석 프로젝트. AI 매출 예측, 인과분석, 소비자 행동 분석, 플랫폼 전략 자문.',
}

const PROJECTS = [
  {
    category: 'AI 매출 예측 · 기업 납품',
    title: '포토이즘 IP 협업 수익 예측 시스템',
    description: '462명 연예인, 4,042건 검증, 97.6% 적중률. 셀럽/IP별 콜라보 매출을 예측하는 AI 시스템을 구축하여 기업에 납품. 예측 웹앱 + 분석 보고서 + 데이터 파이프라인 포함.',
    tags: ['XGBoost', 'LightGBM', 'Streamlit', '예측 시스템 납품'],
    link: '/projects/photoism',
  },
  {
    category: 'AI 매출 예측 · 학술 논문',
    title: '프랜차이즈 매장별·채널별 매출 예측',
    description: '치킨 프랜차이즈 349개 매장의 일간 거래 데이터와 리뷰 10만 건 분석. 배달·포장·매장 식사 채널별로 매출을 결정하는 변수가 완전히 다르다는 것을 발견. JRCS 게재.',
    tags: ['XGBoost', '배달 플랫폼', '채널별 분석', 'JRCS'],
    link: '/articles/2026-03-06-forecasting-restaurant-sales',
  },
  {
    category: '인과분석',
    title: '새벽배송의 실제 매출 효과 검증',
    description: '920명의 실제 구매 데이터를 이중차분법(DID)으로 분석. 새벽배송 효과는 해당 브랜드의 오프라인 매장이 근처에 있는 고객에서만 유의 — 지출 78% 증가 vs. 효과 없음.',
    tags: ['이중차분법', '옴니채널', '식료품 리테일'],
    link: '/articles/2026-02-26-dawn-delivery-effect',
  },
  {
    category: '소비자 행동 분석',
    title: '커머스 멤버십 가입 동인 분석',
    description: '4,597명의 4년간 카드 결제 데이터 분석. OTT 번들링은 멤버십 가입을 이끌지 못한다. 가입을 결정하는 건 이미 해당 플랫폼에서 많이 쓰고 있는 사람인가의 여부.',
    tags: ['로지스틱 회귀', '구독 모델', '결제 데이터'],
    link: '/articles/2026-02-25-commerce-membership',
  },
  {
    category: '플랫폼 전략',
    title: '배달앱 자기잠식(Cannibalization) 분석',
    description: '349개 치킨 매장 데이터에서, 배달 매출에 타 브랜드보다 자사 브랜드의 다른 매장이 더 큰 매출 감소를 유발한다는 것을 발견. 100m 이내에서 가장 강력.',
    tags: ['자기잠식', '배달 플랫폼', '출점 전략'],
    link: '/articles/2026-03-03-intra-brand-cannibalization',
  },
  {
    category: 'AI · LLM',
    title: 'LLM 멀티에이전트 소비자 의사결정 모델링',
    description: 'LLM 기반 멀티에이전트 시뮬레이션으로 소비자 리뷰 정책 변화의 영향을 분석. AI 에이전트가 실제 소비자 행동을 모사하는 차세대 분석 방법론.',
    tags: ['LLM', '멀티에이전트', '시뮬레이션', '리뷰 정책'],
  },
]

const CAPABILITIES = [
  {
    title: 'AI 기반 매출 예측',
    description: '수요, 매출, 이탈을 예측하는 머신러닝 모델 구축. 채널별, 지역별, 시간별 세분화.',
  },
  {
    title: '인과분석',
    description: '마케팅 캠페인, 신규 서비스, 정책 변화의 실제 효과를 검증. DID, IV, RCT 설계.',
  },
  {
    title: '소비자 데이터 분석',
    description: '결제 데이터, 리뷰, 행동 로그 기반 소비자 세그멘테이션 및 의사결정 분석.',
  },
  {
    title: '전략 자문 · 강연',
    description: '유통, 플랫폼, 구독 모델 전략. 기업 맞춤 워크숍 및 교육.',
  },
]

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Projects</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          데이터로 의사결정을 바꿉니다.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          BDM Lab은 기업의 실제 데이터를 분석하여, 직관이 아닌 근거에 기반한 의사결정을 돕습니다.
        </p>
      </section>

      {/* Capabilities */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">What We Do</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-bold text-text">{cap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-subtext">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Past Projects */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Recent Projects</p>
        <div className="mt-6 space-y-8">
          {PROJECTS.map((project) => (
            <a key={project.title} href={project.link} className="group block">
              <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
                  {project.category}
                </p>
                <h3 className="mt-2 text-lg font-bold text-text group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-subtext">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-surface-alt px-2.5 py-0.5 font-mono text-[10px] text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <div className="mt-6">
          <p className="text-sm text-muted">
            brlim@hanyang.ac.kr
          </p>
        </div>
      </section>

    </div>
  )
}
