'use client'

import { useEffect, useState } from 'react'

const PHRASES = [
  { verb: '복제합니다', obj: '6년치 구매 기록으로 소비자를' },
  { verb: '실험합니다', obj: '가격을 올린 세상을 가상에서' },
  { verb: '예측합니다', obj: '다음 분기 매출과 폐업 가능성을' },
  { verb: '검증합니다', obj: 'AI가 내놓은 답을 사람의 답과' },
]

export default function HeroRotator() {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fadeOut = setTimeout(() => setVisible(false), 2600)
    const swap = setTimeout(() => {
      setI((prev) => (prev + 1) % PHRASES.length)
      setVisible(true)
    }, 3000)
    return () => {
      clearTimeout(fadeOut)
      clearTimeout(swap)
    }
  }, [i])

  const cur = PHRASES[i]

  return (
    <span className="block min-h-[2.6em] sm:min-h-[2.4em]">
      <span
        className={`block transition-all duration-400 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        <span className="block text-[0.55em] font-medium text-subtext sm:text-[0.5em]">
          {cur.obj}
        </span>
        <span className="block text-accent">{cur.verb}</span>
      </span>
    </span>
  )
}
