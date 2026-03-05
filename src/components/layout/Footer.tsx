import Link from 'next/link'
import { SITE_NAME, INSTAGRAM_URL, CONTACT_EMAIL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-text">
              빅데이터마케팅 <span className="text-accent">랩</span>
            </p>
            <p className="mt-2 text-sm text-subtext">
              감 대신 근거. 데이터로 읽는 마케팅.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
              Pages
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="/articles" className="text-sm text-subtext hover:text-accent transition-colors">
                아티클
              </Link>
              <Link href="/about" className="text-sm text-subtext hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/join" className="text-sm text-subtext hover:text-accent transition-colors">
                Join the Lab
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
              Connect
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-subtext hover:text-accent transition-colors"
              >
                Instagram
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm text-subtext hover:text-accent transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="font-mono text-xs text-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  )
}
