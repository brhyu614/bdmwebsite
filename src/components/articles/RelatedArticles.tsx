import Link from 'next/link'
import { getArticlesBySeries } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import SeriesLabel from './SeriesLabel'

interface RelatedArticlesProps {
  currentSlug: string
  series: string
}

export default function RelatedArticles({
  currentSlug,
  series,
}: RelatedArticlesProps) {
  const related = getArticlesBySeries(series)
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-6 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
        관련 아티클
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent/50 hover:bg-surface-alt"
          >
            <SeriesLabel series={article.frontmatter.series} />
            <h3 className="mt-2 text-base font-bold text-text group-hover:text-accent">
              {article.frontmatter.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-muted">
              {formatDate(article.frontmatter.date)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
