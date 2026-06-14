import type { Metadata } from 'next'
import Link from 'next/link'
import SixLensDiagram from '@/components/mind-bridge/SixLensDiagram'

export const metadata: Metadata = {
  title: 'AI 소비자 시뮬레이션 (Mind-Bridge) — BDM Lab',
  description:
    '소비자의 의식적·무의식적 사고를 디지털 트윈으로 복제한다. 합성 FGI를 만들고, 사고를 복제한 소비자와 대화한다. Twin-2K-500 + Generative Agents + 6-Lens, holdout 검증 83%.',
}

const STEPS = [
  { no: '1', label: '의뢰 접수', sub: '조사 목적·타깃 정의' },
  { no: '2', label: '설문·인터뷰 설계', sub: '6-Lens 기반 질문 구조' },
  { no: '3', label: '패널 데이터 수집', sub: '설문 2종 + 음성 인터뷰' },
  { no: '4', label: 'AI 에이전트 생성', sub: '사고복제 페르소나 빌드' },
  { no: '5', label: 'FGI 진행', sub: '멀티에이전트 그룹 토론' },
  { no: '6', label: '인사이트 리포트', sub: '발화 + 현상 + 시사점' },
]

const METHODS = [
  {
    name: 'Twin-2K-500',
    who: 'Toubia et al. 2025',
    desc: '500+ 문항 설문·행동실험으로 2,058명의 디지털 트윈 구축. 설문 응답 재현 정확도(정규화) 0.877.',
    role: '설문 구조 차용',
  },
  {
    name: 'Generative Agents',
    who: 'Park et al. 2024 (Stanford)',
    desc: '2시간 음성 인터뷰로 1,052명의 "왜 그렇게 행동하는지"를 재현. GSS 재현 정확도 85%.',
    role: '인터뷰 방식 + Expert Reflection 차용',
  },
  {
    name: '6-Lens 의사결정 구조',
    who: 'BDM Lab',
    desc: '소비자행동 이론 6종으로 응답을 재구조화해 응답–행동 간극을 최소화. 정형 데이터의 한계를 보완.',
    role: '자체 방법론',
  },
]

function StatCard({ stat, label }: { stat: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 text-center">
      <p className="text-3xl font-bold text-accent">{stat}</p>
      <p className="mt-1 text-xs text-subtext">{label}</p>
    </div>
  )
}

export default function SyntheticConsumerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          AI Consumer Simulation · Mind-Bridge
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          사람처럼 답하는 AI.
          <br />
          사고를 복제한 소비자와 대화합니다.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          소비자의 의식적·무의식적 사고를 디지털 트윈으로 복제하고, 합성 FGI(집단
          심층면접)를 만들어, 사고가 복제된 소비자와 직접 대화하는 연구 플랫폼입니다.
        </p>
      </section>

      {/* 핵심 수치 */}
      <section className="mx-auto mt-10 max-w-[720px]">
        <div className="grid grid-cols-3 gap-3">
          <StatCard stat="83%" label="holdout 응답 재현" />
          <StatCard stat="1/10" label="기존 FGI 대비 비용·시간" />
          <StatCard stat="6" label="의사결정 렌즈" />
        </div>
      </section>

      {/* 문제 */}
      <section className="mx-auto mt-16 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            01
          </span>
          <h2 className="text-xl font-bold text-text">문제 — 비싸고 느린 FGI</h2>
        </div>
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          기업은 신제품 출시 전 소비자의 진짜 &lsquo;행동 이유&rsquo;와 &lsquo;숨은
          니즈&rsquo;를 파악하기 위해 FGI(집단 심층면접)를 한다. 하지만 전통 FGI는{' '}
          <strong className="text-text">1회에 수백만~수천만 원</strong>, 기획부터
          리포트까지 <strong className="text-text">최소 한 달에서 수개월</strong>이
          걸린다. 비용과 시간의 벽 때문에, 정작 잦은 테스트가 필요한 중소·인디 브랜드는
          FGI를 거의 쓰지 못한다. 신제품 다수가 출시 1년 내 실패하는 이유다.
        </p>
      </section>

      {/* 솔루션 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            02
          </span>
          <h2 className="text-xl font-bold text-text">솔루션 — 복제된 소비자 멀티에이전트</h2>
        </div>
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          실제 소비자를 복제한 AI 에이전트가 서로 의견을 주고받는{' '}
          <strong className="text-text">멀티에이전트 FGI</strong>를 진행한다.
          단일 1:1 응답이 아니라 그룹 토론 형태로, 진영이 갈리고 다시 모이는 실제
          집단면접에 가까운 깊이의 인사이트를 만든다. 같은 페르소나에 시점을 바꿔
          반복 질문할 수 있어 변화·개선 추적도 가능하다.
        </p>
      </section>

      {/* 작동 방식 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            03
          </span>
          <h2 className="text-xl font-bold text-text">작동 방식 — 7단계 파이프라인</h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.no} className="rounded-xl border border-border bg-surface p-4">
              <span className="font-mono text-xs text-accent">STEP {s.no}</span>
              <p className="mt-1 text-sm font-bold text-text">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6-Lens */}
      <section className="mx-auto mt-10 max-w-[720px]">
        <SixLensDiagram />
      </section>

      {/* 방법론 · 검증 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            04
          </span>
          <h2 className="text-xl font-bold text-text">방법론과 검증</h2>
        </div>
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          검증된 두 선행연구를 결합한다 — 설문은 잘 재현하지만 자유 발화가 약한{' '}
          <strong className="text-text">Toubia</strong>, 인터뷰 깊이는 있지만 정량
          검증이 어려운 <strong className="text-text">Park</strong>. 둘을 합쳐
          설문 정확도와 인터뷰 인사이트를 동시에 확보하고, 자체 6-Lens로 재구조화한다.
        </p>
        <div className="mt-6 space-y-3">
          {METHODS.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-bold text-text">{m.name}</p>
                <span className="shrink-0 font-mono text-[10px] text-accent">{m.role}</span>
              </div>
              <p className="mt-0.5 font-mono text-[10px] text-muted">{m.who}</p>
              <p className="mt-2 text-sm leading-relaxed text-subtext">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-accent bg-accent-bg p-5">
          <p className="text-sm leading-relaxed text-subtext">
            <strong className="text-accent">검증 결과:</strong> 학습에 쓰지 않은 holdout
            90문항에서, 에이전트 응답의 <strong className="text-text">83%</strong>가 실제
            사람의 응답과 의미적으로 일치(가중 일치 점수)했다. &ldquo;그 사람처럼
            답한다&rdquo;는 주장을, LLM이 본 적 없는 응답을 정답으로 두고 맞추게 해 검증한다.
          </p>
        </div>
      </section>

      {/* 파일럿 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
            05
          </span>
          <h2 className="text-xl font-bold text-text">파일럿 — 실제 브랜드 적용</h2>
        </div>
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          소비재 브랜드(셀프사진관)의 실제 리서치 니즈를 기반으로, 에이전트 구축부터
          소비자 인사이트 도출까지 전 과정을 직접 구현했다. 같은 브랜드의 매출 예측
          프로젝트와 연결되는, 예측과 복제를 잇는 사례다.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">함께 연구할 분을 찾습니다</h2>
        <p className="mt-3 text-base leading-relaxed text-subtext">
          소비자 시뮬레이션을 활용한 공동연구·기업 협업에 관심이 있으시면 편하게
          연락 주세요.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#0B0F14] transition-opacity hover:opacity-90"
          >
            협업 문의
          </Link>
          <Link
            href="/research"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-subtext transition-colors hover:border-accent hover:text-accent"
          >
            다른 연구 보기
          </Link>
        </div>
      </section>
    </div>
  )
}
