"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { SignInForm } from "@/components/sign-in-form"
import { BrowseTopics } from "@/components/browse-topics"
import { ProficiencyAssessment } from "@/components/proficiency-assessment"
import { StudyPreference } from "@/components/study-preference"
import { SkillRoadmap } from "@/components/skill-roadmap"

type AppView = "signin" | "browse" | "assessment" | "preference" | "roadmap"

export default function Page() {
  const [splashDone, setSplashDone] = useState(false)
  const [view, setView] = useState<AppView>("signin")
  const [displayedView, setDisplayedView] = useState<AppView>("signin")
  const [contentOpacity, setContentOpacity] = useState(0)
  const [contentTranslate, setContentTranslate] = useState(20)
  const [selectedTopic, setSelectedTopic] = useState("")
  const [proficiency, setProficiency] = useState(0)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const splashFired = useRef(false)
  const isTransitioning = useRef(false)

  const handleSplashComplete = useCallback(() => {
    if (splashFired.current) return
    splashFired.current = true
    setSplashDone(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setContentOpacity(1)
        setContentTranslate(0)
      })
    })
  }, [])

  function transitionTo(next: AppView) {
    if (isTransitioning.current) return
    isTransitioning.current = true

    // Phase 1: fade out + slide up current view
    setContentOpacity(0)
    setContentTranslate(-12)

    setTimeout(() => {
      setView(next)
      setDisplayedView(next)
      window.scrollTo({ top: 0, behavior: "instant" })

      // Reset to below position before fading in
      setContentTranslate(20)

      // Phase 2: fade in + slide up new view
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContentOpacity(1)
          setContentTranslate(0)
          setTimeout(() => {
            isTransitioning.current = false
          }, 550)
        })
      })
    }, 500)
  }

  function handleSignIn() {
    transitionTo("browse")
  }

  function handleSelectTopic(topic: string) {
    setSelectedTopic(topic)
    transitionTo("assessment")
  }

  function handleAssessmentComplete(level: number) {
    setProficiency(level)
    transitionTo("preference")
  }

  function handlePreferenceComplete(preferences: string[]) {
    setSelectedMaterials(preferences)
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
          opacity: contentOpacity,
          transform: `translateY(${contentTranslate}px)`,
          transition: "opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "opacity, transform",
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

        {displayedView === "assessment" && (
          <ProficiencyAssessment
            topic={selectedTopic}
            onComplete={handleAssessmentComplete}
          />
        )}

        {displayedView === "preference" && (
          <StudyPreference
            topic={selectedTopic}
            onComplete={handlePreferenceComplete}
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
