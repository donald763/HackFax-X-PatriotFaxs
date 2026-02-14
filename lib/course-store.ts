export interface SkillContent {
  data: any
  type: string
  generatedAt: number
}

export interface SavedSkill {
  name: string
  description: string
  type: string
  duration: string
  status: "available" | "locked" | "completed"
  content?: SkillContent | null
}

export interface SavedLevel {
  name: string
  description: string
  icon: string
  skills: SavedSkill[]
}

export interface SavedCourse {
  id: string
  topic: string
  materials: string[]
  proficiency: number
  levels: SavedLevel[]
  createdAt: number
  lastAccessedAt: number
}

const STORAGE_KEY = "studypilot_courses"

export function getCourses(): SavedCourse[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getCourse(id: string): SavedCourse | null {
  return getCourses().find((c) => c.id === id) ?? null
}

export function saveCourse(course: SavedCourse): void {
  const courses = getCourses()
  const idx = courses.findIndex((c) => c.id === course.id)
  if (idx >= 0) {
    courses[idx] = course
  } else {
    courses.unshift(course)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}

export function deleteCourse(id: string): void {
  const courses = getCourses().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}

export function createCourseId(): string {
  return `course_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function getCourseMastery(course: SavedCourse): number {
  const total = course.levels.reduce((a, l) => a + l.skills.length, 0)
  if (total === 0) return 0
  const completed = course.levels.reduce(
    (a, l) => a + l.skills.filter((s) => s.status === "completed").length, 0
  )
  return Math.round((completed / total) * 100)
}
