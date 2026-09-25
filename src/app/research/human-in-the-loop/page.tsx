import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI의 빈자리를 사람이 채운다',
  description:
    'LLM으로 소비자를 대신 조사할 때 드러난 여섯 가지 한계와, 빅데이터마케팅 랩(BDM Lab)이 그 자리를 사람의 판단과 실제 기록으로 채우는 방식.',
  alternates: { canonical: '/research/human-in-the-loop' },
}

const GAPS = [
  {
    no: '01',
    fail: '자기 답을 판정하지 못함',
    what:
      'LLM은 틀린 답에도 맞는 답과 같은 확신을 보입니다. 스스로 밝힌 확신도가 실제 정답률과 어긋나기 때문에, 모델이 내놓은 확신도를 걸러내기 기준으로 쓸 수 없습니다.',
    human: '실제 응답과 대조하는 검증',
    how: '에이전트의 답을 그 사람이 실제로 고른 답과 맞춰 봅니다. 겹치지 않은 항목은 어느 성향에서 틀렸는지 되짚습니다. 검증을 거치지 않은 가상 응답은 결과로 쓰지 않습니다.',
    src: 'Xiong et al. (2024), ICLR',
  },
  {
    no: '02',
    fail: '사람 사이의 차이를 지움',
    what:
      '여러 명에게 물어도 비슷한 답만 돌아옵니다. 합성 응답의 분산이 실제 조사보다 크게 줄어, 평균은 맞아도 집단 사이의 차이가 사라집니다.',
    human: '한 사람 단위로 세우는 에이전트',
    how: '평균적인 소비자 대신 특정한 한 사람의 6년치 구매 기록 위에 에이전트를 세웁니다. 같은 조건에서도 다르게 반응하는 사람이 왜 그렇게 고르는지를 그 사람의 기록으로 설명합니다.',
    src: 'Bisbee et al. (2024), Political Analysis',
  },
  {
    no: '03',
    fail: '미래 가치를 심하게 깎음',
    what:
      'LLM은 나중에 받을 값을 실제 소비자보다 훨씬 낮게 매깁니다. 측정된 할인율이 사람보다 크고, 어떤 언어로 묻느냐에 따라 그 정도가 달라집니다.',
    human: '실제 구매 간격으로 고정하는 시간 감각',
    how: '적립, 구독, 재구매처럼 시간이 걸리는 선택을 그 사람의 실제 구매 간격과 재방문 기록으로 잡습니다. 모델이 기본으로 가진 시간 감각 대신 한국 소비자의 기록을 씁니다.',
    src: 'Goli and Singh (2024), Marketing Science',
  },
  {
    no: '04',
    fail: '묻는 방식에 흔들림',
    what:
      '뜻이 같고 형식만 다른 질문을 던져도 답이 달라집니다. 선택지의 순서와 기호만 바꿔도 고르는 답이 바뀝니다.',
    human: '연구자가 고정하는 질문 설계',
    how: '문항의 순서와 표기를 고정하고, 같은 질문을 여러 형식으로 던져 답이 흔들리는 정도를 먼저 잽니다. 흔들림이 큰 문항은 결과에서 제외합니다.',
    src: 'Sclar et al. (2024), ICLR · Brucks and Toubia (2025), PLOS ONE',
  },
  {
    no: '05',
    fail: '한국 소비자를 모름',
    what:
      '영어권 자료로 학습한 모델은 미국에서 멀어질수록 그 사회의 응답과 어긋납니다. 한국인의 가치 판단을 묻는 평가에서 모델의 정렬도가 절반 수준에 머뭅니다.',
    human: '한국 소비자의 기록과 인터뷰',
    how: '한국 소매업체의 구매 기록과 한국어 심층 인터뷰로 판단 근거를 채웁니다. 모델이 기본으로 가진 성향 대신 실제 한국 소비자의 행동이 답을 만듭니다.',
    src: 'Atari et al. (2023) · Lee et al. (2024), Findings of ACL',
  },
  {
    no: '06',
    fail: '여럿을 엮으면 무너짐',
    what:
      '에이전트 여러 개를 엮은 시스템은 절반 가까이 실패합니다. 맡긴 일의 명세가 흐리면 같은 지시에도 다른 결과가 나오고, 에이전트끼리 서로 다른 뜻으로 알아듣습니다.',
    human: '연구자가 짜는 역할과 순서',
    how: '에이전트가 물어야 할 문항, 판단 순서, 멈출 조건을 사람이 정합니다. 에이전트 사이에 오가는 내용도 형식을 정해 흘립니다.',
    src: 'Cemri et al. (2025), NeurIPS · Smit et al. (2024), ICML',
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
      <JsonLd
        type="faq"
        data={{
          items: [
            {
              q: 'LLM으로 소비자를 대신 조사할 때의 한계는 무엇입니까?',
              a: '학술 연구가 반복해 보고한 한계는 여섯 가지입니다. 자기 답이 맞는지 스스로 판정하지 못하고, 사람 사이의 차이를 지우고, 미래 가치를 실제 소비자보다 심하게 깎고, 묻는 방식에 따라 답이 달라지고, 영어권 밖 소비자를 제대로 복제하지 못하고, 에이전트를 여럿 엮으면 무너집니다.',
            },
            {
              q: 'AI가 내놓은 답을 어떻게 검증합니까?',
              a: '같은 질문을 실제 소비자 일부에게 던져 두 답을 대조합니다. 일치율이 기준에 못 미치면 그 조건의 결과는 쓰지 않습니다. 겹치지 않은 항목은 어느 성향에서 틀렸는지 되짚습니다.',
            },
            {
              q: '가상 소비자로 실험하면 무엇을 알 수 있습니까?',
              a: '가격 인상 시 어떤 고객이 먼저 떠나는지, 용량을 줄이는 쪽과 값을 올리는 쪽 중 어느 쪽이 덜 잃는지, 새 성분을 기존 고객이 받아들이는지를 실제 출시 전에 확인할 수 있습니다. 같은 사람에게 조건을 바꿔 여러 번 물을 수 있기 때문입니다.',
            },
            {
              q: '응답자가 수십 명뿐인 희소 집단은 어떻게 조사합니까?',
              a: '확인 문항으로 실제 경험자만 남긴 뒤, 심층 인터뷰로 의사결정 과정을 페르소나로 만들고, 그 페르소나를 LLM 에이전트로 구현해 반복 질문합니다. 에이전트의 답은 실제 응답자의 답과 대조해 일치율로 검증합니다.',
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Human in the Loop</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          AI가 실패하는 자리를 사람이 채운다
        </h1>
        <div className="mt-6 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            LLM에게 소비자를 대신 물어보면 답은 빠르게 돌아옵니다. 그 답이 실제 소비자의 답과
            같은지는 별개의 문제입니다. 지난 몇 해 동안 여러 학술지와 학회가 같은 한계를 반복해
            보고했습니다. 모델은 자기 답을 검증하지 못하고, 사람 사이의 차이를 지우고, 묻는 방식에
            흔들리고, 영어권 밖의 소비자를 제대로 복제하지 못합니다.
          </p>
          <p>
            이 연구실은 모델을 더 크게 키워 문제를 풀지 않습니다. 한계가 드러난 자리마다 사람의
            판단과 실제 기록을 넣고, 나머지 자리에서 AI가 할 수 있는 일을 끝까지 시킵니다.
          </p>
        </div>
      </section>

      {/* 세 자리 */}
      <section className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-2xl font-bold text-text">사람이 들어가는 여섯 자리</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          왼쪽은 학술 연구가 보고한 LLM의 한계이고, 오른쪽은 이 연구실이 그 자리를 채우는 방식입니다.
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
                  <h3 className="mt-2 text-base font-bold text-text">{g.fail}</h3>
                  <p className="mt-3 font-serif text-sm leading-[1.85] text-subtext">{g.what}</p>
                  <p className="mt-3 border-t border-border pt-3 font-mono text-[10px] text-muted">
                    {g.src}
                  </p>
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
