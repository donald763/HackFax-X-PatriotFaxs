"use client"

import { useCallback, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { SignInForm } from "@/components/sign-in-form"
import { StudyPreference } from "@/components/study-preference"
import { BrowseTopics } from "@/components/browse-topics"

type AppView = "splash" | "signin" | "preference" | "browse"

export default function Page() {
  const [view, setView] = useState<AppView>("splash")
  const [transitioning, setTransitioning] = useState(false)

  const handleSplashComplete = useCallback(() => {
    setView("signin")
  }, [])

  function transitionTo(next: AppView) {
    setTransitioning(true)
    setTimeout(() => {
      setView(next)
      setTransitioning(false)
    }, 400)
  }

  function handleSignIn() {
    transitionTo("preference")
  }

  function handlePreferenceComplete() {
    transitionTo("browse")
  }

  if (view === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div
      className="transition-opacity duration-500 ease-out"
      style={{ opacity: transitioning ? 0 : 1 }}
    >
      {view === "signin" && (
        <main className="flex min-h-svh">
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-card">
            <SignInForm onSignIn={handleSignIn} />
          </div>
          <div
            className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:relative lg:overflow-hidden"
            style={{ backgroundColor: "#e8f5e9" }}
          >
            <div className="relative z-10 max-w-md px-8">
              <blockquote className="space-y-4">
                <p
                  className="text-lg font-medium leading-relaxed"
                  style={{ color: "#2e7d32cc" }}
                >
                  {'"StudyPilot helped me ace my finals. The AI-powered flashcards and practice quizzes are exactly what I needed to stay on track."'}
                </p>
                <footer className="text-sm" style={{ color: "#2e7d3299" }}>
                  <span className="font-medium" style={{ color: "#2e7d32" }}>
                    Alex Chen
                  </span>
                  {" -- Computer Science, Stanford"}
                </footer>
              </blockquote>
            </div>
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #2e7d32 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        </main>
      )}

      {view === "preference" && (
        <StudyPreference onComplete={handlePreferenceComplete} />
      )}

      {view === "browse" && <BrowseTopics />}
    </div>
  )
}
