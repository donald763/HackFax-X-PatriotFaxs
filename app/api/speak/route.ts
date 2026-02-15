import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      console.error("ELEVENLABS_API_KEY not configured")
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const voiceId = "JBFqnCBsd6RMkjVDRZzb" // George - Warm, Captivating Storyteller
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

    console.log(`[ElevenLabs API] Calling with text: "${text.substring(0, 50)}..."`)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    console.log(
      `[ElevenLabs API] Response status: ${res.status} ${res.statusText}`
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`[ElevenLabs API] Error response:`, errorText)
      return NextResponse.json(
        { error: `ElevenLabs API error: ${res.status} - ${errorText}` },
        { status: res.status }
      )
    }

    const audioBuffer = await res.arrayBuffer()
    console.log(`[ElevenLabs API] Received audio buffer of ${audioBuffer.byteLength} bytes`)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("[Speak API Error]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
