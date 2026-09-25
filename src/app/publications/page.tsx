import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Publications',
  description:
    '빅데이터마케팅 랩(BDM Lab) 임보람 교수의 연구 논문 목록. Journal of Retailing, Journal of Retailing and Consumer Services 등 국제 저널 게재 논문과 진행 중인 연구.',
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
  axis?: 'llm' | 'forecast'
}

const INTERNATIONAL: Paper[] = [
  {
    authors: 'Lim, Boram, Lauren Min, and Kissan Joseph',
    year: '2026',
    title: 'Beyond the Receipt: Risk Reduction and Locus of Attribution in Grocery Returns',
    venue: 'Journal of Retailing (2026년 9월 온라인 게재), doi 10.1016/j.jretai.2026.08.008',
    detail:
      '식료품 반품 이후 같은 소매업체에서의 지출이 40.1% 늘어난다. 다양성을 추구하는 상위 25% 집단과 지출 하위 25% 집단에서는 증가폭이 100%를 넘는다. 반품이 세 번째에 이르면 증가폭은 음수로 바뀐다.',
    url: 'https://www.sciencedirect.com/science/article/pii/S0022435926000904',
  },
  {
    authors: 'Lim, Boram, et al.',
    year: '2026',
    title:
      'Omni-channel grocery forecasting: Channel differences in forecastability and predictive signals',
    venue: 'Journal of Retailing and Consumer Services, 92, 104853',
    detail:
      '온라인과 오프라인 중 어느 채널의 수요가 더 잘 맞는지, 각 채널에서 예측에 실제로 기여하는 변수가 무엇인지를 구분해 측정했다.',
    axis: 'forecast',
  },
  {
    authors: 'Lim, Boram, et al.',
    year: '2026',
    title: 'Structural drivers of sales in omnichannel retailing',
    venue: 'Journal of Retailing and Consumer Services, 92, 104817',
    detail: '옴니채널 소매에서 매출을 움직이는 구조적 요인을 분해했다.',
    axis: 'forecast',
  },
  {
    authors: 'Hong, Eunhye, Jaehyun Park, and Boram Lim',
    year: '2025',
    title:
      "Exploring perceived value's impact on attitudes in autonomous public transportation services: a multi-dimensional approach",
    venue: 'Total Quality Management & Business Excellence',
    detail: '자율주행 대중교통 서비스에서 이용자가 느끼는 가치가 태도로 이어지는 경로를 여러 차원으로 나눠 확인했다.',
  },
  {
    authors: 'Lim, Boram, Ying Xie, and Ernan Haruvy',
    year: '2021',
    title: 'The Impact of Mobile Channel Adoption on Physical and Online Channels',
    venue: 'Journal of Retailing',
    detail: '소비자가 모바일 앱을 쓰기 시작한 뒤 오프라인 매장과 PC 주문이 어떻게 달라지는지를 구매 데이터로 추정했다.',
  },
  {
    authors: 'Lim, Boram, Ernan Haruvy, and Peter T. L. Popkowski Leszczyc',
    year: '2021',
    title: 'The effect of surcharge on price in online auctions',
    venue: 'Electronic Commerce Research',
    detail: '온라인 경매에서 별도로 붙는 수수료가 최종 낙찰가를 어떻게 움직이는지를 분석했다.',
  },
]

const DOMESTIC: Paper[] = [
  {
    authors: '임보람, 한상린, 박우현, 홍근혜',
    year: '2025',
    title: '과거 소비 행태가 온라인 커머스 멤버십 가입에 미치는 영향',
    venue: '유통연구, 30(4), 1–23',
    detail: '커머스 멤버십 가입자의 가입 이전 구매 기록을 계량경제학 모형으로 분석했다.',
  },
  {
    authors: '김민혜, 이윤지, Khin Chan Myae Nyein, 임보람',
    year: '2025',
    title: '식료품 리테일러의 새벽배송 서비스 제공 효과 분석',
    venue: '서비스 연구',
    detail: '새벽배송 도입 전후의 소비자 구매 데이터로 매출 변화를 검증했다.',
  },
  {
    authors: '박서영, 임보람',
    year: '2023',
    title: '건강과 환경 메시지 프레이밍에 따른 소비자 태도와 구전에 미치는 영향',
    venue: '서비스 연구, 13(3), 127–146',
    detail: '비건 제품 광고에서 건강을 앞세운 문구와 환경을 앞세운 문구의 효과를 비교했다.',
  },
  {
    authors: '임보람, 한상린',
    year: '2023',
    title: '식료품 리테일러의 새벽배송 서비스 제공 효과 분석',
    venue: '한국유통학회',
  },
  {
    authors: '임보람, 한상린, 송재필',
    year: '2020',
    title: '수퍼마켓의 모바일 앱 도입으로 인한 고객의 구매행동 변화 분석',
    venue: '한국유통학회',
  },
]

const WORKING: Paper[] = [
  {
    authors: 'Lim, Boram, Hyeongtak Lee, and Ramkumar Janakiraman',
    year: '진행 중',
    title: 'Health Product Choice by Time of Day',
    venue: '시간대에 따라 건강 관련 제품 선택이 달라지는지를 구매 로그로 검증한다.',
  },
  {
    authors: 'Lim, Boram, Harsha Kamatham, and Brian T. Ratchford',
    year: '진행 중',
    title: 'Store Entry Model for Multi-Channel Retailers',
    venue: '온라인과 오프라인을 함께 운영하는 소매업체가 어디에 매장을 열어야 하는지를 모형으로 푼다.',
    axis: 'forecast',
  },
  {
    authors: 'Lim, Boram and Harsha Kamatham',
    year: '진행 중',
    title:
      'Understanding complementarity and substitutability among products in online and offline channel',
    venue: '머신러닝으로 채널별 제품 간 보완·대체 관계를 추정한다.',
    axis: 'forecast',
  },
  {
    authors: 'Lim, Boram and Paul Parker',
    year: '진행 중',
    title: 'The Effect of Take-A-Break Notification on Social Media Addiction',
    venue: '사용 중단을 권하는 알림이 소셜미디어 과다 사용을 줄이는지를 실험으로 확인한다.',
  },
  {
    authors: 'Lim, Boram and Paul Parker',
    year: '진행 중',
    title: 'Social media use and offline interpersonal outcomes',
    venue: '소셜미디어 사용량이 대면 관계에 남기는 결과를 측정한다.',
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
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          실제 기업의 구매 데이터를 다룬 연구가 대부분이고, 최근 연구는 LLM 멀티에이전트
          모델링과 AI 예측 두 축으로 이어집니다.
        </p>
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
        <h2 className="text-xl font-bold text-text">진행 중인 연구</h2>
        <p className="mt-2 text-sm text-muted">
          아래 연구는 심사 중이거나 집필 중이어서 결과 수치를 싣지 않았습니다.
        </p>
        <ul className="mt-4">
          {WORKING.map((p) => (
            <PaperItem key={p.title} paper={p} />
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

      <section className="mx-auto mt-14 max-w-[720px] rounded-xl border border-border bg-surface p-6">
        <h2 className="text-base font-bold text-text">학회 발표</h2>
        <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">
          INFORMS Marketing Science Conference에서 2016년 푸단대학교, 2017년 서던캘리포니아대학교,
          2021년 발표를 했습니다. 그 밖에 University of Houston 박사 심포지엄(2018), London Business
          School TDAC(2016), University of Alberta Choice Symposium(2016)에서 발표했습니다.
        </p>
      </section>
    </div>
  )
}
