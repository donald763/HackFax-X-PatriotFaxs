"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { SignInForm } from "@/components/sign-in-form"
import { BrowseTopics } from "@/components/browse-topics"
import { StudyPreference } from "@/components/study-preference"
import { ProficiencyAssessment } from "@/components/proficiency-assessment"
import { SkillRoadmap } from "@/components/skill-roadmap"

type AppView = "signin" | "browse" | "preference" | "assessment" | "roadmap"

export default function Page() {
  const [splashDone, setSplashDone] = useState(false)
  const [view, setView] = useState<AppView>("signin")
  const [displayedView, setDisplayedView] = useState<AppView>("signin")
  const [opacity, setOpacity] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState("")
  const [proficiency, setProficiency] = useState(0)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const splashFired = useRef(false)
  const transitioning = useRef(false)

  const handleSplashComplete = useCallback(() => {
    if (splashFired.current) return
    splashFired.current = true
    setSplashDone(true)
    // Fade in the signin view gently
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpacity(1)
      })
    })
  }, [])

  function transitionTo(next: AppView) {
    if (transitioning.current) return
    transitioning.current = true

    // Phase 1: fade out
    setOpacity(0)

    const onFadeOut = () => {
      // Phase 2: swap view while invisible
      setView(next)
      setDisplayedView(next)
      window.scrollTo({ top: 0, behavior: "instant" })

      // Phase 3: fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpacity(1)
          setTimeout(() => {
            transitioning.current = false
          }, 700)
        })
      })
    }

    setTimeout(onFadeOut, 600)
  }

  function handleSignIn() {
    transitionTo("browse")
  }

  function handleSelectTopic(topic: string) {
    setSelectedTopic(topic)
    transitionTo("preference")
  }

  function handlePreferenceComplete(preferences: string[]) {
    setSelectedMaterials(preferences)
    transitionTo("assessment")
  }

  function handleAssessmentComplete(level: number) {
    setProficiency(level)
    transitionTo("roadmap")
  }

  function handleBackToBrowse() {
    transitionTo("browse")
  }

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <div
        style={{
          opacity,
          transition: "opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "opacity",
        }}
      >
        {displayedView === "signin" && (
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

        {displayedView === "browse" && (
          <BrowseTopics onSelectTopic={handleSelectTopic} />
        )}

        {displayedView === "preference" && (
          <StudyPreference
            topic={selectedTopic}
            onComplete={handlePreferenceComplete}
          />
        )}

        {displayedView === "assessment" && (
          <ProficiencyAssessment
            topic={selectedTopic}
            onComplete={handleAssessmentComplete}
          />
        )}

        {displayedView === "roadmap" && (
          <SkillRoadmap
            topic={selectedTopic}
            materials={selectedMaterials}
            onBack={handleBackToBrowse}
          />
        )}
      </div>
    </>
  )
}
