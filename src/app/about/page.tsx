import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { AUTHOR_NAME, INSTAGRAM_URL } from '@/lib/constants'

const AUTHOR_EMAIL = 'brlim@hanyang.ac.kr'

export const metadata: Metadata = {
  title: 'About',
  description: '한양대학교 임보람 교수의 빅데이터마케팅 랩(Big Data Marketing Lab). AI 예측, 인과분석, 플랫폼 알고리즘 연구.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="person" />
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">About</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          {AUTHOR_NAME}
        </h1>
        <p className="mt-2 text-base text-subtext">
          한양대학교 경영학부 교수
        </p>
        <p className="mt-0.5 font-mono text-xs text-muted">
          Big Data Marketing Lab
        </p>
      </section>

      {/* Story */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <div className="space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            원래 토목공학을 전공했습니다.
          </p>
          <p>
            대학생 때 코엑스에서 열린 기술 전시회에 간 적이 있습니다. 기술력이 뛰어난 회사의 부스에
            사람이 꼭 많지는 않더군요. 반대로 기술이 평범해 보이는데 사람이 북적이는 부스도 있었습니다.
            그날 알게 됐습니다 — <strong className="text-text">기술이 다가 아니라는 것.</strong>
          </p>
          <p>
            그렇다면 기술 외에 사람의 구매 결정에 영향을 미치는 건 무엇인가.
            이 질문이 저를 경영학 대학원으로 이끌었습니다.
            소비자의 마음을 숫자로 읽는 일에 매력을 느끼면서 통계학에 빠졌고,
            박사과정을 거쳐 캔자스 대학교에서 교수 생활을 시작했습니다.
          </p>
          <p>
            학교에 있지만, 관심은 항상 기업의 현장에 있습니다.
            배달앱에서 치킨집 매출을 예측하고, 새벽배송이 실제로 구매 행동을 바꾸는지 검증하고,
            플랫폼 알고리즘이 콘텐츠 도달에 어떤 영향을 미치는지 분석합니다.
            <strong className="text-text">연구실에서 논문만 쓰는 게 아니라,
            기업이 실제로 쓸 수 있는 근거를 만드는 것</strong>이 목표입니다.
          </p>
          <p>
            이 사이트는 그 작업의 기록입니다.
            연구 결과를 논문에만 가두지 않고, 실무자와 연구자 모두가 읽을 수 있는 언어로 풀어놓는 곳.
            직감 대신 데이터, 과장 대신 정확성 — 그 원칙으로 씁니다.
          </p>
        </div>
      </section>

      {/* Academic Background */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Background</p>
        <h2 className="mt-3 text-xl font-bold text-text">학력 및 경력</h2>
        <div className="mt-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex w-24 shrink-0 flex-col">
              <span className="font-mono text-xs text-muted">현재</span>
            </div>
            <div>
              <p className="font-bold text-text">한양대학교 경영학부 교수</p>
              <p className="text-sm text-subtext">빅데이터마케팅 랩(BDM Lab) 운영</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex w-24 shrink-0 flex-col">
              <span className="font-mono text-xs text-muted">이전</span>
            </div>
            <div>
              <p className="font-bold text-text">University of Kansas, Assistant Professor</p>
              <p className="text-sm text-subtext">School of Business — Marketing</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex w-24 shrink-0 flex-col">
              <span className="font-mono text-xs text-muted">Ph.D.</span>
            </div>
            <div>
              <p className="font-bold text-text">경영학 박사 (마케팅 전공)</p>
              <p className="text-sm text-subtext">계량 모델링, 소비자 행동, 통계학</p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Interests */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Research</p>
        <h2 className="mt-3 text-xl font-bold text-text">연구 관심사</h2>
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">AI 기반 예측</h3>
            <p className="mt-1 text-sm text-subtext">
              수요 예측, 매출 예측, 고객 행동 예측. 머신러닝으로 &ldquo;다음에 무슨 일이 일어날지&rdquo;를 추정합니다.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">인과분석</h3>
            <p className="mt-1 text-sm text-subtext">
              마케팅 캠페인이 실제로 효과가 있었는지. 상관관계가 아니라 인과관계를 밝히는 방법론을 연구합니다.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-bold text-text">플랫폼 알고리즘</h3>
            <p className="mt-1 text-sm text-subtext">
              소셜 미디어, 검색 엔진, AI 답변 엔진의 추천 시스템이 마케팅에 미치는 구조적 영향을 분석합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Contact</p>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          연구 협업, 기업 프로젝트, 대학원 진학 등 — 무엇이든.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <a
            href={`mailto:${AUTHOR_EMAIL}`}
            className="font-mono text-sm text-accent transition-colors hover:text-accent-dim"
          >
            {AUTHOR_EMAIL}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-subtext transition-colors hover:text-accent"
          >
            Instagram &rarr;
          </a>
        </div>
      </section>
    </div>
  )
}
