"use client"

import type { FeedbackLevel } from "@/lib/pose-comparison-utils"

const config: Record<FeedbackLevel, { label: string; className: string }> = {
  good: {
    label: "Great Form!",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  fair: {
    label: "Getting Close",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  poor: {
    label: "Adjust Position",
    className: "bg-red-100 text-red-800 border-red-300",
  },
  none: {
    label: "Waiting...",
    className: "bg-gray-100 text-gray-500 border-gray-300",
  },
}

export function FeedbackBadge({ level }: { level: FeedbackLevel }) {
  const { label, className } = config[level]
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-300 ${className}`}
    >
      {label}
    </span>
  )
}
