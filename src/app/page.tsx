import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/articles/ArticleCard'
import HeroAnimation from '@/components/home/HeroAnimation'

export const metadata: Metadata = {
  title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
  description: '소비자 행동을 데이터로 읽고, 매출·수요·인구를 예측합니다. 한양대학교 Big Data Marketing Lab.',
  openGraph: {
    title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
    description: '소비자 행동을 데이터로 읽고, 기업의 앞날을 예측합니다.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const PROJECTS = [
  {
    title: 'IP 콜라보 매출 예측',
    stat: '97.7%',
    desc: '462명 연예인 · 4,042건 검증',
    link: '/projects/photoism',
  },
  {
    title: '슈퍼마켓 수요 예측',
    stat: '98.3%',
    desc: '284개 매장 · 품목별 채널별',
    link: '/projects/grocery',
  },
  {
    title: '프랜차이즈 매출 분석',
    stat: '349개',
    desc: '배달·포장·홀 채널 분리 분석',
    link: '/projects/bbq',
  },
  {
    title: '인구 변화 예측',
    stat: '3,518',
    desc: '전국 행정동 · 5년 후 예측',
    link: '/projects/population',
  },
]

const RESEARCH_AREAS = [
  { title: 'AI 매출·수요 예측', desc: 'XGBoost, LightGBM, 딥러닝 기반 예측 모델 구축 및 검증' },
  { title: '인과분석', desc: 'DID, IV, RCT 설계로 마케팅 캠페인·정책의 실제 효과 검증' },
  { title: '소비자 행동', desc: '결제 데이터, 리뷰, 행동 로그 기반 의사결정 분석' },
  { title: 'LLM / AI Agent', desc: 'LLM 멀티에이전트 시뮬레이션, 자연어 분석, AEO' },
]

export default function HomePage() {
  const allArticles = getAllArticles()
  const latestArticles = allArticles.slice(0, 6)

  return (
    <>
      {/* ══ Hero — MIT Media Lab style ══ */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <HeroAnimation />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
            Big Data Marketing Lab
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-text sm:text-5xl lg:text-6xl">
            소비자의 행동을 읽고,
            <br />
            기업의 앞날을 예측합니다.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-subtext">
            한양대학교 임보람 교수 연구실.
            <br />
            AI 예측, 인과분석, 소비자 데이터 분석.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/projects"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#0B0F14] transition-opacity hover:opacity-90"
            >
              프로젝트 보기
            </Link>
            <Link
              href="/articles"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-subtext transition-colors hover:border-accent hover:text-accent"
            >
              인사이트 읽기
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Projects Grid ══ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-text">프로젝트</h2>
          <Link href="/projects" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => (
            <Link key={p.title} href={p.link} className="group">
              <div className="rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:bg-surface-alt">
                <p className="text-3xl font-bold text-accent">{p.stat}</p>
                <p className="mt-2 text-sm font-bold text-text group-hover:text-accent transition-colors">
                  {p.title}
                </p>
                <p className="mt-1 text-xs text-muted">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ Research Areas ══ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text">연구 영역</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCH_AREAS.map((area) => (
              <div key={area.title} className="rounded-2xl border border-border bg-surface p-5">
                <p className="font-bold text-text">{area.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-subtext">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Latest Insights ══ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-text">최신 인사이트</h2>
            <Link href="/articles" className="text-sm text-accent hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                index={i}
                total={latestArticles.length}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
