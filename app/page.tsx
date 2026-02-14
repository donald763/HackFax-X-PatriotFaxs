"use client"

import { useCallback, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { SignInForm } from "@/components/sign-in-form"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  return (
    <>
      {/* Splash overlay - fixed, locks scroll, slides up when done */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Sign In Section - always rendered underneath */}
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
    </>
  )
}
