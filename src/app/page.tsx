import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getHomeArticles } from '@/lib/topics'
import { DBR_ARTICLES } from '@/lib/media'
import ArticleCard from '@/components/articles/ArticleCard'
import HeroAnimation from '@/components/home/HeroAnimation'
import HeroRotator from '@/components/home/HeroRotator'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
  description:
    'AI의 빈자리를 사람이 채웁니다. 6년치 구매 기록으로 소비자를 복제해 가상에서 실험하고, XGBoost로 매출과 폐업 가능성을 예측합니다. 한양대학교 Big Data Marketing Lab.',
  alternates: { canonical: '/' },
  openGraph: {
    title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
    description:
      'AI의 빈자리를 사람이 채웁니다. 소비자 복제와 가상 실험, XGBoost 기반 미래 예측.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

// ── 2대 연구 축 ──
const RESEARCH_AXES = [
  {
    no: '01',
    en: 'LLM Multi-Agent',
    title: 'LLM 멀티에이전트 모델링',
    desc: '사람의 의사결정 과정을 LLM 에이전트로 복제해, 현실에서 시간을 되돌려야만 가능한 실험을 가상으로 돌린다. 가격을 올리면 떠날지, 새 상품을 받아들일지를 출시 전에 묻는다.',
    stats: ['6년 구매 기록 기반 복제', '집단 면접 시뮬레이션', '희소 표본 페르소나 확장'],
    link: '/research/ai',
    cta: 'AI 연구 12건 보기',
  },
  {
    no: '02',
    en: 'Forecasting',
    title: 'XGBoost 기반 미래 예측',
    desc: '매출, 수요, 인구, 폐업을 숫자로 미리 내놓는다. 어떤 변수가 그 예측을 밀어 올렸는지까지 분해해, 바로 의사결정에 쓸 수 있게 만든다.',
    stats: ['매장 633개 분석', '행정동 3,518개 인구 예측', '국제 저널 게재'],
    link: '/projects',
    cta: '예측 프로젝트 보기',
  },
]

// ── 대표 성과 (지표 이름과 표본 수를 함께 표기) ──
const HIGHLIGHTS = [
  { stat: 'R² 0.983', label: '슈퍼마켓 수요 예측', sub: '284개 매장 · 국제 저널 게재' },
  { stat: 'R² 0.96', label: '치킨 프랜차이즈 매출 예측', sub: '349개 매장 · 매장식사 채널' },
  { stat: '97.6%', label: 'IP 협업 매출 적중률', sub: '462명 · 4,042건 검증' },
  { stat: '3,518', label: '행정동 인구 예측', sub: '20년 자료 · 461개 변수' },
]

export default function HomePage() {
  const latestArticles = getHomeArticles().slice(0, 6)

  return (
    <>
      {/* ══ Hero ══ */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <HeroAnimation />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-transparent to-[var(--color-bg)]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
            Big Data Marketing Lab
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.15] text-text sm:text-5xl lg:text-6xl">
            <span className="block">소비자 행동을 AI와 데이터로</span>
            <HeroRotator />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-subtext">
            6년치 구매 기록으로 소비자를 복제해 가격 인상과 신제품 출시를 가상에서 먼저 돌립니다.
            매출, 수요, 인구, 폐업은 숫자로 미리 내놓습니다. AI가 내놓은 답은 실제 소비자의 답과
            대조해 검증합니다.
          </p>
          <p className="mt-3 max-w-xl font-mono text-sm text-muted">
            한양대학교 경영대학 임보람 교수 연구실
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/research"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#0B0F14] transition-opacity hover:opacity-90"
            >
              연구 살펴보기
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

      {/* ══ 2대 연구 축 ══ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-text">두 갈래 연구 축</h2>
          <Link href="/research" className="text-sm text-accent hover:underline">
            연구실 전체 보기 →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {RESEARCH_AXES.map((axis) => (
            <Link key={axis.en} href={axis.link} className="group flex">
              <div className="flex w-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:bg-surface-alt">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-muted">{axis.no}</span>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    {axis.en}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-text group-hover:text-accent transition-colors">
                  {axis.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-subtext">{axis.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {axis.stats.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-surface-alt px-2.5 py-0.5 font-mono text-[10px] text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-5 font-mono text-xs text-accent group-hover:underline">
                  {axis.cta} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ 대표 성과 (가로 스탯 바) ══ */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-border">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="px-2 text-center sm:px-6">
                <p className="text-4xl font-bold text-text">{h.stat}</p>
                <p className="mt-2 text-sm font-medium text-subtext">{h.label}</p>
                <p className="mt-1 text-xs text-muted">{h.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 미디어 기고 ══ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                Featured In
              </p>
              <h2 className="mt-1 text-2xl font-bold text-text">미디어 기고</h2>
            </div>
            <Link href="/digital-marketing" className="text-sm text-accent hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {DBR_ARTICLES.map((a) => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-accent/40 hover:bg-surface-alt sm:flex-row">
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-40">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 160px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                      {a.issue}
                    </span>
                    <h3 className="mt-1 text-sm font-bold leading-snug text-text group-hover:text-accent transition-colors">
                      {a.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                      {a.summary}
                    </p>
                    <span className="mt-auto pt-3 font-mono text-[11px] text-accent group-hover:underline">
                      DBR에서 읽기 ↗
                    </span>
                  </div>
                </div>
              </a>
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
