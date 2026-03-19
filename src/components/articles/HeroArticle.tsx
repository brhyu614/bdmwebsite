import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/types'
import { getSeriesName } from '@/lib/series'
import { AUTHOR_NAME } from '@/lib/constants'

interface HeroArticleProps {
  article: Article
}

export default function HeroArticle({ article }: HeroArticleProps) {
  const { frontmatter, slug } = article
  const author = frontmatter.author ?? AUTHOR_NAME

  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article className="card-hover overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grid md:grid-cols-2">
          {/* Cover Image — 큰 사이즈 */}
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px] overflow-hidden">
            {frontmatter.coverImage ? (
              <Image
                src={frontmatter.coverImage}
                alt={frontmatter.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-alt">
                <span className="font-mono text-6xl font-bold text-border">BDM</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-5 rounded-sm bg-accent/90 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-black">
              {getSeriesName(frontmatter.series)}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Latest</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-text transition-colors group-hover:text-accent sm:text-3xl">
              {frontmatter.title}
            </h2>
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-subtext">
              {frontmatter.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs text-muted">
              <span>{author}</span>
              <span>·</span>
              <span>{frontmatter.readingTime}분</span>
              <span>·</span>
              <span>{frontmatter.date}</span>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 px-4 py-2 font-mono text-xs font-medium text-accent transition-colors group-hover:bg-accent group-hover:text-black">
                읽기 →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
