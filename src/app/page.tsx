import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getHomeArticles } from '@/lib/topics'
import { DBR_ARTICLES } from '@/lib/media'
import ArticleCard from '@/components/articles/ArticleCard'
import HeroAnimation from '@/components/home/HeroAnimation'
import JsonLd from '@/components/JsonLd'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '빅데이터마케팅 랩 — 한양대학교 임보람 교수',
  description:
    '데이터로 소비자를 예측하고, 복제하고, 해독합니다. AI 매출·수요 예측, LLM 멀티에이전트 소비자 시뮬레이션, 소셜미디어·인플루언서 분석. 한양대학교 Big Data Marketing Lab.',
  alternates: { canonical: '/' },
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
    desc: '소비자의 의식적·무의식적 사고를 디지털 트윈으로 복제한다. 자체 AI 인터뷰 시스템 MindLens로 사고를 수집하고, 합성 FGI를 만들어 복제된 소비자와 직접 대화한다.',
    stats: ['Mind-Bridge', 'MindLens', '검증 정확도 83%'],
    link: '/synthetic-consumer',
    cta: 'Mind-Bridge · MindLens 보기',
  },
  {
    no: '03',
    en: 'Digital Marketing',
    title: '디지털 마케팅',
    desc: '대규모 디지털·소셜 데이터를 구축해, 인플루언서와 콘텐츠가 만드는 효과를 수치로 검증한다. 이미지·텍스트·행동 데이터 결합.',
    stats: ['대규모 인스타 데이터', '얼굴·이미지 AI 분석', '효과 인과 검증'],
    link: '/digital-marketing',
    cta: '디지털 마케팅 연구 보기',
  },
]

// ── 대표 성과 (외부 발표용 핵심 수치) ──
const HIGHLIGHTS = [
  { stat: '98.3%', label: '슈퍼마켓 수요 예측', sub: '284개 점포 · JRCS 게재' },
  { stat: '97.6%', label: 'IP 콜라보 매출 예측', sub: '462명 · 4,042건 검증' },
  { stat: '83%', label: '합성 소비자 재현', sub: 'Mind-Bridge · holdout 검증' },
  { stat: '3,518', label: '행정동 인구 예측', sub: '20년 · 461개 변수' },
]

// ── FAQ (AEO: FAQPage 스키마 + 사람용) ──
const FAQ_ITEMS = [
  {
    q: '빅데이터마케팅 랩은 무엇을 하는 곳인가요?',
    a: '한양대학교 임보람 교수 연구실로, 마케팅 질문을 데이터와 AI로 풉니다. 세 축 — AI 예측(매출·수요·인구), AI 소비자 시뮬레이션(디지털 트윈 합성 FGI), 디지털 마케팅 효과 검증 — 으로 연구하고 기업과 협업합니다.',
  },
  {
    q: 'Mind-Bridge가 무엇인가요?',
    a: '소비자의 의식적·무의식적 사고를 디지털 트윈으로 복제해, 실제 소비자처럼 답하는 AI 에이전트로 합성 FGI(집단 심층면접)를 진행하는 연구 플랫폼입니다. Twin-2K-500과 Generative Agents 연구에 자체 6-Lens 구조를 결합했고, holdout 검증에서 83%의 응답 재현 정확도를 보였습니다.',
  },
  {
    q: 'MindLens는 Mind-Bridge와 어떻게 다른가요?',
    a: 'MindLens는 AI가 음성으로 서베이·심층 인터뷰를 직접 진행하는 인터뷰 수집 플랫폼(mindlens-ai.com)이고, Mind-Bridge는 그렇게 모은 데이터로 만든 합성 소비자가 FGI를 진행하는 시뮬레이션입니다. MindLens가 데이터를 모으고, Mind-Bridge가 대화를 만듭니다.',
  },
  {
    q: '기업이 어떤 협업을 의뢰할 수 있나요?',
    a: 'AI 매출·수요 예측, 신제품 출시 전 소비자 반응 시뮬레이션, 캠페인·인플루언서 효과의 인과적 검증 등을 용역·공동연구·자문 형태로 진행합니다. 문제만 가지고 오셔도 데이터로 풀 수 있는지부터 함께 진단합니다.',
  },
  {
    q: '대학원생으로 합류하려면 어떻게 하나요?',
    a: '간단한 자기소개와 관심 연구 주제를 이메일(brlim@hanyang.ac.kr)로 보내주세요. 전공·배경은 제한하지 않으며, 통계·프로그래밍을 배우려는 의지와 호기심을 봅니다.',
  },
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
              href="/work-with-us"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-subtext transition-colors hover:border-accent hover:text-accent"
            >
              기업 협업·연구 의뢰
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

      {/* ══ FAQ (AEO) ══ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[760px] px-4 py-16 sm:px-6 lg:px-8">
          <JsonLd type="faq" data={{ items: FAQ_ITEMS }} />
          <h2 className="text-2xl font-bold text-text">자주 묻는 질문</h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {FAQ_ITEMS.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-text marker:content-none">
                  {f.q}
                  <span className="shrink-0 font-mono text-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-subtext">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
