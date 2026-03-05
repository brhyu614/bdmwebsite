'use client'

import { useEffect, useRef } from 'react'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Clear previous giscus instance
    const container = ref.current
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    // TODO: Replace with your actual GitHub repo and category
    script.setAttribute('data-repo', 'brhyu614/bigdatamarketinglab')
    script.setAttribute('data-repo-id', '')
    script.setAttribute('data-category', 'Comments')
    script.setAttribute('data-category-id', '')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'noborder_dark')
    script.setAttribute('data-lang', 'ko')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true

    container.appendChild(script)
  }, [slug])

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-6 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
        댓글
      </h2>
      <div ref={ref} />
    </section>
  )
}
