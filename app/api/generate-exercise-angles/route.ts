import { generateWithGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  let body: { exerciseName?: string; topic?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { exerciseName, topic } = body
  if (!exerciseName) {
    return Response.json({ error: "Missing exerciseName" }, { status: 400 })
  }

  try {
    const prompt = `You are an expert biomechanics analyst who understands MediaPipe Pose Landmarker indices.

MediaPipe detects 33 body landmarks. Here are the key ones:
0: nose, 11: left_shoulder, 12: right_shoulder, 13: left_elbow, 14: right_elbow,
15: left_wrist, 16: right_wrist, 23: left_hip, 24: right_hip,
25: left_knee, 26: right_knee, 27: left_ankle, 28: right_ankle

For the exercise "${exerciseName}" (in the context of ${topic ?? "fitness"}), define the key joint angles to measure for correct form.

Each angle is defined by 3 landmark indices [A, B, C] where the angle is measured AT point B (the vertex).

Return ONLY valid JSON, no markdown:
{
  "id": "exercise-id-slug",
  "name": "${exerciseName}",
  "category": "strength|flexibility|balance",
  "angles": [
    {
      "name": "joint_name",
      "landmarks": [A, B, C],
      "weight": 0.0-1.0
    }
  ],
  "targetAngles": { "joint_name": 90 },
  "tolerance": { "joint_name": 15 }
}

Rules:
- Include 2-5 key angles that define correct form
- Target angles should represent the ideal position for this exercise
- Tolerance is how many degrees of deviation is acceptable (10-25 typically)
- Weight represents importance (1.0 = critical, 0.5 = secondary)
- Use realistic biomechanical angles
- Make sure landmark indices are valid (0-32)`

    const raw = await generateWithGemini(prompt, [])
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
    const exercise = JSON.parse(cleaned)

    return Response.json(exercise)
  } catch (err: any) {
    console.error("Exercise angle generation error:", err)
    return Response.json({ error: err.message ?? "Generation failed" }, { status: 500 })
  }
}
