export type FormulaTerms = {
  pressure: boolean // ΔP
  constant: boolean // 1/4
  viscosity: boolean // μ
  length: boolean // L
  radiusScale: boolean // R^2
  profile: boolean // (1 - (r/R)^2)
}

const TEX = {
  deltaP: '\\Delta P',
  mu: '\\mu',
  profile: '\\left(1-\\left(\\frac{r}{R}\\right)^2\\right)',
} as const

const colorize = (enabled: boolean, tex: string) =>
  enabled ? `\\color{green}{${tex}}` : `\\color{gray}{${tex}}`

export function buildVelocityTex(terms: FormulaTerms) {
  return (
    `v(r)=` +
    `\\frac{${colorize(terms.pressure, TEX.deltaP)}}{` +
    `${colorize(terms.constant, '4')}\\,${colorize(terms.viscosity, TEX.mu)}\\,${colorize(terms.length, 'L')}` +
    `}` +
    `\\cdot ${colorize(terms.radiusScale, 'R^2')}` +
    `\\cdot ${colorize(terms.profile, TEX.profile)}`
  )
}

export function calcLaminarVelocity({
  dP,
  R,
  r,
  mu,
  L,
  vScale,
  terms,
}: {
  dP: number
  R: number
  r: number
  mu: number
  L: number
  vScale: number
  terms: FormulaTerms
}) {
  // Disabling a term should neutralize it (multiply by 1 / divide by 1),
  // so the sim keeps running but removes that dependency for learning.
  const dPFactor = terms.pressure ? dP : 1
  const muFactor = terms.viscosity ? mu : 1
  const LFactor = terms.length ? L : 1
  const constFactor = terms.constant ? 4 : 1

  const radiusFactor = terms.radiusScale ? R * R : 1
  const profileFactor = terms.profile ? 1 - (r * r) / (R * R) : 1

  const v = (dPFactor / (constFactor * muFactor * LFactor)) * radiusFactor * profileFactor * vScale
  return Number.isFinite(v) ? v : 0
}


