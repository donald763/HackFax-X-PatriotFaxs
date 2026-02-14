"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const TRENDING_TOPICS = [
  { name: "Machine Learning", count: "12.4k studying", color: "bg-primary" },
  { name: "Organic Chemistry", count: "8.9k studying", color: "bg-primary" },
  { name: "Linear Algebra", count: "7.2k studying", color: "bg-primary" },
  { name: "US History", count: "6.1k studying", color: "bg-primary" },
  { name: "Microeconomics", count: "5.8k studying", color: "bg-primary" },
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

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

export function BrowseTopics() {
  const [search, setSearch] = useState("")

  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    topics: cat.topics.filter((t) =>
      t.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => (search === "" ? true : cat.topics.length > 0))

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
            Browse topics or search for something specific
          </p>
          <div className="relative mt-5">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SearchIcon />
            </div>
            <Input
              type="text"
              placeholder="Search topics, subjects, courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-11 text-base"
            />
          </div>
        </div>

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

          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                <SearchIcon />
              </div>
              <p className="text-sm font-medium text-foreground">
                No topics found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {"Try a different search term"}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
