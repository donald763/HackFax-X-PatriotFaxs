export interface CalendarEvent {
  id: string
  title: string
  start: string // ISO
  end: string // ISO
  courseId?: string
  notes?: string
  recurrence?: "none" | "weekly"
  color?: string
  priority?: number // 1-5
  completedPercent?: number
}

const STORAGE_KEY = "studypilot_calendar_events"

function loadRaw(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CalendarEvent[]
  } catch (e) {
    console.error("Failed to load calendar events", e)
    return []
  }
}

function saveRaw(events: CalendarEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (e) {
    console.error("Failed to save calendar events", e)
  }
}

export function getEvents(): CalendarEvent[] {
  return loadRaw()
}

export function addEvent(e: Omit<CalendarEvent, "id">) {
  const id = String(Date.now()) + Math.random().toString(36).slice(2, 9)
  const ev: CalendarEvent = { id, completedPercent: 0, ...e }
  const events = loadRaw()
  events.push(ev)
  saveRaw(events)
  return ev
}

export function updateEvent(id: string, patch: Partial<CalendarEvent>) {
  const events = loadRaw()
  const idx = events.findIndex((x) => x.id === id)
  if (idx === -1) return null
  events[idx] = { ...events[idx], ...patch }
  saveRaw(events)
  return events[idx]
}

export function deleteEvent(id: string) {
  const events = loadRaw().filter((x) => x.id !== id)
  saveRaw(events)
}

export function clearEvents() {
  saveRaw([])
}
