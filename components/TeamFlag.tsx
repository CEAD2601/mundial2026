'use client'

interface TeamFlagProps {
  isoCode: string
  displayName: string
  size?: 'sm' | 'md' | 'lg'
  side?: 'left' | 'right'
  showName?: boolean
  className?: string
}

// flag-icons uses lowercase ISO 3166-1 alpha-2 codes as CSS classes
// Special cases: gb-eng (England), gb-sct (Scotland), gb-wls (Wales)
function normalizeIso(iso: string): string {
  return iso.toLowerCase().trim()
}

export function FlagIcon({ isoCode, size = 'md' }: { isoCode: string; size?: 'sm' | 'md' | 'lg' }) {
  const iso = normalizeIso(isoCode)
  const sizeClass = size === 'sm' ? 'w-5 h-4' : size === 'lg' ? 'w-8 h-6' : 'w-6 h-5'

  return (
    <span
      className={`fi fi-${iso} rounded-sm shrink-0 ${sizeClass}`}
      style={{ display: 'inline-block', backgroundSize: 'cover', backgroundPosition: 'center' }}
      title={isoCode.toUpperCase()}
      aria-hidden="true"
    />
  )
}

export default function TeamFlag({
  isoCode,
  displayName,
  size = 'md',
  side = 'left',
  showName = true,
  className = '',
}: TeamFlagProps) {
  const iso = normalizeIso(isoCode)

  if (!iso) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[TeamFlag] Missing isoCode for team: ${displayName}`)
    }
    return (
      <span className={`flex items-center gap-1.5 ${className}`}>
        <span className="w-6 h-5 bg-slate-200 rounded-sm shrink-0 flex items-center justify-center text-[10px] text-slate-400">?</span>
        {showName && <span className="font-semibold text-slate-800 truncate">{displayName}</span>}
      </span>
    )
  }

  const flag = (
    <span
      className={`fi fi-${iso} rounded-sm shrink-0 ${size === 'sm' ? 'w-5 h-4' : size === 'lg' ? 'w-8 h-6' : 'w-6 h-5'}`}
      style={{ display: 'inline-block', backgroundSize: 'cover', backgroundPosition: 'center' }}
      aria-hidden="true"
    />
  )

  if (!showName) return flag

  return (
    <span className={`flex items-center gap-1.5 min-w-0 ${side === 'right' ? 'flex-row-reverse' : ''} ${className}`}>
      {flag}
      <span className="font-semibold text-slate-800 truncate">{displayName}</span>
    </span>
  )
}
