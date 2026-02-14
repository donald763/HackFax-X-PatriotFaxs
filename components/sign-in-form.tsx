"use client"

import { useState } from "react"
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)
    onSignIn()
  }

  function handleGuest() {
    onSignIn()
  }

  function handleGoogle() {
    onSignIn()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LeafIcon />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            StudyPilot
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {"Sign in to continue your study session"}
        </p>
      </div>

      {/* Guest option */}
      <Button
        variant="outline"
        className="w-full h-11 gap-2.5 font-medium mb-4 border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors"
        type="button"
        onClick={handleGuest}
      >
        <UserIcon />
        Continue as Guest
      </Button>

      <div className="relative my-5">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
          or sign in
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 gap-3 font-medium"
        type="button"
        onClick={handleGoogle}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="relative my-5">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
          or
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="h-11"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <a
              href="#"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
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
            className="h-11"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 mt-1 font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <a href="#" className="font-medium text-primary hover:underline underline-offset-4">
          Create an account
        </a>
      </p>
    </div>
  )
}
