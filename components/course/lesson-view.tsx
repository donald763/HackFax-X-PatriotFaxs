"use client"

import { useState, useEffect } from "react"
import { useSpeak } from "@/hooks/use-speak"

function VolumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground group-hover:text-foreground transition-colors">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground group-hover:text-foreground transition-colors">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  )
}

interface Section {
  heading: string
  content: string
  keyPoints: string[]
}

interface LessonData {
  title: string
  sections: Section[]
  summary: string
  youtubeSearchQuery?: string
}

interface LessonViewProps {
  data: LessonData
  onBack: () => void
  onComplete: () => void
}

export function LessonView({ data, onBack, onComplete }: LessonViewProps) {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const { speak, stop, isPlaying } = useSpeak()

  // Fetch YouTube video for lesson
  useEffect(() => {
    if (!data.youtubeSearchQuery) return

    setVideoLoading(true)
    setVideoError(null)

    fetch("/api/youtube-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseName: data.title,
        topic: data.title,
        isLesson: true,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Video search failed")
        return res.json()
      })
      .then((result) => {
        setVideoId(result.videoId)
        setVideoTitle(result.title)
      })
      .catch((err) => {
        console.error("YouTube search error:", err)
        setVideoError("Could not find a related video")
      })
      .finally(() => setVideoLoading(false))
  }, [data.title, data.youtubeSearchQuery])
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
        </svg>
        Back to roadmap
      </button>

      {/* Title */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-6 items-center rounded-full bg-blue-50 px-2.5 text-xs font-medium text-blue-700">
            Lesson
          </span>
        </div>
        <div className="group flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {data.title}
          </h1>
          <div
            onClick={(e) => {
              e.stopPropagation()
              isPlaying ? stop() : speak(data.title)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation()
                isPlaying ? stop() : speak(data.title)
              }
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent cursor-pointer"
            role="button"
            tabIndex={0}
          >
            {isPlaying ? <StopIcon /> : <VolumeIcon />}
          </div>
        </div>
      </div>

      {/* YouTube Video Section */}
      {data.youtubeSearchQuery && (
        <div className="mb-8 rounded-xl overflow-hidden border border-border bg-card">
          {videoLoading ? (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Finding video...</p>
              </div>
            </div>
          ) : videoError ? (
            <div className="aspect-video bg-muted flex items-center justify-center p-6">
              <div className="text-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-2 text-muted-foreground">
                  <path d="m9.5 8.5 5 5M14.5 8.5l-5 5" />
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                </svg>
                <p className="text-sm text-muted-foreground">{videoError}</p>
              </div>
            </div>
          ) : videoId ? (
            <div className="bg-black">
              <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={videoTitle || "Tutorial Video"}
                allowFullScreen
                className="border-0"
              />
              {videoTitle && (
                <div className="p-4 bg-card border-t border-border">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{videoTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tutorial video from YouTube</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8">
        {data.sections.map((section, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">
                {section.heading}
              </h2>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  isPlaying ? stop() : speak(section.heading)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation()
                    isPlaying ? stop() : speak(section.heading)
                  }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent cursor-pointer"
                role="button"
                tabIndex={0}
              >
                {isPlaying ? <StopIcon /> : <VolumeIcon />}
              </div>
            </div>
            <div className="mb-4 group/content">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[15px] leading-[1.7] text-muted-foreground whitespace-pre-line flex-1">
                  {section.content}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    isPlaying ? stop() : speak(section.content)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation()
                      isPlaying ? stop() : speak(section.content)
                    }
                  }}
                  className="opacity-0 group-hover/content:opacity-100 transition-opacity flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent cursor-pointer flex-shrink-0 mt-1"
                  role="button"
                  tabIndex={0}
                >
                  {isPlaying ? <StopIcon /> : <VolumeIcon />}
                </div>
              </div>
            </div>
            {section.keyPoints.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4 group/keypoints">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Points
                  </p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      const allPoints = section.keyPoints.join(". ")
                      isPlaying ? stop() : speak(allPoints)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation()
                        const allPoints = section.keyPoints.join(". ")
                        isPlaying ? stop() : speak(allPoints)
                      }
                    }}
                    className="opacity-0 group-hover/keypoints:opacity-100 transition-opacity flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    {isPlaying ? <StopIcon /> : <VolumeIcon />}
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {section.keyPoints.map((point, j) => (
                    <li key={j} className="flex gap-2 text-sm text-foreground">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mt-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 group/summary">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Summary
            </p>
            <div
              onClick={(e) => {
                e.stopPropagation()
                isPlaying ? stop() : speak(data.summary)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                  isPlaying ? stop() : speak(data.summary)
                }
              }}
              className="opacity-0 group-hover/summary:opacity-100 transition-opacity flex items-center justify-center h-7 w-7 rounded-md hover:bg-primary/10 cursor-pointer"
              role="button"
              tabIndex={0}
            >
              {isPlaying ? <StopIcon /> : <VolumeIcon />}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{data.summary}</p>
        </div>
      )}

      {/* Complete Button */}
      <div className="mt-10 flex justify-center pb-12">
        <button
          onClick={onComplete}
          className="h-11 rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  )
}
