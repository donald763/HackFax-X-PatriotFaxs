"use client"

import { useState, useCallback, useRef } from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { InstructionPanel } from "./instruction-panel"
import { CameraFeed } from "./camera-feed"
import type { Exercise } from "@/lib/exercises"
import {
  comparePose,
  smoothScore,
  type NormalizedLandmark,
  type FeedbackLevel,
} from "@/lib/pose-comparison-utils"
import { fetchExerciseDescription } from "@/lib/gemini-client"

export function PracticePage() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [descriptionLoading, setDescriptionLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [feedbackLevel, setFeedbackLevel] = useState<FeedbackLevel>("none")
  const [jointFeedback, setJointFeedback] = useState<Map<string, FeedbackLevel>>(
    new Map()
  )

  const smoothedScoreRef = useRef(0)

  const handleSelectExercise = useCallback(async (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setScore(0)
    setFeedbackLevel("none")
    setJointFeedback(new Map())
    smoothedScoreRef.current = 0

    // Fetch AI description
    setDescriptionLoading(true)
    setDescription(null)
    try {
      const desc = await fetchExerciseDescription(exercise.name, exercise.category)
      setDescription(desc)
    } catch {
      // Fall back to static description
      setDescription(null)
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
      setFeedbackLevel(
        smoothed >= 80 ? "good" : smoothed >= 50 ? "fair" : "poor"
      )
      setJointFeedback(result.jointFeedback)
    },
    [selectedExercise]
  )

  return (
    <div className="h-svh w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={40} minSize={25}>
          <InstructionPanel
            selectedExercise={selectedExercise}
            onSelectExercise={handleSelectExercise}
            description={description}
            descriptionLoading={descriptionLoading}
            score={score}
            feedbackLevel={feedbackLevel}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={35}>
          <CameraFeed
            active={selectedExercise !== null}
            exercise={selectedExercise}
            jointFeedback={jointFeedback}
            onLandmarksDetected={handleLandmarksDetected}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
