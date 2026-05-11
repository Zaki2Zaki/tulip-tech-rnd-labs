import { useState } from 'react'
import { DiagnosisProvider, useDiagnosis } from './DiagnosisContext'
import Screen1Bottlenecks from './Screen1Bottlenecks'
import Screen2Impact from './Screen2Impact'
import Screen3Tools from './Screen3Tools'
import Screen4Cost from './Screen4Cost'
import Screen5ActionPlan from './Screen5ActionPlan'

const STEPS = [
  { id: 1, label: 'Bottlenecks' },
  { id: 2, label: 'Impact' },
  { id: 3, label: 'Tools' },
  { id: 4, label: 'Cost' },
  { id: 5, label: 'Action Plan' },
]

interface Props { onBack: () => void }

function PipelineDiagnosisInner({ onBack }: Props) {
  const [screen, setScreen] = useState(1)

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border/30 bg-card/30 px-5 py-10">
        <div className="mb-8">
          <p className="text-[9px] tracking-[0.2em] uppercase font-body font-semibold text-primary mb-1">
            Pipeline Diagnosis
          </p>
          <p className="text-xs font-body" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Bottleneck Finder
          </p>
        </div>

        <nav className="space-y-1">
          {STEPS.map(step => {
            const done = step.id < screen
            const active = step.id === screen
            const clickable = done

            return (
              <button
                key={step.id}
                onClick={() => clickable ? setScreen(step.id) : undefined}
                disabled={!active && !clickable}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-body transition-all ${
                  active
                    ? 'font-semibold'
                    : clickable
                    ? 'cursor-pointer hover:text-white'
                    : 'cursor-default'
                }`}
                style={{
                  color: active ? '#e9d5ff' : clickable ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                  ...(active ? {
                    background: 'linear-gradient(hsl(0 0% 8%), hsl(0 0% 8%)) padding-box, linear-gradient(to right, #a78bfa, #c4b5fd, #e9d5ff) border-box',
                    border: '1px solid transparent',
                    borderRadius: '12px',
                  } : {}),
                }}
              >
                {/* Step indicator */}
                <span
                  style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 700,
                    ...(done
                      ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }
                      : active
                      ? { background: 'linear-gradient(135deg, #a78bfa, #e9d5ff)', color: '#0a0a0a' }
                      : { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.3)' }
                    ),
                  }}
                >
                  {done ? '✓' : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? '#0a0a0a' : 'rgba(255,255,255,0.2)', display: 'block' }} />}
                </span>
                {step.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-border/20">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-body hover:text-white transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Entry
          </button>
          <p className="text-[10px] font-body leading-relaxed mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Demo session. No data stored.
          </p>
        </div>
      </aside>

      {/* ── Mobile stepper ── */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur border-b border-border/20 px-4 py-3 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((step, idx) => {
          const done = step.id < screen
          const active = step.id === screen
          return (
            <div key={step.id} className="flex items-center gap-1.5 shrink-0">
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700,
                  ...(done
                    ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }
                    : active
                    ? { background: 'linear-gradient(135deg, #a78bfa, #e9d5ff)', color: '#0a0a0a' }
                    : { background: 'transparent', border: '1px solid #333', color: '#555' }
                  ),
                }}
              >
                {done ? '✓' : step.id}
              </span>
              <span className="text-[10px] font-body whitespace-nowrap" style={{ color: active ? '#fff' : done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)', fontWeight: active ? 600 : 400 }}>
                {step.label}
              </span>
              {idx < STEPS.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginLeft: '2px' }}>›</span>}
            </div>
          )
        })}
      </div>

      {/* ── Main content ── */}
      <section className="flex-1 px-6 md:px-12 py-10 md:py-12 md:mt-0 mt-10 overflow-y-auto" style={{ background: '#0F0F0F' }}>
        {screen === 1 && <Screen1Bottlenecks onNext={() => setScreen(2)} />}
        {screen === 2 && <Screen2Impact onNext={() => setScreen(3)} onBack={() => setScreen(1)} />}
        {screen === 3 && <Screen3Tools onNext={() => setScreen(4)} onBack={() => setScreen(2)} />}
        {screen === 4 && <Screen4Cost onNext={() => setScreen(5)} onBack={() => setScreen(3)} />}
        {screen === 5 && <Screen5ActionPlan onBack={() => setScreen(4)} />}
      </section>
    </div>
  )
}

export default function PipelineDiagnosisPage({ onBack }: Props) {
  return (
    <DiagnosisProvider>
      <PipelineDiagnosisInner onBack={onBack} />
    </DiagnosisProvider>
  )
}
