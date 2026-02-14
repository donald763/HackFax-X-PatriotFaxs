"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCourses, deleteCourse, getCourseMastery, type SavedCourse } from "@/lib/course-store"
import MatrixCalendar from "@/components/matrix-calendar"

const TRENDING_TOPICS = [
  { name: "Machine Learning", count: "12.4k studying" },
  { name: "Organic Chemistry", count: "8.9k studying" },
  { name: "Linear Algebra", count: "7.2k studying" },
  { name: "US History", count: "6.1k studying" },
  { name: "Microeconomics", count: "5.8k studying" },
]

const CATEGORIES = [
  {
    title: "Science & Engineering",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
      </svg>
    ),
    topics: ["Physics", "Chemistry", "Biology", "Computer Science", "Electrical Engineering", "Mechanical Engineering"],
  },
  {
    title: "Mathematics",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="M17 7 7 17" />
      </svg>
    ),
    topics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math", "Differential Equations", "Number Theory"],
  },
  {
    title: "Humanities",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    topics: ["History", "Philosophy", "Literature", "Art History", "Linguistics", "Religious Studies"],
  },
  {
    title: "Business & Economics",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    topics: ["Microeconomics", "Macroeconomics", "Finance", "Marketing", "Accounting", "Management"],
  },
  {
    title: "Health & Medicine",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2Z" />
      </svg>
    ),
    topics: ["Anatomy", "Pharmacology", "Pathology", "Neuroscience", "Public Health", "Nutrition"],
  },
  {
    title: "Languages",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    ),
    topics: ["Spanish", "French", "Mandarin", "German", "Japanese", "Arabic"],
  },
]

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

interface BrowseTopicsProps {
  onSelectTopic: (topic: string) => void
  onResumeCourse?: (courseId: string, topic: string) => void
}

export function BrowseTopics({ onSelectTopic, onResumeCourse }: BrowseTopicsProps) {
  const [search, setSearch] = useState("")
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])

  useEffect(() => {
    setSavedCourses(getCourses())
  }, [])

  function handleDeleteCourse(id: string) {
    deleteCourse(id)
    setSavedCourses(getCourses())
  }

  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    topics: cat.topics.filter((t) =>
      t.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => (search === "" ? true : cat.topics.length > 0))

  const hasCustomSearch = search.trim().length > 0 && filteredCategories.length === 0

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      onSelectTopic(search.trim())
    }
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LeafIcon />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              StudyPilot
            </span>
          </div>
          <Badge variant="secondary" className="font-normal text-xs">
            Guest
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Search */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            What would you like to study?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Browse topics below or search for anything you want to learn
          </p>
          <form onSubmit={handleSearchSubmit} className="relative mt-5">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SearchIcon />
            </div>
            <Input
              type="text"
              placeholder="Search anything... biology, cooking, philosophy, anything"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-11 pr-24 text-base"
            />
            {search.trim() && (
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 gap-1.5 text-xs"
              >
                Study this
                <ArrowRightIcon />
              </Button>
            )}
          </form>
        </div>

        {/* My Courses */}
        {savedCourses.length > 0 && search === "" && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                My Courses
              </h2>
              <Badge variant="secondary" className="text-[10px] font-normal ml-1">
                {savedCourses.length}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedCourses.map((course) => {
                const mastery = getCourseMastery(course)
                const totalSkills = course.levels.reduce((a, l) => a + l.skills.length, 0)
                const completed = course.levels.reduce((a, l) => a + l.skills.filter((s) => s.status === "completed").length, 0)
                const circumference = 2 * Math.PI * 18

                return (
                  <div
                    key={course.id}
                    className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer"
                    onClick={() => onResumeCourse?.(course.id, course.topic)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Mini mastery ring */}
                      <div className="relative h-11 w-11 shrink-0">
                        <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
                          <circle cx="22" cy="22" r="18" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                          <circle
                            cx="22" cy="22" r="18" fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference * (1 - mastery / 100)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-foreground">{mastery}%</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{course.topic}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {completed}/{totalSkills} skills completed
                        </p>
                        <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${mastery}%` }} />
                        </div>
                        {/* Matrix calendar available on the search/browse screen */}
                        <MatrixCalendar openLabel="Calendar" />
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id) }}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                      aria-label="Delete course"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Custom search result - when no categories match */}
        {hasCustomSearch && (
          <section className="mb-10">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                <SearchIcon />
              </div>
              <p className="text-base font-medium text-foreground">
                {'Ready to study "'}
                <span className="text-primary">{search.trim()}</span>
                {'"'}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {"This topic isn't in our catalog yet, but we can generate study materials for it."}
              </p>
              <Button
                className="mt-5 gap-2"
                onClick={() => onSelectTopic(search.trim())}
              >
                Start studying {search.trim()}
                <ArrowRightIcon />
              </Button>
            </div>
          </section>
        )}

        {/* Trending */}
        {search === "" && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-primary">
                <TrendingIcon />
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Trending Now
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((topic) => (
                <button
                  key={topic.name}
                  type="button"
                  onClick={() => onSelectTopic(topic.name)}
                  className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {topic.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {topic.count}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {filteredCategories.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              {search ? "Search Results" : "Browse by Subject"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((cat) => (
                <Card key={cat.title} className="group hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {cat.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {cat.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.topics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => onSelectTopic(topic)}
                          className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
