import { NextResponse } from "next/server"
import { generateWithGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  let body: { topic?: string; count?: number }
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  const { topic, count = 5 } = body
  if (!topic) {
    return new NextResponse("Missing topic", { status: 400 })
  }

  const prompt = `You are a fitness and movement expert. Generate ${count} physical exercises for someone learning "${topic}".

Each exercise should be a real, performable movement that helps develop skills in "${topic}".

MediaPipe 33-landmark indices for reference:
- 11: left shoulder, 12: right shoulder
- 13: left elbow, 14: right elbow
- 15: left wrist, 16: right wrist
- 23: left hip, 24: right hip
- 25: left knee, 26: right knee
- 27: left ankle, 28: right ankle

Return ONLY valid JSON, no markdown fences:
{
  "exercises": [
    {
      "id": "unique-id",
      "name": "Exercise Name",
      "category": "strength|flexibility|balance",
      "description": "Clear 1-2 sentence description of how to perform this exercise",
      "angles": [
        {
          "name": "joint_name",
          "landmarks": [11, 13, 15],
          "weight": 1.0
        }
      ],
      "targetAngles": { "joint_name": 90 },
      "tolerance": { "joint_name": 15 }
    }
  ]
}

Rules:
- Each exercise must have 2-4 angle definitions using valid MediaPipe landmark indices
- Angles are measured at the MIDDLE landmark (index 1 of the 3-element array)
- Target angles in degrees (0-180)
- Tolerance in degrees (10-25, smaller = stricter)
- Weight from 0.5-1.0 (importance)
- Categories: "strength" for power moves, "flexibility" for stretching, "balance" for stability
- Make exercises specific to "${topic}" (e.g., for yoga: warrior pose, downward dog; for basketball: defensive stance, shooting form)
- Keep names concise and descriptive`

  try {
    const raw = await generateWithGemini(prompt)
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
    const data = JSON.parse(cleaned)
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Exercise generation error:", err)
    return new NextResponse(err.message ?? "Failed to generate exercises", {
      status: err.status ?? 500,
    })
  }
}
