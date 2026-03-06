import type { Metadata } from 'next'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Join the Lab',
  description: '한양대 빅데이터마케팅 랩(Big Data Marketing Lab) 대학원생 모집. 마케팅 데이터 분석, AI 예측, 인과분석 연구.',
}

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[720px]">
        {/* Hero */}
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Join the Lab</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          함께 연구할<br />대학원생을 찾습니다.
        </h1>
        <p className="mt-4 text-lg text-subtext">
          데이터로 마케팅의 질문에 답하고 싶은 분을 환영합니다.
        </p>

        {/* Research Topics */}
        <section className="mt-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Research</p>
          <h2 className="mt-3 text-xl font-bold text-text">연구 주제</h2>
          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/30">
              <h3 className="font-bold text-text">플랫폼 알고리즘 분석</h3>
              <p className="mt-1 text-sm text-subtext">
                소셜 미디어, 검색 엔진, AI 답변 엔진의 추천 알고리즘이 마케팅에 미치는 영향
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/30">
              <h3 className="font-bold text-text">AI 기반 예측 모델링</h3>
              <p className="mt-1 text-sm text-subtext">
                머신러닝을 활용한 수요, 매출, 고객 행동 예측
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/30">
              <h3 className="font-bold text-text">인과추론</h3>
              <p className="mt-1 text-sm text-subtext">
                마케팅 개입의 인과적 효과를 측정하는 방법론 연구
              </p>
            </div>
          </div>
        </section>

        {/* Lab Culture */}
        <section className="mt-12 border-t border-border pt-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Culture</p>
          <h2 className="mt-3 text-xl font-bold text-text">랩 문화</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-subtext">
            <p>
              <strong className="text-text">근거 기반.</strong>{' '}
              모든 주장에는 데이터가 동반됩니다.
            </p>
            <p>
              <strong className="text-text">솔직한 소통.</strong>{' '}
              모르는 것은 모른다고 말합니다.
            </p>
            <p>
              <strong className="text-text">이론 + 실무.</strong>{' '}
              학술 논문과 기업 프로젝트를 병행합니다.
            </p>
          </div>
        </section>

        {/* How to Apply */}
        <section className="mt-12 rounded-xl border border-accent/20 bg-accent-bg p-8">
          <h2 className="text-lg font-bold text-text">지원 방법</h2>
          <div className="mt-4 space-y-3 text-sm text-subtext">
            <p>아래 내용을 이메일로 보내주세요:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>간단한 자기소개 (배경, 관심 연구 주제)</li>
              <li>이력서 (CV)</li>
              <li>관련 경험 (프로젝트, 연구, 인턴 등)</li>
            </ul>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=BDM Lab 지원`}
            className="mt-5 inline-block rounded-lg bg-accent px-6 py-3 font-mono text-sm font-medium text-black transition-colors hover:bg-accent-dim"
          >
            지원 이메일 보내기
          </a>
          <p className="mt-3 font-mono text-xs text-muted">
            {CONTACT_EMAIL}
          </p>
        </section>
      </div>
    </div>
  )
}
