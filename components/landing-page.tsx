"use client"

import React, { useState, useEffect } from "react"

interface LandingPageProps {
  onComplete: () => void
}

export function LandingPage({ onComplete }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen w-full bg-stone-900">
      {/* Hero section with parallax background */}
      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden"
        style={{
          background: `url('/library-background.jpg') center / cover no-repeat`,
        }}
      >
        {/* Parallax background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/library-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.5}px)`,
            willChange: "transform",
          }}
        />

        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-4">
          {/* Top-center island with Sign In button */}
          <div className="absolute top-8 flex justify-center">
            <div className="px-6 py-3 bg-amber-900/80 backdrop-blur-sm rounded-full border border-amber-400/40 shadow-lg">
              <button
                onClick={onComplete}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full shadow-sm transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Center hero content */}
          <div className="text-center max-w-3xl">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-amber-50 drop-shadow-2xl">
              Coarsai
            </h1>
            <p className="mt-8 text-3xl md:text-4xl text-amber-100 font-light drop-shadow-lg">
              Your Ultimate AI Tutor
            </p>
          </div>
        </div>
      </div>

      {/* Bottom section with subtext and three columns */}
      <div className="relative z-20 bg-gradient-to-b from-stone-900 via-stone-800 to-emerald-950 px-4 py-20">
        {/* Marketing subtext */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xl md:text-2xl text-amber-100 leading-relaxed drop-shadow-lg">
            Master anything with intelligent, personalized learning. From mathematics to languages, from science to arts — learn at your own pace with an AI tutor that adapts to you.
          </p>
        </div>

        {/* Three columns of hype content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-20">
          {/* Column 1 */}
          <div className="text-center p-6 rounded-lg bg-emerald-900/30 border border-emerald-700/50 hover:border-emerald-600/80 transition-colors">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-600/20 border-2 border-amber-500 flex items-center justify-center">
                <span className="text-3xl">🧠</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-100 mb-3">Adaptive Learning</h3>
            <p className="text-amber-50/80 leading-relaxed">
              Our AI learns your style and pace, personalizing every lesson to maximize your understanding and retention.
            </p>
          </div>

          {/* Column 2 */}
          <div className="text-center p-6 rounded-lg bg-emerald-900/30 border border-emerald-700/50 hover:border-emerald-600/80 transition-colors">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-600/20 border-2 border-amber-500 flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-100 mb-3">Learn Anything</h3>
            <p className="text-amber-50/80 leading-relaxed">
              From STEM to humanities, languages to creative skills — master any subject with expert AI guidance tailored to you.
            </p>
          </div>

          {/* Column 3 */}
          <div className="text-center p-6 rounded-lg bg-emerald-900/30 border border-emerald-700/50 hover:border-emerald-600/80 transition-colors">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-600/20 border-2 border-amber-500 flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-100 mb-3">Ace Your Goals</h3>
            <p className="text-amber-50/80 leading-relaxed">
              Get real-time feedback, practice assessments, and a personalized roadmap to excellence. Success starts here.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="relative z-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 px-4 py-20 border-t-4 border-amber-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-8">Our Mission</h2>
          <p className="text-xl md:text-2xl text-emerald-50 leading-relaxed mb-8">
            We believe that education should be <span className="font-semibold text-amber-100">personalized, accessible, and transformative</span>. At Coarsai, our mission is to democratize world-class learning by providing an AI tutor that adapts to every learner—regardless of background, pace, or ambition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-4 bg-emerald-700/40 rounded-lg border border-amber-400/30">
              <p className="text-amber-100 font-semibold text-lg">🎯 Personalized</p>
              <p className="text-emerald-50/80 mt-2">Every learning path is unique to you</p>
            </div>
            <div className="p-4 bg-emerald-700/40 rounded-lg border border-amber-400/30">
              <p className="text-amber-100 font-semibold text-lg">🌍 Accessible</p>
              <p className="text-emerald-50/80 mt-2">Learn anything, anytime, anywhere</p>
            </div>
            <div className="p-4 bg-emerald-700/40 rounded-lg border border-amber-400/30">
              <p className="text-amber-100 font-semibold text-lg">✨ Transformative</p>
              <p className="text-emerald-50/80 mt-2">Unlock your full potential</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-20 bg-gradient-to-b from-emerald-900 to-stone-900 px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 text-center mb-16">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <details className="group border border-amber-600/40 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors">
                <span className="text-lg font-semibold text-amber-100">How does Coarsai personalize learning for me?</span>
                <span className="text-amber-300 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-stone-800/50 text-emerald-50/90 border-t border-amber-600/20">
                Coarsai uses advanced AI to analyze your learning style, pace, and knowledge gaps. It continuously adapts the curriculum, difficulty level, and teaching methods based on your performance and feedback to ensure optimal learning outcomes.
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="group border border-amber-600/40 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors">
                <span className="text-lg font-semibold text-amber-100">What subjects can I learn with Coarsai?</span>
                <span className="text-amber-300 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-stone-800/50 text-emerald-50/90 border-t border-amber-600/20">
                Coarsai covers a vast range of subjects including mathematics, sciences, languages, history, arts, programming, business, and much more. Our AI tutor can help you learn virtually any topic you're interested in mastering.
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="group border border-amber-600/40 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors">
                <span className="text-lg font-semibold text-amber-100">Is Coarsai suitable for beginners?</span>
                <span className="text-amber-300 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-stone-800/50 text-emerald-50/90 border-t border-amber-600/20">
                Absolutely! Coarsai is designed for learners of all levels. Whether you're a complete beginner or looking to advance your expertise, our AI adapts to start exactly where you are and guides you progressively toward mastery.
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className="group border border-amber-600/40 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors">
                <span className="text-lg font-semibold text-amber-100">How can I track my progress?</span>
                <span className="text-amber-300 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-stone-800/50 text-emerald-50/90 border-t border-amber-600/20">
                Coarsai provides comprehensive progress tracking with detailed analytics, skill assessments, personalized roadmaps, and real-time feedback. You'll always know where you stand and what to focus on next.
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className="group border border-amber-600/40 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors">
                <span className="text-lg font-semibold text-amber-100">Can I learn at my own pace?</span>
                <span className="text-amber-300 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-stone-800/50 text-emerald-50/90 border-t border-amber-600/20">
                Yes! Coarsai is completely self-paced. Learn whenever you want, for as long as you want. There are no deadlines, no pressure—just your AI tutor ready to help you succeed on your timeline.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
