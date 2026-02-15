"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  )
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

interface SignInFormProps {
  onSignIn: () => void
}

export function SignInForm({ onSignIn }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      setError("Invalid email or password")
    } else if (result?.ok) {
      onSignIn()
    }
  }

  function handleGuest() {
    onSignIn()
  }

  function handleAuth0() {
    signIn("auth0", { callbackUrl: "/" })
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');

        @keyframes signin-fade-up {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes signin-soft-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .signin-reveal {
          opacity: 0;
          transform: translateY(14px);
          animation: signin-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--delay, 0s);
        }

        .signin-float {
          animation: signin-soft-float 6s ease-in-out infinite;
        }

        .signin-card {
          transition: transform 280ms ease, box-shadow 280ms ease, border-color 280ms ease;
        }

        .signin-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 36px rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
        }

        .signin-field {
          transition: box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease;
        }

        .signin-field:focus-within {
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.6);
          background-color: rgba(236, 253, 245, 0.6);
        }

        .signin-cta {
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        .signin-cta:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 14px 28px rgba(5, 150, 105, 0.25);
        }

        @media (prefers-reduced-motion: reduce) {
          .signin-reveal,
          .signin-float {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .signin-card,
          .signin-field,
          .signin-cta {
            transition: none !important;
          }
        }
      `}</style>
      <div className="signin-card relative w-full max-w-sm overflow-hidden rounded-2xl border-2 border-green-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
      <div className="signin-float absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-200/50 blur-2xl" />
      <div className="signin-float absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-green-200/40 blur-2xl" style={{ animationDelay: "1.5s" }} />
      <div className="signin-reveal mb-8" style={{ ["--delay" as string]: "0.05s" }}>
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <LeafIcon />
          </div>
          <span className="bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            CoursAI
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {"Sign in to continue your study session"}
        </p>
      </div>

      <Button
        variant="outline"
        className="signin-reveal h-11 w-full gap-3 rounded-xl border-green-200 bg-white font-medium hover:bg-green-50"
        type="button"
        onClick={handleAuth0}
        style={{ ["--delay" as string]: "0.14s" }}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="signin-reveal relative my-5" style={{ ["--delay" as string]: "0.2s" }}>
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
          or
        </span>
      </div>

      <form onSubmit={handleSubmit} className="signin-reveal flex flex-col gap-4" style={{ ["--delay" as string]: "0.25s" }}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="signin-field h-11 rounded-xl border-green-200 focus-visible:ring-green-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <a
              href="#"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-green-700"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="signin-field h-11 rounded-xl border-green-200 focus-visible:ring-green-500"
          />
        </div>

        <Button
          type="submit"
          className="signin-cta mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 font-medium text-white hover:from-green-700 hover:to-emerald-700"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="signin-reveal relative my-5" style={{ ["--delay" as string]: "0.35s" }}>
        <Separator />
      </div>

      <Button
        variant="outline"
        className="signin-cta signin-reveal h-11 w-full gap-2.5 rounded-xl border-dashed border-green-300 font-medium text-green-700 transition-colors hover:border-green-500 hover:bg-green-50 hover:text-green-800"
        type="button"
        onClick={handleGuest}
        style={{ ["--delay" as string]: "0.42s" }}
      >
        <UserIcon />
        Continue as Guest
      </Button>

      <p className="signin-reveal mt-6 text-center text-sm text-gray-600" style={{ ["--delay" as string]: "0.48s" }}>
        {"Don't have an account? "}
        <a href="#" className="font-medium text-green-700 underline-offset-4 hover:underline">
          Create an account
        </a>
      </p>
      </div>
    </>
  )
}
