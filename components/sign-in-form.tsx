"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

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

  function handleMasonID() {
    // Redirect to GMU Patriot login
    window.location.href = "https://sts.gmu.edu/adfs/ls/?client-request-id=b67797cb-8622-ddd9-9830-0e86ef0ad5f4&username=&wa=wsignin1.0&wtrealm=urn%3afederation%3aMicrosoftOnline&wctx=estsredirect%3d2%26estsrequest%3drQQIARAAjZJPaNNgGMbzLVvXVbd1U0R2KnUMUZrmS5O2KezQrVvXbenW7l8bkfIl-dKmS5ouf_bXgXgYOwju5pwexONAGROGiAfxJNvBXQQdCLspXibiYUc3vCoIDy_vA8_h5fc-Pg9LMVGKvkEyFJ3o5iHPSypDhxCMqCEW0rFQnFPkEM1AyMbiMayycavT5z94uLAXXPv8ZZNuWzvxffy1BZrLhkthxd0G1yqOU7cT4bDpOrppzlKmqmoyjkQ5SjaNsIE0PfwKgEMAvgGw3dBNQ17mMIyEWInmQjHIohCPcSzExiRZZnkWYj5-1NA-lnSdCnM-TEtbxj8bvKqFygauOVvkc4CXhutifyaaqSYXx2YEKE4OLI9O5jUhlXOyzBRbnIDaWLrIjM5Mz4rpbEVIFRkxlaGFpYydMaCupAe0sZqtoRmOFgvDlWIkX5cYbgoX-vRM1dRkY3oWFYb1YiSnqQW69w4aytPykBAdXeLnlULelhjeGjV4QzT0qjgpMNkJriox9Lw0M1iX-uMlxcjxUiE7LywX4TbZ9XdG54B2yVbTKqOatowczazZ-2Ty3-EwpWAVuboTMOu4pimBumWqmo4DZxFdq-ESkmVs259IcNgIvjde8Tb6u64SAeJ6D00mvF6fnzh3p43gWdPZV9-8v_z03YdHI3dfPtg4ftJD7DeFayk2OV1GcgrBPh7CxblUX2ZxSFEHB_NufxqKbAEKGaO4xLvJXj4BNzxgw3Np19PiJf1EkOwfh_uedsNGOlW1KckyF2xs_fCA9Wbidcv_9GTTB7Z9NzlGK-UsvRJF2cKIO4forCVOC1xOlnM5Ja0WswPxKajTxnh5YMcHDi-Ao4txn0fWkWbYndRK8A-EkmPO4lowsRJcNOySLJ9v80h3sR1M3AqenRq8vbq6-raVOG17cbD39f69xydDO37i-EwdxGlHYL2T-A01#"
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LeafIcon />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Coarsai
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {"Sign in to continue your study session"}
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 gap-3 font-medium"
        type="button"
        onClick={handleMasonID}
      >
        <UserIcon />
        Sign in with Mason ID
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

      <div className="relative my-5">
        <Separator />
      </div>

      <Button
        variant="outline"
        className="w-full h-11 gap-2.5 font-medium border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors"
        type="button"
        onClick={handleGuest}
      >
        <UserIcon />
        Continue as Guest
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <a href="#" className="font-medium text-primary hover:underline underline-offset-4">
          Create an account
        </a>
      </p>
    </div>
  )
}
