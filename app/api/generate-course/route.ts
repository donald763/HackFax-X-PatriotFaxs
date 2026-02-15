import { generateWithGemini, type GeminiAttachment } from "@/lib/gemini"

// Streams back roadmap first, then content for each available skill
export async function POST(req: Request) {
  let body: {
    topic?: string
    materials?: string[]
    proficiency?: number
    attachments?: GeminiAttachment[]
  }
  try {
    body = await req.json()
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  const { topic, materials = [], proficiency = 1, attachments = [] } = body
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

        const attachmentNote = attachments.length > 0
          ? `\n\nIMPORTANT: The student has attached ${attachments.length} document(s)/file(s) (${attachments.map(a => a.name).join(", ")}). These files are provided alongside this prompt. You MUST base the entire course curriculum on the ACTUAL CONTENT of these attached files. Analyze what the documents contain and create lessons, quizzes, flashcards, etc. that teach the material found IN the documents. Do NOT create a generic course — the course must reflect the specific content from the attachments.`
          : ""

        const roadmapPrompt = `You are an expert curriculum designer. Create a personalized learning roadmap for a student studying "${topic}".${attachmentNote}

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
- Each level should have 3-5 skills
- Keep names concise and specific to "${topic}"
- Duration should be realistic (5-20 min per skill)
- Make it genuinely educational and well-structured for "${topic}"
- IMPORTANT: If "${topic}" involves physical activity, movement, sports, fitness, yoga, dance, martial arts, or any body-based skill, include "live-demo" type skills where the student practices poses or movements with their camera. These should be specific exercises (e.g., "Warrior II Pose Practice" for yoga, "Defensive Stance Drill" for basketball). Include at least 1-2 live-demo skills per level for physical topics.
- For non-physical/academic topics, do NOT include live-demo type skills.${attachments.length > 0 ? "\n- Since documents are attached, base ALL skill names and descriptions on the actual content found in the attached files." : ""}`

        const roadmapRaw = await generateWithGemini(roadmapPrompt, attachments)
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
            const contentData = await generateSkillContent(topic, skill.name, skill.type, attachments)
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

async function generateSkillContent(topic: string, skillName: string, type: string, attachments: GeminiAttachment[] = []) {
  const docNote = attachments.length > 0
    ? ` The student has attached documents — base your content on the ACTUAL CONTENT from those attached files. Use specific information, terms, and concepts found in the documents.`
    : ""

  const prompts: Record<string, string> = {
    lesson: `You are an expert teacher. Create a comprehensive lesson on "${skillName}" within the context of "${topic}".${docNote}
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","sections":[{"heading":"Section title","content":"Detailed explanation in 2-4 paragraphs.","keyPoints":["Key point 1","Key point 2"]}],"summary":"2-3 sentence summary"}
Create 3-4 sections. Be thorough and engaging.`,

    flashcards: `You are an expert teacher. Create flashcards for "${skillName}" within "${topic}".${docNote}
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","cards":[{"front":"Question or term","back":"Answer or definition"}]}
Create 8-12 flashcards mixing terminology, concepts, and application.`,

    quiz: `You are an expert teacher. Create a quiz for "${skillName}" within "${topic}".${docNote}
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","questions":[{"question":"Question text","options":["A","B","C","D"],"correctIndex":0,"explanation":"Why correct"}]}
Create 5-8 questions of varying difficulty.`,

    summary: `You are an expert teacher. Create a study summary for "${skillName}" within "${topic}".${docNote}
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","overview":"2-3 sentences","keyConcepts":[{"term":"Name","definition":"Definition"}],"importantPoints":["Point 1"],"connections":"How this connects to ${topic}"}
Include 5-8 key concepts and 4-6 points.`,

    practice: `You are an expert teacher. Create practice problems for "${skillName}" within "${topic}".${docNote}
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","problems":[{"problem":"Statement","hint":"A hint","solution":"Step-by-step solution"}]}
Create 4-6 problems of increasing difficulty.`,

    "live-demo": `You are a fitness and movement expert. Create a live practice demo for "${skillName}" within "${topic}".${docNote}
Return ONLY valid JSON, no markdown fences:
{"title":"${skillName}","exerciseName":"${skillName}","instructions":"Step-by-step instructions for performing this movement correctly (3-5 sentences)","tips":["Tip 1","Tip 2","Tip 3"],"commonMistakes":["Mistake 1","Mistake 2"],"targetDuration":"30 seconds"}
Make the instructions clear, specific, and suitable for someone practicing with a camera.`,
  }

  const prompt = prompts[type] ?? prompts.lesson
  const raw = await generateWithGemini(prompt, attachments)
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
  return JSON.parse(cleaned)
}
