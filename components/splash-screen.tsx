"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"faint" | "bold" | "fade" | "done">("faint")

  useEffect(() => {
    // Phase 1: Start faint (already set)
    // Phase 2: After 600ms, go bold
    const boldTimer = setTimeout(() => setPhase("bold"), 600)
    // Phase 3: After 2s total, start fading
    const fadeTimer = setTimeout(() => setPhase("fade"), 2000)
    // Phase 4: After 3.2s total, complete
    const doneTimer = setTimeout(() => {
      setPhase("done")
      onComplete()
    }, 3200)

    return () => {
      clearTimeout(boldTimer)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div
      className="flex items-center justify-center"
      style={{ backgroundColor: "#e8f5e9" }}
    >
      <div className="flex flex-col items-center gap-6 px-6">
        <div
          className="relative flex items-center justify-center"
          aria-live="polite"
        >
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-center transition-all duration-700 ease-in-out"
            style={{
              color: "#2e7d32",
              opacity: phase === "faint" ? 0.2 : phase === "bold" ? 1 : phase === "fade" ? 0 : 0,
              transform:
                phase === "faint"
                  ? "scale(0.97)"
                  : phase === "bold"
                    ? "scale(1)"
                    : phase === "fade"
                      ? "scale(1.02)"
                      : "scale(1.02)",
              fontWeight: phase === "bold" ? 700 : 400,
            }}
          >
            Your AI Study Co-Pilot
          </h1>
        </div>

        <div
          className="flex gap-1.5 transition-opacity duration-700"
          style={{
            opacity: phase === "bold" ? 1 : 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "#4caf50",
                animation: phase === "bold" ? `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` : "none",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
