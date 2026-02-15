"use client"

import { useState } from "react"
import Link from "next/link"

interface LiveDemoData {
  title: string
  exerciseName: string
  instructions: string
  tips: string[]
  commonMistakes: string[]
  targetDuration: string
}

interface LiveDemoViewProps {
  data: LiveDemoData
  topic?: string
  onBack: () => void
  onComplete: () => void
}

export function LiveDemoView({ data, topic, onBack, onComplete }: LiveDemoViewProps) {
  const [started, setStarted] = useState(false)

  // Build practice URL with params
  const practiceUrl = `/practice?exercise=${encodeURIComponent(data.exerciseName)}${topic ? `&topic=${encodeURIComponent(topic)}` : ""}`

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 text-[10px] font-medium text-emerald-700">
              live demo
            </span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">{data.title}</h1>
        </div>
      </div>

      {/* Instructions card */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
          </div>
          <h2 className="text-base font-semibold text-foreground">How to Perform</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{data.instructions}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Target duration: {data.targetDuration}
        </div>
      </div>

      {/* Tips */}
      {data.tips && data.tips.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Tips for Success
          </h2>
          <ul className="space-y-2">
            {data.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common mistakes */}
      {data.commonMistakes && data.commonMistakes.length > 0 && (
        <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/50 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
            Common Mistakes
          </h2>
          <ul className="space-y-2">
            {data.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href={practiceUrl}
          className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#256b29] hover:shadow-xl"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Open Practice Mode
        </Link>
        <button
          onClick={onComplete}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Mark as completed
        </button>
      </div>
    </div>
  )
}
