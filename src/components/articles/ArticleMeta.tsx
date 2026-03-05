import { formatDate } from '@/lib/formatDate'
import { AUTHOR_NAME } from '@/lib/constants'

interface ArticleMetaProps {
  date: string
  readingTime: number
  showAuthor?: boolean
  author?: string
}

export default function ArticleMeta({
  date,
  readingTime,
  showAuthor = true,
  author,
}: ArticleMetaProps) {
  const displayAuthor = author ?? AUTHOR_NAME

  return (
    <div className="flex flex-wrap items-center gap-x-3 font-mono text-sm text-subtext">
      {showAuthor && (
        <>
          <span>{displayAuthor}</span>
          <span className="text-muted">·</span>
        </>
      )}
      <time dateTime={date}>{formatDate(date)}</time>
      <span className="text-muted">·</span>
      <span>{readingTime}분 읽기</span>
    </div>
  )
}
