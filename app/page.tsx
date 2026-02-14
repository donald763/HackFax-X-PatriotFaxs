"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { SignInForm } from "@/components/sign-in-form"
import { BrowseTopics } from "@/components/browse-topics"
import { StudyPreference } from "@/components/study-preference"
import { ProficiencyAssessment } from "@/components/proficiency-assessment"
import { SkillRoadmap } from "@/components/skill-roadmap"

type AppView = "signin" | "browse" | "preference" | "assessment" | "roadmap"

export default function Page() {
  const [landingDone, setLandingDone] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [view, setView] = useState<AppView>("signin")
  const [displayedView, setDisplayedView] = useState<AppView>("signin")
  const [opacity, setOpacity] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState("")
  const [proficiency, setProficiency] = useState(0)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [resumeCourseId, setResumeCourseId] = useState<string | undefined>()
  const splashFired = useRef(false)
  const transitioning = useRef(false)
  const sessionChecked = useRef(false)

  // If user is already authenticated, skip signin after splash
  useEffect(() => {
    if (sessionChecked.current || !splashDone) return
    if (status === "loading") return
    sessionChecked.current = true
    if (session) {
      setView("browse")
      setDisplayedView("browse")
    }
  }, [session, status, splashDone])

  // Transition overlay lifecycle: when showTransition is true, run a short sequence
  useEffect(() => {
    if (!showTransition) return
    const timers: ReturnType<typeof setTimeout>[] = []
    // Short hold then reveal sign-in
    timers.push(setTimeout(() => {
      /* no-op hold */
    }, 250))
    timers.push(setTimeout(() => {
      setShowTransition(false)
      requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)))
    }, 700))
    return () => timers.forEach(clearTimeout)
  }, [showTransition])

  function transitionTo(next: AppView) {
    if (transitioning.current) return
    transitioning.current = true
    setOpacity(0)
    const onFadeOut = () => {
      setView(next)
      setDisplayedView(next)
      window.scrollTo({ top: 0, behavior: "instant" })
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
    setResumeCourseId(undefined)
    transitionTo("preference")
  }

  function handleResumeCourse(courseId: string, topic: string) {
    setSelectedTopic(topic)
    setResumeCourseId(courseId)
    transitionTo("roadmap")
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
      {!landingDone && (
        <LandingPage
          onComplete={() => {
            setLandingDone(true)
            // start inline transition overlay then reveal sign-in
            setShowTransition(true)
          }}
        />
      )}

      {showTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#e8f5e9', transition: 'opacity 0.5s ease' }}>
          <div className="text-center">
            <h2 className="text-3xl font-medium" style={{ color: '#2e7d32' }}>Coarsai</h2>
          </div>
        </div>
      )}

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
                    {'"Coarsai transformed my learning journey. With personalized AI tutoring, I mastered subjects I thought were impossible. The adaptive learning curves to my pace perfectly."'}
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
          <BrowseTopics
            onSelectTopic={handleSelectTopic}
            onResumeCourse={handleResumeCourse}
          />
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
            proficiency={proficiency}
            courseId={resumeCourseId}
            onBack={handleBackToBrowse}
          />
        )}
      </div>
    </>
  )
}

