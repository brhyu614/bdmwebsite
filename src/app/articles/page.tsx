import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import ArchiveFilter from './ArchiveFilter'

export const metadata: Metadata = {
  title: '아티클',
  description: '한양대 빅데이터마케팅 랩(Big Data Marketing Lab)의 알고리즘 분석, AI 예측, 인과분석 기반 마케팅 아티클.',
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div>
          <p className="font-mono text-sm uppercase tracking-widest text-accent">Articles</p>
          <h1 className="mt-3 mb-10 text-3xl font-bold text-text">전체 아티클</h1>
        </div>
      }>
        <ArchiveFilter articles={articles} />
      </Suspense>
    </div>
  )
}
