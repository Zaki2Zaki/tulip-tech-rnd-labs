import { useState } from 'react'
import { useNotionCapture } from '@/hooks/useNotionCapture'
import { useDiagnosis } from './DiagnosisContext'
import {
  BOTTLENECK_OPTIONS, TIER_MAP, CURRENCY_SYMBOLS,
  calcAdjAnnual, calcSaving, calcReturnMultiple, formatReturnMultiple,
  formatCurrencyAmount, EFF_RATES, EFF_RATE_IS_ESTIMATED,
  CURRENCY_RATES,
} from './diagnosisData'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

const GRADIENT_TEXT: React.CSSProperties = {
  background: 'linear-gradient(90deg, #a78bfa, #c084fc, #e879a0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

interface Props { onNext: () => void; onBack: () => void }

export default function Screen4Cost({ onNext, onBack }: Props) {
  const { capture } = useNotionCapture()
  const { state } = useDiagnosis()
  const { bottlenecks, teamSize, reworkPct, slipWks, outputType, roundsLabel, currency } = state
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const adjAnnual = calcAdjAnnual(teamSize, reworkPct)
  const saving = calcSaving(teamSize, bottlenecks, reworkPct)
  const returnMultiple = calcReturnMultiple(teamSize, bottlenecks, reworkPct)
  const rmDisplay = formatReturnMultiple(returnMultiple)
  const tier = TIER_MAP[teamSize] ?? TIER_MAP['11 to 50']
  const sym = CURRENCY_SYMBOLS[currency]
  const rate = CURRENCY_RATES[currency]
  const approxLabel = currency !== 'CAD' ? ' (Approx.)' : ''

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

  const emailBody = `Pipeline Diagnosis — Bottleneck Finder Results\n\nTeam: ${teamSize}\nBottlenecks: ${bottlenecks.join(', ')}\nRework overhead: ${reworkPct}%\nSchedule slippage: ${slipWks} weeks\n\nAnnual rework cost: ${formatCurrencyAmount(adjAnnual, 'CAD')}\nEstimated annual saving: ${formatCurrencyAmount(saving, 'CAD')}\nReturn multiple: ${rmDisplay}\nRecommended tier: ${tier.name} (${tier.range})\n\ntuliptechnology.ca`

  return (
    <div style={{ maxWidth: '680px', color: 'white', fontSize: '14px' }}>
      {/* Eyebrow */}
      <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', ...GRADIENT_TEXT }}>
        Pipeline Diagnosis — Bottleneck Finder
      </p>
      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
        What this is worth at your scale.
      </h2>
      <p style={{ fontSize: '14px', color: '#fff', marginBottom: '16px' }}>
        Your current rework cost versus estimated recovery with AI integration — and what a Tulip Tech R&D Lab engagement delivers.
      </p>

      {/* Context bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {outputType.map(t => (
          <span key={t} style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{t}</span>
        ))}
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{teamSize}</span>
        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{reworkPct}% rework</span>
        {slipWks > 0 && <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, border: '0.5px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.07)', color: '#c4b5fd' }}>{slipWks} wk slip</span>}
      </div>

      {/* Currency toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginBottom: '10px' }}>
        {(['CAD', 'USD', 'EUR'] as const).map(c => (
          <button key={c} onClick={() => state}
            style={{
              padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              border: currency === c ? '0.5px solid rgba(167,139,250,0.55)' : '0.5px solid rgba(255,255,255,0.12)',
              background: currency === c ? 'rgba(167,139,250,0.10)' : 'transparent',
              color: currency === c ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Disclaimer bar */}
      <div style={{ padding: '16px 20px', borderRadius: '12px', border: '0.5px solid rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.05)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠</span>
          <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.7 }}>
            The figures shown here do not constitute an offer, guarantee, or legally binding commitment within the meaning of the Dutch Civil Code (Burgerlijk Wetboek), and may not be relied upon as such. Actual results depend on your specific pipeline structure, team composition, and adoption pace. Tulip Tech R&D Lab accepts no liability for decisions made solely on the basis of these estimates. We recommend a{' '}
            <a href="https://calendly.com/youki-harada/30min" target="_blank" rel="noopener noreferrer" style={{ color: '#c4b5fd', textDecoration: 'underline' }}>
              1:1 discovery call
            </a>
            {' '}before making any business or financial commitment.
          </p>
        </div>
        <div style={{ borderTop: '0.5px solid rgba(251,191,36,0.4)', margin: '12px 0' }} />
        <p style={{ fontSize: '10px', color: 'rgba(251,191,36,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Nederlands</p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
          De op dit scherm weergegeven cijfers zijn indicatieve schattingen, gebaseerd op gepubliceerde sectorgemiddelden en op eigen onderzoek van Tulip Tech R&D Lab. Deze cijfers vormen geen aanbod, garantie of toezegging in de zin van het Burgerlijk Wetboek, en kunnen niet als zodanig worden ingeroepen. Werkelijke resultaten zijn afhankelijk van uw specifieke pipelinestructuur, teamsamenstelling en adoptietempo. Tulip Tech R&D Lab aanvaardt geen aansprakelijkheid voor beslissingen die uitsluitend op basis van deze schattingen worden genomen. Wij adviseren u deze cijfers te verifiëren in een persoonlijk gesprek voordat u zakelijke of financiële beslissingen neemt.
        </p>
      </div>

      {/* 4 Metric cards 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {/* Card 1 — Annual rework cost */}
        <div style={{ padding: '18px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Annual rework cost</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>{sym} / yr{approxLabel}</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{formatCurrencyAmount(adjAnnual, currency)}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>What your current rework overhead costs annually before any AI integration</p>
        </div>

        {/* Card 2 — Estimated annual saving (highlighted) */}
        <div style={{ padding: '18px', borderRadius: '12px', border: '0.5px solid rgba(167,139,250,0.35)', background: 'rgba(167,139,250,0.06)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Estimated annual saving</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>{sym} / yr{approxLabel}</p>
          <p style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px', ...GRADIENT_TEXT }}>{formatCurrencyAmount(saving, currency)}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Estimated recovery with AI integration applied to your selected bottlenecks</p>
        </div>

        {/* Card 3 — Return multiple (highlighted) */}
        <div style={{ padding: '18px', borderRadius: '12px', border: '0.5px solid rgba(167,139,250,0.35)', background: 'rgba(167,139,250,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Return multiple</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>× engagement cost</p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px', ...GRADIENT_TEXT }}>{rmDisplay}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Estimated annual saving divided by engagement investment midpoint</p>
        </div>

        {/* Card 4 — Rework overhead */}
        <div style={{ padding: '18px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rework overhead</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>% of team time</p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{reworkPct}%</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Portion of team capacity currently consumed by rework and revision cycles</p>
        </div>
      </div>

      {/* Engagement card */}
      <div style={{ padding: '20px', borderRadius: '12px', border: '0.5px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.04)', marginBottom: '16px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Recommended engagement</p>
        <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>{tier.name}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Engagement range</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{formatCurrencyAmount(+tier.range.replace(/[^0-9]/g, '') || 45000, currency)} – {tier.range}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Typical midpoint</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{formatCurrencyAmount(tier.mid, currency)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Saving vs investment</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{formatCurrencyAmount(saving, currency)} saving vs {formatCurrencyAmount(tier.mid, currency)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Bottlenecks in scope</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
              {bottlenecks.map(k => BOTTLENECK_OPTIONS.find(b => b.key === k)?.label ?? k).join(' · ')}
            </span>
          </div>
        </div>
      </div>

      {/* Methodology dropdown */}
      <div style={{ borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', marginBottom: '24px', overflow: 'hidden' }}>
        <button
          onClick={() => setMethodologyOpen(o => !o)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#fff' }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Methodology — How these figures are calculated
          </span>
          {methodologyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {methodologyOpen && (
          <div style={{ padding: '0 16px 16px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, paddingTop: '12px' }}>
              <strong style={{ color: '#fff' }}>Adj annual cost (Card 1):</strong><br />
              adjAnnual = Math.round(teamMid × 160 × (reworkPct/100)) × ($100,000/2,080) × 0.70 × 12<br /><br />
              <strong style={{ color: '#fff' }}>Gross annual (no risk adjustment — used in saving calc to avoid double-discount):</strong><br />
              grossAnnual = teamMid × 160 × (reworkPct/100) × ($100,000/2,080) × 12<br /><br />
              <strong style={{ color: '#fff' }}>Average efficiency rate:</strong><br />
              avgEffRate = average of EFF_RATES for selected bottlenecks<br /><br />
              <strong style={{ color: '#fff' }}>Estimated saving (Card 2):</strong><br />
              saving = grossAnnual × avgEffRate × 0.70 (Forrester risk adjustment)<br /><br />
              <strong style={{ color: '#fff' }}>Return multiple (Card 3):</strong><br />
              returnMultiple = saving / engagement midpoint<br /><br />
              <strong style={{ color: '#fff' }}>Efficiency rates per bottleneck:</strong><br />
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
              Forrester TEI Methodology (30% risk adjustment)<br />
              a16z Games AI Developer Survey 2024 (review: 38%)<br />
              Juego Studios Game Development Costs 2026 (asset: 30%, rigging: 35%)<br />
              GDC State of the Game Industry 2025 (QA: 33%)
            </p>
          </div>
        )}
      </div>

      {/* CTA section */}
      <div style={{ padding: '20px', borderRadius: '12px', border: '0.5px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.03)', marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
          Recommended next step
        </p>
        <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.65, marginBottom: '16px' }}>
          Based on your studio size and bottleneck profile, a Tulip Tech R&D Lab engagement would cover your top pain points — with an estimated return of <strong>{rmDisplay}</strong> in year one. Book a 1:1 discovery call to validate these estimates against your actual pipeline before committing.
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
              window.location.href = `mailto:?subject=${encodeURIComponent('Tulip Tech Pipeline Diagnosis Results')}&body=${encodeURIComponent(emailBody)}`
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
            onClick={onNext}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 22px', borderRadius: '99px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              border: '0.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff',
            }}>
            See Action Plan <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      <button onClick={onBack} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Back to Tools
      </button>
    </div>
  )
}
