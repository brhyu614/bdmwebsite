import { formatDate } from '@/lib/formatDate'
import { AUTHOR_NAME } from '@/lib/constants'

interface ArticleMetaProps {
  date: string
  readingTime: number
  showAuthor?: boolean
}

export default function ArticleMeta({
  date,
  readingTime,
  showAuthor = true,
}: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 text-sm text-subtext">
      {showAuthor && (
        <>
          <span>{AUTHOR_NAME}</span>
          <span className="text-muted">·</span>
        </>
      )}
      <time dateTime={date}>{formatDate(date)}</time>
      <span className="text-muted">·</span>
      <span>{readingTime}분 읽기</span>
    </div>
  )
}
