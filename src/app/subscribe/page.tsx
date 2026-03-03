import type { Metadata } from 'next'
import NewsletterCTA from '@/components/NewsletterCTA'

export const metadata: Metadata = {
  title: '구독',
  description: '빅데이터 마케팅 랩의 새 아티클을 이메일로 받아보세요.',
}

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[720px]">
        <h1 className="text-3xl font-bold text-text">구독</h1>
        <p className="mt-3 font-serif text-lg leading-relaxed text-subtext">
          새 아티클이 발행되면 이메일로 알려드립니다.
          과장 없는 분석, 근거 있는 인사이트를 정기적으로 받아보세요.
        </p>

        <div className="mt-10">
          <NewsletterCTA />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-text">무엇을 받게 되나요?</h2>
          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <span className="mt-1 text-accent">01</span>
              <div>
                <h3 className="font-bold text-text">알고리즘 디코드</h3>
                <p className="text-sm text-subtext">
                  플랫폼 알고리즘과 추천 시스템의 작동 원리를 데이터 기반으로 분석합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-1 text-accent">02</span>
              <div>
                <h3 className="font-bold text-text">랩 리서치</h3>
                <p className="text-sm text-subtext">
                  BDM Lab이 직접 수행한 연구와 기업 프로젝트의 결과를 공유합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-1 text-accent">03</span>
              <div>
                <h3 className="font-bold text-text">한계를 밝히는 분석</h3>
                <p className="text-sm text-subtext">
                  모든 분석에는 한계가 있습니다. 우리는 그 한계를 숨기지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
