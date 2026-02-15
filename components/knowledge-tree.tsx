"use client"

import type { SavedCourse } from "@/lib/course-store"

interface KnowledgeTreeProps {
  course: SavedCourse
  onLevelClick?: (levelIdx: number, skillIdx: number) => void
}

export function KnowledgeTree({ course, onLevelClick }: KnowledgeTreeProps) {
  const getIconForType = (type: string) => {
    const icons: Record<string, string> = {
      foundation: "🌱",
      core: "🌿",
      applied: "🌳",
      advanced: "🏔️",
      mastery: "👑",
    }
    return icons[type] || "🎯"
  }

  const getLevelColor = (icon: string): string => {
    const colors: Record<string, string> = {
      foundation: "from-green-500 to-emerald-500",
      core: "from-emerald-500 to-teal-500",
      applied: "from-teal-500 to-cyan-500",
      advanced: "from-cyan-500 to-blue-500",
      mastery: "from-yellow-500 to-orange-500",
    }
    return colors[icon] || "from-gray-500 to-slate-500"
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          >
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h2 className="text-base font-semibold text-foreground">Knowledge Tree</h2>
        </div>
        <p className="text-xs text-muted-foreground">Click any level to start learning</p>
      </div>

      {/* Horizontal tree visualization */}
      <div className="relative w-full overflow-x-auto pb-2">
        {/* Horizontal connecting line */}
        <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

        {/* Levels - Horizontal layout */}
        <div className="flex items-end gap-3 justify-between py-4 px-2 min-w-min relative z-10">
          {course.levels.map((level, idx) => {
            const icon = level.icon || "core"
            const color = getLevelColor(icon)
            const totalSkills = level.skills.length
            const completedSkills = level.skills.filter((s) => s.status === "completed").length
            const isCompleted = completedSkills === totalSkills
            const progress = Math.round((completedSkills / totalSkills) * 100)

            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
                {/* Vertical line from connector to node */}
                <div className="w-px h-2 bg-gradient-to-b from-primary/50 to-primary/30" />

                {/* Level node */}
                <div className="relative">
                  <button
                    onClick={() => {
                      const firstAvailableOrCompleted = level.skills.findIndex(
                        (s) => s.status === "available" || s.status === "completed"
                      )
                      if (firstAvailableOrCompleted !== -1) {
                        onLevelClick?.(idx, firstAvailableOrCompleted)
                      }
                    }}
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-lg shadow-md ring-3 ring-background transition-all hover:scale-105 cursor-pointer ${
                      isCompleted
                        ? `bg-gradient-to-br ${color} text-white ring-primary/30`
                        : "bg-card border-2 border-primary/20 text-primary hover:border-primary hover:shadow-lg"
                    }`}
                  >
                    {getIconForType(icon)}
                  </button>

                  {/* Progress ring for incomplete levels */}
                  {!isCompleted && progress > 0 && (
                    <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        strokeDasharray={`${(progress / 100) * 125.66} 125.66`}
                        className="transition-all duration-500"
                      />
                    </svg>
                  )}
                </div>

                {/* Level info - compact */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground leading-tight max-w-16">{level.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {completedSkills}/{totalSkills}
                  </p>
                  <div className="mt-1 h-0.5 w-12 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compact Legend */}
      <div className="mt-3 pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 flex-wrap text-xs">
          {["foundation", "core", "applied", "advanced", "mastery"].map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <span className="text-sm">{getIconForType(level)}</span>
              <span className="text-muted-foreground capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

