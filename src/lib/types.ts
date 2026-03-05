export interface ArticleFrontmatter {
  title: string
  series: 'algorithm-decode' | 'lab-research'
  tags: string[]
  date: string
  readingTime: number
  excerpt: string
  featured?: boolean
  thumbnail?: string
  author?: string
}

export interface Article {
  slug: string
  frontmatter: ArticleFrontmatter
  content: string
}

export interface AuthorInfo {
  name: string
  nameEn: string
  title: string
  affiliation: string
  bio: string
  email: string
  social: {
    instagram?: string
    linkedin?: string
    twitter?: string
    scholar?: string
  }
  image: string
}

export type SeriesSlug = 'algorithm-decode' | 'lab-research'

export interface SeriesInfo {
  slug: SeriesSlug
  name: string
  description: string
}

// Card gradient colors for the homepage
export const CARD_GRADIENTS = [
  'linear-gradient(135deg, #00FF88, #00AA5B)',
  'linear-gradient(135deg, #FF3366, #CC0044)',
  'linear-gradient(135deg, #7C3AED, #4338CA)',
  'linear-gradient(135deg, #F59E0B, #EA580C)',
  'linear-gradient(135deg, #06B6D4, #2563EB)',
  'linear-gradient(135deg, #EC4899, #9333EA)',
  'linear-gradient(135deg, #10B981, #0891B2)',
  'linear-gradient(135deg, #EF4444, #F97316)',
]
