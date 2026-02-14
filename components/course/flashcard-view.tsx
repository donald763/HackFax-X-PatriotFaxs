"use client"

import { useState } from "react"

interface Card {
  front: string
  back: string
}

interface FlashcardData {
  title: string
  cards: Card[]
}

interface FlashcardViewProps {
  data: FlashcardData
  onBack: () => void
  onComplete: () => void
}

export function FlashcardView({ data, onBack, onComplete }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<number>>(new Set())

  const card = data.cards[currentIndex]
  const total = data.cards.length
  const progress = ((currentIndex + 1) / total) * 100

  function next(markKnown: boolean) {
    if (markKnown) {
      setKnown((prev) => new Set(prev).add(currentIndex))
    }
    setFlipped(false)
    if (currentIndex < total - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 150)
    }
  }

  const allDone = currentIndex === total - 1 && (flipped || known.has(currentIndex))

  return (
    <div className="mx-auto max-w-xl px-6 py-8">
      {/* Header */}
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
        <span className="inline-flex h-6 items-center rounded-full bg-violet-50 px-2.5 text-xs font-medium text-violet-700">
          Flashcards
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
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="group relative cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm min-h-[220px] flex flex-col items-center justify-center text-center backface-hidden">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Question
            </p>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {card.front}
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              Tap to reveal answer
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 min-h-[220px] flex flex-col items-center justify-center text-center backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
              Answer
            </p>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {card.back}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center gap-3">
        {flipped && currentIndex < total - 1 && (
          <>
            <button
              onClick={() => next(false)}
              className="h-10 rounded-xl border border-border bg-card px-6 text-sm font-medium text-muted-foreground transition-all hover:bg-accent active:scale-[0.98]"
            >
              Study Again
            </button>
            <button
              onClick={() => next(true)}
              className="h-10 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              Got It
            </button>
          </>
        )}
        {allDone && (
          <button
            onClick={onComplete}
            className="h-11 rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            Complete — {known.size}/{total} Known
          </button>
        )}
      </div>

      {/* Inline style for backface-hidden */}
      <style jsx>{`
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
