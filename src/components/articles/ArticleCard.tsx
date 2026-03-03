import Link from 'next/link'
import type { Article } from '@/lib/types'
import SeriesLabel from './SeriesLabel'
import ArticleMeta from './ArticleMeta'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { frontmatter, slug } = article

  return (
    <article className="group border-b border-border py-8 first:pt-0 last:border-b-0">
      <SeriesLabel series={frontmatter.series} />
      <Link href={`/articles/${slug}`}>
        <h3 className="mt-2 text-xl font-bold text-text transition-colors group-hover:text-accent">
          {frontmatter.title}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 font-serif text-base leading-relaxed text-subtext">
        {frontmatter.excerpt}
      </p>
      <div className="mt-3">
        <ArticleMeta
          date={frontmatter.date}
          readingTime={frontmatter.readingTime}
          showAuthor={false}
        />
      </div>
    </article>
  )
}
