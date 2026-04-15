import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '슈퍼마켓 284개 매장 수요 예측 — 98.3% | BDM Lab',
  description: '매장별 매출, 품목별 수요를 98% 정확도로 예측. 온라인과 오프라인의 관리 단위가 다르다.',
}

export default function GroceryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      {/* ── 히어로: 차트 전면 ── */}
      <section className="mx-auto max-w-[900px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Project — AI 수요 예측</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          매장별 매출, 품목별 수요를 98% 정확도로 예측
        </h1>
        <p className="mt-3 text-base text-subtext">
          284개 슈퍼마켓 매장 · 52주 데이터 · 온/오프 채널별 분리 예측
        </p>
      </section>

      {/* 채널별 예측 라인 플롯 */}
      <section className="mx-auto mt-8 max-w-[900px]">
        <Image
          src="/images/projects/grocery/web_channel_prediction.png"
          alt="채널별 매출 예측"
          width={900}
          height={260}
          className="rounded-xl"
        />
      </section>

      {/* 핵심 숫자 */}
      <section className="mx-auto mt-10 max-w-[720px]">
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '98.3%', label: '온라인 예측 정확도' },
            { num: '284개', label: '매장 분석' },
            { num: '87.3%', label: '오프라인 예측 정확도' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-surface p-3 text-center">
              <p className="text-xl font-bold text-accent sm:text-2xl">{item.num}</p>
              <p className="mt-0.5 text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 스토리 */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <div className="font-serif text-base leading-[1.9] text-subtext space-y-5">
          <p>
            매주 284개 매장 각각에 대해 <strong className="text-text">&ldquo;다음 주 매출이 얼마인가&rdquo;</strong>에 답해야 한다. 재고, 인력, 프로모션 — 모든 의사결정이 여기서 시작된다.
          </p>
          <p>
            AI 모델은 고객 구매 패턴, 상품 구성, 경쟁 환경, 시계열 추세까지 149개 변수를 동시에 분석하여 매장별 주간 매출을 예측한다. 온라인 주문과 오프라인 매장을 각각 따로 예측한다.
          </p>
        </div>
      </section>

      {/* 카테고리 인사이트 — 킬러 섹션 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">
          온라인과 오프라인, 품목 관리 단위가 다르다
        </h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          AI 모델이 매출을 예측할 때, 상품을 어느 수준에서 보느냐가 채널별로 <strong className="text-text">정반대</strong>였다. 4가지 모델에서 100% 일관된 결과.
        </p>
      </section>

      <section className="mx-auto mt-6 max-w-[900px]">
        <Image
          src="/images/projects/grocery/web_category_insight.png"
          alt="온라인 vs 오프라인 카테고리"
          width={900}
          height={290}
          className="rounded-xl"
        />
      </section>

      <section className="mx-auto mt-6 max-w-[720px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-5">
            <p className="font-mono text-xs font-bold text-accent">온라인</p>
            <p className="mt-2 font-bold text-text">&ldquo;유제품을 몇 종류 샀는가&rdquo;</p>
            <p className="mt-1 text-sm text-subtext">큰 카테고리(Class) 중심. 검색→필터→장바구니의 목적형 쇼핑.</p>
          </div>
          <div className="rounded-xl border-2 border-border bg-surface p-5">
            <p className="font-mono text-xs font-bold text-muted">오프라인</p>
            <p className="mt-2 font-bold text-text">&ldquo;크림치즈를 골랐는가&rdquo;</p>
            <p className="mt-1 text-sm text-subtext">세부 카테고리(Subclass) 중심. 보고→만지고→고르는 탐색형 쇼핑.</p>
          </div>
        </div>
      </section>

      {/* 핵심 예측 변수 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">매출을 결정하는 핵심 요인</h2>
      </section>

      {/* SHAP removed — text-based ranking is cleaner */}

      <section className="mx-auto mt-6 max-w-[720px]">
        <div className="space-y-2">
          {[
            { rank: '1', title: '고객 수', desc: '방문 고객 수가 매출의 가장 강력한 예측 변수. 다른 모든 변수를 압도.', highlight: true },
            { rank: '2', title: '장바구니 구성', desc: '어떤 카테고리를 몇 가지 사는지.' },
            { rank: '3', title: '직전 매출', desc: '관성 효과. 다음 주의 좋은 기준선.' },
          ].map((item) => (
            <div key={item.rank} className={`flex items-start gap-3 rounded-xl p-3 ${item.highlight ? 'border-2 border-accent bg-accent/5' : 'border border-border bg-surface'}`}>
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${item.highlight ? 'bg-accent text-bg' : 'bg-surface-alt text-muted'}`}>{item.rank}</span>
              <div>
                <p className={`font-bold ${item.highlight ? 'text-accent' : 'text-text'}`}>{item.title}</p>
                <p className="mt-0.5 text-sm text-subtext">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          프로모션, 경쟁사, 인구통계를 추가해도 예측 개선이 거의 없었다. 자사 고객 데이터가 가장 중요한 자산이다.
        </p>
      </section>

      {/* 구매 관성 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">왜 예측이 되는가 — 고객은 습관적으로 산다</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          500명의 듀얼 채널 고객을 추적한 결과, 온라인 고객의 장바구니 유사도가 오프라인보다 <strong className="text-text">26.3% 높았다.</strong> 고객은 생각보다 습관적으로 산다. 이 구매 관성이 AI가 매출을 맞출 수 있는 근본적 이유다.
        </p>
      </section>

      {/* 데이터 & 방법 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">분석 기반</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: '284개 매장 × 52주', desc: '온라인 225개 + 오프라인 281개' },
            { title: '92% 거래 커버리지', desc: '로열티 카드 기반' },
            { title: 'XGBoost + LightGBM', desc: '앙상블 + SHAP 해석' },
            { title: 'Out-of-sample 검증', desc: '미래 데이터로만 평가' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.title}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[720px] border-t border-border pt-10">
        <p className="text-xs text-muted">이 연구의 학술 버전은 Journal of Retailing and Consumer Services에 게재 확정되었습니다.</p>
        <p className="mt-4 text-sm text-muted">brlim@hanyang.ac.kr</p>
      </section>

    </div>
  )
}
