import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import ArchiveFilter from './ArchiveFilter'

export const metadata: Metadata = {
  title: '아티클',
  description: '빅데이터마케팅 랩의 모든 아티클을 확인하세요.',
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-sm uppercase tracking-widest text-accent">Articles</p>
      <h1 className="mt-3 mb-10 text-3xl font-bold text-text">전체 아티클</h1>
      <ArchiveFilter articles={articles} />
    </div>
  )
}
