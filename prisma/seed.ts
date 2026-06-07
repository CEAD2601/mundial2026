import 'dotenv/config'
import { PrismaClient, MatchResult, PaymentStatus } from '../lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL ?? ''
const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

// Venezuela is UTC-4, so we add 4 hours to convert VET to UTC
function vet(dateStr: string, timeStr: string): Date {
  // dateStr: "2026-06-11", timeStr: "15:00" (VET)
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, min] = timeStr.split(':').map(Number)
  // Add 4 hours for UTC
  const utcHour = hour + 4
  const d = new Date(Date.UTC(year, month - 1, day, utcHour, min, 0))
  return d
}

async function main() {
  console.log('Seeding database...')

  // Settings
  await prisma.setting.upsert({
    where: { id: 'default' },
    update: {
      fixedExchangeRate: 730,
      useFixedExchangeRate: true,
      exchangeRateCurrency: 'USD',
    },
    create: {
      id: 'default',
      appName: 'Quiniela Mundial 2026',
      entryPriceUsd: 20,
      fixedExchangeRate: 730,
      useFixedExchangeRate: true,
      paymentPhone: '04143043337',
      paymentNationalId: '4561947',
      paymentBank: 'Banesco',
      exchangeRateCurrency: 'USD',
      firstPrizePercent: 65,
      secondPrizePercent: 20,
      organizationPercent: 15,
      rankingVisible: true,
      showOnlyPaidParticipants: true,
      tiebreakerRules: 'En caso de empate en puntos, se considera: 1) Mayor cantidad de resultados exactos. 2) Mayor efectividad porcentual. 3) Orden de registro.',
    },
  })

  // Teams data
  const teamsData = [
    // Group A
    { officialName: 'México', displayName: 'México', shortName: 'MEX', fifaCode: 'MEX', isoCode: 'mx', flagEmoji: '🇲🇽', group: 'A', aliases: '["MEXICO","México"]' },
    { officialName: 'Sudáfrica', displayName: 'Sudáfrica', shortName: 'RSA', fifaCode: 'RSA', isoCode: 'za', flagEmoji: '🇿🇦', group: 'A', aliases: '["SURAFRICA","Sudáfrica"]' },
    { officialName: 'Corea del Sur', displayName: 'Corea del Sur', shortName: 'KOR', fifaCode: 'KOR', isoCode: 'kr', flagEmoji: '🇰🇷', group: 'A', aliases: '["COREA DEL SUR","Corea","COREA"]' },
    { officialName: 'República Checa', displayName: 'Rep. Checa', shortName: 'CZE', fifaCode: 'CZE', isoCode: 'cz', flagEmoji: '🇨🇿', group: 'A', aliases: '["REPUBLICA CHECA","República Checa"]' },
    // Group B
    { officialName: 'Canadá', displayName: 'Canadá', shortName: 'CAN', fifaCode: 'CAN', isoCode: 'ca', flagEmoji: '🇨🇦', group: 'B', aliases: '["CANADA","Canadá"]' },
    { officialName: 'Bosnia y Herzegovina', displayName: 'Bosnia', shortName: 'BIH', fifaCode: 'BIH', isoCode: 'ba', flagEmoji: '🇧🇦', group: 'B', aliases: '["BOSNIA","Bosnia y Herzegovina"]' },
    { officialName: 'Catar', displayName: 'Catar', shortName: 'QAT', fifaCode: 'QAT', isoCode: 'qa', flagEmoji: '🇶🇦', group: 'B', aliases: '["QATAR","Catar"]' },
    { officialName: 'Suiza', displayName: 'Suiza', shortName: 'SUI', fifaCode: 'SUI', isoCode: 'ch', flagEmoji: '🇨🇭', group: 'B', aliases: '["SUIZA","Suiza"]' },
    // Group C
    { officialName: 'Brasil', displayName: 'Brasil', shortName: 'BRA', fifaCode: 'BRA', isoCode: 'br', flagEmoji: '🇧🇷', group: 'C', aliases: '["BRASIL","Brasil"]' },
    { officialName: 'Marruecos', displayName: 'Marruecos', shortName: 'MAR', fifaCode: 'MAR', isoCode: 'ma', flagEmoji: '🇲🇦', group: 'C', aliases: '["MARRUECOS","Marruecos"]' },
    { officialName: 'Haití', displayName: 'Haití', shortName: 'HAI', fifaCode: 'HAI', isoCode: 'ht', flagEmoji: '🇭🇹', group: 'C', aliases: '["HAITI","Haití"]' },
    { officialName: 'Escocia', displayName: 'Escocia', shortName: 'SCO', fifaCode: 'SCO', isoCode: 'gb-sct', flagEmoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', aliases: '["ESCOCIA","Escocia"]' },
    // Group D
    { officialName: 'Estados Unidos', displayName: 'EE.UU.', shortName: 'USA', fifaCode: 'USA', isoCode: 'us', flagEmoji: '🇺🇸', group: 'D', aliases: '["EE.UU","EE.UU.","Estados Unidos","USA"]' },
    { officialName: 'Paraguay', displayName: 'Paraguay', shortName: 'PAR', fifaCode: 'PAR', isoCode: 'py', flagEmoji: '🇵🇾', group: 'D', aliases: '["PARAGUAY","PARGUAY","Paraguay"]' },
    { officialName: 'Australia', displayName: 'Australia', shortName: 'AUS', fifaCode: 'AUS', isoCode: 'au', flagEmoji: '🇦🇺', group: 'D', aliases: '["AUSTRALIA","Australia"]' },
    { officialName: 'Turquía', displayName: 'Turquía', shortName: 'TUR', fifaCode: 'TUR', isoCode: 'tr', flagEmoji: '🇹🇷', group: 'D', aliases: '["TURQUIA","Turquía"]' },
    // Group E
    { officialName: 'Alemania', displayName: 'Alemania', shortName: 'GER', fifaCode: 'GER', isoCode: 'de', flagEmoji: '🇩🇪', group: 'E', aliases: '["ALEMANIA","Alemania"]' },
    { officialName: 'Curazao', displayName: 'Curazao', shortName: 'CUW', fifaCode: 'CUW', isoCode: 'cw', flagEmoji: '🇨🇼', group: 'E', aliases: '["CURAZAO","Curazao","CURAÇAO"]' },
    { officialName: 'Costa de Marfil', displayName: 'Costa de Marfil', shortName: 'CIV', fifaCode: 'CIV', isoCode: 'ci', flagEmoji: '🇨🇮', group: 'E', aliases: '["COSTA DE MARFIL","Costa de Marfil"]' },
    { officialName: 'Ecuador', displayName: 'Ecuador', shortName: 'ECU', fifaCode: 'ECU', isoCode: 'ec', flagEmoji: '🇪🇨', group: 'E', aliases: '["ECUADOR","ECUARDOR","EDUADOR","Ecuador"]' },
    // Group F
    { officialName: 'Países Bajos', displayName: 'Países Bajos', shortName: 'NED', fifaCode: 'NED', isoCode: 'nl', flagEmoji: '🇳🇱', group: 'F', aliases: '["PAISES BAJOS","Países Bajos","Holanda"]' },
    { officialName: 'Japón', displayName: 'Japón', shortName: 'JPN', fifaCode: 'JPN', isoCode: 'jp', flagEmoji: '🇯🇵', group: 'F', aliases: '["JAPON","Japón"]' },
    { officialName: 'Suecia', displayName: 'Suecia', shortName: 'SWE', fifaCode: 'SWE', isoCode: 'se', flagEmoji: '🇸🇪', group: 'F', aliases: '["SUECIA","Suecia"]' },
    { officialName: 'Túnez', displayName: 'Túnez', shortName: 'TUN', fifaCode: 'TUN', isoCode: 'tn', flagEmoji: '🇹🇳', group: 'F', aliases: '["TUNEZ","Túnez"]' },
    // Group G
    { officialName: 'Bélgica', displayName: 'Bélgica', shortName: 'BEL', fifaCode: 'BEL', isoCode: 'be', flagEmoji: '🇧🇪', group: 'G', aliases: '["BELGICA","Bélgica"]' },
    { officialName: 'Egipto', displayName: 'Egipto', shortName: 'EGY', fifaCode: 'EGY', isoCode: 'eg', flagEmoji: '🇪🇬', group: 'G', aliases: '["EGIPTO","Egipto"]' },
    { officialName: 'Irán', displayName: 'Irán', shortName: 'IRN', fifaCode: 'IRN', isoCode: 'ir', flagEmoji: '🇮🇷', group: 'G', aliases: '["IRAN","Irán"]' },
    { officialName: 'Nueva Zelanda', displayName: 'Nueva Zelanda', shortName: 'NZL', fifaCode: 'NZL', isoCode: 'nz', flagEmoji: '🇳🇿', group: 'G', aliases: '["NUEVA ZELANDA","Nueva Zelanda"]' },
    // Group H
    { officialName: 'España', displayName: 'España', shortName: 'ESP', fifaCode: 'ESP', isoCode: 'es', flagEmoji: '🇪🇸', group: 'H', aliases: '["ESPAÑA","España"]' },
    { officialName: 'Cabo Verde', displayName: 'Cabo Verde', shortName: 'CPV', fifaCode: 'CPV', isoCode: 'cv', flagEmoji: '🇨🇻', group: 'H', aliases: '["CABO VERDE","Cabo Verde"]' },
    { officialName: 'Arabia Saudita', displayName: 'Arabia Saudita', shortName: 'KSA', fifaCode: 'KSA', isoCode: 'sa', flagEmoji: '🇸🇦', group: 'H', aliases: '["ARABIA SAUDITA","Arabia Saudita"]' },
    { officialName: 'Uruguay', displayName: 'Uruguay', shortName: 'URU', fifaCode: 'URU', isoCode: 'uy', flagEmoji: '🇺🇾', group: 'H', aliases: '["URUGUAY","Uruguay"]' },
    // Group I
    { officialName: 'Francia', displayName: 'Francia', shortName: 'FRA', fifaCode: 'FRA', isoCode: 'fr', flagEmoji: '🇫🇷', group: 'I', aliases: '["FRANCIA","Francia"]' },
    { officialName: 'Senegal', displayName: 'Senegal', shortName: 'SEN', fifaCode: 'SEN', isoCode: 'sn', flagEmoji: '🇸🇳', group: 'I', aliases: '["SENEGAL","Senegal"]' },
    { officialName: 'Irak', displayName: 'Irak', shortName: 'IRQ', fifaCode: 'IRQ', isoCode: 'iq', flagEmoji: '🇮🇶', group: 'I', aliases: '["IRAK","Irak"]' },
    { officialName: 'Noruega', displayName: 'Noruega', shortName: 'NOR', fifaCode: 'NOR', isoCode: 'no', flagEmoji: '🇳🇴', group: 'I', aliases: '["NORUEGA","Noruega"]' },
    // Group J
    { officialName: 'Argentina', displayName: 'Argentina', shortName: 'ARG', fifaCode: 'ARG', isoCode: 'ar', flagEmoji: '🇦🇷', group: 'J', aliases: '["ARGENTINA","Argentina"]' },
    { officialName: 'Argelia', displayName: 'Argelia', shortName: 'ALG', fifaCode: 'ALG', isoCode: 'dz', flagEmoji: '🇩🇿', group: 'J', aliases: '["ARGELIA","Argelia"]' },
    { officialName: 'Jordania', displayName: 'Jordania', shortName: 'JOR', fifaCode: 'JOR', isoCode: 'jo', flagEmoji: '🇯🇴', group: 'J', aliases: '["JORDANIA","Jordania"]' },
    { officialName: 'Austria', displayName: 'Austria', shortName: 'AUT', fifaCode: 'AUT', isoCode: 'at', flagEmoji: '🇦🇹', group: 'J', aliases: '["AUSTRIA","Austria"]' },
    // Group K
    { officialName: 'Portugal', displayName: 'Portugal', shortName: 'POR', fifaCode: 'POR', isoCode: 'pt', flagEmoji: '🇵🇹', group: 'K', aliases: '["PORTUGAL","Portugal"]' },
    { officialName: 'Colombia', displayName: 'Colombia', shortName: 'COL', fifaCode: 'COL', isoCode: 'co', flagEmoji: '🇨🇴', group: 'K', aliases: '["COLOMBIA","Colombia"]' },
    { officialName: 'Uzbekistán', displayName: 'Uzbekistán', shortName: 'UZB', fifaCode: 'UZB', isoCode: 'uz', flagEmoji: '🇺🇿', group: 'K', aliases: '["UZBEKISTAN","Uzbekistán"]' },
    { officialName: 'RD Congo', displayName: 'RD Congo', shortName: 'COD', fifaCode: 'COD', isoCode: 'cd', flagEmoji: '🇨🇩', group: 'K', aliases: '["RD CONGO","RD Congo"]' },
    // Group L
    { officialName: 'Inglaterra', displayName: 'Inglaterra', shortName: 'ENG', fifaCode: 'ENG', isoCode: 'gb-eng', flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', aliases: '["INGLATERRA","Inglaterra"]' },
    { officialName: 'Croacia', displayName: 'Croacia', shortName: 'CRO', fifaCode: 'CRO', isoCode: 'hr', flagEmoji: '🇭🇷', group: 'L', aliases: '["CROACIA","Croacia"]' },
    { officialName: 'Ghana', displayName: 'Ghana', shortName: 'GHA', fifaCode: 'GHA', isoCode: 'gh', flagEmoji: '🇬🇭', group: 'L', aliases: '["GHANA","Ghana"]' },
    { officialName: 'Panamá', displayName: 'Panamá', shortName: 'PAN', fifaCode: 'PAN', isoCode: 'pa', flagEmoji: '🇵🇦', group: 'L', aliases: '["PANAMA","Panamá"]' },
  ]

  // Upsert all teams
  const teamMap: Record<string, string> = {}
  for (const team of teamsData) {
    const t = await prisma.team.upsert({
      where: { fifaCode: team.fifaCode },
      update: team,
      create: team,
    })
    teamMap[team.fifaCode] = t.id
  }
  console.log(`Created ${teamsData.length} teams`)

  // Matches: [matchNumber, group, team1FifaCode, team2FifaCode, dateStr, timeStr]
  // timeStr is in VET (UTC-4)
  const matchesData: [number, string, string, string, string, string][] = [
    // Group A
    [1, 'A', 'MEX', 'RSA', '2026-06-11', '15:00'],
    [2, 'A', 'KOR', 'CZE', '2026-06-11', '22:00'],
    [3, 'A', 'CZE', 'RSA', '2026-06-18', '00:00'],
    [4, 'A', 'MEX', 'KOR', '2026-06-18', '21:00'],
    [5, 'A', 'RSA', 'KOR', '2026-06-24', '21:00'],
    [6, 'A', 'CZE', 'MEX', '2026-06-24', '21:00'],
    // Group B
    [7, 'B', 'CAN', 'BIH', '2026-06-12', '15:00'],
    [8, 'B', 'QAT', 'SUI', '2026-06-13', '15:00'],
    [9, 'B', 'SUI', 'BIH', '2026-06-18', '15:00'],
    [10, 'B', 'CAN', 'QAT', '2026-06-18', '18:00'],
    [11, 'B', 'BIH', 'QAT', '2026-06-24', '15:00'],
    [12, 'B', 'SUI', 'CAN', '2026-06-24', '15:00'],
    // Group C
    [13, 'C', 'BRA', 'MAR', '2026-06-13', '18:00'],
    [14, 'C', 'HAI', 'SCO', '2026-06-13', '21:00'],
    [15, 'C', 'SCO', 'MAR', '2026-06-19', '18:00'],
    [16, 'C', 'BRA', 'HAI', '2026-06-19', '21:00'],
    [17, 'C', 'SCO', 'BRA', '2026-06-24', '18:00'],
    [18, 'C', 'MAR', 'HAI', '2026-06-24', '18:00'],
    // Group D
    [19, 'D', 'USA', 'PAR', '2026-06-12', '21:00'],
    [20, 'D', 'AUS', 'TUR', '2026-06-14', '00:00'],
    [21, 'D', 'TUR', 'PAR', '2026-06-19', '12:00'],
    [22, 'D', 'USA', 'AUS', '2026-06-19', '15:00'],
    [23, 'D', 'PAR', 'AUS', '2026-06-25', '10:00'],
    [24, 'D', 'TUR', 'USA', '2026-06-25', '10:00'],
    // Group E
    [25, 'E', 'GER', 'CUW', '2026-06-14', '13:00'],
    [26, 'E', 'CIV', 'ECU', '2026-06-14', '19:00'],
    [27, 'E', 'GER', 'CIV', '2026-06-20', '16:00'],
    [28, 'E', 'ECU', 'CUW', '2026-06-20', '20:00'],
    [29, 'E', 'CUW', 'CIV', '2026-06-25', '16:00'],
    [30, 'E', 'ECU', 'GER', '2026-06-25', '16:00'],
    // Group F
    [31, 'F', 'NED', 'JPN', '2026-06-14', '16:00'],
    [32, 'F', 'SWE', 'TUN', '2026-06-14', '22:00'],
    [33, 'F', 'TUN', 'JPN', '2026-06-20', '12:00'],
    [34, 'F', 'NED', 'SWE', '2026-06-20', '13:00'],
    [35, 'F', 'JPN', 'SWE', '2026-06-25', '19:00'],
    [36, 'F', 'TUN', 'NED', '2026-06-25', '19:00'],
    // Group G
    [37, 'G', 'BEL', 'EGY', '2026-06-15', '15:00'],
    [38, 'G', 'IRN', 'NZL', '2026-06-15', '21:00'],
    [39, 'G', 'BEL', 'IRN', '2026-06-21', '15:00'],
    [40, 'G', 'NZL', 'EGY', '2026-06-21', '21:00'],
    [41, 'G', 'NZL', 'BEL', '2026-06-26', '23:00'],
    [42, 'G', 'EGY', 'IRN', '2026-06-26', '23:00'],
    // Group H
    [43, 'H', 'ESP', 'CPV', '2026-06-15', '00:00'],
    [44, 'H', 'KSA', 'URU', '2026-06-15', '18:00'],
    [45, 'H', 'ESP', 'KSA', '2026-06-21', '00:00'],
    [46, 'H', 'URU', 'CPV', '2026-06-21', '20:00'],
    [47, 'H', 'CPV', 'KSA', '2026-06-26', '20:00'],
    [48, 'H', 'URU', 'ESP', '2026-06-26', '20:00'],
    // Group I
    [49, 'I', 'FRA', 'SEN', '2026-06-16', '15:00'],
    [50, 'I', 'IRQ', 'NOR', '2026-06-16', '18:00'],
    [51, 'I', 'FRA', 'IRQ', '2026-06-22', '17:00'],
    [52, 'I', 'NOR', 'SEN', '2026-06-22', '20:00'],
    [53, 'I', 'SEN', 'IRQ', '2026-06-26', '15:00'],
    [54, 'I', 'NOR', 'FRA', '2026-06-26', '15:00'],
    // Group J
    [55, 'J', 'ARG', 'ALG', '2026-06-16', '21:00'],
    [56, 'J', 'AUT', 'JOR', '2026-06-17', '12:00'],
    [57, 'J', 'ARG', 'AUT', '2026-06-22', '13:00'],
    [58, 'J', 'JOR', 'ALG', '2026-06-23', '23:00'],
    [59, 'J', 'ALG', 'AUT', '2026-06-27', '22:00'],
    [60, 'J', 'JOR', 'ARG', '2026-06-27', '22:00'],
    // Group K
    [61, 'K', 'POR', 'COD', '2026-06-17', '13:00'],
    [62, 'K', 'UZB', 'COL', '2026-06-17', '22:00'],
    [63, 'K', 'POR', 'UZB', '2026-06-23', '13:00'],
    [64, 'K', 'COL', 'COD', '2026-06-23', '22:00'],
    [65, 'K', 'COD', 'UZB', '2026-06-27', '19:30'],
    [66, 'K', 'COL', 'POR', '2026-06-27', '19:00'],
    // Group L
    [67, 'L', 'ENG', 'CRO', '2026-06-17', '16:00'],
    [68, 'L', 'GHA', 'PAN', '2026-06-17', '19:00'],
    [69, 'L', 'ENG', 'GHA', '2026-06-23', '16:00'],
    [70, 'L', 'PAN', 'CRO', '2026-06-23', '19:00'],
    [71, 'L', 'CRO', 'GHA', '2026-06-27', '17:00'],
    [72, 'L', 'PAN', 'ENG', '2026-06-27', '17:00'],
  ]

  for (const [matchNumber, group, t1Code, t2Code, dateStr, timeStr] of matchesData) {
    const kickoffUtc = vet(dateStr, timeStr)
    await prisma.match.upsert({
      where: { matchNumber },
      update: { kickoffUtc, group, team1Id: teamMap[t1Code], team2Id: teamMap[t2Code] },
      create: {
        matchNumber,
        group,
        team1Id: teamMap[t1Code],
        team2Id: teamMap[t2Code],
        kickoffUtc,
        source: 'Excel import - verified',
      },
    })
  }
  console.log(`Created ${matchesData.length} matches`)

  // Demo participants — ONLY in development/local, NEVER in production
  const isProduction = process.env.NODE_ENV === 'production'
  const baseOnly = process.env.SEED_BASE_ONLY === 'true'

  if (isProduction || baseOnly) {
    console.log('Skipping demo participants (production or SEED_BASE_ONLY mode).')
    console.log('Seeding complete!')
    return
  }

  const testParticipants = [
    { fullName: 'Carlos Rodr\u{00ED}guez', nationalId: '12345678', phone: '04141234567', city: 'Caracas' },
    { fullName: 'Mar\u{00ED}a Gonz\u{00E1}lez', nationalId: '87654321', phone: '04161234567', city: 'Maracaibo' },
    { fullName: 'Jos\u{00E9} P\u{00E9}rez', nationalId: '11223344', phone: '04121234567', city: 'Valencia' },
    { fullName: 'Ana Mart\u{00ED}nez', nationalId: '44332211', phone: '04261234567', city: 'Barquisimeto' },
    { fullName: 'Luis Hern\u{00E1}ndez', nationalId: '55667788', phone: '04241234567', city: 'Matur\u{00ED}n' },
  ]

  const goalScenarios: [number, number][] = [
    [2, 1], [0, 0], [1, 2], [3, 0], [1, 1],
    [0, 1], [2, 2], [1, 0], [0, 2], [2, 0],
  ]
  const allMatches = await prisma.match.findMany({ orderBy: { matchNumber: 'asc' } })
  const paymentStatuses: PaymentStatus[] = ['VERIFIED', 'VERIFIED', 'IN_REVIEW', 'PENDING', 'REJECTED']

  for (let i = 0; i < testParticipants.length; i++) {
    const pd = testParticipants[i]
    const code = `MUN26-TEST${String(i + 1).padStart(3, '0')}`
    const participant = await prisma.participant.upsert({
      where: { nationalId: pd.nationalId },
      update: {},
      create: {
        fullName: pd.fullName,
        nationalId: pd.nationalId,
        phone: pd.phone,
        city: pd.city,
        participationCode: code,
        isComplete: true,
        submittedAt: new Date(),
      },
    })

    for (let j = 0; j < allMatches.length; j++) {
      const [g1, g2] = goalScenarios[(i + j) % goalScenarios.length]
      const predictedResult: MatchResult = g1 > g2 ? 'G1' : g1 < g2 ? 'G2' : 'E'
      await prisma.prediction.upsert({
        where: { participantId_matchId: { participantId: participant.id, matchId: allMatches[j].id } },
        update: {},
        create: {
          participantId: participant.id,
          matchId: allMatches[j].id,
          predictedTeam1Goals: g1,
          predictedTeam2Goals: g2,
          predictedResult,
        },
      })
    }

    await prisma.payment.upsert({
      where: { participantId: participant.id },
      update: {},
      create: {
        participantId: participant.id,
        amountUsd: 20,
        paymentStatus: paymentStatuses[i],
        senderBank: 'Banesco',
        paymentReference: `REF${100000 + i}`,
        paymentDate: new Date(),
        exchangeRate: 730,
        amountVes: 20 * 730,
      },
    })

    await prisma.rankingSnapshot.upsert({
      where: { participantId: participant.id },
      update: {},
      create: {
        participantId: participant.id,
        totalPoints: (5 - i) * 10,
        exactScores: (5 - i) * 2,
        correctResults: (5 - i) * 1,
        wrongPredictions: i * 2,
        pendingPredictions: 72,
        playedMatches: 0,
        totalGoalDiffError: i * 5,
        effectivenessPercent: 0,
        currentPosition: i + 1,
      },
    })
  }

  console.log(`Created ${testParticipants.length} demo participants (development only)`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
