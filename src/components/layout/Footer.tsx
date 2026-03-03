import Link from 'next/link'
import { SITE_NAME, INSTAGRAM_URL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-text">{SITE_NAME}</p>
            <p className="mt-2 text-sm text-subtext">
              감 대신 근거. 데이터와 연구 기반의 마케팅 분석.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 text-sm font-semibold text-text">페이지</p>
            <nav className="flex flex-col gap-2">
              <Link href="/articles" className="text-sm text-subtext hover:text-text">
                아티클
              </Link>
              <Link href="/about" className="text-sm text-subtext hover:text-text">
                About
              </Link>
              <Link href="/work-with-us" className="text-sm text-subtext hover:text-text">
                Work With Us
              </Link>
              <Link href="/join" className="text-sm text-subtext hover:text-text">
                Join the Lab
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="mb-3 text-sm font-semibold text-text">소셜</p>
            <div className="flex flex-col gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-subtext hover:text-text"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
