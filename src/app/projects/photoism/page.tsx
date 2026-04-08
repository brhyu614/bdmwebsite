import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '포토이즘 IP 콜라보 매출 예측 시스템 — BDM Lab',
  description: '462명의 연예인, 4,042건 검증. 97.6% 적중률의 AI 매출 예측 시스템을 구축하여 기업에 납품.',
}

export default function PhotoismPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Project</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          새로운 연예인 콜라보, 매출이 얼마나 나올까?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          포토이즘이 새로운 연예인과 콜라보를 기획할 때, 해당 콜라보의 주간 매출이 얼마나 나올지 미리 예측하는 시스템을 구축했습니다.
        </p>

        {/* Key metrics */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-bold text-text sm:text-3xl">97.6%</p>
            <p className="mt-1 text-xs text-muted">평균 적중률</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-bold text-accent sm:text-3xl">4,042건</p>
            <p className="mt-1 text-xs text-muted">검증 완료</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-2xl font-bold text-text sm:text-3xl">462명</p>
            <p className="mt-1 text-xs text-muted">연예인 분석</p>
          </div>
        </div>
      </section>

      {/* 문제 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="font-serif text-base leading-[1.9] text-subtext space-y-5">
          <p>
            포토이즘은 연예인/IP와의 콜라보레이션으로 매출을 만듭니다. 문제는 <strong className="text-text">어떤 연예인과 콜라보하면 매출이 나올지</strong>를 사전에 알 수 없다는 것이었습니다.
          </p>
          <p>
            기존에는 담당자의 감과 과거 경험에 의존했습니다. &ldquo;이 아이돌이 요즘 뜨니까 될 거야&rdquo; 수준의 판단. 수억 원이 걸린 콜라보 기획을 감으로 결정하고 있었습니다.
          </p>
        </div>
      </section>

      {/* 데이터 */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Data</p>
        <h2 className="mt-4 text-xl font-bold text-text">4가지 정보로 예측합니다</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { title: '네이버 검색량', desc: '성별·연령대별 최근 9~16주 검색 트렌드' },
            { title: '연예인 프로필', desc: '성별, 나이, MBTI, 직업, 소속사, 국적' },
            { title: '콜라보 이력', desc: '과거 콜라보 횟수, 기간, 매출 추이' },
            { title: '매장 정보', desc: '일반 매장 vs 팝업/임시 매장' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-bold text-text">{item.title}</p>
              <p className="mt-1 text-sm text-subtext">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          예측에 가장 큰 영향을 미치는 것은 과거 콜라보 매출 실적과 매장 유형이며, 그 다음으로 네이버 검색 트렌드가 중요합니다.
        </p>
      </section>

      {/* 변수 중요도 차트 */}
      <section className="mx-auto mt-10 max-w-[900px]">
        <Image
          src="/images/projects/photoism/chart_feature_importance_group.png"
          alt="변수 중요도 분석"
          width={900}
          height={400}
          className="rounded-xl border border-border"
        />
        <p className="mt-2 text-center text-xs text-muted">예측에 중요한 정보 그룹별 비중</p>
      </section>

      {/* 6번의 개선 */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Development</p>
        <h2 className="mt-4 text-xl font-bold text-text">6번의 개선을 거쳤습니다</h2>
        <p className="mt-3 text-sm text-subtext">처음부터 97.6%가 아니었습니다.</p>

        <div className="mt-6 space-y-3">
          {[
            { ver: '1차', acc: '81.4%', desc: '기본 예측 (과거 매출만 활용)' },
            { ver: '2차', acc: '91.1%', desc: '네이버 검색량, 연예인 프로필 추가' },
            { ver: '3차', acc: '91.6%', desc: '검색 트렌드 데이터 업그레이드' },
            { ver: '4차', acc: '92.3%', desc: '예측 방식 고도화' },
            { ver: '5차', acc: '96.1%', desc: '두 가지 AI 모델 조합' },
            { ver: '최종', acc: '97.6%', desc: '6개 데이터 소스 통합 + 모델 최적화', highlight: true },
          ].map((item) => (
            <div key={item.ver} className={`flex items-center gap-4 rounded-xl p-4 ${item.highlight ? 'border-2 border-accent bg-accent/5' : 'border border-border bg-surface'}`}>
              <span className={`shrink-0 font-mono text-sm font-bold ${item.highlight ? 'text-accent' : 'text-muted'}`}>{item.ver}</span>
              <span className={`shrink-0 font-bold ${item.highlight ? 'text-accent text-lg' : 'text-text'}`}>{item.acc}</span>
              <span className="text-sm text-subtext">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 버전 비교 차트 */}
      <section className="mx-auto mt-10 max-w-[900px]">
        <Image
          src="/images/projects/photoism/chart_version_comparison.png"
          alt="버전별 예측 성능 개선 추이"
          width={900}
          height={400}
          className="rounded-xl border border-border"
        />
        <p className="mt-2 text-center text-xs text-muted">버전별 예측 정확도 개선 과정 (오차율 18.6% → 2.4%)</p>
      </section>

      {/* 성능 */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Performance</p>
        <h2 className="mt-4 text-xl font-bold text-text">매장 유형별 예측 정확도</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">일반 매장 (고정점)</p>
            <p className="mt-1 text-3xl font-bold text-text">98.1%</p>
            <p className="mt-1 text-xs text-muted">평균 오차 약 5,900원 · 2,478건 검증</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">팝업/임시 매장</p>
            <p className="mt-1 text-3xl font-bold text-text">96.9%</p>
            <p className="mt-1 text-xs text-muted">평균 오차 약 29,500원 · 1,564건 검증</p>
          </div>
        </div>
      </section>

      {/* 실제 vs 예측 */}
      <section className="mx-auto mt-10 max-w-[900px]">
        <Image
          src="/images/projects/photoism/chart_actual_vs_predicted.png"
          alt="실제 매출 vs 예측 매출"
          width={900}
          height={600}
          className="rounded-xl border border-border"
        />
        <p className="mt-2 text-center text-xs text-muted">실제 매출 vs 예측 매출 (대각선에 가까울수록 정확)</p>
      </section>

      {/* 성능 대시보드 */}
      <section className="mx-auto mt-10 max-w-[900px]">
        <Image
          src="/images/projects/photoism/chart_model_performance.png"
          alt="예측 성능 종합 대시보드"
          width={900}
          height={400}
          className="rounded-xl border border-border"
        />
        <p className="mt-2 text-center text-xs text-muted">예측 성능 종합 현황</p>
      </section>

      {/* 예측이 빗나간 경우 */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Error Analysis</p>
        <h2 className="mt-4 text-xl font-bold text-text">예측이 빗나간 경우</h2>
        <div className="mt-4 font-serif text-base leading-[1.9] text-subtext space-y-4">
          <p>
            462명의 연예인 중 대부분은 매우 정확하게 예측됩니다. 약 320명(69%)은 오차 2% 미만. 93명(20%)은 2~5% 이내.
          </p>
          <p>
            예측이 크게 빗나간 경우의 공통점은 두 가지였습니다.
          </p>
          <p>
            <strong className="text-text">1. 과거 콜라보 데이터가 2~4건으로 매우 적은 경우.</strong><br />
            <strong className="text-text">2. 앨범 발매, 콘서트, 드라마 히트 등 예측 불가능한 외부 이벤트.</strong>
          </p>
          <p>
            (G)I-DLE의 &ldquo;I SWAY&rdquo; 밀리언셀러 달성, 이채민의 tvN &ldquo;폭군의 셰프&rdquo; 시청률 17.1%, 무한도전 20주년 이벤트 — 이런 갑작스러운 외부 이벤트는 예측 시스템에 반영되지 않았기 때문에 오차가 발생했습니다. 평소 패턴의 매출은 97.6% 정확도로 맞춥니다.
          </p>
        </div>
      </section>

      {/* 납품물 */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Deliverables</p>
        <h2 className="mt-4 text-xl font-bold text-text">납품한 것</h2>
        <div className="mt-6 space-y-3">
          {[
            { title: '예측 웹 애플리케이션', desc: '연예인 이름·기간·매장 유형을 입력하면 예상 매출을 보여주는 Streamlit 기반 웹앱' },
            { title: '분석 보고서', desc: '15페이지 보고서 + 고오류 원인 분석 보고서' },
            { title: '학습 데이터 + 모델', desc: '16,695건 학습 데이터, XGBoost + LightGBM 앙상블 모델' },
            { title: '데이터 파이프라인', desc: '새 데이터 투입 → 전처리 → 재학습까지 11단계 자동화 코드' },
            { title: '사용자 매뉴얼', desc: '비개발자도 시스템을 운영할 수 있는 설치·사용 가이드' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
              <div>
                <p className="font-bold text-text">{item.title}</p>
                <p className="mt-1 text-sm text-subtext">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 오차 분포 */}
      <section className="mx-auto mt-10 max-w-[900px]">
        <Image
          src="/images/projects/photoism/chart_error_distribution.png"
          alt="오차 분포 분석"
          width={900}
          height={400}
          className="rounded-xl border border-border"
        />
        <p className="mt-2 text-center text-xs text-muted">오차 분포 — 0 근처에 집중, 과대/과소추정 편향 없음</p>
      </section>

      {/* Contact */}
      <section className="mx-auto mt-14 max-w-[720px] border-t border-border pt-10">
        <p className="text-sm text-muted">
          brlim@hanyang.ac.kr
        </p>
      </section>

    </div>
  )
}
