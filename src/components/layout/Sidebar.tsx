import Link from 'next/link'
import { AUTHOR_NAME, INSTAGRAM_URL } from '@/lib/constants'

export default function Sidebar() {
  return (
    <aside className="sticky top-24">
      {/* Profile */}
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-bg text-2xl font-bold text-accent">
          {AUTHOR_NAME.charAt(0)}
        </div>
        <h3 className="text-base font-bold text-text">{AUTHOR_NAME}</h3>
        <p className="mt-1 text-sm text-subtext">교수 · 빅데이터 마케팅 랩</p>
        <p className="mt-3 text-sm leading-relaxed text-subtext">
          데이터와 연구 기반의 마케팅 분석을 합니다. 감 대신 근거, 과장 대신 정확성을 추구합니다.
        </p>

        {/* Social Links */}
        <div className="mt-4 flex gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-subtext hover:text-accent"
          >
            Instagram
          </a>
        </div>

        {/* CTA */}
        <Link
          href="/work-with-us"
          className="mt-5 block rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-accent-light"
        >
          함께 일하기
        </Link>
      </div>
    </aside>
  )
}
