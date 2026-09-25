import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Press',
  description:
    '빅데이터마케팅 랩(BDM Lab) 임보람 교수의 언론 보도와 기고. 동아비즈니스리뷰(DBR) 기고, 대한민국마케팅대상 수상, 연구 보도를 모았습니다.',
  alternates: { canonical: '/press' },
}

type Item = {
  outlet: string
  title: string
  date: string
  summary: string
  url?: string
  issue?: string
}

const DBR: Item[] = [
  {
    outlet: '동아비즈니스리뷰',
    issue: '442호 (2026년 6월 Issue 1)',
    title: 'AI가 인용한 브랜드, 광고 클릭 91% 올라',
    date: '2026-05-26',
    summary:
      'AI가 검색 결과를 요약해 버리는 환경에서도 검색 광고의 성과가 유지되는 조건을 다뤘습니다. 제품 페이지에 수치와 데이터를 명시한 브랜드가 AI 답변에 인용되고, 인용된 브랜드의 광고 클릭이 올라갑니다.',
    url: 'https://dbr.donga.com/article/view/1202/article_no/12147',
  },
  {
    outlet: '동아비즈니스리뷰',
    issue: '432호 (2026년 1월 Issue 1)',
    title: "AI와 대화 중 결제하는 '에이전틱 커머스' 시대",
    date: '2025-12-23',
    summary:
      '소비자가 검색창을 거치지 않고 AI와 대화하다 바로 결제하는 흐름을 분석했습니다. 검색 플랫폼이 살아남으려면 소비자가 묻기 전에 신뢰할 만한 제안을 먼저 내놓아야 한다고 썼습니다.',
    url: 'https://dbr.donga.com/article/view/1904/article_no/11961',
  },
]

const RESEARCH_NEWS: Item[] = [
  {
    outlet: 'University of Kansas News',
    title:
      'Grocery returns lead to greater customer engagement and increase in sales, research finds',
    date: '2026-09-24',
    summary:
      'Journal of Retailing에 실린 식료품 반품 연구를 소개했습니다. 반품 이후 같은 소매업체에서의 지출이 40.1% 늘고, 다양성을 추구하는 상위 25% 집단에서는 증가폭이 100%를 넘습니다.',
    url: 'https://news.ku.edu/news/article/grocery-returns-lead-to-greater-customer-engagement-and-increase-in-sales-research-finds',
  },
]

const AWARD_NEWS: Item[] = [
  {
    outlet: '뉴스H',
    title: '임보람 교수, 대한민국마케팅대상 연구 부문 특별상 수상',
    date: '2025-03-21',
    summary:
      '한국마케팅협회가 주관한 2025 제13회 대한민국마케팅대상에서 연구 부문 특별상을 받았습니다. 시상식은 잠실 롯데호텔월드에서 열렸습니다.',
    url: 'https://www.newshyu.com/news/articleView.html?idxno=1018047',
  },
  {
    outlet: '소비자평가',
    title: '한양대학교 임보람 교수, 대한민국마케팅대상 연구 부문 특별상 수상',
    date: '2025-03-21',
    summary:
      '데이터 기반 마케팅 전략 연구와 실무 교육 성과를 수상 사유로 들었습니다. AI 매출 예측, SNS 마케팅 효과 분석, LLM 소비자 시뮬레이션 연구를 함께 소개했습니다.',
    url: 'https://www.iconsumer.or.kr/news/articleView.html?idxno=27538',
  },
]

const INTERVIEWS: Item[] = [
  {
    outlet: '뉴스H',
    title: '임보람 교수, 데이터분석으로 마케팅·소비자 행동 연구의 길을 밝히다',
    date: '2025-04-03',
    summary:
      '토목공학에서 통계학 석사와 마케팅 박사로 옮겨 간 과정을 다뤘습니다. 새벽배송이 오프라인 식료품 매장에 미친 영향을 분석한 결과도 소개했습니다. 대형마트가 가장 크게 타격을 받은 반면 편의점은 영향이 적거나 오히려 매출이 늘었습니다.',
    url: 'https://www.newshyu.com/news/articleView.html?idxno=1018188',
  },
]

function Card({ item, big = false }: { item: Item; big?: boolean }) {
  const Wrapper = item.url ? 'a' : 'div'
  return (
    <Wrapper
      {...(item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group block rounded-xl border bg-surface transition-colors ${
        big ? 'border-accent/30 p-7' : 'border-border p-5 hover:border-accent/40'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-accent-bg px-2 py-0.5 font-mono text-[10px] text-accent">
          {item.outlet}
        </span>
        {item.issue && <span className="font-mono text-[10px] text-muted">{item.issue}</span>}
        <span className="font-mono text-[10px] text-muted">{item.date}</span>
      </div>
      <h3
        className={`mt-2.5 font-bold leading-snug text-text group-hover:text-accent ${
          big ? 'text-xl' : 'text-base'
        }`}
      >
        {item.title}
      </h3>
      <p className="mt-2.5 font-serif text-sm leading-[1.85] text-subtext">{item.summary}</p>
      {item.url && (
        <p className="mt-3 font-mono text-xs text-accent group-hover:underline">원문 보기</p>
      )}
    </Wrapper>
  )
}

export default function PressPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="person" />

      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Press</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          언론 보도와 기고
        </h1>
      </section>

      {/* DBR */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold text-text">동아비즈니스리뷰 기고</h2>
          <span className="font-mono text-xs text-muted">DBR</span>
        </div>
        <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">
          동아일보가 발행하는 경영 전문지입니다. 아래 두 편은 AI가 검색과 결제를 대신하기 시작한
          환경에서 기업이 무엇을 바꿔야 하는지를 다뤘습니다.
        </p>
        <div className="mt-6 space-y-4">
          {DBR.map((d) => (
            <Card key={d.title} item={d} big />
          ))}
        </div>
      </section>

      {/* 연구 보도 */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">연구 보도</h2>
        <div className="mt-6 space-y-4">
          {RESEARCH_NEWS.map((d) => (
            <Card key={d.title} item={d} />
          ))}
        </div>
      </section>

      {/* 수상 */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">수상 보도</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {AWARD_NEWS.map((d) => (
            <Card key={d.outlet + d.title} item={d} />
          ))}
        </div>
      </section>

      {/* 인터뷰 */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">인터뷰</h2>
        <div className="mt-6 space-y-4">
          {INTERVIEWS.map((d) => (
            <Card key={d.title} item={d} />
          ))}
        </div>
      </section>

    </div>
  )
}
