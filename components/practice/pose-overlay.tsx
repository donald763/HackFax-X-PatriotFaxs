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
  good: "#22c55e",
  fair: "#eab308",
  poor: "#ef4444",
  none: "rgba(255, 255, 255, 0.8)",
}

export function drawPoseOnCanvas(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  jointFeedback?: Map<string, FeedbackLevel>,
  landmarkToJointName?: Map<number, string>
) {
  // Draw connections with glow
  for (const [a, b] of POSE_CONNECTIONS) {
    const la = landmarks[a]
    const lb = landmarks[b]
    if (la.visibility < 0.5 || lb.visibility < 0.5) continue

    const ax = la.x * width
    const ay = la.y * height
    const bx = lb.x * width
    const by = lb.y * height

    // Determine connection color based on connected joints
    let connectionColor = "rgba(255, 255, 255, 0.4)"
    if (jointFeedback && landmarkToJointName) {
      const jointA = landmarkToJointName.get(a)
      const jointB = landmarkToJointName.get(b)
      const levelA = jointA ? jointFeedback.get(jointA) : undefined
      const levelB = jointB ? jointFeedback.get(jointB) : undefined
      const level = levelA ?? levelB
      if (level) {
        connectionColor = feedbackColors[level] + "80" // 50% alpha
      }
    }

    // Glow layer
    ctx.shadowColor = connectionColor
    ctx.shadowBlur = 8
    ctx.strokeStyle = connectionColor
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.stroke()

    // Crisp layer
    ctx.shadowBlur = 0
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.stroke()
  }

  // Draw landmarks
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i]
    if (lm.visibility < 0.5) continue

    const x = lm.x * width
    const y = lm.y * height

    let color = "rgba(255, 255, 255, 0.8)"
    let isJoint = false
    if (jointFeedback && landmarkToJointName) {
      const jointName = landmarkToJointName.get(i)
      if (jointName) {
        const level = jointFeedback.get(jointName)
        if (level) {
          color = feedbackColors[level]
          isJoint = true
        }
      }
    }

    const radius = isJoint ? 8 : 4

    // Glow for joints
    if (isJoint) {
      ctx.shadowColor = color
      ctx.shadowBlur = 16
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius + 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Outer ring
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()

    // Inner dot
    ctx.fillStyle = isJoint ? "white" : "rgba(255,255,255,0.9)"
    ctx.beginPath()
    ctx.arc(x, y, radius * 0.45, 0, 2 * Math.PI)
    ctx.fill()
  }
}
