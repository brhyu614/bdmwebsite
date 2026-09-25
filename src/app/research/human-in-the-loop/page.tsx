import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI의 빈자리를 사람이 채운다',
  description:
    'LLM 멀티에이전트 시스템의 실패율은 41%에서 86.7%에 이른다. 빅데이터마케팅 랩(BDM Lab)은 실패가 생기는 세 자리에 사람의 판단을 넣어 AI의 장점만 남긴다.',
  alternates: { canonical: '/research/human-in-the-loop' },
}

const GAPS = [
  {
    no: '01',
    fail: '시스템 설계 문제',
    share: '44.2%',
    what:
      '에이전트에게 맡긴 일이 무엇인지 흐릿하면, 같은 지시를 줘도 매번 다른 결과가 나옵니다. MAST 연구에서 한 시스템은 "매일 새 단어를 무작위로 뽑아라"는 지시를 두 번 받고도 고정된 단어 목록을 쓰는 코드를 만들었습니다.',
    human: '연구자가 직접 설계하는 질문지와 역할',
    how: '에이전트가 물어야 할 문항, 판단 순서, 멈출 조건을 사람이 정합니다. 같은 모형을 쓰고 역할 명세만 고쳐도 성공률이 9.4%p 올랐다는 것이 MAST의 실측입니다.',
  },
  {
    no: '02',
    fail: '에이전트 간 엇갈림',
    share: '32.3%',
    what:
      '에이전트끼리 말이 통하는 것처럼 보여도 서로 다른 뜻으로 알아듣습니다. MAST 사례에서 감독 에이전트는 "접근 토큰을 달라"는 요청에 사용자 비밀번호를 그대로 넘겼습니다. 무엇이 필요한지 재질문하지 않고 가정으로 진행한 결과입니다.',
    human: '실제 경험자의 인터뷰로 고정하는 판단 근거',
    how: '가상 소비자가 무엇을 중요하게 보는지를 지어내게 두지 않습니다. 같은 조건을 겪은 사람을 심층 인터뷰해 판단 근거를 문장으로 받아 에이전트에 넣습니다.',
  },
  {
    no: '03',
    fail: '작업 검증 실패',
    share: '23.5%',
    what:
      '검증 단계가 있어도 겉만 봅니다. MAST 사례의 체스 프로그램은 컴파일 검사와 주석 검사를 모두 통과했지만, 실제로 두어 보면 기물 이동 규칙이 지켜지지 않아 게임이 되지 않았습니다.',
    human: '실제 응답과 대조하는 일치율 측정',
    how: '에이전트의 답을 그 사람이 실제로 고른 답과 맞춰 봅니다. 겹치지 않은 항목은 어느 성향에서 틀렸는지 되짚습니다. 상위 검증 단계를 더했을 때 성공률이 15.6%p 올랐다는 것이 MAST의 실측입니다.',
  },
]

const EXPERIMENT = [
  {
    n: '01',
    t: '바꿀 조건을 정하는 단계',
    d: '가격을 12% 올렸을 때, 용량을 줄이고 값을 유지했을 때, 새 성분을 넣었을 때처럼 실제로 검토 중인 선택지를 조건으로 세웁니다. 조건마다 나머지는 그대로 두고 하나만 바꿉니다.',
  },
  {
    n: '02',
    t: '가상 소비자에게 묻는 단계',
    d: '복제한 에이전트 수백 명에게 같은 질문을 던집니다. 사람 조사와 달리 같은 사람에게 조건을 바꿔 여러 번 물을 수 있어, 한 사람 안에서 무엇이 선택을 뒤집는지 볼 수 있습니다.',
  },
  {
    n: '03',
    t: '답의 이유를 받는 단계',
    d: '선택만 받지 않고 왜 그렇게 골랐는지를 문장으로 받습니다. 설문의 보기 다섯 개로는 잡히지 않던 조건이 여기서 나옵니다.',
  },
  {
    n: '04',
    t: '실제와 맞춰 보는 단계',
    d: '같은 질문을 실제 소비자 일부에게 던져 두 답을 대조합니다. 일치율이 기준에 못 미치면 그 조건의 결과는 쓰지 않습니다.',
  },
]

const RARE_CASE = [
  {
    step: '문제',
    body: '희귀 질환자나 특정 시술 경험자처럼 전체 인구의 1%도 되지 않는 집단은 설문을 돌려도 유효 응답이 수십 명에 그칩니다. 표본이 작으면 신제품 구매 의향을 물어도 통계적으로 판단할 수 없습니다.',
  },
  {
    step: '사람이 하는 일 1',
    body: '실제 경험자만 남기는 확인 문항을 설문에 심습니다. 다낭성 난소 증후군 조사에서는 진단받은 기관, 실제로 받은 검사, 의사에게 들은 내용, 처방약을 묻는 문항 8개를 본 설문 126문항 사이에 흩어 놓았습니다. 진단 경험이 없으면 답할 수 없는 문항이라 자격 없는 응답이 걸러집니다.',
  },
  {
    step: '사람이 하는 일 2',
    body: '걸러진 응답자를 심층 인터뷰해 의사결정 과정을 페르소나로 만듭니다. 무엇을 보고 제품을 고르는지, 어떤 조건에서 마음을 바꾸는지를 본인의 말로 받습니다.',
  },
  {
    step: 'AI가 하는 일',
    body: '페르소나를 LLM 에이전트로 구현해 제품 반응과 구매 의향을 묻습니다. 수십 명에게만 물을 수 있던 질문을 수백 번 던지고, 조건을 바꿔 가며 반복합니다.',
  },
  {
    step: '검증',
    body: '에이전트의 답을 실제 응답자의 답과 대조해 일치율로 잽니다. 검증을 거치지 않은 가상 응답은 결과로 쓰지 않습니다.',
  },
]

export default function HumanInTheLoopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Human in the Loop</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          AI가 실패하는 자리를 사람이 채운다
        </h1>
        <div className="mt-6 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            AI 에이전트 여러 개를 엮어 일을 시키면 잘 돌아갈 것 같지만, 실제로는 절반 가까이
            실패합니다. 2025년 NeurIPS에 실린 MAST 연구는 공개된 멀티에이전트 시스템 7종을
            분석해 실패율이 41%에서 86.7%에 이른다고 보고했습니다. 실패 기록 1,642건을 뜯어 본
            결론은 분명합니다. 실패는 모델이 모자라서 생기는 것이 아니라 설계에서 생깁니다.
          </p>
          <p>
            이 연구실은 AI를 더 크게 키워 문제를 풀지 않습니다. 실패가 생기는 세 자리를 찾아
            그곳에 사람의 판단을 넣고, 나머지 자리에서 AI가 할 수 있는 일을 끝까지 시킵니다.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { v: '41–86.7%', l: '멀티에이전트 실패율' },
            { v: '1,642건', l: '분석된 실패 기록' },
            { v: '14개', l: '확인된 실패 유형' },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-surface px-3 py-4 text-center">
              <p className="font-mono text-lg font-bold text-accent">{s.v}</p>
              <p className="mt-1 text-[11px] text-subtext">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          출처: Cemri et al. (2025), &ldquo;Why Do Multi-Agent LLM Systems Fail?&rdquo;, NeurIPS
          Datasets and Benchmarks Track
        </p>
      </section>

      {/* 세 자리 */}
      <section className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">사람이 들어가는 세 자리</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          MAST 연구는 실패 유형 14개를 세 범주로 묶었습니다. 범주마다 이 연구실이 사람의 판단을
          넣는 자리가 정해져 있습니다.
        </p>

        <div className="mt-8 space-y-5">
          {GAPS.map((g) => (
            <div key={g.no} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="grid md:grid-cols-2">
                {/* 문제 */}
                <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-sm font-bold text-muted">{g.no}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      AI가 실패하는 지점
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <h3 className="text-base font-bold text-text">{g.fail}</h3>
                    <span className="font-mono text-sm text-muted">{g.share}</span>
                  </div>
                  <p className="mt-3 font-serif text-sm leading-[1.85] text-subtext">{g.what}</p>
                </div>
                {/* 해법 */}
                <div className="bg-accent-bg p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    사람이 채우는 방식
                  </span>
                  <h3 className="mt-2 text-base font-bold text-text">{g.human}</h3>
                  <p className="mt-3 font-serif text-sm leading-[1.85] text-subtext">{g.how}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 가상 실험 */}
      <section className="mx-auto mt-20 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">가상에서 먼저 돌리는 실험</h2>
        <div className="mx-auto mt-3 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            가격을 올려 보고 나서 매출이 떨어지면 되돌릴 수 없습니다. 신제품을 출시하고 나서
            반응을 보면 이미 비용이 들어간 뒤입니다. 현실에서는 한 번에 한 가지 선택만 할 수
            있고, 고르지 않은 쪽에서 무슨 일이 일어났을지는 영영 알 수 없습니다.
          </p>
          <p>
            복제한 소비자에게는 같은 사람에게 조건을 바꿔 가며 몇 번이고 물을 수 있습니다. 가격을
            올린 세상과 올리지 않은 세상을 나란히 돌려 두 결과를 비교하는 일이, 가상에서는
            가능합니다.
          </p>
        </div>

        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {EXPERIMENT.map((e) => (
            <li key={e.n} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-accent">{e.n}</span>
                <h3 className="text-sm font-bold text-text">{e.t}</h3>
              </div>
              <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">{e.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-xl border border-border bg-surface p-6">
          <h3 className="text-sm font-bold text-text">실험에서 물을 수 있는 질문</h3>
          <ul className="mt-3 space-y-2">
            {[
              '가격을 12% 올리면 어떤 고객이 먼저 떠납니까.',
              '용량을 줄이고 값을 유지하는 쪽과 값을 올리는 쪽 중 어느 쪽이 덜 잃습니까.',
              '새 성분을 넣은 제품을 기존 고객이 받아들입니까.',
              '광고 문구를 바꾸면 어떤 집단에서 반응이 달라집니까.',
            ].map((q) => (
              <li key={q} className="flex gap-2 font-serif text-sm leading-[1.8] text-subtext">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 희소 표본 사례 */}
      <section className="mx-auto mt-20 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">응답자 수십 명으로 시장을 읽는 방법</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          사람과 AI를 나눠 쓰는 방식이 실제 조사에서 어떻게 돌아가는지 보여 주는 사례입니다. 의뢰
          기업의 이름과 계약 내용은 밝히지 않고 방법만 적습니다.
        </p>

        <ol className="mt-8 space-y-4">
          {RARE_CASE.map((r, i) => (
            <li key={r.step} className="relative border-l-2 border-border pl-6">
              <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{r.step}</p>
              <p className="mt-1.5 font-serif text-[15px] leading-[1.9] text-subtext">{r.body}</p>
              {i === RARE_CASE.length - 1 && (
                <p className="mt-3 rounded-lg bg-accent-bg px-3 py-2 font-mono text-xs text-accent">
                  설문 126문항에 확인 문항 8개를 끼워 넣어 실제 진단자만 남겼습니다.
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* 한 줄 정리 */}
      <section className="mx-auto mt-20 max-w-[720px] rounded-2xl border border-accent/30 bg-accent-bg p-7">
        <h2 className="text-lg font-bold text-text">AI를 믿는 만큼 검증한다</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          AI 에이전트는 사람보다 빠르고 지치지 않습니다. 같은 질문을 수백 번 던지고, 조건을 바꿔
          가며 반복하고, 밤새 돌아갑니다. 그 속도를 쓰되 판단의 근거와 검증은 사람에게서
          가져옵니다. 설계와 인터뷰와 대조 검증을 사람이 맡을 때, MAST가 지적한 실패 세 범주가
          줄어듭니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/research/digital-twin"
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            소비자 복제의 원리 보기
          </Link>
          <Link
            href="/research/ai"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:border-accent/40"
          >
            AI 연구 보기
          </Link>
        </div>
      </section>
    </div>
  )
}
