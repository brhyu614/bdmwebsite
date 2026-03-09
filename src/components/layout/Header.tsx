'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const NAV_LINKS = [
  { href: '/articles?series=lab-research', label: '리서치' },
  { href: '/articles?series=algorithm-decode', label: '알고리즘 디코드' },
  { href: '/research', label: '연구실' },
  { href: '/about', label: '교수' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Desktop: single row */}
        <div className="flex items-center justify-between py-5">
          <Link href="/" className="group flex flex-col">
            <span className="flex items-baseline gap-0">
              <span className="text-lg font-bold tracking-tight text-text">
                빅데이터마케팅
              </span>
              <span className="text-lg font-bold tracking-tight text-accent">
                {' '}랩
              </span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted">
              Big Data Marketing Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = currentUrl === link.href || (pathname === link.href && !link.href.includes('?'))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    isActive ? 'text-accent' : 'text-subtext'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Mobile Navigation: always visible horizontal bar */}
        <nav className="flex gap-5 overflow-x-auto border-t border-border pb-3 pt-3 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_LINKS.map((link) => {
            const isActive = currentUrl === link.href || (pathname === link.href && !link.href.includes('?'))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 text-[13px] font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-muted hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
