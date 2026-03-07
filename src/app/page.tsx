import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import HomeFilter from './HomeFilter'

export const metadata: Metadata = {
  title: '직감 대신 근거 — 빅데이터마케팅 랩 | Big Data Marketing Lab',
  description: '한양대학교 빅데이터마케팅 랩(BDM Lab). 플랫폼 알고리즘 분석, AI 매출 예측, 인과분석 기반 마케팅 인사이트를 연구합니다.',
  openGraph: {
    title: '직감 대신 근거 — 빅데이터마케팅 랩',
    description: '한양대학교 Big Data Marketing Lab. 알고리즘 분석, AI 예측, 인과분석 기반 마케팅 연구.',
  },
}

export default function HomePage() {
  const allArticles = getAllArticles()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-14">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          BDM Lab
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-text sm:text-5xl lg:text-6xl">
          직감 대신 근거.
          <br />
          <span className="gradient-text">데이터로 읽는 마케팅.</span>
        </h1>
        <p className="mt-5 text-base text-subtext">
          임보람 교수 · 한양대 Big Data Marketing Lab
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          디지털 마케팅 매거진. BDM Lab이 알고리즘의 구조를 파헤치고, 기업 전략과 소비자행동의 근본을 데이터로 풀어냅니다.
        </p>
      </section>

      {/* Articles Grid */}
      <section>
        <HomeFilter articles={allArticles} />
      </section>
    </div>
  )
}
