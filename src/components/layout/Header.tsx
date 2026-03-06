'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/articles?series=lab-research', label: '리서치' },
  { href: '/articles?series=algorithm-decode', label: '알고리즘 디코드' },
  { href: '/research', label: '연구실' },
  { href: '/about', label: '교수' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
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
            const basePath = link.href.split('?')[0]
            const isActive = pathname === basePath || pathname === link.href
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="메뉴 열기"
        >
          <span
            className={`block h-0.5 w-5 bg-text transition-transform ${
              isMenuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-text transition-opacity ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-text transition-transform ${
              isMenuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="border-t border-border bg-bg px-4 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-subtext transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
