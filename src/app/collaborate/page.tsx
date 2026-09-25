import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Collaborate',
  description:
    '빅데이터마케팅 랩(BDM Lab)과 기업이 함께 푸는 문제. 출점 후보지 진단, 가맹점 매출 하락 위험 진단, 협업 상품 매출 예측.',
  alternates: { canonical: '/collaborate' },
}

const SERVICES = [
  {
    no: '01',
    title: '출점 후보지 진단',
    question: '이 자리에 매장을 열면 얼마를 법니까.',
    output:
      '후보 주소마다 예상 매출 범위와 1년 안에 문 닫을 가능성을 함께 냅니다. 어느 변수가 그 판단을 밀어 올렸는지도 숫자로 적습니다.',
    basis: '치킨 프랜차이즈 349개 매장과 슈퍼마켓 284개 매장을 분석한 모형',
  },
  {
    no: '02',
    title: '가맹점 매출 하락 위험 진단',
    question: '어느 가맹점을 먼저 챙겨야 합니까.',
    output:
      '매출이 꺾이기 전에 나타나는 신호를 찾아 먼저 관리해야 할 가맹점 명단을 냅니다. 명단마다 위험 근거를 붙입니다.',
    basis: '매장별 운영 기록과 상권 자료를 결합한 조기 경보 모형',
  },
  {
    no: '03',
    title: '협업 상품 매출 예측',
    question: '이 연예인과 손잡으면 매출이 얼마나 오릅니까.',
    output:
      '협업 대상별 예상 매출을 내고, 인기가 오르내리는 요인을 분해합니다. 계약 시점 판단에 씁니다.',
    basis: '셀프사진관 브랜드의 IP별 매출 예측 과제',
  },
]

const MODES = [
  {
    title: '기업 과제',
    desc: '범위와 기간을 정해 수행하고 보고서와 실행 가능한 모형을 납품합니다.',
  },
  {
    title: '공동연구',
    desc: '기업 데이터로 함께 연구하고 결과를 논문으로 발표합니다.',
  },
  {
    title: '자문과 교육',
    desc: '데이터 전략 자문과 실무진 대상 예측·인과분석 워크숍을 맡습니다.',
  },
]

const TRUST = [
  {
    stat: '국제 저널',
    label: 'Journal of Retailing과 Journal of Retailing and Consumer Services 게재',
  },
  { stat: '매장 633개', label: '치킨 프랜차이즈 349개와 슈퍼마켓 284개의 매출·수요 예측 시스템 납품' },
  { stat: '기업 과제', label: '유통·프랜차이즈 매출 예측 시스템 납품과 한국은행 경기본부 연구용역 수행' },
]

export default function CollaboratePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Collaborate</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          기업과 함께 푸는 문제
        </h1>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          출점, 가맹점 관리, 협업 상품. 결정하기 전에 매출과 폐업 가능성을 숫자로 확인합니다.
          연구실이 만든 예측 모형을 기업의 실제 자료에 적용해 답을 냅니다.
        </p>
      </section>

      {/* 서비스 */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">세 가지 진단</h2>
        <div className="mt-6 space-y-4">
          {SERVICES.map((s) => (
            <div key={s.no} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-lg font-bold text-accent">{s.no}</span>
                <h3 className="text-lg font-bold text-text">{s.title}</h3>
              </div>
              <p className="mt-3 font-serif text-base leading-[1.85] text-text">{s.question}</p>
              <p className="mt-2 font-serif text-sm leading-[1.85] text-subtext">{s.output}</p>
              <p className="mt-4 border-t border-border pt-3 font-mono text-[11px] text-muted">
                근거 {s.basis}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 협업 방식 */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">협업 방식</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {MODES.map((m) => (
            <div key={m.title} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-bold text-text">{m.title}</p>
              <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 신뢰 */}
      <section className="mx-auto mt-14 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">수행 근거</h2>
        <div className="mt-6 space-y-3">
          {TRUST.map((t) => (
            <div
              key={t.stat}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-border bg-surface p-5"
            >
              <span className="shrink-0 font-mono text-sm font-bold text-accent">{t.stat}</span>
              <span className="font-serif text-sm leading-[1.8] text-subtext">{t.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          고객사 이름과 계약 조건은 계약에 따라 공개하지 않습니다. 참고 사례가 필요하시면 문의
          시점에 안내합니다.
        </p>
        <div className="mt-5">
          <Link href="/projects" className="font-mono text-sm text-accent hover:underline">
            수행한 과제 전체 목록 보기
          </Link>
        </div>
      </section>

      {/* 문의 */}
      <section className="mx-auto mt-16 max-w-[820px] border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-text">문의</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          문제만 들고 오셔도 됩니다. 데이터로 풀 수 있는 문제인지부터 함께 판단합니다. 아래 네
          가지를{' '}
          <a href="mailto:brlim@hanyang.ac.kr" className="text-accent hover:underline">
            brlim@hanyang.ac.kr
          </a>
          로 보내 주시면 회신합니다.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {[
            '회사명과 업종',
            '브랜드명',
            '관심 주제 (출점, 가맹점 관리, 협업 상품 중 선택)',
            '연락처',
          ].map((f, i) => (
            <li
              key={f}
              className="flex items-baseline gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text"
            >
              <span className="font-mono text-xs text-accent">{`0${i + 1}`}</span>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <a
            href="mailto:brlim@hanyang.ac.kr?subject=%5BBDM%20Lab%5D%20%ED%98%91%EC%97%85%20%EB%AC%B8%EC%9D%98"
            className="inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            협업 문의 보내기
          </a>
        </div>
      </section>
    </div>
  )
}
