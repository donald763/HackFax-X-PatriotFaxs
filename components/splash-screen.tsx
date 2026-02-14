"use client"

import { useEffect, useState, useRef } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"hidden" | "faint" | "bold" | "fade" | "exit">("hidden")
  const hasStarted = useRef(false)
  const hasCompleted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    document.body.style.overflow = "hidden"

    const t1 = setTimeout(() => setPhase("faint"), 300)
    const t2 = setTimeout(() => setPhase("bold"), 1400)
    const t3 = setTimeout(() => setPhase("fade"), 3200)
    const t4 = setTimeout(() => setPhase("exit"), 4600)
    const t5 = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true
        document.body.style.overflow = ""
        onComplete()
      }
    }, 5800)

    return () => {
      ;[t1, t2, t3, t4, t5].forEach(clearTimeout)
      if (!hasCompleted.current) {
        document.body.style.overflow = ""
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const opacity =
    phase === "hidden" ? 0
    : phase === "faint" ? 0.15
    : phase === "bold" ? 1
    : phase === "fade" ? 0
    : 0

  const weight = phase === "bold" ? 700 : 300

  const yShift =
    phase === "hidden" ? "12px"
    : phase === "faint" ? "0px"
    : phase === "bold" ? "0px"
    : "-8px"

  const scale =
    phase === "hidden" ? 0.96
    : phase === "faint" ? 0.98
    : phase === "bold" ? 1
    : 1.01

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "#e8f5e9",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
      aria-live="polite"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgba(76,175,80,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-6">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight text-center select-none"
          style={{
            color: "#2e7d32",
            transition:
              phase === "fade"
                ? "opacity 1.2s ease-in-out, transform 1.2s ease-in-out, font-weight 0.4s ease"
                : "opacity 0.9s ease-out, transform 0.9s ease-out, font-weight 0.4s ease",
            opacity,
            transform: `translateY(${yShift}) scale(${scale})`,
            fontWeight: weight,
          }}
        >
          Your AI Study Co-Pilot
        </h1>

        <p
          className="text-base md:text-lg text-center tracking-wide"
          style={{
            color: "#66bb6a",
            transition: "opacity 0.8s ease-out 0.2s",
            opacity: phase === "bold" ? 0.7 : 0,
          }}
        >
          Learn smarter, not harder
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
