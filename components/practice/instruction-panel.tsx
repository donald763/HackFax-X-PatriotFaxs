"use client"

import type { Exercise } from "@/lib/exercises"
import type { FeedbackLevel } from "@/lib/pose-comparison-utils"
import { ExerciseSelector } from "./exercise-selector"
import { PoseComparison } from "./pose-comparison"
import { FeedbackBadge } from "./feedback-badge"
import Link from "next/link"

interface InstructionPanelProps {
  selectedExercise: Exercise | null
  onSelectExercise: (exercise: Exercise) => void
  description: string | null
  descriptionLoading: boolean
  score: number
  feedbackLevel: FeedbackLevel
}

export function InstructionPanel({
  selectedExercise,
  onSelectExercise,
  description,
  descriptionLoading,
  score,
  feedbackLevel,
}: InstructionPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#fafaf9]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Practice Mode</h1>
          <p className="text-xs text-gray-500">Interactive pose feedback</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Exercise Selector */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Choose an Exercise</h2>
          <ExerciseSelector selected={selectedExercise} onSelect={onSelectExercise} />
        </div>

        {/* Selected Exercise Details */}
        {selectedExercise && (
          <>
            {/* Target Image */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-center bg-gray-50 p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedExercise.targetImage}
                  alt={`${selectedExercise.name} target pose`}
                  className="h-40 w-auto object-contain"
                />
              </div>
              <div className="border-t border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">
                  {selectedExercise.name}
                </p>
                <p className="text-xs capitalize text-gray-500">
                  {selectedExercise.category}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-700">Instructions</h2>
              {descriptionLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-gray-600">
                  {description ?? selectedExercise.description}
                </p>
              )}
            </div>

            {/* Score & Feedback */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">Live Feedback</h2>
                <FeedbackBadge level={feedbackLevel} />
              </div>
              <PoseComparison score={score} feedbackLevel={feedbackLevel} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
