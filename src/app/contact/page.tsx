import type { Metadata } from 'next'
import { INSTAGRAM_URL } from '@/lib/constants'

const AUTHOR_EMAIL = 'brlim@hanyang.ac.kr'

export const metadata: Metadata = {
  title: 'Contact',
  description: '빅데이터마케팅 랩(BDM Lab)에 연락하기. 연구 협업, 기업 프로젝트, 대학원 지원 문의.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[720px]">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">Contact</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">
          연락하기
        </h1>
        <p className="mt-4 text-base leading-relaxed text-subtext">
          연구 협업, 기업 프로젝트, 강연/교육, 대학원 지원 등 어떤 주제든 편하게 연락주세요.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-[720px] space-y-6">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">Email</span>
          <a
            href={`mailto:${AUTHOR_EMAIL}`}
            className="font-mono text-sm text-accent transition-colors hover:text-accent-dim"
          >
            {AUTHOR_EMAIL}
          </a>
        </div>
        <div className="flex items-start gap-4">
          <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">Tel</span>
          <a
            href="tel:02-2220-1076"
            className="font-mono text-sm text-subtext transition-colors hover:text-accent"
          >
            02-2220-1076
          </a>
        </div>
        <div className="flex items-start gap-4">
          <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">Office</span>
          <p className="text-sm text-subtext">
            서울 성동구 왕십리로 222, 한양대학교 서울캠퍼스 경영관 614호
          </p>
        </div>
        <div className="flex items-start gap-4">
          <span className="mt-0.5 inline-block w-16 shrink-0 font-mono text-xs text-muted">SNS</span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-subtext transition-colors hover:text-accent"
          >
            Instagram &rarr;
          </a>
        </div>
      </section>
    </div>
  )
}
