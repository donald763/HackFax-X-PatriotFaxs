"use client"

import { useCallback, useRef, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { SignInForm } from "@/components/sign-in-form"

export default function Page() {
  const [splashDone, setSplashDone] = useState(false)
  const signInRef = useRef<HTMLDivElement>(null)

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true)
    // Small delay to let the DOM update, then smooth scroll to sign-in
    setTimeout(() => {
      signInRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* Splash Screen - full viewport */}
      <section
        className="h-svh w-full flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: "#e8f5e9" }}
      >
        <SplashScreen onComplete={handleSplashComplete} />

        {/* Subtle radial glow behind text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(76,175,80,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700"
          style={{ opacity: splashDone ? 1 : 0 }}
        >
          <span className="text-xs font-medium tracking-wide" style={{ color: "#66bb6a" }}>
            Scroll down
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="animate-bounce"
            aria-hidden="true"
          >
            <path
              d="M10 4v12m0 0l-4-4m4 4l4-4"
              stroke="#66bb6a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Sign In Section - full viewport */}
      <section ref={signInRef} className="min-h-svh w-full">
        <main className="flex min-h-svh">
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <SignInForm />
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-accent lg:relative lg:overflow-hidden">
            <div className="relative z-10 max-w-md px-8">
              <blockquote className="space-y-4">
                <p className="text-lg font-medium leading-relaxed text-accent-foreground/80">
                  {'"This platform has completely transformed the way we manage our projects. The simplicity and power combined is unmatched."'}
                </p>
                <footer className="text-sm text-accent-foreground/60">
                  <span className="font-medium text-accent-foreground">Sofia Rodriguez</span>
                  {" \u2014 Head of Product, Horizon Labs"}
                </footer>
              </blockquote>
            </div>
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        </main>
      </section>
    </div>
  )
}
