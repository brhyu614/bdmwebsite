import type { Metadata } from 'next'
import Link from 'next/link'
import { getHomeArticles } from '@/lib/topics'
import ArticleCard from '@/components/articles/ArticleCard'
import HeroAnimation from '@/components/home/HeroAnimation'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
  description:
    '데이터로 소비자를 예측하고, 복제하고, 해독합니다. AI 매출·수요 예측, LLM 멀티에이전트 소비자 시뮬레이션, 소셜미디어·인플루언서 분석. 한양대학교 Big Data Marketing Lab.',
  openGraph: {
    title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
    description:
      '데이터로 소비자를 예측하고, 복제하고, 해독합니다. AI 예측 · 소비자 시뮬레이션 · 소셜미디어 분석.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

// ── 3대 연구 축 ──
const RESEARCH_AXES = [
  {
    no: '01',
    en: 'Prediction',
    title: 'AI 예측',
    desc: '매출·수요·인구를 예측하는 업종 무관 예측 엔진. 시계열·구조 모델 + SHAP 설명으로 의사결정 근거까지 만든다.',
    stats: ['슈퍼마켓 R² 98.3%', 'IP 콜라보 적중 97.6%', 'JRCS 게재'],
    link: '/projects',
    cta: '예측 프로젝트 보기',
  },
  {
    no: '02',
    en: 'Replication',
    title: 'AI 소비자 시뮬레이션',
    desc: '소비자의 의식적·무의식적 사고를 디지털 트윈으로 복제한다. 합성 FGI를 만들고, 사고를 복제한 소비자와 직접 대화한다.',
    stats: ['검증 정확도 83%', '비용·시간 1/10', '6-Lens 의사결정 구조'],
    link: '/synthetic-consumer',
    cta: '소비자 시뮬레이션 보기',
  },
  {
    no: '03',
    en: 'Social Analytics',
    title: '소셜미디어·인플루언서 분석',
    desc: '대규모 소셜미디어 데이터를 구축해, 인플루언서와 콘텐츠가 만드는 효과를 수치로 검증한다. 이미지·텍스트·행동 데이터 결합.',
    stats: ['대규모 인스타 데이터', '얼굴·이미지 AI 분석', '효과 인과 검증'],
    link: '/social-research',
    cta: '소셜 연구 보기',
  },
]

// ── 대표 성과 (외부 발표용 핵심 수치) ──
const HIGHLIGHTS = [
  { stat: '98.3%', label: '슈퍼마켓 수요 예측', sub: '284개 점포 · JRCS 게재' },
  { stat: '97.6%', label: 'IP 콜라보 매출 예측', sub: '462명 · 4,042건 검증' },
  { stat: '83%', label: '합성 소비자 재현', sub: 'Mind-Bridge · holdout 검증' },
  { stat: '3,518', label: '행정동 인구 예측', sub: '20년 · 461개 변수' },
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
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-text sm:text-5xl lg:text-6xl">
            데이터로 소비자를
            <br />
            예측하고, 복제하고, 해독합니다.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-subtext">
            한양대학교 임보람 교수 연구실.
            <br />
            AI 예측 · 소비자 시뮬레이션 · 소셜미디어 분석.
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

      {/* ══ 3대 연구 축 ══ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-text">3대 연구 축</h2>
          <Link href="/research" className="text-sm text-accent hover:underline">
            연구실 전체 보기 →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
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

      {/* ══ 대표 성과 ══ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text">대표 성과</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-3xl font-bold text-accent">{h.stat}</p>
                <p className="mt-2 text-sm font-bold text-text">{h.label}</p>
                <p className="mt-1 text-xs text-muted">{h.sub}</p>
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
