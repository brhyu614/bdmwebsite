export interface ArticleFrontmatter {
  title: string
  series: 'algorithm-decode' | 'lab-research'
  tags: string[]
  date: string
  readingTime: number
  excerpt: string
  featured?: boolean
  thumbnail?: string
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
