export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const prompt = (body.prompt || '').toString()

    // Use Google Gemini when GEMINI_API_KEY is set in .env.local
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          return new Response(JSON.stringify({ ok: true, answer: text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }
    }

    // Fallback when no key or Gemini request failed
    const answer = apiKey
      ? 'Gemini request failed. Check your API key and quota.'
      : `Placeholder AI response for: "${prompt}". Add GEMINI_API_KEY to .env.local to use Google Gemini.`

    return new Response(JSON.stringify({ ok: true, answer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'server error' }), { status: 500 })
  }
}
