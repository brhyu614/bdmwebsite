import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Teaching',
  description:
    '임보람 교수의 강의 이력과 수업 방식. 학생이 AI 에이전트를 만들고 그 에이전트가 낸 성과물로 평가받는 수업을 운영합니다. 한양대학교, University of Kansas, University of Texas at Dallas 강의 기록.',
  alternates: { canonical: '/teaching' },
}

const COURSES = [
  {
    school: '한양대학교',
    en: 'Hanyang University',
    period: '2022년부터',
    role: '경영학부 마케팅 전공, 공과대학 데이터사이언스학부 겸직',
    items: [
      { name: '마케팅 조사방법', level: '학부' },
      { name: '마케팅관리', level: '학부' },
      { name: '고급마케팅', level: '박사과정' },
      { name: '비즈니스랩 빅데이터마케팅 랩', level: '학부 연구실 수업' },
    ],
  },
  {
    school: 'University of Kansas',
    en: '캔자스 대학교',
    period: '2019년부터 2022년까지',
    role: '경영학부 조교수',
    items: [
      { name: 'Digital Marketing and Social Media', level: '학부' },
      { name: 'Pricing', level: '학부, 2020년 봄' },
    ],
  },
  {
    school: 'University of Texas at Dallas',
    en: '텍사스 대학교 댈러스',
    period: '2013년부터 2018년까지',
    role: '박사과정 강의와 조교',
    items: [
      { name: 'Principles of Marketing', level: '강의, 2016년 가을·2017년 가을·2018년 봄' },
      { name: 'Brand Management', level: '조교, 2013년 봄' },
      { name: 'Marketing Research', level: '조교, 2014년 봄' },
      { name: 'Applied Econometrics', level: '조교, 2015년 봄' },
    ],
  },
]

const CRITERIA = [
  {
    t: '일관성',
    d: '같은 과제를 열 번 시켰을 때 결과가 얼마나 흔들리지 않는지를 봅니다. 한 번 잘 나온 결과는 운일 수 있습니다.',
  },
  {
    t: '자동화 정도',
    d: '사람이 중간에 손대지 않고 끝까지 돌아가는지를 봅니다. 중간에 사람이 고쳐 쓴 만큼 점수가 내려갑니다.',
  },
  {
    t: '성과 비교',
    d: '같은 과제를 맡은 다른 학생의 에이전트와 결과를 나란히 놓고 비교합니다. 기준은 조회 수와 반응처럼 밖에서 매겨지는 숫자입니다.',
  },
  {
    t: '설계 설명',
    d: '왜 그렇게 설계했는지를 설명하게 합니다. 남의 설정을 그대로 가져다 쓴 경우와 직접 판단한 경우를 여기서 가릅니다.',
  },
]

export default function TeachingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="person" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Teaching</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          학생이 만든 에이전트가 성적표를 쓴다
        </h1>
        <div className="mt-6 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            이 연구실의 수업에서 학생은 과제물을 직접 쓰지 않습니다. 학생은 일을 대신할 AI
            에이전트를 만들고, 그 에이전트가 만들어 낸 성과물로 평가받습니다. 보고서를 잘 쓰는 능력
            대신, 보고서를 쓰는 기계를 설계하는 능력을 기릅니다.
          </p>
          <p>
            첫 적용 분야는 소셜미디어 콘텐츠 제작입니다. 조회 수와 반응이 며칠 안에 숫자로 나와
            성과를 바로 확인할 수 있기 때문입니다. 학생은 주제를 고르는 에이전트, 원고를 쓰는
            에이전트, 결과를 보고 다음 주제를 고치는 에이전트를 이어 붙여 하나의 작업 흐름을
            만듭니다.
          </p>
        </div>
      </section>

      {/* 평가 기준 */}
      <section className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">네 가지 평가 기준</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {CRITERIA.map((c, i) => (
            <div key={c.t} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-accent">{`0${i + 1}`}</span>
                <h3 className="text-sm font-bold text-text">{c.t}</h3>
              </div>
              <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 강의 이력 */}
      <section className="mx-auto mt-20 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">강의 이력</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          2013년 텍사스 대학교 댈러스에서 조교로 시작해 캔자스 대학교 조교수를 거쳤고, 2022년부터
          한양대학교에서 학부와 박사과정 수업을 맡고 있습니다. 강의 경력은 13년입니다.
        </p>

        <div className="mt-8 space-y-6">
          {COURSES.map((c) => (
            <div key={c.school} className="rounded-xl border border-border bg-surface p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-bold text-text">{c.school}</h3>
                <span className="text-xs text-muted">{c.en}</span>
                <span className="ml-auto rounded bg-accent-bg px-2 py-0.5 font-mono text-[11px] text-accent">
                  {c.period}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-subtext">{c.role}</p>
              <ul className="mt-4 space-y-2">
                {c.items.map((it) => (
                  <li
                    key={it.name}
                    className="flex flex-wrap items-baseline gap-x-3 border-b border-border pb-2 text-sm last:border-0"
                  >
                    <span className="font-medium text-text">{it.name}</span>
                    <span className="font-mono text-[11px] text-muted">{it.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 연결 */}
      <section className="mx-auto mt-16 max-w-[820px] rounded-2xl border border-border bg-surface p-7">
        <h2 className="text-lg font-bold text-text">수업에서 연구로</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          학부 수업에서 만든 에이전트가 비즈니스랩 과제로 이어지고, 비즈니스랩 과제가 창업경진대회
          출품과 연구 참여로 이어집니다. 2025년 창업경진대회 우수상은 비즈니스랩 과제에서 나온
          결과물입니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/bizlab"
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            비즈니스랩 기록 보기
          </Link>
          <Link
            href="/join"
            className="rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-accent/40"
          >
            대학원 진학 안내
          </Link>
        </div>
      </section>
    </div>
  )
}
