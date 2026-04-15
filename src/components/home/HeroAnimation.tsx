'use client'

export default function HeroAnimation() {
  return (
    <>
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(76,158,235,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(76,158,235,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(76,158,235,0.08),transparent_50%)]" />

        {/* Animated orbs */}
        <div
          className="absolute h-[600px] w-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(76,158,235,0.4) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(76,158,235,0.3) 0%, transparent 70%)',
            top: '50%',
            right: '5%',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute h-[400px] w-[400px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(100,180,255,0.3) 0%, transparent 70%)',
            bottom: '10%',
            left: '30%',
            animation: 'float3 18s ease-in-out infinite',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(76,158,235,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76,158,235,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating keyword badges */}
        <div className="absolute inset-0 hidden sm:block">
          {[
            { text: 'AI Prediction', top: '12%', left: '8%', delay: '0s' },
            { text: 'XGBoost', top: '25%', right: '12%', delay: '2s' },
            { text: 'Causal Inference', top: '65%', left: '5%', delay: '4s' },
            { text: 'LLM Multi-Agent', top: '18%', right: '30%', delay: '6s' },
            { text: 'SHAP', top: '75%', right: '15%', delay: '8s' },
            { text: 'Consumer Behavior', top: '45%', right: '5%', delay: '1s' },
            { text: 'Revenue Forecasting', top: '85%', left: '25%', delay: '3s' },
            { text: 'Deep Learning', top: '8%', left: '45%', delay: '5s' },
            { text: 'Big Data Analytics', top: '55%', left: '15%', delay: '7s' },
            { text: 'Demand Prediction', top: '35%', left: '3%', delay: '9s' },
          ].map((item) => (
            <span
              key={item.text}
              className="absolute font-mono text-[11px] tracking-wider text-accent/20"
              style={{
                top: item.top,
                left: item.left,
                right: 'right' in item ? (item as { right: string }).right : undefined,
                animation: `fadeFloat 12s ease-in-out ${item.delay} infinite`,
              }}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom fade to bg */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, -60px) scale(1.1); }
          66% { transform: translate(-40px, 40px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, 50px) scale(1.05); }
          66% { transform: translate(50px, -30px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.1); }
        }
        @keyframes fadeFloat {
          0%, 100% { opacity: 0.1; transform: translateY(0); }
          50% { opacity: 0.3; transform: translateY(-8px); }
        }
      `}</style>
    </>
  )
}
