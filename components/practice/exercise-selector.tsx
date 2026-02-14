"use client"

import { EXERCISES, type Exercise } from "@/lib/exercises"

interface ExerciseSelectorProps {
  selected: Exercise | null
  onSelect: (exercise: Exercise) => void
}

const categoryIcon: Record<string, string> = {
  strength: "💪",
  flexibility: "🧘",
  balance: "🌳",
}

export function ExerciseSelector({ selected, onSelect }: ExerciseSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {EXERCISES.map((exercise) => {
        const isActive = selected?.id === exercise.id
        return (
          <button
            key={exercise.id}
            onClick={() => onSelect(exercise)}
            className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-md ${
              isActive
                ? "border-[#2e7d32] bg-green-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-lg">{categoryIcon[exercise.category] ?? "🏋️"}</span>
            <span className="text-sm font-semibold text-gray-900">{exercise.name}</span>
            <span className="text-xs text-gray-500 capitalize">{exercise.category}</span>
          </button>
        )
      })}
    </div>
  )
}
