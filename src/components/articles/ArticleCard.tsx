import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/types'
import { getSeriesName } from '@/lib/series'
import { AUTHOR_NAME } from '@/lib/constants'

interface ArticleCardProps {
  article: Article
  index: number
  total: number
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { frontmatter, slug } = article
  const author = frontmatter.author ?? AUTHOR_NAME

  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article className="card-hover overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {frontmatter.coverImage ? (
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-alt">
              <span className="font-mono text-4xl font-bold text-border">
                BDM
              </span>
            </div>
          )}
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Series label on image */}
          <span className="absolute bottom-3 left-4 rounded-sm bg-accent/90 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
            {getSeriesName(frontmatter.series)}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold leading-snug text-text transition-colors group-hover:text-accent">
            {frontmatter.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-subtext">
            {frontmatter.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-2 font-mono text-xs text-muted">
            <span>{author}</span>
            <span>·</span>
            <span>{frontmatter.readingTime}분</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
