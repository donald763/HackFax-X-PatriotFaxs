"use client"

import { ArrowRight, Brain, Compass, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onComplete: () => void
}

const highlights = [
  {
    title: "Adaptive coaching",
    description: "Course plans shift with your progress, so each lesson stays challenging but manageable.",
    icon: Brain,
  },
  {
    title: "Guided practice",
    description: "Move from concept to application with interactive activities and real-time AI feedback.",
    icon: Compass,
  },
  {
    title: "Exam-ready output",
    description: "Build confidence with quizzes, summaries, and spaced review tuned to your weak points.",
    icon: Sparkles,
  },
]

export function LandingPage({ onComplete }: LandingPageProps) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 text-foreground" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
      <div className="relative isolate overflow-hidden border-b border-green-200/70 bg-card/70">
        <div className="absolute inset-0 -z-20 bg-[url('/books-1536x1152.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-emerald-100/65" />

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <p className="bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent">CoursAI</p>
          <Button onClick={onComplete} size="sm" className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
            Sign in
          </Button>
        </header>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-8 pt-6 md:grid-cols-[1.2fr_1fr] md:items-end md:pb-10">
          <div>
            <p className="mb-4 inline-flex items-center rounded-full border border-green-300 bg-white/90 px-3 py-1 text-xs text-green-700">
              AI-powered personalized learning
            </p>
            <h1 className="text-balance bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl">
              Learn faster with a tutor that adapts to you.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-gray-700 sm:text-lg">
              Build a roadmap, practice with guided feedback, and stay consistent with tools designed for long-term mastery.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={onComplete} className="gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-600">No setup friction — jump straight into your learning path.</p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-green-200 bg-white/90 p-5 shadow-xl backdrop-blur-sm sm:p-6">
            <p className="text-sm font-medium text-green-700">How CoursAI works</p>
            <ol className="mt-4 space-y-4 text-sm text-gray-700">
              <li className="rounded-xl border border-green-200 bg-green-50/70 p-3">
                <span className="font-medium text-foreground">1. Pick a topic</span>
                <p className="mt-1">Choose what you want to learn and upload optional study materials.</p>
              </li>
              <li className="rounded-xl border border-green-200 bg-green-50/70 p-3">
                <span className="font-medium text-foreground">2. Set preferences</span>
                <p className="mt-1">Tailor your format with videos, summaries, quizzes, and live practice.</p>
              </li>
              <li className="rounded-xl border border-green-200 bg-green-50/70 p-3">
                <span className="font-medium text-foreground">3. Follow your roadmap</span>
                <p className="mt-1">Progress through lessons and track confidence over time.</p>
              </li>
            </ol>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-4 sm:pb-5 sm:pt-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-700">Why learners choose CoursAI</p>
            <h2 className="mt-2 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">Built for practical progress</h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-xl border border-green-200 bg-white p-4 shadow-sm">
                <div className="mb-4 inline-flex rounded-md border border-green-200 bg-green-50 p-2 text-green-700">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </article>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border border-green-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Ready to build momentum?</h3>
              <p className="mt-1 text-sm text-gray-600">Start your personalized learning flow in under a minute.</p>
            </div>
            <Button onClick={onComplete} size="lg" className="sm:min-w-40 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
              Continue
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

export default LandingPage
