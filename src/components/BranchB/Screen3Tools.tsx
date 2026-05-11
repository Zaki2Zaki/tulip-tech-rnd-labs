import { useState } from 'react'
import { useDiagnosis } from './DiagnosisContext'
import {
  OUTPUT_TYPE_LABELS, OUTPUT_TYPE_KEY_MAP, BOTTLENECK_OPTIONS,
  TOOL_CARD_DATA, ASSET_CARD_BY_OUTPUT, buildToolCards,
  getSeverityBadge, ToolCardData, ToolPill,
} from './diagnosisData'
import { ArrowRight } from 'lucide-react'

const GRADIENT_TEXT: React.CSSProperties = {
  background: 'linear-gradient(90deg, #a78bfa, #c084fc, #e879a0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

function ToolPillItem({ tool }: { tool: ToolPill }) {
  if (tool.isNew) {
    return (
      <span style={{
        padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 500,
        border: '0.5px solid rgba(29,158,117,0.3)', background: 'rgba(29,158,117,0.06)', color: '#5DCAA5',
      }}>
        {tool.label} ✦
      </span>
    )
  }
  return (
    <span style={{
      padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 500,
      border: '0.5px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.05)', color: '#c4b5fd',
    }}>
      {tool.label}
    </span>
  )
}

interface Props { onNext: () => void; onBack: () => void }

export default function Screen3Tools({ onNext, onBack }: Props) {
  const { state } = useDiagnosis()
  const { bottlenecks, reworkPct, slipWks, outputType, teamSize } = state

  // Local output type switcher (defaults to first from Screen 1, or 'Games')
  const defaultOutputLabel = outputType[0] ?? 'Games'
  const [activeOutputLabel, setActiveOutputLabel] = useState(defaultOutputLabel)

  const activeOutputKey = OUTPUT_TYPE_KEY_MAP[activeOutputLabel] ?? 'games'
  const severity = getSeverityBadge(reworkPct, slipWks)

  const cards = buildToolCards(bottlenecks, reworkPct)

  function getCardData(key: string, isContextual: boolean): ToolCardData & { isContextual: boolean } {
    let data: ToolCardData
    if (key === 'asset') {
      data = ASSET_CARD_BY_OUTPUT[activeOutputKey]
    } else {
      data = TOOL_CARD_DATA[key as keyof typeof TOOL_CARD_DATA]
    }
    const qaBase = TOOL_CARD_DATA['qa']
    if (isContextual && key === 'qa') {
      return {
        ...qaBase,
        eyebrow: 'Contextual addition — based on severity signal',
        isContextual: true,
      }
    }
    return { ...data, isContextual }
  }

  return (
    <div style={{ maxWidth: '680px', color: 'white', fontSize: '14px' }}>
      {/* Eyebrow */}
      <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', ...GRADIENT_TEXT }}>
        Pipeline Diagnosis — Bottleneck Finder
      </p>
      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
        AI integrations mapped to your bottlenecks.
      </h2>
      <p style={{ fontSize: '14px', color: '#fff', marginBottom: '16px' }}>
        One card per selected pain point. Ranked by estimated impact based on your severity signal.
      </p>

      {/* Context bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {state.outputType.map(t => (
          <span key={t} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{t}</span>
        ))}
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{teamSize}</span>
        {bottlenecks.map(key => {
          const opt = BOTTLENECK_OPTIONS.find(b => b.key === key)
          return opt ? (
            <span key={key} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{opt.label}</span>
          ) : null
        })}
        {/* Severity badge */}
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, border: `0.5px solid ${severity.border}`, background: severity.bg, color: severity.color }}>
          {severity.icon} {severity.label}
        </span>
      </div>

      {/* Output type switcher */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '24px', alignSelf: 'flex-start', width: 'fit-content' }}>
        {OUTPUT_TYPE_LABELS.map(label => {
          const active = activeOutputLabel === label
          return (
            <button key={label} onClick={() => setActiveOutputLabel(label)}
              style={{
                padding: '7px 16px', fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer',
                background: active ? 'rgba(167,139,250,0.12)' : 'transparent',
                borderRight: '0.5px solid rgba(255,255,255,0.08)', border: 'none',
                color: active ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s',
              }}>
              {label}
            </button>
          )
        })}
      </div>

      {/* Tool cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        {cards.map(({ key, isContextual }, idx) => {
          const card = getCardData(key, isContextual)

          // Badge
          let badgeLabel: string, badgeBg: string, badgeBorder: string, badgeColor: string
          if (isContextual) {
            badgeLabel = 'Contextual'; badgeColor = 'rgba(255,255,255,0.5)'
            badgeBg = 'rgba(255,255,255,0.05)'; badgeBorder = 'rgba(255,255,255,0.12)'
          } else if (reworkPct >= 40 || slipWks >= 18) {
            badgeLabel = '⚠ Critical'; badgeColor = '#fc8181'
            badgeBg = 'rgba(220,38,38,0.12)'; badgeBorder = 'rgba(220,38,38,0.3)'
          } else if (reworkPct >= 15 || slipWks >= 3) {
            badgeLabel = '⚡ High impact'; badgeColor = '#e879a0'
            badgeBg = 'rgba(232,121,160,0.10)'; badgeBorder = 'rgba(232,121,160,0.3)'
          } else {
            badgeLabel = 'Recommended'; badgeColor = '#a78bfa'
            badgeBg = 'rgba(167,139,250,0.10)'; badgeBorder = 'rgba(167,139,250,0.25)'
          }

          return (
            <div key={`${key}-${idx}`} style={{
              padding: '20px', borderRadius: '12px',
              border: '0.5px solid rgba(167,139,250,0.55)',
              background: 'rgba(167,139,250,0.03)',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)' }}>
                  {card.eyebrow}
                </p>
                <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, flexShrink: 0, border: `0.5px solid ${badgeBorder}`, background: badgeBg, color: badgeColor }}>
                  {badgeLabel}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '10px', lineHeight: 1.35 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.65, marginBottom: '14px' }}>
                {card.desc}
              </p>

              {/* Tools */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {card.tools.map(t => <ToolPillItem key={t.label} tool={t} />)}
              </div>

              {/* Stat */}
              <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.6, marginBottom: '6px', fontStyle: 'italic' }}>
                {card.stat}
              </p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                {card.legal}
              </p>
            </div>
          )
        })}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={onNext} style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '12px 28px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
          background: 'linear-gradient(hsl(0 0% 8%), hsl(0 0% 8%)) padding-box, linear-gradient(to right, #a78bfa, #c084fc, #e879a0) border-box',
          border: '1px solid transparent', color: '#fff',
        }}>
          See recovery cost estimate <ArrowRight style={{ width: '16px', height: '16px' }} />
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
