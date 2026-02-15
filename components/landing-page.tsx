"use client";

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
      <div className="relative z-20 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 px-4 py-20">
        {/* Marketing subtext */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xl md:text-2xl text-amber-100 leading-relaxed drop-shadow-lg">
            Master anything with intelligent, personalized learning. From mathematics to languages, from science to arts — learn at your own pace with an AI tutor that adapts to you.
          </p>
        </div>

        {/* Three columns of hype content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Column 1 */}
          <div className="text-center">
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
          <div className="text-center">
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
          <div className="text-center">
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
    </div>
  )
}

export default LandingPage;