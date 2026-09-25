'use client'

import { useState } from 'react'

export type Semester = {
  term: string
  theme: string
  work: string[]
  output: string
  detail: { label: string; body: string }[]
}

function Row({ s }: { s: Semester }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-6 text-left transition-colors hover:bg-surface-alt"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="rounded bg-accent-bg px-2 py-0.5 font-mono text-xs text-accent">
              {s.term}
            </span>
            <h3 className="text-base font-bold text-text">{s.theme}</h3>
          </div>
          <ul className="mt-4 space-y-1.5">
            {s.work.map((w) => (
              <li key={w} className="flex gap-2 font-serif text-sm leading-[1.8] text-subtext">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted">
            <span className="font-mono text-accent">산출물</span> {s.output}
          </p>
        </div>
        <span
          className={`mt-1 shrink-0 font-mono text-xs text-accent transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="border-t border-border bg-bg px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            자세한 수행 내용
          </p>
          <dl className="mt-3 space-y-4">
            {s.detail.map((d) => (
              <div key={d.label}>
                <dt className="text-sm font-bold text-text">{d.label}</dt>
                <dd className="mt-1 font-serif text-sm leading-[1.85] text-subtext">{d.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </li>
  )
}

export default function SemesterAccordion({ semesters }: { semesters: Semester[] }) {
  return (
    <ol className="mt-8 space-y-6">
      {semesters.map((s) => (
        <Row key={s.term} s={s} />
      ))}
    </ol>
  )
}
