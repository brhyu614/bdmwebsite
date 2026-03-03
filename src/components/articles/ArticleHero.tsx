import Link from 'next/link'
import type { Article } from '@/lib/types'
import SeriesLabel from './SeriesLabel'
import ArticleMeta from './ArticleMeta'

interface ArticleHeroProps {
  article: Article
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  const { frontmatter, slug } = article

  return (
    <article className="border-b border-border pb-10">
      <SeriesLabel series={frontmatter.series} size="md" />
      <Link href={`/articles/${slug}`}>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-text transition-colors hover:text-accent sm:text-4xl">
          {frontmatter.title}
        </h1>
      </Link>
      <p className="mt-4 font-serif text-lg leading-relaxed text-subtext">
        {frontmatter.excerpt}
      </p>
      <div className="mt-4">
        <ArticleMeta
          date={frontmatter.date}
          readingTime={frontmatter.readingTime}
        />
      </div>
    </article>
  )
}
