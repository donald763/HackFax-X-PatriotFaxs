"use client"

import { SignInForm } from "@/components/sign-in-form"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

  const handleGuest = () => {
    router.push("/browse")
  }

  return (
    <main className="flex min-h-svh">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-card">
        <SignInForm onGuest={handleGuest} />
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
              {'"CoursAI transformed my learning journey. With personalized AI tutoring, I mastered subjects I thought were impossible. The adaptive learning curves to my pace perfectly."'}
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
  )
}
