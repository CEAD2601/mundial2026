'use client'

const VISITOR_KEY = 'mq_visitor_id'

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

interface TrackOptions {
  participantId?: string
  matchId?: string
  metadata?: Record<string, unknown>
}

export function track(eventType: string, path?: string, options: TrackOptions = {}): void {
  try {
    const visitorId = getVisitorId()
    const payload = {
      eventType,
      path: path ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
      visitorId,
      ...options,
    }
    // Fire-and-forget: never await, never throw
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {})
  } catch {
    // Silent
  }
}
