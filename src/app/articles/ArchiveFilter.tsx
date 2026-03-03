'use client'

import { useState } from 'react'
import type { Article } from '@/lib/types'
import SeriesFilter from '@/components/articles/SeriesFilter'
import ArticleList from '@/components/articles/ArticleList'

interface ArchiveFilterProps {
  articles: Article[]
}

export default function ArchiveFilter({ articles }: ArchiveFilterProps) {
  const [currentSeries, setCurrentSeries] = useState<string | null>(null)

  const filteredArticles = currentSeries
    ? articles.filter((a) => a.frontmatter.series === currentSeries)
    : articles

  return (
    <>
      <div className="mb-6">
        <SeriesFilter current={currentSeries} onChange={setCurrentSeries} />
      </div>
      <ArticleList articles={filteredArticles} />
    </>
  )
}
