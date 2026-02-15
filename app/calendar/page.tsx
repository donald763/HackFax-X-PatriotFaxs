"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  addEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  type CalendarEvent,
} from "@/lib/calendar-store"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns"

export default function CalendarPage() {
  const { status } = useSession()
  const router = useRouter()
  const [focus, setFocus] = useState(() => new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titleInput, setTitleInput] = useState("")
  const [hourInput, setHourInput] = useState("18:00")

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
  }, [status, router])

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

  function eventsForDay(day: Date) {
    return events.filter((e) => isSameDay(new Date(e.start), day))
  }

  function openEditor(day: Date, event?: CalendarEvent) {
    setSelectedDay(day)
    if (event) {
      setEditingId(event.id)
      setTitleInput(event.title)
      const d = new Date(event.start)
      setHourInput(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`)
    } else {
      setEditingId(null)
      setTitleInput("")
      setHourInput("18:00")
    }
    setEditorOpen(true)
  }

  function handleSave() {
    if (!selectedDay || !titleInput.trim()) return
    const [hh, mm] = hourInput.split(":").map((s) => parseInt(s, 10))
    const start = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), isNaN(hh) ? 18 : hh, isNaN(mm) ? 0 : mm)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    if (editingId) {
      updateEvent(editingId, { title: titleInput.trim(), start: start.toISOString(), end: end.toISOString() })
    } else {
      addEvent({ title: titleInput.trim(), start: start.toISOString(), end: end.toISOString(), recurrence: "none" })
    }
    refresh()
    setEditorOpen(false)
  }

  function handleDelete(id: string) {
    deleteEvent(id)
    refresh()
  }

  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-green-200 border-t-green-600" />
      </div>
    )
  }

  const todayEvents = eventsForDay(new Date())
  const upcomingEvents = events
    .filter((e) => new Date(e.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

  return (
    <div className="h-full bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Calendar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Plan your study schedule and track deadlines
            </p>
          </div>
          <Button
            onClick={() => openEditor(new Date())}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-5 py-2.5 shadow-lg hover:shadow-xl transition-all"
          >
            + New Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Calendar Grid */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-green-200/60 dark:border-green-900/60 shadow-xl overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-green-200/60 dark:border-green-900/60">
              <button onClick={() => setFocus((d) => subMonths(d, 1))} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {format(focus, "MMMM yyyy")}
                </h2>
                <button
                  onClick={() => { setFocus(new Date()); refresh() }}
                  className="text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-950 transition-colors"
                >
                  Today
                </button>
              </div>
              <button onClick={() => setFocus((d) => addMonths(d, 1))} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-green-200/40 dark:border-green-900/40">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {monthGrid(focus).flat().map((day) => {
                const inMonth = isSameMonth(day, focus)
                const today = isToday(day)
                const dayEvts = eventsForDay(day)
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => dayEvts.length > 0 ? setSelectedDay(day) : openEditor(day)}
                    className={`relative h-24 p-2 border-b border-r border-green-200/30 dark:border-green-900/30 text-left transition-colors hover:bg-green-50/50 dark:hover:bg-green-950/20 ${
                      !inMonth ? "bg-gray-50/50 dark:bg-gray-950/30" : ""
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
                      today
                        ? "bg-green-600 text-white font-bold"
                        : inMonth
                          ? "text-gray-800 dark:text-gray-200 font-medium"
                          : "text-gray-400 dark:text-gray-600"
                    }`}>
                      {format(day, "d")}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvts.slice(0, 2).map((e) => (
                        <div key={e.id} className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 truncate">
                          {e.title}
                        </div>
                      ))}
                      {dayEvts.length > 2 && (
                        <div className="text-[10px] text-gray-500">+{dayEvts.length - 2} more</div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Today's events */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-green-200/60 dark:border-green-900/60 shadow-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Today
              </h3>
              {todayEvents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No events today</p>
              ) : (
                <div className="space-y-2">
                  {todayEvents.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-green-50/80 dark:bg-green-950/30">
                      <div className="w-1 h-8 rounded-full bg-green-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{e.title}</p>
                        <p className="text-xs text-gray-500">{format(new Date(e.start), "p")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-green-200/60 dark:border-green-900/60 shadow-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Upcoming</h3>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events</p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="text-center shrink-0">
                        <p className="text-[10px] text-gray-500 uppercase">{format(new Date(e.start), "MMM")}</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{format(new Date(e.start), "d")}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{e.title}</p>
                        <p className="text-xs text-gray-500">{format(new Date(e.start), "EEEE, p")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected day detail */}
            {selectedDay && (
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-green-200/60 dark:border-green-900/60 shadow-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {format(selectedDay, "EEEE, MMM d")}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditor(selectedDay)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 hover:bg-green-200 transition-colors"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="text-xs px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {eventsForDay(selectedDay).map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{e.title}</p>
                        <p className="text-xs text-gray-500">{format(new Date(e.start), "p")}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditor(selectedDay, e)}
                          className="text-xs px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-xs px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {eventsForDay(selectedDay).length === 0 && (
                    <p className="text-sm text-gray-500">No events</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Editor Modal */}
      {editorOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditorOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {editingId ? "Edit Event" : "New Event"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">{format(selectedDay, "EEEE, MMMM d, yyyy")}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Title</label>
                <input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g., Study session, Exam deadline..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Time</label>
                <input
                  type="time"
                  value={hourInput}
                  onChange={(e) => setHourInput(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditorOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                {editingId ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
