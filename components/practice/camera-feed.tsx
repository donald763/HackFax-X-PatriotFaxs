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
}

export function CameraFeed({
  active,
  exercise,
  jointFeedback,
  onLandmarksDetected,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const landmarkerRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraState, setCameraState] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [detectorLoading, setDetectorLoading] = useState(false)

  // Build a map from landmark index → joint name for the current exercise
  const landmarkToJointName = useRef(new Map<number, string>())
  useEffect(() => {
    const map = new Map<number, string>()
    if (exercise) {
      for (const angle of exercise.angles) {
        // Map the middle landmark (the joint) to the angle name
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

  // Animation loop
  const animate = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const landmarker = landmarkerRef.current

    if (!video || !canvas || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    // Sync canvas size
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
      drawPoseOnCanvas(
        ctx,
        landmarks,
        canvas.width,
        canvas.height,
        jointFeedback,
        landmarkToJointName.current
      )
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [onLandmarksDetected, jointFeedback])

  // Start camera + detector when active
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

  // Run animation loop when camera is ready
  useEffect(() => {
    if (cameraState !== "ready") return

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cameraState, animate])

  // Determine border color
  const borderClass =
    cameraState !== "ready"
      ? "border-gray-300"
      : jointFeedback.size === 0
        ? "border-gray-300"
        : (() => {
            const levels = Array.from(jointFeedback.values())
            const hasPoor = levels.includes("poor")
            const hasFair = levels.includes("fair")
            if (hasPoor) return "border-red-500"
            if (hasFair) return "border-yellow-500"
            return "border-green-600"
          })()

  return (
    <div className="flex h-full flex-col bg-gray-900">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              cameraState === "ready" ? "animate-pulse bg-green-500" : "bg-gray-500"
            }`}
          />
          <span className="text-sm text-gray-300">
            {cameraState === "idle" && "Camera off"}
            {cameraState === "loading" && "Starting camera..."}
            {cameraState === "ready" && "Live"}
            {cameraState === "error" && "Camera error"}
          </span>
        </div>
        {detectorLoading && (
          <span className="text-xs text-gray-400">Loading pose model...</span>
        )}
      </div>

      {/* Video area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {cameraState === "idle" && (
          <div className="text-center">
            <p className="mb-2 text-gray-400">Select an exercise to begin</p>
            <p className="text-sm text-gray-500">
              Your camera will activate automatically
            </p>
          </div>
        )}

        {cameraState === "error" && (
          <div className="text-center">
            <p className="mb-2 text-red-400">Could not access camera</p>
            <p className="text-sm text-gray-500">
              Please allow camera permissions and try again
            </p>
            <button
              onClick={startCamera}
              className="mt-4 rounded-lg bg-[#2e7d32] px-4 py-2 text-sm font-medium text-white hover:bg-[#256b29]"
            >
              Retry
            </button>
          </div>
        )}

        {cameraState === "loading" && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500" />
            <p className="text-sm text-gray-400">Starting camera...</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${
            cameraState !== "ready" ? "invisible" : ""
          }`}
        />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${
            cameraState !== "ready" ? "invisible" : ""
          }`}
          style={{ pointerEvents: "none" }}
        />

        {/* Feedback border glow */}
        {cameraState === "ready" && (
          <div
            className={`pointer-events-none absolute inset-0 border-4 transition-colors duration-300 ${borderClass}`}
          />
        )}
      </div>
    </div>
  )
}
