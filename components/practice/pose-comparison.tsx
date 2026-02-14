"use client"

import type { FeedbackLevel } from "@/lib/pose-comparison-utils"

interface PoseComparisonProps {
  score: number
  feedbackLevel: FeedbackLevel
}

const levelColors: Record<FeedbackLevel, string> = {
  good: "#2e7d32",
  fair: "#f9a825",
  poor: "#c62828",
  none: "#d1d5db",
}

export function PoseComparison({ score, feedbackLevel }: PoseComparisonProps) {
  const color = levelColors[feedbackLevel]
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>
            {score}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">Form Score</p>
        <p className="text-xs text-gray-500">
          {feedbackLevel === "good" && "Your form looks great!"}
          {feedbackLevel === "fair" && "Almost there, adjust slightly."}
          {feedbackLevel === "poor" && "Check the instructions and try again."}
          {feedbackLevel === "none" && "Position yourself in frame."}
        </p>
      </div>
    </div>
  )
}
