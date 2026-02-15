"use client"

import { useState, useEffect, useRef } from "react"
import { LessonView } from "./lesson-view"
import { FlashcardView } from "./flashcard-view"
import { QuizView } from "./quiz-view"
import { SummaryView } from "./summary-view"
import { PracticeView } from "./practice-view"
import { InteractiveKnowledgeTree } from "@/components/mindmap"
import { buildConceptNetTree } from "@/lib/conceptnet-tree"

interface ContentLoaderProps {
  topic: string
  skillName: string
  type: string
  onBack: () => void
  onComplete: () => void
}

export function ContentLoader({ topic, skillName, type, onBack, onComplete }: ContentLoaderProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    async function load() {
      try {
        if (type === "mindmap") {
          const tree = await buildConceptNetTree(skillName || topic, 2, 4)
          setData(tree)
        } else {
          const res = await fetch("/api/generate-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, skillName, type }),
          })
          if (!res.ok) throw new Error(`Failed: ${res.status}`)
          const json = await res.json()
          setData(json)
        }
      } catch (err: any) {
        setError(err.message)
      }
      setLoading(false)
    }

    load()
  }, [topic, skillName, type])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-[3px] border-muted animate-spin" style={{ borderTopColor: "hsl(var(--primary))" }} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Generating your content</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Creating personalized {type} for &ldquo;{skillName}&rdquo;...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={onBack}
            className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const props = { data, onBack, onComplete }

  switch (type) {
    case "flashcards":
      return <FlashcardView {...props} />
    case "quiz":
      return <QuizView {...props} />
    case "summary":
      return <SummaryView {...props} />
    case "practice":
      return <PracticeView {...props} />
    case "mindmap":
      return data ? <InteractiveKnowledgeTree root={data} /> : null
    default:
      return <LessonView {...props} />
  }
}
