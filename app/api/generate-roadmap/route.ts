import { NextResponse } from "next/server"
import { generateWithGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  let body: { topic?: string; materials?: string[]; proficiency?: number }
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  const { topic, materials = [], proficiency = 1 } = body
  if (!topic) {
    return new NextResponse("Missing topic", { status: 400 })
  }

  const materialsStr = materials.length > 0 ? materials.join(", ") : "all types"
  const profLabels: Record<number, string> = {
    1: "complete beginner",
    2: "some awareness",
    3: "basic understanding",
    4: "comfortable",
    5: "advanced",
  }
  const profLabel = profLabels[proficiency] ?? "beginner"

  const prompt = `You are an expert curriculum designer. Create a personalized learning roadmap for a student studying "${topic}".

Student profile:
- Proficiency: ${profLabel} (level ${proficiency}/5)
- Preferred materials: ${materialsStr}

Generate a JSON roadmap with 4-5 progressive levels. Each level has skills/lessons. Adapt difficulty based on proficiency — skip basics for advanced students.

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "levels": [
    {
      "name": "Level Name",
      "description": "What this level covers",
      "icon": "foundation|core|applied|advanced|mastery",
      "skills": [
        {
          "name": "Skill/Lesson Name",
          "description": "Brief 1-sentence description",
          "type": "lesson|flashcards|quiz|practice|summary",
          "duration": "10 min",
          "status": "available"
        }
      ]
    }
  ]
}

Rules:
- First level's first 2-3 skills should have status "available", everything else "locked"
- Match skill types to the student's preferred materials where possible (${materialsStr})
- Each level should have 3-5 skills
- Keep names concise and specific to "${topic}"
- Duration should be realistic (5-20 min per skill)
- Make it genuinely educational and well-structured for "${topic}"`

  try {
    const raw = await generateWithGemini(prompt)
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
    const roadmap = JSON.parse(cleaned)
    return NextResponse.json(roadmap)
  } catch (err: any) {
    console.error("Roadmap generation error:", err)
    return new NextResponse(err.message ?? "Failed to generate roadmap", {
      status: err.status ?? 500,
    })
  }
}
