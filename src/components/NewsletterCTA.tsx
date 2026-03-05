'use client'

export default function NewsletterCTA() {
  return (
    <section className="rounded-2xl border border-border bg-surface px-6 py-12 text-center sm:px-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Newsletter</p>
      <h2 className="mt-3 text-2xl font-bold text-text">
        데이터 기반 인사이트를 받아보세요
      </h2>
      <p className="mx-auto mt-3 max-w-md text-base text-subtext">
        새로운 아티클이 발행되면 이메일로 알려드립니다.
      </p>
      <form
        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="이메일 주소"
          className="flex-1 rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-6 py-3 font-mono text-sm font-medium text-black transition-colors hover:bg-accent-dim"
        >
          구독하기
        </button>
      </form>
    </section>
  )
}
