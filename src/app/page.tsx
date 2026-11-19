import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { DBR_ARTICLES } from '@/lib/media'

export const metadata: Metadata = {
  title: 'AI 소비자 행동 연구 | 한양대학교 임보람 교수',
  description: '소비자의 판단을 모형화하는 디지털 트윈, 점포 매출과 수요를 예측하는 머신러닝, 디지털 플랫폼의 추천 알고리즘을 연구합니다.',
  alternates: { canonical: '/' },
}

const papers = [
  { journal: 'Journal of Retailing and Consumer Services', year: '2026', title: 'Omni-channel grocery forecasting: Channel differences in forecastability and predictive signals', doi: '10.1016/j.jretconser.2026.104853' },
  { journal: 'Journal of Retailing', year: '2026', title: 'Beyond the Receipt: Risk Reduction and Locus of Attribution in Grocery Returns', doi: '10.1016/j.jretai.2026.08.008' },
  { journal: 'Journal of Retailing', year: '2022', title: 'The impact of mobile app adoption on physical and online channels', doi: '10.1016/j.jretai.2021.10.001' },
]

const wrap = 'mx-auto max-w-6xl px-5 sm:px-8'
const heading = 'text-3xl font-bold tracking-tight sm:text-4xl'
const detail = 'mt-4 leading-8 text-slate-600'
const jump = 'mt-5 inline-block font-semibold text-teal-800 underline decoration-teal-800/30 underline-offset-4 hover:decoration-current'

export default function HomePage() {
  return (
    <div className="bg-[#fafaf7] text-[#142d3a] [word-break:keep-all]">
      <section className="bg-[#102d39] text-white">
        <div className={wrap + ' grid items-center gap-12 py-16 lg:grid-cols-[1.3fr_1fr] lg:py-24'}>
          <div>
            <p className="font-mono text-sm text-teal-200">한양대학교 경영대학 · 임보람 교수 연구실</p>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">소비자 디지털 트윈과<br />시장 예측</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">개인의 구매 이력과 설문 응답으로 소비자의 판단을 모형화합니다. 점포와 지역 단위에서는 머신러닝으로 매출과 수요를 예측합니다.</p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold"><a href="#research" className="border-b border-teal-300 pb-1">연구 프로젝트 ↓</a><a href="#papers" className="border-b border-teal-300 pb-1">주요 논문 ↓</a></div>
          </div>
          <figure className="border-l border-teal-300/40 pl-6 sm:pl-9">
            <figcaption className="mb-5 font-mono text-sm text-teal-200">개인별 디지털 트윈의 검증 설계</figcaption>
            <ol className="space-y-4">
              <li className="border-b border-white/20 pb-4"><strong>개인의 행동과 경험</strong><p className="mt-1 text-sm text-slate-300">같은 참여자의 구매 기록과 설문 응답을 연결</p></li>
              <li className="border-b border-white/20 pb-4"><strong>새로운 선택 과제</strong><p className="mt-1 text-sm text-slate-300">대규모 언어모형(LLM)이 개인별 정보로 선택을 예측</p></li>
              <li><strong>실제 선택과 대조</strong><p className="mt-1 text-sm text-slate-300">동일한 과제에서 참여자와 모형이 고른 대안 비교</p></li>
            </ol>
          </figure>
        </div>
      </section>
      <section id="research" className={wrap + ' scroll-mt-24 py-16'}>
        <h2 className={heading}>주요 연구 프로젝트</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <article className="border-t-2 border-teal-800 pt-5">
            <h3 className="text-2xl font-bold">소비자 판단의 개인별 모형화</h3>
            <p className={detail}>소비자 디지털 트윈은 개인의 경험과 선호를 반영해 그 사람의 판단을 예측하는 모형입니다. 어떤 경험을 알려 주었을 때 새로운 제품에 대한 선택까지 재현할 수 있는지 연구합니다.</p>
            <p className="mt-5 border-l-2 border-teal-700 pl-4"><strong className="text-3xl">6년</strong><span className="ml-3">구매 기록의 관측 기간</span></p>
            <Link className={jump} href="/research/digital-twin">디지털 트윈 연구 보기 →</Link>
          </article>
          <article className="border-t-2 border-teal-800 pt-5">
            <h3 className="text-2xl font-bold">유통 채널별 수요 예측</h3>
            <p className={detail}>XGBoost는 앞선 모형의 예측 오차를 줄이는 방향으로 결정 트리를 순차적으로 학습합니다. 슈퍼마켓 284개 매장의 판매 자료로 온라인과 오프라인에서 어떤 단위로 수요를 예측하는 것이 효과적인지 분석했습니다.</p>
            <p className="mt-5 border-l-2 border-teal-700 pl-4"><strong className="text-3xl">0.983</strong><span className="ml-3">온라인 채널 매출 예측의 결정계수(R²)</span></p>
            <p className="mt-2 text-sm text-slate-600">결정계수는 매출을 평균값으로 예측했을 때와 비교해 모형이 제곱오차를 얼마나 줄였는지 나타냅니다.</p>
            <Link className={jump} href="/projects/grocery">연구 방법과 결과 보기 →</Link>
          </article>
        </div>
        <div className="mt-12 grid gap-8 border-t border-slate-300 pt-8 lg:grid-cols-2">
          <article><h3 className="text-xl font-bold">프랜차이즈 상권과 입점 전략</h3><p className={detail}>한문정과의 공동연구에서는 같은 입지에 다른 프랜차이즈 브랜드가 진입하는 상황을 모형으로 비교합니다. 개업 시점의 지역 내 경쟁과 브랜드 성장 추세를 반영해 후보별 예상 매출을 분석합니다.</p></article>
          <article><h3 className="text-xl font-bold">디지털 마케팅과 소셜미디어 알고리즘</h3><p className={detail}>플랫폼에서 노출되는 콘텐츠의 시각적 특성과 이용자 반응을 분석합니다. 이미지 인식 모형인 ResNet50과 YOLOv8로 게시물 속 얼굴과 객체를 식별하고, 제품군에 따라 얼굴 노출과 이용자 반응의 관계가 어떻게 달라지는지 비교합니다.</p><Link className={jump} href="/digital-marketing">디지털 마케팅 연구 보기 →</Link></article>
        </div>
      </section>
      <section id="papers" className="scroll-mt-24 border-y border-slate-300 bg-[#eef2f0]">
        <div className={wrap + ' py-14'}>
          <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 className={heading}>주요 논문</h2><Link className={jump} href="/publications">전체 논문 →</Link></div>
          <ul className="mt-6">{papers.map(paper => <li key={paper.doi} className="border-t border-slate-300 py-5"><p className="text-sm text-teal-800">{paper.journal} · {paper.year}</p><a href={'https://doi.org/' + paper.doi} className="mt-1 block font-serif text-xl leading-snug hover:underline">{paper.title} ↗</a></li>)}</ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                Dong-A Business Review
              </p>
              <h2 className="mt-1 text-2xl font-bold text-text">동아비즈니스리뷰 기고</h2>
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

          </div>
  )
}
