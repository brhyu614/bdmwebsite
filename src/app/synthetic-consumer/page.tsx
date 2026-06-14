import type { Metadata } from 'next'
import Link from 'next/link'
import SixLensDiagram from '@/components/mind-bridge/SixLensDiagram'
import JsonLd from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'AI 소비자 시뮬레이션 (Mind-Bridge) — BDM Lab',
  description:
    '소비자의 의식적·무의식적 사고를 디지털 트윈으로 복제한다. 합성 FGI를 만들고, 사고를 복제한 소비자와 대화한다. Twin-2K-500 + Generative Agents + 6-Lens, holdout 검증 83%.',
  alternates: { canonical: '/synthetic-consumer' },
  openGraph: {
    title: 'AI 소비자 시뮬레이션 (Mind-Bridge) — BDM Lab',
    description: '소비자의 사고를 디지털 트윈으로 복제 → 합성 FGI → 대화. holdout 검증 83%.',
    images: [{ url: '/images/og/synthetic-consumer.jpg', width: 1200, height: 627 }],
  },
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
    role: '인터뷰 + Expert Reflection',
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

function SectionHead({ no, title }: { no: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg font-mono text-sm font-bold text-accent">
        {no}
      </span>
      <h2 className="text-xl font-bold text-text">{title}</h2>
    </div>
  )
}

export default function SyntheticConsumerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="breadcrumb" data={{ items: [
        { name: '홈', url: SITE_URL },
        { name: '연구', url: `${SITE_URL}/research` },
        { name: 'AI 소비자 시뮬레이션', url: `${SITE_URL}/synthetic-consumer` },
      ] }} />
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

      {/* 01 문제와 해법 */}
      <section className="mx-auto mt-16 max-w-[720px]">
        <SectionHead no="01" title="비싸고 느린 FGI, 그리고 해법" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          기업은 신제품 출시 전 소비자의 진짜 &lsquo;행동 이유&rsquo;와 &lsquo;숨은
          니즈&rsquo;를 FGI(집단 심층면접)로 파악한다. 하지만 전통 FGI는{' '}
          <strong className="text-text">1회 수백만~수천만 원</strong>, 기획부터
          리포트까지 <strong className="text-text">한 달에서 수개월</strong>이 걸린다.
          이 벽 때문에 잦은 테스트가 필요한 중소·인디 브랜드는 거의 쓰지 못한다.
        </p>
        <p className="mt-4 font-serif text-base leading-[1.9] text-subtext">
          <strong className="text-text">Mind-Bridge</strong>는 실제 소비자를 복제한
          AI 에이전트가 서로 의견을 주고받는 <strong className="text-text">멀티에이전트
          FGI</strong>를 진행한다. 1:1 응답이 아니라 진영이 갈리고 다시 모이는 그룹
          토론으로, 실제 집단면접에 가까운 깊이를 비용·시간 1/10로 만든다. 같은
          페르소나에 시점을 바꿔 반복 질문하면 변화·개선 추적도 가능하다.
        </p>
      </section>

      {/* 02 행동 + 인지 (+ MindLens) */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <SectionHead no="02" title="왜 더 진짜에 가까운가 — 행동 + 인지" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          기존 LLM 에이전트 모델링은 인구통계나 한 문단짜리 페르소나 프롬프트에
          의존해, &ldquo;그럴듯하지만 누구든 될 수 있는&rdquo; 응답에 그친다. 우리는
          한 사람을 <strong className="text-text">두 종류의 실제 데이터</strong>로
          직조한다.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
              무엇을 선택하는가
            </p>
            <p className="mt-1 text-base font-bold text-text">선호 (Preference)</p>
            <p className="mt-2 text-sm leading-relaxed text-subtext">
              실제 구매·행동 데이터에서 드러난 선호(revealed preference)를 가져온다.
              말이 아니라 선택으로 증명된 취향.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
              왜 그렇게 생각하는가
            </p>
            <p className="mt-1 text-base font-bold text-text">인지 (Cognition)</p>
            <p className="mt-2 text-sm leading-relaxed text-subtext">
              자체 AI 인터뷰 시스템 MindLens로 의사결정의 사고 과정을 끌어낸다.
              구매 데이터엔 안 남는 &ldquo;왜&rdquo;를 캐낸다.
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-accent bg-accent-bg p-5 text-center">
          <p className="font-mono text-sm text-subtext">
            <span className="text-text">행동(무엇을)</span>
            <span className="mx-2 text-accent">+</span>
            <span className="text-text">인지(왜)</span>
            <span className="mx-2 text-accent">→</span>
            <span className="font-bold text-accent">디지털 트윈</span>
          </p>
          <p className="mt-2 text-xs text-muted">
            행동과 인지를 한 사람 안에서 직조하므로, 설문 응답과 실제 행동의 간극이 줄어든다.
          </p>
        </div>

        {/* MindLens (인지 수집 시스템) */}
        <p className="mt-6 font-serif text-base leading-[1.9] text-subtext">
          인지 데이터를 모으는 도구가 <strong className="text-text">MindLens</strong>다.
          AI가 음성으로 서베이·심층 인터뷰를 직접 진행하고, 응답이 얕으면 후속
          질문(follow-up)을 자동 생성해 &ldquo;왜?&rdquo;를 끝까지 캐낸다. 이 데이터가
          6-Lens로 재구조화되어 에이전트의 &lsquo;사고&rsquo;가 된다.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-surface p-5 text-center font-mono text-xs">
          <span className="rounded-lg bg-bg px-3 py-2 text-text">MindLens<br /><span className="text-[10px] text-muted">AI 인터뷰·서베이</span></span>
          <span className="text-accent">→</span>
          <span className="rounded-lg bg-bg px-3 py-2 text-text">6-Lens<br /><span className="text-[10px] text-muted">사고 재구조화</span></span>
          <span className="text-accent">→</span>
          <span className="rounded-lg border border-accent bg-accent-bg px-3 py-2 text-accent">Mind-Bridge<br /><span className="text-[10px] text-subtext">합성 FGI</span></span>
        </div>
        <a
          href="https://mindlens-ai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-accent bg-accent-bg px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
        >
          MindLens — AI 보이스 인터뷰 플랫폼 ↗
        </a>
      </section>

      {/* 03 작동 방식 + 6-Lens */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <SectionHead no="03" title="작동 방식 — 7단계 파이프라인" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.no} className="rounded-xl border border-border bg-surface p-4">
              <span className="font-mono text-xs text-accent">STEP {s.no}</span>
              <p className="mt-1 text-sm font-bold text-text">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <SixLensDiagram />
        </div>
      </section>

      {/* 04 방법론과 검증 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <SectionHead no="04" title="방법론과 검증" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          검증된 두 선행연구를 결합한다 — 설문은 잘 재현하지만 자유 발화가 약한{' '}
          <strong className="text-text">Toubia</strong>, 인터뷰 깊이는 있지만 정량
          검증이 어려운 <strong className="text-text">Park</strong>. 둘을 합쳐 설문
          정확도와 인터뷰 인사이트를 동시에 확보하고, 자체 6-Lens로 재구조화한다.
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
            사람의 응답과 의미적으로 일치(가중 일치 점수)했다. LLM이 본 적 없는 응답을
            정답으로 두고 맞추게 해, &ldquo;그 사람처럼 답한다&rdquo;를 검증한다.
          </p>
        </div>
      </section>

      {/* 05 파일럿 + CTA */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
        <SectionHead no="05" title="파일럿, 그리고 함께 연구할 분" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          소비재 브랜드(셀프사진관)의 실제 리서치 니즈로 에이전트 구축부터 인사이트
          도출까지 전 과정을 구현한 파일럿을 마쳤다. 같은 브랜드의 매출 예측 프로젝트와
          연결되는, 예측과 복제를 잇는 사례다. 소비자 시뮬레이션을 활용한 공동연구·기업
          협업에 관심이 있으시면 편하게 연락 주세요.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#0B0F14] transition-opacity hover:opacity-90"
          >
            공동연구·협업 문의
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
