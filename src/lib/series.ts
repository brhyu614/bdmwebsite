import type { SeriesInfo } from './types'

export const SERIES: Record<string, SeriesInfo> = {
  'algorithm-decode': {
    slug: 'algorithm-decode',
    name: '알고리즘 디코드',
    description: '플랫폼 알고리즘/추천 시스템/AEO 분석',
  },
  'lab-research': {
    slug: 'lab-research',
    name: '랩 리서치',
    description: 'BDM Lab이 직접 수행한 연구 + 기업 프로젝트 결과',
  },
}

export function getSeriesName(slug: string): string {
  return SERIES[slug]?.name ?? slug
}
