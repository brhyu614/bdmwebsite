import type { Metadata } from 'next'
import Link from 'next/link'
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

const FEATURED_PROJECTS = [
  { title: '포토부스 프랜차이즈 매출 예측', stat: '97.7%', link: '/projects/photoism' },
  { title: '슈퍼마켓 284개 매장 수요 예측', stat: '98.3%', link: '/projects/grocery' },
  { title: '치킨 프랜차이즈 349개 매장 분석', stat: '96%', link: '/projects/bbq' },
  { title: '전국 3,518개 행정동 인구 예측', stat: '5년 후', link: '/projects/population' },
]

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
          소비자의 마음을 읽고,
          <br />
          <span className="gradient-text">기업의 앞날을 예측합니다.</span>
        </h1>
        <p className="mt-5 text-base text-subtext">
          임보람 교수 · 한양대학교 Big Data Marketing Lab
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          매출, 수요, 인구를 예측하고, 소비자 행동의 변화를 데이터로 읽습니다.
          구매 빅데이터, 인터뷰, AI 시뮬레이션으로 근거 있는 의사결정을 연구합니다.
        </p>
      </section>

      {/* Featured Projects — 작게, 자연스럽게 */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Featured Projects</p>
          <Link href="/projects" className="text-sm text-accent hover:underline">전체 보기 →</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PROJECTS.map((p) => (
            <Link key={p.title} href={p.link} className="group">
              <div className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/40">
                <span className="text-xl font-bold text-accent">{p.stat}</span>
                <p className="mt-1 text-sm font-medium text-text group-hover:text-accent transition-colors leading-snug">
                  {p.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Lab Research header */}
      <section className="mb-8 border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Lab Research</p>
        <h2 className="mt-3 text-2xl font-bold text-text">BDM Lab 데이터 분석</h2>
      </section>

      {/* Articles Grid — 메인 콘텐츠 */}
      <section>
        <HomeFilter articles={allArticles} />
      </section>

    </div>
  )
}
