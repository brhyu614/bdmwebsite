import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: '비즈니스랩',
  description:
    '한양대학교 경영대학 비즈니스랩(Hanyang Business Lab)의 빅데이터마케팅 랩 운영 기록. 2023년 1학기부터 7개 학기 동안 학부생이 수행한 데이터 분석과 서비스 개발 과제를 정리했습니다.',
  alternates: { canonical: '/bizlab' },
}

type Semester = {
  term: string
  year: string
  theme: string
  work: string[]
  output: string
}

const SEMESTERS: Semester[] = [
  {
    term: '2026년 1학기',
    year: '2026',
    theme: '멀티에이전트 집단 면접 시스템',
    work: [
      'AI 에이전트가 진행하는 집단 면접의 질문지 설계와 진행 규칙 제작',
      '응답자 성향을 여섯 축으로 나눠 화면에 보여 주는 시제품 개발',
      '포토 부스 이용자 응답 자료를 받아 에이전트 답변과 대조',
    ],
    output: '집단 면접 시제품과 기술 설계서, 창업경진대회 제출 자료',
  },
  {
    term: '2025년 2학기',
    year: '2025',
    theme: 'AI 인터뷰 자동화 도구의 시장 검증',
    work: [
      '인터뷰 자동화 도구를 파는 국내외 회사 조사와 기능 비교',
      '설문 플랫폼이 실제로 돈을 벌 수 있는 조건 분석',
      '인터뷰 질문지 설계 규칙 정리와 화면 개선안 제작',
    ],
    output: '시장 조사 보고서 4건과 화면 설계안',
  },
  {
    term: '2025년 1학기',
    year: '2025',
    theme: '인터뷰 기반 조사 설계와 응답 데이터 분석',
    work: [
      '생활 행태와 웰빙 수준을 묻는 설문 설계와 응답 분석',
      '설문 시장의 규모와 경쟁 구도 분석',
      '응답 자료를 실시간 도표로 바꾸는 분석 코드 작성',
    ],
    output: '설문 결과 보고서와 분석 코드, 중간발표와 최종발표 자료',
  },
  {
    term: '2024년 2학기',
    year: '2024',
    theme: '브랜드 협업 과제와 응용 서비스 개발',
    work: [
      '패션 브랜드와 함께 소비자 자료를 분석하는 과제 수행',
      '앱 개발 과제 진행과 연구 윤리 심의 서류 준비',
      '할인 쿠폰 사용 기록 분석',
    ],
    output: '프로젝트 기록 문서와 최종보고회 발표 자료',
  },
  {
    term: '2024년 1학기',
    year: '2024',
    theme: '상권 분석과 자료 수집 도구 제작',
    work: [
      '상권 보고서를 읽고 분석 항목을 정리',
      '웹에서 매장과 경쟁사 자료를 모으는 수집 도구 제작',
      '기업과 진행 상황을 공유하는 중간 보고',
    ],
    output: '활동계획서와 기업 공유 보고서, 학기 과제 결과물',
  },
  {
    term: '2023년 2학기',
    year: '2023',
    theme: '행정동 생활인구 분석',
    work: [
      '전국 행정구역 분류표와 생활인구 자료 정리',
      '행정동 사이의 거리를 계산해 상권 범위를 추정',
      '분석 결과를 투자 설명 자료로 정리',
    ],
    output: '행정동 단위 분석 코드와 설명 자료',
  },
  {
    term: '2023년 1학기',
    year: '2023',
    theme: '데이터 분석 기초와 사업 기획',
    work: [
      'R을 이용한 자료 처리와 분석 훈련',
      '기업 지원 과제에 필요한 자료 조사',
      '사업계획서 작성과 수정',
    ],
    output: '사업계획서와 분석 실습 결과물',
  },
]

const AWARDS = [
  {
    year: '2025',
    name: '창업경진대회 우수상',
    detail: '비즈니스랩 과제로 만든 AI 집단 면접 서비스로 수상했습니다.',
  },
]

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-5 text-center">
      <p className="font-mono text-2xl font-bold text-accent">{value}</p>
      <p className="mt-1 text-xs text-subtext">{label}</p>
    </div>
  )
}

export default function BizLabPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Business Lab</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          한 학기를 통째로 쓰는 연구실 수업
        </h1>
        <div className="mt-6 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            한양대학교 경영대학 비즈니스랩은 선발된 학부생이 한 학기 동안 연구실에 들어와 실제
            과제를 수행하는 제도입니다. 수강생은 9학점을 받고, 팀은 4명에서 5명으로 짜이며, 학기
            중에는 경영대학 3층 실습실에 주 2회 이상 나옵니다. 2026년 1학기 기준으로 아홉 개
            연구실이 참여하고 있고, 빅데이터마케팅 랩은 그중 하나입니다.
          </p>
          <p>
            이 연구실은 2023년 1학기부터 2026년 1학기까지 7개 학기를 운영했습니다. 학생이 맡은 일은
            학기마다 달라졌습니다. 초기에는 행정동 인구와 상권 자료를 다뤘고, 최근에는 AI 에이전트가
            사람을 인터뷰하는 시스템을 만들었습니다.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value="7" label="운영 학기" />
          <Stat value="9" label="학점" />
          <Stat value="4–5" label="팀 인원" />
          <Stat value="1" label="창업경진대회 수상" />
        </div>
      </section>

      {/* 학기별 기록 */}
      <section className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">학기별 과제 기록</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          아래는 학기마다 학생이 실제로 만든 결과물입니다. 과제는 연구실의 두 연구 축과 이어지도록
          골랐습니다. 상권과 인구 분석은 예측 축으로, 인터뷰 자동화와 집단 면접은 LLM
          멀티에이전트 축으로 이어집니다.
        </p>

        <ol className="mt-8 space-y-6">
          {SEMESTERS.map((s) => (
            <li key={s.term} className="rounded-xl border border-border bg-surface p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="rounded bg-accent-bg px-2 py-0.5 font-mono text-xs text-accent">
                  {s.term}
                </span>
                <h3 className="text-base font-bold text-text">{s.theme}</h3>
              </div>
              <ul className="mt-4 space-y-1.5">
                {s.work.map((w) => (
                  <li key={w} className="flex gap-2 font-serif text-sm leading-[1.8] text-subtext">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border pt-3 text-xs text-muted">
                <span className="font-mono text-accent">산출물</span> {s.output}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 수상 */}
      <section className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">수상</h2>
        <ul className="mt-5 space-y-3">
          {AWARDS.map((a) => (
            <li key={a.name} className="rounded-xl border border-accent/30 bg-accent-bg p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-accent">{a.year}</span>
                <h3 className="text-base font-bold text-text">{a.name}</h3>
              </div>
              <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">{a.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 학생이 얻는 것 */}
      <section className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">학생이 가져가는 것</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              t: '실제 기업 자료',
              d: '연습용으로 만든 자료 대신, 기업이 실제로 쌓은 구매 기록과 매장 자료를 다룹니다. 결측값과 오류가 섞인 자료를 정리하는 일부터 시작합니다.',
            },
            {
              t: '끝까지 가는 경험',
              d: '분석에서 멈추지 않고 발표 자료와 보고서까지 만듭니다. 중간발표와 최종발표를 거치며 남에게 설명하는 훈련을 합니다.',
            },
            {
              t: '다음 단계로 가는 길',
              d: '비즈니스랩에서 한 과제가 창업경진대회 출품, 대학원 진학, 연구 참여로 이어집니다.',
            },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-bold text-text">{c.t}</h3>
              <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 지원 */}
      <section className="mx-auto mt-16 max-w-[820px] rounded-2xl border border-border bg-surface p-7">
        <h2 className="text-lg font-bold text-text">지원 방법</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          모집은 학기 사이 방학에 진행합니다. 지원 자격은 학부 3학년과 4학년이고, 경영대학 소속이
          아니어도 지원할 수 있습니다. 공학 계열 학생의 참여를 특히 환영합니다. 지원서는 전자우편으로
          제출하고, 선발은 지도교수가 합니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://biz.hanyang.ac.kr/bizlab"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            비즈니스랩 공식 안내
          </a>
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
