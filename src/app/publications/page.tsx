import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Publications',
  description:
    '빅데이터마케팅 랩(BDM Lab) 임보람 교수의 연구 논문 목록. Journal of Retailing, Journal of Retailing and Consumer Services 등 국제 저널과 국내 저널 게재 논문.',
  alternates: { canonical: '/publications' },
}

type Paper = {
  authors: string
  year: string
  title: string
  venue: string
  detail?: string
  note?: string
  url?: string
  doi?: string
  pdf?: string
  method?: string
  axis?: 'llm' | 'forecast'
}

const INTERNATIONAL: Paper[] = [
  {
    authors: 'Lim, Boram, Lauren Min, and Kissan Joseph',
    year: '2026',
    title: 'Beyond the Receipt: Risk Reduction and Locus of Attribution in Grocery Returns',
    venue: 'Journal of Retailing',
    doi: '10.1016/j.jretai.2026.08.008',
    method: '이중차분법으로 반품 전후를 비교해 인과 효과를 추정',
    detail:
      '식료품 반품 이후 같은 소매업체에서의 지출이 40.1% 늘어난다. 다양성을 추구하는 상위 25% 집단과 지출 하위 25% 집단에서는 증가폭이 100%를 넘는다. 반품이 세 번째에 이르면 증가폭은 음수로 바뀐다.',
  },
  {
    authors: 'Lim, Boram, Sofia Cavieres, Wen Jing Han, and Hyeong-Tak Lee',
    year: '2026',
    title:
      'Omni-channel grocery forecasting: Channel differences in forecastability and predictive signals',
    venue: 'Journal of Retailing and Consumer Services, 92, 104853',
    doi: '10.1016/j.jretconser.2026.104853',
    method: '머신러닝(XGBoost)으로 채널별 수요를 예측하고 기여 변수를 분해',
    detail:
      '온라인과 오프라인 중 어느 채널의 수요가 더 잘 맞는지, 각 채널에서 예측에 실제로 기여하는 변수가 무엇인지를 구분해 측정했다.',
    axis: 'forecast',
  },
  {
    authors: 'Lim, Boram, Taewan Kim, Dongyoup Kim, and Yihan Chiu',
    year: '2026',
    title: 'Structural drivers of sales in omnichannel retailing',
    venue: 'Journal of Retailing and Consumer Services, 92, 104817',
    doi: '10.1016/j.jretconser.2026.104817',
    method: '구조 모형으로 매출 요인을 분해',
    detail: '옴니채널 소매에서 매출을 움직이는 구조적 요인을 분해했다.',
    axis: 'forecast',
  },
  {
    authors: 'Hong, EunPyo, JungKun Park, and Boram Lim',
    year: '2025',
    title:
      "Exploring perceived value's impact on attitudes in autonomous public transportation services: a multi-dimensional approach",
    venue: 'Total Quality Management & Business Excellence, 36, 100–124',
    doi: '10.1080/14783363.2024.2443078',
    detail: '자율주행 대중교통 서비스에서 이용자가 느끼는 가치가 태도로 이어지는 경로를 여러 차원으로 나눠 확인했다.',
  },
  {
    authors: 'Lim, Boram, Ying Xie, and Ernan Haruvy',
    year: '2022',
    title: 'The impact of mobile app adoption on physical and online channels',
    venue: 'Journal of Retailing, 98(3), 453–470',
    doi: '10.1016/j.jretai.2021.10.001',
    method: '패널 데이터 계량경제 모형으로 채널 전환 효과를 추정',
    detail: '소비자가 모바일 앱을 쓰기 시작한 뒤 오프라인 매장과 PC 주문이 어떻게 달라지는지를 구매 데이터로 추정했다.',
  },
  {
    authors: 'Haruvy, Ernan, Boram Lim, and Peter T. L. Popkowski Leszczyc',
    year: '2023',
    title: 'The effect of surcharge on price in online auctions',
    venue: 'Electronic Commerce Research, 23, 1161–1182',
    doi: '10.1007/s10660-021-09508-6',
    method: '경매 데이터 회귀분석으로 수수료의 가격 효과를 추정',
    detail: '온라인 경매에서 별도로 붙는 수수료가 최종 낙찰가를 어떻게 움직이는지를 분석했다.',
  },
]

const DOMESTIC: Paper[] = [
  {
    authors: '임보람, 한상린, 박우현, 홍근혜',
    year: '2025',
    title: '과거 소비 행태가 온라인 커머스 멤버십 가입에 미치는 영향',
    venue: '유통연구, 30(4), 1–23',
    method: '로지스틱 회귀로 가입 확률을 추정',
    detail: '커머스 멤버십 가입자의 가입 이전 구매 기록을 계량경제학 모형으로 분석했다.',
  },
  {
    authors: '김민혜, 이윤지, Khin Chan Myae Nyein, 임보람',
    year: '2025',
    title: '식료품 리테일러의 새벽배송 서비스 제공 효과 분석',
    venue: '서비스 연구',
    method: '이중차분법으로 서비스 도입 효과를 검증',
    detail: '새벽배송 도입 전후의 소비자 구매 데이터로 매출 변화를 검증했다.',
  },
  {
    authors: '박서영, 임보람',
    year: '2023',
    title: '건강과 환경 메시지 프레이밍에 따른 소비자 태도와 구전에 미치는 영향',
    venue: '서비스 연구, 13(3), 127–146',
    method: '실험 설계로 문구별 태도 차이를 측정',
    detail: '비건 제품 광고에서 건강을 앞세운 문구와 환경을 앞세운 문구의 효과를 비교했다.',
  },
  {
    authors: '임보람, 한상린',
    year: '2023',
    title: '식료품 리테일러의 새벽배송 서비스 제공 효과 분석',
    venue: '한국유통학회',
    method: '이중차분법으로 서비스 도입 효과를 검증',
  },
  {
    authors: '임보람, 한상린, 송재필',
    year: '2020',
    title: '수퍼마켓의 모바일 앱 도입으로 인한 고객의 구매행동 변화 분석',
    venue: '한국유통학회',
    method: '구매 로그 패널 분석으로 행동 변화를 측정',
  },
]

const AWARDS = [
  { year: '2025', name: '대한민국마케팅대상 연구 부문 특별상', org: '한국마케팅협회' },
  { year: '2018', name: 'AMA-Sheth Foundation Fellow', org: 'American Marketing Association' },
  { year: '2018', name: 'Doctoral Consortium Fellow', org: 'University of Houston' },
  { year: '2017', name: 'Marketing Science Doctoral Consortium Fellow', org: 'University of Southern California' },
  { year: '2016', name: 'Marketing Science Doctoral Consortium Fellow', org: 'Fudan University' },
]

function AxisTag({ axis }: { axis?: 'llm' | 'forecast' }) {
  if (!axis) return null
  const label = axis === 'llm' ? 'LLM 멀티에이전트' : 'AI 예측'
  return (
    <span className="ml-2 rounded bg-accent-bg px-1.5 py-0.5 align-middle font-mono text-[10px] text-accent">
      {label}
    </span>
  )
}

function PaperItem({ paper }: { paper: Paper }) {
  return (
    <li className="border-b border-border py-5 last:border-0">
      <p className="font-mono text-xs text-muted">
        {paper.authors} ({paper.year})
      </p>
      <h3 className="mt-1.5 text-base font-bold leading-snug text-text">
        {paper.url ? (
          <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            {paper.title}
          </a>
        ) : (
          paper.title
        )}
        <AxisTag axis={paper.axis} />
      </h3>
      <p className="mt-1 text-sm italic text-subtext">{paper.venue}</p>
      {paper.method && (
        <p className="mt-1.5 font-mono text-[11px] text-accent">방법 {paper.method}</p>
      )}
      {paper.detail && (
        <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">{paper.detail}</p>
      )}
      {(paper.pdf || paper.doi || paper.url) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {paper.pdf && (
            <a
              href={paper.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-accent bg-accent-bg px-2.5 py-1 font-mono text-[11px] text-accent hover:opacity-80"
            >
              PDF 내려받기
            </a>
          )}
          {paper.doi && (
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-border px-2.5 py-1 font-mono text-[11px] text-subtext hover:border-accent/40 hover:text-accent"
            >
              doi {paper.doi}
            </a>
          )}
          {paper.url && !paper.doi && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-border px-2.5 py-1 font-mono text-[11px] text-subtext hover:border-accent/40 hover:text-accent"
            >
              저널 페이지
            </a>
          )}
        </div>
      )}
    </li>
  )
}

export default function PublicationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="person" />

      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Publications</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">연구 논문</h1>
      </section>

      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">국제 저널</h2>
        <ul className="mt-4">
          {INTERNATIONAL.map((p) => (
            <PaperItem key={p.title} paper={p} />
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">국내 저널</h2>
        <ul className="mt-4">
          {DOMESTIC.map((p) => (
            <PaperItem key={p.title + p.year} paper={p} />
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">수상</h2>
        <ul className="mt-4 space-y-3">
          {AWARDS.map((a) => (
            <li key={a.name + a.year} className="flex gap-4 border-b border-border pb-3 last:border-0">
              <span className="w-12 shrink-0 font-mono text-sm text-accent">{a.year}</span>
              <span className="text-sm text-text">
                {a.name}
                <span className="ml-2 text-muted">{a.org}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">기관 연구용역</h2>
        <ul className="mt-4 space-y-3">
          {[
            {
              org: '한국은행 경기본부',
              title: '경기 지역 자영업의 회복 격차 분석',
              period: '7개월 과제',
              detail:
                '같은 지역에서도 업종과 상권에 따라 회복 속도가 갈리는 요인을 분해해 정책 보고서로 제출합니다.',
            },
          ].map((p) => (
            <li key={p.title} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="rounded bg-accent-bg px-2 py-0.5 font-mono text-[11px] text-accent">
                  {p.org}
                </span>
                <span className="font-mono text-[11px] text-muted">{p.period}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-text">{p.title}</h3>
              <p className="mt-1.5 font-serif text-sm leading-[1.8] text-subtext">{p.detail}</p>
            </li>
          ))}
        </ul>
      </section>

    </div>
  )
}
