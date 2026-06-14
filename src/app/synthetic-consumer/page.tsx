import type { Metadata } from 'next'
import Link from 'next/link'
import SixLensDiagram from '@/components/mind-bridge/SixLensDiagram'
import JsonLd from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'AI 소비자 시뮬레이션 — 소비자 디지털 트윈 | BDM Lab',
  description:
    '소비자행동 연구 교수가 설계한 6-Lens 인지 엔진으로 실제 소비자의 행동과 인지를 디지털 트윈으로 복제한다. 합성 FGI로 출시 전 시장 반응을 검증 — holdout 90문항 83% 일치. 프롬프트 챗봇이 아닌 마케팅 과학.',
  alternates: { canonical: '/synthetic-consumer' },
  openGraph: {
    title: 'AI 소비자 시뮬레이션 — 소비자 디지털 트윈 | BDM Lab',
    description: '소비자행동 연구 교수가 설계한 6-Lens 인지 엔진. 행동+인지를 복제한 합성 소비자, holdout 검증 83%.',
    images: [{ url: '/images/og/synthetic-consumer.jpg', width: 1200, height: 627 }],
  },
}

const METHODS = [
  {
    name: 'Twin-2K-500',
    who: 'Toubia et al. 2025 (Columbia)',
    desc: '500+ 문항 설문·행동실험으로 2,058명의 디지털 트윈을 구축. 설문 응답 재현 정확도(정규화) 0.877.',
    role: '설문 구조',
  },
  {
    name: 'Generative Agents',
    who: 'Park et al. 2024 (Stanford)',
    desc: '2시간 음성 인터뷰로 1,052명의 "왜 그렇게 행동하는지"를 재현. GSS 재현 정확도 85%.',
    role: '인터뷰 + 해석',
  },
  {
    name: '6-Lens 인지 엔진',
    who: 'BDM Lab · 임보람',
    desc: '소비자행동 이론 6종으로 응답을 재구조화해 응답–행동 간극을 최소화. 정형 데이터의 한계를 보완하는 자체 설계.',
    role: '핵심 차별점',
  },
]

const FAQ_ITEMS = [
  {
    q: 'AI 소비자 시뮬레이션이란 무엇인가요?',
    a: '실제 소비자의 의식적·무의식적 사고를 디지털 트윈으로 복제해, 합성 FGI(집단 심층면접)로 출시 전 시장 반응을 검증하는 연구 방법입니다. 빅데이터마케팅 랩은 소비자의 구매 행동과 인지(왜 그렇게 결정하는가)를 함께 복제합니다.',
  },
  {
    q: '기존 페르소나 챗봇과 무엇이 다른가요?',
    a: '일반적인 페르소나 챗봇은 인구통계 프롬프트 몇 줄로 "누구든 될 수 있는" 답을 냅니다. 빅데이터마케팅 랩의 합성 소비자는 (1) 실제 구매·행동 데이터에서 드러난 선호와 (2) AI 음성 인터뷰로 끝까지 캐낸 인지를, 소비자행동 이론 기반의 6-Lens 인지 엔진으로 재구조화해 만듭니다. 마케팅 과학 연구자가 설계한 아키텍처라는 점이 근본적인 차이입니다.',
  },
  {
    q: '정확도는 어떻게 검증하나요?',
    a: 'AI가 학습에 쓰지 않은 holdout 90문항으로 검증합니다. 6-Lens가 이식된 에이전트의 응답 83%가 실제 사람의 응답과 의미적으로 일치했습니다(가중 일치 점수). "그 사람처럼 답한다"를, 본 적 없는 문항을 정답으로 두고 맞히게 해 측정합니다.',
  },
  {
    q: '어떤 경우에 적합하고, 어떤 한계가 있나요?',
    a: '신제품 콘셉트·광고 카피·가격을 빠르고 넓게 1차 스크리닝하는 데 강합니다. 다만 친숙한 카테고리에서 정확도가 높고 신규·낯선 카테고리에서는 신뢰도를 낮춰 봐야 합니다. 합성 결과는 소수의 인간 검증과 짝지어 쓰는 것이 원칙입니다.',
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
      <JsonLd type="faq" data={{ items: FAQ_ITEMS }} />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          AI Consumer Simulation · 디지털 트윈
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          단순한 AI가 아니다.
          <br />
          소비자의 뇌를 복제한 디지털 트윈.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          <strong className="text-text">AI 소비자 시뮬레이션</strong>은 실제 소비자의
          의식적·무의식적 사고를 디지털 트윈으로 복제해, 합성 FGI로 출시 전 시장 반응을
          검증하는 연구다. 빅데이터에서 소비자의 묻힌 선호와 인지를 끄집어내는 마케팅 과학 —
          그 핵심은 <strong className="text-text">소비자행동 연구자가 직접 설계한
          &lsquo;6-Lens 인지 엔진&rsquo;</strong>이다.
        </p>
      </section>

      {/* 핵심 수치 */}
      <section className="mx-auto mt-10 max-w-[720px]">
        <div className="grid grid-cols-3 gap-3">
          <StatCard stat="83%" label="holdout 행동 예측 일치" />
          <StatCard stat="1/10" label="리서치 비용·시간 압축" />
          <StatCard stat="6-Lens" label="독자적 인지 엔진" />
        </div>
      </section>

      {/* 01 시장의 복제 */}
      <section className="mx-auto mt-16 max-w-[720px]">
        <SectionHead no="01" title="시장의 복제 — 챗봇의 흉내를 넘어선 '진짜 소비자'" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          일반적인 LLM 에이전트는 인구통계 프롬프트에 의존해 &ldquo;누구든 될 수 있는 뻔한
          대답&rdquo;을 뱉는다. <strong className="text-text">BDM Lab의 접근은 근본적으로
          다르다.</strong> 평생 소비자 행동과 빅데이터를 연구해 온 마케팅 과학의 설계가
          기술의 근간에 자리 잡고 있다. 한 사람의 모순된 자아를, 두 가지 실제 데이터로
          직조한다.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">행동 · Preference</p>
            <p className="mt-1 text-base font-bold text-text">증명된 취향</p>
            <p className="mt-2 text-sm leading-relaxed text-subtext">
              실제 구매·행동 데이터에서 드러난 선호(revealed preference). 말이 아니라 선택으로
              증명된, 타협 없는 취향.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">인지 · Cognition</p>
            <p className="mt-1 text-base font-bold text-text">숨은 이유</p>
            <p className="mt-2 text-sm leading-relaxed text-subtext">
              자체 AI 음성 인터뷰로 끝까지 추적해 낸 의사결정의 &lsquo;숨은 이유&rsquo;.
              구매 데이터엔 남지 않는 &ldquo;왜&rdquo;.
            </p>
          </div>
        </div>
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          말과 행동의 괴리가 사라진, <strong className="text-text">스스로 고민하고 논쟁하는
          진짜 타깃 시장</strong>이 화면 안에 복제된다.
        </p>
      </section>

      {/* 02 6-Lens 인지 엔진 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <SectionHead no="02" title="기술의 핵심 — 6-Lens 인지 엔진" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          프롬프트 엔지니어링의 얄팍함을 부수는 지점이 여기다. 소비자행동 이론과 빅데이터
          분석의 정수가 <strong className="text-text">6-Lens 의사결정 구조</strong>로 압축되어
          에이전트의 &lsquo;사고&rsquo;가 된다. 이 렌즈를 거친 에이전트는, 인간 고유의 편향과
          갈등을 내재한 자율적 개체가 된다. 인간의 비합리성까지 데이터로 구조화했기에,
          단순한 확률적 텍스트가 아니라 <strong className="text-text">6차원의 가치 공간에서
          &lsquo;왜&rsquo;를 추론</strong>하며 결정을 재현한다.
        </p>
        <div className="mt-8">
          <SixLensDiagram />
        </div>
      </section>

      {/* 03 데이터 파이프라인 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <SectionHead no="03" title="데이터 파이프라인 — 인지 발굴부터 멀티에이전트 토론까지" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          스탠퍼드(Park)와 컬럼비아(Toubia)의 최신 연구를 결합하고, BDM Lab의 6-Lens
          엔진을 얹었다.
        </p>
        <ol className="mt-6 space-y-3">
          <li className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm font-bold text-text">① 초정밀 인지 발굴</p>
            <p className="mt-1 text-sm leading-relaxed text-subtext">
              피상적 설문을 거부한다. AI 음성 인터뷰가 후속 질문(follow-up)을 자동 생성해
              소비자의 무의식을 끝까지 캐낸다.
            </p>
          </li>
          <li className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm font-bold text-text">② 사고복제 페르소나 빌드</p>
            <p className="mt-1 text-sm leading-relaxed text-subtext">
              추출된 인지와 행동 데이터를 6-Lens로 재구조화해, 통제 가능한 사고 엔진으로
              변환한다.
            </p>
          </li>
          <li className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm font-bold text-text">③ 합성 FGI — 멀티에이전트 토론</p>
            <p className="mt-1 text-sm leading-relaxed text-subtext">
              복제된 에이전트들이 그룹 토론을 벌이며 진영을 형성하고 합의에 이른다. 실제
              집단면접의 깊이를, 1/10의 비용과 시간으로 구현한다.
            </p>
          </li>
        </ol>
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
      </section>

      {/* 04 검증 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <SectionHead no="04" title="결과로 증명된 83%의 현실 예측력" />
        <p className="mt-5 font-serif text-base leading-[1.9] text-subtext">
          결과가 담보되지 않는 시뮬레이션은 무의미하다. AI가 단 한 번도 본 적 없는 90개의
          낯선 질문(holdout) 앞에서도, 6-Lens가 이식된 에이전트의{' '}
          <strong className="text-text">83%가 실제 사람과 동일한 선택</strong>을 내렸다.
          예측을 넘어선 현실의 복제다.
        </p>
        <div className="mt-6 rounded-xl border border-accent bg-accent-bg p-5">
          <p className="text-sm leading-relaxed text-subtext">
            시장에 출시해 막대한 실패 비용을 치르기 전에, BDM Lab의 합성 에이전트 그룹에게
            먼저 물어보라. 출시 전, 당신 브랜드의 숨은 리스크와 기회를 미리 살아볼 수 있다.
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          단, 합성 소비자는 인간 조사를 대체하지 않는다. 넓고 빠른 1차 스크리닝의 도구이며,
          소수의 인간 검증과 짝지을 때 가장 정확하다. 친숙한 카테고리와 신규 카테고리의
          신뢰 등급은 다르게 둔다.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-[720px] border-t border-border pt-10">
        <h2 className="text-xl font-bold text-text">파일럿, 그리고 함께 연구할 분</h2>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          실제 소비재 브랜드(셀프사진관)와 함께, 에이전트 구축부터 인사이트 도출까지 전
          과정을 적용한 파일럿을 마쳤습니다. 같은 브랜드의 매출 예측 프로젝트와도 이어지는,
          예측과 복제를 잇는 사례입니다.
        </p>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          소비자 시뮬레이션을 활용한 공동연구나 기업 협업에 관심이 있으시면 편하게 연락
          주세요.
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
        <p className="mt-8 text-xs leading-relaxed text-muted">
          이 연구는 <strong className="text-subtext">Mind-Bridge</strong>(합성 FGI)·
          <a href="https://mindlens-ai.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">MindLens</a>(AI 음성 인터뷰, mindlens-ai.com)로 상용화되고 있습니다.
        </p>
      </section>
    </div>
  )
}
