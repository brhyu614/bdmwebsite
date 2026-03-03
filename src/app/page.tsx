import { getAllArticles, getFeaturedArticle } from '@/lib/articles'
import ArticleHero from '@/components/articles/ArticleHero'
import Sidebar from '@/components/layout/Sidebar'
import NewsletterCTA from '@/components/NewsletterCTA'
import HomeFilter from './HomeFilter'

export default function HomePage() {
  const allArticles = getAllArticles()
  const featuredArticle = getFeaturedArticle() ?? allArticles[0]
  const remainingArticles = allArticles.filter(
    (a) => a.slug !== featuredArticle?.slug
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      {featuredArticle && (
        <section className="mb-10">
          <ArticleHero article={featuredArticle} />
        </section>
      )}

      {/* Content + Sidebar */}
      <div className="lg:flex lg:gap-12">
        {/* Main Content */}
        <div className="flex-1 lg:max-w-2xl">
          <HomeFilter articles={remainingArticles} />
        </div>

        {/* Sidebar (Desktop) */}
        <div className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </div>
      </div>

      {/* Newsletter CTA */}
      <section className="mt-16">
        <NewsletterCTA />
      </section>
    </div>
  )
}
