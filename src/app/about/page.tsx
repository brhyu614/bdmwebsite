import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { AUTHOR_NAME, INSTAGRAM_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About',
  description: '빅데이터 마케팅 랩(BDM Lab)과 연구 철학을 소개합니다.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd type="person" />
      <JsonLd type="organization" />
      {/* Professor Section */}
      <section className="mx-auto max-w-[720px]">
        <div className="flex items-start gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent-bg text-3xl font-bold text-accent">
            {AUTHOR_NAME.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text">{AUTHOR_NAME}</h1>
            <p className="mt-1 text-lg text-subtext">교수 · 빅데이터 마케팅 랩</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 font-serif text-base leading-relaxed text-text">
          <p>
            마케팅에서 &ldquo;감&rdquo;이라는 단어가 너무 자주 쓰인다고 생각합니다.
            감은 경험에서 나오지만, 경험은 편향을 동반합니다.
            데이터는 그 편향을 교정하는 도구입니다.
          </p>
          <p>
            빅데이터 마케팅 랩(BDM Lab)은 이 믿음에서 출발했습니다.
            플랫폼 알고리즘이 어떻게 작동하는지, 마케팅 캠페인이 실제로 효과가 있었는지,
            매출 예측 모델은 어디까지 정확한지 — 이런 질문에 데이터로 답하는 것이 우리의 일입니다.
          </p>
          <p>
            과장하지 않습니다. 분석의 한계를 솔직히 밝힙니다.
            &ldquo;이 방법으로는 여기까지만 알 수 있다&rdquo;고 말하는 것이
            &ldquo;모든 것을 해결할 수 있다&rdquo;고 말하는 것보다 정직하고, 결국 더 유용합니다.
          </p>
        </div>

        {/* Social */}
        <div className="mt-8 flex gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:text-accent-light"
          >
            Instagram
          </a>
        </div>
      </section>

      {/* Lab Section */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-text">빅데이터 마케팅 랩이 하는 일</h2>
        <p className="mt-3 font-serif text-base leading-relaxed text-subtext">
          BDM Lab은 데이터 기반의 마케팅 의사결정을 연구합니다.
          학술 연구와 기업 프로젝트를 병행하며, 이론과 실무의 간극을 줄이는 것을 목표로 합니다.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-5">
            <h3 className="text-base font-bold text-text">AI 예측</h3>
            <p className="mt-2 text-sm leading-relaxed text-subtext">
              수요 예측, 매출 예측, 고객 이탈 예측 등 머신러닝 기반 예측 모델을 연구합니다.
            </p>
          </div>
          <div className="rounded-lg border border-border p-5">
            <h3 className="text-base font-bold text-text">인과분석</h3>
            <p className="mt-2 text-sm leading-relaxed text-subtext">
              마케팅 캠페인의 실제 효과를 측정합니다. 상관관계가 아닌 인과관계를 밝히는 것이 핵심입니다.
            </p>
          </div>
          <div className="rounded-lg border border-border p-5">
            <h3 className="text-base font-bold text-text">알고리즘 분석</h3>
            <p className="mt-2 text-sm leading-relaxed text-subtext">
              플랫폼 추천 알고리즘과 AEO(Answer Engine Optimization)를 연구합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-text">랩 멤버</h2>
        <p className="mt-3 font-serif text-base leading-relaxed text-subtext">
          현재 함께 연구할 대학원생을 모집하고 있습니다.
        </p>
        <Link
          href="/join"
          className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-light"
        >
          지원 안내 보기 &rarr;
        </Link>
      </section>
    </div>
  )
}
