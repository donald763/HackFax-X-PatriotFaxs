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
    <div className="w-full bg-stone-900 overflow-x-hidden">
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
      <div className="relative z-20 bg-gradient-to-b from-stone-900 via-stone-800 to-emerald-950 px-4 py-16">
        {/* Marketing subtext */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xl md:text-2xl text-amber-100 leading-relaxed drop-shadow-lg">
            Master anything with intelligent, personalized learning. From mathematics to languages, from science to arts — learn at your own pace with an AI tutor that adapts to you.
          </p>
        </div>

        {/* Three columns of hype content - minimal design */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Column 1 */}
          <div className="text-center p-6 rounded-lg bg-emerald-900/40 border-l-4 border-emerald-700 hover:border-emerald-600 transition-colors">
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-800/50 border border-amber-600/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-amber-100 mb-3">Adaptive Learning</h3>
            <p className="text-amber-50/80 text-sm leading-relaxed">
              Our AI learns your style and pace, personalizing every lesson to maximize your understanding and retention.
            </p>
          </div>

          {/* Column 2 */}
          <div className="text-center p-6 rounded-lg bg-emerald-900/40 border-l-4 border-emerald-700 hover:border-emerald-600 transition-colors">
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-800/50 border border-amber-600/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-amber-100 mb-3">Learn Anything</h3>
            <p className="text-amber-50/80 text-sm leading-relaxed">
              From STEM to humanities, languages to creative skills — master any subject with expert AI guidance tailored to you.
            </p>
          </div>

          {/* Column 3 */}
          <div className="text-center p-6 rounded-lg bg-emerald-900/40 border-l-4 border-emerald-700 hover:border-emerald-600 transition-colors">
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-800/50 border border-amber-600/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-amber-100 mb-3">Ace Your Goals</h3>
            <p className="text-amber-50/80 text-sm leading-relaxed">
              Get real-time feedback, practice assessments, and a personalized roadmap to excellence. Success starts here.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="relative z-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 px-4 py-16 border-t-4 border-amber-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6">Our Mission</h2>
          <p className="text-lg md:text-xl text-emerald-50 leading-relaxed mb-8">
            We believe that education should be <span className="font-semibold text-amber-100">personalized, accessible, and transformative</span>. At Coarsai, our mission is to democratize world-class learning by providing an AI tutor that adapts to every learner.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-4 bg-emerald-700/40 rounded border-l-3 border-amber-500">
              <p className="text-amber-100 font-semibold">Personalized</p>
              <p className="text-emerald-50/80 text-sm mt-1">Every learning path is unique to you</p>
            </div>
            <div className="p-4 bg-emerald-700/40 rounded border-l-3 border-amber-500">
              <p className="text-amber-100 font-semibold">Accessible</p>
              <p className="text-emerald-50/80 text-sm mt-1">Learn anything, anytime, anywhere</p>
            </div>
            <div className="p-4 bg-emerald-700/40 rounded border-l-3 border-amber-500">
              <p className="text-amber-100 font-semibold">Transformative</p>
              <p className="text-emerald-50/80 text-sm mt-1">Unlock your full potential</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-20 bg-gradient-to-b from-emerald-900 via-stone-850 to-amber-900/20 px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 text-center mb-14">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <details className="group border border-emerald-700/60 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-5 bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors">
                <span className="text-base font-semibold text-amber-100">How does Coarsai personalize learning for me?</span>
                <span className="text-amber-400 group-open:rotate-180 transition-transform text-lg">▼</span>
              </summary>
              <div className="p-5 bg-stone-800/60 text-emerald-50/85 border-t border-emerald-700/40 text-sm">
                Coarsai uses advanced AI to analyze your learning style, pace, and knowledge gaps. It continuously adapts the curriculum based on your performance and feedback to ensure optimal learning outcomes.
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="group border border-emerald-700/60 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-5 bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors">
                <span className="text-base font-semibold text-amber-100">What subjects can I learn?</span>
                <span className="text-amber-400 group-open:rotate-180 transition-transform text-lg">▼</span>
              </summary>
              <div className="p-5 bg-stone-800/60 text-emerald-50/85 border-t border-emerald-700/40 text-sm">
                Coarsai covers mathematics, sciences, languages, history, arts, programming, business, and more. Our AI tutor can help you learn virtually any topic you're interested in mastering.
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="group border border-emerald-700/60 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-5 bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors">
                <span className="text-base font-semibold text-amber-100">Is Coarsai suitable for beginners?</span>
                <span className="text-amber-400 group-open:rotate-180 transition-transform text-lg">▼</span>
              </summary>
              <div className="p-5 bg-stone-800/60 text-emerald-50/85 border-t border-emerald-700/40 text-sm">
                Absolutely! Coarsai is designed for all levels. Whether you're a complete beginner or advancing your expertise, our AI adapts to start exactly where you are and guides you toward mastery.
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className="group border border-emerald-700/60 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-5 bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors">
                <span className="text-base font-semibold text-amber-100">How can I track my progress?</span>
                <span className="text-amber-400 group-open:rotate-180 transition-transform text-lg">▼</span>
              </summary>
              <div className="p-5 bg-stone-800/60 text-emerald-50/85 border-t border-emerald-700/40 text-sm">
                Coarsai provides comprehensive progress tracking with detailed analytics, skill assessments, personalized roadmaps, and real-time feedback so you always know where you stand.
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className="group border border-emerald-700/60 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-5 bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors">
                <span className="text-base font-semibold text-amber-100">Can I learn at my own pace?</span>
                <span className="text-amber-400 group-open:rotate-180 transition-transform text-lg">▼</span>
              </summary>
              <div className="p-5 bg-stone-800/60 text-emerald-50/85 border-t border-emerald-700/40 text-sm">
                Yes! Coarsai is completely self-paced. Learn whenever you want, for as long as you want. There are no deadlines—just your AI tutor ready to help you succeed on your timeline.
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Bottom Image Section - ready for image with orange transition */}
      <div className="relative z-10 w-full bg-gradient-to-b from-amber-900/40 via-amber-800/30 to-amber-700/50 px-0 py-12 flex items-center justify-center" style={{ height: "400px" }}>
        {/* Image container with visible sides - ready for your image */}
        <div className="w-full h-full max-w-6xl mx-auto px-8 md:px-12 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-lg shadow-2xl border border-emerald-700/40 flex items-center justify-center">
            {/* Placeholder for image - will transition to orange tones */}
            <div className="text-center">
              <p className="text-amber-50/60 text-lg font-light">Image Section - Your photo will appear here</p>
              <p className="text-amber-50/40 text-sm mt-2">Sides visible on desktop • Center transitions to warm orange</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
