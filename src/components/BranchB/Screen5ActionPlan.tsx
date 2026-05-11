import { useNotionCapture } from '@/hooks/useNotionCapture'
import { useDiagnosis } from './DiagnosisContext'
import {
  BOTTLENECK_OPTIONS, TIER_MAP, COMPLEXITY, COMPLEXITY_LABELS,
  EFF_RATES, calcAdjAnnual, calcSaving, calcReturnMultiple,
  formatReturnMultiple, formatCurrencyAmount, calcPriorityScore,
  ACTION_PLAN_DATA, BottleneckKey,
} from './diagnosisData'
import { ArrowRight } from 'lucide-react'

const GRADIENT_TEXT: React.CSSProperties = {
  background: 'linear-gradient(90deg, #a78bfa, #c084fc, #e879a0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

interface Props { onBack: () => void }

export default function Screen5ActionPlan({ onBack }: Props) {
  const { capture } = useNotionCapture()
  const { state } = useDiagnosis()
  const { bottlenecks, teamSize, reworkPct, slipWks, outputType, currency } = state

  const adjAnnual = calcAdjAnnual(teamSize, reworkPct)
  const saving = calcSaving(teamSize, bottlenecks, reworkPct)
  const returnMultiple = calcReturnMultiple(teamSize, bottlenecks, reworkPct)
  const rmDisplay = formatReturnMultiple(returnMultiple)
  const tier = TIER_MAP[teamSize] ?? TIER_MAP['11 to 50']

  // Sort bottlenecks by priority score descending
  const sortedBottlenecks = [...bottlenecks].sort((a, b) => {
    const scoreA = calcPriorityScore(adjAnnual, a as BottleneckKey)
    const scoreB = calcPriorityScore(adjAnnual, b as BottleneckKey)
    return scoreB - scoreA
  })

  const phaseLabels = ['Day 1 to 30', 'Day 31 to 60', 'Day 61 to 90']

  function notionPayload(ctaLabel: string) {
    return {
      source: 'Pipeline Diagnosis — Bottleneck Finder',
      ctaLabel,
      teamSize,
      outputType: outputType.join(', '),
      bottlenecks: bottlenecks.join(', '),
      reworkPct: reworkPct + '%',
      slipWks: slipWks + ' weeks',
      adjAnnual: formatCurrencyAmount(adjAnnual, 'CAD'),
      estimatedSaving: formatCurrencyAmount(saving, 'CAD'),
      returnMultiple: rmDisplay,
      engagementTier: tier.name,
    }
  }

  const emailBody = `Pipeline Diagnosis — Action Plan\n\nTeam: ${teamSize}\nBottlenecks: ${sortedBottlenecks.map(k => BOTTLENECK_OPTIONS.find(b => b.key === k)?.label ?? k).join(', ')}\nRework overhead: ${reworkPct}%\nSchedule slippage: ${slipWks} weeks\n\nAnnual rework cost: ${formatCurrencyAmount(adjAnnual, 'CAD')}\nEstimated annual saving: ${formatCurrencyAmount(saving, 'CAD')}\nReturn multiple: ${rmDisplay}\nRecommended tier: ${tier.name}\n\nNext step: Book a 1:1 discovery call at calendly.com/youki-harada/30min\ntuliptechnology.ca`

  return (
    <div style={{ maxWidth: '680px', color: 'white', fontSize: '14px' }}>
      {/* Eyebrow */}
      <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', ...GRADIENT_TEXT }}>
        Pipeline Diagnosis — Bottleneck Finder
      </p>
      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
        Your pipeline recovery plan.
      </h2>
      <p style={{ fontSize: '14px', color: '#fff', marginBottom: '20px' }}>
        Bottlenecks ranked by estimated impact. A 30 / 60 / 90 day integration sequence to address each one.
      </p>

      {/* Context bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
        {outputType.map(t => (
          <span key={t} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{t}</span>
        ))}
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{teamSize}</span>
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{reworkPct}% rework</span>
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{slipWks} wk slip</span>
      </div>

      {/* Section 1 — Priority ranking */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
          Bottlenecks — ranked by estimated impact
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedBottlenecks.map((key, idx) => {
            const opt = BOTTLENECK_OPTIONS.find(b => b.key === key)
            const score = calcPriorityScore(adjAnnual, key as BottleneckKey)
            const effRate = EFF_RATES[key as BottleneckKey] ?? 0.20
            const complexity = COMPLEXITY[key as BottleneckKey] ?? 2
            const complexityLabel = COMPLEXITY_LABELS[complexity]
            const rankLabel = idx === 0 ? 'Address first' : idx === 1 ? 'Address second' : 'Address third'
            const isFirst = idx === 0

            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
                padding: '14px 16px', borderRadius: '12px',
                border: isFirst ? '0.5px solid rgba(167,139,250,0.55)' : '0.5px solid rgba(255,255,255,0.1)',
                background: isFirst ? 'rgba(167,139,250,0.04)' : 'rgba(255,255,255,0.01)',
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700,
                    background: isFirst ? 'linear-gradient(135deg, #a78bfa, #e9d5ff)' : 'transparent',
                    border: isFirst ? 'none' : '0.5px solid rgba(255,255,255,0.2)',
                    color: isFirst ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: isFirst ? 700 : 600, color: '#fff', marginBottom: '4px' }}>
                      {opt?.label ?? key}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                      Priority score: {formatCurrencyAmount(score, 'CAD')} · Eff rate {Math.round(effRate * 100)}% · {complexityLabel} implementation complexity
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: isFirst ? '#c4b5fd' : 'rgba(255,255,255,0.4)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {rankLabel}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 2 — 30/60/90 table */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
          30 / 60 / 90 day integration sequence
        </p>
        <div style={{ borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr', background: 'rgba(255,255,255,0.03)', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
            {['Phase', 'Bottleneck', 'Action'].map(h => (
              <div key={h} style={{ padding: '10px 14px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>
                {h}
              </div>
            ))}
          </div>
          {/* Table rows */}
          {sortedBottlenecks.map((key, idx) => {
            const opt = BOTTLENECK_OPTIONS.find(b => b.key === key)
            const plan = ACTION_PLAN_DATA[key as BottleneckKey]
            const phase = phaseLabels[idx]
            if (!phase || !plan) return null
            return (
              <div key={key} style={{
                display: 'grid', gridTemplateColumns: '130px 1fr 1fr',
                borderBottom: idx < sortedBottlenecks.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ padding: '14px', borderRight: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#c4b5fd', lineHeight: 1.4 }}>{phase}</span>
                </div>
                <div style={{ padding: '14px', borderRight: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '12px', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>{opt?.label ?? key}</p>
                </div>
                <div style={{ padding: '14px' }}>
                  <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.6, marginBottom: '6px' }}>{plan.d30.action}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>Target: {plan.d30.target}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 3 — Engagement card */}
      <div style={{ padding: '20px', borderRadius: '12px', border: '0.5px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.04)', marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Tulip Tech R&D Lab</p>
        <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>{tier.name} engagement</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Engagement range</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{tier.range}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>What is covered</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
              {sortedBottlenecks.map(k => BOTTLENECK_OPTIONS.find(b => b.key === k)?.label ?? k).join(' · ')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Estimated return</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{formatCurrencyAmount(saving, 'CAD')} saving vs {formatCurrencyAmount(tier.mid, 'CAD')} investment</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>First step</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>1:1 discovery call to validate scope and timeline</span>
          </div>
        </div>
      </div>

      {/* Section 4 — CTAs */}
      <div style={{ padding: '20px', borderRadius: '12px', border: '0.5px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.03)', marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
          Ready to start?
        </p>
        <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.65, marginBottom: '16px' }}>
          Book a 1:1 discovery call with Tulip Tech R&D Lab to validate this plan against your actual pipeline, confirm scope, and align on timeline before any commitment.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              capture(notionPayload('Book Discovery Call'))
              window.open('https://calendly.com/youki-harada/30min', '_blank')
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              background: 'linear-gradient(hsl(0 0% 8%), hsl(0 0% 8%)) padding-box, linear-gradient(to right, #a78bfa, #c084fc, #e879a0) border-box',
              border: '1px solid transparent', color: '#fff',
            }}>
            Book Discovery Call <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
          <button
            onClick={() => {
              capture(notionPayload('Email Results'))
              window.location.href = `mailto:?subject=${encodeURIComponent('Tulip Tech Pipeline Diagnosis — Action Plan')}&body=${encodeURIComponent(emailBody)}`
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 22px', borderRadius: '99px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              border: '0.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff',
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Email Results
          </button>
          <button
            onClick={() => {
              capture(notionPayload('30 Min Validate Meeting'))
              window.open('https://calendly.com/youki-harada/30min', '_blank')
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 22px', borderRadius: '99px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              border: '0.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff',
            }}>
            30 Min Validate Meeting <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '16px' }}>
        The figures shown here do not constitute an offer, guarantee, or legally binding commitment within the meaning of the Dutch Civil Code (Burgerlijk Wetboek), and may not be relied upon as such. Tulip Tech R&D Lab accepts no liability for decisions made solely on the basis of these estimates.
      </p>

      <button onClick={onBack} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Back to Cost
      </button>
    </div>
  )
}
