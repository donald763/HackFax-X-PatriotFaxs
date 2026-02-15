"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { generateAssessmentQuestions } from "@/lib/assessment"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface ProficiencyAssessmentProps {
  topic: string
  onComplete: (proficiency: number) => void
}

export function ProficiencyAssessment({ topic, onComplete }: ProficiencyAssessmentProps) {
  const [mode, setMode] = useState<"choose" | "confidence">("choose")
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  // No quiz logic needed

  // Quiz mode removed

  // ================= CONFIDENCE =================
  if (mode === "confidence") {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Rate Your Confidence</CardTitle>
          <CardDescription>
            How confident are you in your knowledge of <span className="font-semibold">{topic}</span>?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2 justify-center my-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                className="rounded-full w-10 h-10 p-0 text-lg"
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={selectedLevel === null}
            onClick={() => selectedLevel !== null && onComplete(selectedLevel)}
          >
            Continue
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setMode("choose")}>Back</Button>
        </CardFooter>
      </Card>
    )
  }

  // ================= CHOOSE MODE =================
  if (mode === "choose") {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>How would you like to assess your proficiency?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button variant="secondary" className="w-full" onClick={() => setMode("confidence")}>Rate My Confidence</Button>
          <Button variant="ghost" className="w-full mt-2" onClick={() => onComplete(0)}>
            Skip assessment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
