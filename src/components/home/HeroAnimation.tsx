'use client'

export default function HeroAnimation() {
  return (
    <>
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — 글씨가 눈에 잘 띄도록 */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
    </>
  )
}
