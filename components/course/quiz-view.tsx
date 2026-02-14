"use client"

import { useState } from "react"

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizData {
  title: string
  questions: Question[]
}

interface QuizViewProps {
  data: QuizData
  onBack: () => void
  onComplete: () => void
}

export function QuizView({ data, onBack, onComplete }: QuizViewProps) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = data.questions[currentQ]
  const total = data.questions.length
  const isCorrect = selectedAnswer === question?.correctIndex

  function handleSelect(index: number) {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  function handleNext() {
    if (currentQ < total - 1) {
      setCurrentQ((q) => q + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setFinished(true)
    }
  }

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
        <span className="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">
          Quiz
        </span>
      </div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
        {data.title}
      </h1>

      {!finished ? (
        <>
          {/* Progress */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${((currentQ + 1) / total) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {currentQ + 1}/{total}
            </span>
          </div>

          {/* Question */}
          <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-[15px] font-medium leading-relaxed text-foreground">
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, i) => {
              let style = "border-border bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
              if (showResult) {
                if (i === question.correctIndex) {
                  style = "border-green-300 bg-green-50"
                } else if (i === selectedAnswer) {
                  style = "border-red-300 bg-red-50"
                } else {
                  style = "border-border bg-card opacity-50"
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${style}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      showResult && i === question.correctIndex
                        ? "border-green-500 bg-green-500 text-white"
                        : showResult && i === selectedAnswer
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-foreground">{option}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div
              className={`mt-4 rounded-xl border p-4 ${
                isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <p className={`mb-1 text-xs font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-foreground">{question.explanation}</p>
            </div>
          )}

          {/* Next */}
          {showResult && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleNext}
                className="h-10 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                {currentQ < total - 1 ? "Next Question" : "See Results"}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Results */
        <div className="flex flex-col items-center py-12 text-center">
          <div
            className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
              score / total >= 0.8
                ? "bg-green-100 text-green-600"
                : score / total >= 0.5
                  ? "bg-amber-100 text-amber-600"
                  : "bg-red-100 text-red-600"
            }`}
          >
            <span className="text-2xl font-bold">{Math.round((score / total) * 100)}%</span>
          </div>
          <h2 className="mb-1 text-xl font-semibold text-foreground">
            {score / total >= 0.8 ? "Great Job!" : score / total >= 0.5 ? "Good Effort!" : "Keep Studying!"}
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            You got {score} out of {total} correct
          </p>
          <button
            onClick={onComplete}
            className="h-11 rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  )
}
