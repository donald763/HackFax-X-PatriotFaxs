"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"hidden" | "faint" | "bold" | "fade" | "exit" | "done">("hidden")

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const timers = [
      setTimeout(() => setPhase("faint"), 400),
      setTimeout(() => setPhase("bold"), 1600),
      setTimeout(() => setPhase("fade"), 3800),
      setTimeout(() => setPhase("exit"), 5200),
      setTimeout(() => {
        setPhase("done")
        document.body.style.overflow = ""
        onComplete()
      }, 6200),
    ]

    return () => {
      timers.forEach(clearTimeout)
      document.body.style.overflow = ""
    }
  }, [onComplete])

  if (phase === "done") return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "#e8f5e9",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.05)" : "scale(1)",
        transition: "opacity 1s ease-in-out, transform 1s ease-in-out",
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
      aria-live="polite"
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgba(76,175,80,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-6">
        {/* Main text */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight text-center select-none"
          style={{
            color: "#2e7d32",
            transition:
              phase === "fade"
                ? "opacity 1.2s ease-in-out, transform 1.2s ease-in-out, font-weight 0.5s ease"
                : "opacity 1s ease-out, transform 1s ease-out, font-weight 0.5s ease",
            opacity:
              phase === "hidden" ? 0
              : phase === "faint" ? 0.18
              : phase === "bold" ? 1
              : 0,
            transform:
              phase === "hidden" ? "translateY(12px) scale(0.96)"
              : phase === "faint" ? "translateY(0) scale(0.98)"
              : phase === "bold" ? "translateY(0) scale(1)"
              : "translateY(-8px) scale(1.01)",
            fontWeight: phase === "bold" ? 700 : 300,
          }}
        >
          Your AI Study Co-Pilot
        </h1>

        {/* Subtle tagline */}
        <p
          className="text-base md:text-lg text-center tracking-wide"
          style={{
            color: "#66bb6a",
            transition: "opacity 0.8s ease-out 0.3s",
            opacity: phase === "bold" ? 0.7 : 0,
          }}
        >
          Learn smarter, not harder
        </p>

        {/* Loading dots */}
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
