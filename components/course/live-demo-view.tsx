"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { initPoseLandmarker, detectPose } from "@/lib/pose-detection"
import { drawPoseOnCanvas } from "@/components/practice/pose-overlay"
import {
  comparePose,
  smoothScore,
  type NormalizedLandmark,
  type FeedbackLevel,
} from "@/lib/pose-comparison-utils"
import type { Exercise } from "@/lib/exercises"
import type { PoseLandmarker } from "@mediapipe/tasks-vision"

interface LiveDemoData {
  title: string
  exerciseName: string
  instructions: string
  tips: string[]
  commonMistakes: string[]
  targetDuration: string
  youtubeSearchQuery?: string
}

interface LiveDemoViewProps {
  data: LiveDemoData
  topic?: string
  onBack: () => void
  onComplete: () => void
}

const feedbackConfig: Record<FeedbackLevel, { label: string; color: string; glow: string }> = {
  good: { label: "Great Form!", color: "#22c55e", glow: "rgba(34, 197, 94, 0.15)" },
  fair: { label: "Getting Close", color: "#eab308", glow: "rgba(234, 179, 8, 0.15)" },
  poor: { label: "Adjust Position", color: "#ef4444", glow: "rgba(239, 68, 68, 0.15)" },
  none: { label: "", color: "#6b7280", glow: "transparent" },
}

export function LiveDemoView({ data, topic, onBack, onComplete }: LiveDemoViewProps) {
  const [phase, setPhase] = useState<"instructions" | "practice">("instructions")

  // YouTube state
  const [videoId, setVideoId] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const landmarkerRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraState, setCameraState] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [detectorLoading, setDetectorLoading] = useState(false)

  // Exercise / pose grading state
  const [exerciseData, setExerciseData] = useState<Exercise | null>(null)
  const [exerciseLoading, setExerciseLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [feedbackLevel, setFeedbackLevel] = useState<FeedbackLevel>("none")
  const [jointFeedback, setJointFeedback] = useState<Map<string, FeedbackLevel>>(new Map())
  const smoothedScoreRef = useRef(0)

  // Map landmark indices to joint names for the overlay
  const landmarkToJointName = useRef(new Map<number, string>())
  useEffect(() => {
    const map = new Map<number, string>()
    if (exerciseData) {
      for (const angle of exerciseData.angles) {
        map.set(angle.landmarks[1], angle.name)
      }
    }
    landmarkToJointName.current = map
  }, [exerciseData])

  // Fetch YouTube video
  useEffect(() => {
    if (phase !== "practice") return
    setVideoLoading(true)
    setVideoError(null)

    fetch("/api/youtube-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseName: data.exerciseName,
        topic: topic ?? data.title,
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
        setVideoError("Could not find a tutorial video")
      })
      .finally(() => setVideoLoading(false))
  }, [phase, data.exerciseName, topic, data.title])

  // Fetch dynamic exercise angles for grading
  useEffect(() => {
    if (phase !== "practice") return
    setExerciseLoading(true)

    fetch("/api/generate-exercise-angles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseName: data.exerciseName,
        topic: topic ?? data.title,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to generate exercise data")
        return res.json()
      })
      .then((ex) => {
        setExerciseData({
          ...ex,
          targetImage: "",
          description: data.instructions,
        } as Exercise)
      })
      .catch((err) => {
        console.error("Exercise angle error:", err)
      })
      .finally(() => setExerciseLoading(false))
  }, [phase, data.exerciseName, topic, data.title, data.instructions])

  // Camera controls
  const startCamera = useCallback(async () => {
    setCameraState("loading")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraState("ready")
    } catch {
      setCameraState("error")
    }
  }, [])

  const initDetector = useCallback(async () => {
    if (landmarkerRef.current) return
    setDetectorLoading(true)
    try {
      landmarkerRef.current = await initPoseLandmarker()
    } catch (err) {
      console.error("Failed to init pose detector:", err)
    }
    setDetectorLoading(false)
  }, [])

  // Start camera + detector when entering practice phase
  useEffect(() => {
    if (phase !== "practice") return
    startCamera()
    initDetector()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [phase, startCamera, initDetector])

  // Pose detection + grading loop
  const handleLandmarksDetected = useCallback(
    (landmarks: NormalizedLandmark[]) => {
      if (!exerciseData) return
      const result = comparePose(landmarks, exerciseData)
      const smoothed = smoothScore(result.score, smoothedScoreRef.current)
      smoothedScoreRef.current = smoothed
      setScore(Math.round(smoothed))
      setFeedbackLevel(smoothed >= 80 ? "good" : smoothed >= 50 ? "fair" : "poor")
      setJointFeedback(result.jointFeedback)
    },
    [exerciseData]
  )

  const animate = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const landmarker = landmarkerRef.current

    if (!video || !canvas || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    const result = detectPose(landmarker, video, performance.now())
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (result.landmarks && result.landmarks.length > 0) {
      const landmarks = result.landmarks[0] as NormalizedLandmark[]
      handleLandmarksDetected(landmarks)
      drawPoseOnCanvas(ctx, landmarks, canvas.width, canvas.height, jointFeedback, landmarkToJointName.current)
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [handleLandmarksDetected, jointFeedback])

  useEffect(() => {
    if (cameraState !== "ready" || phase !== "practice") return
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cameraState, animate, phase])

  const fb = feedbackConfig[feedbackLevel]
  const scoreColor = feedbackLevel === "good" ? "#22c55e" : feedbackLevel === "fair" ? "#eab308" : feedbackLevel === "poor" ? "#ef4444" : "#6b7280"
  const circumference = 2 * Math.PI * 42

  // ── Phase 1: Instructions ──
  if (phase === "instructions") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 text-[10px] font-medium text-emerald-700">
                live demo
              </span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">{data.title}</h1>
          </div>
        </div>

        {/* Instructions card */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
            </div>
            <h2 className="text-base font-semibold text-foreground">How to Perform</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{data.instructions}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Target duration: {data.targetDuration}
          </div>
        </div>

        {/* Tips */}
        {data.tips?.length > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tips for Success
            </h2>
            <ul className="space-y-2">
              {data.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common mistakes */}
        {data.commonMistakes?.length > 0 && (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
              </svg>
              Common Mistakes
            </h2>
            <ul className="space-y-2">
              {data.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Start button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setPhase("practice")}
            className="inline-flex items-center gap-2 rounded-full bg-[#2e7d32] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#256b29] hover:shadow-xl"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Live Demo
          </button>
          <button
            onClick={onComplete}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip &amp; mark as completed
          </button>
        </div>
      </div>
    )
  }

  // ── Phase 2: Split-screen Practice ──
  return (
    <div className="flex h-svh w-full flex-col bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-gray-950 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Stop camera and go back to instructions
              if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop())
                streamRef.current = null
              }
              if (rafRef.current) cancelAnimationFrame(rafRef.current)
              setCameraState("idle")
              setPhase("instructions")
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
          </button>
          <div>
            <span className="inline-flex h-4 items-center rounded-full bg-emerald-500/20 px-2 text-[9px] font-medium text-emerald-400 mr-2">
              LIVE
            </span>
            <span className="text-sm font-semibold text-white">{data.title}</span>
          </div>
        </div>

        {/* Feedback badge */}
        {feedbackLevel !== "none" && (
          <div
            className="rounded-full px-4 py-1.5 transition-all duration-500"
            style={{
              backgroundColor: `${fb.color}20`,
              border: `1px solid ${fb.color}40`,
            }}
          >
            <span className="text-xs font-semibold" style={{ color: fb.color }}>
              {fb.label}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop())
                streamRef.current = null
              }
              if (rafRef.current) cancelAnimationFrame(rafRef.current)
              onComplete()
            }}
            className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Done
          </button>
        </div>
      </div>

      {/* Split-screen content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: YouTube video */}
        <div className="flex w-[55%] flex-col border-r border-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#ef4444"/>
            </svg>
            <span className="text-xs font-medium text-white/60">Tutorial Video</span>
            {videoTitle && (
              <span className="ml-2 truncate text-xs text-white/40">{videoTitle}</span>
            )}
          </div>
          <div className="relative flex-1 bg-black">
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
                  <p className="text-sm text-white/50">Finding tutorial video...</p>
                </div>
              </div>
            )}
            {videoError && !videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                    </svg>
                  </div>
                  <p className="text-sm text-white/50">{videoError}</p>
                  <p className="mt-1 text-xs text-white/30">Follow the written instructions instead</p>
                </div>
              </div>
            )}
            {videoId && !videoLoading && (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={videoTitle ?? "Tutorial video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Right: Camera + grading */}
        <div className="flex w-[45%] flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span className="text-xs font-medium text-white/60">Your Camera</span>
            </div>
            {exerciseLoading && (
              <span className="text-[10px] text-white/40 animate-pulse">Loading pose model...</span>
            )}
          </div>
          <div className="relative flex-1 bg-gray-950 overflow-hidden">
            {/* Camera states */}
            {cameraState === "loading" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
                  <p className="text-sm text-white/50">
                    {detectorLoading ? "Loading pose model..." : "Starting camera..."}
                  </p>
                </div>
              </div>
            )}
            {cameraState === "error" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white/70">Camera access denied</p>
                  <p className="mt-1 text-xs text-white/40">Allow camera permissions and try again</p>
                  <button
                    onClick={startCamera}
                    className="mt-4 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Video + Canvas */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${cameraState !== "ready" ? "invisible" : ""}`}
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${cameraState !== "ready" ? "invisible" : ""}`}
              style={{ pointerEvents: "none" }}
            />

            {/* Vignette overlay */}
            {cameraState === "ready" && (
              <div
                className="pointer-events-none absolute inset-0 transition-all duration-700"
                style={{ boxShadow: `inset 0 0 80px 20px ${fb.glow}` }}
              />
            )}

            {/* Score ring overlay - top right */}
            {cameraState === "ready" && exerciseData && (
              <div className="absolute top-4 right-4 z-20">
                <div className="flex flex-col items-center rounded-2xl bg-black/40 p-3 backdrop-blur-md">
                  <div className="relative h-20 w-20">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={scoreColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (score / 100) * circumference}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                        {score}
                      </span>
                      <span className="text-[8px] font-medium uppercase tracking-widest text-white/50">score</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Joint feedback - bottom right */}
            {cameraState === "ready" && jointFeedback.size > 0 && (
              <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1">
                {Array.from(jointFeedback.entries()).map(([joint, level]) => {
                  const c = feedbackConfig[level]
                  return (
                    <div key={joint} className="flex items-center gap-2 rounded-lg bg-black/30 px-2.5 py-1 backdrop-blur-sm">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] font-medium capitalize text-white/70">
                        {joint.replace(/_/g, " ")}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Instructions overlay - bottom */}
            {cameraState === "ready" && (
              <div className="absolute bottom-4 left-4 right-28 z-20">
                <div className="rounded-xl bg-black/40 px-4 py-2.5 backdrop-blur-md">
                  <p className="text-xs leading-relaxed text-white/80 line-clamp-2">
                    {data.instructions}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
