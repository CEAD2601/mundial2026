/**
 * Canonical public URL for the app — NEVER use window.location.origin for sharing.
 *
 * window.location.origin on Vercel returns the deployment-specific URL
 * (e.g. mundial2026-abc123-cead-2601-s-projects.vercel.app), not the stable alias.
 *
 * Always rely on NEXT_PUBLIC_APP_URL for any shareable link.
 */

const FALLBACK_URL = 'https://mundial2026-nine-psi.vercel.app'

/** Returns the canonical public URL with no trailing slash. */
export function getPublicAppUrl(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL
  if (env && env.trim()) return env.replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:${window.location.port || 3000}`
  }
  return FALLBACK_URL
}
