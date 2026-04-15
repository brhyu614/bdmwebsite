import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — BDM Lab',
  description: 'BDM Lab의 데이터 분석 프로젝트. AI 매출 예측, 인과분석, 소비자 행동 분석, 플랫폼 전략.',
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
    category: 'AI 수요 예측 · 리테일',
    title: '슈퍼마켓 284개 매장 — 품목별, 채널별 수요 예측',
    description: '매장별 매출을 98% 정확도로 예측. 온라인은 카테고리 단위로, 오프라인은 세부 상품 단위로 관리해야 한다는 것을 발견.',
    tags: ['XGBoost+LightGBM', 'SHAP', '품목별 수요 예측', '채널별 전략'],
    link: '/projects/grocery',
  },
  {
    category: 'AI 매출 예측 · 프랜차이즈',
    title: '치킨 프랜차이즈 349개 매장 — 채널별 매출 + 상권 분석',
    description: '배달·포장·매장 식사 채널별로 매출을 결정하는 변수가 완전히 다르다는 것을 발견. 배달은 리뷰와 1인 가구, 매장식사는 입지와 경쟁. JRCS 게재.',
    tags: ['XGBoost', '배달 플랫폼', '자기잠식', '리뷰 분석'],
    link: '/projects/bbq',
  },
  {
    category: 'AI 예측 · 인구',
    title: '전국 3,518개 행정동 — 5년 후 인구 변화 예측',
    description: '어떤 동네의 인구가 줄어들지, 청년이 떠나는 곳은 어디인지를 5년 전에 예측. 20년간의 인구·산업·주거 데이터.',
    tags: ['XGBoost', 'SHAP', '인구 감소', '상권 리스크'],
    link: '/projects/population',
  },
  {
    category: '인과분석',
    title: '새벽배송의 실제 매출 효과 검증',
    description: '920명의 실제 구매 데이터를 이중차분법(DID)으로 분석. 새벽배송 효과는 해당 브랜드의 오프라인 매장이 근처에 있는 고객에서만 유의 — 지출 78% 증가 vs. 효과 없음.',
    tags: ['이중차분법', '옴니채널', '식료품 리테일'],
    link: '/articles/2026-02-26-dawn-delivery-effect',
  },
  {
    category: '플랫폼 전략',
    title: '배달앱 자기잠식(Cannibalization) 분석',
    description: '349개 치킨 매장 데이터에서, 배달 매출에 타 브랜드보다 자사 브랜드의 다른 매장이 더 큰 매출 감소를 유발한다는 것을 발견. 100m 이내에서 가장 강력.',
    tags: ['자기잠식', '배달 플랫폼', '출점 전략'],
    link: '/articles/2026-03-03-intra-brand-cannibalization',
  },
  {
    category: '소비자 행동 분석',
    title: '커머스 멤버십 가입 동인 분석',
    description: '4,597명의 4년간 카드 결제 데이터 분석. OTT 번들링은 멤버십 가입을 이끌지 못한다. 가입을 결정하는 건 이미 해당 플랫폼에서 많이 쓰고 있는 사람인가의 여부.',
    tags: ['로지스틱 회귀', '구독 모델', '결제 데이터'],
    link: '/articles/2026-02-25-commerce-membership',
  },
  {
    category: 'AI · LLM',
    title: 'LLM 멀티에이전트 소비자 의사결정 모델링',
    description: 'LLM 기반 멀티에이전트 시뮬레이션으로 소비자 리뷰 정책 변화의 영향을 분석. AI 에이전트가 실제 소비자 행동을 모사하는 차세대 분석 방법론.',
    tags: ['LLM', '멀티에이전트', '시뮬레이션', '리뷰 정책'],
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
          AI 매출 예측 · 수요 예측 · 인과분석 · 소비자 행동 분석 · 상권 분석 · 인구 예측
        </p>
      </section>

      {/* Projects — 이미지 전면 */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <div className="space-y-10">
          {PROJECTS.map((project) => (
            <a key={project.title} href={project.link} className="group block">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40">
                <div className="p-6">
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
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="text-sm text-muted">brlim@hanyang.ac.kr</p>
      </section>

    </div>
  )
}
