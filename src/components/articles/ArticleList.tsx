import type { Article } from '@/lib/types'
import ArticleCard from './ArticleCard'

interface ArticleListProps {
  articles: Article[]
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <p className="py-12 text-center text-subtext">
        아직 게시된 아티클이 없습니다.
      </p>
    )
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  )
}
