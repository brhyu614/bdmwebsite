import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SemesterAccordion from '@/components/bizlab/SemesterAccordion'

export const metadata: Metadata = {
  title: '비즈니스랩',
  description:
    '한양대학교 경영대학 비즈니스랩(Hanyang Business Lab)의 빅데이터마케팅 랩 운영 기록. 2023년 1학기부터 7개 학기 동안 학부생이 수행한 데이터 분석과 서비스 개발 과제를 정리했습니다.',
  alternates: { canonical: '/bizlab' },
}

const SEMESTERS = [
  {
    term: '2026년 1학기',
    theme: '멀티에이전트 표적집단면접(FGI) 시스템',
    work: [
      'AI 에이전트가 진행하는 표적집단면접(FGI)의 질문지 설계와 진행 규칙 제작',
      '응답자 성향을 여섯 축으로 나눠 화면에 보여 주는 시제품 개발',
      '포토 부스 이용자 응답 자료를 받아 에이전트 답변과 대조',
    ],
    output: '표적집단면접 시제품과 기술 설계서, 창업경진대회 제출 자료',
    detail: [
      { label: '질문지 설계', body: 'AI 에이전트가 사람을 대신해 질문을 던질 때 무엇을 먼저 묻고 어디서 파고들지를 규칙으로 적었습니다. 응답자가 짧게 답하면 다시 물어 들어가는 조건, 화제를 바꿀 시점, 면접을 끝낼 조건을 문서로 남겼습니다.' },
      { label: '성향 표시 화면', body: '응답자의 성향을 여섯 축으로 나눠 화면에 보여 주는 시제품을 만들었습니다. 응답을 읽고 축마다 점수를 매기는 방식과 그 점수를 그림으로 보여 주는 방식을 함께 설계했습니다.' },
      { label: '검증', body: '셀프사진관 이용자의 실제 응답 자료를 받아, 같은 질문에 대한 에이전트의 답과 사람의 답을 나란히 놓고 비교했습니다.' },
      { label: '팀 구성', body: '두 팀으로 나눠 한 팀은 면접 진행 규칙을, 다른 팀은 화면과 성향 분석을 맡았습니다.' },
    ],
  },
  {
    term: '2025년 2학기',
    theme: 'AI 인터뷰 자동화 도구의 시장 검증',
    work: [
      '인터뷰 자동화 도구를 파는 국내외 회사 조사와 기능 비교',
      '설문 플랫폼이 실제로 돈을 벌 수 있는 조건 분석',
      '인터뷰 질문지 설계 규칙 정리와 화면 개선안 제작',
    ],
    output: '시장 조사 보고서 4건과 화면 설계안',
    detail: [
      { label: '경쟁 도구 조사', body: '인터뷰 자동화 도구를 파는 국내외 회사를 찾아 기능을 항목별로 비교했습니다. 무엇을 자동화했고 무엇을 사람이 하는지, 가격을 어떻게 매기는지를 표로 정리했습니다.' },
      { label: '수익 구조 분석', body: '설문 플랫폼이 실제로 돈을 버는 조건을 따졌습니다. 응답자 모집 비용, 재사용 가능한 문항의 비중, 반복 의뢰 여부를 기준으로 삼았습니다.' },
      { label: '질문지 설계 규칙', body: '좋은 인터뷰 질문이 갖춰야 할 조건을 정리하고, 화면에서 질문을 만드는 흐름을 개선안으로 냈습니다.' },
      { label: '추가 과제', body: '투표 기반 소셜 앱 사례를 조사해 별도의 사업 모델 제안서를 만들었습니다.' },
    ],
  },
  {
    term: '2025년 1학기',
    theme: '인터뷰 기반 조사 설계와 응답 데이터 분석',
    work: [
      '생활 행태와 웰빙 수준을 묻는 설문 설계와 응답 분석',
      '설문 시장의 규모와 경쟁 구도 분석',
      '응답 자료를 실시간 도표로 바꾸는 분석 코드 작성',
    ],
    output: '설문 결과 보고서와 분석 코드, 중간발표와 최종발표 자료',
    detail: [
      { label: '설문 설계와 수집', body: '생활 행태와 웰빙 수준을 묻는 설문을 설계하고 응답을 모아 분석했습니다. 문항마다 무엇을 재려는지 먼저 정하고 문항을 썼습니다.' },
      { label: '시장 분석', body: '국내 설문 시장의 규모와 주요 사업자를 조사해 경쟁 구도를 정리했습니다.' },
      { label: '분석 코드', body: '응답 자료를 받아 실시간으로 도표를 그리는 코드를 작성했습니다. 응답이 들어오는 대로 결과가 갱신되는 구조입니다.' },
      { label: '자료 구조 설계', body: '응답과 응답자와 문항의 관계를 정리한 데이터베이스 구조도를 만들었습니다.' },
      { label: '발표', body: '중간발표와 최종발표 자료를 만들어 랩 단위 발표회에서 보고했습니다.' },
    ],
  },
  {
    term: '2024년 2학기',
    theme: '브랜드 협업 과제와 응용 서비스 개발',
    work: [
      '패션 브랜드와 함께 소비자 자료를 분석하는 과제 수행',
      '앱 개발 과제 진행과 연구 윤리 심의 서류 준비',
      '할인 쿠폰 사용 기록 분석',
    ],
    output: '프로젝트 기록 문서와 최종보고회 발표 자료',
    detail: [
      { label: '브랜드 협업 과제', body: '패션 브랜드와 함께 소비자 자료를 분석하는 과제를 수행했습니다. 기업이 가진 실제 자료를 받아 다뤘습니다.' },
      { label: '앱 개발', body: '분석 결과를 쓰는 응용 서비스를 앱으로 만드는 과제를 진행했습니다.' },
      { label: '연구 윤리 심의', body: '사람을 대상으로 하는 조사에 필요한 연구 윤리 심의 서류를 준비했습니다.' },
      { label: '쿠폰 분석', body: '할인 쿠폰 사용 기록을 분석해 어떤 조건에서 쿠폰이 쓰이는지 확인했습니다.' },
      { label: '주간 회의 기록', body: '팀별 주간 회의록을 남겨 진행 상황을 추적했습니다.' },
    ],
  },
  {
    term: '2024년 1학기',
    theme: '상권 분석과 자료 수집 도구 제작',
    work: [
      '상권 보고서를 읽고 분석 항목을 정리',
      '웹에서 매장과 경쟁사 자료를 모으는 수집 도구 제작',
      '기업과 진행 상황을 공유하는 중간 보고',
    ],
    output: '활동계획서와 기업 공유 보고서, 학기 과제 결과물',
    detail: [
      { label: '상권 보고서 분석', body: '상용 상권 분석 보고서를 읽고 어떤 항목이 들어가는지, 그 항목을 무엇으로 계산하는지 정리했습니다.' },
      { label: '자료 수집 도구', body: '웹에서 매장 정보와 경쟁사 정보를 모으는 수집 도구를 직접 만들었습니다.' },
      { label: '기업 공유', body: '4월에 중간 진행 상황을 기업과 공유하는 보고 자리를 가졌습니다.' },
      { label: '방학 과제', body: '학기 과제와 별도로 방학 기간 과제를 이어서 진행했습니다.' },
    ],
  },
  {
    term: '2023년 2학기',
    theme: '행정동 생활인구 분석',
    work: [
      '전국 행정구역 분류표와 생활인구 자료 정리',
      '행정동 사이의 거리를 계산해 상권 범위를 추정',
      '분석 결과를 투자 설명 자료로 정리',
    ],
    output: '행정동 단위 분석 코드와 설명 자료',
    detail: [
      { label: '자료 정리', body: '전국 행정구역 분류표와 행정동별 생활인구 자료를 받아 분석에 쓸 수 있는 형태로 정리했습니다.' },
      { label: '거리 계산', body: '행정동 사이의 거리를 계산해 한 매장이 실제로 손님을 끌어오는 범위를 추정했습니다. R로 좌표를 다뤘습니다.' },
      { label: '투자 설명 자료', body: '분석 결과를 투자 설명 자료로 정리했습니다.' },
    ],
  },
  {
    term: '2023년 1학기',
    theme: '데이터 분석 기초와 사업 기획',
    work: [
      'R을 이용한 자료 처리와 분석 훈련',
      '기업 지원 과제에 필요한 자료 조사',
      '사업계획서 작성과 수정',
    ],
    output: '사업계획서와 분석 실습 결과물',
    detail: [
      { label: '분석 훈련', body: 'R로 자료를 불러오고 정리하고 그림을 그리는 기초 훈련을 했습니다. 원자료를 직접 다루는 일부터 시작했습니다.' },
      { label: '자료 조사', body: '기업 지원 과제에 필요한 자료를 찾아 정리했습니다.' },
      { label: '사업계획서', body: '사업계획서를 쓰고 여러 차례 고쳐 완성했습니다.' },
    ],
  },
]

const AWARDS = [
  {
    year: '2025',
    name: '창업경진대회 우수상',
    detail: '비즈니스랩 과제로 만든 AI 표적집단면접 서비스로 수상했습니다.',
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

        <SemesterAccordion semesters={SEMESTERS} />
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
