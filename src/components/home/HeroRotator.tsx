'use client'

import { useEffect, useState } from 'react'

const PHRASES = ['빅데이터로 예측합니다.', 'AI 에이전트를 만듭니다.', '가상의 시장에서 실험합니다.']

export default function HeroRotator() {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fadeOut = setTimeout(() => setVisible(false), 2400)
    const swap = setTimeout(() => {
      setI((prev) => (prev + 1) % PHRASES.length)
      setVisible(true)
    }, 2800)
    return () => {
      clearTimeout(fadeOut)
      clearTimeout(swap)
    }
  }, [i])

  return (
    <span className="block">
      <span
        className={`inline-block text-accent transition-all duration-500 ${
          visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-3 opacity-0 blur-[2px]'
        }`}
      >
        {PHRASES[i]}
      </span>
    </span>
  )
}
