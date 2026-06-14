import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { DBR_ARTICLES } from '@/lib/media'
import JsonLd from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: '디지털 마케팅 — BDM Lab',
  description:
    '대규모 디지털·소셜 데이터를 구축해 인플루언서와 콘텐츠가 만드는 효과를 수치로 검증한다. 이미지·텍스트·행동 데이터 결합, 얼굴 노출·시각 진단성의 인게이지먼트 효과 분석.',
  alternates: { canonical: '/digital-marketing' },
  openGraph: {
    title: '디지털 마케팅 — BDM Lab',
    description: '대규모 소셜·이미지 데이터로 인플루언서·콘텐츠 효과를 수치로 검증한다.',
    images: [{ url: '/images/og/digital-marketing.jpg', width: 1200, height: 627 }],
  },
}

const METHODS = [
  { label: '대규모 수집', sub: '인스타그램 게시물·계정·이미지 크롤링' },
  { label: '이미지 AI', sub: 'ResNet50 · YOLOv8 얼굴/객체 탐지' },
  { label: '텍스트·메타', sub: 'multi-label 브랜드·카테고리 전개' },
  { label: '인과·회귀', sub: '국가 FE · 통제변수 · 조절효과' },
]

const FINDINGS = [
  {
    title: '얼굴 노출과 인게이지먼트',
    desc: '인플루언서가 얼굴을 어떻게(전체·일부·비공개) 노출하는지가 게시물 반응에 체계적으로 영향을 준다. 계정 단위·게시물 단위로 분해해 효과를 분리 검증.',
  },
  {
    title: '시각 진단성(Visual Diagnosticity) 조절',
    desc: '제품 효과가 사진으로 즉각 판단되는 카테고리(색조 메이크업)와 사용해야 아는 카테고리(스킨케어)에서, 노출 전략의 효과가 다르게 나타난다.',
  },
  {
    title: '이미지·소셜 결합 조기경보',
    desc: '이미지와 소셜 데이터로 브랜드의 하강 전환을 미리 읽는 조기경보 시스템 연구로 확장(NRF 신진연구).',
  },
]

export default function DigitalMarketingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="breadcrumb" data={{ items: [
        { name: '홈', url: SITE_URL },
        { name: '연구', url: `${SITE_URL}/research` },
        { name: '디지털 마케팅', url: `${SITE_URL}/digital-marketing` },
      ] }} />
      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          Digital Marketing
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          디지털 마케팅의 효과를
          <br />
          감이 아니라 수치로 검증합니다.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          대규모 소셜미디어 데이터를 직접 구축하고, 이미지·텍스트·행동 데이터를 결합해
          인플루언서와 콘텐츠가 만드는 효과를 인과적으로 검증하는 연구입니다.
        </p>
      </section>

      {/* 방법 */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            01
          </span>
          <h2 className="text-xl font-bold text-text">데이터와 방법</h2>
        </div>
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          공개된 소셜미디어에서 대규모 게시물·이미지·계정 데이터를 수집하고, 컴퓨터
          비전으로 이미지를 정량화한다. 게시물의 얼굴 노출 정도를 픽셀 단위로 판별하고,
          브랜드·카테고리를 multi-label로 전개해, 수백 개 변수를 통제한 회귀로 순수 효과를
          추정한다.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {METHODS.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-bold text-text">{m.label}</p>
              <p className="mt-1 text-xs text-muted">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 발견 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            02
          </span>
          <h2 className="text-xl font-bold text-text">무엇을 발견했나</h2>
        </div>
        <div className="mt-6 space-y-3">
          {FINDINGS.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-bold text-text">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-subtext">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted">
          ※ 한양대 석·박사과정 공동연구. 일부 결과는 학위논문·후속 연구로 진행 중입니다.
        </p>
      </section>

      {/* DBR 미디어 기고 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            03
          </span>
          <h2 className="text-xl font-bold text-text">미디어 기고 — DBR</h2>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-subtext">
          연구의 시각을 실무 독자에게 전합니다. 동아비즈니스리뷰(DBR)에 기고한 글.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {DBR_ARTICLES.map((a) => (
            <a key={a.href} href={a.href} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 360px"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                    {a.issue}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold leading-snug text-text transition-colors group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-subtext">
                    {a.summary}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-accent group-hover:underline">
                    DBR에서 읽기 ↗
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 대중 콘텐츠 연결 */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">알고리즘 디코드</h2>
        <p className="mt-3 text-base leading-relaxed text-subtext">
          이 연구의 시각을 누구나 읽을 수 있게 풀어 쓴 글들도 발행합니다 — 플랫폼
          알고리즘, 인플루언서, 바이럴 콘텐츠를 데이터로 해독한 인사이트.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/articles?series=algorithm-decode"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-subtext transition-colors hover:border-accent hover:text-accent"
          >
            알고리즘 디코드 읽기 →
          </Link>
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#0B0F14] transition-opacity hover:opacity-90"
          >
            공동연구·협업 문의
          </Link>
        </div>
      </section>
    </div>
  )
}
