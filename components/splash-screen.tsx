"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"hidden" | "faint" | "bold" | "fade" | "done">("hidden")

  useEffect(() => {
    // Lock scroll immediately
    document.body.style.overflow = "hidden"

    // Small delay before starting so the user sees the green screen first
    const startTimer = setTimeout(() => setPhase("faint"), 300)

    // Phase 2: After 1.3s, text goes bold
    const boldTimer = setTimeout(() => setPhase("bold"), 1300)

    // Phase 3: After 3.5s total, start fading out
    const fadeTimer = setTimeout(() => setPhase("fade"), 3500)

    // Phase 4: After 5s total, done - slide the overlay away
    const doneTimer = setTimeout(() => {
      setPhase("done")
    }, 5000)

    // Phase 5: After overlay slides up, unlock scroll and notify parent
    const completeTimer = setTimeout(() => {
      document.body.style.overflow = ""
      onComplete()
    }, 5800)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(boldTimer)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
      clearTimeout(completeTimer)
      document.body.style.overflow = ""
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-transform duration-[800ms] ease-in-out"
      style={{
        backgroundColor: "#e8f5e9",
        transform: phase === "done" ? "translateY(-100%)" : "translateY(0)",
      }}
      aria-live="polite"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(76,175,80,0.1) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8 px-6">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight text-center select-none"
          style={{
            color: "#2e7d32",
            transition: "opacity 1s ease, transform 1s ease, font-weight 0.6s ease",
            opacity:
              phase === "hidden"
                ? 0
                : phase === "faint"
                  ? 0.15
                  : phase === "bold"
                    ? 1
                    : phase === "fade"
                      ? 0
                      : 0,
            transform:
              phase === "hidden"
                ? "scale(0.95) translateY(8px)"
                : phase === "faint"
                  ? "scale(0.98) translateY(0)"
                  : phase === "bold"
                    ? "scale(1) translateY(0)"
                    : "scale(1.01) translateY(-4px)",
            fontWeight: phase === "bold" ? 700 : 400,
          }}
        >
          Your AI Study Co-Pilot
        </h1>

        {/* Subtle loading dots visible during bold phase */}
        <div
          className="flex gap-2"
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
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  )
}
