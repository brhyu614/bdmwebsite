import type { Article } from './types'
import { getAllArticles } from './articles'

/**
 * 연구실의 콘텐츠 토픽 분류 (3대 연구 축 + 소셜 commentary)
 *
 * - prediction   : AI 예측 (매출·수요·인구) — lab-research ∩ prediction 태그
 * - replication  : AI 소비자 시뮬레이션 (Mind-Bridge / 디지털 트윈) — lab-research ∩ simulation
 * - aeo          : AI 검색·인용 (AEO) — algorithm-decode ∩ AEO 태그
 * - social       : 소셜미디어·플랫폼 commentary — 그 외 algorithm-decode (홈에서 제외)
 *
 * series + tags 규칙으로 파생 분류한다 (40개 프론트매터를 직접 수정하지 않음).
 */
export type Topic = 'prediction' | 'replication' | 'aeo' | 'social'

export function getTopic(article: Article): Topic {
  const { series, tags } = article.frontmatter
  const has = (t: string) => Array.isArray(tags) && tags.includes(t)

  // 랩 리서치(자체 연구)는 절대 '소셜 commentary'로 분류하지 않는다 → 홈 유지
  if (series === 'lab-research') {
    if (has('prediction')) return 'prediction'
    if (has('simulation') || has('multi-agent')) return 'replication'
    // 그 외 lab-research(연구 케이스)도 연구 콘텐츠 → 시뮬레이션 축으로 묶어 노출
    return 'replication'
  }

  // algorithm-decode: AEO(AI 검색·인용)는 AI 콘텐츠로 유지, 나머지는 소셜 commentary
  if (has('AEO')) return 'aeo'
  return 'social'
}

/** 홈 "최신 인사이트" 피드 — 소셜미디어 commentary는 제외 (보관·접근은 /articles 유지) */
export function getHomeArticles(): Article[] {
  return getAllArticles().filter((a) => getTopic(a) !== 'social')
}

/** 특정 토픽의 글만 (최신순) */
export function getArticlesByTopic(topic: Topic): Article[] {
  return getAllArticles().filter((a) => getTopic(a) === topic)
}
