import type { FeedbackLevel, NormalizedLandmark } from "@/lib/pose-comparison-utils"

const POSE_CONNECTIONS: [number, number][] = [
  // torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // left arm
  [11, 13], [13, 15],
  // right arm
  [12, 14], [14, 16],
  // left leg
  [23, 25], [25, 27],
  // right leg
  [24, 26], [26, 28],
  // left foot
  [27, 29], [27, 31], [29, 31],
  // right foot
  [28, 30], [28, 32], [30, 32],
  // left hand
  [15, 17], [15, 19], [17, 19],
  // right hand
  [16, 18], [16, 20], [18, 20],
]

const feedbackColors: Record<FeedbackLevel, string> = {
  good: "#2e7d32",
  fair: "#f9a825",
  poor: "#c62828",
  none: "#ffffff",
}

export function drawPoseOnCanvas(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  jointFeedback?: Map<string, FeedbackLevel>,
  landmarkToJointName?: Map<number, string>
) {
  // Draw connections
  ctx.lineWidth = 3
  for (const [a, b] of POSE_CONNECTIONS) {
    const la = landmarks[a]
    const lb = landmarks[b]
    if (la.visibility < 0.5 || lb.visibility < 0.5) continue

    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
    ctx.beginPath()
    ctx.moveTo(la.x * width, la.y * height)
    ctx.lineTo(lb.x * width, lb.y * height)
    ctx.stroke()
  }

  // Draw landmarks
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i]
    if (lm.visibility < 0.5) continue

    let color = "#ffffff"
    if (jointFeedback && landmarkToJointName) {
      const jointName = landmarkToJointName.get(i)
      if (jointName) {
        const level = jointFeedback.get(jointName)
        if (level) color = feedbackColors[level]
      }
    }

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(lm.x * width, lm.y * height, 5, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)"
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}
