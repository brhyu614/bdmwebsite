import { getAllArticles } from '@/lib/articles'
import HomeFilter from './HomeFilter'

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
          감 대신 근거.
          <br />
          <span className="gradient-text">데이터로 읽는 마케팅.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-subtext">
          플랫폼 알고리즘, AI 예측, 인과분석 — 데이터와 연구 기반의 마케팅 인사이트.
        </p>
      </section>

      {/* Articles Grid */}
      <section>
        <HomeFilter articles={allArticles} />
      </section>
    </div>
  )
}
