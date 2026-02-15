import { generateWithGemini } from "@/lib/gemini"

export async function POST(req: Request) {
  let body: { exerciseName?: string; topic?: string; isLesson?: boolean }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { exerciseName, topic, isLesson = false } = body
  if (!exerciseName) {
    return Response.json({ error: "Missing exerciseName" }, { status: 400 })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return Response.json({ error: "YouTube API key not configured" }, { status: 500 })
  }

  try {
    // Use Gemini to craft the best search query
    const queryPrompt = isLesson
      ? `You are an educational video search expert. Generate the BEST YouTube search query to find a clear tutorial or explanation video for this topic:

Topic/Lesson: "${exerciseName}"
Subject context: "${topic ?? "general education"}"

Rules:
- The query should find videos that clearly EXPLAIN the topic
- Include keywords like "tutorial", "explanation", "how to", "guide", or "learn"
- Keep it under 10 words
- Return ONLY the search query text, nothing else`
      : `You are a fitness video search expert. Generate the BEST YouTube search query to find a clear, instructional tutorial video for this exercise:

Exercise: "${exerciseName}"
Topic context: "${topic ?? "general fitness"}"

Rules:
- The query should find a video that clearly DEMONSTRATES the movement/pose
- Include keywords like "tutorial", "how to", or "form guide" if appropriate
- Keep it under 10 words
- Return ONLY the search query text, nothing else`

    const searchQuery = (await generateWithGemini(queryPrompt, [])).trim().replace(/^["']|["']$/g, "")

    // Call YouTube Data API v3
    const ytUrl = new URL("https://www.googleapis.com/youtube/v3/search")
    ytUrl.searchParams.set("part", "snippet")
    ytUrl.searchParams.set("q", searchQuery)
    ytUrl.searchParams.set("type", "video")
    ytUrl.searchParams.set("maxResults", "3")
    ytUrl.searchParams.set("videoDuration", "medium|long")
    ytUrl.searchParams.set("videoEmbeddable", "true")
    ytUrl.searchParams.set("key", apiKey)

    const ytRes = await fetch(ytUrl.toString())
    if (!ytRes.ok) {
      const errText = await ytRes.text()
      console.error("YouTube API error:", errText)
      return Response.json({ error: "YouTube search failed" }, { status: 502 })
    }

    const ytData = await ytRes.json()
    const items = ytData.items ?? []

    if (items.length === 0) {
      return Response.json({ error: "No videos found" }, { status: 404 })
    }

    const best = items[0]
    return Response.json({
      videoId: best.id.videoId,
      title: best.snippet.title,
      thumbnailUrl: best.snippet.thumbnails?.high?.url ?? best.snippet.thumbnails?.default?.url,
      searchQuery,
    })
  } catch (err: any) {
    console.error("YouTube search error:", err)
    return Response.json({ error: err.message ?? "Search failed" }, { status: 500 })
  }
}
