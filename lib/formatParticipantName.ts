/**
 * Formats a participant's full name for public display.
 *
 * Rule (Latin name convention):
 *   Words are classified as "particles" (de, del, de la, etc.) or regular words.
 *   We want: first given name + first surname (skipping second given names).
 *
 *   Strategy:
 *   - Split into tokens.
 *   - First token = first given name.
 *   - Skip subsequent tokens that look like given names (non-particles that are
 *     not the last name-group), then take the first surname group
 *     (which may start with a particle like "De", "Del", "De la").
 *
 *   For small pools it's safer to maintain an explicit overrides map for
 *   names that the heuristic can't resolve unambiguously.
 */

// Normalize key: lowercase, remove diacritics
function normalizeKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
}

// Particles that can start a compound surname
const SURNAME_PARTICLES = new Set(['de', 'del', 'de la', 'de las', 'de los', 'van', 'von', 'da', 'dos', 'das', 'di', 'la', 'le', 'el'])

function isParticle(word: string): boolean {
  return SURNAME_PARTICLES.has(word.toLowerCase())
}

/**
 * Explicit overrides for names the heuristic cannot resolve correctly.
 * Keys are fully-lowercased + diacritics-stripped.
 */
const OVERRIDES: Record<string, string> = {
  // Andrés Eduardo De Sá Ortega → Andrés De Sá
  'andres eduardo de sa ortega': 'Andrés De Sá',
  // Lisette Del Valle Arroyo Delgado → Lisette Arroyo
  'lisette del valle arroyo delgado': 'Lisette Arroyo',
  // María Carolina Delgado → María Delgado  (3-word: nombre + segundo nombre + apellido)
  'maria carolina delgado': 'María Delgado',
}

export function formatParticipantDisplayName(fullName: string): string {
  const trimmed = fullName.trim().replace(/\s+/g, ' ')
  if (!trimmed) return ''

  // Check overrides first (diacritics-insensitive, case-insensitive)
  const key = normalizeKey(trimmed)
  if (OVERRIDES[key]) return OVERRIDES[key]

  const words = trimmed.split(' ').filter(Boolean)

  if (words.length === 0) return ''
  if (words.length === 1) return cap(words[0])
  if (words.length === 2) return `${cap(words[0])} ${cap(words[1])}`

  // 3 words: could be "Nombre Apellido1 Apellido2" OR "Nombre NombreB Apellido"
  // Latin convention for 3 tokens: typically Nombre + Apellido1 + Apellido2
  // so we show Nombre + Apellido1 (words[0] + words[1]).
  // Exception already handled above for "María Carolina Delgado".
  if (words.length === 3) {
    return `${cap(words[0])} ${cap(words[1])}`
  }

  // 4+ words: Nombre1 [Nombre2...] Apellido1 [Apellido2...]
  // First name = words[0]
  // Surname starts at the first non-particle token after position 1,
  // OR at the first particle token after position 1 (compound surname).
  // We treat position 2 (index 2) as where surnames start by default.
  // But if words[1] is a particle, the surname might start at words[1].

  const firstName = words[0]

  // Find where the surname group begins:
  // It's either at index 2 (skip one middle name), or at index 1 if words[1] is a particle.
  let surnameStart: number
  if (isParticle(words[1])) {
    // e.g. "Ana De La Cruz Pérez" → surname = "De La Cruz" starting at index 1
    surnameStart = 1
  } else {
    // skip second given name(s), surname starts at index 2
    surnameStart = 2
  }

  // Collect the surname group: first token + any following particles + next token
  const surnameParts: string[] = []
  let i = surnameStart
  surnameParts.push(cap(words[i]))
  i++
  // If next word(s) are particles, include them and the word after
  while (i < words.length && isParticle(words[i])) {
    surnameParts.push(cap(words[i]))
    i++
    if (i < words.length) {
      surnameParts.push(cap(words[i]))
      i++
    }
  }

  return `${cap(firstName)} ${surnameParts.join(' ')}`
}

function cap(word: string): string {
  if (!word) return ''
  // Preserve known lowercase particles as-is when they're mid-name,
  // but since we call cap() for display we capitalise everything consistently.
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}
