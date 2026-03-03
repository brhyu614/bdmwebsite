import { getSeriesName } from '@/lib/series'

interface SeriesLabelProps {
  series: string
  size?: 'sm' | 'md'
}

export default function SeriesLabel({ series, size = 'sm' }: SeriesLabelProps) {
  return (
    <span
      className={`inline-block rounded-full bg-accent-bg font-medium text-accent ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {getSeriesName(series)}
    </span>
  )
}
