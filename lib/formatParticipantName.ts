/**
 * Formats a participant's full name for public display.
 *
 * Rule (Latin name convention):
 *   1 word  → that word
 *   2 words → both words
 *   3 words → first + second  (nombre + apellido)
 *   4+ words → first + third  (nombre1 + apellido1, skipping nombre2)
 *
 * Examples:
 *   "CARLOS ALBERTO ACOSTA GÓMEZ" → "Carlos Acosta"
 *   "MARÍA ALEJANDRA PÉREZ RODRÍGUEZ" → "María Pérez"
 *   "carlos acosta" → "Carlos Acosta"
 *   "JOSE TORRELLI" → "Jose Torrelli"
 *   "Nino" → "Nino"
 */
export function formatParticipantDisplayName(fullName: string): string {
  const words = fullName
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)

  if (words.length === 0) return ''

  let selected: string[]
  if (words.length <= 2) {
    selected = words
  } else if (words.length === 3) {
    selected = [words[0], words[1]]
  } else {
    // 4+ words: first name (words[0]) + first surname (words[2])
    selected = [words[0], words[2]]
  }

  return selected
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
