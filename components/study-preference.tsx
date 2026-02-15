"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const MATERIALS = [
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Quick review with spaced repetition",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    id: "summaries",
    label: "Summaries",
    description: "Condensed notes and key takeaways",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
  {
    id: "quizzes",
    label: "Practice Quizzes",
    description: "Test your knowledge with AI questions",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    id: "videos",
    label: "Video Explanations",
    description: "Visual learning with curated videos",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    id: "problems",
    label: "Practice Problems",
    description: "Hands-on exercises and worked solutions",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="m9 9.5 2 2 4-4" />
      </svg>
    ),
  },
]

interface StudyPreferenceProps {
  topic: string
  onComplete: (preferences: string[]) => void
  onBack?: () => void
}

export function StudyPreference({ topic, onComplete, onBack }: StudyPreferenceProps) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-lg">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
            Back to topics
          </button>
        )}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
            Studying
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            {topic}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {"How would you like to study this topic? Pick your preferred materials."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MATERIALS.map((mat) => {
            const isActive = selected.includes(mat.id)
            return (
              <button
                key={mat.id}
                type="button"
                onClick={() => toggle(mat.id)}
                className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {mat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{mat.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {mat.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            className="w-full h-11 font-medium"
            disabled={selected.length === 0}
            onClick={() => onComplete(selected)}
          >
            {selected.length === 0
              ? "Select at least one"
              : `Start studying with ${selected.length} material${selected.length > 1 ? "s" : ""}`}
          </Button>
          <button
            type="button"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => onComplete([])}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
