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
    <div className="w-full bg-green-950 overflow-x-hidden">
      {/* Navigation Island */}
      <nav className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center justify-center gap-6 px-8 py-4 bg-green-900/80 backdrop-blur-md border border-green-600/40 rounded-full shadow-lg">
          <h1 className="text-2xl font-bold text-green-50">Coarsai</h1>
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20">
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

        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h2 className="text-5xl md:text-7xl font-bold text-green-50 mb-4 drop-shadow-2xl">Coarsai</h2>
          <h3 className="text-2xl md:text-4xl text-green-100 font-light mb-6 drop-shadow-lg">
            Your Ultimate AI Tutor
          </h3>
          <p className="text-lg md:text-xl text-green-50/90 max-w-2xl mx-auto drop-shadow-md">
            Master anything with intelligent, personalized learning. Choose your path and let AI guide you to excellence.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
