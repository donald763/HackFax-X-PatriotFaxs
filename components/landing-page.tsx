"use client"

import React from "react"

interface LandingPageProps {
  onComplete: () => void
}

export function LandingPage({ onComplete }: LandingPageProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start"
      style={{
        background: "linear-gradient(180deg, #e8f5e9 0%, #f1f8f3 40%, #ffffff 100%)",
      }}
    >
      {/* Top-center island (not fixed) with only Sign In button */}
      <div className="w-full max-w-3xl px-4">
        <div className="mx-auto mt-8 flex justify-center">
          <div className="px-6 py-3 bg-white/85 backdrop-blur-sm rounded-full border border-white/30 shadow-md">
            <button
              onClick={onComplete}
              className="px-5 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-medium rounded-full shadow-sm transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Minimal center artwork area (placeholder) */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-light text-[#2e7d32]">StudyPilot</h1>
          <p className="mt-4 text-lg text-gray-700">Your AI study co‑pilot — sign in to continue</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
