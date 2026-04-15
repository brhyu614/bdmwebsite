import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'IP 콜라보 상품 매출 예측 — 97.6% | BDM Lab',
  description: '아이돌 A vs 배우 B, 누가 매출 승자? 462명의 IP에 대해 97.6% 정확도로 예측.',
}

export default function PhotoismPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      {/* ── 히어로: 흥미로운 질문으로 시작 ── */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Project — IP 매출 예측</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl">
          아이돌 가수 A vs 연기파 배우 B
        </h1>
        <p className="mt-3 text-xl leading-snug text-subtext">
          포토프레임 콜라보 상품, 2026년 6월 출시.
          <br />
          <strong className="text-text">누가 매출 승자일까?</strong>
        </p>

        {/* 예시 비교 카드 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-accent/50 bg-accent/5 p-6">
            <p className="text-lg font-bold text-accent">아이돌 가수 A</p>
            <div className="mt-3 space-y-2 text-sm text-subtext">
              <div className="flex justify-between"><span>SNS 팔로워</span><strong className="text-text">1,200만</strong></div>
              <div className="flex justify-between"><span>검색량</span><strong className="text-text">상위 3%</strong></div>
              <div className="flex justify-between"><span>과거 콜라보</span><strong className="text-text">4회</strong></div>
              <div className="flex justify-between"><span>주요 팬층</span><strong className="text-text">20대 여성</strong></div>
            </div>
            <div className="mt-4 border-t border-accent/20 pt-4 text-center">
              <p className="text-2xl font-bold text-accent">예상 주간 매출은?</p>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-border bg-surface p-6">
            <p className="text-lg font-bold text-text">연기파 배우 B</p>
            <div className="mt-3 space-y-2 text-sm text-subtext">
              <div className="flex justify-between"><span>SNS 팔로워</span><strong className="text-text">350만</strong></div>
              <div className="flex justify-between"><span>검색량</span><strong className="text-text">상위 12%</strong></div>
              <div className="flex justify-between"><span>과거 콜라보</span><strong className="text-text">첫 콜라보</strong></div>
              <div className="flex justify-between"><span>주요 팬층</span><strong className="text-text">30대 남녀 고름</strong></div>
            </div>
            <div className="mt-4 border-t border-border pt-4 text-center">
              <p className="text-2xl font-bold text-text">예상 주간 매출은?</p>
            </div>
          </div>
        </div>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          팔로워가 3배 많다고 매출도 3배일까? 검색량 상위 3%면 무조건 잘 팔릴까?
          첫 콜라보인 배우 B가 의외로 더 높을 수도 있을까?
          <strong className="text-text"> 462명의 IP 데이터로 학습한 AI가 답합니다.</strong>
        </p>
      </section>

      {/* ── 97.6% 예측 시스템 ── */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-text">
          97.6% 정확도의 매출 예측 시스템
        </h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          462명의 연예인/IP에 대해, 콜라보 상품의 주간 매출을 예측합니다.
          4,042건의 실제 매출 데이터로 검증한 결과, 평균 적중률 97.6%.
          기존에 &ldquo;비슷한 연예인 평균&rdquo;으로 어림짐작하던 것(오차 33.6%)보다 93% 정확합니다.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { num: '97.6%', label: '적중률' },
            { num: '4,042', label: '검증 건수' },
            { num: '462', label: 'IP 분석' },
            { num: '93%', label: '기존 대비 개선' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-surface p-3 text-center">
              <p className="text-xl font-bold text-accent sm:text-2xl">{item.num}</p>
              <p className="mt-0.5 text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 프로그램 사용 영상 ── */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">예측 시스템 실제 사용 화면</h2>
        <p className="mt-2 text-sm text-subtext">
          IP명, 콜라보 기간, 매장 유형을 입력하면 예상 매출이 즉시 표시됩니다.
        </p>
        <video
          className="mt-6 w-full rounded-2xl border border-border"
          controls
          preload="metadata"
          playsInline
        >
          <source src="/videos/photoism-demo.mp4" type="video/mp4" />
        </video>
      </section>

      {/* ── 예측 성능 대시보드 ── */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">예측 성능 종합</h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">상시 매장</p>
            <p className="mt-1 text-3xl font-bold text-accent">98.1%</p>
            <p className="mt-1 text-xs text-muted">2,478건 검증</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">팝업/임시 매장</p>
            <p className="mt-1 text-3xl font-bold text-text">96.9%</p>
            <p className="mt-1 text-xs text-muted">1,564건 검증</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-text">전체 예측 정확도 분포</p>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[
              { pct: '69%', label: '오차 2% 미만' },
              { pct: '20%', label: '오차 2~5%' },
              { pct: '6%', label: '오차 5~10%' },
              { pct: '4%', label: '오차 10%+' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="text-lg font-bold text-text">{item.pct}</p>
                <p className="text-xs text-muted">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-subtext">
            462개 IP 중 <strong className="text-text">89%가 5% 이내 오차</strong>. 전체 예측 중 84%가 실제와 2% 이내 차이.
          </p>
        </div>
      </section>

      {/* ── 매출 급등 유형과 대표 사례 ── */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">매출이 급등하는 순간들</h2>
        <p className="mt-2 font-serif text-base leading-[1.9] text-subtext">
          예측이 크게 빗나간 24개 IP의 199건 매출 급등을 전수 조사했습니다.
          결과: 거의 모든 대형 오차는 외부 이벤트 때문이었습니다.
        </p>

        <div className="mt-6 space-y-2">
          {[
            { type: '앨범·싱글 대히트', count: '8건', example: '밀리언셀러 달성 → 콜라보 상품 매출 급등' },
            { type: '대규모 행사·투어', count: '4건', example: '8개국 22회 공연 → 투어 기간 내내 매출 상승' },
            { type: 'TV 프로그램 히트', count: '2건', example: '시청률 17.1%, 스트리밍 1위 → 매출 평소의 23배' },
            { type: '기념 이벤트', count: '2건', example: '프로그램 20주년 이벤트 → 출연진 4명 매출 같은 날 동시 급등' },
            { type: '시상식 수상', count: '2건', example: '대상 수상 직후 → 매출 점프' },
            { type: '은퇴·전환 이벤트', count: '2건', example: '등번호 영구결번 → 기념 수요 폭증' },
          ].map((item) => (
            <div key={item.type} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-bold text-text">{item.type}</p>
                <span className="font-mono text-xs text-muted">{item.count}</span>
              </div>
              <p className="mt-1 text-sm text-subtext">{item.example}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-base font-bold text-text">대표 사례</h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="font-bold text-text">한 그룹의 멤버 6명이 전체 급등의 76%를 차지</p>
              <p className="mt-2 text-sm text-subtext">
                199건의 매출 급등 중 152건이 이 그룹에 집중.
                신작 밀리언셀러 → 월드투어(8개국 22회) → 연말 시상식 대상.
                세 이벤트가 연쇄적으로 터지면서 관련 콜라보 상품 매출이 지속 급등.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="font-bold text-text">하루 만에 매출이 평소의 23배</p>
              <p className="mt-2 text-sm text-subtext">
                TV 프로그램 시청률 17.1%, 글로벌 스트리밍 2주 연속 1위.
                이전까지의 매출 패턴과 완전히 단절된 수치.
                과거 데이터에 이런 신호가 없었기 때문에 예측이 불가능했던 사례.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="font-bold text-text">4명의 매출이 같은 날 동시에 급등</p>
              <p className="mt-2 text-sm text-subtext">
                원인: 같은 프로그램 출신 4명이 20주년 기념 이벤트에 동시 참여.
                개별 IP의 과거 데이터로는 절대 예측할 수 없는 패턴 —
                외부 이벤트 캘린더가 시스템에 입력되어야만 잡을 수 있는 사례.
              </p>
            </div>
          </div>

          <p className="mt-6 font-serif text-base leading-[1.9] text-subtext">
            <strong className="text-text">핵심:</strong> 평소 패턴의 매출은 97.6%로 정확하게 맞춘다. 오차가 큰 경우는 거의 모두 외부 이벤트.
            행사 일정, 미디어 편성 정보를 시스템에 추가하면 이런 급등까지 예측 가능하다.
          </p>
        </div>
      </section>

      {/* ── 어떻게 활용할 수 있는가 ── */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">이 시스템으로 할 수 있는 것</h2>

        <div className="mt-6 space-y-3">
          {[
            {
              title: 'A연예인 vs B연예인 — 데이터로 비교',
              desc: '&ldquo;누구와 콜라보해야 매출이 높을까?&rdquo; 감이 아니라 예상 매출 수치로 비교. 여러 후보를 동시에 비교 가능.',
            },
            {
              title: '상시 매장 vs 팝업 — 매장 유형별 전략',
              desc: '같은 IP라도 상시 매장과 팝업의 예상 매출이 다르다. 어떤 매장 유형으로 할지를 사전에 결정.',
            },
            {
              title: '언제 시작할까 — 콜라보 시기 선정',
              desc: '검색량이 올라가고 있는 시점에 콜라보를 시작하면 매출이 극대화된다. 검색량이 꺾이기 시작한 IP는 시기를 재고.',
            },
            {
              title: '몇 주가 최적인가 — 기간 최적화',
              desc: '콜라보 기간에 따른 주간 매출 변화를 예측하여 최적 기간을 설정. 너무 길면 매출 체감, 너무 짧으면 기회 손실.',
            },
            {
              title: '이 IP는 위험한가 — 리스크 사전 파악',
              desc: '과거 데이터가 적은 신규 IP는 예측 신뢰도가 낮다는 것을 시스템이 사전에 알려줌. 고위험 콜라보는 보수적으로 예산 편성.',
            },
            {
              title: '인기 하락 조기 감지',
              desc: '과거 콜라보 대비 매출이 떨어지는 패턴이 보이면, 해당 IP의 인기 하락 신호. 다음 콜라보 계획에 반영.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.title}</p>
              <p className="mt-1 text-sm text-subtext" dangerouslySetInnerHTML={{ __html: item.desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 어떻게 만들어졌나 ── */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">어떻게 만들어졌나</h2>

        <div className="mt-6 space-y-2">
          {[
            { step: '1', title: '데이터 수집', desc: '매출 거래 데이터, 검색 트렌드, IP 프로필 정보를 수집' },
            { step: '2', title: '데이터 정제', desc: 'IP명 통일, 그룹/솔로 구분, 콜라보 기간 정의 등 11단계 전처리' },
            { step: '3', title: '변수 생성', desc: '353개의 예측 변수를 생성. 검색 트렌드 변화, 과거 매출 패턴, 인기도 순위 등' },
            { step: '4', title: '모델 학습', desc: '16,695건의 과거 데이터로 XGBoost + LightGBM 앙상블 모델 학습' },
            { step: '5', title: '검증', desc: '4,042건의 별도 데이터로 예측 정확도 검증 — 학습에 쓰지 않은 데이터로만' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/20 font-mono text-xs font-bold text-accent">{item.step}</span>
              <div>
                <p className="font-bold text-text">{item.title}</p>
                <p className="mt-0.5 text-sm text-subtext">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 font-serif text-base leading-[1.9] text-subtext">
          <p>
            예측에 가장 중요한 변수는 <strong className="text-text">과거 매출 실적</strong>(2위 대비 6배 이상 차이), 그 다음이 <strong className="text-text">매장 유형</strong>, <strong className="text-text">검색 트렌드</strong>, <strong className="text-text">매출 변동성</strong> 순이었다. 매출이 들쭉날쭉한 IP라는 정보를 모델에 넣어주면 극단적 오차가 줄어든다는 것도 발견했다.
          </p>
        </div>
      </section>

      {/* ── 더 발전시킬 수 있는 것 ── */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">더 발전시킬 수 있는 것</h2>
        <div className="mt-4 space-y-2">
          {[
            { title: '외부 이벤트 반영', desc: '앨범 발매일, 행사 일정, 미디어 편성을 시스템에 입력하면 매출 급등까지 예측 가능. 현재 2.4% 오차의 상당 부분을 줄일 수 있다.' },
            { title: 'SNS 실시간 데이터', desc: '검색량보다 더 빠른 실시간 신호. 화제성 급등을 감지하여 콜라보 시기를 즉시 조정.' },
            { title: '자동 갱신', desc: '새 매출 데이터가 쌓이면 자동으로 모델이 업데이트되는 구조. 시간이 지날수록 정확도가 올라간다.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.title}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="text-sm text-muted">brlim@hanyang.ac.kr</p>
      </section>

    </div>
  )
}
