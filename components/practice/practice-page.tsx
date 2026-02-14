"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { CameraFeed } from "./camera-feed"
import { EXERCISES, type Exercise } from "@/lib/exercises"
import {
  comparePose,
  smoothScore,
  type NormalizedLandmark,
  type FeedbackLevel,
} from "@/lib/pose-comparison-utils"
import { fetchExerciseDescription } from "@/lib/gemini-client"
import Link from "next/link"

interface PracticePageProps {
  /** Pre-select an exercise by name (from course live-demo) */
  initialExerciseName?: string
  /** Topic context for AI-generated instructions */
  topic?: string
}

const categoryIcon: Record<string, string> = {
  strength: "dumbbell",
  flexibility: "stretch",
  balance: "tree",
}

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case "flexibility":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      )
    case "balance":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" />
          <path d="m18 22 4-4" /><path d="m2 6 4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" />
        </svg>
      )
  }
}

export function PracticePage({ initialExerciseName, topic }: PracticePageProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showPicker, setShowPicker] = useState(true)
  const [description, setDescription] = useState<string | null>(null)
  const [descriptionLoading, setDescriptionLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [feedbackLevel, setFeedbackLevel] = useState<FeedbackLevel>("none")
  const [jointFeedback, setJointFeedback] = useState<Map<string, FeedbackLevel>>(new Map())

  const smoothedScoreRef = useRef(0)

  // Auto-select exercise if initial name provided
  useEffect(() => {
    if (initialExerciseName) {
      const match = EXERCISES.find(
        (e) => e.name.toLowerCase() === initialExerciseName.toLowerCase() || e.id === initialExerciseName
      )
      if (match) {
        handleSelectExercise(match)
      }
    }
  }, [initialExerciseName])

  const handleSelectExercise = useCallback(async (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setShowPicker(false)
    setScore(0)
    setFeedbackLevel("none")
    setJointFeedback(new Map())
    smoothedScoreRef.current = 0

    setDescriptionLoading(true)
    setDescription(null)
    try {
      const desc = await fetchExerciseDescription(exercise.name, exercise.category)
      setDescription(desc)
    } catch {
      setDescription(exercise.description)
    }
    setDescriptionLoading(false)
  }, [])

  const handleLandmarksDetected = useCallback(
    (landmarks: NormalizedLandmark[]) => {
      if (!selectedExercise) return
      const result = comparePose(landmarks, selectedExercise)
      const smoothed = smoothScore(result.score, smoothedScoreRef.current)
      smoothedScoreRef.current = smoothed
      setScore(Math.round(smoothed))
      setFeedbackLevel(smoothed >= 80 ? "good" : smoothed >= 50 ? "fair" : "poor")
      setJointFeedback(result.jointFeedback)
    },
    [selectedExercise]
  )

  const instructionText = descriptionLoading
    ? "Loading instructions..."
    : description ?? selectedExercise?.description ?? null

  return (
    <div className="h-svh w-full relative overflow-hidden bg-gray-950">
      {/* Full-screen camera */}
      <CameraFeed
        active={selectedExercise !== null && !showPicker}
        exercise={selectedExercise}
        jointFeedback={jointFeedback}
        onLandmarksDetected={handleLandmarksDetected}
        score={score}
        feedbackLevel={feedbackLevel}
        instruction={!showPicker ? instructionText : null}
        onRequestExerciseSwitch={() => setShowPicker(true)}
      />

      {/* Exercise picker overlay */}
      {showPicker && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-950/90 backdrop-blur-xl">
          <div className="w-full max-w-lg px-6">
            {/* Header */}
            <div className="mb-8 text-center">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white/70"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                </svg>
                Back to courses
              </Link>
              <h1 className="mt-4 text-2xl font-bold text-white">Practice Mode</h1>
              <p className="mt-2 text-sm text-white/40">
                {topic
                  ? `Choose an exercise for ${topic}`
                  : "Select an exercise and follow along with real-time pose feedback"}
              </p>
            </div>

            {/* Exercise grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {EXERCISES.map((exercise) => {
                const isActive = selectedExercise?.id === exercise.id
                return (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelectExercise(exercise)}
                    className={`group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-200 ${
                      isActive
                        ? "border-[#22c55e]/50 bg-[#22c55e]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                      isActive ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-white/10 text-white/50 group-hover:text-white/70"
                    }`}>
                      <CategoryIcon category={exercise.category} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? "text-[#22c55e]" : "text-white/80"}`}>
                        {exercise.name}
                      </p>
                      <p className="mt-0.5 text-[11px] capitalize text-white/30">{exercise.category}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Close button if exercise already selected */}
            {selectedExercise && (
              <button
                onClick={() => setShowPicker(false)}
                className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-[#22c55e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16a34a]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Continue Practice
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
