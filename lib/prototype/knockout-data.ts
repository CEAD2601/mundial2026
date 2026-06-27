/**
 * Datos oficiales — Fase Eliminatoria Mundial 2026
 * Fuente: Wikipedia (2026 FIFA World Cup knockout stage), FIFA oficial
 * Última actualización: 2026-06-24
 *
 * HORARIOS: almacenados en VET (UTC-4 = America/Caracas).
 * Conversión aplicada: VET = hora local + diferencia según sede:
 *   UTC-4 (ET): mismo horario | UTC-5 (CT): +1h | UTC-6 (MT): +2h | UTC-7 (PT): +3h
 *
 * Para modificar equipos, horarios o sedes: editar solo este archivo.
 * La UI lo consume dinámicamente.
 */

export type Stage = 'R32' | 'R16' | 'QF' | 'SF' | 'FINAL'

export interface KOTeam {
  name: string | null       // null = sin confirmar todavía
  code: string | null       // código FIFA 3 letras
  flag: string | null       // emoji bandera
  placeholder: string       // siempre presente (ej: "2A", "Gan. #73")
}

export interface KOMatch {
  id: string
  fifaMatchNumber: number
  stage: Stage
  stageLabel: string
  date: string              // YYYY-MM-DD
  timeVet: string           // HH:mm (24h, VET)
  displayTime: string       // "3:00 p. m." (formato usuario)
  venue: string
  city: string
  country: string
  home: KOTeam
  away: KOTeam
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED'
  isOpenForPredictions: boolean
  sourceNotes: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function team(
  name: string | null, code: string | null, flag: string | null, placeholder: string
): KOTeam {
  return { name, code, flag, placeholder }
}

function ph(placeholder: string): KOTeam {
  return { name: null, code: null, flag: null, placeholder }
}

// ── Partidos ─────────────────────────────────────────────────────────────────

export const KNOCKOUT_MATCHES: KOMatch[] = [

  // ── ROUND OF 32 / DIECISEISAVOS ────────────────────────────────────────────
  // 16 partidos — 28 jun al 3 jul 2026

  {
    id: 'r32-73', fifaMatchNumber: 73, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-06-28', timeVet: '15:00', displayTime: '3:00 p. m.',
    venue: 'SoFi Stadium', city: 'Inglewood', country: 'Estados Unidos',
    home: team('Sudáfrica', 'RSA', '🇿🇦', 'RSA'),
    away: team('Canadá',   'CAN', '🇨🇦', 'CAN'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: '1.º Grupo A vs 1.º Grupo B confirmados | Match 73',
  },
  {
    id: 'r32-74', fifaMatchNumber: 74, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-06-29', timeVet: '16:30', displayTime: '4:30 p. m.',
    venue: 'Gillette Stadium', city: 'Foxborough', country: 'Estados Unidos',
    home: team('Alemania', 'GER', '🇩🇪', 'Ale.'),
    away: ph('Mejor 3.º A/B/C/D/F'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Winner Grupo D confirmado: Alemania | Wikipedia Match 74',
  },
  {
    id: 'r32-75', fifaMatchNumber: 75, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-06-29', timeVet: '21:00', displayTime: '9:00 p. m.',
    venue: 'Estadio BBVA', city: 'Guadalupe', country: 'México',
    home: team('Países Bajos', 'NED', '🇳🇱', 'NED'),
    away: team('Marruecos',    'MAR', '🇲🇦', 'MAR'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Confirmados | Match 75',
  },
  {
    id: 'r32-76', fifaMatchNumber: 76, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-06-29', timeVet: '13:00', displayTime: '1:00 p. m.',
    venue: 'NRG Stadium', city: 'Houston', country: 'Estados Unidos',
    home: team('Brasil', 'BRA', '🇧🇷', 'BRA'),
    away: team('Japón',  'JPN', '🇯🇵', 'JPN'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Confirmados | Match 76',
  },
  {
    id: 'r32-77', fifaMatchNumber: 77, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-06-30', timeVet: '17:00', displayTime: '5:00 p. m.',
    venue: 'MetLife Stadium', city: 'East Rutherford', country: 'Estados Unidos',
    home: ph('1.º Grupo I'),
    away: ph('Mejor 3.º C/D/F/G/H'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Winner I vs Best 3rd C/D/F/G/H | Wikipedia Match 77',
  },
  {
    id: 'r32-78', fifaMatchNumber: 78, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-06-30', timeVet: '13:00', displayTime: '1:00 p. m.',
    venue: 'AT&T Stadium', city: 'Arlington', country: 'Estados Unidos',
    home: team('Costa de Marfil', 'CIV', '🇨🇮', 'CIV'),
    away: ph('A definir'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Costa de Marfil confirmado | Match 78',
  },
  {
    id: 'r32-79', fifaMatchNumber: 79, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-06-30', timeVet: '21:00', displayTime: '9:00 p. m.',
    venue: 'Estadio Azteca', city: 'Ciudad de México', country: 'México',
    home: team('México', 'MEX', '🇲🇽', 'MEX'),
    away: ph('Mejor 3.º C/E/F/H/I'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'México confirmado | Wikipedia Match 79',
  },
  {
    id: 'r32-80', fifaMatchNumber: 80, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-01', timeVet: '12:00', displayTime: '12:00 p. m.',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'Estados Unidos',
    home: ph('1.º Grupo L'),
    away: ph('Mejor 3.º E/H/I/J/K'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Winner L vs Best 3rd E/H/I/J/K | Wikipedia Match 80',
  },
  {
    id: 'r32-81', fifaMatchNumber: 81, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-01', timeVet: '20:00', displayTime: '8:00 p. m.',
    venue: "Levi's Stadium", city: 'Santa Clara', country: 'Estados Unidos',
    home: team('Estados Unidos', 'USA', '🇺🇸', 'USA'),
    away: team('Bosnia y Herzegovina', 'BIH', '🇧🇦', 'BIH'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'USA vs Bosnia confirmados | Match 81',
  },
  {
    id: 'r32-82', fifaMatchNumber: 82, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-01', timeVet: '16:00', displayTime: '4:00 p. m.',
    venue: 'Lumen Field', city: 'Seattle', country: 'Estados Unidos',
    home: ph('1.º Grupo G'),
    away: ph('Mejor 3.º A/E/H/I/J'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Winner G vs Best 3rd A/E/H/I/J | Wikipedia Match 82',
  },
  {
    id: 'r32-83', fifaMatchNumber: 83, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-02', timeVet: '19:00', displayTime: '7:00 p. m.',
    venue: 'BMO Field', city: 'Toronto', country: 'Canadá',
    home: ph('2.º Grupo K'),
    away: ph('2.º Grupo L'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Runner-up K vs Runner-up L | Wikipedia Match 83',
  },
  {
    id: 'r32-84', fifaMatchNumber: 84, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-02', timeVet: '15:00', displayTime: '3:00 p. m.',
    venue: 'SoFi Stadium', city: 'Inglewood', country: 'Estados Unidos',
    home: ph('1.º Grupo H'),
    away: ph('2.º Grupo J'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Winner H vs Runner-up J | Wikipedia Match 84',
  },
  {
    id: 'r32-85', fifaMatchNumber: 85, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-02', timeVet: '23:00', displayTime: '11:00 p. m.',
    venue: 'BC Place', city: 'Vancouver', country: 'Canadá',
    home: team('Suiza', 'SUI', '🇨🇭', 'SUI'),
    away: ph('Mejor 3.º E/F/G/I/J'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Suiza confirmada | Wikipedia Match 85',
  },
  {
    id: 'r32-86', fifaMatchNumber: 86, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-03', timeVet: '18:00', displayTime: '6:00 p. m.',
    venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'Estados Unidos',
    home: team('Argentina', 'ARG', '🇦🇷', 'ARG'),
    away: ph('2.º Grupo H'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Argentina confirmada | Wikipedia Match 86',
  },
  {
    id: 'r32-87', fifaMatchNumber: 87, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-03', timeVet: '21:30', displayTime: '9:30 p. m.',
    venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'Estados Unidos',
    home: ph('1.º Grupo K'),
    away: ph('Mejor 3.º D/E/I/J/L'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Winner K vs Best 3rd D/E/I/J/L | Wikipedia Match 87',
  },
  {
    id: 'r32-88', fifaMatchNumber: 88, stage: 'R32',
    stageLabel: 'Dieciseisavos de final',
    date: '2026-07-03', timeVet: '14:00', displayTime: '2:00 p. m.',
    venue: 'AT&T Stadium', city: 'Arlington', country: 'Estados Unidos',
    home: team('Australia', 'AUS', '🇦🇺', 'AUS'),
    away: ph('A definir'),
    status: 'SCHEDULED', isOpenForPredictions: true,
    sourceNotes: 'Australia confirmado | Match 88',
  },

  // ── ROUND OF 16 / OCTAVOS DE FINAL ─────────────────────────────────────────
  // 8 partidos — 4 al 7 jul 2026

  {
    id: 'r16-89', fifaMatchNumber: 89, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-04', timeVet: '17:00', displayTime: '5:00 p. m.',
    venue: 'Lincoln Financial Field', city: 'Filadelfia', country: 'Estados Unidos',
    home: ph('Gan. #74'),
    away: ph('Gan. #77'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M74 vs Winner M77 | Wikipedia Match 89',
  },
  {
    id: 'r16-90', fifaMatchNumber: 90, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-04', timeVet: '13:00', displayTime: '1:00 p. m.',
    venue: 'NRG Stadium', city: 'Houston', country: 'Estados Unidos',
    home: ph('Gan. #73'),
    away: ph('Gan. #75'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M73 vs Winner M75 | Wikipedia Match 90',
  },
  {
    id: 'r16-91', fifaMatchNumber: 91, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-05', timeVet: '16:00', displayTime: '4:00 p. m.',
    venue: 'MetLife Stadium', city: 'East Rutherford', country: 'Estados Unidos',
    home: ph('Gan. #76'),
    away: ph('Gan. #78'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M76 vs Winner M78 | Wikipedia Match 91',
  },
  {
    id: 'r16-92', fifaMatchNumber: 92, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-05', timeVet: '20:00', displayTime: '8:00 p. m.',
    venue: 'Estadio Azteca', city: 'Ciudad de México', country: 'México',
    home: ph('Gan. #79'),
    away: ph('Gan. #80'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M79 vs Winner M80 | Wikipedia Match 92',
  },
  {
    id: 'r16-93', fifaMatchNumber: 93, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-06', timeVet: '15:00', displayTime: '3:00 p. m.',
    venue: 'AT&T Stadium', city: 'Arlington', country: 'Estados Unidos',
    home: ph('Gan. #83'),
    away: ph('Gan. #84'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M83 vs Winner M84 | Wikipedia Match 93',
  },
  {
    id: 'r16-94', fifaMatchNumber: 94, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-06', timeVet: '20:00', displayTime: '8:00 p. m.',
    venue: 'Lumen Field', city: 'Seattle', country: 'Estados Unidos',
    home: ph('Gan. #81'),
    away: ph('Gan. #82'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M81 vs Winner M82 | Wikipedia Match 94',
  },
  {
    id: 'r16-95', fifaMatchNumber: 95, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-07', timeVet: '12:00', displayTime: '12:00 p. m.',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'Estados Unidos',
    home: ph('Gan. #86'),
    away: ph('Gan. #88'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M86 vs Winner M88 | Wikipedia Match 95',
  },
  {
    id: 'r16-96', fifaMatchNumber: 96, stage: 'R16',
    stageLabel: 'Octavos de final',
    date: '2026-07-07', timeVet: '16:00', displayTime: '4:00 p. m.',
    venue: 'BC Place', city: 'Vancouver', country: 'Canadá',
    home: ph('Gan. #85'),
    away: ph('Gan. #87'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M85 vs Winner M87 | Wikipedia Match 96',
  },

  // ── CUARTOS DE FINAL ────────────────────────────────────────────────────────
  // 4 partidos — 9 al 11 jul 2026

  {
    id: 'qf-97', fifaMatchNumber: 97, stage: 'QF',
    stageLabel: 'Cuartos de final',
    date: '2026-07-09', timeVet: '16:00', displayTime: '4:00 p. m.',
    venue: 'Gillette Stadium', city: 'Foxborough', country: 'Estados Unidos',
    home: ph('Gan. #89'),
    away: ph('Gan. #90'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M89 vs Winner M90 | Wikipedia Match 97',
  },
  {
    id: 'qf-98', fifaMatchNumber: 98, stage: 'QF',
    stageLabel: 'Cuartos de final',
    date: '2026-07-10', timeVet: '15:00', displayTime: '3:00 p. m.',
    venue: 'SoFi Stadium', city: 'Inglewood', country: 'Estados Unidos',
    home: ph('Gan. #93'),
    away: ph('Gan. #94'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M93 vs Winner M94 | Wikipedia Match 98',
  },
  {
    id: 'qf-99', fifaMatchNumber: 99, stage: 'QF',
    stageLabel: 'Cuartos de final',
    date: '2026-07-11', timeVet: '17:00', displayTime: '5:00 p. m.',
    venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'Estados Unidos',
    home: ph('Gan. #91'),
    away: ph('Gan. #92'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M91 vs Winner M92 | Wikipedia Match 99',
  },
  {
    id: 'qf-100', fifaMatchNumber: 100, stage: 'QF',
    stageLabel: 'Cuartos de final',
    date: '2026-07-11', timeVet: '21:00', displayTime: '9:00 p. m.',
    venue: 'Arrowhead Stadium', city: 'Kansas City', country: 'Estados Unidos',
    home: ph('Gan. #95'),
    away: ph('Gan. #96'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M95 vs Winner M96 | Wikipedia Match 100',
  },

  // ── SEMIFINALES ─────────────────────────────────────────────────────────────
  // 2 partidos — 14 y 15 jul 2026

  {
    id: 'sf-101', fifaMatchNumber: 101, stage: 'SF',
    stageLabel: 'Semifinal',
    date: '2026-07-14', timeVet: '15:00', displayTime: '3:00 p. m.',
    venue: 'AT&T Stadium', city: 'Arlington', country: 'Estados Unidos',
    home: ph('Gan. #97'),
    away: ph('Gan. #98'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M97 vs Winner M98 | Wikipedia Match 101',
  },
  {
    id: 'sf-102', fifaMatchNumber: 102, stage: 'SF',
    stageLabel: 'Semifinal',
    date: '2026-07-15', timeVet: '15:00', displayTime: '3:00 p. m.',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'Estados Unidos',
    home: ph('Gan. #99'),
    away: ph('Gan. #100'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M99 vs Winner M100 | Wikipedia Match 102',
  },

  // ── FINAL ───────────────────────────────────────────────────────────────────
  // Tercer lugar + Final — 18 y 19 jul 2026

  {
    id: 'final-103', fifaMatchNumber: 103, stage: 'FINAL',
    stageLabel: 'Tercer lugar',
    date: '2026-07-18', timeVet: '17:00', displayTime: '5:00 p. m.',
    venue: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'Estados Unidos',
    home: ph('Perd. #101'),
    away: ph('Perd. #102'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Loser M101 vs Loser M102 | Wikipedia Match 103',
  },
  {
    id: 'final-104', fifaMatchNumber: 104, stage: 'FINAL',
    stageLabel: '🏆 Gran Final',
    date: '2026-07-19', timeVet: '15:00', displayTime: '3:00 p. m.',
    venue: 'MetLife Stadium', city: 'East Rutherford', country: 'Estados Unidos',
    home: ph('Gan. #101'),
    away: ph('Gan. #102'),
    status: 'SCHEDULED', isOpenForPredictions: false,
    sourceNotes: 'Winner M101 vs Winner M102 | Wikipedia Match 104 · FINAL',
  },
]

export const STAGE_META: Record<Stage, { label: string; short: string; matches: number; dates: string }> = {
  R32:   { label: 'Dieciseisavos de final', short: 'Diecis.',  matches: 16, dates: '28 jun – 3 jul' },
  R16:   { label: 'Octavos de final',       short: 'Octavos',  matches:  8, dates: '4 – 7 jul' },
  QF:    { label: 'Cuartos de final',       short: 'Cuartos',  matches:  4, dates: '9 – 11 jul' },
  SF:    { label: 'Semifinales',            short: 'Semis',    matches:  2, dates: '14 – 15 jul' },
  FINAL: { label: 'Final + 3.er Lugar',     short: 'Final',    matches:  2, dates: '18 – 19 jul' },
}

export const DEMO_RANKING = [
  { pos:1,  name:'Carlos Acosta',    pts:28, exact:6, correct:10, move:+2, goalDiff:+8  },
  { pos:2,  name:'María Delgado',    pts:25, exact:5, correct:10, move:-1, goalDiff:+5  },
  { pos:3,  name:'Laura Bracho',     pts:22, exact:4, correct:10, move:+1, goalDiff:+4  },
  { pos:4,  name:'José Martínez',    pts:20, exact:5, correct: 5, move:-2, goalDiff:+7  },
  { pos:5,  name:'Ana Rodríguez',    pts:18, exact:4, correct: 6, move: 0, goalDiff:+2  },
  { pos:6,  name:'Pedro Gómez',      pts:16, exact:2, correct:10, move:+3, goalDiff:-1  },
  { pos:7,  name:'Diana Torres',     pts:14, exact:4, correct: 2, move:-1, goalDiff:+3  },
  { pos:8,  name:'Rafael López',     pts:12, exact:2, correct: 6, move:+2, goalDiff:-2  },
  { pos:9,  name:'Carmen Suárez',    pts:10, exact:0, correct:10, move: 0, goalDiff:-3  },
  { pos:10, name:'Andrés Morales',   pts: 8, exact:2, correct: 2, move:-2, goalDiff:-5  },
  { pos:11, name:'Sofía Castillo',   pts: 6, exact:0, correct: 6, move:+1, goalDiff:-6  },
  { pos:12, name:'Miguel Herrera',   pts: 4, exact:1, correct: 1, move:-1, goalDiff:-9  },
]
