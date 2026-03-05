import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="font-mono text-7xl font-bold text-accent/20">404</p>
      <h1 className="mt-4 text-2xl font-bold text-text">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-subtext">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 font-mono text-sm font-medium text-black transition-colors hover:bg-accent-dim"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
