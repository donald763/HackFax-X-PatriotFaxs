"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface PracticeExamViewProps {
  topic: string
  skills: Array<{ name: string; completed: boolean }>
  onBack: () => void
  onComplete: (score: number) => void
}

export function PracticeExamView({ topic, skills, onBack, onComplete }: PracticeExamViewProps) {
  const [examStarted, setExamStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  // Generate practice exam questions from all skills
  const generateExam = async () => {
    setLoading(true)
    try {
      const skillsList = skills.map((s) => s.name).join(", ")

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "practice-exam",
          skillName: `Comprehensive Exam on ${topic}`,
          topic: topic,
          context: `Generate a comprehensive practice exam covering all these subtopics: ${skillsList}. Create 10 multiple-choice questions that test understanding of the key concepts across all these areas.`,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate exam")
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (err) {
      console.error("Error generating exam:", err)
      setQuestions(generateFallbackExam())
    } finally {
      setLoading(false)
    }
  }

  // Fallback exam if generation fails
  const generateFallbackExam = (): Question[] => [
    {
      id: "1",
      question: `What are the key concepts in ${topic}?`,
      options: [
        "Fundamental principles and core topics",
        "Random information",
        "Unrelated concepts",
        "None of the above",
      ],
      correctAnswer: "Fundamental principles and core topics",
      explanation: "The key concepts form the foundation of understanding.",
    },
  ]

  const handleStartExam = () => {
    setExamStarted(true)
    generateExam()
  }

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    let correctCount = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++
      }
    })
    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)
  }

  if (!examStarted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-amber-600"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-3">Practice Exam</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Test your knowledge on all topics covered in this course. This comprehensive exam covers all {skills.length} subtopics.
          </p>

          <div className="mb-8 space-y-2">
            <div className="text-sm font-medium text-foreground">Topics included:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.slice(0, 5).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={handleStartExam} className="h-11 px-8" size="lg">
            {loading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                </svg>
                Generating Exam...
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-2"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start Exam
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (showResults) {
    const correctCount = Object.entries(answers).filter(
      ([idx, ans]) => ans === questions[parseInt(idx)]?.correctAnswer
    ).length

    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to roadmap
        </button>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full ${
                score >= 70 ? "bg-green-50" : "bg-amber-50"
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl font-bold ${score >= 70 ? "text-green-600" : "text-amber-600"}`}>
                  {score}%
                </div>
                <div className={`text-xs font-medium ${score >= 70 ? "text-green-600" : "text-amber-600"}`}>
                  Score
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {score >= 70 ? "Great Job! 🎉" : "Keep Learning"}
          </h2>
          <p className="text-muted-foreground mb-6">
            You got {correctCount} out of {questions.length} questions correct
          </p>

          <div className="mb-8 space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="text-left rounded-lg border border-border p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      answers[idx] === q.correctAnswer
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {answers[idx] === q.correctAnswer ? "✓" : "✗"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your answer: <span className="font-medium">{answers[idx] || "Not answered"}</span>
                    </p>
                    {answers[idx] !== q.correctAnswer && (
                      <p className="text-xs text-foreground mt-1">
                        Correct answer: <span className="font-medium text-green-700">{q.correctAnswer}</span>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 italic">{q.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={onBack} variant="outline">
              Back to Roadmap
            </Button>
            <Button onClick={() => { setExamStarted(false); setAnswers({}); setShowResults(false); setCurrentQuestion(0); }}>
              Retake Exam
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
          <p className="text-muted-foreground">Generating practice exam questions...</p>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const currentAnswer = answers[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to roadmap
      </button>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <Badge variant="secondary" className="text-xs">
            {Math.round(progress)}%
          </Badge>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-card p-8 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">{question?.question}</h2>

        {/* Options */}
        <div className="space-y-3">
          {question?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                currentAnswer === option
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    currentAnswer === option ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {currentAnswer === option && <div className="h-2 w-2 rounded-full bg-background" />}
                </div>
                <span className="text-sm font-medium text-foreground">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={currentQuestion === 0}
          className="flex-1"
        >
          ← Previous
        </Button>

        <Button
          onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
          disabled={!currentAnswer}
          className="flex-1"
        >
          {currentQuestion === questions.length - 1 ? "Submit Exam" : "Next →"}
        </Button>
      </div>
    </div>
  )
}
