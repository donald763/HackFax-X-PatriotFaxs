"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const TRENDING_TOPICS = [
  { name: "Machine Learning", count: "12.4k studying" },
  { name: "Organic Chemistry", count: "8.9k studying" },
  { name: "Linear Algebra", count: "7.2k studying" },
  { name: "US History", count: "6.1k studying" },
  { name: "Microeconomics", count: "5.8k studying" },
]

const CATEGORIES = [
  {
    title: "Science & Engineering",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
      </svg>
    ),
    topics: ["Physics", "Chemistry", "Biology", "Computer Science", "Electrical Engineering", "Mechanical Engineering"],
  },
  {
    title: "Mathematics",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="M17 7 7 17" />
      </svg>
    ),
    topics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math", "Differential Equations", "Number Theory"],
  },
  {
    title: "Humanities",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    topics: ["History", "Philosophy", "Literature", "Art History", "Linguistics", "Religious Studies"],
  },
  {
    title: "Business & Economics",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    topics: ["Microeconomics", "Macroeconomics", "Finance", "Marketing", "Accounting", "Management"],
  },
  {
    title: "Health & Medicine",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2Z" />
      </svg>
    ),
    topics: ["Anatomy", "Pharmacology", "Pathology", "Neuroscience", "Public Health", "Nutrition"],
  },
  {
    title: "Languages",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    ),
    topics: ["Spanish", "French", "Mandarin", "German", "Japanese", "Arabic"],
  },
]

function TrendingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

interface BrowseTopicsProps {
  onSelectTopic: (topic: string) => void
}

export function BrowseTopics({ onSelectTopic }: BrowseTopicsProps) {
  const [prompt, setPrompt] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [lastUpload, setLastUpload] = useState<{ name: string; hasContent: boolean; chars?: number } | null>(null)

  // AI prompt bar is independent; always show full topic list (no filtering)
  const filteredCategories = CATEGORIES

  function handlePromptSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    ;(async () => {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt.trim() }),
        })
        const data = await res.json()
        setAiResponse(data?.answer ?? 'No response')
      } catch (err) {
        console.error(err)
        setAiResponse('Error contacting AI')
      }
    })()
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LeafIcon />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              StudyPilot
            </span>
          </div>
          <Badge variant="secondary" className="font-normal text-xs">
            Guest
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Search */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            What would you like to study?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Ask the AI anything, or browse topics below to get started
          </p>
          <form onSubmit={handlePromptSubmit} className="relative mt-5">
            <Textarea
              placeholder="Ask the AI anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] pl-12 pr-32 text-base resize-none"
            />
            {/* hidden file input used by the plus button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={async (e) => {
                const files = e.target.files
                if (!files || files.length === 0) return
                setUploading(true)
                const form = new FormData()
                Array.from(files).forEach((f) => form.append('files', f))
                try {
                  const res = await fetch('/api/upload', { method: 'POST', body: form })
                  const json = await res.json()
                  if (!res.ok || !json.ok) {
                    toast.error('Upload failed', { description: json?.error || 'Could not upload file' })
                    return
                  }
                  const uploadedArr = json.files ? Object.values(json.files).flat() : []
                  if (uploadedArr.length > 0) {
                    const first = uploadedArr[0] as { originalFilename?: string; filename?: string; text?: string }
                    const name = (first.originalFilename || first.filename || 'file').toString()
                    const extractedText = first.text && first.text.toString().trim().length > 0 ? first.text.toString() : null
                    if (extractedText) {
                      setPrompt(extractedText)
                      setLastUpload({ name, hasContent: true, chars: extractedText.length })
                      toast.success('File uploaded', { description: `${name} — content loaded (${extractedText.length.toLocaleString()} characters)` })
                    } else {
                      const topic = name.replace(/\.[^/.]+$/, '') || name
                      setPrompt(topic)
                      setLastUpload({ name, hasContent: false })
                      toast.success('File uploaded', { description: `${name} — only filename used (no text could be extracted from this file type)` })
                    }
                  }
                } catch (err) {
                  console.error(err)
                  toast.error('Upload failed', { description: 'Network or server error' })
                } finally {
                  setUploading(false)
                  // reset input
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }
              }}
              className="hidden"
            />

            {/* Plus button to open file picker (leftmost) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 top-3 h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Attach files"
              disabled={uploading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>

            {prompt.trim() && (
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-3 h-8 gap-1.5 text-xs"
              >
                Ask AI
                <ArrowRightIcon />
              </Button>
            )}
          </form>
          {lastUpload && (
            <p className="mt-2 text-xs text-muted-foreground">
              Uploaded: <span className="font-medium text-foreground">{lastUpload.name}</span>
              {lastUpload.hasContent && lastUpload.chars != null
                ? ` — content loaded (${lastUpload.chars.toLocaleString()} characters)`
                : ' — filename only (no text extracted)'}
            </p>
          )}
        </div>

        {/* AI response area */}
        {aiResponse && (
          <section className="mb-6">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-sm font-medium">AI Response</h3>
              <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{aiResponse}</p>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => { setAiResponse(null); onSelectTopic(prompt.trim()) }}>Continue</Button>
                <Button variant="ghost" onClick={() => setAiResponse(null)}>Close</Button>
              </div>
            </div>
          </section>
        )}

        {/* Trending */}
        {prompt === "" && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-primary">
                <TrendingIcon />
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Trending Now
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((topic) => (
                <button
                  key={topic.name}
                  type="button"
                  onClick={() => onSelectTopic(topic.name)}
                  className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {topic.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {topic.count}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Categories - always show full list; AI bar does not filter */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            Browse by Subject
          </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((cat) => (
                <Card key={cat.title} className="group hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {cat.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {cat.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.topics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => onSelectTopic(topic)}
                          className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </section>
      </div>
    </div>
  )
}
