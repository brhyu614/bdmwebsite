interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'insight'
}

const styles = {
  info: 'border-accent/50 bg-accent-bg',
  warning: 'border-amber-500/50 bg-amber-500/10',
  insight: 'border-cyan-500/50 bg-cyan-500/10',
}

const labels = {
  info: '참고',
  warning: '주의',
  insight: '인사이트',
}

const labelColors = {
  info: 'text-accent',
  warning: 'text-amber-400',
  insight: 'text-cyan-400',
}

export default function Callout({ children, type = 'info' }: CalloutProps) {
  return (
    <div className={`my-6 rounded-xl border-l-4 p-5 ${styles[type]}`}>
      <p className={`mb-2 font-mono text-xs font-bold uppercase tracking-wider ${labelColors[type]}`}>
        {labels[type]}
      </p>
      <div className="text-sm leading-relaxed text-text">{children}</div>
    </div>
  )
}
