import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Research',
  description:
    '빅데이터마케팅 랩(BDM Lab)의 AI 연구 목록. LLM 멀티에이전트로 소비자 의사결정을 복제하는 연구와 XGBoost로 매출·수요·폐업을 예측하는 연구를 함께 수행합니다.',
  alternates: { canonical: '/research/ai' },
}

type Track = {
  id: string
  title: string
  question: string
  method: string
  data: string
  status: string
  target?: string
}

const LLM_TRACKS: Track[] = [
  {
    id: 'twin',
    title: '6년 구매 기록으로 만든 소비자 복제 에이전트',
    question:
      '설문으로 만든 가상 소비자는 사람의 말만 따라 합니다. 실제로 산 기록까지 넣으면 사람의 선택을 얼마나 맞힐 수 있습니까.',
    method:
      '한 사람의 6년치 구매 로그와 같은 사람의 설문 응답을 짝지어 LLM 에이전트에 넣습니다. 에이전트가 고른 답과 본인이 실제로 고른 답을 대조해 일치율을 잽니다.',
    data: '패널 500명, 구매 로그 6년, 설문과 인터뷰를 같은 사람 기준으로 연결',
    status: '자료 수집 협의와 검증 규약 확정 단계',
    target: 'Marketing Science 투고 준비',
  },
  {
    id: 'review',
    title: '리뷰를 읽는 AI가 뒤집는 추천 순서',
    question:
      '플랫폼이 리뷰를 사람 대신 LLM에게 요약시키면, 어떤 식당이 위로 올라가고 어떤 식당이 밀려납니까.',
    method:
      'Yelp 리뷰 데이터로 리뷰 노출 정책을 바꿔 가며 시뮬레이션합니다. 높은 평점부터 보여 주는 정책과 무작위로 보여 주는 정책을 비교하면, 리뷰를 의심하며 읽는 집단에서 효과의 부호가 뒤집힙니다.',
    data: 'Yelp 공개 데이터의 사업체·리뷰·이용자 기록',
    status: '원고 집필 단계',
    target: 'Marketing Science 투고 준비',
  },
  {
    id: 'inverse',
    title: '구매 기록만으로 설문 응답 역추정',
    question:
      '설문에 답한 적 없는 사람의 취향을, 그 사람이 산 물건만 보고 알아낼 수 있습니까.',
    method:
      '거래 기록을 입력받아 설문 문항의 답을 되맞히는 방향으로 모형을 학습시킵니다. 실제 응답과 맞춰 정확도를 측정합니다.',
    data: '구매 로그와 설문 응답이 짝지어진 표본',
    status: '설계와 소규모 예비 분석 단계',
    target: 'Marketing Science 투고 준비',
  },
  {
    id: 'homogenize',
    title: '취향의 압축, 콘텐츠 동질화',
    question:
      '사람들이 AI에게 추천을 맡기면, 서로 다르던 취향이 한 방향으로 몰립니까.',
    method:
      '컨조인트 실험으로 사람의 선호를 측정하고, 같은 선택을 LLM에게 시켜 두 결과의 분포를 비교합니다. 선호의 폭이 줄어드는지를 봅니다.',
    data: '한국 콘텐츠 이용자 대상 선택 실험',
    status: '예비 실험 진행 단계',
    target: 'Management Science 또는 Marketing Science 투고 준비',
  },
  {
    id: 'rare',
    title: '수십 명뿐인 응답자를 페르소나로 확장',
    question:
      '전체 인구의 1%도 되지 않는 집단에게 신제품을 물으려면, 유효 응답 수십 건으로 무엇을 할 수 있습니까.',
    method:
      '실제 경험자만 남기는 확인 문항을 설문에 심어 자격 없는 응답을 제거합니다. 걸러진 응답자를 심층 인터뷰해 의사결정 과정을 페르소나로 만들고, 페르소나를 LLM 에이전트로 구현해 제품 반응과 구매 의향을 묻습니다.',
    data: '희귀 질환 진단자 대상 126문항 설문과 확인 문항 8개',
    status: '실제 조사에 적용해 검증까지 마친 단계',
  },
  {
    id: 'embedding',
    title: '제품 임베딩으로 읽는 프랜차이즈 경쟁 지도',
    question:
      '어떤 브랜드와 어떤 브랜드가 실제로 같은 손님을 두고 경쟁합니까.',
    method:
      '검색과 주문 기록에서 제품과 브랜드를 벡터로 바꿔 거리로 경쟁 관계를 그립니다. 사람이 정한 업종 분류 대신 소비자 행동이 분류를 만듭니다.',
    data: '국내 검색 포털의 프랜차이즈 관련 수집 데이터',
    status: '데이터 수집 완료, 분석 단계',
  },
]

const FORECAST_TRACKS: Track[] = [
  {
    id: 'sales',
    title: '치킨 프랜차이즈 349개 매장의 매출 예측',
    question: '다음 달 이 매장의 매출은 얼마입니까.',
    method:
      'XGBoost로 온라인 주문, 오프라인 결제, 상권 정보를 한 모형에 넣어 매장별 매출을 예측합니다.',
    data: '349개 매장의 채널별 매출과 지리 정보',
    status: '기업 과제로 수행 완료',
  },
  {
    id: 'demand',
    title: '슈퍼마켓 284개 매장의 품목별 수요 예측',
    question: '어느 매장에 어떤 품목을 얼마나 넣어야 합니까.',
    method:
      '매장과 품목과 채널을 나눠 각각 예측하고, 온라인과 오프라인 중 어느 쪽 수요가 더 잘 맞는지를 비교합니다.',
    data: '284개 매장의 품목별 판매 기록',
    status: '기업 과제 수행과 논문 게재 완료',
  },
  {
    id: 'population',
    title: '전국 3,518개 행정동의 5년 후 인구 예측',
    question: '5년 뒤 이 동네에 사람이 남아 있습니까.',
    method:
      '행정동 단위로 인구 이동과 연령 구성을 넣어 장래 인구를 예측합니다. 매장 입지 판단의 기초 자료가 됩니다.',
    data: '전국 3,518개 행정동의 인구 통계',
    status: '분석 완료',
  },
  {
    id: 'ews',
    title: '프랜차이즈 매장 폐업의 조기 경보',
    question: '이 매장은 1년 안에 문을 닫습니까.',
    method:
      '매출 하락이 시작되기 전에 나타나는 신호를 찾아 폐업 위험을 미리 알립니다. 이미지와 소셜미디어 자료도 신호로 씁니다.',
    data: '프랜차이즈 매장의 운영 기록과 온라인 노출 자료',
    status: '연구비 신청 후 결과 대기',
  },
  {
    id: 'selfemployed',
    title: '자영업 회복의 두 갈래',
    question:
      '같은 지역에서 어떤 자영업자는 회복하고 어떤 자영업자는 무너지는 이유가 무엇입니까.',
    method:
      '업종과 상권을 나눠 회복 속도의 차이를 만드는 요인을 분해합니다. 정책 보고서로 제출합니다.',
    data: '경기 지역 자영업 관련 행정 자료',
    status: '한국은행 경기본부 연구용역, 7개월 과제 중 진행 단계',
  },
  {
    id: 'ip',
    title: '연예인 IP 콜라보의 매출 예측',
    question: '어느 연예인과 손잡으면 매출이 얼마나 오릅니까.',
    method:
      'IP별 매출을 예측하고 인기가 오르내리는 요인을 분해합니다. 계약 시점 판단에 씁니다.',
    data: '포토 부스 브랜드의 IP별 매출 기록',
    status: '기업 과제로 수행 완료',
  },
]

function TrackCard({ track }: { track: Track }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6">
      <h3 className="text-base font-bold leading-snug text-text">{track.title}</h3>
      <p className="mt-3 font-serif text-sm leading-[1.85] text-subtext">
        <span className="font-sans text-xs font-bold text-accent">묻는 것</span>
        <br />
        {track.question}
      </p>
      <p className="mt-3 font-serif text-sm leading-[1.85] text-subtext">
        <span className="font-sans text-xs font-bold text-accent">푸는 방법</span>
        <br />
        {track.method}
      </p>
      <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs">
        <div className="flex gap-2">
          <dt className="w-10 shrink-0 font-mono text-muted">자료</dt>
          <dd className="text-subtext">{track.data}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-10 shrink-0 font-mono text-muted">단계</dt>
          <dd className="text-subtext">{track.status}</dd>
        </div>
        {track.target && (
          <div className="flex gap-2">
            <dt className="w-10 shrink-0 font-mono text-muted">목표</dt>
            <dd className="text-subtext">{track.target}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

export default function AiResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd type="organization" />

      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">AI Research</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          AI 기반 소비자 연구
        </h1>
        <div className="mt-6 space-y-5 font-serif text-base leading-[1.9] text-subtext">
          <p>
            연구실은 AI를 두 방향으로 씁니다. 하나는 사람을 복제해 현실에서 못 돌리는 실험을
            돌리는 쪽이고, 다른 하나는 숫자로 내일을 맞히는 쪽입니다.
          </p>
          <p>
            두 방향은 한 줄로 이어집니다. 예측 모형이{' '}
            <strong className="text-text">무엇이 일어날지</strong>를 맞히면, 복제 에이전트가{' '}
            <strong className="text-text">그때 사람이 어떻게 반응할지</strong>를 미리 보여 줍니다.
            매출이 떨어질 매장을 찾아내는 일과, 가격을 바꿨을 때 손님이 떠날지 묻는 일은 같은
            데이터 위에서 돌아갑니다.
          </p>
        </div>
      </section>

      {/* 축 1 */}
      <section className="mx-auto mt-16 max-w-[980px]">
        <div className="mx-auto max-w-[720px]">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Axis 1</p>
          <h2 className="mt-2 text-2xl font-bold text-text">LLM 멀티에이전트 모델링</h2>
          <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
            사람의 의사결정 과정을 LLM 에이전트로 복제해, 현실에서 시간을 되돌려야만 가능한
            실험을 가상으로 돌립니다. 스탠퍼드와 구글이 2024년에 1,000명을 인터뷰로 복제했고
            Toubia가 2025년 <em>Marketing Science</em>에 2,000명 규모 복제를 실었습니다. 두 연구가
            자기보고와 인터뷰로 사람을 복제한 반면, 이 연구실은 6년치 실제 구매 기록을 같은
            사람의 응답과 짝지어 가지고 있습니다.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LLM_TRACKS.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </section>

      {/* 축 2 */}
      <section className="mx-auto mt-20 max-w-[980px]">
        <div className="mx-auto max-w-[720px]">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Axis 2</p>
          <h2 className="mt-2 text-2xl font-bold text-text">XGBoost 기반 미래 예측</h2>
          <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
            매출, 수요, 인구, 폐업을 숫자로 미리 내놓습니다. 연구실이 다룬 매장은 치킨 프랜차이즈
            349개와 슈퍼마켓 284개를 합쳐 633개이고, 인구 예측 단위는 전국 행정동 3,518개입니다.
            모형이 맞혔는지는 실제로 일어난 숫자와 대조해 확인합니다.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FORECAST_TRACKS.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </section>

      {/* 연결 */}
      <section className="mx-auto mt-20 max-w-[720px] rounded-2xl border border-accent/30 bg-accent-bg p-7">
        <h2 className="text-lg font-bold text-text">두 축을 함께 쓰면 생기는 일</h2>
        <p className="mt-3 font-serif text-base leading-[1.9] text-subtext">
          예측 모형이 다음 분기 매출 하락을 짚어 내면, 복제 에이전트에게 가격 인상과 신메뉴 도입
          같은 대응안을 미리 물어볼 수 있습니다. 실제 고객에게 묻기 전에 가상 고객에게 먼저 묻는
          순서입니다. 두 축이 같은 구매 데이터를 쓰기 때문에 예측과 시뮬레이션이 따로 놀지
          않습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
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
