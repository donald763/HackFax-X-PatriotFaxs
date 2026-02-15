"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  type SavedCourse,
  type SavedLevel,
  saveCourse,
  createCourseId,
  getCourseMastery,
} from "@/lib/course-store"
import { addEvent } from "@/lib/calendar-store"
import { LessonView } from "@/components/course/lesson-view"
import { FlashcardView } from "@/components/course/flashcard-view"
import { QuizView } from "@/components/course/quiz-view"
import { SummaryView } from "@/components/course/summary-view"
import { PracticeView } from "@/components/course/practice-view"
import { LiveDemoView } from "@/components/course/live-demo-view"
import { ContentLoader } from "@/components/course/content-loader"
import { PatriotAIChatbot } from "@/components/patriot-ai-chatbot"
import MatrixCalendar from "@/components/matrix-calendar"
import { KnowledgeTree } from "@/components/knowledge-tree"

// Icons
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}
function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
    </svg>
  )
}
function MapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  )
}
function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

const typeColors: Record<string, string> = {
  lesson: "bg-blue-50 text-blue-700",
  flashcards: "bg-violet-50 text-violet-700",
  quiz: "bg-amber-50 text-amber-700",
  summary: "bg-teal-50 text-teal-700",
  practice: "bg-orange-50 text-orange-700",
  "live-demo": "bg-emerald-50 text-emerald-700",
}

interface SkillRoadmapProps {
  topic: string
  materials: string[]
  proficiency?: number
  courseId?: string // pass to resume an existing course
  onBack: () => void
  attachments?: { data: string; mimeType: string; name: string }[]
}

export function SkillRoadmap({ topic, materials, proficiency = 1, courseId: existingCourseId, onBack, attachments = [] }: SkillRoadmapProps) {
  const [course, setCourse] = useState<SavedCourse | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your proficiency level...")
  const [contentGenProgress, setContentGenProgress] = useState<{ current: number; total: number; name: string } | null>(null)
  const [revealedLevels, setRevealedLevels] = useState(0)
  const [activeSkill, setActiveSkill] = useState<{ levelIdx: number; skillIdx: number } | null>(null)
  const fetchRef = useRef(false)
  // deadline prompt removed — generation proceeds without intermediate prompt

  // Load existing course or generate new one
  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true

    // Try to load existing course
    if (existingCourseId) {
      try {
        const raw = localStorage.getItem("studypilot_courses")
        const courses: SavedCourse[] = raw ? JSON.parse(raw) : []
        const found = courses.find((c) => c.id === existingCourseId)
        if (found) {
          setCourse({ ...found, lastAccessedAt: Date.now() })
          saveCourse({ ...found, lastAccessedAt: Date.now() })
          setLoading(false)
          return
        }
      } catch {}
    }

    // Generate a new course immediately when no existing course id
    generateCourse()
  }, [topic, materials, proficiency, existingCourseId])

  async function generateCourse(deadline?: number) {
    setLoading(true)
    const courseObj: SavedCourse = {
      id: existingCourseId ?? createCourseId(),
      topic,
      materials,
      proficiency,
      levels: [],
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      ...(deadline ? { deadline } : {}),
      matrixData: []
    }

    try {
      const res = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, materials, proficiency, attachments }),
      })

      if (!res.ok || !res.body) throw new Error("Stream failed")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            const eventType = line.slice(7).trim()
            // Next line should be data
            const dataIdx = lines.indexOf(line) + 1
            if (dataIdx < lines.length && lines[dataIdx].startsWith("data: ")) {
              const data = JSON.parse(lines[dataIdx].slice(6))
              handleStreamEvent(eventType, data, courseObj)
            }
          }
        }
      }

      // Parse any remaining buffer
      const remaining = buffer.split("\n")
      let currentEvent = ""
      for (const line of remaining) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim()
        } else if (line.startsWith("data: ") && currentEvent) {
          const data = JSON.parse(line.slice(6))
          handleStreamEvent(currentEvent, data, courseObj)
          currentEvent = ""
        }
      }
    } catch (err) {
      console.error("Course generation failed:", err)
      // Use fallback
      courseObj.levels = generateFallbackLevels(topic, materials)
    }

    // Save course
    saveCourse(courseObj)
    setCourse(courseObj)
    setLoading(false)
    // If a deadline was provided elsewhere, add it to the calendar
    try {
      if ((courseObj as any).deadline) {
        const start = new Date((courseObj as any).deadline)
        const end = new Date(start.getTime() + 60 * 60 * 1000)
        addEvent({ title: `Deadline: ${topic}`, start: start.toISOString(), end: end.toISOString(), courseId: courseObj.id, recurrence: "none" })
      }
    } catch {}

  }

  function handleStreamEvent(event: string, data: any, courseDraft: SavedCourse) {
    switch (event) {
      case "phase":
        setLoadingMessage(data.message)
        break
      case "roadmap":
        courseDraft.levels = (data.levels ?? []).map((l: any) => ({
          ...l,
          skills: l.skills.map((s: any) => ({ ...s, content: null })),
        }))
        // Show roadmap immediately while content generates
        setCourse({ ...courseDraft })
        setLoading(false)
        break
      case "progress":
        setContentGenProgress({ current: data.current, total: data.total, name: data.skillName })
        break
      case "content":
        if (courseDraft.levels[data.levelIdx]?.skills[data.skillIdx]) {
          courseDraft.levels[data.levelIdx].skills[data.skillIdx].content = data.content
          setCourse({ ...courseDraft })
          saveCourse({ ...courseDraft })
        }
        break
      case "done":
        setContentGenProgress(null)
        saveCourse({ ...courseDraft })
        break
    }
  }

  // Stagger reveal
  useEffect(() => {
    if (loading || !course) return
    if (revealedLevels >= course.levels.length) return
    const t = setTimeout(() => setRevealedLevels((prev) => prev + 1), 150)
    return () => clearTimeout(t)
  }, [loading, course, revealedLevels])

  function handleSkillClick(levelIdx: number, skillIdx: number) {
    const skill = course?.levels[levelIdx]?.skills[skillIdx]
    if (!skill || skill.status === "locked") return
    setActiveSkill({ levelIdx, skillIdx })
  }

  const handleContentComplete = useCallback(() => {
    if (!activeSkill || !course) return
    const skill = course.levels[activeSkill.levelIdx].skills[activeSkill.skillIdx]

    const updated: SavedCourse = {
      ...course,
      levels: course.levels.map((l) => ({ ...l, skills: [...l.skills] })),
      lastAccessedAt: Date.now(),
    }
    updated.levels[activeSkill.levelIdx].skills[activeSkill.skillIdx] = {
      ...skill,
      status: "completed",
    }

    // Unlock next skills
    const level = updated.levels[activeSkill.levelIdx]
    const allDone = level.skills.every((s) => s.status === "completed")

    if (!allDone) {
      const nextLocked = level.skills.findIndex((s) => s.status === "locked")
      if (nextLocked !== -1) {
        level.skills[nextLocked] = { ...level.skills[nextLocked], status: "available" }
      }
    } else {
      const nextLevelIdx = activeSkill.levelIdx + 1
      if (nextLevelIdx < updated.levels.length) {
        const nextLevel = updated.levels[nextLevelIdx]
        for (let i = 0; i < Math.min(2, nextLevel.skills.length); i++) {
          if (nextLevel.skills[i].status === "locked") {
            nextLevel.skills[i] = { ...nextLevel.skills[i], status: "available" }
          }
        }
      }
    }

    // Generate content for newly unlocked skills in background
    generateContentForNewSkills(updated)

    saveCourse(updated)
    setCourse(updated)
    setActiveSkill(null)
  }, [activeSkill, course])

  async function generateContentForNewSkills(courseData: SavedCourse) {
    for (const level of courseData.levels) {
      for (const skill of level.skills) {
        if (skill.status === "available" && !skill.content) {
          try {
            const res = await fetch("/api/generate-content", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ topic, skillName: skill.name, type: skill.type }),
            })
            if (res.ok) {
              const data = await res.json()
              skill.content = { data, type: skill.type, generatedAt: Date.now() }
              saveCourse(courseData)
              setCourse({ ...courseData })
            }
          } catch {}
        }
      }
    }
  }

  // Active content view
  if (activeSkill && course) {
    const skill = course.levels[activeSkill.levelIdx]?.skills[activeSkill.skillIdx]
    if (!skill) {
      return null
    }
    const viewProps = {
      onBack: () => setActiveSkill(null),
      onComplete: handleContentComplete,
    }

    // If content is pre-generated, use it directly
    if (skill.content?.data) {
      const courseContent = (
        <>
          {skill.type === "flashcards" && <FlashcardView data={skill.content.data} {...viewProps} />}
          {skill.type === "quiz" && <QuizView data={skill.content.data} {...viewProps} />}
          {skill.type === "summary" && <SummaryView data={skill.content.data} {...viewProps} />}
          {skill.type === "practice" && <PracticeView data={skill.content.data} {...viewProps} />}
          {skill.type === "live-demo" && <LiveDemoView data={skill.content.data} topic={topic} {...viewProps} />}
          {!["flashcards", "quiz", "summary", "practice", "live-demo"].includes(skill.type) && <LessonView data={skill.content.data} {...viewProps} />}
        </>
      )
      
      return (
        <div className="flex min-h-svh bg-background">
          <div className="flex-1 overflow-auto">
            <div className="min-h-svh bg-background">
              {courseContent}
            </div>
          </div>
          <PatriotAIChatbot variant="sidebar" />
        </div>
      )
    }

    // Fallback: generate on-demand
    return (
      <div className="flex min-h-svh bg-background">
        <div className="flex-1 overflow-auto">
          <div className="min-h-svh bg-background">
            <ContentLoader topic={topic} skillName={skill.name} type={skill.type} {...viewProps} />
          </div>
        </div>
        <PatriotAIChatbot variant="sidebar" />
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5 px-6 text-center max-w-sm">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-[3px] border-muted animate-spin" style={{ borderTopColor: "hsl(var(--primary))" }} />
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <MapIcon />
            </div>
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Building your course</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{loadingMessage}</p>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    )
  }

  if (!course) return null

  const totalSkills = course.levels.reduce((a, l) => a + l.skills.length, 0)
  const mastery = getCourseMastery(course)
  const totalCompleted = course.levels.reduce(
    (a, l) => a + l.skills.filter((s) => s.status === "completed").length, 0
  )

  return (
    <div className="min-h-svh bg-background">
      {/* deadline prompt removed */}
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Go back">
              <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LeafIcon />
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">StudyPilot</span>
            </div>
          </div>
          <Badge variant="secondary" className="font-normal text-xs">
            {totalCompleted}/{totalSkills} completed
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Title + Mastery */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapIcon />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground text-balance">
            {topic}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {totalSkills} skills across {course.levels.length} levels
          </p>

          {/* deadline tracker removed */}

          {/* Mastery Ring */}
          <div className="mx-auto mt-4 flex flex-col items-center gap-2">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - mastery / 100)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-foreground">{mastery}%</span>
                <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Mastery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Tree */}
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <KnowledgeTree course={course} onLevelClick={handleSkillClick} />
        </div>

        {/* Content generation banner */}
        {contentGenProgress && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Generating lesson content ({contentGenProgress.current}/{contentGenProgress.total})
                </p>
                <p className="text-xs text-muted-foreground">{contentGenProgress.name}</p>
              </div>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-primary/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(contentGenProgress.current / contentGenProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Skill Tree */}
        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-8">
            {course.levels.map((level, levelIdx) => {
              const isRevealed = levelIdx < revealedLevels
              const isFirst = levelIdx === 0
              const completedCount = level.skills.filter((s) => s.status === "completed").length
              const availableCount = level.skills.filter((s) => s.status === "available").length
              const allDone = completedCount === level.skills.length

              return (
                <div
                  key={level.name + levelIdx}
                  className="relative pl-14 md:pl-20"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                  }}
                >
                  {/* Level node */}
                  <div className={`absolute left-3 md:left-5 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    allDone ? "border-primary bg-primary text-primary-foreground"
                      : isFirst || availableCount > 0 ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                  }`}>
                    {allDone ? <CheckIcon /> : levelIdx + 1}
                  </div>

                  {/* Level header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-semibold text-foreground">{level.name}</h2>
                      {isFirst && completedCount === 0 && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">Start Here</Badge>
                      )}
                      {allDone && (
                        <Badge className="bg-green-50 text-green-700 border-0 text-xs">Complete</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{level.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 flex-1 max-w-48 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${(completedCount / level.skills.length) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{completedCount}/{level.skills.length}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-col gap-2">
                    {level.skills.map((skill, skillIdx) => {
                      const isCompleted = skill.status === "completed"
                      const isAvailable = skill.status === "available"
                      const hasContent = !!skill.content?.data
                      const typeColor = typeColors[skill.type] ?? typeColors.lesson

                      return (
                        <button
                          key={skill.name + skillIdx}
                          type="button"
                          disabled={skill.status === "locked"}
                          onClick={() => handleSkillClick(levelIdx, skillIdx)}
                          className={`group flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                            isCompleted ? "border-primary/30 bg-primary/5"
                              : isAvailable ? "border-border bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-md cursor-pointer"
                                : "border-border/50 bg-muted/30 opacity-50 cursor-not-allowed"
                          }`}
                          style={{
                            opacity: isRevealed ? (skill.status === "locked" ? 0.5 : 1) : 0,
                            transform: isRevealed ? "translateX(0)" : "translateX(12px)",
                            transition: `opacity 0.4s ease-out ${skillIdx * 0.06}s, transform 0.4s ease-out ${skillIdx * 0.06}s`,
                          }}
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isCompleted ? "bg-primary text-primary-foreground"
                              : isAvailable ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}>
                            {isCompleted ? <CheckIcon /> : isAvailable ? <PlayIcon /> : <LockIcon />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${skill.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>
                                {skill.name}
                              </p>
                              <span className={`inline-flex h-5 items-center rounded-full px-1.5 text-[10px] font-medium ${typeColor}`}>
                                {skill.type}
                              </span>
                              {isAvailable && hasContent && (
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" title="Content ready" />
                              )}
                            </div>
                            {skill.description && (
                              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{skill.description}</p>
                            )}
                          </div>
                          {skill.duration && (
                            <span className="hidden sm:block text-xs text-muted-foreground">{skill.duration}</span>
                          )}
                          {isAvailable && (
                            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                              {hasContent ? "Start" : "Generate"}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center pb-12">
          <p className="text-sm text-muted-foreground">Click any available skill to start learning</p>
          <div className="flex gap-3">
            <Link href={`/practice?topic=${encodeURIComponent(topic)}`}>
              <Button variant="outline" className="h-11 px-8 gap-2 font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Practice Mode
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* PatriotAI Chatbot - Modal variant on roadmap page */}
      <PatriotAIChatbot variant="modal" />
      {/* Matrix calendar (separate from course view) */}
      <MatrixCalendar openLabel="Calendar" />
    </div>
  )
}

function generateFallbackLevels(topic: string, materials: string[]): SavedLevel[] {
  const types = materials.length > 0
    ? materials.map((m) => {
        if (m.toLowerCase().includes("flash")) return "flashcards"
        if (m.toLowerCase().includes("quiz")) return "quiz"
        if (m.toLowerCase().includes("summar")) return "summary"
        if (m.toLowerCase().includes("practice") || m.toLowerCase().includes("problem")) return "practice"
        return "lesson"
      })
    : ["lesson", "flashcards", "quiz", "summary", "practice"]
  const pick = (i: number) => types[i % types.length]

  return [
    { name: "Foundation", description: "Core concepts and terminology", icon: "foundation", skills: [
      { name: `Introduction to ${topic}`, description: "Get started with the basics", type: pick(0), duration: "10 min", status: "available", content: null },
      { name: "Key Terminology", description: "Essential terms and definitions", type: pick(1), duration: "8 min", status: "available", content: null },
      { name: "Fundamental Principles", description: "Core ideas", type: pick(2), duration: "12 min", status: "locked", content: null },
    ]},
    { name: "Core Knowledge", description: "Build deep understanding", icon: "core", skills: [
      { name: "Core Theories & Models", description: "Key frameworks", type: pick(0), duration: "15 min", status: "locked", content: null },
      { name: "Important Relationships", description: "How concepts connect", type: pick(1), duration: "10 min", status: "locked", content: null },
    ]},
    { name: "Applied Skills", description: "Put knowledge into practice", icon: "applied", skills: [
      { name: "Problem Solving", description: "Apply what you've learned", type: "practice", duration: "15 min", status: "locked", content: null },
      { name: "Real-World Applications", description: "See it in action", type: pick(0), duration: "12 min", status: "locked", content: null },
    ]},
    { name: "Mastery", description: "Demonstrate complete understanding", icon: "mastery", skills: [
      { name: "Comprehensive Review", description: "Put it all together", type: "summary", duration: "10 min", status: "locked", content: null },
      { name: "Final Assessment", description: "Test your knowledge", type: "quiz", duration: "15 min", status: "locked", content: null },
    ]},
  ]
}
