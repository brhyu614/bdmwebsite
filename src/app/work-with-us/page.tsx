import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work With Us',
  description: 'AI 예측, 인과분석, 교육 프로그램 등 빅데이터 마케팅 랩과 함께 일하세요.',
}

const services = [
  {
    title: 'AI 예측 모델',
    description:
      '수요 예측, 매출 예측, 고객 이탈 예측 등 비즈니스 의사결정에 필요한 머신러닝 예측 모델을 개발합니다.',
    examples: ['신규 매장 매출 예측', '상품 수요 예측', '고객 생애가치(LTV) 예측'],
  },
  {
    title: '인과분석',
    description:
      '마케팅 캠페인, 가격 변경, 프로모션 등의 실제 효과를 측정합니다. 상관관계가 아닌 인과관계를 밝힙니다.',
    examples: ['캠페인 효과 측정', '가격 탄력성 분석', 'A/B 테스트 설계 및 분석'],
  },
  {
    title: '강연 · 워크숍 · 교육',
    description:
      '기업 맞춤 교육 프로그램을 제공합니다. 데이터 기반 의사결정, AI 활용, 마케팅 분석 등의 주제를 다룹니다.',
    examples: ['임원 대상 AI 트렌드 강연', '마케팅팀 데이터 분석 워크숍', '대학/기관 초청 강연'],
  },
]

export default function WorkWithUsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[720px]">
        {/* Hero */}
        <h1 className="text-3xl font-bold text-text">Work With Us</h1>
        <p className="mt-3 font-serif text-lg leading-relaxed text-subtext">
          데이터로 더 나은 의사결정을 만들 수 있도록 돕겠습니다.
          연구 기반의 분석, 과장 없는 결과를 약속합니다.
        </p>

        {/* Services */}
        <div className="mt-10 space-y-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-border p-6"
            >
              <h2 className="text-xl font-bold text-text">{service.title}</h2>
              <p className="mt-2 font-serif text-base leading-relaxed text-subtext">
                {service.description}
              </p>
              <div className="mt-4">
                <p className="text-sm font-medium text-text">예시:</p>
                <ul className="mt-1 space-y-1">
                  {service.examples.map((ex) => (
                    <li
                      key={ex}
                      className="text-sm text-subtext before:mr-2 before:text-accent before:content-['·']"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <section className="mt-12 rounded-xl bg-accent-bg p-8">
          <h2 className="text-xl font-bold text-text">문의하기</h2>
          <p className="mt-2 text-sm text-subtext">
            프로젝트 문의, 강연 의뢰, 협업 제안 등 무엇이든 편하게 연락해 주세요.
          </p>
          <a
            href="mailto:contact@bigdatamarketinglab.com"
            className="mt-4 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
          >
            이메일 보내기
          </a>
          <p className="mt-3 text-xs text-muted">
            contact@bigdatamarketinglab.com
          </p>
        </section>
      </div>
    </div>
  )
}
