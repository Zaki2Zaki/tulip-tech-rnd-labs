import { useState } from 'react'
import { useDiagnosis } from './DiagnosisContext'
import {
  SLIP_OPTIONS, ROUNDS_OPTIONS,
  calcHoursLost, calcAdjMonthly, calcAdjAnnual,
  formatCurrencyAmount, getSeverityBadge, getSeverityText,
  BOTTLENECK_OPTIONS, EFF_RATES, EFF_RATE_IS_ESTIMATED,
  TEAM_SIZE_OPTIONS, CURRENCY_SYMBOLS, CURRENCY_RATES,
} from './diagnosisData'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

const GRADIENT_TEXT: React.CSSProperties = {
  background: 'linear-gradient(90deg, #a78bfa, #c084fc, #e879a0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const PILL_BASE: React.CSSProperties = {
  padding: '7px 14px', borderRadius: '99px', fontSize: '13px',
  fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
}

// Closest snap point for a given slider value
function closestSnap(val: number): number {
  const snaps = [10, 25, 40, 60]
  return snaps.reduce((prev, curr) =>
    Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
  )
}

function snapToLabel(rework: number): string {
  return ROUNDS_OPTIONS.find(r => r.rework === rework)?.label ?? '3 to 5 rounds'
}

interface Props { onNext: () => void; onBack: () => void }

export default function Screen2Impact({ onNext, onBack }: Props) {
  const { state, update } = useDiagnosis()
  const { bottlenecks, teamSize, slipWks, reworkPct, roundsLabel, currency } = state
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const hoursLost = calcHoursLost(teamSize, reworkPct)
  const adjMonthly = calcAdjMonthly(teamSize, reworkPct)
  const adjAnnual = calcAdjAnnual(teamSize, reworkPct)
  const slipOption = SLIP_OPTIONS.find(s => s.weeks === slipWks) ?? SLIP_OPTIONS[2]
  const severity = getSeverityBadge(reworkPct, slipWks)
  const severityText = getSeverityText(reworkPct, slipWks, roundsLabel)
  const sym = CURRENCY_SYMBOLS[currency]
  const rate = CURRENCY_RATES[currency]
  const approxLabel = currency !== 'CAD' ? ' (Approx.)' : ''

  const handleSlider = (val: number) => {
    const closest = closestSnap(val)
    update({ reworkPct: val, roundsLabel: snapToLabel(closest) })
  }

  const handlePill = (rework: number, label: string) => {
    update({ reworkPct: rework, roundsLabel: label })
  }

  const sliderPct = (reworkPct / 80) * 100

  return (
    <div style={{ maxWidth: '680px', color: 'white', fontSize: '14px' }}>
      {/* Eyebrow */}
      <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', ...GRADIENT_TEXT }}>
        Pipeline Diagnosis — Bottleneck Finder
      </p>
      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
        How much is this costing your studio?
      </h2>
      <p style={{ fontSize: '14px', color: '#fff', marginBottom: '16px' }}>
        Two questions. Each drives a different part of the impact model.
      </p>

      {/* Context bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
        {state.outputType.map(t => (
          <span key={t} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{t}</span>
        ))}
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{teamSize} people</span>
        {bottlenecks.map(key => {
          const opt = BOTTLENECK_OPTIONS.find(b => b.key === key)
          return opt ? (
            <span key={key} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{opt.label}</span>
          ) : null
        })}
      </div>

      {/* Q1. Schedule slippage */}
      <div style={{ marginBottom: '28px', padding: '20px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Q1. Schedule slippage
        </p>
        <p style={{ fontSize: '14px', color: '#fff', marginBottom: '4px' }}>
          On average, how far over schedule do your projects finish?
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
          Drives → schedule slippage metric and combined severity signal
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SLIP_OPTIONS.map(opt => {
            const active = slipWks === opt.weeks
            return (
              <button key={opt.label} onClick={() => update({ slipWks: opt.weeks })}
                style={{
                  ...PILL_BASE,
                  border: active ? '0.5px solid rgba(167,139,250,0.55)' : '0.5px solid rgba(255,255,255,0.15)',
                  background: active ? 'rgba(167,139,250,0.08)' : 'transparent',
                  color: active ? '#c4b5fd' : 'rgba(255,255,255,0.7)',
                }}>
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Currency toggle — between Q1 and Q2 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '28px', marginTop: '-16px' }}>
        {(['CAD', 'USD', 'EUR'] as const).map(c => (
          <button key={c} onClick={() => update({ currency: c })}
            style={{
              padding: '5px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              border: currency === c ? '0.5px solid rgba(167,139,250,0.55)' : '0.5px solid rgba(255,255,255,0.12)',
              background: currency === c ? 'rgba(167,139,250,0.10)' : 'transparent',
              color: currency === c ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Q2. Revision rounds + slider */}
      <div style={{ marginBottom: '28px', padding: '20px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Q2. Revision rounds
        </p>
        <p style={{ fontSize: '14px', color: '#fff', marginBottom: '4px' }}>
          How many revision rounds does a typical asset go through before sign-off?
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
          Drives → hours lost, monthly cost, annual cost, and combined severity signal
        </p>

        {/* Pill options */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {ROUNDS_OPTIONS.map(opt => {
            const active = roundsLabel === opt.label
            return (
              <button key={opt.label} onClick={() => handlePill(opt.rework, opt.label)}
                style={{
                  ...PILL_BASE,
                  border: active ? '0.5px solid rgba(167,139,250,0.55)' : '0.5px solid rgba(255,255,255,0.15)',
                  background: active ? 'rgba(167,139,250,0.08)' : 'transparent',
                  color: active ? '#c4b5fd' : 'rgba(255,255,255,0.7)',
                }}>
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Custom slider */}
        <div style={{ position: 'relative', height: '24px', marginBottom: '8px' }}>
          {/* Track */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '10px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }}>
            {/* Fill */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: '2px',
              width: `${sliderPct}%`,
              background: 'linear-gradient(to right, #a78bfa, #c084fc, #e879a0)',
              transition: 'width 0.12s ease',
            }} />
            {/* Markers at snap points */}
            {[10, 25, 40, 60].map(v => (
              <div key={v} style={{
                position: 'absolute', width: '5px', height: '5px', borderRadius: '50%',
                background: reworkPct >= v ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                top: '50%', transform: 'translate(-50%, -50%)',
                left: `${(v / 80) * 100}%`,
              }} />
            ))}
          </div>
          {/* Thumb */}
          <div style={{
            position: 'absolute', top: '4px', width: '16px', height: '16px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #a78bfa, #e879a0)',
            border: '2px solid #0F0F0F', boxShadow: '0 0 8px rgba(167,139,250,0.5)',
            pointerEvents: 'none', zIndex: 2,
            left: `calc(${sliderPct}% - 8px)`,
            transition: 'left 0.12s ease',
          }} />
          {/* Invisible range input */}
          <input
            type="range" min={0} max={80} step={1} value={reworkPct}
            onChange={e => handleSlider(Number(e.target.value))}
            style={{
              position: 'absolute', inset: 0, width: '100%', opacity: 0,
              cursor: 'pointer', WebkitAppearance: 'none',
            } as React.CSSProperties}
          />
        </div>

        {/* Segment labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>
          {['0%', '~10%', '~25%', '~40%', '~60%', '80%'].map(l => <span key={l}>{l}</span>)}
        </div>

        {/* Hint text */}
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
          {roundsLabel} — equivalent to ~{reworkPct}% of team time in rework overhead
        </p>
      </div>

      {/* 4 Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {/* Card 1 — Hours lost */}
        <div style={{ padding: '16px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Hours lost / month</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{hoursLost.toLocaleString()} hrs</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Driven by Q2 rework overhead only</p>
        </div>

        {/* Card 2 — Adj monthly cost */}
        <div style={{ padding: '16px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{sym} / month{approxLabel}</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{formatCurrencyAmount(adjMonthly, currency)}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>After 30% risk adjustment</p>
        </div>

        {/* Card 3 — Adj annual cost */}
        <div style={{ padding: '16px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{sym} / year{approxLabel}</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{formatCurrencyAmount(adjAnnual, currency)}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>After 30% risk adjustment</p>
        </div>

        {/* Card 4 — Schedule slippage (Q1) */}
        <div style={{ padding: '16px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Schedule slippage</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{slipOption.display}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Driven by Q1 only</p>
        </div>
      </div>

      {/* Combined severity signal */}
      <div style={{
        padding: '16px 20px', borderRadius: '12px', marginBottom: '16px',
        border: `0.5px solid ${severity.border}`, background: severity.barBg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '16px' }}>{severity.icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: severity.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {severity.label}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.6 }}>{severityText}</p>
      </div>

      {/* Methodology dropdown */}
      <div style={{ borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', marginBottom: '28px', overflow: 'hidden' }}>
        <button
          onClick={() => setMethodologyOpen(o => !o)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#fff' }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>
            Methodology — How these figures are calculated
          </span>
          {methodologyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {methodologyOpen && (
          <div style={{ padding: '0 16px 16px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, paddingTop: '12px' }}>
              <strong style={{ color: '#fff' }}>Salary base:</strong> CA$100,000/yr (ESAC 2024 — Canada average game dev salary)<br />
              <strong style={{ color: '#fff' }}>Hourly rate:</strong> $100,000 / 2,080 hrs = CA$48.08/hr<br />
              <strong style={{ color: '#fff' }}>Monthly hours:</strong> 160 hrs (4 weeks × 40 hrs)<br />
              <strong style={{ color: '#fff' }}>Risk adjustment:</strong> × 0.70 (Forrester TEI — 30% discount for adoption risk)<br /><br />
              <strong style={{ color: '#fff' }}>Formula (Q2. cost metrics):</strong><br />
              Hours lost = teamMidpoint × 160 × (reworkPct / 100)<br />
              Gross monthly = hours × $48.08<br />
              Adj monthly = gross × 0.70<br />
              Adj annual = adj monthly × 12<br /><br />
              <strong style={{ color: '#fff' }}>Schedule slippage mapping (Q1, 4 weeks per month):</strong><br />
              On time → 0 weeks<br />
              1 to 4 weeks → 3 weeks (midpoint)<br />
              1 to 3 months → 8 weeks (midpoint)<br />
              3 to 6 months → 18 weeks (midpoint)<br />
              6+ months → 24 weeks (conservative floor)<br /><br />
              <strong style={{ color: '#fff' }}>Efficiency rates used in cost model (Screen 4):</strong><br />
              {Object.entries(EFF_RATES).map(([k, v]) => (
                <span key={k}>
                  {BOTTLENECK_OPTIONS.find(b => b.key === k)?.label ?? k}: {Math.round(v * 100)}%
                  {EFF_RATE_IS_ESTIMATED[k as keyof typeof EFF_RATE_IS_ESTIMATED] && (
                    <span style={{ color: '#fbbf24' }}> — estimated, no primary source</span>
                  )}
                  <br />
                </span>
              ))}<br />
              <strong style={{ color: '#fff' }}>Sources:</strong><br />
              ESAC 2024 — Canada's Video Game Industry: Powering the Future of Play<br />
              ESAC/Nordicity 2021 (labour cost methodology, 937 studios surveyed)<br />
              Forrester TEI Methodology (30% risk adjustment)
            </p>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={onNext} style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '12px 28px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
          background: 'linear-gradient(hsl(0 0% 8%), hsl(0 0% 8%)) padding-box, linear-gradient(to right, #a78bfa, #c084fc, #e879a0) border-box',
          border: '1px solid transparent', color: '#fff',
        }}>
          See matched AI tools <ArrowRight style={{ width: '16px', height: '16px' }} />
        </button>
        <button onClick={onBack} style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          ← Back
        </button>
      </div>
    </div>
  )
}
