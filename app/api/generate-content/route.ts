import { NextResponse } from "next/server"
import { generateWithGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  let body: { topic?: string; skillName?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  const { topic, skillName, type = "lesson" } = body
  if (!topic || !skillName) {
    return new NextResponse("Missing topic or skillName", { status: 400 })
  }

  const prompts: Record<string, string> = {
    lesson: `You are an expert teacher. Create a comprehensive lesson on "${skillName}" within the context of "${topic}".

Return ONLY valid JSON, no markdown fences:
{
  "title": "${skillName}",
  "sections": [
    {
      "heading": "Section title",
      "content": "Detailed explanation in 2-4 paragraphs. Use clear, engaging language.",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ],
  "summary": "2-3 sentence summary of the lesson"
}

Create 3-4 sections. Be thorough, accurate, and engaging. Write for someone learning "${topic}".`,

    flashcards: `You are an expert teacher. Create a set of flashcards for "${skillName}" within the context of "${topic}".

Return ONLY valid JSON, no markdown fences:
{
  "title": "${skillName}",
  "cards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Create 8-12 flashcards. Make them clear, focused, and useful for studying "${topic}". Mix terminology, concepts, and application questions.`,

    quiz: `You are an expert teacher. Create a quiz for "${skillName}" within the context of "${topic}".

Return ONLY valid JSON, no markdown fences:
{
  "title": "${skillName}",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Create 5-8 questions. Vary difficulty. Make them genuinely test understanding of "${topic}".`,

    summary: `You are an expert teacher. Create a concise study summary for "${skillName}" within the context of "${topic}".

Return ONLY valid JSON, no markdown fences:
{
  "title": "${skillName}",
  "overview": "2-3 sentence overview",
  "keyConcepts": [
    {
      "term": "Concept name",
      "definition": "Clear, concise definition"
    }
  ],
  "importantPoints": ["Point 1", "Point 2", "Point 3"],
  "connections": "How this connects to other topics in ${topic}"
}

Include 5-8 key concepts and 4-6 important points.`,

    practice: `You are an expert teacher. Create practice problems for "${skillName}" within the context of "${topic}".

Return ONLY valid JSON, no markdown fences:
{
  "title": "${skillName}",
  "problems": [
    {
      "problem": "Problem statement",
      "hint": "A helpful hint",
      "solution": "Detailed step-by-step solution"
    }
  ]
}

Create 4-6 practice problems of increasing difficulty. Make them practical and educational for "${topic}".`,

    "live-demo": `You are a fitness and movement expert. Create a live practice demo for "${skillName}" within "${topic}".

Return ONLY valid JSON, no markdown fences:
{
  "title": "${skillName}",
  "exerciseName": "${skillName}",
  "instructions": "Step-by-step instructions for performing this movement correctly (3-5 sentences)",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "targetDuration": "30 seconds"
}

Make the instructions clear, specific, and suitable for someone practicing with a camera.`,
  }

  const prompt = prompts[type] ?? prompts.lesson

  try {
    const raw = await generateWithGemini(prompt)
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
    const content = JSON.parse(cleaned)
    return NextResponse.json(content)
  } catch (err: any) {
    console.error("Content generation error:", err)
    return new NextResponse(err.message ?? "Failed to generate content", {
      status: err.status ?? 500,
    })
  }
}
