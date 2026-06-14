/**
 * 6-Lens 의사결정 구조 도식
 * 소비자의 사고를 가져오는 6개 렌즈 (deck slide17 + L2_handout_4Cap_6Lens).
 * 사이트 컬러(accent)로 그린 반응형 그리드. L5(가치 사슬)는 ★ 강조.
 */

const LENSES = [
  { id: 'L1', ko: '경제적 합리성', q: '돈 앞에서 합리적인가?', theory: 'Prospect Theory', who: 'Kahneman & Tversky' },
  { id: 'L2', ko: '의사결정 스타일', q: '결정을 어떻게 내리는가?', theory: 'Maximizer / Satisficer', who: 'Schwartz' },
  { id: 'L3', ko: '동기 구조', q: '무엇이 이 사람을 움직이는가?', theory: 'Regulatory Focus', who: 'Higgins' },
  { id: 'L4', ko: '사회적 영향', q: '타인·사회의 영향은?', theory: 'Social Proof', who: 'Cialdini' },
  { id: 'L5', ko: '가치 사슬', q: '소비와 삶의 철학은?', theory: 'Means-End Chain', who: 'Gutman', star: true },
  { id: 'L6', ko: '시간 지향', q: '미래를 위해 기다릴 수 있나?', theory: 'Construal-Level Theory', who: 'Trope & Liberman' },
]

export default function SixLensDiagram() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          6-Lens Decision Structure
        </p>
        <h3 className="mt-2 text-lg font-bold text-text">6-Lens 의사결정 구조</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-subtext">
          한 사람의 응답을 6개 행동·심리 이론의 렌즈로 다시 구조화해, 설문 응답과
          실제 행동 사이의 간극(Gap)을 줄인다.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LENSES.map((lens) => (
          <div
            key={lens.id}
            className={`relative flex flex-col rounded-xl border p-4 transition-colors ${
              lens.star
                ? 'border-accent bg-accent-bg'
                : 'border-border bg-bg hover:border-accent/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-mono text-xs font-bold ${
                  lens.star ? 'text-accent' : 'text-muted'
                }`}
              >
                {lens.id}
              </span>
              {lens.star && (
                <span className="font-mono text-[10px] text-accent">★ 핵심</span>
              )}
            </div>
            <p className="mt-1 text-sm font-bold text-text">{lens.ko}</p>
            <p className="mt-1 text-xs leading-relaxed text-subtext">{lens.q}</p>
            <div className="mt-3 border-t border-border pt-2">
              <p className="font-mono text-[10px] text-accent">{lens.theory}</p>
              <p className="font-mono text-[9px] text-muted">{lens.who}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-muted">
        L5(가치 사슬, Means-End Chain)는 &ldquo;왜?&rdquo;를 세 번 물어 가치까지
        올라가는 래더링 — 에이전트가 효용이 아닌 <em>가치</em>로 추론하게 만드는 핵심 렌즈.
      </p>
    </div>
  )
}
