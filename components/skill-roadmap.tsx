"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Skill tree data generation based on topic
function generateSkillTree(topic: string, materials: string[]) {
  const materialLabel = materials.length > 0 ? materials.join(", ") : "All materials"

  const trees: Record<string, { levels: Level[] }> = {
    default: {
      levels: [
        {
          name: "Foundation",
          description: "Core concepts and terminology",
          skills: [
            { name: `Introduction to ${topic}`, status: "available" },
            { name: "Key Terminology & Definitions", status: "available" },
            { name: "Historical Context & Background", status: "available" },
            { name: "Fundamental Principles", status: "locked" },
          ],
        },
        {
          name: "Core Knowledge",
          description: "Build deep understanding",
          skills: [
            { name: "Core Theories & Models", status: "locked" },
            { name: "Important Frameworks", status: "locked" },
            { name: "Key Relationships & Connections", status: "locked" },
            { name: "Common Misconceptions", status: "locked" },
            { name: "Worked Examples", status: "locked" },
          ],
        },
        {
          name: "Applied Skills",
          description: "Put knowledge into practice",
          skills: [
            { name: "Problem Solving Techniques", status: "locked" },
            { name: "Case Studies & Analysis", status: "locked" },
            { name: "Real-World Applications", status: "locked" },
            { name: "Cross-Topic Connections", status: "locked" },
          ],
        },
        {
          name: "Advanced Topics",
          description: "Push beyond the basics",
          skills: [
            { name: "Cutting-Edge Research", status: "locked" },
            { name: "Complex Problem Sets", status: "locked" },
            { name: "Debates & Open Questions", status: "locked" },
          ],
        },
        {
          name: "Mastery",
          description: "Demonstrate complete understanding",
          skills: [
            { name: "Comprehensive Assessment", status: "locked" },
            { name: `Teach ${topic} to Others`, status: "locked" },
            { name: "Create Original Analysis", status: "locked" },
          ],
        },
      ],
    },
  }

  const tree = trees.default
  return { ...tree, topic, materialLabel }
}

type SkillStatus = "available" | "locked" | "completed"

interface Skill {
  name: string
  status: SkillStatus
}

interface Level {
  name: string
  description: string
  skills: Skill[]
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  )
}

interface SkillRoadmapProps {
  topic: string
  materials: string[]
  onBack: () => void
}

export function SkillRoadmap({ topic, materials, onBack }: SkillRoadmapProps) {
  const [loading, setLoading] = useState(true)
  const [tree, setTree] = useState<ReturnType<typeof generateSkillTree> | null>(null)
  const [revealedLevels, setRevealedLevels] = useState(0)
  const loadingRef = useRef(false)

  // Simulate "deep search" loading
  useEffect(() => {
    if (loadingRef.current) return
    loadingRef.current = true

    const t1 = setTimeout(() => {
      setTree(generateSkillTree(topic, materials))
      setLoading(false)
    }, 2200)

    return () => clearTimeout(t1)
  }, [topic, materials])

  // Stagger reveal levels
  useEffect(() => {
    if (loading || !tree) return
    if (revealedLevels >= tree.levels.length) return

    const t = setTimeout(() => {
      setRevealedLevels((prev) => prev + 1)
    }, 150)

    return () => clearTimeout(t)
  }, [loading, tree, revealedLevels])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5 px-6 text-center">
          <div className="relative">
            <div
              className="h-16 w-16 rounded-full border-[3px] border-muted"
              style={{ borderTopColor: "hsl(var(--primary))", animation: "spin 1s linear infinite" }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <MapIcon />
            </div>
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Building your roadmap</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {"Deep searching \""}
              <span className="text-primary font-medium">{topic}</span>
              {"\" to create your personalized skill tree..."}
            </p>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-1 w-8 rounded-full bg-primary/20"
                style={{
                  animation: `loadingBar 2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes loadingBar {
            0%, 100% { opacity: 0.2; transform: scaleX(0.6); }
            50% { opacity: 1; transform: scaleX(1); }
          }
        `}</style>
      </div>
    )
  }

  if (!tree) return null

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LeafIcon />
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                StudyPilot
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="font-normal text-xs">
            {tree.materialLabel}
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Title */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapIcon />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">
            {tree.topic}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Your personalized learning roadmap -- {tree.levels.reduce((a, l) => a + l.skills.length, 0)} skills across {tree.levels.length} levels
          </p>
        </div>

        {/* Skill Tree */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-8">
            {tree.levels.map((level, levelIdx) => {
              const isRevealed = levelIdx < revealedLevels
              const isFirst = levelIdx === 0
              const completedCount = level.skills.filter(s => s.status === "completed").length
              const availableCount = level.skills.filter(s => s.status === "available").length

              return (
                <div
                  key={level.name}
                  className="relative pl-14 md:pl-20"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                  }}
                >
                  {/* Level node on the line */}
                  <div
                    className={`absolute left-3 md:left-5 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      isFirst
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {levelIdx + 1}
                  </div>

                  {/* Level header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-semibold text-foreground">{level.name}</h2>
                      {isFirst && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">
                          Start Here
                        </Badge>
                      )}
                      {availableCount > 0 && !isFirst && (
                        <Badge variant="outline" className="text-xs">
                          {availableCount} available
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{level.description}</p>
                    {level.skills.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 flex-1 max-w-48 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-700"
                            style={{ width: `${(completedCount / level.skills.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {completedCount}/{level.skills.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-col gap-2">
                    {level.skills.map((skill, skillIdx) => (
                      <button
                        key={skill.name}
                        type="button"
                        disabled={skill.status === "locked"}
                        className={`group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                          skill.status === "completed"
                            ? "border-primary/30 bg-primary/5"
                            : skill.status === "available"
                              ? "border-border bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm cursor-pointer"
                              : "border-border/50 bg-muted/30 opacity-60 cursor-not-allowed"
                        }`}
                        style={{
                          opacity: isRevealed ? (skill.status === "locked" ? 0.55 : 1) : 0,
                          transform: isRevealed ? "translateX(0)" : "translateX(12px)",
                          transition: `opacity 0.4s ease-out ${skillIdx * 0.06}s, transform 0.4s ease-out ${skillIdx * 0.06}s`,
                        }}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            skill.status === "completed"
                              ? "bg-primary text-primary-foreground"
                              : skill.status === "available"
                                ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {skill.status === "completed" ? <CheckIcon /> : skill.status === "available" ? <PlayIcon /> : <LockIcon />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            skill.status === "locked" ? "text-muted-foreground" : "text-foreground"
                          }`}>
                            {skill.name}
                          </p>
                        </div>
                        {skill.status === "available" && (
                          <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                            Start
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center pb-12">
          <p className="text-sm text-muted-foreground">
            Begin with the foundation and unlock new skills as you progress
          </p>
          <Button className="h-11 px-8 gap-2 font-medium">
            <PlayIcon />
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  )
}
