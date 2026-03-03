interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'insight'
}

const styles = {
  info: 'border-accent bg-accent-bg',
  warning: 'border-amber-500 bg-amber-50',
  insight: 'border-blue-500 bg-blue-50',
}

const labels = {
  info: '참고',
  warning: '주의',
  insight: '인사이트',
}

export default function Callout({ children, type = 'info' }: CalloutProps) {
  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-subtext">
        {labels[type]}
      </p>
      <div className="text-sm leading-relaxed text-text">{children}</div>
    </div>
  )
}
