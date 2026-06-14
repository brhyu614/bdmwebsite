import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: '기업 협업·연구 의뢰',
  description:
    '빅데이터마케팅 랩과 기업이 함께 일하는 법. AI 매출·수요 예측, 소비자 시뮬레이션(디지털 트윈), 디지털 마케팅 효과 검증·인과분석. 용역·공동연구·자문.',
  alternates: { canonical: '/work-with-us' },
}

const SERVICES = [
  {
    title: 'AI 예측',
    desc: '매출·수요·인구·상권을 예측한다. 신규 출점, 재고·발주, IP·콜라보 수요, 채널별 매출. 단순 예측이 아니라 SHAP로 "왜"까지 설명한다.',
    tags: ['XGBoost·LightGBM', 'SHAP 설명', '채널별 분해'],
    href: '/projects',
  },
  {
    title: 'AI 소비자 시뮬레이션',
    desc: '실제 소비자를 복제한 AI 에이전트로 합성 FGI를 진행한다. 출시 전 컨셉·메시지·가격을 비용·시간 1/10로 테스트한다.',
    tags: ['디지털 트윈', '합성 FGI', 'holdout 83%'],
    href: '/synthetic-consumer',
  },
  {
    title: '디지털 마케팅·인과분석',
    desc: '캠페인·인플루언서·정책의 진짜 효과를 인과적으로 검증한다. 대규모 소셜·이미지 데이터 구축, DID·구조모형으로 상관과 인과를 가른다.',
    tags: ['이중차분(DID)', '이미지 AI', '효과 검증'],
    href: '/digital-marketing',
  },
]

const MODES = [
  { title: '용역 프로젝트', desc: '정의된 문제를 기간·산출물 기준으로 수행. 보고서 + 실행 가능한 모델·시스템 납품.' },
  { title: '공동연구', desc: '기업 데이터로 함께 연구하고, 결과를 논문·IP로 발전. 장기 파트너십.' },
  { title: '자문·워크숍', desc: '데이터 전략·AI 도입 자문, 실무진 대상 예측·인과분석 워크숍.' },
]

const TRUST = [
  { stat: 'JRCS 게재', label: '옴니채널·그로서리 예측 연구 국제 학술지 게재' },
  { stat: '기업 납품', label: '소비재 브랜드 매출 예측 시스템 실제 납품·운영' },
  { stat: '정부·기관 과제', label: '한국은행·NRF·서울경제진흥원 등 연구용역 수행' },
]

export default function WorkWithUsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Work With Us</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          데이터로 기업의 의사결정을 바꿉니다.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          예측이 필요할 때, 출시 전 소비자 반응이 궁금할 때, 캠페인의 진짜 효과를 알고
          싶을 때 — 감이 아니라 데이터로 답합니다.
        </p>
      </section>

      {/* 서비스 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">함께할 수 있는 일</h2>
        <div className="mt-6 space-y-4">
          {SERVICES.map((s) => (
            <Link key={s.title} href={s.href} className="group block">
              <div className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
                <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-subtext">{s.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full bg-surface-alt px-2.5 py-0.5 font-mono text-[10px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 협업 방식 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">협업 방식</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {MODES.map((m) => (
            <div key={m.title} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-bold text-text">{m.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-subtext">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 신뢰 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">왜 BDM Lab인가</h2>
        <div className="mt-6 space-y-3">
          {TRUST.map((t) => (
            <div key={t.stat} className="flex items-baseline gap-4 rounded-xl border border-border bg-surface p-5">
              <span className="shrink-0 text-sm font-bold text-accent">{t.stat}</span>
              <span className="text-sm leading-relaxed text-subtext">{t.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          ※ 고객사·계약 조건은 비공개 원칙입니다. 레퍼런스가 필요하시면 문의 시 안내드립니다.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">프로젝트를 논의해 봅시다</h2>
        <p className="mt-3 text-base leading-relaxed text-subtext">
          문제만 들고 오셔도 됩니다. 데이터로 풀 수 있는 문제인지부터 함께 진단합니다.
        </p>
        <div className="mt-5">
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#0B0F14] transition-opacity hover:opacity-90"
          >
            협업 문의
          </Link>
        </div>
      </section>
    </div>
  )
}
