"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCourses, deleteCourse, getCourseMastery, type SavedCourse } from "@/lib/course-store"
import Sidebar from "@/components/sidebar"
import GenerateCourseModal from "@/components/generate-course-modal"
import StudyHeatmap from "@/components/study-heatmap"

const TRENDING_TOPICS = [
  { name: "Machine Learning", count: "12.4k", color: "from-green-600 to-emerald-500" },
  { name: "Organic Chemistry", count: "8.9k", color: "from-teal-600 to-green-500" },
  { name: "Linear Algebra", count: "7.2k", color: "from-emerald-600 to-teal-500" },
  { name: "US History", count: "6.1k", color: "from-green-700 to-emerald-600" },
  { name: "Microeconomics", count: "5.8k", color: "from-teal-700 to-green-600" },
]

const CATEGORIES = [
  { 
    title: "Science & Engineering", 
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    icon: "🔬", 
    topics: ["Physics", "Chemistry", "Biology", "Computer Science", "Electrical Engineering", "Mechanical Engineering"],
  },
  { 
    title: "Mathematics", 
    gradient: "from-teal-600 via-green-600 to-emerald-600",
    icon: "📐", 
    topics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math", "Differential Equations", "Number Theory"],
  },
  { 
    title: "Humanities", 
    gradient: "from-emerald-600 via-teal-600 to-green-600",
    icon: "📚", 
    topics: ["History", "Philosophy", "Literature", "Art History", "Linguistics", "Religious Studies"],
  },
  { 
    title: "Business & Economics", 
    gradient: "from-green-700 via-emerald-700 to-teal-700",
    icon: "📊", 
    topics: ["Microeconomics", "Macroeconomics", "Finance", "Marketing", "Accounting", "Management"],
  },
  { 
    title: "Health & Medicine", 
    gradient: "from-teal-700 via-green-700 to-emerald-700",
    icon: "🏥", 
    topics: ["Anatomy", "Pharmacology", "Pathology", "Neuroscience", "Public Health", "Nutrition"],
  },
  { 
    title: "Languages", 
    gradient: "from-emerald-700 via-teal-700 to-green-700",
    icon: "🗣️", 
    topics: ["Spanish", "French", "Mandarin", "German", "Japanese", "Arabic"],
  },
]

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 18L9 11.25L13.306 15.556L21.75 6.75M21.75 6.75H16.3125M21.75 6.75V12.1875" 
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.813 15.904L8.25 18L6.687 15.904C6.244 15.329 5.671 14.756 5.096 14.313L3 12.75L5.096 11.187C5.671 10.744 6.244 10.171 6.687 9.596L8.25 7.5L9.813 9.596C10.256 10.171 10.829 10.744 11.404 11.187L13.5 12.75L11.404 14.313C10.829 14.756 10.256 15.329 9.813 15.904Z" 
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16.5 7.5L17.437 8.802C17.754 9.265 18.235 9.746 18.698 10.063L20 11L18.698 11.937C18.235 12.254 17.754 12.735 17.437 13.198L16.5 14.5L15.563 13.198C15.246 12.735 14.765 12.254 14.302 11.937L13 11L14.302 10.063C14.765 9.746 15.246 9.265 15.563 8.802L16.5 7.5Z" 
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

interface BrowseTopicsProps {
  onSelectTopic: (topic: string) => void
  onResumeCourse?: (courseId: string, topic: string) => void
}

export default function BrowseTopics({ onSelectTopic, onResumeCourse }: BrowseTopicsProps) {
  const { data: session } = useSession()
  const [search, setSearch] = useState("")
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  useEffect(() => {
    setSavedCourses(getCourses())
  }, [])

  function handleDeleteCourse(id: string) {
    deleteCourse(id)
    setSavedCourses(getCourses())
  }

  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    topics: cat.topics.filter((t) => t.toLowerCase().includes(search.toLowerCase())),
  })).filter((cat) => (search === "" ? true : cat.topics.length > 0))

  const hasCustomSearch = search.trim().length > 0 && filteredCategories.length === 0

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      onSelectTopic(search.trim())
    }
  }

  const totalStudyTime = savedCourses.reduce((acc, course) => {
    return acc + (course.matrixData?.filter(d => d.intensity > 0).length || 0)
  }, 0)

  const weeklyGoal = 7
  const currentStreak = 5

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
        
        * {
          font-family: 'Bubblegum Sans', cursive;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-from-bottom {
          from { transform: translateY(1rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-in {
          animation-duration: 0.7s;
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fade-in;
        }
        
        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom;
        }
      `}</style>

      <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 fixed inset-0">
        {/* Sidebar */}
        <Sidebar 
          totalStudyTime={totalStudyTime}
          weeklyGoal={weeklyGoal}
          currentStreak={currentStreak}
          savedCoursesCount={savedCourses.length}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-xl opacity-40 animate-pulse-glow" />
                <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">C</span>
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Coarsai
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Learn something new today</p>
              </div>
            </div>

            <Button
              onClick={() => setShowGenerateModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-6 py-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <SparklesIcon />
                Generate Course
              </span>
            </Button>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              What would you like to study?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Browse topics or search for anything you want to learn
            </p>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for any topic..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-14 pl-12 pr-36 text-base bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-green-200 dark:border-green-900 rounded-2xl shadow-xl focus:border-green-500 focus:ring-0 transition-all duration-300 w-full"
                  />
                  {search.trim() && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <span className="flex items-center gap-2">
                          Study
                          <ArrowRightIcon />
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* My Courses */}
          {savedCourses.length > 0 && search === "" && (
            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-green-800 dark:text-green-300">
                  <SparklesIcon />
                  My Courses
                </h2>
                <Badge variant="secondary" className="rounded-full px-4 py-1.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {savedCourses.length} active
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCourses.map((course, index) => {
                  const mastery = getCourseMastery(course)
                  const totalSkills = course.levels?.reduce((a, l) => a + (l.skills?.length || 0), 0) || 0
                  const completed = course.levels?.reduce((a, l) => a + (l.skills?.filter((s) => s?.status === "completed").length || 0), 0) || 0
                  
                  return (
                    <div
                      key={course.id}
                      className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Card 
                        onClick={() => onResumeCourse?.(course.id, course.topic)}
                        className="cursor-pointer overflow-hidden border-2 border-green-200 dark:border-green-800 hover:border-green-500 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 relative"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
                                  <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-green-100 dark:text-green-900"
                                  />
                                  <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    stroke="url(#greenGradient)"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={`${2 * Math.PI * 24}`}
                                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - mastery / 100)}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {mastery}%
                                  </span>
                                </div>
                                <defs>
                                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#059669" />
                                    <stop offset="100%" stopColor="#10B981" />
                                  </linearGradient>
                                </defs>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{course.topic}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {completed}/{totalSkills} skills
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Study Heatmap */}
                          <div className="mt-4 flex justify-center">
                            <StudyHeatmap data={course.matrixData || []} compact={true} />
                          </div>
                        </CardContent>
                        
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCourse(course.id)
                          }}
                          className="absolute top-3 right-3 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-300 hover:scale-110"
                          aria-label="Delete course"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Custom Search Result */}
          {hasCustomSearch && (
            <div className="max-w-4xl mx-auto mb-12">
              <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <CardContent className="p-10 relative">
                  <div className="absolute inset-0 bg-grid-white/10" />
                  <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                      Ready to study "{search.trim()}"?
                    </h2>
                    <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                      This topic isn't in our catalog yet, but we can generate personalized study materials for you.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => setShowGenerateModal(true)}
                      className="bg-white text-green-700 hover:bg-white/90 hover:text-green-800 rounded-xl px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        Generate Course
                        <ArrowRightIcon />
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trending Section */}
          {search === "" && (
            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                  <TrendingIcon />
                </div>
                <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300">Trending Now</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic.name}
                    onClick={() => onSelectTopic(topic.name)}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r p-px transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${topic.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative flex items-center gap-3 rounded-2xl bg-white dark:bg-gray-900 px-5 py-3 group-hover:bg-transparent transition-colors duration-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-white transition-colors">
                        {topic.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                        {topic.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {filteredCategories.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold mb-8 text-green-800 dark:text-green-300">
                {search ? "Search Results" : "Browse by Subject"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((cat, index) => (
                  <div
                    key={cat.title}
                    className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="overflow-hidden border-2 border-green-200 dark:border-green-800 hover:border-green-500 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:-translate-y-1">
                      <div className={`h-2 bg-gradient-to-r ${cat.gradient}`} />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl">{cat.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{cat.title}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {cat.topics.map((topic) => (
                            <button
                              key={topic}
                              onClick={() => onSelectTopic(topic)}
                              className="px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-950/30 text-sm font-medium text-green-800 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 hover:text-white transition-all duration-300 hover:scale-105"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generate Course Modal */}
      <GenerateCourseModal 
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={(topic) => {
          setShowGenerateModal(false)
          onSelectTopic(topic)
        }}
      />
    </>
  )
}