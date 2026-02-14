"use client"

import { useState, useEffect } from "react"
import { getEvents, addEvent, updateEvent, deleteEvent, CalendarEvent } from "@/lib/calendar-store"
import { Button } from "@/components/ui/button"

// Note: This component uses react-big-calendar. Install it with the dependencies when ready.
import { Calendar as RBCalendar, Views, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"

const locales = { "en-US": enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

export function TutorCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<CalendarEvent | null>(null)

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  function refresh() {
    setEvents(getEvents())
  }

  function handleSelectSlot(slotInfo: any) {
    const start = slotInfo.start.toISOString()
    const end = slotInfo.end.toISOString()
    const title = window.prompt("Event title")
    if (!title) return
    addEvent({ title, start, end, recurrence: "none" })
    refresh()
  }

  function handleSelectEvent(ev: any) {
    // jump to course content if courseId present
    if (ev.courseId) {
      // navigate to course — best-effort: open new window or set hash
      window.location.hash = `course-${ev.courseId}`
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8h18M3 12h18M3 16h18" />
        </svg>
        <span className="hidden sm:inline">Calendar</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tutor Calendar</h3>
              <div className="flex items-center gap-2">
                <Button onClick={() => {
                  // simple AI suggestion stub: add a flashcard session tomorrow
                  const now = new Date()
                  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0)
                  addEvent({ title: "AI suggested: Flashcards", start: tomorrow.toISOString(), end: new Date(tomorrow.getTime()+30*60000).toISOString(), recurrence: "none" })
                  refresh()
                }}>Suggest</Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
            <div className="h-full">
              <RBCalendar
                localizer={localizer}
                events={events.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                defaultView={Views.WEEK}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
