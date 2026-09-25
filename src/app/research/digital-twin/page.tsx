import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: '소비자 디지털 트윈',
  description:
    '구매 기록으로 소비자의 성향을 읽고 다음 행동을 예측하는 원리. 빅데이터마케팅 랩(BDM Lab)의 소비자 디지털 트윈 연구를 단계별로 설명합니다.',
  alternates: { canonical: '/research/digital-twin' },
}

const LAYERS = [
  {
    n: '1',
    name: '행동층',
    en: 'Revealed Preference',
    what: '실제로 산 것',
    detail:
      '영수증 한 줄에는 누가, 언제, 어디서, 무엇을, 얼마에, 몇 개 샀는지가 들어 있습니다. 말이 아니라 돈을 쓴 기록이라 거짓이 섞이지 않습니다.',
    example: '6년간 장바구니 1,200회, 품목 8,400건',
  },
  {
    n: '2',
    name: '응답층',
    en: 'Stated Preference',
    what: '스스로 말한 것',
    detail:
      '설문은 이유를 담습니다. 왜 그 브랜드를 골랐는지, 무엇을 중요하게 보는지는 구매 기록에 남지 않습니다.',
    example: '같은 사람의 설문 응답 126문항',
  },
  {
    n: '3',
    name: '서사층',
    en: 'Narrative',
    what: '풀어서 말한 것',
    detail:
      '인터뷰는 망설임과 조건을 담습니다. "비싸도 사지만 애가 있을 때만"처럼 상황에 붙은 규칙이 여기서 나옵니다.',
    example: '심층 인터뷰 녹취와 요약',
  },
]

const STEPS = [
  {
    n: '01',
    title: '기록을 성향으로 바꾸는 단계',
    body: '구매 기록 자체는 숫자 나열입니다. 여기서 성향을 읽으려면 사람이 읽을 수 있는 지표로 바꿔야 합니다. 같은 브랜드를 몇 번 연속으로 샀는지로 브랜드 충성을 재고, 할인 품목의 비중으로 가격 민감도를 잽니다. 장바구니에 처음 보는 품목이 얼마나 섞이는지로 다양성 추구를 재고, 구매 간격의 규칙성으로 계획성을 잽니다.',
    numbers: '지표 40여 개를 한 사람당 한 줄로 만듭니다.',
  },
  {
    n: '02',
    title: '성향을 벡터로 압축하는 단계',
    body: '지표 40개를 그대로 쓰면 사람마다 비교가 어렵습니다. 제품과 사람을 같은 공간의 점으로 바꾸면, 두 점 사이의 거리가 곧 비슷한 정도가 됩니다. 이 공간에서 가까이 있는 사람은 실제로 비슷한 것을 삽니다. 업종 분류표가 아니라 소비자의 행동이 분류를 만듭니다.',
    numbers: '수백 차원의 지표가 수십 차원의 좌표로 압축됩니다.',
  },
  {
    n: '03',
    title: '다음 행동을 맞히는 단계',
    body: 'XGBoost는 조건을 나누는 규칙을 수천 개 쌓아 예측을 만듭니다. "지난 4주에 이 품목을 샀고, 할인 반응이 높고, 방문 간격이 길어졌다면" 같은 조건이 쌓여 다음 달 구매 확률이 나옵니다. 어떤 조건이 예측을 얼마나 밀어 올렸는지도 숫자로 나오기 때문에, 맞힌 이유를 사람이 읽을 수 있습니다.',
    numbers:
      '치킨 프랜차이즈 349개 매장의 매장식사 채널 매출 예측에서 결정계수(R²) 0.96을 기록했습니다.',
  },
  {
    n: '04',
    title: '사람으로 복원하는 단계',
    body: '예측 모형은 확률을 내놓을 뿐, 이유를 말해 주지 않습니다. 성향 지표와 설문과 인터뷰를 LLM 에이전트에 함께 넣으면, 에이전트가 그 사람의 말투로 이유를 말합니다. 가격을 올리면 떠날지, 새 상품을 권하면 받아들일지를 물어볼 수 있는 상대가 생깁니다.',
    numbers: '에이전트 한 명이 한 사람의 6년치 기록 위에 세워집니다.',
  },
  {
    n: '05',
    title: '맞았는지 확인하는 단계',
    body: '복제가 잘됐는지는 본인의 실제 답과 대조해 잽니다. 에이전트에게 물은 답과 그 사람이 실제로 고른 답이 얼마나 겹치는지를 세고, 겹치지 않은 항목은 어느 성향에서 틀렸는지 되짚습니다. 검증 없이 만든 가상 소비자는 그럴듯한 문장만 내놓습니다.',
    numbers: '6개월 시점 50명 기준 상위 5개 품목 일치율 50% 이상을 목표로 둡니다.',
  },
]

function LayerDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 680 300"
        className="mx-auto h-auto w-full max-w-[680px]"
        role="img"
        aria-label="행동층, 응답층, 서사층 세 자료를 한 사람 기준으로 합쳐 디지털 트윈을 만드는 구조"
      >
        <defs>
          <marker id="dtArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="currentColor" className="text-accent" />
          </marker>
        </defs>

        {/* 세 층 */}
        {[
          { y: 20, label: '행동층', sub: '6년치 구매 기록', tone: 'strong' },
          { y: 105, label: '응답층', sub: '설문 응답', tone: 'mid' },
          { y: 190, label: '서사층', sub: '심층 인터뷰', tone: 'soft' },
        ].map((row) => (
          <g key={row.label}>
            <rect
              x="10"
              y={row.y}
              width="230"
              height="66"
              rx="10"
              className={
                row.tone === 'strong'
                  ? 'fill-accent-bg stroke-accent'
                  : 'fill-surface stroke-border'
              }
              strokeWidth="1.5"
            />
            <text x="28" y={row.y + 28} className="fill-current text-[13px] font-bold text-text">
              {row.label}
            </text>
            <text x="28" y={row.y + 48} className="fill-current text-[11px] text-subtext">
              {row.sub}
            </text>
            <line
              x1="240"
              y1={row.y + 33}
              x2="300"
              y2="150"
              className="stroke-current text-accent"
              strokeWidth="1.2"
              markerEnd="url(#dtArrow)"
              opacity="0.5"
            />
          </g>
        ))}

        {/* 결합 */}
        <rect
          x="305"
          y="105"
          width="150"
          height="90"
          rx="12"
          className="fill-surface stroke-accent"
          strokeWidth="1.8"
        />
        <text x="380" y="140" textAnchor="middle" className="fill-current text-[13px] font-bold text-text">
          한 사람 기준
        </text>
        <text x="380" y="160" textAnchor="middle" className="fill-current text-[11px] text-subtext">
          세 자료를 연결
        </text>
        <text x="380" y="178" textAnchor="middle" className="fill-current font-mono text-[10px] text-accent">
          paired data
        </text>

        <line
          x1="455"
          y1="150"
          x2="500"
          y2="150"
          className="stroke-current text-accent"
          strokeWidth="1.5"
          markerEnd="url(#dtArrow)"
        />

        {/* 두 출력 */}
        <rect x="505" y="75" width="165" height="60" rx="10" className="fill-accent-bg stroke-accent" strokeWidth="1.5" />
        <text x="587" y="100" textAnchor="middle" className="fill-current text-[12px] font-bold text-text">
          예측 모형
        </text>
        <text x="587" y="118" textAnchor="middle" className="fill-current text-[10px] text-subtext">
          다음 달 무엇을 살까
        </text>

        <rect x="505" y="165" width="165" height="60" rx="10" className="fill-accent-bg stroke-accent" strokeWidth="1.5" />
        <text x="587" y="190" textAnchor="middle" className="fill-current text-[12px] font-bold text-text">
          복제 에이전트
        </text>
        <text x="587" y="208" textAnchor="middle" className="fill-current text-[10px] text-subtext">
          왜 그렇게 고를까
        </text>

        <text x="340" y="270" className="fill-current text-[11px] text-muted">
          같은 사람의 세 자료를 붙였기 때문에, 예측과 시뮬레이션이 같은 근거 위에서 돌아갑니다.
        </text>
      </svg>
    </div>
  )
}

export default function DigitalTwinPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Digital Twin</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          영수증으로 사람을 복원하는 법
        </h1>
        <div className="mt-6 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            소비자 조사의 오래된 문제는 사람들이 말과 행동을 다르게 한다는 점입니다. 설문에서는
            건강을 중요하게 본다고 답한 사람이 장바구니에는 탄산음료를 담습니다. 말을 믿으면 틀리고,
            행동만 보면 이유를 모릅니다.
          </p>
          <p>
            <strong className="text-text">소비자 디지털 트윈</strong>은 한 사람의 구매 기록과 설문과
            인터뷰를 한데 묶어 그 사람의 판단 방식을 되살린 모형입니다. 공장 설비의 디지털 트윈이
            기계를 화면 안에 복제해 고장을 미리 돌려 보듯, 소비자 디지털 트윈은 사람의 선택을 복제해
            가격 인상과 신제품 출시를 미리 돌려 봅니다.
          </p>
        </div>
      </section>

      {/* 세 층 */}
      <section className="mx-auto mt-16 max-w-[980px]">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-2xl font-bold text-text">세 층으로 쌓는 한 사람</h2>
          <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
            트윈 한 명은 세 종류의 자료 위에 세워집니다. 세 자료가 <em>같은 사람</em>의 것이어야
            의미가 생깁니다. 다른 사람의 구매 기록과 또 다른 사람의 설문을 합치면 평균만 남고 개인이
            사라집니다.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {LAYERS.map((l) => (
            <div key={l.n} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-accent">{l.n}</span>
                <div>
                  <p className="text-sm font-bold text-text">{l.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{l.en}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-bold text-accent">{l.what}</p>
              <p className="mt-2 font-serif text-sm leading-[1.8] text-subtext">{l.detail}</p>
              <p className="mt-3 border-t border-border pt-3 font-mono text-[11px] text-muted">
                {l.example}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <LayerDiagram />
        </div>
      </section>

      {/* 다섯 단계 */}
      <section className="mx-auto mt-20 max-w-[720px]">
        <h2 className="text-2xl font-bold text-text">기록에서 예측까지 다섯 단계</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          구매 기록 한 줄이 사람의 성향으로 바뀌고, 성향이 다음 행동의 확률로 바뀌고, 확률이 다시
          말하는 사람으로 바뀌는 순서입니다. 각 단계는 앞 단계의 출력을 그대로 받습니다.
        </p>

        <ol className="mt-8 space-y-8">
          {STEPS.map((s) => (
            <li key={s.n} className="relative border-l-2 border-border pl-6">
              <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-[10px] font-bold text-accent">
                {s.n}
              </span>
              <h3 className="text-base font-bold text-text">{s.title}</h3>
              <p className="mt-2 font-serif text-[15px] leading-[1.9] text-subtext">{s.body}</p>
              <p className="mt-3 rounded-lg bg-accent-bg px-3 py-2 font-mono text-xs text-accent">
                {s.numbers}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 성향 지표 표 */}
      <section className="mx-auto mt-20 max-w-[720px]">
        <h2 className="text-2xl font-bold text-text">영수증에서 읽어 내는 성향</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          아래는 구매 기록만으로 계산되는 성향 지표입니다. 설문을 한 번도 하지 않은 사람에게도
          똑같이 매길 수 있습니다.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2.5 pr-4 font-bold text-text">성향</th>
                <th className="py-2.5 pr-4 font-bold text-text">무엇으로 재는가</th>
                <th className="py-2.5 font-bold text-text">무엇을 예측하는가</th>
              </tr>
            </thead>
            <tbody className="text-subtext">
              {[
                ['가격 민감도', '할인 품목이 장바구니에서 차지하는 비중', '가격 인상 시 이탈'],
                ['브랜드 충성', '같은 브랜드를 연속으로 산 횟수', '경쟁 브랜드 진입 시 방어력'],
                ['다양성 추구', '처음 사는 품목이 섞이는 비율', '신제품 수용'],
                ['계획성', '방문 간격과 장바구니 크기의 규칙성', '대량 구매 시점'],
                ['채널 선호', '온라인 주문과 매장 결제의 비율', '배송 서비스 도입 효과'],
                ['시간대 습관', '구매가 몰리는 요일과 시간', '시간대별 판촉 효과'],
                ['반품 성향', '구매 대비 반품 횟수', '반품 이후 재구매 증가폭'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-text">{a}</td>
                  <td className="py-2.5 pr-4">{b}</td>
                  <td className="py-2.5">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 한계 */}
      <section className="mx-auto mt-20 max-w-[720px] rounded-2xl border border-border bg-surface p-7">
        <h2 className="text-lg font-bold text-text">이 방법이 못 하는 것</h2>
        <div className="mt-4 space-y-4 font-serif text-[15px] leading-[1.9] text-subtext">
          <p>
            구매 기록은 산 것만 남기고 사지 않은 것을 남기지 않습니다. 매대 앞에서 들었다 놓은
            물건은 어디에도 기록되지 않아, 고민의 강도는 추정 대상으로 남습니다.
          </p>
          <p>
            한 소매업체의 기록은 그 업체에서의 행동만 담습니다. 같은 사람이 다른 곳에서 무엇을
            샀는지는 보이지 않아, 충성도가 실제보다 높게 잡힐 수 있습니다.
          </p>
          <p>
            복제 에이전트는 학습에 쓰인 기간의 사람을 복제합니다. 유행이 바뀌거나 소득이 달라지면
            과거의 성향이 현재를 설명하지 못하므로, 검증을 주기적으로 다시 해야 합니다.
          </p>
        </div>
      </section>

      {/* 연결 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/research/ai"
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            AI 연구 보기
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:border-accent/40"
          >
            기업 프로젝트 보기
          </Link>
          <Link
            href="/publications"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:border-accent/40"
          >
            논문 목록 보기
          </Link>
        </div>
      </section>
    </div>
  )
}
