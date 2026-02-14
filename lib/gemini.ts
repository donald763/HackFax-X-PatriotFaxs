// Server-side helper for Google Gemini API.
// Environment variables:
// - GEMINI_API_URL  (e.g. https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent)
// - GEMINI_API_KEY  (Google AI API key)

export async function generateWithGemini(prompt: string): Promise<string> {
  const url = process.env.GEMINI_API_URL
  const key = process.env.GEMINI_API_KEY

  if (!url || !key) {
    throw new Error("GEMINI_API_URL or GEMINI_API_KEY is not set in environment")
  }

  const res = await fetch(`${url}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  })

  const data = await res.text()

  if (!res.ok) {
    const err = new Error(`Gemini API error ${res.status}: ${data}`)
    ;(err as any).status = res.status
    throw err
  }

  const json = JSON.parse(data)
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
}

// Backward compat wrapper
export async function forwardToGemini(payload: unknown) {
  const p = payload as { prompt?: string }
  if (p.prompt) {
    return generateWithGemini(p.prompt)
  }
  throw new Error("Missing prompt in payload")
}
