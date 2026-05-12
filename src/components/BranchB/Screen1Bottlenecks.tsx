import { useDiagnosis } from './DiagnosisContext'
import {
  OUTPUT_TYPE_LABELS, TEAM_SIZE_OPTIONS, BOTTLENECK_OPTIONS,
} from './diagnosisData'
import { ArrowRight } from 'lucide-react'

const GRADIENT_TEXT: React.CSSProperties = {
  background: 'linear-gradient(90deg, #a78bfa, #c084fc, #e879a0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

interface Props {
  onNext: () => void
}

export default function Screen1Bottlenecks({ onNext }: Props) {
  const { state, update } = useDiagnosis()
  const { outputType, teamSize, bottlenecks } = state

  const toggleOutputType = (label: string) => {
    const next = outputType.includes(label)
      ? outputType.filter(v => v !== label)
      : [...outputType, label]
    update({ outputType: next })
  }

  const toggleBottleneck = (key: string) => {
    if (bottlenecks.includes(key)) {
      update({ bottlenecks: bottlenecks.filter(k => k !== key) })
    } else if (bottlenecks.length < 3) {
      update({ bottlenecks: [...bottlenecks, key] })
    }
  }

  const canProceed = bottlenecks.length > 0

  return (
    <div style={{ maxWidth: '680px', color: 'white', fontSize: '14px' }}>
      {/* Eyebrow */}
      <p style={{
        fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em',
        textTransform: 'uppercase', marginBottom: '12px',
        ...GRADIENT_TEXT,
      }}>
        Pipeline Diagnosis — Bottleneck Finder
      </p>

      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '28px', lineHeight: 1.2 }}>
        Where is your production losing the most time?
      </h2>

      {/* Q1. Output type */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          What is your primary production output?
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {OUTPUT_TYPE_LABELS.map(label => {
            const active = outputType.includes(label)
            return (
              <button
                key={label}
                onClick={() => toggleOutputType(label)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '99px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: active
                    ? '0.5px solid rgba(167,139,250,0.55)'
                    : '0.5px solid rgba(255,255,255,0.15)',
                  background: active ? 'rgba(167,139,250,0.08)' : 'transparent',
                  color: active ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Q2 — Team size */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          How many people work in your studio?
        </p>
        <div style={{ display: 'flex', gap: '0px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
          {TEAM_SIZE_OPTIONS.map(({ label }) => {
            const active = teamSize === label
            return (
              <button
                key={label}
                onClick={() => update({ teamSize: label })}
                style={{
                  flex: 1,
                  padding: '9px 4px',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: active
                    ? 'linear-gradient(hsl(0 0% 8%), hsl(0 0% 8%)) padding-box, linear-gradient(to right, #a78bfa, #c4b5fd, #e9d5ff) border-box'
                    : 'transparent',
                  border: active ? '0.5px solid transparent' : '0.5px solid transparent',
                  borderRight: '0.5px solid rgba(255,255,255,0.08)',
                  color: active ? '#e9d5ff' : 'rgba(255,255,255,0.6)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Q3 — Bottleneck stages */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Which stages are running over schedule most often?
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
          Select up to 3
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {BOTTLENECK_OPTIONS.map(({ key, label, sub }) => {
            const selected = bottlenecks.includes(key)
            const disabled = !selected && bottlenecks.length >= 3
            return (
              <button
                key={key}
                onClick={() => !disabled && toggleBottleneck(key)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  opacity: disabled ? 0.35 : 1,
                  border: selected
                    ? '0.5px solid rgba(167,139,250,0.55)'
                    : '0.5px solid rgba(255,255,255,0.12)',
                  background: selected ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Checkbox */}
                <span style={{
                  width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, marginTop: '1px',
                  border: selected ? '0.5px solid rgba(167,139,250,0.7)' : '0.5px solid rgba(255,255,255,0.25)',
                  background: selected ? 'rgba(167,139,250,0.2)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <div>
                  <p style={{ fontSize: '14px', color: '#fff', fontWeight: selected ? 600 : 400, lineHeight: 1.4 }}>
                    {label}
                  </p>
                  {sub && (
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px', lineHeight: 1.4 }}>
                      {sub}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={canProceed ? onNext : undefined}
        disabled={!canProceed}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '12px 28px', borderRadius: '99px',
          fontSize: '15px', fontWeight: 600, cursor: canProceed ? 'pointer' : 'not-allowed',
          opacity: canProceed ? 1 : 0.35, transition: 'opacity 0.15s',
          background: 'linear-gradient(hsl(0 0% 8%), hsl(0 0% 8%)) padding-box, linear-gradient(to right, #a78bfa, #c084fc, #e879a0) border-box',
          border: '1px solid transparent', color: '#fff',
        }}
      >
        Pain point impacts <ArrowRight style={{ width: '16px', height: '16px' }} />
      </button>
    </div>
  )
}
