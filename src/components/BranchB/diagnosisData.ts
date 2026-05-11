// Branch B — Pipeline Diagnosis: shared constants, types, and calculation helpers

export type BottleneckKey =
  | 'review' | 'asset' | 'qa' | 'rigging'
  | 'pipeline' | 'outsource' | 'concept' | 'delivery'

export type OutputTypeKey = 'games' | 'animation' | 'vfx' | 'other'
export type Currency = 'CAD' | 'USD' | 'EUR'

// ─── Output types ──────────────────────────────────────────────────────────────

export const OUTPUT_TYPE_LABELS = ['Games', '3D Animation', 'VFX', 'Other']

export const OUTPUT_TYPE_KEY_MAP: Record<string, OutputTypeKey> = {
  'Games': 'games',
  '3D Animation': 'animation',
  'VFX': 'vfx',
  'Other': 'other',
}

// ─── Team sizes ────────────────────────────────────────────────────────────────

export const TEAM_SIZE_OPTIONS: { label: string; mid: number }[] = [
  { label: '1 to 10',   mid: Math.round((1 + 10) / 2) },   // 6
  { label: '11 to 50',  mid: Math.round((11 + 50) / 2) },  // 31
  { label: '51 to 200', mid: Math.round((51 + 200) / 2) }, // 126
  { label: '200+',      mid: 300 },
]

// ─── Engagement tiers ──────────────────────────────────────────────────────────

export const TIER_MAP: Record<string, { name: string; range: string; mid: number }> = {
  '1 to 10':   { name: 'Starter',    range: '$15K – $45K',   mid: 30000 },
  '11 to 50':  { name: 'Studio',     range: '$45K – $165K',  mid: 105000 },
  '51 to 200': { name: 'Enterprise', range: '$165K – $395K', mid: 280000 },
  '200+':      { name: 'Enterprise', range: '$165K – $395K', mid: 280000 },
}

// ─── Bottleneck options ────────────────────────────────────────────────────────

export interface BottleneckOption {
  key: BottleneckKey
  label: string
  sub?: string
}

export const BOTTLENECK_OPTIONS: BottleneckOption[] = [
  { key: 'review',   label: 'Review and revision cycles' },
  { key: 'asset',    label: 'Asset creation and modeling' },
  { key: 'pipeline', label: 'Pipeline development or operation workflows', sub: 'Work stalling between art, tech, QA & QC, bug, and production' },
  { key: 'qa',       label: 'QA and testing' },
  { key: 'concept',  label: 'Concept and pre-production, production, post-production, beta or alpha release' },
  { key: 'outsource',label: 'Outsource coordination' },
  { key: 'rigging',  label: 'Rigging and animation' },
  { key: 'delivery', label: 'Final output and delivery' },
]

// ─── Slip week options ─────────────────────────────────────────────────────────

export const SLIP_OPTIONS: { label: string; weeks: number; display: string }[] = [
  { label: 'On time',        weeks: 0,  display: 'On schedule' },
  { label: '1 to 4 weeks',   weeks: Math.round((1 + 4) / 2),   display: '~3 weeks avg' },
  { label: '1 to 3 months',  weeks: Math.round((4 + 12) / 2),  display: '~8 weeks avg' },
  { label: '3 to 6 months',  weeks: Math.round((12 + 24) / 2), display: '~18 weeks avg' },
  { label: '6+ months',      weeks: 24, display: '~24 weeks avg' },
]

// ─── Revision rounds options ───────────────────────────────────────────────────

export const ROUNDS_OPTIONS: { label: string; rework: number }[] = [
  { label: '1 to 2 rounds',  rework: 10 },
  { label: '3 to 5 rounds',  rework: 25 },
  { label: '6 to 10 rounds', rework: 40 },
  { label: '10+ rounds',     rework: 60 },
]

// ─── Efficiency rates (Screen 3 & 4) ──────────────────────────────────────────

export const EFF_RATES: Record<BottleneckKey, number> = {
  review:    0.38,
  asset:     0.30,
  qa:        0.33,
  rigging:   0.35,
  pipeline:  0.20,
  outsource: 0.25,
  concept:   0.20,
  delivery:  0.20,
}

export const EFF_RATE_SOURCE: Record<BottleneckKey, string> = {
  review:    'a16z 2024',
  asset:     'Juego Studios 2026',
  qa:        'GDC 2025',
  rigging:   'Juego Studios 2026',
  pipeline:  'estimated — no primary source',
  outsource: 'estimated — no primary source',
  concept:   'estimated',
  delivery:  'estimated',
}

export const EFF_RATE_IS_ESTIMATED: Record<BottleneckKey, boolean> = {
  review: false, asset: false, qa: false, rigging: false,
  pipeline: true, outsource: true, concept: true, delivery: true,
}

// ─── Implementation complexity ─────────────────────────────────────────────────

export const COMPLEXITY: Record<BottleneckKey, number> = {
  review: 1, asset: 2, qa: 2, rigging: 3,
  pipeline: 2, outsource: 1, concept: 2, delivery: 2,
}

export const COMPLEXITY_LABELS: Record<number, string> = {
  1: 'Low', 2: 'Medium', 3: 'High',
}

// ─── Currency ──────────────────────────────────────────────────────────────────

export const CURRENCY_RATES: Record<Currency, number> = { CAD: 1, USD: 0.74, EUR: 0.68 }
export const CURRENCY_SYMBOLS: Record<Currency, string> = { CAD: 'CA$', USD: '$', EUR: '€' }

// ─── Calculation helpers ───────────────────────────────────────────────────────

const HOURLY = 100000 / 2080 // CA$48.0769/hr (ESAC 2024)

export function getTeamMid(teamSize: string): number {
  return TEAM_SIZE_OPTIONS.find(t => t.label === teamSize)?.mid ?? 31
}

export function calcHoursLost(teamSize: string, reworkPct: number): number {
  return Math.round(getTeamMid(teamSize) * 160 * (reworkPct / 100))
}

export function calcAdjMonthly(teamSize: string, reworkPct: number): number {
  return calcHoursLost(teamSize, reworkPct) * HOURLY * 0.70
}

export function calcAdjAnnual(teamSize: string, reworkPct: number): number {
  return calcAdjMonthly(teamSize, reworkPct) * 12
}

export function calcGrossAnnual(teamSize: string, reworkPct: number): number {
  return getTeamMid(teamSize) * 160 * (reworkPct / 100) * HOURLY * 12
}

export function calcAvgEffRate(bottlenecks: string[]): number {
  if (bottlenecks.length === 0) return 0
  const sum = bottlenecks.reduce((acc, k) => acc + (EFF_RATES[k as BottleneckKey] ?? 0.20), 0)
  return sum / bottlenecks.length
}

export function calcSaving(teamSize: string, bottlenecks: string[], reworkPct: number): number {
  if (bottlenecks.length === 0) return 0
  return calcGrossAnnual(teamSize, reworkPct) * calcAvgEffRate(bottlenecks) * 0.70
}

export function calcReturnMultiple(teamSize: string, bottlenecks: string[], reworkPct: number): number {
  const tier = TIER_MAP[teamSize]
  if (!tier || tier.mid === 0) return 0
  return calcSaving(teamSize, bottlenecks, reworkPct) / tier.mid
}

export function formatReturnMultiple(multiple: number): string {
  if (multiple > 20) return '20x+'
  return multiple.toFixed(1) + 'x'
}

export function formatLargeNumber(amount: number, sym: string): string {
  if (amount >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${sym}${Math.round(amount / 1_000)}K`
  return `${sym}${Math.round(amount).toLocaleString()}`
}

export function formatCurrencyAmount(amountCAD: number, currency: Currency): string {
  return formatLargeNumber(amountCAD * CURRENCY_RATES[currency], CURRENCY_SYMBOLS[currency])
}

export function calcPriorityScore(adjAnnual: number, key: BottleneckKey): number {
  return (adjAnnual * EFF_RATES[key]) / COMPLEXITY[key]
}

// ─── Severity ──────────────────────────────────────────────────────────────────

export interface SeverityBadge {
  label: string; icon: string; color: string
  bg: string; border: string; barBg: string
}

export function getSeverityBadge(reworkPct: number, slipWks: number): SeverityBadge {
  if (reworkPct >= 40 || slipWks >= 18) {
    return { label: 'Critical', icon: '⚠', color: '#fc8181',
      bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.3)', barBg: 'rgba(220,38,38,0.10)' }
  }
  if (reworkPct >= 15 || slipWks >= 3) {
    return { label: 'High severity signal', icon: '⚡', color: '#e879a0',
      bg: 'rgba(232,121,160,0.10)', border: 'rgba(232,121,160,0.3)', barBg: 'rgba(167,139,250,0.12)' }
  }
  return { label: 'Recommended focus area', icon: '→', color: '#a78bfa',
    bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.25)', barBg: 'rgba(167,139,250,0.07)' }
}

export function getSeverityText(reworkPct: number, slipWks: number, roundsLabel: string): string {
  const months = slipWks >= 4 ? Math.round(slipWks / 4) : null
  const slipDesc = slipWks === 0
    ? 'on schedule'
    : slipWks < 4
      ? `${slipWks} week${slipWks > 1 ? 's' : ''} over schedule`
      : `around ${months} month${months !== 1 ? 's' : ''} over schedule`

  if (reworkPct >= 40 || slipWks >= 18) {
    if (reworkPct >= 40) {
      return `With ${roundsLabel.toLowerCase()} before sign-off, your team is spending an estimated ${reworkPct}% of its capacity on rework. At this level, revision overhead alone is likely a primary driver of cost overruns.`
    }
    return `Your studio is running ${slipDesc}. At this level, schedule slippage is likely compounding across every production phase.`
  }
  if (reworkPct >= 15 || slipWks >= 3) {
    return `Your studio is running ${slipDesc} with ${reworkPct}% rework overhead. This combination suggests revision cycles are contributing directly to schedule slippage — not just adding cost in isolation.`
  }
  return `With ${reworkPct}% rework overhead and current schedule performance, this area represents a manageable optimization opportunity. Addressing it early can prevent it from escalating as projects scale.`
}

// ─── Screen 3: card building logic ────────────────────────────────────────────

export function buildToolCards(
  bottlenecks: string[],
  reworkPct: number,
): { key: string; isContextual: boolean }[] {
  const capped = bottlenecks.slice(0, 3)
  let cards: { key: string; isContextual: boolean }[] = capped.map(k => ({ key: k, isContextual: false }))

  // Promote 'review' to position 0
  const ri = cards.findIndex(c => c.key === 'review')
  if (ri > 0) {
    const [r] = cards.splice(ri, 1)
    cards.unshift(r)
  }

  // Add contextual QA card if: reworkPct >= 40 AND qa not selected AND < 3 cards
  if (reworkPct >= 40 && !capped.includes('qa') && cards.length < 3) {
    cards.push({ key: 'qa', isContextual: true })
  }

  return cards
}

// ─── Tool pill type ────────────────────────────────────────────────────────────

export interface ToolPill { label: string; isNew?: boolean }

function p(label: string, isNew?: boolean): ToolPill {
  return { label, isNew }
}

// ─── Tool card data ────────────────────────────────────────────────────────────

export interface ToolCardData {
  eyebrow: string; title: string; desc: string
  tools: ToolPill[]; stat: string; legal: string
}

export const ASSET_CARD_BY_OUTPUT: Record<OutputTypeKey, ToolCardData> = {
  games: {
    eyebrow: 'Your bottleneck → Asset creation and modeling',
    title: 'AI-assisted concept art, texturing, and 3D asset generation',
    desc: 'AI generation tools can reduce labour hours on texturing and rigging specifically. Studios train custom models on their art bible to maintain style consistency. Tripo AI covers the full 3D pipeline — modeling, texturing, retopology, and rigging — from a single text or image prompt.',
    tools: [p('Scenario.gg'), p('Leonardo.AI'), p('Adobe Firefly'), p('Layer.ai'), p('Midjourney'), p('Tripo AI', true), p('Promethean AI', true)],
    stat: 'Estimated 30 to 40% reduction in labour hours on texturing and rigging specifically with AI tooling. Tripo AI reports up to 50% faster completion of the full 3D pipeline per vendor benchmarks.',
    legal: 'Sources: Juego Studios — Game Development Costs 2026 · Tripo AI vendor benchmarks 2025 (self-reported). Midjourney commercial use requires Pro plan ($96/month) for studios over $1M revenue. Verify all licensing before production use.',
  },
  animation: {
    eyebrow: 'Your bottleneck → Asset creation and modeling',
    title: 'AI-assisted animation generation, compositing, and character integration',
    desc: 'AI tools accelerate pre-production animatics, concept passes, and CG character compositing. Wonder Studio automatically animates, lights, and composites CG characters into live-action or animated plates. Kling AI reports up to 60% cost reduction for explainer and short-form animation workflows per published data.',
    tools: [p('Adobe Firefly'), p('Runway'), p('Pika Labs'), p('Wonder Studio', true), p('Kling AI', true)],
    stat: 'Kling AI reports up to 60% cost reduction for explainer and short-form animation workflows per published data. Wonder Studio automates the most labour-intensive compositing tasks for CG character integration.',
    legal: 'Sources: Kling AI official published data 2025 via Darvideo industry report · Autodesk (Wonder Studio acquisition). Kling data applies to explainer and short-form animation. Results vary by project type.',
  },
  vfx: {
    eyebrow: 'Your bottleneck → Asset creation and modeling',
    title: 'AI-assisted compositing, upscaling, motion capture, and plate cleanup',
    desc: 'AI tools address the most time-intensive VFX tasks — rotoscoping, object removal, upscaling, and markerless motion capture. Runway is confirmed as the most widely adopted AI tool in professional VFX workflows. Move.ai removes the need for expensive mocap suits by generating accurate 3D motion data from standard video.',
    tools: [p('Adobe Firefly'), p('Runway'), p('Topaz Video AI'), p('DaVinci Resolve AI'), p('Move.ai', true), p('Wonder Studio', true)],
    stat: "Runway is cited as 'overall leader in AI video' for VFX workflows (ActionVFX 2026). Topaz Video AI is the go-to tool for post-production upscaling and frame interpolation in professional VFX finishing.",
    legal: 'Sources: ActionVFX — Top 10 AI Tools for VFX Workflows 2026. Tool effectiveness varies by shot type, resolution requirements, and DCC software integration.',
  },
  other: {
    eyebrow: 'Your bottleneck → Asset creation and modeling',
    title: 'AI-assisted asset generation and production management',
    desc: 'For IT, agency, and studio teams outside games, animation, and VFX — AI generation tools provide the fastest entry point with the clearest commercial licensing and lowest integration overhead.',
    tools: [p('Adobe Firefly'), p('Leonardo.AI'), p('Notion AI'), p('Ludo.ai', true)],
    stat: 'Adobe Firefly offers the clearest commercial licensing for enterprise teams concerned about IP. Leonardo.AI provides the strongest free tier — 150 tokens per day — for evaluation before committing to paid plans.',
    legal: 'Verify all commercial licensing terms before production use. Tool suitability depends on specific creative workflow and output requirements.',
  },
}

export const TOOL_CARD_DATA: Record<BottleneckKey, ToolCardData> = {
  review: {
    eyebrow: 'Your bottleneck → Review and revision cycles',
    title: 'Structured production review and approval pipelines',
    desc: 'AI-assisted review systems can help reduce ad-hoc revision loops by flagging common asset errors before they reach the art director. Purpose-built production management tools replace email threads and spreadsheet tracking with structured, accountable approval workflows.',
    tools: [p('Autodesk ShotGrid'), p('Ftrack'), p('Frame.io'), p('HacknPlan'), p('Ludo.ai', true), p('Notion AI', true)],
    stat: 'Studios using structured AI-integrated review pipelines report measurable productivity gains across revision-heavy production stages.',
    legal: 'Source: a16z Games AI Developer Survey 2024 — 651 developers surveyed. Results vary by pipeline structure and adoption rate.',
  },
  asset: ASSET_CARD_BY_OUTPUT.games,
  qa: {
    eyebrow: 'Your bottleneck → QA and testing',
    title: 'AI-driven automated test coverage',
    desc: 'AI-driven test automation handles repetitive regression testing — freeing QA teams to focus on exploratory testing and gameplay-specific edge cases that require human judgment.',
    tools: [p('modl.ai'), p('GameDriver'), p('Applitools')],
    stat: 'Studios using GameDriver report up to 60% reduction in manual test time on Unreal Engine build cycles. AI automation handles repetitive regression — human testers focus on what automation cannot evaluate.',
    legal: 'Source: GameDriver studio case data 2024. AI QA automation does not replace human testing for creative evaluation, emergent gameplay, or narrative bugs. Manual QA remains essential alongside automated coverage.',
  },
  rigging: {
    eyebrow: 'Your bottleneck → Rigging and animation',
    title: 'AI-assisted motion capture, rigging, and animation',
    desc: 'AI motion capture tools remove the need for expensive mocap suits — generating accurate 3D animation data from standard video footage. Auto-rigging tools reduce technical setup time for character pipelines.',
    tools: [p('DeepMotion'), p('Rokoko'), p('Cascadeur'), p('AccuRIG'), p('Adobe Mixamo'), p('Move.ai', true)],
    stat: 'AI markerless mocap tools allow studios to capture motion from standard video — eliminating suit rental costs and stage booking. Cascadeur 2025.1 integrates directly with Unreal Engine 4 and 5.',
    legal: 'Sources: ActionVFX 2026 · Cascadeur release notes 2025.1 · DeepMotion product documentation. AccuRIG requires Character Creator ecosystem. Results vary by character complexity.',
  },
  pipeline: {
    eyebrow: 'Your bottleneck → Pipeline development or operation workflows',
    title: 'AI-assisted project management and pipeline operations',
    desc: 'Structured project management tools with AI layers can reduce handoff friction, automate sprint planning, and surface pipeline blockers before they compound into delays.',
    tools: [p('Jira'), p('Linear'), p('HacknPlan'), p('Notion AI')],
    stat: 'Studios adopting structured pipeline management report reduced handoff friction and faster identification of blockers across production phases.',
    legal: 'Results vary by team structure, pipeline complexity, and adoption rate. These tools require configuration to match specific studio workflows before delivering measurable value.',
  },
  outsource: {
    eyebrow: 'Your bottleneck → Outsource coordination',
    title: 'AI-assisted vendor management and handoff workflows',
    desc: 'Structured outsource coordination tools reduce the time lost to unclear briefs, missed feedback loops, and asset handoff errors between internal teams and external vendors.',
    tools: [p('Ftrack'), p('ShotGrid'), p('Loom'), p('Notion AI')],
    stat: 'Purpose-built production management platforms provide audit trails, version tracking, and structured approval workflows that reduce outsource handoff errors.',
    legal: 'Source: Industry standard tools. Results depend on brief quality, vendor relationship maturity, and internal process adoption.',
  },
  concept: {
    eyebrow: 'Your bottleneck → Concept and pre/post production phases',
    title: 'AI-assisted concept development and production planning',
    desc: 'AI tools can accelerate concept art iteration, storyboarding, and pre-production planning — reducing the time between creative brief and production-ready assets.',
    tools: [p('Midjourney'), p('Scenario.gg'), p('ChatGPT'), p('Claude')],
    stat: 'Studios using AI tools in pre-production report faster concept iteration cycles and reduced time-to-brief-approval.',
    legal: 'Results vary by creative direction, team workflow, and adoption pace. AI-generated concepts require art direction review before production use.',
  },
  delivery: {
    eyebrow: 'Your bottleneck → Final output and delivery',
    title: 'AI-assisted output optimisation and delivery automation',
    desc: 'AI tools can accelerate final render optimisation, format conversion, and delivery packaging — reducing the manual overhead at the end of each production cycle.',
    tools: [p('Topaz Video AI'), p('NVIDIA Omniverse'), p('ElevenLabs'), p('Runway')],
    stat: 'AI upscaling and noise reduction tools reduce post-processing time on final render passes.',
    legal: 'Results vary by output format, resolution requirements, and delivery pipeline structure.',
  },
}

// ─── 30/60/90 action plan data ─────────────────────────────────────────────────

export interface PhaseData { action: string; target: string }
export interface ActionPlanEntry { d30: PhaseData; d60: PhaseData; d90: PhaseData }

export const ACTION_PLAN_DATA: Record<BottleneckKey, ActionPlanEntry> = {
  review: {
    d30: { action: 'Audit current review workflow. Select and configure production review platform — ShotGrid or Ftrack depending on team size and DCC stack.', target: 'First structured approval workflow in place by day 30' },
    d60: { action: 'Train team on structured review process. Define approval gates per asset type. Eliminate ad-hoc feedback loops from email and Slack.', target: '100% of assets flowing through structured review by day 60' },
    d90: { action: 'Measure revision cycle reduction. Compare round counts before and after structured review adoption.', target: 'Measurable reduction in revision rounds per asset' },
  },
  asset: {
    d30: { action: 'Select AI generation tool (Scenario.gg recommended for games). Run style training trial on 3 art bible assets to validate consistency before production use.', target: 'Style-consistent generation model trained and validated' },
    d60: { action: 'Integrate AI generation tools into texturing and environment layout stages. Senior artists focus on hero asset polish.', target: 'AI tooling active on at least one asset category' },
    d90: { action: 'Measure labour hours on texturing. Compare pre/post AI integration across equivalent asset sets.', target: 'Estimated 30% reduction in labour hours on texturing and rigging' },
  },
  qa: {
    d30: { action: 'Evaluate modl.ai or GameDriver for your engine (Unity or Unreal). Run a trial on one build pipeline.', target: 'Automated test suite running on one build by day 30' },
    d60: { action: 'Deploy automated regression suite. Configure for your specific game type and platform targets.', target: 'Regression automation covering at least 50% of manual test cases' },
    d90: { action: 'Measure manual QA time before and after automation. Identify remaining edge cases requiring human testing.', target: 'Measurable reduction in regression test hours' },
  },
  rigging: {
    d30: { action: 'Trial AccuRIG or Adobe Mixamo on a hero character rig. Compare time and quality against manual rigging baseline.', target: 'First auto-rigged character validated by art director' },
    d60: { action: 'Integrate AI rigging into character pipeline. Define which character types suit auto-rigging vs manual.', target: 'AI rigging active on supporting character pipeline' },
    d90: { action: 'Measure rigging time per character. Compare hero vs supporting character workflows.', target: 'Estimated 35% reduction in rigging time on supporting characters' },
  },
  pipeline: {
    d30: { action: 'Audit current pipeline tooling and handoff bottlenecks. Map where work stalls between teams.', target: 'Full pipeline map with identified stall points' },
    d60: { action: 'Deploy structured project management — Jira or Linear. Configure sprint tracking to match game production phases.', target: 'All active tasks tracked in structured system by day 60' },
    d90: { action: 'Measure sprint completion rate and handoff delays. Identify remaining friction between departments.', target: 'Measurable reduction in cross-team handoff delays' },
  },
  outsource: {
    d30: { action: 'Standardise brief templates. Set up Ftrack or Loom for structured vendor communication and feedback.', target: 'Standardised brief template in use for all vendor work' },
    d60: { action: 'Run first vendor cycle using structured handoff process. Collect feedback on clarity and revision rounds.', target: 'First structured vendor cycle completed with documented feedback' },
    d90: { action: 'Measure outsource revision rounds. Compare structured vs previous ad-hoc handoff quality.', target: 'Measurable reduction in outsource correction cycles' },
  },
  concept: {
    d30: { action: 'Trial Midjourney or Scenario.gg for concept art iteration. Run 3 concept passes for one upcoming asset.', target: 'First AI-assisted concept pass approved by creative lead' },
    d60: { action: 'Integrate AI concept tools into pre-production workflow. Define review criteria for AI-generated concepts.', target: 'AI concept iteration active on one project in pre-production' },
    d90: { action: 'Measure time-to-brief-approval for AI-assisted vs traditional concept passes.', target: 'Measurable reduction in concept iteration time' },
  },
  delivery: {
    d30: { action: 'Evaluate Topaz Video AI for post-processing on one recent render batch. Compare output quality and time.', target: 'First AI-upscaled render batch reviewed and approved' },
    d60: { action: 'Integrate AI post-processing into delivery pipeline. Define quality gates for AI-enhanced output.', target: 'AI post-processing active on standard delivery pipeline' },
    d90: { action: 'Measure post-processing time before and after. Identify remaining manual steps in delivery workflow.', target: 'Measurable reduction in post-processing time per delivery' },
  },
}
