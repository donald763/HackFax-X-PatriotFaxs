import { NextResponse } from "next/server"
import { forwardToGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  let body: { exerciseName?: string; category?: string }
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 })
  }

  const { exerciseName, category } = body
  if (!exerciseName) {
    return new NextResponse("Missing exerciseName", { status: 400 })
  }

  try {
    const result = await forwardToGemini({
      prompt: `You are a fitness instructor. Provide a clear, concise description for the exercise "${exerciseName}" (category: ${category ?? "general"}). Include:
1. Starting position
2. Step-by-step movement instructions
3. Common mistakes to avoid
4. Key body alignment cues
Keep it under 200 words. Use plain language suitable for beginners.`,
    })

    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    const status = (err as { status?: number })?.status ?? 500
    return new NextResponse(message, { status })
  }
}
