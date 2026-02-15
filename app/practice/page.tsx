"use client"

import { useSearchParams } from "next/navigation"
import { PracticePage } from "@/components/practice/practice-page"
import { Suspense } from "react"

function PracticeContent() {
  const params = useSearchParams()
  const topic = params.get("topic") ?? undefined
  const exercise = params.get("exercise") ?? undefined

  return <PracticePage topic={topic} initialExerciseName={exercise} />
}

export default function PracticeRoute() {
  return (
    <Suspense fallback={
      <div className="flex h-svh items-center justify-center bg-gray-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
      </div>
    }>
      <PracticeContent />
    </Suspense>
  )
}
