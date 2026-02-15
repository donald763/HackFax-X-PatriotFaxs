import { generateWithGemini } from "@/lib/gemini"

// Streams back roadmap first, then content for each available skill
export async function POST(req: Request) {
  let body: { topic?: string; materials?: string[]; proficiency?: number }
  try {
    body = await req.json()
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  const { topic, materials = [], proficiency = 1 } = body
  if (!topic) {
    return new Response("Missing topic", { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: any) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Phase 1: Generate roadmap
        send("phase", { phase: "roadmap", message: "Building your personalized roadmap..." })

        const materialsStr = materials.length > 0 ? materials.join(", ") : "all types"
        const profLabels: Record<number, string> = {
          1: "complete beginner", 2: "some awareness", 3: "basic understanding",
          4: "comfortable", 5: "advanced",
        }
        const profLabel = profLabels[proficiency] ?? "beginner"

        const roadmapPrompt = `You are an expert curriculum designer. Create a personalized learning roadmap for a student studying "${topic}".

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
          "type": "lesson|flashcards|quiz|practice|summary|live-demo",
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
- For physical/fitness topics like "${topic}", use "live-demo" type for practical exercises
- Each level should have 3-5 skills
- Keep names concise and specific to "${topic}"
- Duration should be realistic (5-20 min per skill)
- Make it genuinely educational and well-structured for "${topic}"`

        const roadmapRaw = await generateWithGemini(roadmapPrompt)
        const roadmapCleaned = roadmapRaw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
        const roadmap = JSON.parse(roadmapCleaned)

        send("roadmap", roadmap)

        // Phase 2: Generate content for available skills
        const availableSkills: { levelIdx: number; skillIdx: number; name: string; type: string }[] = []
        for (let li = 0; li < roadmap.levels.length; li++) {
          for (let si = 0; si < roadmap.levels[li].skills.length; si++) {
            const skill = roadmap.levels[li].skills[si]
            if (skill.status === "available") {
              availableSkills.push({ levelIdx: li, skillIdx: si, name: skill.name, type: skill.type })
            }
          }
        }

        send("phase", { phase: "content", message: `Generating ${availableSkills.length} lessons...`, total: availableSkills.length })

        for (let i = 0; i < availableSkills.length; i++) {
          const skill = availableSkills[i]
          send("progress", { current: i + 1, total: availableSkills.length, skillName: skill.name })

          try {
            const contentData = await generateSkillContent(topic, skill.name, skill.type)
            send("content", {
              levelIdx: skill.levelIdx,
              skillIdx: skill.skillIdx,
              content: { data: contentData, type: skill.type, generatedAt: Date.now() },
            })
          } catch (err) {
            console.error(`Failed to generate content for ${skill.name}:`, err)
            // Continue with other skills
          }
        }

        send("done", { success: true })
      } catch (err: any) {
        send("error", { message: err.message ?? "Failed to generate course" })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

async function generateSkillContent(topic: string, skillName: string, type: string) {
  const prompts: Record<string, string> = {
    lesson: `You are an expert teacher. Create a comprehensive lesson on "${skillName}" within the context of "${topic}".
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","sections":[{"heading":"Section title","content":"Detailed explanation in 2-4 paragraphs.","keyPoints":["Key point 1","Key point 2"]}],"summary":"2-3 sentence summary"}
Create 3-4 sections. Be thorough and engaging.`,

    flashcards: `You are an expert teacher. Create flashcards for "${skillName}" within "${topic}".
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","cards":[{"front":"Question or term","back":"Answer or definition"}]}
Create 8-12 flashcards mixing terminology, concepts, and application.`,

    quiz: `You are an expert teacher. Create a quiz for "${skillName}" within "${topic}".
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","questions":[{"question":"Question text","options":["A","B","C","D"],"correctIndex":0,"explanation":"Why correct"}]}
Create 5-8 questions of varying difficulty.`,

    summary: `You are an expert teacher. Create a study summary for "${skillName}" within "${topic}".
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","overview":"2-3 sentences","keyConcepts":[{"term":"Name","definition":"Definition"}],"importantPoints":["Point 1"],"connections":"How this connects to ${topic}"}
Include 5-8 key concepts and 4-6 points.`,

    practice: `You are an expert teacher. Create practice problems for "${skillName}" within "${topic}".
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","problems":[{"problem":"Statement","hint":"A hint","solution":"Step-by-step solution"}]}
Create 4-6 problems of increasing difficulty.`,

    "live-demo": `You are a fitness and movement expert. Create a live practice demo guide for "${skillName}" within "${topic}".
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","introduction":"Brief intro","steps":[{"step":1,"instruction":"Clear instruction","cues":["Key cue 1"],"commonMistakes":["Mistake 1"]}],"safetyTips":["Safety tip 1"],"progressions":["Easier variant","Advanced variant"],"repSets":"Reps and sets"}
Create 4-6 detailed steps with form cues and progressions.`,
  }

  const prompt = prompts[type] ?? prompts.lesson
  const raw = await generateWithGemini(prompt)
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
  return JSON.parse(cleaned)
}
