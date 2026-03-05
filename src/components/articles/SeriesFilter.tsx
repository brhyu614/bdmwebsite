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
    <div className="flex gap-3 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.slug ?? 'all'}
          onClick={() => onChange(filter.slug)}
          className={`whitespace-nowrap rounded-full border px-5 py-2 font-mono text-sm font-medium transition-all ${
            current === filter.slug
              ? 'border-accent bg-accent text-black'
              : 'border-border bg-transparent text-subtext hover:border-accent hover:text-accent'
          }`}
        >
          {filter.name}
        </button>
      ))}
    </div>
  )
}
