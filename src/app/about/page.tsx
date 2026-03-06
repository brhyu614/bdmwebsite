import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { AUTHOR_NAME, INSTAGRAM_URL, CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About',
  description: '한양대학교 임보람 교수의 빅데이터마케팅 랩(Big Data Marketing Lab). AI 예측, 인과분석, 플랫폼 알고리즘 연구.',
}

const services = [
  {
    title: 'AI 예측 모델',
    description: '수요 예측, 매출 예측, 고객 이탈 예측 등 머신러닝 기반 예측 모델을 개발합니다.',
    icon: '01',
  },
  {
    title: '인과분석',
    description: '마케팅 캠페인의 실제 효과를 측정합니다. 상관관계가 아닌 인과관계를 밝힙니다.',
    icon: '02',
  },
  {
    title: '알고리즘 분석',
    description: '플랫폼 추천 알고리즘과 AEO(Answer Engine Optimization)를 연구합니다.',
    icon: '03',
  },
  {
    title: '강연 · 워크숍',
    description: '기업 맞춤 교육 프로그램. 데이터 기반 의사결정, AI 활용, 마케팅 분석.',
    icon: '04',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="person" />
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">About</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          직감 대신 근거로<br />마케팅을 읽습니다.
        </h1>
      </section>

      {/* Professor Section */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-2xl font-bold text-accent">
            {AUTHOR_NAME.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">{AUTHOR_NAME}</h2>
            <p className="mt-1 font-mono text-sm text-subtext">교수 · 빅데이터마케팅 랩</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 font-serif text-base leading-relaxed text-subtext">
          <p>
            마케팅에서 &ldquo;감&rdquo;이라는 단어가 너무 자주 쓰인다고 생각합니다.
            감은 경험에서 나오지만, 경험은 편향을 동반합니다.
            데이터는 그 편향을 교정하는 도구입니다.
          </p>
          <p>
            빅데이터마케팅 랩(BDM Lab)은 이 믿음에서 출발했습니다.
            플랫폼 알고리즘이 어떻게 작동하는지, 마케팅 캠페인이 실제로 효과가 있었는지,
            매출 예측 모델은 어디까지 정확한지 — 이런 질문에 데이터로 답하는 것이 우리의 일입니다.
          </p>
          <p>
            과장하지 않습니다. 분석의 한계를 솔직히 밝힙니다.
          </p>
        </div>

        {/* Social */}
        <div className="mt-6 flex gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent transition-colors hover:text-accent-dim"
          >
            Instagram &rarr;
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Services</p>
        <h2 className="mt-3 text-2xl font-bold text-text">함께 일하기</h2>
        <p className="mt-3 text-base text-subtext">
          데이터로 더 나은 의사결정을 만들 수 있도록 돕겠습니다.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/30"
            >
              <span className="font-mono text-xs text-accent">{service.icon}</span>
              <h3 className="mt-2 text-base font-bold text-text">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-subtext">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 rounded-xl border border-accent/20 bg-accent-bg p-8">
          <h3 className="text-lg font-bold text-text">문의하기</h3>
          <p className="mt-2 text-sm text-subtext">
            프로젝트 문의, 강연 의뢰, 협업 제안 등 편하게 연락해 주세요.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-block rounded-lg bg-accent px-6 py-3 font-mono text-sm font-medium text-black transition-colors hover:bg-accent-dim"
          >
            이메일 보내기
          </a>
          <p className="mt-3 font-mono text-xs text-muted">
            {CONTACT_EMAIL}
          </p>
        </div>
      </section>

      {/* Members */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Team</p>
        <h2 className="mt-3 text-2xl font-bold text-text">랩 멤버</h2>
        <p className="mt-3 text-base text-subtext">
          현재 함께 연구할 대학원생을 모집하고 있습니다.
        </p>
        <Link
          href="/join"
          className="mt-4 inline-block font-mono text-sm text-accent transition-colors hover:text-accent-dim"
        >
          지원 안내 보기 &rarr;
        </Link>
      </section>
    </div>
  )
}
