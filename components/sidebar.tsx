"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface SidebarProps {
  totalStudyTime: number
  weeklyGoal: number
  currentStreak: number
  savedCoursesCount: number
}

export default function Sidebar({ totalStudyTime, weeklyGoal, currentStreak, savedCoursesCount }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navigationItems = [
    { name: "Dashboard", icon: "📊", href: "/dashboard", color: "from-green-500 to-emerald-500" },
    { name: "Browse", icon: "🔍", href: "/browse", color: "from-teal-500 to-green-500" },
    { name: "My Courses", icon: "📚", href: "/courses", color: "from-emerald-500 to-teal-500" },
    { name: "Progress", icon: "📈", href: "/progress", color: "from-green-600 to-emerald-600" },
    { name: "Settings", icon: "⚙️", href: "/settings", color: "from-teal-600 to-green-600" },
  ]

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"]
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1 // Convert to 0-6 where 0 is Monday

  return (
    <div className={`relative h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-green-200 dark:border-green-900 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform duration-300"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {collapsed ? (
            <path d="M13 5L19 12L13 19M5 5L11 12L5 19" strokeLinecap="round"/>
          ) : (
            <path d="M11 5L5 12L11 19M19 5L13 12L19 19" strokeLinecap="round"/>
          )}
        </svg>
      </button>

      {/* Logo */}
      <div className="p-6 border-b border-green-200 dark:border-green-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur-md opacity-60" />
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">C</span>
            </div>
          </div>
          {!collapsed && (
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Coarsai
              </span>
              <p className="text-xs text-gray-500">Learning Assistant</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div className={`
                relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                  : 'hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-300'
                }
              `}>
                <span className="text-xl">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </>
                )}
                {collapsed && isActive && (
                  <div className="absolute -right-1 w-1.5 h-8 rounded-full bg-gradient-to-b from-green-500 to-emerald-500" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Progress Stats */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-green-200 dark:border-green-900 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Weekly Goal</span>
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {totalStudyTime}/{weeklyGoal} days
                </span>
              </div>
              <Progress value={(totalStudyTime / weeklyGoal) * 100} className="h-2 bg-green-100 dark:bg-green-950">
                <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-500" 
                     style={{ width: `${(totalStudyTime / weeklyGoal) * 100}%` }} />
              </Progress>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{currentStreak} days</p>
              </div>
              <div className="flex gap-1">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                      ${index <= adjustedToday 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                      }
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Active Courses</span>
                <span className="font-bold text-green-700 dark:text-green-400">{savedCoursesCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Stats */}
      {collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-200 dark:border-green-900 text-center">
          <div className="space-y-3">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto">
                <defs>
                  <linearGradient id="greenGradientSmall" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-green-200 dark:text-green-900"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="url(#greenGradientSmall)"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - totalStudyTime / weeklyGoal)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-green-700 dark:text-green-400">
                  {Math.round((totalStudyTime / weeklyGoal) * 100)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Streak</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{currentStreak}d</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}