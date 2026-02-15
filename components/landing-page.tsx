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

        @keyframes landing-fade-up {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes landing-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes landing-pulse {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.6;
          }
        }

        .landing-reveal {
          opacity: 0;
          transform: translateY(18px);
          animation: landing-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--delay, 0s);
        }

        .landing-float {
          animation: landing-float 7s ease-in-out infinite;
        }

        .landing-pulse {
          animation: landing-pulse 5s ease-in-out infinite;
        }

        .landing-card {
          transition: transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease;
        }

        .landing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(16, 185, 129, 0.18);
          border-color: rgba(16, 185, 129, 0.45);
        }

        .landing-cta {
          transition: transform 250ms ease, box-shadow 250ms ease;
        }

        .landing-cta:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 14px 32px rgba(5, 150, 105, 0.25);
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-reveal,
          .landing-float,
          .landing-pulse {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }

          .landing-card,
          .landing-cta {
            transition: none !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 text-foreground" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
      <div className="relative isolate overflow-hidden border-b border-green-200/70 bg-card/70">
        <div className="absolute inset-0 -z-20 bg-[url('/books-1536x1152.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-emerald-100/65" />
        <div className="landing-float landing-pulse absolute -left-16 top-12 -z-10 h-44 w-44 rounded-full bg-emerald-300/35 blur-3xl" />
        <div className="landing-float landing-pulse absolute -right-10 bottom-10 -z-10 h-40 w-40 rounded-full bg-green-300/30 blur-3xl" style={{ animationDelay: "1.4s" }} />

        <header className="landing-reveal mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5" style={{ ["--delay" as string]: "0.05s" }}>
          <p className="bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent">CoursAI</p>
          <Button onClick={onComplete} size="sm" className="landing-cta rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
            Sign in
          </Button>
        </header>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-8 pt-6 md:grid-cols-[1.2fr_1fr] md:items-end md:pb-10">
          <div>
            <p className="landing-reveal mb-4 inline-flex items-center rounded-full border border-green-300 bg-white/90 px-3 py-1 text-xs text-green-700" style={{ ["--delay" as string]: "0.12s" }}>
              AI-powered personalized learning
            </p>
            <h1 className="landing-reveal text-balance bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl" style={{ ["--delay" as string]: "0.2s" }}>
              Learn faster with a tutor that adapts to you.
            </h1>
            <p className="landing-reveal mt-5 max-w-2xl text-base text-gray-700 sm:text-lg" style={{ ["--delay" as string]: "0.3s" }}>
              Build a roadmap, practice with guided feedback, and stay consistent with tools designed for long-term mastery.
            </p>
            <div className="landing-reveal mt-6 flex flex-wrap items-center gap-3" style={{ ["--delay" as string]: "0.38s" }}>
              <Button onClick={onComplete} className="landing-cta gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-600">No setup friction — jump straight into your learning path.</p>
            </div>
          </div>

          <div className="landing-card landing-reveal rounded-2xl border-2 border-green-200 bg-white/90 p-5 shadow-xl backdrop-blur-sm sm:p-6" style={{ ["--delay" as string]: "0.26s" }}>
            <p className="text-sm font-medium text-green-700">How CoursAI works</p>
            <ol className="mt-4 space-y-4 text-sm text-gray-700">
              <li className="landing-card rounded-xl border border-green-200 bg-green-50/70 p-3">
                <span className="font-medium text-foreground">1. Pick a topic</span>
                <p className="mt-1">Choose what you want to learn and upload optional study materials.</p>
              </li>
              <li className="landing-card rounded-xl border border-green-200 bg-green-50/70 p-3">
                <span className="font-medium text-foreground">2. Set preferences</span>
                <p className="mt-1">Tailor your format with videos, summaries, quizzes, and live practice.</p>
              </li>
              <li className="landing-card rounded-xl border border-green-200 bg-green-50/70 p-3">
                <span className="font-medium text-foreground">3. Follow your roadmap</span>
                <p className="mt-1">Progress through lessons and track confidence over time.</p>
              </li>
            </ol>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-4 sm:pb-5 sm:pt-5">
        <div className="landing-reveal mb-4 flex items-end justify-between gap-4" style={{ ["--delay" as string]: "0.45s" }}>
          <div>
            <p className="text-sm font-medium text-green-700">Why learners choose CoursAI</p>
            <h2 className="mt-2 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">Built for practical progress</h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="landing-card landing-reveal rounded-xl border border-green-200 bg-white p-4 shadow-sm" style={{ ["--delay" as string]: `${0.52 + highlights.findIndex((h) => h.title === item.title) * 0.08}s` }}>
                <div className="mb-4 inline-flex rounded-md border border-green-200 bg-green-50 p-2 text-green-700">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </article>
            )
          })}
        </div>

        <div className="landing-card landing-reveal mt-4 rounded-xl border border-green-200 bg-white p-4 shadow-sm sm:p-5" style={{ ["--delay" as string]: "0.8s" }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Ready to build momentum?</h3>
              <p className="mt-1 text-sm text-gray-600">Start your personalized learning flow in under a minute.</p>
            </div>
            <Button onClick={onComplete} size="lg" className="landing-cta sm:min-w-40 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
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
