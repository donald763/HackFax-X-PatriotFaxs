"use client"

import { useCallback, useState, useRef } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { SignInForm } from "@/components/sign-in-form"
import { BrowseTopics } from "@/components/browse-topics"
import { StudyPreference } from "@/components/study-preference"

type AppView = "splash" | "signin" | "browse" | "preference"

export default function Page() {
  const [view, setView] = useState<AppView>("splash")
  const [transitioning, setTransitioning] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState("")
  const splashDone = useRef(false)

  const handleSplashComplete = useCallback(() => {
    if (splashDone.current) return
    splashDone.current = true
    setView("signin")
  }, [])

  function transitionTo(next: AppView) {
    setTransitioning(true)
    setTimeout(() => {
      setView(next)
      window.scrollTo(0, 0)
      setTimeout(() => setTransitioning(false), 50)
    }, 400)
  }

  function handleSignIn() {
    transitionTo("browse")
  }

  function handleSelectTopic(topic: string) {
    setSelectedTopic(topic)
    transitionTo("preference")
  }

  function handlePreferenceComplete(preferences: string[]) {
    // For now just log - this is where you'd navigate to the actual study session
    console.log("Topic:", selectedTopic, "Preferences:", preferences)
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

      {view === "browse" && (
        <BrowseTopics onSelectTopic={handleSelectTopic} />
      )}

      {view === "preference" && (
        <StudyPreference
          topic={selectedTopic}
          onComplete={handlePreferenceComplete}
        />
      )}
    </div>
  )
}
