import type { Article } from './types'
import { getAllArticles } from './articles'

/**
 * 연구실의 콘텐츠 토픽 분류 (3대 연구 축 + 소셜 commentary)
 *
 * - prediction   : AI 예측 (매출·수요·인구) — lab-research ∩ prediction 태그
 * - replication  : AI 소비자 시뮬레이션 (Mind-Bridge / 디지털 트윈) — lab-research ∩ simulation
 * - research     : 인과·소비자 분석 등 그 외 자체 연구 — lab-research 기본값
 * - aeo          : AI 검색·인용 (AEO) — algorithm-decode ∩ AEO 태그
 * - social       : 소셜미디어·플랫폼 commentary — 그 외 algorithm-decode (홈에서 제외)
 *
 * series + tags 규칙으로 파생 분류한다 (40개 프론트매터를 직접 수정하지 않음).
 */
export type Topic = 'prediction' | 'replication' | 'research' | 'aeo' | 'social'

export function getTopic(article: Article): Topic {
  const { series, tags } = article.frontmatter
  const has = (t: string) => Array.isArray(tags) && tags.includes(t)

  // 랩 리서치(자체 연구)는 절대 '소셜 commentary'로 분류하지 않는다 → 홈 유지
  if (series === 'lab-research') {
    if (has('prediction')) return 'prediction'
    if (has('simulation') || has('multi-agent')) return 'replication'
    // 그 외 lab-research(인과·소비자행동 케이스 등)
    return 'research'
  }

  // algorithm-decode: AEO(AI 검색·인용)는 AI 콘텐츠로 유지, 나머지는 소셜 commentary
  if (has('AEO')) return 'aeo'
  return 'social'
}

/** 홈 "최신 인사이트" 피드 — 소셜 commentary 제외 + 연구 콘텐츠(예측·복제·인과) 우선 노출.
 *  AEO 마케팅 글이 상단을 도배하지 않게, 연구 토픽을 먼저 보여주고 날짜 내림차순 유지. */
export function getHomeArticles(): Article[] {
  const PRIORITY: Record<Topic, number> = {
    replication: 0,
    prediction: 0,
    research: 0,
    aeo: 1,
    social: 9,
  }
  return getAllArticles()
    .filter((a) => getTopic(a) !== 'social')
    .map((a, i) => ({ a, i, p: PRIORITY[getTopic(a)] }))
    .sort((x, y) => (x.p - y.p) || (x.i - y.i)) // 우선군 먼저, 그 안에서 기존(날짜) 순서
    .map((x) => x.a)
}

/** 특정 토픽의 글만 (최신순) */
export function getArticlesByTopic(topic: Topic): Article[] {
  return getAllArticles().filter((a) => getTopic(a) === topic)
}
