'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Article } from '@/lib/types'
import { SERIES } from '@/lib/series'
import SeriesFilter from '@/components/articles/SeriesFilter'
import ArticleList from '@/components/articles/ArticleList'

interface ArchiveFilterProps {
  articles: Article[]
}

export default function ArchiveFilter({ articles }: ArchiveFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialSeries = searchParams.get('series')
  const [currentSeries, setCurrentSeries] = useState<string | null>(
    initialSeries && SERIES[initialSeries] ? initialSeries : null
  )

  useEffect(() => {
    const param = searchParams.get('series')
    if (param && SERIES[param]) {
      setCurrentSeries(param)
    } else if (!param) {
      setCurrentSeries(null)
    }
  }, [searchParams])

  const handleChange = (series: string | null) => {
    setCurrentSeries(series)
    if (series) {
      router.push(`/articles?series=${series}`, { scroll: false })
    } else {
      router.push('/articles', { scroll: false })
    }
  }

  const filteredArticles = currentSeries
    ? articles.filter((a) => a.frontmatter.series === currentSeries)
    : articles

  const seriesInfo = currentSeries ? SERIES[currentSeries] : null

  const pageTitle = seriesInfo ? seriesInfo.name : '전체 아티클'

  return (
    <>
      <p className="font-mono text-sm uppercase tracking-widest text-accent">
        {currentSeries ? seriesInfo?.name : 'Articles'}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-text">{pageTitle}</h1>
      {seriesInfo && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-subtext">
          {seriesInfo.intro}
        </p>
      )}
      <div className="mt-8 mb-8">
        <SeriesFilter current={currentSeries} onChange={handleChange} />
      </div>
      <ArticleList articles={filteredArticles} />
    </>
  )
}
