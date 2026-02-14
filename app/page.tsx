"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { SignInForm } from "@/components/sign-in-form"
import { BrowseTopics } from "@/components/browse-topics"
import { StudyPreference } from "@/components/study-preference"
import { SkillRoadmap } from "@/components/skill-roadmap"

type AppView = "splash" | "signin" | "browse" | "preference" | "roadmap"

export default function Page() {
  const [view, setView] = useState<AppView>("splash")
  const [nextView, setNextView] = useState<AppView | null>(null)
  const [fadeState, setFadeState] = useState<"in" | "out">("in")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const splashDone = useRef(false)

  const handleSplashComplete = useCallback(() => {
    if (splashDone.current) return
    splashDone.current = true
    // Splash already fades out on its own, so we just swap view
    setView("signin")
    setFadeState("in")
  }, [])

  function transitionTo(next: AppView) {
    setFadeState("out")
    setNextView(next)
  }

  // When fade-out completes, swap view and fade in
  useEffect(() => {
    if (fadeState !== "out" || !nextView) return
    const t = setTimeout(() => {
      setView(nextView)
      setNextView(null)
      window.scrollTo(0, 0)
      // Small delay to let DOM update before fading in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFadeState("in")
        })
      })
    }, 500)
    return () => clearTimeout(t)
  }, [fadeState, nextView])

  function handleSignIn() {
    transitionTo("browse")
  }

  function handleSelectTopic(topic: string) {
    setSelectedTopic(topic)
    transitionTo("preference")
  }

  function handlePreferenceComplete(preferences: string[]) {
    setSelectedMaterials(preferences)
    transitionTo("roadmap")
  }

  function handleBackToBrowse() {
    transitionTo("browse")
  }

  // Splash is its own thing - it handles its own animation
  if (view === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div
      style={{
        opacity: fadeState === "in" ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
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

      {view === "roadmap" && (
        <SkillRoadmap
          topic={selectedTopic}
          materials={selectedMaterials}
          onBack={handleBackToBrowse}
        />
      )}
    </div>
  )
}
