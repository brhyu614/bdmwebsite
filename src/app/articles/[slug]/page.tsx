import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import { getAllArticles, getArticleBySlug } from '@/lib/articles'
import { mdxComponents } from '@/components/mdx/MdxComponents'
import SeriesLabel from '@/components/articles/SeriesLabel'
import ArticleMeta from '@/components/articles/ArticleMeta'
import RelatedArticles from '@/components/articles/RelatedArticles'
import NewsletterCTA from '@/components/NewsletterCTA'
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
      authors: [AUTHOR_NAME],
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        type="article"
        data={{
          title: frontmatter.title,
          excerpt: frontmatter.excerpt,
          date: frontmatter.date,
          slug,
        }}
      />
      <article>
        {/* Header */}
        <header className="mx-auto max-w-[720px]">
          <SeriesLabel series={frontmatter.series} size="md" />
          <h1 className="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl">
            {frontmatter.title}
          </h1>
          <div className="mt-4">
            <ArticleMeta
              date={frontmatter.date}
              readingTime={frontmatter.readingTime}
            />
          </div>
        </header>

        {/* Body */}
        <div className="prose prose-lg mx-auto mt-10 max-w-[720px]">
          {content}
        </div>

        {/* Tags */}
        <div className="mx-auto mt-10 flex max-w-[720px] flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-3 py-1 text-xs text-subtext"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related Articles */}
      <div className="mx-auto max-w-[720px]">
        <RelatedArticles currentSlug={slug} series={frontmatter.series} />
      </div>

      {/* Newsletter CTA */}
      <div className="mx-auto mt-16 max-w-[720px]">
        <NewsletterCTA />
      </div>
    </div>
  )
}
