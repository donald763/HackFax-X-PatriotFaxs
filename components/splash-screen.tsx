"use client"

import { useEffect, useState, useRef } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"hidden" | "faint" | "bold" | "fade" | "exit" | "done">("hidden")
  const hasStarted = useRef(false)
  const hasCompleted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    document.body.style.overflow = "hidden"

    const timers: ReturnType<typeof setTimeout>[] = []

    // gentle timeline: faint -> bold -> soft fade -> exit -> done
    timers.push(setTimeout(() => setPhase("faint"), 200))
    timers.push(setTimeout(() => setPhase("bold"), 1100))
    timers.push(setTimeout(() => setPhase("fade"), 3300))
    timers.push(setTimeout(() => setPhase("exit"), 4200))
    timers.push(setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true
        document.body.style.overflow = ""
        setPhase("done")
        onComplete()
      }
    }, 5200))

    return () => {
      timers.forEach(clearTimeout)
      if (!hasCompleted.current) {
        document.body.style.overflow = ""
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === "done") return null

  const textOpacity =
    phase === "hidden" ? 0
    : phase === "faint" ? 0.12
    : phase === "bold" ? 1
    : phase === "fade" ? 0.18
    : 0

  const textWeight = phase === "bold" ? 700 : 300

  const textScale =
    phase === "hidden" ? 0.97
    : phase === "faint" ? 0.99
    : phase === "bold" ? 1
    : phase === "fade" ? 0.995
    : 0.99

  const overlayOpacity = phase === "exit" ? 0 : 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "#e8f5e9",
        opacity: overlayOpacity,
        transition: "opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
      aria-live="polite"
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgba(76,175,80,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-6">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight text-center select-none"
          style={{
            color: "#2e7d32",
            transition: "opacity 1s cubic-bezier(0.2,0,0.2,1), transform 1s cubic-bezier(0.2,0,0.2,1)",
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            fontWeight: textWeight,
            willChange: "opacity, transform",
          }}
        >
          CoursAI
        </h1>

        <p
          className="text-base md:text-lg text-center tracking-wide"
          style={{
            color: "#2e7d32",
            transition: "opacity 1s cubic-bezier(0.2,0,0.2,1) 0.18s, transform 1s cubic-bezier(0.2,0,0.2,1) 0.18s",
            opacity: phase === "bold" ? 0.9 : phase === "fade" ? 0.15 : 0,
            transform: phase === "bold" ? "translateY(0)" : "translateY(4px)",
          }}
        >
          Your personal tutor AI
        </p>

        <div
          className="flex gap-2 mt-2"
          style={{
            transition: "opacity 0.6s ease",
            opacity: phase === "bold" ? 1 : 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "#66bb6a",
                animation:
                  phase === "bold"
                    ? `splashPulse 1.4s ease-in-out ${i * 0.2}s infinite`
                    : "none",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes splashPulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
