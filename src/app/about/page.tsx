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
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Professor</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          {AUTHOR_NAME}
        </h1>
        <p className="mt-2 text-base text-subtext">
          한양대학교 경영학부 / 데이터사이언스학부 교수
        </p>
        <p className="mt-0.5 font-mono text-xs text-muted">
          Big Data Marketing Lab
        </p>
      </section>

      {/* Story */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <div className="space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            원래 토목공학을 전공했다.
          </p>
          <p>
            대학생 때 코엑스에서 열린 기술 전시회에 간 적이 있다.
            기술력이 뛰어난 회사 부스에 사람이 꼭 많지는 않았다.
            반대로 기술은 평범해 보이는데 사람이 북적이는 부스도 있었다.
            그날 알게 됐다 — <strong className="text-text">기술이 다가 아니라는 것.</strong>
          </p>
          <p>
            그럼 기술 외에 사람의 구매 결정을 움직이는 건 뭘까.
            이 질문 하나가 나를 경영학 대학원으로 끌고 갔다.
            소비자의 마음을 숫자로 읽는 일에 꽂혀서 통계학에 빠졌고,
            텍사스에서 박사과정을 거쳐 캔자스 대학교에서 교수 생활을 시작했다.
          </p>
          <p>
            학교에 있지만, 관심은 늘 기업 현장이다.
            배달앱에서 치킨집 매출을 예측하고, 새벽배송이 진짜 구매를 바꾸는지 검증하고,
            플랫폼 알고리즘이 콘텐츠 도달에 어떤 영향을 주는지 분석한다.
            <strong className="text-text">논문만 쓰는 게 아니라,
            기업이 실제로 쓸 수 있는 근거를 만드는 것.</strong> 그게 목표다.
          </p>
          <p>
            이 사이트는 그 작업의 기록이다.
            연구를 논문에만 가두지 않고, 실무자와 연구자 모두 읽을 수 있는 언어로 풀어놓는 곳.
            직감 대신 데이터, 과장 대신 정확성.
          </p>
        </div>
      </section>

      {/* Career */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Career</p>
        <div className="mt-6 space-y-5">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-24 shrink-0 font-mono text-xs font-medium text-accent">2022 ~</span>
            <div>
              <p className="font-bold text-text">한양대학교 조교수</p>
              <p className="text-sm text-subtext">경영학부 마케팅 / 공과대학 데이터사이언스학부</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-24 shrink-0 font-mono text-xs text-muted">2019 ~ 22</span>
            <div>
              <p className="font-bold text-text">University of Kansas, Assistant Professor</p>
              <p className="text-sm text-subtext">School of Business — Marketing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Education</p>
        <div className="mt-6 space-y-5">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-24 shrink-0 font-mono text-xs text-muted">Ph.D.</span>
            <div>
              <p className="font-bold text-text">UT Dallas — 경영학 박사</p>
              <p className="text-sm text-subtext">마케팅 어낼리틱스, 2019</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-24 shrink-0 font-mono text-xs text-muted">M.S.</span>
            <div>
              <p className="font-bold text-text">UT Austin — 통계학 석사</p>
              <p className="text-sm text-subtext">2013</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-24 shrink-0 font-mono text-xs text-muted">M.S.</span>
            <div>
              <p className="font-bold text-text">한양대학교 — 경영학 석사</p>
              <p className="text-sm text-subtext">소비자 행동 마케팅, 2011</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-24 shrink-0 font-mono text-xs text-muted">B.S.</span>
            <div>
              <p className="font-bold text-text">한양대학교 공과대학</p>
              <p className="text-sm text-subtext">토목환경공학, 2009</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Contact Us</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">Email</span>
            <a
              href={`mailto:${AUTHOR_EMAIL}`}
              className="font-mono text-sm text-accent transition-colors hover:text-accent-dim"
            >
              {AUTHOR_EMAIL}
            </a>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">Tel</span>
            <a
              href="tel:02-2220-1076"
              className="font-mono text-sm text-subtext transition-colors hover:text-accent"
            >
              02-2220-1076
            </a>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">Office</span>
            <p className="text-sm text-subtext">
              서울 성동구 왕십리로 222, 한양대학교 서울캠퍼스 경영관 614호
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">SNS</span>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-subtext transition-colors hover:text-accent"
            >
              Instagram &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
