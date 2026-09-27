import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: '개인 단위 소비자 복제',
  description:
    '구매 기록과 설문과 인터뷰를 한 사람 기준으로 묶어 생성형 에이전트를 세우고 보류 표본으로 검증하는 절차. 빅데이터마케팅 랩(BDM Lab)의 개인 단위 소비자 복제 연구.',
  alternates: { canonical: '/research/digital-twin' },
}

const LAYERS = [
  {
    n: '1',
    name: '실제 구매 기록',
    en: 'Revealed Preference',
    detail:
      '영수증 한 줄에는 누가, 언제, 어디서, 무엇을, 얼마에, 몇 개 샀는지가 들어 있습니다. 말이 아니라 돈을 쓴 선택이라, 선호를 행동에서 역으로 읽어 냅니다. Samuelson(1938)이 세운 현시선호 개념이 이 자료의 근거입니다.',
    example: '6년치 거래 기록',
  },
  {
    n: '2',
    name: '설문 응답',
    en: 'Stated Preference',
    detail:
      '설문은 이유를 담습니다. 왜 그 브랜드를 골랐는지, 무엇을 중요하게 보는지는 구매 기록에 남지 않습니다. 가상의 선택 상황에서 응답자가 밝힌 선택이 이 자료입니다.',
    example: '같은 사람의 설문 응답',
  },
  {
    n: '3',
    name: '심층 인터뷰',
    en: 'Narrative Data',
    detail:
      '인터뷰는 망설임과 조건을 담습니다. "비싸도 사지만 아이가 있을 때만"처럼 상황에 붙은 규칙은 설문 보기로 잡히지 않습니다.',
    example: '반구조화 인터뷰 녹취',
  },
]

const STEPS = [
  {
    n: '01',
    title: '거래 기록에서 성향 지표를 추정하는 단계',
    body:
      '구매 기록 자체는 숫자 나열입니다. 여기서 성향을 읽으려면 마케팅 문헌이 쓰는 지표로 바꿔야 합니다. 가격 민감도와 브랜드 충성도는 Guadagni와 Little(1983)의 브랜드 선택 로짓 모형에서 각각 가격 계수와 지수가중 충성 변수의 계수로 정의됩니다. 다양성 추구는 직전 브랜드를 다시 살 확률이 기저 확률보다 낮은 정도로 재고, 이 정의는 Kahn 외(1986)를 따릅니다.',
    numbers:
      '구매 발생(purchase incidence)과 구매 간격(interpurchase time)은 Bucklin과 Gupta(1992)의 통합 모형으로 함께 추정합니다.',
  },
  {
    n: '02',
    title: '제품을 벡터 공간에 배치하는 단계',
    body:
      '지표를 그대로 쓰면 사람 사이 비교가 어렵습니다. 같은 장바구니에 담긴 기록으로 제품을 벡터로 바꾸면, 두 제품 사이 거리가 곧 대체 관계나 보완 관계가 됩니다. Gabel, Guhl, Klapper(2019)의 P2V-MAP은 이 방식으로 대규모 소매 구색의 시장 구조 지도를 만듭니다. 사람이 정한 업종 분류표 대신 소비자의 실제 선택이 분류를 만듭니다.',
    numbers: '제품 임베딩(product embedding)의 좌표는 소비자의 동시 구매 기록에서만 나옵니다.',
  },
  {
    n: '03',
    title: '다음 행동을 예측하는 단계',
    body:
      '고객이 앞으로 얼마나 더 살지는 고객 생애가치 계열 모형으로 추정합니다. Schmittlein 외(1987)의 Pareto/NBD와 Fader 외(2005)의 BG/NBD가 이 분야의 기준 모형입니다. 매장과 품목 단위 매출 예측에는 XGBoost 같은 경사부스팅 모형을 쓰고, 어떤 변수가 예측을 얼마나 밀어 올렸는지는 SHAP로 분해합니다.',
    numbers:
      '치킨 프랜차이즈 349개 매장의 매장식사 채널 매출 예측에서 결정계수(R²) 0.96을 기록했습니다.',
  },
  {
    n: '04',
    title: '생성형 에이전트로 세우는 단계',
    body:
      '예측 모형은 확률을 내놓을 뿐 이유를 말해 주지 않습니다. 성향 지표와 설문 응답과 인터뷰를 한 사람 기준으로 묶어 대규모 언어 모형에 넣으면, 그 사람의 판단 방식을 흉내 내는 에이전트가 만들어집니다. Park 외(2024)는 이 방식을 생성형 에이전트(generative agents)로 부르고, 과제별 학습 자료 없이도 여러 결과를 예측한다고 보고했습니다.',
    numbers:
      'Argyle 외(2023)는 인구사회 배경을 조건으로 넣어 응답을 생성하는 방식을 실리콘 표본(silicon sampling)으로 명명했습니다.',
  },
  {
    n: '05',
    title: '보류 표본으로 검증하는 단계',
    body:
      '복제가 잘됐는지는 학습에 쓰지 않은 문항으로 잽니다. 에이전트의 답과 그 사람이 실제로 고른 답을 대조해 일치율을 계산합니다. 중요한 것은 정확도의 상한입니다. 같은 사람이 2주 뒤 같은 문항에 다르게 답하는 부분은 어떤 모형도 맞힐 수 없으므로, 정확도는 원시 백분율이 아니라 본인의 재검사 일치율(test-retest reliability)로 나눈 값으로 보고해야 합니다.',
    numbers:
      'Park 외(2024)는 보류 문항에서 본인 재검사 기준선 대비 86% 수준을 보고했습니다. 인구 정보만 넣은 에이전트는 74%에 그쳤습니다.',
  },
]

const INDICATORS = [
  ['가격 민감도', 'price sensitivity', '브랜드 선택 로짓 모형의 가격 계수', '가격 인상 시 이탈'],
  ['브랜드 충성도', 'brand loyalty', '과거 구매를 지수가중 평균한 변수의 계수', '경쟁 브랜드 진입 시 방어력'],
  ['다양성 추구', 'variety seeking', '직전 브랜드 재구매 확률과 기저 확률의 차이', '신제품 수용'],
  ['구매 발생', 'purchase incidence', '해당 장바구니에서 그 범주를 샀는지 여부', '범주 진입 시점'],
  ['구매 간격', 'interpurchase time', '연속한 두 구매 사이 경과 일수', '재구매 시점'],
  ['지갑 점유율', 'share of wallet', '범주 지출 중 특정 브랜드가 차지하는 비중', '교차 구매 여지'],
]

const REFERENCES = [
  'Argyle et al. (2023), "Out of One, Many: Using Language Models to Simulate Human Samples," Political Analysis, 31(3), 337–351.',
  'Ben-Akiva & Morikawa (1990), "Estimation of switching models from revealed preferences and stated intentions," Transportation Research Part A, 24(6), 485–495.',
  'Bucklin & Gupta (1992), "Brand Choice, Purchase Incidence, and Segmentation," Journal of Marketing Research, 29(2), 201–215.',
  'Fader, Hardie & Lee (2005), "Counting Your Customers the Easy Way," Marketing Science, 24(2), 275–284.',
  'Gabel, Guhl & Klapper (2019), "P2V-MAP: Mapping Market Structures for Large Retail Assortments," Journal of Marketing Research, 56(4), 557–580.',
  'Guadagni & Little (1983), "A Logit Model of Brand Choice Calibrated on Scanner Data," Marketing Science, 2(3), 203–238.',
  'Gui & Toubia (2023), "The Challenge of Using LLMs to Simulate Human Behavior: A Causal Inference Perspective," arXiv:2312.15524.',
  'Kahn, Kalwani & Morrison (1986), "Measuring Variety-Seeking and Reinforcement Behaviors Using Panel Data," Journal of Marketing Research, 23(2), 89–100.',
  'Park et al. (2024), "LLM Agents Grounded in Self-Reports Enable General-Purpose Simulation of Individuals," arXiv:2411.10109.',
  'Samuelson (1938), "A Note on the Pure Theory of Consumer’s Behaviour," Economica, 5(17), 61–71.',
  'Schmittlein, Morrison & Colombo (1987), "Counting Your Customers," Management Science, 33(1), 1–24.',
  'Swait & Louviere (1993), "The Role of the Scale Parameter in the Estimation and Comparison of Multinomial Logit Models," Journal of Marketing Research, 30(3), 305–314.',
  'Toubia et al. (2025), "Twin-2K-500: A Data Set for Building Digital Twins of over 2,000 People," Marketing Science.',
]

function LayerDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 680 300"
        className="mx-auto h-auto w-full max-w-[680px]"
        role="img"
        aria-label="구매 기록, 설문 응답, 심층 인터뷰 세 자료를 한 사람 기준으로 묶어 예측 모형과 생성형 에이전트를 만드는 구조"
      >
        <defs>
          <marker id="dtArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="currentColor" className="text-accent" />
          </marker>
        </defs>

        {[
          { y: 20, label: '구매 기록', sub: 'Revealed Preference', tone: 'strong' },
          { y: 105, label: '설문 응답', sub: 'Stated Preference', tone: 'mid' },
          { y: 190, label: '심층 인터뷰', sub: 'Narrative Data', tone: 'soft' },
        ].map((row) => (
          <g key={row.label}>
            <rect
              x="10"
              y={row.y}
              width="230"
              height="66"
              rx="10"
              className={
                row.tone === 'strong' ? 'fill-accent-bg stroke-accent' : 'fill-surface stroke-border'
              }
              strokeWidth="1.5"
            />
            <text x="28" y={row.y + 28} className="fill-current text-[13px] font-bold text-text">
              {row.label}
            </text>
            <text x="28" y={row.y + 48} className="fill-current font-mono text-[10px] text-subtext">
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
          세 자료를 결합
        </text>
        <text x="380" y="178" textAnchor="middle" className="fill-current font-mono text-[10px] text-accent">
          data fusion
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

        <rect x="505" y="75" width="165" height="60" rx="10" className="fill-accent-bg stroke-accent" strokeWidth="1.5" />
        <text x="587" y="98" textAnchor="middle" className="fill-current text-[12px] font-bold text-text">
          예측 모형
        </text>
        <text x="587" y="116" textAnchor="middle" className="fill-current font-mono text-[9px] text-subtext">
          XGBoost · BG/NBD
        </text>

        <rect x="505" y="165" width="165" height="60" rx="10" className="fill-accent-bg stroke-accent" strokeWidth="1.5" />
        <text x="587" y="188" textAnchor="middle" className="fill-current text-[12px] font-bold text-text">
          생성형 에이전트
        </text>
        <text x="587" y="206" textAnchor="middle" className="fill-current font-mono text-[9px] text-subtext">
          generative agent
        </text>

        <text x="300" y="270" className="fill-current text-[11px] text-muted">
          세 자료가 같은 사람의 것이어야 개인 단위 예측이 가능합니다.
        </text>
      </svg>
    </div>
  )
}

export default function DigitalTwinPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />
      <JsonLd
        type="faq"
        data={{
          items: [
            {
              q: '개인 단위 소비자 복제란 무엇입니까?',
              a: '한 사람의 구매 기록과 설문 응답과 인터뷰를 묶어 그 사람의 판단 방식을 흉내 내는 대규모 언어 모형 기반 에이전트를 세우는 작업입니다. Park 외(2024)는 이를 생성형 에이전트(generative agents)로 부르며, 과제별 학습 자료 없이도 여러 결과를 예측한다고 보고했습니다.',
            },
            {
              q: '구매 기록으로 소비자의 성향을 어떻게 측정합니까?',
              a: '마케팅 문헌의 표준 지표를 씁니다. 가격 민감도와 브랜드 충성도는 Guadagni와 Little(1983)의 브랜드 선택 로짓 모형 계수로, 다양성 추구는 Kahn 외(1986)의 정의로, 구매 발생과 구매 간격은 Bucklin과 Gupta(1992)의 통합 모형으로 추정합니다.',
            },
            {
              q: '복제가 잘됐는지 어떻게 검증합니까?',
              a: '학습에 쓰지 않은 보류 문항으로 에이전트의 답과 본인의 실제 답을 대조합니다. 정확도의 상한은 본인의 재검사 일치율(test-retest reliability)이므로, 원시 백분율이 아니라 그 기준선으로 나눈 값으로 보고해야 합니다.',
            },
            {
              q: 'LLM으로 가상 실험을 할 때의 주의점은 무엇입니까?',
              a: 'Gui와 Toubia(2023)는 가격만 바꾼 프롬프트가 모형 안에서 품질이나 상황 같은 언급하지 않은 변수까지 함께 바꾸어 비교란 가정(unconfoundedness)을 깬다고 지적했습니다. 실험 설계를 모형에 밝히는 방식이 해법으로 제시됐습니다.',
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          Individual-Level Simulation
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          한 사람을 복제하는 절차
        </h1>
        <div className="mt-6 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            소비자 조사의 오래된 문제는 말과 행동이 어긋난다는 데 있습니다. 설문에서 건강을
            중요하게 본다고 답한 사람이 장바구니에는 탄산음료를 담습니다. 말만 믿으면 틀리고, 행동만
            보면 이유를 모릅니다.
          </p>
          <p>
            두 자료를 한 사람 기준으로 묶는 접근은 경제학과 마케팅에서 오래 다뤄 왔습니다. 실제
            선택에서 선호를 읽는 현시선호(revealed preference)와 응답에서 읽는 진술선호(stated
            preference)를 결합 추정하는 방법은 Ben-Akiva와 Morikawa(1990) 이후 자료 결합(data
            fusion)으로 정리됐습니다. 두 자료는 오차 분산이 다르므로 척도 모수를 따로 추정해야
            한다는 것이 결합의 조건입니다.
          </p>
          <p>
            대규모 언어 모형이 등장하면서 그 결합 자료로{' '}
            <strong className="text-text">개인 단위 에이전트</strong>를 세울 수 있게 됐습니다. 이
            연구실은 6년치 구매 기록을 가진 한국 소비자를 대상으로 이 절차를 밟습니다.
          </p>
        </div>
      </section>

      {/* 세 자료 */}
      <section className="mx-auto mt-16 max-w-[980px]">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-2xl font-bold text-text">세 자료를 한 사람으로 묶는 구조</h2>
          <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
            에이전트 하나는 세 종류의 자료 위에 세워집니다. 세 자료가 <em>같은 사람</em>의 것이어야
            개인 단위 예측이 가능합니다. 다른 사람의 구매 기록과 또 다른 사람의 설문을 합치면 집단
            평균만 남고 개인이 사라집니다.
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
              <p className="mt-3 font-serif text-sm leading-[1.8] text-subtext">{l.detail}</p>
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
        <h2 className="text-2xl font-bold text-text">거래 기록에서 검증까지 다섯 단계</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          각 단계는 앞 단계의 출력을 그대로 받습니다. 지표와 모형은 마케팅 문헌이 쓰는 표준을
          따르고, 단계마다 근거 논문을 함께 적습니다.
        </p>

        <ol className="mt-8 space-y-8">
          {STEPS.map((s) => (
            <li key={s.n} className="relative border-l-2 border-border pl-6">
              <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-[10px] font-bold text-accent">
                {s.n}
              </span>
              <h3 className="text-base font-bold text-text">{s.title}</h3>
              <p className="mt-2 font-serif text-[15px] leading-[1.9] text-subtext">{s.body}</p>
              <p className="mt-3 rounded-lg bg-accent-bg px-3 py-2 font-mono text-xs leading-relaxed text-accent">
                {s.numbers}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 성향 지표 */}
      <section className="mx-auto mt-20 max-w-[720px]">
        <h2 className="text-2xl font-bold text-text">거래 기록에서 추정되는 성향 지표</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          아래 지표는 구매 기록만으로 추정됩니다. 설문을 한 번도 하지 않은 사람에게도 똑같이 매길 수
          있습니다.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2.5 pr-4 font-bold text-text">지표</th>
                <th className="py-2.5 pr-4 font-bold text-text">측정 방식</th>
                <th className="py-2.5 font-bold text-text">예측 대상</th>
              </tr>
            </thead>
            <tbody className="text-subtext">
              {INDICATORS.map(([ko, en, how, what]) => (
                <tr key={en} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4">
                    <span className="font-medium text-text">{ko}</span>
                    <br />
                    <span className="font-mono text-[10px] text-muted">{en}</span>
                  </td>
                  <td className="py-2.5 pr-4">{how}</td>
                  <td className="py-2.5">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 한계 */}
      <section className="mx-auto mt-20 max-w-[720px] rounded-2xl border border-border bg-surface p-7">
        <h2 className="text-lg font-bold text-text">이 방법의 한계</h2>
        <div className="mt-4 space-y-4 font-serif text-[15px] leading-[1.9] text-subtext">
          <p>
            <strong className="text-text">고려 집합이 관측되지 않습니다.</strong> 구매 기록은 산 것만
            남기고 사지 않은 것을 남기지 않습니다. 매대 앞에서 들었다 놓은 물건은 어디에도 기록되지
            않아, 고려 집합(consideration set)은 추정 대상으로 남습니다.
          </p>
          <p>
            <strong className="text-text">한 업체의 기록은 그 업체 안의 행동만 담습니다.</strong>{' '}
            같은 사람이 다른 곳에서 무엇을 샀는지는 보이지 않으므로, 지갑 점유율과 충성도가 실제보다
            높게 잡힐 수 있습니다.
          </p>
          <p>
            <strong className="text-text">가상 실험에서 비교란 가정이 깨질 수 있습니다.</strong>{' '}
            Gui와 Toubia(2023)는 가격만 바꾼 프롬프트가 모형 안에서 품질이나 상황 같은 언급하지 않은
            변수까지 함께 바꾼다고 지적했습니다. 실험 설계를 모형에 밝히는 방식이 해법으로
            제시됐습니다.
          </p>
          <p>
            <strong className="text-text">복제는 학습 기간의 사람을 복제합니다.</strong> 유행이
            바뀌거나 소득이 달라지면 과거 성향이 현재를 설명하지 못하므로, 검증을 주기적으로 다시
            해야 합니다.
          </p>
        </div>
      </section>

      {/* 참고 문헌 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <h2 className="text-lg font-bold text-text">참고 문헌</h2>
        <ul className="mt-4 space-y-2 font-mono text-[11px] leading-relaxed text-muted">
          {REFERENCES.map((r) => (
            <li key={r} className="border-b border-border pb-2 last:border-0">
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* 연결 */}
      <section className="mx-auto mt-14 max-w-[720px]">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/research/ai"
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            AI 기반 소비자 연구 보기
          </Link>
          <Link
            href="/research/human-in-the-loop"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:border-accent/40"
          >
            AI가 실패하는 자리
          </Link>
          <Link
            href="/publications"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:border-accent/40"
          >
            논문 목록
          </Link>
        </div>
      </section>
    </div>
  )
}
