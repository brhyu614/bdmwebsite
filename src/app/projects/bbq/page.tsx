import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '프랜차이즈 349개 매장 — 채널별 매출 예측 + 상권 분석 | BDM Lab',
  description: '배달·매장식사·포장 채널별 매출 예측, 자기잠식 분석, 리뷰→매출 연결, 출점 전략.',
}

export default function BBQPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      {/* 히어로 */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Project — 프랜차이즈 분석</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          상권 인구 구조가 모든 채널의 매출을 결정한다
        </h1>
        <p className="mt-3 text-base text-subtext">
          치킨 프랜차이즈 349개 매장 · 3년 주간 거래 데이터 · 배달/매장식사/포장 채널 분리
        </p>

        <div className="mt-8 grid grid-cols-4 gap-3">
          {[
            { num: '349개', label: '전수 매장 분석' },
            { num: '3년', label: '주간 데이터' },
            { num: '96%', label: '매장식사 예측' },
            { num: '3채널', label: '배달·매장·포장' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-surface p-3 text-center">
              <p className="text-xl font-bold text-accent sm:text-2xl">{item.num}</p>
              <p className="mt-0.5 text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 채널별 요인 비교 차트 */}
      <section className="mx-auto mt-10 max-w-[900px]">
        <Image
          src="/images/projects/bbq/web_channel_factors.png"
          alt="배달 vs 매장식사 매출 결정 요인"
          width={900}
          height={290}
          className="rounded-xl"
        />
      </section>

      {/* 핵심 발견 */}
      <section className="mx-auto mt-12 max-w-[720px]">
        <h2 className="text-xl font-bold text-text">핵심 발견: 같은 매장인데 채널마다 다른 게임</h2>
        <div className="mt-4 font-serif text-base leading-[1.9] text-subtext space-y-5">
          <p>
            같은 브랜드, 같은 매장인데 채널에 따라 매출을 결정하는 요인이 <strong className="text-text">정반대</strong>였다. 349개 매장의 3년 데이터를 분석한 결과, 이건 프랜차이즈 운영에 근본적인 질문을 던진다. 모든 매장을 같은 전략으로 관리하는 것이 맞는가?
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-[#F97316]/40 bg-[#F97316]/5 p-5">
            <p className="text-lg font-bold text-[#F97316]">배달 매출</p>
            <p className="mt-2 text-sm text-subtext"><strong className="text-text">인구통계가 가장 강력한 예측 변수다 (R² +0.67).</strong> 리뷰는 배달에서만 추가적 기여(R² +0.25). 그중에서도 &ldquo;음식이 맛있다&rdquo;는 구체적 언급이 별점보다 2배 이상 강력하다.</p>
          </div>
          <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-5">
            <p className="text-lg font-bold text-accent">매장식사 매출</p>
            <p className="mt-2 text-sm text-subtext"><strong className="text-text">인구통계가 역시 가장 중요 (R² +0.49).</strong> 리뷰의 추가 기여는 미미(R² +0.05). 입지와 경쟁 환경이 결정적이며, 고령화 지수가 높은 지역에서 매장식사 매출이 높다.</p>
          </div>
        </div>
      </section>

      {/* 출점 전략 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">출점 전략: 유동인구보다 1인 가구</h2>
        <div className="mt-4 font-serif text-base leading-[1.9] text-subtext space-y-4">
          <p>
            &ldquo;유동인구가 많은 곳에 매장을 내라&rdquo; — 배달 시대에 이 공식은 더 이상 작동하지 않는다. 349개 매장 분석 결과, 배달 매출을 가장 강력하게 예측하는 인구 변수는 <strong className="text-text">1인 가구 비율</strong>이었다.
          </p>
          <p>
            혼자 사는 사람은 요리를 덜 한다. 이건 선호가 아니라 <strong className="text-text">생활 구조</strong>의 문제다. 한 끼를 위해 장을 보고 조리하고 설거지하는 건 비효율적이다. 배달에 대한 의존은 선택이 아니라 구조에서 나온다.
          </p>
          <p>
            유동인구는? 배달 매출과 거의 관련 없었다. 배달 주문은 집에서 한다. 거리에 사람이 많이 다니는 것과 집에서 배달을 시키는 것은 다른 행동이다.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-5">
          <p className="font-bold text-accent">실무 원칙</p>
          <div className="mt-2 text-sm text-subtext space-y-1">
            <p><strong className="text-text">배달 중심 출점:</strong> 1인 가구 밀집 지역 (대학가, 원룸 밀집)</p>
            <p><strong className="text-text">매장식사 중심 출점:</strong> 고령 인구 비율이 높은 전통 상권</p>
            <p><strong className="text-text">같은 도시 안에서도</strong> 구/동에 따라 최적 전략이 다르다</p>
          </div>
        </div>
      </section>

      {/* 자기잠식 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">자기잠식: 가장 위험한 경쟁자는 우리 브랜드다</h2>
        <div className="mt-4 font-serif text-base leading-[1.9] text-subtext space-y-4">
          <p>
            프랜차이즈 본사가 출점 시 가장 먼저 확인하는 것은 &ldquo;경쟁 브랜드 수&rdquo;다. 하지만 데이터는 다른 이야기를 한다.
          </p>
          <p>
            <strong className="text-text">배달 매출에서, 타 브랜드보다 같은 브랜드의 다른 매장이 더 큰 매출 감소를 유발했다.</strong>
          </p>
          <p>
            배달앱을 열면 반경 내 모든 매장이 한 화면에 동시에 뜬다. 같은 브랜드 A지점과 B지점은 메뉴가 같고, 가격이 같고, 프로모션도 같다. 소비자 입장에서 완벽한 대체재다. 타 브랜드는 최소한 메뉴가 다르고 맛이 다르다.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {[
            { dist: '100m 이내', level: '가장 강함', desc: '배달앱에서 거의 동시 노출. 배달 시간 차이도 없음.', highlight: true },
            { dist: '300m', level: '강함', desc: '같은 배달 반경에서 경쟁.' },
            { dist: '500m', level: '중간', desc: '일부 겹치는 고객 존재.' },
            { dist: '1km', level: '약하지만 존재', desc: '배달 반경이 넓은 매장은 여기까지 영향.' },
          ].map((item) => (
            <div key={item.dist} className={`flex items-center gap-4 rounded-xl p-3 ${item.highlight ? 'border-2 border-[#E74C3C] bg-[#E74C3C]/5' : 'border border-border bg-surface'}`}>
              <span className={`shrink-0 font-mono text-sm font-bold ${item.highlight ? 'text-[#E74C3C]' : 'text-muted'}`}>{item.dist}</span>
              <span className={`shrink-0 text-sm font-bold ${item.highlight ? 'text-[#E74C3C]' : 'text-text'}`}>{item.level}</span>
              <span className="text-sm text-subtext">{item.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          <p>
            흥미로운 점: <strong className="text-text">매장식사에서는 자기잠식이 거의 나타나지 않았다.</strong> 직접 방문하는 고객은 물리적으로 가까운 한 곳만 가기 때문이다. 배달앱이 공간의 제약을 없애면서, 같은 브랜드끼리의 수요 잠식이 가시화된 것이다.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
          <p className="font-bold text-text">본사 vs 가맹점의 구조적 충돌</p>
          <p className="mt-2 text-sm text-subtext">
            본사는 가맹점을 늘려야 로열티 수입이 증가한다. 기존 가맹점의 배달 반경과 겹치더라도, 새 가맹점이 열리면 본사에는 이익이다. 하지만 개별 가맹점은 매출이 나눠진다. <strong className="text-text">본사의 성장과 가맹점의 수익성이 구조적으로 충돌하는 지점</strong>이며, 이것을 데이터로 정량화할 수 있다.
          </p>
        </div>
      </section>

      {/* 리뷰 분석 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">리뷰 분석: &ldquo;맛있다&rdquo;가 매출과 직결된다</h2>
        <div className="mt-4 font-serif text-base leading-[1.9] text-subtext space-y-4">
          <p>
            GPT-4 기반 자연어 분석으로 리뷰를 4가지 주제로 분류하고, 각 주제가 매출에 미치는 영향을 측정했다.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {[
            { topic: '음식 품질 언급', pct: '5.5%', desc: '"치킨이 바삭하다" — 가장 강력', highlight: true },
            { topic: '서비스 언급', pct: '3.3%', desc: '"배달이 빠르다" — 보조적' },
            { topic: '가격 언급', pct: '2.9%', desc: '"가성비 좋다" — 중간' },
            { topic: '재구매 의향', pct: '2.5%', desc: '"또 시킬게요" — 약함' },
          ].map((item) => (
            <div key={item.topic} className={`flex items-center gap-4 rounded-xl p-3 ${item.highlight ? 'border-2 border-accent bg-accent/5' : 'border border-border bg-surface'}`}>
              <span className={`shrink-0 text-sm font-bold ${item.highlight ? 'text-accent' : 'text-text'}`}>{item.topic}</span>
              <span className={`shrink-0 font-mono text-sm ${item.highlight ? 'text-accent' : 'text-muted'}`}>{item.pct}</span>
              <span className="text-sm text-subtext">{item.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 font-serif text-base leading-[1.9] text-subtext space-y-4">
          <p>
            <strong className="text-text">매장식사에서 리뷰의 추가 기여는 미미했다 (R² +0.05).</strong> 직접 방문하는 고객은 리뷰 대신 자기 경험을 기준으로 판단하기 때문이다.
          </p>
          <p>
            배달 매출을 올리려면 &ldquo;별점 4.5 이상 유지&rdquo;가 아니라, <strong className="text-text">&ldquo;맛있다&rdquo;는 구체적 언급을 늘리는 것</strong>이 핵심이다. &ldquo;치킨의 바삭함은 어떠셨나요?&rdquo; 같은 유도 질문이 리뷰 이벤트보다 효과적이다.
          </p>
          <p>
            왜 서비스 리뷰보다 음식 품질 리뷰가 더 강력할까? 배달 맥락에서 생각하면 명확하다. 배달은 서비스 경험이 극히 제한적이다. 주문→대기→수령→식사. 고객이 평가할 수 있는 것은 결국 <strong className="text-text">음식 자체</strong>뿐이다.
          </p>
        </div>
      </section>

      {/* 예측 정확도 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">채널별 예측 정확도</h2>
        <p className="mt-2 text-sm text-subtext">349개 매장, 3년 주간 데이터. Out-of-sample 검증.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { channel: '매장식사', r2: '96%', desc: '매장별 인력 배치, 좌석 운영 최적화' },
            { channel: '총 매출', r2: '80%', desc: '전체 손익 관리, 임대료 협상 근거' },
            { channel: '배달', r2: '78%', desc: '배달 물량 예측, 포장재·식자재 발주' },
            { channel: '포장', r2: '67%', desc: '포장 수요 대비 인력 배치' },
          ].map((item) => (
            <div key={item.channel} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-bold text-text">{item.channel}</p>
                <p className="text-2xl font-bold text-accent">{item.r2}</p>
              </div>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 종합 시사점 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">종합: 프랜차이즈 본사가 이 데이터로 할 수 있는 것</h2>
        <div className="mt-4 space-y-2">
          {[
            { title: '신규 출점 후보지를 채널별로 평가', desc: '후보지의 인구 구성을 보고 배달 중심/매장식사 중심을 결정. 같은 서울이라도 관악구(배달)와 종로구(매장식사)의 전략이 다르다.' },
            { title: '기존 매장의 채널 전략을 데이터로 전환', desc: '1인 가구 밀도가 높은 지역 매장이 홀 인테리어에 투자하고 있다면, 그 예산을 배달 포장 품질로 돌리는 것이 합리적이다.' },
            { title: '자기잠식을 본사 차원에서 관리', desc: '전국 매장의 배달 반경 중복 현황을 시각화하고, 추가 출점 시 기존 가맹점 매출 영향을 시뮬레이션할 수 있다.' },
            { title: '리뷰 관리의 초점을 바꾼다', desc: '별점 올리기가 아니라, 음식 품질에 대한 구체적 언급을 유도하는 방향으로. 배달 중심 매장에서 특히 효과적이다.' },
            { title: '위험 매장을 사전에 탐지', desc: '특정 채널의 매출이 먼저 떨어지기 시작하면, 전체 매출 하락의 선행 신호다. 사후 대응이 아니라 사전 대응이 가능하다.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.title}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 데이터 */}
      <section className="mx-auto mt-12 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">분석 기반</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: '349개 매장 × 3년', desc: '국내 대형 치킨 프랜차이즈 전수' },
            { title: '채널 분리', desc: '배달·매장식사·포장 각각 별도 분석' },
            { title: 'GPT-4 리뷰 분석', desc: '음식/서비스/가격/재구매 4주제 분류' },
            { title: '상권 데이터', desc: '행정안전부 사업자등록 + 인구통계' },
            { title: 'XGBoost + SHAP', desc: 'AI 예측 + 변수별 기여도 정량 분해' },
            { title: '경제 지표 + 날씨', desc: '소비자물가, 외식물가, 기온, 강수' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.title}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[720px] border-t border-border pt-10">
        <p className="text-xs text-muted">이 연구의 학술 버전은 Journal of Retailing and Consumer Services에 게재되었습니다.</p>
        <p className="mt-4 text-sm text-muted">brlim@hanyang.ac.kr</p>
      </section>

    </div>
  )
}
