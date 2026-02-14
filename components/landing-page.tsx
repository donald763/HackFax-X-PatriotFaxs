"use client"

import React from "react"

interface LandingPageProps {
  onComplete: () => void
}

export function LandingPage({ onComplete }: LandingPageProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden"
      style={{
        backgroundImage: "url('/library-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 w-full flex flex-col items-center justify-start">
        {/* Top-center island (not fixed) with only Sign In button */}
        <div className="w-full max-w-3xl px-4">
          <div className="mx-auto mt-8 flex justify-center">
            <div className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
              <button
                onClick={onComplete}
                className="px-5 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-medium rounded-full shadow-sm transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Center content area */}
        <div className="flex-1 flex items-center justify-center px-4 w-full">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-white drop-shadow-lg">StudyPilot</h1>
            <p className="mt-4 text-lg text-white/90 drop-shadow-md">Your AI study co‑pilot — sign in to continue</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
