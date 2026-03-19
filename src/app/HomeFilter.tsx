'use client'

import { useState } from 'react'
import type { Article } from '@/lib/types'
import SeriesFilter from '@/components/articles/SeriesFilter'
import ArticleCard from '@/components/articles/ArticleCard'
import HeroArticle from '@/components/articles/HeroArticle'

interface HomeFilterProps {
  articles: Article[]
}

export default function HomeFilter({ articles }: HomeFilterProps) {
  const [currentSeries, setCurrentSeries] = useState<string | null>(null)

  const filteredArticles = currentSeries
    ? articles.filter((a) => a.frontmatter.series === currentSeries)
    : articles

  // 히어로: 필터 없을 때만 첫 번째 글을 크게
  const showHero = !currentSeries && filteredArticles.length > 0
  const heroArticle = showHero ? filteredArticles[0] : null
  const restArticles = showHero ? filteredArticles.slice(1) : filteredArticles

  // 랩 리서치 글 (시리즈 필터 안 걸려있을 때 중간에 삽입)
  const labResearchArticles = !currentSeries
    ? articles.filter((a) => a.frontmatter.series === 'lab-research').slice(0, 4)
    : []

  // 나머지 글에서 랩 리서치 중복 제거 (이미 섹션에서 보여주므로)
  const mainArticles = !currentSeries
    ? restArticles.filter(
        (a) => !labResearchArticles.some((lr) => lr.slug === a.slug)
      )
    : restArticles

  // 메인 글을 두 그룹으로 나눔 (첫 4개는 2열, 나머지 3열)
  const firstBatch = mainArticles.slice(0, 4)
  const secondBatch = mainArticles.slice(4)

  return (
    <>
      <div className="mb-8">
        <SeriesFilter current={currentSeries} onChange={setCurrentSeries} />
      </div>

      {/* 히어로 아티클 */}
      {heroArticle && (
        <div className="mb-10">
          <HeroArticle article={heroArticle} />
        </div>
      )}

      {/* 필터 걸려있으면 기존 3열 그리드 */}
      {currentSeries && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, i) => (
            <ArticleCard
              key={article.slug}
              article={article}
              index={i}
              total={filteredArticles.length}
            />
          ))}
        </div>
      )}

      {/* 필터 없을 때: 혼합 레이아웃 */}
      {!currentSeries && (
        <>
          {/* 첫 그룹: 2열 (큰 카드) */}
          {firstBatch.length > 0 && (
            <div className="mb-10 grid gap-6 sm:grid-cols-2">
              {firstBatch.map((article, i) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  index={i}
                  total={firstBatch.length}
                />
              ))}
            </div>
          )}

          {/* 중간: 랩 리서치 섹션 */}
          {labResearchArticles.length > 0 && (
            <div className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">
                    Lab Research
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-text">
                    BDM Lab 데이터 분석
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentSeries('lab-research')}
                  className="font-mono text-xs text-accent hover:underline"
                >
                  전체 보기 →
                </button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {labResearchArticles.map((article, i) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    index={i}
                    total={labResearchArticles.length}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 나머지: 3열 */}
          {secondBatch.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondBatch.map((article, i) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  index={i}
                  total={secondBatch.length}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
