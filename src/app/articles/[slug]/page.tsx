import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import { getAllArticles, getArticleBySlug } from '@/lib/articles'
import { mdxComponents } from '@/components/mdx/MdxComponents'
import SeriesLabel from '@/components/articles/SeriesLabel'
import ArticleMeta from '@/components/articles/ArticleMeta'
import RelatedArticles from '@/components/articles/RelatedArticles'

import JsonLd from '@/components/JsonLd'
import { SITE_NAME, SITE_URL, AUTHOR_NAME } from '@/lib/constants'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  const { frontmatter } = article

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author ?? AUTHOR_NAME],
      siteName: SITE_NAME,
      url: `${SITE_URL}/articles/${slug}`,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) notFound()

  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  })

  const { frontmatter } = article

  return (
    <>
      {/* Dark Hero Header */}
      <div className="border-b border-border bg-bg">
        <div className="mx-auto max-w-[720px] px-4 pb-10 pt-12 sm:px-6">
          <JsonLd
            type="article"
            data={{
              title: frontmatter.title,
              excerpt: frontmatter.excerpt,
              date: frontmatter.date,
              slug,
            }}
          />
          <SeriesLabel series={frontmatter.series} size="md" />
          <h1 className="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-[42px] lg:leading-tight">
            {frontmatter.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-subtext">
            {frontmatter.excerpt}
          </p>
          <div className="mt-6">
            <ArticleMeta
              date={frontmatter.date}
              readingTime={frontmatter.readingTime}
              author={frontmatter.author}
            />
          </div>
        </div>
      </div>

      {/* Article Body */}
      <article className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
        <div className="prose prose-lg">
          {content}
        </div>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-subtext transition-colors hover:border-accent hover:text-accent"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        <RelatedArticles currentSlug={slug} series={frontmatter.series} />
      </article>
    </>
  )
}
