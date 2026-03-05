import { getSeriesName, getSeriesColor } from '@/lib/series'

interface SeriesLabelProps {
  series: string
  size?: 'sm' | 'md'
}

export default function SeriesLabel({ series, size = 'sm' }: SeriesLabelProps) {
  const color = getSeriesColor(series)

  return (
    <span
      className={`inline-block font-mono font-semibold uppercase tracking-wider ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
      style={{ color }}
    >
      {getSeriesName(series)}
    </span>
  )
}
