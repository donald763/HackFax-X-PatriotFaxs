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
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-stone-900/95 backdrop-blur-sm border-b border-emerald-700/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-100">Coarsai</h1>
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-colors"
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
          <h2 className="text-5xl md:text-7xl font-bold text-amber-50 mb-4 drop-shadow-2xl">Coarsai</h2>
          <h3 className="text-2xl md:text-4xl text-amber-100 font-light mb-6 drop-shadow-lg">
            Your Ultimate AI Tutor
          </h3>
          <p className="text-lg md:text-xl text-amber-50/90 max-w-2xl mx-auto drop-shadow-md">
            Master anything with intelligent, personalized learning. Choose your path and let AI guide you to excellence.
          </p>
        </div>
      </div>

      {/* Learning Paths Section (Bento Grid) */}
      <div className="relative z-20 bg-gradient-to-b from-stone-900 via-stone-800 to-emerald-950 px-4 md:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-4">Learning Paths</h2>
            <p className="text-lg text-amber-100">Choose the learning tier that fits your goals</p>
          </div>

          {/* Three-Column Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Path */}
            <div className="rounded-lg overflow-hidden bg-emerald-900/40 border border-emerald-700/60 hover:border-amber-500/60 transition-colors group">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-900/60 aspect-video flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage: "url('/library-background.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
                    WebkitMask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
                  }}
                />
                <div className="relative z-10 text-center">
                  <p className="text-5xl mb-2">📚</p>
                  <p className="text-amber-100 font-semibold">Starter</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-amber-100 mb-2">Starter Path</h3>
                <p className="text-amber-50/80 text-sm mb-6">
                  Begin your learning journey with guided foundations and adaptive lessons.
                </p>
                <div className="space-y-3 mb-6 text-sm text-amber-50/70">
                  <p>✓ 5 subject categories</p>
                  <p>✓ Adaptive learning</p>
                  <p>✓ Basic progress tracking</p>
                  <p>✓ Community access</p>
                </div>
              </div>
            </div>

            {/* Professional Path */}
            <div className="rounded-lg overflow-hidden bg-emerald-800/50 border-2 border-amber-500/80 hover:border-amber-400 transition-colors group md:row-span-1 md:col-span-1 ring-1 ring-amber-500/20">
              <div className="bg-gradient-to-br from-amber-900 to-emerald-900/80 aspect-video flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    backgroundImage: "url('/library-background.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
                    WebkitMask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
                  }}
                />
                <div className="relative z-10 text-center">
                  <p className="text-5xl mb-2">⭐</p>
                  <p className="text-amber-100 font-semibold">Most Popular</p>
                </div>
              </div>
              <div className="p-6 bg-emerald-900/30">
                <h3 className="text-2xl font-bold text-amber-100 mb-2">Professional Path</h3>
                <p className="text-amber-50/80 text-sm mb-6">
                  Master advanced topics with expert AI tutoring and comprehensive analytics.
                </p>
                <div className="space-y-3 mb-6 text-sm text-amber-50/70">
                  <p>✓ 30+ subject categories</p>
                  <p>✓ Advanced AI tutoring</p>
                  <p>✓ Detailed analytics</p>
                  <p>✓ Certification prep</p>
                  <p>✓ Priority support</p>
                </div>
              </div>
            </div>

            {/* Master Path */}
            <div className="rounded-lg overflow-hidden bg-emerald-900/40 border border-emerald-700/60 hover:border-amber-500/60 transition-colors group">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-900/60 aspect-video flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage: "url('/library-background.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
                    WebkitMask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
                  }}
                />
                <div className="relative z-10 text-center">
                  <p className="text-5xl mb-2">👑</p>
                  <p className="text-amber-100 font-semibold">Master</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-amber-100 mb-2">Master Path</h3>
                <p className="text-amber-50/80 text-sm mb-6">
                  Unlock unlimited learning with personalized roadmaps and 1-on-1 guidance.
                </p>
                <div className="space-y-3 mb-6 text-sm text-amber-50/70">
                  <p>✓ All subjects unlocked</p>
                  <p>✓ Personal AI tutor</p>
                  <p>✓ Custom learning plans</p>
                  <p>✓ 1-on-1 mentorship</p>
                  <p>✓ VIP support 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900/60 px-4 md:px-6 py-20 border-t-4 border-amber-600">
        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/library-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
            WebkitMask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
            opacity: 0.25,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-100 mb-3">Adaptive Learning</h3>
              <p className="text-emerald-50/80">
                Our AI analyzes your learning style and adjusts difficulty, pacing, and content in real-time to maximize comprehension.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-100 mb-3">Expert Guidance</h3>
              <p className="text-emerald-50/80">
                Access instant explanations, worked examples, and personalized hints whenever you need them.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-100 mb-3">Track Progress</h3>
              <p className="text-emerald-50/80">
                Detailed analytics and progress roadmaps show exactly where you stand and what to focus on next.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-20 bg-gradient-to-b from-emerald-900 via-stone-850 to-amber-900/20 px-4 md:px-6 py-20 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/library-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
            WebkitMask: "linear-gradient(90deg, black 0%, black 5in, transparent 10in, transparent calc(100% - 10in), black calc(100% - 5in), black 100%)",
            opacity: 0.2,
          }}
        />

        <div className="relative z-10 w-full max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 text-center mb-14">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: "How does Coarsai personalize learning for me?",
                a: "Coarsai uses advanced AI to analyze your learning style, pace, and knowledge gaps. It continuously adapts the curriculum based on your performance and feedback.",
              },
              {
                q: "What subjects can I learn with Coarsai?",
                a: "Coarsai covers 30+ subjects including mathematics, sciences, languages, history, arts, programming, and business.",
              },
              {
                q: "Is Coarsai suitable for beginners?",
                a: "Absolutely! Coarsai adapts to all levels, from complete beginners to advanced learners.",
              },
              {
                q: "Can I switch learning paths?",
                a: "Yes! You can upgrade, downgrade, or switch paths anytime to match your current goals and needs.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes! Start with our free Starter Path and upgrade anytime. No credit card required.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group border border-emerald-700/60 rounded-lg overflow-hidden hover:border-amber-500/60 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 bg-emerald-800/30 hover:bg-emerald-800/50 transition-colors">
                  <span className="text-base font-semibold text-amber-100">{item.q}</span>
                  <span className="text-amber-400 group-open:rotate-180 transition-transform text-lg">▼</span>
                </summary>
                <div className="p-5 bg-stone-800/60 text-emerald-50/85 border-t border-emerald-700/40 text-sm">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 bg-stone-950 border-t border-emerald-700/20 px-4 md:px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-amber-100 font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-emerald-50/70 text-sm">
              <li><a href="#" className="hover:text-amber-100">Learning Paths</a></li>
              <li><a href="#" className="hover:text-amber-100">AI Technology</a></li>
              <li><a href="#" className="hover:text-amber-100">Courses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-100 font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-emerald-50/70 text-sm">
              <li><a href="#" className="hover:text-amber-100">Our Story</a></li>
              <li><a href="#" className="hover:text-amber-100">Team</a></li>
              <li><a href="#" className="hover:text-amber-100">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-100 font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-emerald-50/70 text-sm">
              <li><a href="#" className="hover:text-amber-100">FAQ</a></li>
              <li><a href="#" className="hover:text-amber-100">Help Center</a></li>
              <li><a href="#" className="hover:text-amber-100">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-100 font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-emerald-50/70 text-sm">
              <li><a href="#" className="hover:text-amber-100">Privacy</a></li>
              <li><a href="#" className="hover:text-amber-100">Terms</a></li>
              <li><a href="#" className="hover:text-amber-100">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-700/20 pt-8 text-center">
          <p className="text-emerald-50/60 text-sm mb-4">
            Coarsai - Your Ultimate AI Tutor. Master anything, learn at your pace.
          </p>
          <p className="text-emerald-50/40 text-xs">© 2026 Coarsai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
