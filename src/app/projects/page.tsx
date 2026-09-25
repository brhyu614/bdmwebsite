import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — BDM Lab',
  description: 'BDM Lab의 데이터 분석 프로젝트. AI 매출 예측, 인과분석, 소비자 행동 분석, 플랫폼 전략.',
  alternates: { canonical: '/projects' },
}

const PROJECTS = [
  {
    category: 'AI 매출 예측',
    title: 'ㅇㅇ셀프사진관 IP 콜라보 매출 예측',
    description: '연예인 462명의 협업 상품 매출을 주간 단위로 예측했습니다. 검증 건수 4,042건에서 적중률 97.6%를 기록했고, 상시 매장은 98.1%, 팝업 매장은 96.9%로 갈렸습니다. 협업 대상을 고를 때 어느 IP가 얼마를 벌어 줄지를 계약 전에 확인할 수 있습니다. 예측이 크게 빗나간 사례는 대부분 외부 행사나 방송 편성 때문이었고, 그 일정을 모형에 넣으면 급등까지 잡힙니다.',
    tags: ['XGBoost', 'LightGBM', 'Streamlit'],
    link: '/projects/photoism',
  },
  {
    category: 'AI 수요 예측 · 리테일',
    title: '슈퍼마켓 284개 매장 — 품목별, 채널별 수요 예측',
    description: '슈퍼마켓 284개 매장의 수요를 품목과 채널로 나눠 예측했습니다. 매장 단위 매출 예측에서 결정계수(R²) 0.983을 기록했습니다. 핵심 발견은 채널마다 관리 단위가 달라야 한다는 점입니다. 온라인 주문은 카테고리 단위로 묶어야 잘 맞고, 오프라인 구매는 세부 상품 단위로 내려가야 맞습니다. 온라인에서는 장바구니를 미리 짜 오는 반면, 매장에서는 진열대 앞에서 품목을 고르기 때문입니다. 이 연구는 Journal of Retailing and Consumer Services에 실렸습니다.',
    tags: ['XGBoost+LightGBM', 'SHAP', '품목별 수요 예측', '채널별 전략'],
    link: '/projects/grocery',
  },
  {
    category: 'AI 매출 예측 · 프랜차이즈',
    title: '치킨 프랜차이즈 349개 매장 — 채널별 매출 + 상권 분석',
    description: '치킨 프랜차이즈 349개 매장의 3년치 주간 매출을 채널별로 예측했습니다. 매장식사 채널에서 결정계수(R²) 0.96, 총 매출에서 0.80, 배달에서 0.78, 포장에서 0.67을 기록했습니다. 채널마다 매출을 움직이는 변수가 전혀 달랐습니다. 배달 매출은 리뷰 수와 1인 가구 비중이 밀어 올리는 반면, 매장식사 매출은 입지와 주변 경쟁 밀도가 결정합니다. 같은 매장이라도 어느 채널을 키울지에 따라 봐야 할 지표가 달라집니다.',
    tags: ['XGBoost', '배달 플랫폼', '자기잠식', '리뷰 분석'],
    link: '/projects/bbq',
  },
  {
    category: 'AI 예측 · 인구',
    title: '전국 3,518개 행정동 — 5년 후 인구 변화 예측',
    description: '전국 행정동 3,518개의 5년 후 인구를 예측했습니다. 20년치 인구·산업·주거 자료에서 변수 461개를 만들어 학습시켰습니다. 전체 인구가 줄어드는 곳과 청년층만 빠져나가는 곳은 다른 신호를 냅니다. 매장을 여는 판단에서 지금의 유동 인구보다 중요한 것은 5년 뒤 그 동네에 누가 남아 있는지입니다. SHAP로 어떤 변수가 감소를 밀어붙였는지까지 분해했습니다.',
    tags: ['XGBoost', 'SHAP', '인구 감소', '상권 리스크'],
    link: '/projects/population',
  },
  {
    category: '인과분석',
    title: '새벽배송의 실제 매출 효과 검증',
    description: '새벽배송 도입이 실제로 매출을 늘렸는지를 소비자 920명의 구매 기록으로 검증했습니다. 이중차분법(DID)으로 도입 전후를 비교한 결과, 효과는 모든 고객에게 나타나지 않았습니다. 같은 브랜드의 오프라인 매장이 가까이 있는 고객에게서만 지출이 78% 늘었고, 매장이 없는 지역의 고객에게서는 효과가 잡히지 않았습니다. 새벽배송이 단독으로 작동하는 서비스가 아니라 오프라인 매장과 함께 작동한다는 뜻입니다.',
    tags: ['이중차분법', '옴니채널', '식료품 리테일'],
    link: '/articles/2026-02-26-dawn-delivery-effect',
  },
  {
    category: '플랫폼 전략',
    title: '배달앱 자기잠식(Cannibalization) 분석',
    description: '가맹점을 새로 열면 기존 매장의 매출이 얼마나 줄어드는지를 치킨 매장 349개 자료로 측정했습니다. 경쟁 브랜드가 근처에 들어올 때보다 같은 브랜드의 다른 매장이 들어올 때 배달 매출이 더 크게 줄었습니다. 감소폭은 100미터 이내에서 가장 컸습니다. 출점 계획에서 경쟁사 위치만 보고 자사 매장 간 거리를 보지 않으면 본사 전체 매출이 늘지 않은 채 가맹점 수만 늘어납니다.',
    tags: ['자기잠식', '배달 플랫폼', '출점 전략'],
    link: '/articles/2026-03-03-intra-brand-cannibalization',
  },
  {
    category: '소비자 행동 분석',
    title: '커머스 멤버십 가입 동인 분석',
    description: '커머스 멤버십에 누가 가입하는지를 소비자 4,597명의 4년치 카드 결제 기록으로 분석했습니다. 영상 구독 서비스를 끼워 주는 방식은 가입을 끌어내지 못했습니다. 가입을 결정한 것은 그 플랫폼에서 이미 얼마나 쓰고 있었는지였습니다. 멤버십은 새 고객을 데려오는 수단이 아니라 기존 고객의 이탈을 막는 수단으로 작동합니다. 이 연구는 유통연구에 실렸습니다.',
    tags: ['로지스틱 회귀', '구독 모델', '결제 데이터'],
    link: '/articles/2026-02-25-commerce-membership',
  },
  {
    category: 'AI · LLM',
    title: 'LLM 멀티에이전트 소비자 의사결정 모델링',
    description: '플랫폼이 리뷰를 사람 대신 대규모 언어 모형에게 요약시키면 어떤 가게가 위로 올라가는지를 시뮬레이션으로 확인했습니다. Yelp 공개 자료로 리뷰 노출 정책을 바꿔 가며 돌린 결과, 높은 평점부터 보여 주는 정책과 무작위로 보여 주는 정책의 효과가 집단에 따라 갈렸습니다. 리뷰를 의심하며 읽는 집단에서는 효과의 부호가 뒤집혔습니다. 에이전트의 답은 실제 이용자 행동과 대조해 검증했습니다.',
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

      {/* 수행 과제 전체 목록 */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">수행한 기업·기관 과제</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2.5 pr-4 font-bold text-text">의뢰처</th>
                <th className="py-2.5 pr-4 font-bold text-text">과제</th>
                <th className="py-2.5 font-bold text-text">방법</th>
              </tr>
            </thead>
            <tbody className="text-subtext">
              {[
                ['ㅇㅇ슈퍼 체인', '매장 최적 입지 선정 모형 개발', '계량경제 모형, 상권 특성 반영'],
                ['ㅇㅇ치킨 프랜차이즈', '349개 매장의 채널별 매출 예측 시스템', 'XGBoost, 지리정보 결합'],
                ['ㅇㅇ셀프사진관', '연예인 IP별 매출 예측과 인기 변동 요인 분해', 'XGBoost, LightGBM'],
                ['ㅇㅇ슈퍼 체인', '284개 매장의 품목별·채널별 수요 예측', 'XGBoost, SHAP 설명'],
                ['유통 업계', '새벽배송 확산이 오프라인 업태에 미친 영향 분석', '이중차분법'],
                ['ㅇㅇ슈퍼 체인', '새벽배송 진입의 수익성과 사업 타당성 분석', '비용·수익 구조 분석'],
                ['ㅇㅇ건설', 'LLM 에이전트를 이용한 가상 공간 설계', 'LLM 멀티에이전트'],
                ['ㅇㅇ스타트업', '인터뷰·설문 조사와 보고서 작성 자동화', 'LLM 파이프라인'],
                ['한국은행 경기본부', '경기 지역 자영업의 회복 격차 분석', '업종·상권별 요인 분해'],
              ].map(([who, what, how]) => (
                <tr key={what} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-text">{who}</td>
                  <td className="py-2.5 pr-4">{what}</td>
                  <td className="py-2.5 font-mono text-xs text-muted">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Projects — 이미지 전면 */}
      <section className="mx-auto mt-16 max-w-[720px]">
        <h2 className="mb-6 text-xl font-bold text-text">상세 분석 기록</h2>
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
