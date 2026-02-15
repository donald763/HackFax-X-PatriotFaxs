"use client"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LogOut } from "lucide-react"
import { getCourses } from "@/lib/course-store"

export default function Sidebar() {
  const pathname = usePathname()
  const { status } = useSession()
  const [expanded, setExpanded] = useState(false)
  const [savedCoursesCount, setSavedCoursesCount] = useState(0)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSavedCoursesCount(getCourses().length)
  }, [pathname])

  // Don't render on unauthenticated pages
  if (status !== "authenticated") return null

  const navigationItems = [
    { name: "Dashboard", icon: "📊", href: "/", color: "from-green-500 to-emerald-500" },
    { name: "Calendar", icon: "📅", href: "/calendar", color: "from-teal-500 to-green-500" },
  ]

  const totalStudyTime = 5
  const weeklyGoal = 7
  const currentStreak = 5

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"]
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  function handleMouseEnter() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => setExpanded(true), 150)
  }

  function handleMouseLeave() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => setExpanded(false), 300)
  }

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative z-30 h-screen shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-green-200/60 dark:border-green-900/60 transition-all duration-300 ease-in-out flex flex-col overflow-visible ${expanded ? 'w-64' : 'w-[68px]'}`}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-green-200/60 dark:border-green-900/60">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur-md opacity-50" />
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">C</span>
            </div>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent whitespace-nowrap">
              CoursAI
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/dashboard")
          return (
            <Link key={item.name} href={item.href} title={item.name}>
              <div className={`
                relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                  : 'hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}>
                <span className="text-lg shrink-0 w-6 text-center">{item.icon}</span>
                <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                  {item.name}
                </span>
                {isActive && expanded && (
                  <div className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-white/80" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Center toggle pill */}
      {/* Toggle button - integrated design */}
{/* Apple-style pill toggle */}
{/* Elegant toggle button with proper positioning */}
<button
  onClick={() => setExpanded(!expanded)}
  className={`
    absolute top-1/2 -translate-y-1/2 z-50
    flex items-center justify-center
    transition-all duration-300 ease-in-out
    ${expanded 
      ? 'right-0 translate-x-1/2' 
      : 'right-0 translate-x-1/2'
    }
    group
  `}
  style={{
    filter: 'drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1)) drop-shadow(0 2px 4px -2px rgb(0 0 0 / 0.05))'
  }}
  title={expanded ? "Collapse sidebar" : "Expand sidebar"}
>
  {/* Main button with backdrop blur */}
  <div className={`
    relative flex items-center justify-center
    w-8 h-8 rounded-full
    bg-white/90 dark:bg-gray-800/90
    backdrop-blur-xl
    border border-green-200/60 dark:border-green-800/60
    text-green-600 hover:text-green-700 dark:text-green-400
    transition-all duration-300
    hover:scale-110 hover:border-green-300 dark:hover:border-green-700
    active:scale-95
    shadow-lg
    overflow-hidden
  `}>
    {/* Hover effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300" />
    
    {/* Icon with rotation */}
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`
        transition-transform duration-500 ease-spring
        ${expanded ? 'rotate-180' : 'rotate-0'}
      `}
    >
      <path d={expanded ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  </div>
  
  {/* Tooltip that appears on hover */}
  <div className={`
    absolute left-full ml-2 px-2 py-1
    bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
    border border-green-200/60 dark:border-green-800/60
    rounded-lg shadow-lg
    text-xs font-medium text-green-700 dark:text-green-400
    whitespace-nowrap
    transition-all duration-200
    opacity-0 group-hover:opacity-100
    translate-x-[-8px] group-hover:translate-x-0
    pointer-events-none
    z-50
  `}>
    {expanded ? 'Collapse sidebar' : 'Expand sidebar'}
    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-white/90 dark:border-r-gray-800/90" />
  </div>
</button>
      {/* Bottom section */}
      <div className="border-t border-green-200/60 dark:border-green-900/60">
        {/* Stats - visible when expanded */}
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-60 opacity-100 px-4 py-4' : 'max-h-0 opacity-0 px-0 py-0'}`}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500 dark:text-gray-400">Weekly Goal</span>
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {totalStudyTime}/{weeklyGoal}
                </span>
              </div>
              <Progress value={(totalStudyTime / weeklyGoal) * 100} className="h-1.5 bg-green-100 dark:bg-green-950">
                <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-500"
                     style={{ width: `${(totalStudyTime / weeklyGoal) * 100}%` }} />
              </Progress>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Streak</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">{currentStreak}d</p>
              </div>
              <div className="flex gap-0.5">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium
                      ${index <= adjustedToday
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Active Courses</span>
              <span className="font-bold text-green-700 dark:text-green-400">{savedCoursesCount}</span>
            </div>
          </div>
        </div>

        {/* Collapsed mini stats */}
        <div className={`overflow-hidden transition-all duration-300 ${!expanded ? 'max-h-40 opacity-100 py-3 px-2' : 'max-h-0 opacity-0 py-0 px-0'}`}>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <svg width="36" height="36" viewBox="0 0 40 40" className="mx-auto">
                <defs>
                  <linearGradient id="greenGradientSmall" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-green-200 dark:text-green-900" />
                <circle cx="20" cy="20" r="16" stroke="url(#greenGradientSmall)" strokeWidth="3" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - totalStudyTime / weeklyGoal)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500 -rotate-90 origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-green-700 dark:text-green-400">
                  {Math.round((totalStudyTime / weeklyGoal) * 100)}%
                </span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-green-700 dark:text-green-400">{currentStreak}d</p>
          </div>
        </div>

        {/* Sign out */}
        <div className={`px-3 pb-3 transition-all duration-300 ${expanded ? '' : 'flex justify-center'}`}>
          <Button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            variant="ghost"
            size="sm"
            className={`text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 ${expanded ? 'w-full justify-start gap-2' : 'w-9 h-9 p-0'}`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`text-sm overflow-hidden transition-all duration-300 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              Sign Out
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
