"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const CONFIDENCE_LEVELS = [
  {
    level: 1,
    label: "Complete Beginner",
    description: "I have no experience with this topic",
    color: "#ef5350",
  },
  {
    level: 2,
    label: "Some Awareness",
    description: "I've heard of it but know very little",
    color: "#ff7043",
  },
  {
    level: 3,
    label: "Basic Understanding",
    description: "I know the fundamentals but need more depth",
    color: "#ffa726",
  },
  {
    level: 4,
    label: "Comfortable",
    description: "I can handle most concepts but have gaps",
    color: "#66bb6a",
  },
  {
    level: 5,
    label: "Advanced",
    description: "I have strong knowledge and want to master it",
    color: "#42a5f5",
  },
]

function generateQuiz(topic: string) {
  return [
    {
      question: `Which best describes the primary focus of ${topic}?`,
      options: [
        "Understanding theoretical principles and core frameworks",
        "Memorizing historical dates and events",
        "Only practical hands-on applications",
        "Learning a single narrow technique",
      ],
      correct: 0,
    },
    {
      question: `When approaching a new concept in ${topic}, what is the most effective first step?`,
      options: [
        "Skipping straight to advanced material",
        "Understanding the foundational terminology and definitions",
        "Memorizing formulas without context",
        "Watching only one source of information",
      ],
      correct: 1,
    },
    {
      question: `Which learning strategy is most effective for mastering ${topic}?`,
      options: [
        "Cramming everything the night before",
        "Passive re-reading of notes",
        "Active recall combined with spaced repetition",
        "Only attending lectures without practice",
      ],
      correct: 2,
    },
    {
      question: `How do experts in ${topic} typically build upon their knowledge?`,
      options: [
        "By avoiding connections to other fields",
        "By only studying what they already know",
        "By ignoring new research and developments",
        "By connecting concepts across related domains and applying critical thinking",
      ],
      correct: 3,
    },
    {
      question: `What indicates deep understanding of a concept in ${topic}?`,
      options: [
        "Being able to recite the textbook word-for-word",
        "Being able to explain it simply to someone else",
        "Knowing only the history of the concept",
        "Being able to name the discoverer of each concept",
      ],
      correct: 1,
    },
  ]
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0-1 .5A3.5 3.5 0 0 0 4 10a3.5 3.5 0 0 0 .5 1.5A4 4 0 0 0 3 15a4 4 0 0 0 2.5 3.7A3.5 3.5 0 0 0 9 22h0" />
      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 1 .5A3.5 3.5 0 0 1 20 10a3.5 3.5 0 0 1-.5 1.5A4 4 0 0 1 21 15a4 4 0 0 1-2.5 3.7A3.5 3.5 0 0 1 15 22h0" />
      <path d="M12 2v20" />
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

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

interface ProficiencyAssessmentProps {
  topic: string
  onComplete: (proficiency: number) => void
  onBack?: () => void
}

export function ProficiencyAssessment({ topic, onComplete, onBack }: ProficiencyAssessmentProps) {
  const [mode, setMode] = useState<"choose" | "confidence" | "quiz" | "quizResult">("choose")
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const quiz = generateQuiz(topic)

  function handleConfidenceSubmit() {
    if (selectedLevel !== null) {
      onComplete(selectedLevel)
    }
  }

  function handleQuizAnswer(answerIdx: number) {
    if (showFeedback) return
    setSelectedAnswer(answerIdx)
    setShowFeedback(true)

    setTimeout(() => {
      const newAnswers = [...quizAnswers, answerIdx]
      setQuizAnswers(newAnswers)
      setSelectedAnswer(null)
      setShowFeedback(false)

      if (quizIndex < quiz.length - 1) {
        setQuizIndex(quizIndex + 1)
      } else {
        setMode("quizResult")
      }
    }, 1200)
  }

  function getQuizScore() {
    return quizAnswers.reduce<number>(
      (score, answer, idx) => score + (answer === quiz[idx]?.correct ? 1 : 0),
      0
    )
  }

  function getProficiencyFromScore(score: number) {
    const pct = score / quiz.length
    if (pct >= 0.8) return 5
    if (pct >= 0.6) return 4
    if (pct >= 0.4) return 3
    if (pct >= 0.2) return 2
    return 1
  }

  // Choose mode: confidence or quiz
  if (mode === "choose") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
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
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BrainIcon />
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
              Proficiency Check
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              How well do you know{" "}
              <span className="text-primary">{topic}</span>?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Help us personalize your learning path by assessing your current level.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Card
              className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-sm"
              onClick={() => setMode("confidence")}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20V10" />
                    <path d="M18 20V4" />
                    <path d="M6 20v-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Rate My Confidence</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Self-assess your knowledge level on a 1-5 scale
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  <ArrowRightIcon />
                </div>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-sm"
              onClick={() => setMode("quiz")}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Take a Quick Quiz</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    5 questions to gauge your proficiency level
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  <ArrowRightIcon />
                </div>
              </CardContent>
            </Card>
          </div>

          <button
            type="button"
            className="mt-6 w-full text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            onClick={() => onComplete(0)}
          >
            Skip assessment
          </button>
        </div>
      </div>
    )
  }

  // Confidence self-rating
  if (mode === "confidence") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Rate your confidence
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              How familiar are you with{" "}
              <span className="text-primary font-medium">{topic}</span>?
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {CONFIDENCE_LEVELS.map((cl) => {
              const isActive = selectedLevel === cl.level
              return (
                <button
                  key={cl.level}
                  type="button"
                  onClick={() => setSelectedLevel(cl.level)}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
                  }`}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors"
                    style={{
                      backgroundColor: isActive ? cl.color : undefined,
                      color: isActive ? "#fff" : cl.color,
                      border: isActive ? "none" : `1.5px solid ${cl.color}40`,
                    }}
                  >
                    {cl.level}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{cl.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cl.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              className="w-full h-11 gap-2 font-medium"
              disabled={selectedLevel === null}
              onClick={handleConfidenceSubmit}
            >
              Continue
              <ArrowRightIcon />
            </Button>
            <button
              type="button"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMode("choose")}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz mode
  if (mode === "quiz") {
    const currentQ = quiz[quizIndex]
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => { setMode("choose"); setQuizIndex(0); setQuizAnswers([]); }}
              >
                Back
              </button>
              <span className="text-xs font-medium text-muted-foreground">
                {quizIndex + 1} of {quiz.length}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-8">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${((quizIndex) / quiz.length) * 100}%` }}
              />
            </div>
            <h2 className="text-lg font-semibold text-foreground leading-relaxed text-balance">
              {currentQ.question}
            </h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx
              const isCorrect = idx === currentQ.correct
              let borderClass = "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
              let iconEl = null

              if (showFeedback && isSelected && isCorrect) {
                borderClass = "border-green-400 bg-green-50"
                iconEl = <span className="text-green-600 shrink-0"><CheckCircleIcon /></span>
              } else if (showFeedback && isSelected && !isCorrect) {
                borderClass = "border-red-400 bg-red-50"
                iconEl = <span className="text-red-500 shrink-0"><XCircleIcon /></span>
              } else if (showFeedback && isCorrect) {
                borderClass = "border-green-400/50 bg-green-50/50"
                iconEl = <span className="text-green-600/50 shrink-0"><CheckCircleIcon /></span>
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={showFeedback}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${borderClass} ${
                    showFeedback ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <p className="text-sm font-medium text-foreground flex-1">{option}</p>
                  {iconEl}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Quiz results
  if (mode === "quizResult") {
    const score = getQuizScore()
    const proficiency = getProficiencyFromScore(score)
    const pct = Math.round((score / quiz.length) * 100)
    const level = CONFIDENCE_LEVELS[proficiency - 1]

    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: `${level.color}18` }}
          >
            <span className="text-3xl font-bold" style={{ color: level.color }}>
              {score}/{quiz.length}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Quiz Complete
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            You scored {pct}% -- your proficiency level is{" "}
            <span className="font-medium" style={{ color: level.color }}>{level.label}</span>
          </p>

          {/* Visual breakdown */}
          <div className="mt-6 flex flex-col gap-1.5">
            {quiz.map((q, idx) => {
              const correct = quizAnswers[idx] === q.correct
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className={`shrink-0 ${correct ? "text-green-600" : "text-red-500"}`}>
                    {correct ? <CheckCircleIcon /> : <XCircleIcon />}
                  </span>
                  <p className="text-xs text-muted-foreground text-left truncate flex-1">
                    {q.question}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              className="w-full h-11 gap-2 font-medium"
              onClick={() => onComplete(proficiency)}
            >
              Continue to roadmap
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
