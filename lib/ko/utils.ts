export type KOPickInput = {
  home: number
  away: number
  penaltyWinner?: 'home' | 'away' | null
}

export type KOResultInput = {
  home: number
  away: number
  penaltyWinner?: 'home' | 'away' | null
}

export type KOPointsBreakdown = {
  classified: number
  exact: number
  penalty: number
  total: number
}

// Sistema de puntos eliminatorias (idéntico al prototipo, 5 tests pasados)
// +2 clasificado correcto · +2 marcador exacto (requiere clasificado) · +1 bono penales
export function calcKOPoints(pick: KOPickInput, result: KOResultInput): KOPointsBreakdown {
  const realIsDraw = result.home === result.away
  const pickIsDraw = pick.home === pick.away
  const realWinner = realIsDraw ? result.penaltyWinner : (result.home > result.away ? 'home' : 'away')
  const pickWinner = pickIsDraw ? pick.penaltyWinner   : (pick.home  > pick.away  ? 'home' : 'away')
  const classified = realWinner === pickWinner ? 2 : 0
  const exact      = (classified > 0 && pick.home === result.home && pick.away === result.away) ? 2 : 0
  const penalty    = (classified > 0 && realIsDraw && pickIsDraw) ? 1 : 0
  return { classified, exact, penalty, total: classified + exact + penalty }
}

export function generateKOCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'KO26-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const KO_ENTRY_USD = 20
export const KO_FIXED_RATE = 730
export const KO_AMOUNT_VES = KO_ENTRY_USD * KO_FIXED_RATE // 14 600

export const KO_PAYMENT_PHONE   = '04143043337'
export const KO_PAYMENT_CI      = '4561947'
export const KO_PAYMENT_BANK    = 'Banesco'
export const KO_ZELLE_EMAIL     = 'kissigloxxi@hotmail.com'
