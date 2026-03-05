import Link from 'next/link'
import type { Article } from '@/lib/types'
import { CARD_GRADIENTS } from '@/lib/types'
import { getSeriesName } from '@/lib/series'
import { AUTHOR_NAME } from '@/lib/constants'

interface ArticleCardProps {
  article: Article
  index: number
  total: number
}

export default function ArticleCard({ article, index, total }: ArticleCardProps) {
  const { frontmatter, slug } = article
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
  const articleNumber = String(total - index).padStart(3, '0')
  const dateObj = new Date(frontmatter.date)
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const dateLabel = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`
  const author = frontmatter.author ?? AUTHOR_NAME

  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article className="card-hover overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Gradient Header */}
        <div
          className="relative flex aspect-[16/10] items-center justify-center p-6"
          style={{ background: gradient }}
        >
          {/* Article Number */}
          <span className="absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1 font-mono text-xs font-bold text-white backdrop-blur-sm">
            #{articleNumber}
          </span>
          {/* Date */}
          <span className="absolute right-4 top-4 font-mono text-xs text-white/80">
            {dateLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ color: '#00FF88' }}
            >
              {getSeriesName(frontmatter.series)}
            </span>
            <span className="text-muted">·</span>
            <span className="font-mono text-xs text-muted">
              {frontmatter.readingTime}분
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold leading-snug text-text transition-colors group-hover:text-accent">
            {frontmatter.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-subtext">
            {frontmatter.excerpt}
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            {author}
          </p>
        </div>
      </article>
    </Link>
  )
}
