import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: '합류 (Join the Lab)',
  description:
    '빅데이터마케팅 랩 대학원생 모집. AI 예측, LLM 멀티에이전트 시뮬레이션, 인과분석, 디지털 마케팅 연구. 무엇을 연구하고 무엇을 배우는지, 어떻게 지원하는지.',
  alternates: { canonical: '/join' },
}

const TOPICS = [
  { title: 'AI 예측', desc: '매출·수요·인구를 머신러닝으로 예측하고, SHAP으로 메커니즘을 해석한다.' },
  { title: 'LLM 멀티에이전트 시뮬레이션', desc: '소비자를 디지털 트윈으로 복제해 합성 FGI·시장 시뮬레이션을 설계한다.' },
  { title: '인과분석', desc: 'DID·구조모형으로 캠페인·정책의 진짜 효과를 추정한다.' },
  { title: '디지털 마케팅 데이터', desc: '대규모 소셜·이미지 데이터를 구축하고 컴퓨터 비전·NLP로 정량화한다.' },
]

const GAINS = [
  { title: '방법론', desc: 'XGBoost·인과추론·LLM 에이전트·컴퓨터 비전까지, 실제 데이터로 손에 익힌다.' },
  { title: '논문', desc: '연구를 국제 학술지 게재까지 끌고 가는 전 과정을 함께 한다.' },
  { title: '기업 프로젝트', desc: '실제 기업 데이터를 다루는 용역·공동연구에 참여해 실무 감각을 쌓는다.' },
]

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Join the Lab</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          데이터로 소비자를 읽는 연구, 함께 합니다.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          빅데이터마케팅 랩은 마케팅 질문을 데이터와 AI로 푸는 연구실입니다. 예측하고,
          복제하고, 해독하는 일에 호기심이 있는 분을 찾습니다.
        </p>
      </section>

      {/* 무엇을 연구하나 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">무엇을 연구하나</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <div key={t.title} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-bold text-text">{t.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-subtext">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 무엇을 얻나 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">무엇을 얻나</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {GAINS.map((g) => (
            <div key={g.title} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-bold text-accent">{g.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-subtext">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 어떤 사람 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">이런 분을 찾습니다</h2>
        <ul className="mt-5 space-y-2 text-base leading-relaxed text-subtext">
          <li>· 통계·프로그래밍(R/Python)에 거부감이 없고, 배우려는 의지가 있는 분</li>
          <li>· 숫자 뒤의 &lsquo;왜&rsquo;를 끝까지 묻는 분</li>
          <li>· 마케팅·소비자행동·데이터사이언스 중 하나라도 진심인 분</li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          전공·배경은 제한하지 않습니다. 경영·통계·공학·심리 어디서 와도 좋습니다.
        </p>
      </section>

      {/* 지원 방법 */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">지원 방법</h2>
        <p className="mt-3 text-base leading-relaxed text-subtext">
          간단한 자기소개와 관심 연구 주제를 적어 이메일로 보내주세요. 가볍게 커피챗부터
          시작해도 좋습니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#0B0F14] transition-opacity hover:opacity-90"
          >
            {CONTACT_EMAIL}
          </a>
          <Link
            href="/research"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-subtext transition-colors hover:border-accent hover:text-accent"
          >
            연구 먼저 보기
          </Link>
        </div>
      </section>
    </div>
  )
}
