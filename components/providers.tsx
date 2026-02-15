"use client"

import { SessionProvider } from "next-auth/react"
import Sidebar from "@/components/sidebar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </SessionProvider>
  )
}
