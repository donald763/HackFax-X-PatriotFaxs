"use client"

import { useState } from "react"

interface Problem {
  problem: string
  hint: string
  solution: string
}

interface PracticeData {
  title: string
  problems: Problem[]
}

interface PracticeViewProps {
  data: PracticeData
  onBack: () => void
  onComplete: () => void
}

export function PracticeView({ data, onBack, onComplete }: PracticeViewProps) {
  const [currentP, setCurrentP] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const problem = data.problems[currentP]
  const total = data.problems.length

  function handleNext() {
    setShowHint(false)
    setShowSolution(false)
    if (currentP < total - 1) {
      setCurrentP((p) => p + 1)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
        </svg>
        Back to roadmap
      </button>

      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-full bg-orange-50 px-2.5 text-xs font-medium text-orange-700">
          Practice
        </span>
      </div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
        {data.title}
      </h1>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((currentP + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Problem {currentP + 1}/{total}
        </span>
      </div>

      {/* Problem */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-[15px] font-medium leading-relaxed text-foreground">
          {problem.problem}
        </p>
      </div>

      {/* Hint */}
      {!showHint ? (
        <button
          onClick={() => setShowHint(true)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          Show Hint
        </button>
      ) : (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-1 text-xs font-semibold text-amber-700">Hint</p>
          <p className="text-sm text-foreground">{problem.hint}</p>
        </div>
      )}

      {/* Solution */}
      {!showSolution ? (
        <button
          onClick={() => setShowSolution(true)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Show Solution
        </button>
      ) : (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="mb-1 text-xs font-semibold text-green-700">Solution</p>
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
            {problem.solution}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-center gap-3">
        {currentP < total - 1 ? (
          <button
            onClick={handleNext}
            className="h-10 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            Next Problem
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="h-11 rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  )
}
