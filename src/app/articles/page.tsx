import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import Sidebar from '@/components/layout/Sidebar'
import ArchiveFilter from './ArchiveFilter'

export const metadata: Metadata = {
  title: '아티클',
  description: '빅데이터 마케팅 랩의 모든 아티클을 확인하세요.',
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-text">아티클</h1>

      <div className="lg:flex lg:gap-12">
        <div className="flex-1 lg:max-w-2xl">
          <ArchiveFilter articles={articles} />
        </div>
        <div className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
