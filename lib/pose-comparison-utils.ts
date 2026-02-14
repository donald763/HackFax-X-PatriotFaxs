import type { Exercise } from "./exercises"

export interface NormalizedLandmark {
  x: number
  y: number
  z: number
  visibility: number
}

export type FeedbackLevel = "good" | "fair" | "poor" | "none"

export interface ComparisonResult {
  score: number
  feedbackLevel: FeedbackLevel
  jointFeedback: Map<string, FeedbackLevel>
}

/** Calculate angle in degrees at joint B formed by points A→B→C */
export function calculateAngle(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark
): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs(radians * (180 / Math.PI))
  if (angle > 180) angle = 360 - angle
  return angle
}

/** Compare user pose landmarks against an exercise's target angles */
export function comparePose(
  userLandmarks: NormalizedLandmark[],
  exercise: Exercise
): ComparisonResult {
  let totalWeight = 0
  let weightedScore = 0
  const jointFeedback = new Map<string, FeedbackLevel>()

  for (const angleDef of exercise.angles) {
    const [ai, bi, ci] = angleDef.landmarks
    const a = userLandmarks[ai]
    const b = userLandmarks[bi]
    const c = userLandmarks[ci]

    // Skip if any landmark has low visibility
    if (a.visibility < 0.5 || b.visibility < 0.5 || c.visibility < 0.5) {
      continue
    }

    const userAngle = calculateAngle(a, b, c)
    const targetAngle = exercise.targetAngles[angleDef.name]
    const tolerance = exercise.tolerance[angleDef.name] ?? 15

    const deviation = Math.abs(userAngle - targetAngle)

    let jointScore: number
    if (deviation <= tolerance) {
      jointScore = 100
      jointFeedback.set(angleDef.name, "good")
    } else if (deviation <= tolerance * 2) {
      jointScore = 100 - ((deviation - tolerance) / tolerance) * 50
      jointFeedback.set(angleDef.name, "fair")
    } else {
      jointScore = Math.max(
        0,
        50 - ((deviation - tolerance * 2) / tolerance) * 50
      )
      jointFeedback.set(angleDef.name, "poor")
    }

    weightedScore += jointScore * angleDef.weight
    totalWeight += angleDef.weight
  }

  const score = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0
  const feedbackLevel: FeedbackLevel =
    score >= 80 ? "good" : score >= 50 ? "fair" : "poor"

  return { score, feedbackLevel, jointFeedback }
}

/** Exponential moving average for smoothing scores across frames */
export function smoothScore(
  current: number,
  previous: number,
  alpha: number = 0.3
): number {
  return previous * (1 - alpha) + current * alpha
}
