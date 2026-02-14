"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { addEvent, getEvents, updateEvent, deleteEvent, type CalendarEvent } from "@/lib/calendar-store"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth } from "date-fns"
import { Button } from "@/components/ui/button"

interface MatrixCalendarProps {
  courseId?: string
  openLabel?: string
  onSelectDate?: (d: Date) => void
}

export function MatrixCalendar({ courseId, openLabel = "Calendar", onSelectDate }: MatrixCalendarProps) {
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState<Date>(() => new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => setEvents(getEvents()), [])

  function refresh() {
    setEvents(getEvents())
  }

  function monthGrid(date: Date) {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
    const rows: Date[][] = []
    let cur = start
    while (cur <= end) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) {
        week.push(cur)
        cur = addDays(cur, 1)
      }
      rows.push(week)
    }
    return rows
  }

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDate, setEditorDate] = useState<Date | null>(null)
  const [titleInput, setTitleInput] = useState("")
  const [hourInput, setHourInput] = useState("18:00")
  const [attachToCourse, setAttachToCourse] = useState(false)
  const [dayViewOpen, setDayViewOpen] = useState(false)
  const [dayViewDate, setDayViewDate] = useState<Date | null>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  function openEditorForDay(day: Date) {
    setEditorDate(day)
    setTitleInput("")
    setHourInput("18:00")
    setAttachToCourse(false)
    setEditingEventId(null)
    setEditorOpen(true)
  }

  function openDayView(day: Date) {
    setDayViewDate(day)
    setDayViewOpen(true)
  }

  function closeDayView() {
    setDayViewOpen(false)
    setDayViewDate(null)
  }

  function handleEditorSave() {
    if (!editorDate || !titleInput.trim()) return
    const [hh, mm] = hourInput.split(":").map((s) => parseInt(s, 10))
    const start = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), isNaN(hh) ? 18 : hh, isNaN(mm) ? 0 : mm)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    const eventCourseId = attachToCourse ? courseId ?? undefined : undefined
    if (editingEventId) {
      updateEvent(editingEventId, { title: titleInput.trim(), start: start.toISOString(), end: end.toISOString(), courseId: eventCourseId })
    } else {
      addEvent({ title: titleInput.trim(), start: start.toISOString(), end: end.toISOString(), courseId: eventCourseId, recurrence: "none" })
    }
    refresh()
    setEditorOpen(false)
    setEditingEventId(null)
  }

  function eventsForDay(day: Date) {
    return events.filter((e) => isSameDay(new Date(e.start), day))
  }

  return (
    <>
      {createPortal(
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(true) }}
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
          style={{ zIndex: 2147483647, pointerEvents: 'auto' }}
          className="fixed bottom-28 right-6 flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg shadow-lg"
          aria-label="Open calendar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4" />
          </svg>
          <span className="hidden sm:inline">{openLabel}</span>
        </button>,
        document.body
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div
            className="relative w-full max-w-3xl bg-card rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setFocus((d) => subMonths(d, 1))}>&larr;</Button>
                <div className="text-lg font-semibold">{format(focus, "MMMM yyyy")}</div>
                <Button variant="ghost" onClick={() => setFocus((d) => addMonths(d, 1))}>&rarr;</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => { setFocus(new Date()); refresh() }}>Today</Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2">
                <div className="text-center">Mon</div>
                <div className="text-center">Tue</div>
                <div className="text-center">Wed</div>
                <div className="text-center">Thu</div>
                <div className="text-center">Fri</div>
                <div className="text-center">Sat</div>
                <div className="text-center">Sun</div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {monthGrid(focus).map((week, wi) => (
                  <div key={wi} className="contents">
                    {week.map((day) => {
                      const inMonth = isSameMonth(day, focus)
                      const dayEvents = eventsForDay(day)
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (typeof onSelectDate === 'function') {
                              onSelectDate(day)
                              setOpen(false)
                              return
                            }
                            if (dayEvents.length > 0) openDayView(day)
                            else openEditorForDay(day)
                          }}
                          className={`flex h-20 flex-col p-2 rounded-lg border ${inMonth ? 'bg-background' : 'bg-muted/10 text-muted-foreground'} hover:shadow-md`}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{format(day, 'd')}</span>
                            {dayEvents.length > 0 && (
                              <span className="text-[11px] px-1 py-0.5 rounded bg-primary/10 text-primary">{dayEvents.length} event{dayEvents.length>1?'s':''}</span>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
                            {dayEvents.slice(0,2).map((e) => e.title).join(' • ')}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day view modal - lists events for the selected day and allows add/edit/delete */}
      {dayViewOpen && dayViewDate && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => closeDayView()} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{format(dayViewDate, 'EEEE, MMM d')}</h3>
                <p className="text-sm text-muted-foreground">{eventsForDay(dayViewDate).length} event{eventsForDay(dayViewDate).length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => { closeDayView(); openEditorForDay(dayViewDate) }}>Add</Button>
                <Button variant="ghost" onClick={() => closeDayView()}>Close</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {eventsForDay(dayViewDate).map((ev) => (
                <div key={ev.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{ev.title}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(ev.start), 'p')}</div>
                    </div>
                    {ev.courseId && <div className="text-xs text-muted-foreground mt-1">Course: {ev.courseId}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => {
                      // open editor prefilled for edit
                      const d = new Date(ev.start)
                      const hh = String(d.getHours()).padStart(2, '0')
                      const mm = String(d.getMinutes()).padStart(2, '0')
                      setEditingEventId(ev.id)
                      setEditorDate(d)
                      setTitleInput(ev.title)
                      setHourInput(`${hh}:${mm}`)
                      setAttachToCourse(!!ev.courseId)
                      setEditorOpen(true)
                      closeDayView()
                    }}>Edit</Button>
                    <Button variant="ghost" onClick={() => { deleteEvent(ev.id); refresh() }}>Delete</Button>
                  </div>
                </div>
              ))}
              {eventsForDay(dayViewDate).length === 0 && (
                <div className="text-sm text-muted-foreground">No events for this day.</div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Event editor modal */}
      {editorOpen && editorDate && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditorOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Add calendar event</h3>
            <p className="text-sm text-muted-foreground mb-4">{format(editorDate, 'EEEE, MMM d')}</p>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col text-sm">
                <span className="text-xs text-muted-foreground mb-1">Title</span>
                <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="px-3 py-2 rounded-md border" placeholder="e.g., Midterm exam" />
              </label>
              <label className="flex flex-col text-sm">
                <span className="text-xs text-muted-foreground mb-1">Start time</span>
                <input type="time" value={hourInput} onChange={(e) => setHourInput(e.target.value)} className="px-3 py-2 rounded-md border w-36" />
              </label>
              {courseId && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={attachToCourse} onChange={(e) => setAttachToCourse(e.target.checked)} />
                  <span className="text-sm text-muted-foreground">Attach to current course</span>
                </label>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setEditorOpen(false) }}>Cancel</Button>
              <Button onClick={(e) => { e.stopPropagation(); handleEditorSave() }}>Save</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default MatrixCalendar
