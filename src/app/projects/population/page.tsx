import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '인구 변화 예측 — 전국 3,518개 행정동 | BDM Lab',
  description: '어떤 동네의 인구가 줄어드는지, 청년이 떠나는 곳은 어디인지를 5년 전에 예측.',
}

export default function PopulationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      {/* ── 히어로: 차트 전면 ── */}
      <section className="mx-auto max-w-[900px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Project — 인구 변화 예측</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          이 동네, 5년 후에도 사람이 있을까?
        </h1>
        <p className="mt-3 text-base text-subtext">
          전국 3,518개 행정동 · 20년 데이터 (2000~2021) · 청년/고령/영유아 세그먼트별 예측
        </p>
      </section>

      {/* 차트 제거 — 텍스트 기반 */}

      {/* 핵심 숫자 */}
      <section className="mx-auto mt-10 max-w-[720px]">
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '3,518', label: '행정동 분석' },
            { num: '20년', label: '데이터 기간' },
            { num: '461개', label: '분석 변수' },
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
            매장을 열었는데, 몇 년 만에 동네 인구가 줄어서 망했다. 10년 장기 임대 계약을 했는데, 5년 만에 상권이 죽었다.
          </p>
          <p>
            <strong className="text-text">지금 사람이 많다고 해서, 5년 후에도 많을 거라는 보장은 없다.</strong> 한국은 인구 감소가 이미 시작된 나라다. 하지만 모든 동네가 똑같이 줄어드는 건 아니다. 어떤 동네는 청년이 유입되고, 어떤 동네는 고령자만 남는다.
          </p>
        </div>
      </section>

      {/* 4가지 세그먼트 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">4가지 인구 세그먼트를 각각 예측</h2>
      </section>

      <section className="mx-auto mt-6 max-w-[720px]">
        <Image
          src="/images/projects/population/web_segment_accuracy.png"
          alt="세그먼트별 예측 정확도"
          width={720}
          height={324}
          className="rounded-xl"
        />
      </section>

      <section className="mx-auto mt-6 max-w-[720px]">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { segment: '고령 인구', r2: 'R² 50.0%', desc: '고령화가 어디서 가속되는가' },
            { segment: '청년 (20~34세)', r2: 'R² 47.8%', desc: '젊은 인구가 떠나고 있는가' },
            { segment: '전체 인구 유입', r2: 'R² 47.3%', desc: '동네로 사람이 모이는가, 빠지는가' },
            { segment: '영유아 (0~4세)', r2: 'R² 36.4%', desc: '아이를 키우는 가구가 있는가' },
          ].map((item) => (
            <div key={item.segment} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.segment}</p>
              <p className="mt-1 text-lg font-bold text-accent">{item.r2}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">2005/2010/2015년 학습 → 2020년 실제 인구와 비교 (out-of-sample 검증)</p>
      </section>

      {/* 핵심 요인 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">어떤 동네가 살아남는가</h2>
      </section>

      {/* factors chart removed — text cards are cleaner */}

      <section className="mx-auto mt-6 max-w-[720px]">
        <div className="space-y-2">
          {[
            { title: '상업·금융 일자리가 있는 동네는 살아남는다', desc: 'SHAP 기여도 1위. 커머스, 금융, 서비스업 일자리가 인구 유입을 결정.', highlight: true },
            { title: '1인 가구 비율이 높으면 위험 신호', desc: '이동이 쉬운 1인 가구는 조건이 나빠지면 바로 떠난다.' },
            { title: '고령화 지수가 높으면 청년이 떠난다', desc: '노인 비율 ↑ → 상권 위축 → 청년 이탈의 악순환.' },
            { title: '아파트 비율이 높은 곳은 상대적으로 안정', desc: '가족 단위 거주가 많아 인구가 유지된다.' },
          ].map((item) => (
            <div key={item.title} className={`rounded-xl p-4 ${item.highlight ? 'border-2 border-accent bg-accent/5' : 'border border-border bg-surface'}`}>
              <p className={`font-bold ${item.highlight ? 'text-accent' : 'text-text'}`}>{item.title}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 활용 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">프랜차이즈·리테일에 이렇게 활용</h2>
      </section>

      {/* applications chart removed */}

      <section className="mx-auto mt-6 max-w-[720px]">
        <div className="rounded-xl border border-accent/40 bg-accent/5 p-5">
          <p className="font-bold text-accent">매출 예측 + 인구 예측 = 완전한 의사결정</p>
          <p className="mt-2 text-sm text-subtext">
            매출 예측만으로는 &ldquo;지금 잘 팔리는가&rdquo;만 안다.
            인구 예측을 결합하면 &ldquo;앞으로도 잘 팔릴 것인가&rdquo;까지 답할 수 있다.
          </p>
        </div>
      </section>

      {/* 데이터 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">분석 기반</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: '전국 3,518개 행정동', desc: '읍면동 단위' },
            { title: '20년 데이터', desc: '통계청 2000~2021' },
            { title: '461개 변수', desc: '인구, 가구, 주거, 산업, 고용' },
            { title: 'XGBoost + SHAP', desc: '예측 + 요인 분석' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.title}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[720px] border-t border-border pt-10">
        <p className="text-sm text-muted">brlim@hanyang.ac.kr</p>
      </section>

    </div>
  )
}
