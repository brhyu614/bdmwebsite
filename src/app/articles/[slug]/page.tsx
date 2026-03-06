import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import Image from 'next/image'
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
    alternates: {
      canonical: `${SITE_URL}/articles/${slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author ?? AUTHOR_NAME],
      siteName: SITE_NAME,
      url: `${SITE_URL}/articles/${slug}`,
      ...(frontmatter.coverImage && {
        images: [{ url: frontmatter.coverImage, width: 1200, height: 630, alt: frontmatter.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
      ...(frontmatter.coverImage && { images: [frontmatter.coverImage] }),
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
              coverImage: frontmatter.coverImage,
              tags: frontmatter.tags,
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

      {/* Hero Image */}
      {frontmatter.coverImage && (
        <div className="mx-auto max-w-[960px] px-4 sm:px-6">
          <div className="relative aspect-[2/1] overflow-hidden rounded-b-2xl sm:aspect-[2.4/1]">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 960px) 100vw, 960px"
            />
          </div>
        </div>
      )}

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
