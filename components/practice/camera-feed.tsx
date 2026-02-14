"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { initPoseLandmarker, detectPose } from "@/lib/pose-detection"
import { drawPoseOnCanvas } from "./pose-overlay"
import type { NormalizedLandmark, FeedbackLevel } from "@/lib/pose-comparison-utils"
import type { Exercise } from "@/lib/exercises"
import type { PoseLandmarker } from "@mediapipe/tasks-vision"

interface CameraFeedProps {
  active: boolean
  exercise: Exercise | null
  jointFeedback: Map<string, FeedbackLevel>
  onLandmarksDetected: (landmarks: NormalizedLandmark[]) => void
  score: number
  feedbackLevel: FeedbackLevel
  instruction: string | null
  onRequestExerciseSwitch: () => void
}

const feedbackConfig: Record<FeedbackLevel, { label: string; color: string; glow: string }> = {
  good: { label: "Great Form!", color: "#22c55e", glow: "rgba(34, 197, 94, 0.15)" },
  fair: { label: "Getting Close", color: "#eab308", glow: "rgba(234, 179, 8, 0.15)" },
  poor: { label: "Adjust Position", color: "#ef4444", glow: "rgba(239, 68, 68, 0.15)" },
  none: { label: "", color: "#6b7280", glow: "transparent" },
}

export function CameraFeed({
  active,
  exercise,
  jointFeedback,
  onLandmarksDetected,
  score,
  feedbackLevel,
  instruction,
  onRequestExerciseSwitch,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const landmarkerRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraState, setCameraState] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [detectorLoading, setDetectorLoading] = useState(false)

  const landmarkToJointName = useRef(new Map<number, string>())
  useEffect(() => {
    const map = new Map<number, string>()
    if (exercise) {
      for (const angle of exercise.angles) {
        map.set(angle.landmarks[1], angle.name)
      }
    }
    landmarkToJointName.current = map
  }, [exercise])

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
      onLandmarksDetected(landmarks)
      drawPoseOnCanvas(ctx, landmarks, canvas.width, canvas.height, jointFeedback, landmarkToJointName.current)
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [onLandmarksDetected, jointFeedback])

  useEffect(() => {
    if (!active) return
    startCamera()
    initDetector()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [active, startCamera, initDetector])

  useEffect(() => {
    if (cameraState !== "ready") return
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cameraState, animate])

  const fb = feedbackConfig[feedbackLevel]
  const scoreColor = feedbackLevel === "good" ? "#22c55e" : feedbackLevel === "fair" ? "#eab308" : feedbackLevel === "poor" ? "#ef4444" : "#6b7280"
  const circumference = 2 * Math.PI * 54

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-950">
      {/* Camera states */}
      {cameraState === "idle" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-white/60">Select an exercise to begin</p>
            <p className="mt-1 text-xs text-white/30">Camera activates automatically</p>
          </div>
        </div>
      )}

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

      {/* Vignette overlay based on score */}
      {cameraState === "ready" && (
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{
            boxShadow: `inset 0 0 120px 30px ${fb.glow}`,
          }}
        />
      )}

      {/* === HUD Overlays === */}
      {cameraState === "ready" && exercise && (
        <>
          {/* Top-left: Exercise name + back */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-3">
            <button
              onClick={onRequestExerciseSwitch}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div className="rounded-full bg-black/40 px-4 py-2 backdrop-blur-md">
              <span className="text-sm font-semibold text-white">{exercise.name}</span>
            </div>
          </div>

          {/* Top-right: Score ring */}
          <div className="absolute top-5 right-5 z-20">
            <div className="flex flex-col items-center rounded-2xl bg-black/40 p-4 backdrop-blur-md">
              <div className="relative h-28 w-28">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke={scoreColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (score / 100) * circumference}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                    {score}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Feedback badge */}
          {feedbackLevel !== "none" && (
            <div className="absolute top-5 left-1/2 z-20 -translate-x-1/2">
              <div
                className="rounded-full px-5 py-2 backdrop-blur-md transition-all duration-500"
                style={{
                  backgroundColor: `${fb.color}20`,
                  border: `1px solid ${fb.color}40`,
                }}
              >
                <span className="text-sm font-semibold" style={{ color: fb.color }}>
                  {fb.label}
                </span>
              </div>
            </div>
          )}

          {/* Bottom: Instruction bar */}
          {instruction && (
            <div className="absolute bottom-6 left-1/2 z-20 w-[90%] max-w-2xl -translate-x-1/2">
              <div className="rounded-2xl bg-black/50 px-6 py-4 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">{instruction}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom-right: Joint feedback indicators */}
          {jointFeedback.size > 0 && (
            <div className="absolute bottom-6 right-5 z-20 flex flex-col gap-1.5">
              {Array.from(jointFeedback.entries()).map(([joint, level]) => {
                const c = feedbackConfig[level]
                return (
                  <div key={joint} className="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[11px] font-medium capitalize text-white/70">
                      {joint.replace(/_/g, " ")}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
