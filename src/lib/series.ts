import type { SeriesInfo } from './types'

export const SERIES: Record<string, SeriesInfo> = {
  'algorithm-decode': {
    slug: 'algorithm-decode',
    name: '알고리즘 디코드',
    description: '플랫폼 알고리즘/추천 시스템/AEO 분석',
    intro: '알고리즘과 AI가 콘텐츠, 검색, 소비자 행동을 어떻게 바꾸고 있는지 해독합니다. 인스타그램 피드부터 AI 검색, 에이전틱 커머스까지 — 플랫폼이 만든 규칙을 이해하면, 그 안에서 이기는 방법이 보입니다.',
  },
  'lab-research': {
    slug: 'lab-research',
    name: '리서치',
    description: 'BDM Lab이 직접 수행한 연구 + 기업 프로젝트 결과',
    intro: 'BDM Lab에서는 기업 데이터와 소비자 행동 데이터를 직접 분석해 실질적인 의사결정에 도움이 되는 연구를 합니다. 우리 랩에서 빅데이터 분석을 통해 발견한 것들을 누구나 이해할 수 있는 말로 씁니다.',
  },
}

export function getSeriesName(slug: string): string {
  return SERIES[slug]?.name ?? slug
}

export function getSeriesColor(slug: string): string {
  switch (slug) {
    case 'algorithm-decode':
      return '#4C9EEB'
    case 'lab-research':
      return '#7BB8F5'
    default:
      return '#4C9EEB'
  }
}
