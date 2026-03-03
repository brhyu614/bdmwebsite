'use client'

import { SERIES } from '@/lib/series'

interface SeriesFilterProps {
  current: string | null
  onChange: (series: string | null) => void
}

export default function SeriesFilter({ current, onChange }: SeriesFilterProps) {
  const filters = [
    { slug: null, name: '전체' },
    ...Object.values(SERIES).map((s) => ({ slug: s.slug, name: s.name })),
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.slug ?? 'all'}
          onClick={() => onChange(filter.slug)}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            current === filter.slug
              ? 'bg-accent text-white'
              : 'bg-white text-subtext hover:bg-accent-bg hover:text-accent'
          }`}
        >
          {filter.name}
        </button>
      ))}
    </div>
  )
}
