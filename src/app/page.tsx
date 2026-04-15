import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import HomeFilter from './HomeFilter'

export const metadata: Metadata = {
  title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
  description: '소비자 행동을 데이터로 읽고, 매출·수요·인구를 예측합니다. 한양대학교 Big Data Marketing Lab.',
  openGraph: {
    title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
    description: '소비자 행동을 데이터로 읽고, 기업의 앞날을 예측합니다.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  const allArticles = getAllArticles()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Hero */}
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
          플랫폼 알고리즘의 구조를 파헤치고, 기업 전략과 소비자행동의 근본을 데이터로 풀어냅니다.
        </p>
      </section>

      {/* Articles Grid */}
      <section>
        <HomeFilter articles={allArticles} />
      </section>

    </div>
  )
}
