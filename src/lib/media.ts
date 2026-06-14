// 미디어 기고 (DBR 등) — 홈/디지털마케팅 페이지 공용
export interface MediaArticle {
  title: string
  summary: string
  image: string
  href: string
  outlet: string
  issue: string
}

export const DBR_ARTICLES: MediaArticle[] = [
  {
    title: 'AI가 인용한 브랜드, 광고 클릭 91% 올라 — 제품 페이지에 수치·데이터 명시하면 유리',
    summary:
      'AI 에이전트가 바꾸는 광고 문법. CPC(클릭당 과금) 모델이 흔들리는 시대, 제품 페이지에 검증 가능한 수치·데이터를 명시한 브랜드가 AI 인용과 광고 성과에서 앞선다.',
    image: '/images/dbr/ai-citation-ad.jpg',
    href: 'https://dbr.donga.com/article/view/1202/article_no/12147',
    outlet: 'DBR',
    issue: 'DBR · 2026',
  },
  {
    title: "AI와 대화 중 결제 '에이전틱 커머스' 시대 — 검색 플랫폼의 살 길은 '신뢰 가는 선제 제안'",
    summary:
      "검색의 시대가 끝나고 AI가 대화 중 결제까지 끝내는 '에이전틱 커머스'가 쇼핑의 판을 바꾼다. 아마존 루퍼스·오픈AI 결제 혁신 사례로 본, 플랫폼이 광고 대신 '추천의 신뢰'를 팔아야 하는 이유.",
    image: '/images/dbr/agentic-commerce.jpg',
    href: 'https://dbr.donga.com/article/view/1904/article_no/11961',
    outlet: 'DBR',
    issue: 'DBR · 2025',
  },
]
