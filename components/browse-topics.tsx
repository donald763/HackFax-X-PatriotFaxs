"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCourses, deleteCourse, getCourseMastery, type SavedCourse } from "@/lib/course-store"
import GenerateCourseModal from "@/components/generate-course-modal"
import StudyHeatmap from "@/components/study-heatmap"

const TRENDING_TOPICS = [
  { name: "Machine Learning", color: "from-green-600 to-emerald-500" },
  { name: "Organic Chemistry", color: "from-teal-600 to-green-500" },
  { name: "Linear Algebra", color: "from-emerald-600 to-teal-500" },
  { name: "US History", color: "from-green-700 to-emerald-600" },
  { name: "Microeconomics", color: "from-teal-700 to-green-600" },
  { name: "Artificial Intelligence", color: "from-purple-600 to-pink-500" },
  { name: "Web Development", color: "from-blue-600 to-cyan-500" },
  { name: "Data Science", color: "from-indigo-600 to-purple-500" },
  { name: "Psychology", color: "from-pink-600 to-rose-500" },
  { name: "Creative Writing", color: "from-yellow-600 to-orange-500" },
  { name: "Quantum Physics", color: "from-violet-600 to-purple-500" },
  { name: "Economics", color: "from-amber-600 to-yellow-500" },
  { name: "Biotechnology", color: "from-emerald-600 to-green-500" },
  { name: "Philosophy", color: "from-orange-600 to-red-500" },
  { name: "Digital Marketing", color: "from-cyan-600 to-blue-500" },
  { name: "Cybersecurity", color: "from-red-600 to-pink-500" },
  { name: "Blockchain", color: "from-fuchsia-600 to-purple-500" },
  { name: "Environmental Science", color: "from-lime-600 to-green-500" },
  { name: "Astronomy", color: "from-sky-600 to-blue-500" },
  { name: "Sociology", color: "from-rose-600 to-red-500" },
  { name: "Graphic Design", color: "from-purple-600 to-pink-500" },
  { name: "Business Analytics", color: "from-teal-600 to-cyan-500" },
  { name: "Neuroscience", color: "from-indigo-600 to-blue-500" },
  { name: "Political Science", color: "from-blue-600 to-indigo-500" },
  { name: "Genetics", color: "from-green-600 to-teal-500" },
  { name: "Robotics", color: "from-gray-600 to-slate-500" },
  { name: "Game Development", color: "from-purple-600 to-pink-500" },
  { name: "Animation", color: "from-orange-600 to-amber-500" },
  { name: "Journalism", color: "from-red-600 to-orange-500" },
  { name: "International Relations", color: "from-blue-600 to-cyan-500" },
  { name: "Marine Biology", color: "from-cyan-600 to-blue-500" },
  { name: "Archaeology", color: "from-amber-600 to-brown-500" },
  { name: "Linguistics", color: "from-violet-600 to-purple-500" },
  { name: "Meteorology", color: "from-sky-600 to-blue-500" },
  { name: "Anthropology", color: "from-stone-600 to-slate-500" },
  { name: "Veterinary Science", color: "from-emerald-600 to-green-500" },
  { name: "Architecture", color: "from-gray-600 to-zinc-500" },
  { name: "Fashion Design", color: "from-pink-600 to-rose-500" },
  { name: "Culinary Arts", color: "from-orange-600 to-amber-500" },
  { name: "Music Theory", color: "from-purple-600 to-violet-500" },
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

function AttachmentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.5 8.5L11.5 15.5C10.5 16.5 9.5 16.5 8.5 15.5C7.5 14.5 7.5 13.5 8.5 12.5L15.5 5.5" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M13.5 10.5L9.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6.5 18.5L4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function FileIcon({ type }: { type: string }) {
  const getColor = () => {
    if (type.includes('pdf')) return 'text-red-500'
    if (type.includes('image')) return 'text-blue-500'
    if (type.includes('video')) return 'text-purple-500'
    if (type.includes('audio')) return 'text-yellow-500'
    if (type.includes('text') || type.includes('document')) return 'text-green-500'
    return 'text-gray-500'
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={getColor()}>
      <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9M13 2L20 9M13 2V9H20" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

interface BrowseTopicsProps {
  onSelectTopic: (topic: string, attachments?: File[]) => void
  onResumeCourse?: (courseId: string, topic: string) => void
}

export default function BrowseTopics({ onSelectTopic, onResumeCourse }: BrowseTopicsProps) {
  const { data: session } = useSession()
  const [search, setSearch] = useState("")
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSavedCourses(getCourses())
  }, [])

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (dropZoneRef.current?.contains(e.target as Node)) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!dropZoneRef.current?.contains(e.target as Node)) {
        setIsDragging(false)
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      
      const files = Array.from(e.dataTransfer?.files || [])
      if (files.length > 0) {
        setAttachments(prev => [...prev, ...files])
      }
    }

    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('drop', handleDrop)
    }
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
    if (search.trim() || attachments.length > 0) {
      onSelectTopic(search.trim(), attachments)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files])
    }
  }

  function removeAttachment(index: number) {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  function getFileIcon(file: File) {
    const type = file.type
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('video')) return '🎥'
    if (type.includes('audio')) return '🎵'
    if (type.includes('text') || type.includes('document')) return '📝'
    return '📎'
  }

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

        /* Ensure hover effects are not clipped */
        .trending-container {
          overflow: hidden !important;
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
          margin-top: -0.5rem !important;
          margin-bottom: -0.5rem !important;
        }

        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .trending-marquee {
          display: flex;
          align-items: flex-end;
          width: max-content;
          animation: marquee-scroll 60s linear infinite;
        }

        .trending-container:hover .trending-marquee {
          animation-play-state: paused;
        }

        /* Ensure buttons can expand without clipping */
        .trending-button-wrapper {
          overflow: visible !important;
          padding: 0.5rem !important;
          margin: -0.5rem !important;
        }

        /* Drag and drop styles */
        .drag-active {
          border-color: #10b981 !important;
          background-color: rgba(16, 185, 129, 0.05) !important;
        }

        .drag-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
          backdrop-filter: blur(4px);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>

      <div className="h-full bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-y-auto px-8 py-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              CoursAI
            </h1>

            
          </div>

          {/* Search Section with Attachments */}
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              What would you like to study?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Browse topics, search for anything, or upload materials to create a custom course
            </p>
            
            <form onSubmit={handleSearchSubmit}>
              <div 
                ref={dropZoneRef}
                className={`relative group transition-all duration-300 ${
                  isDragging ? 'scale-[1.02]' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-xl transition-opacity duration-500 ${
                  isDragging ? 'opacity-50' : 'opacity-0 group-hover:opacity-30'
                }`} />
                
                <div className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 rounded-2xl shadow-xl transition-all duration-300 ${
                  isDragging 
                    ? 'border-green-500 bg-green-50/50 dark:bg-green-950/30' 
                    : 'border-green-200 dark:border-green-900 hover:border-green-500'
                }`}>
                  {/* Drag overlay */}
                  {isDragging && (
                    <div className="drag-overlay">
                      <div className="bg-white dark:bg-gray-900 rounded-xl px-6 py-4 shadow-2xl">
                        <p className="text-lg font-medium text-green-700 dark:text-green-300">
                          Drop files to attach 📎
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Search input and attachment button */}
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex-1 relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                      </div>
                      <Input
                        type="text"
                        placeholder="Search for any topic or describe what you want to learn..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-14 pl-12 pr-4 text-base bg-transparent border-0 focus:ring-0 w-full"
                      />
                    </div>
                    
                    {/* Attachment button */}
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-4 py-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <span className="flex items-center gap-2">
                          <AttachmentIcon />
                          <PlusIcon />
                        </span>
                      </Button>
                    </div>

                    {/* Submit button */}
                    {(search.trim() || attachments.length > 0) && (
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-6 py-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <span className="flex items-center gap-2">
                          Study
                          <ArrowRightIcon />
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* Attachments list */}
                  {attachments.length > 0 && (
                    <div className="border-t border-green-200 dark:border-green-800 p-4">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-3">
                        Attachments ({attachments.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="group/attachment flex items-center gap-2 bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2 pr-2"
                          >
                            <span className="text-lg">{getFileIcon(file)}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors duration-200 opacity-0 group-hover/attachment:opacity-100"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Drag and drop more files anywhere in this area
                      </p>
                    </div>
                  )}

                  {/* Drag hint (when no attachments) */}
                  {attachments.length === 0 && (
                    <div className="border-t border-green-200 dark:border-green-800 p-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-green-600 dark:text-green-400">Drag & drop</span> files here or click the <span className="inline-block"><AttachmentIcon /></span> button to attach study materials
                      </p>
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

          {/* Trending Section - Scrollable with Circular Buttons */}
          {search === "" && (
            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                  <TrendingIcon />
                </div>
                <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300">Trending Now</h2>
              </div>
              
              <div className="relative trending-container">
                <div className="trending-marquee">
                  {[...TRENDING_TOPICS, ...TRENDING_TOPICS].map((topic, index) => {
                    const isEven = index % 2 === 0
                    const size = isEven ? 'w-24 h-24' : 'w-20 h-20'
                    const yOffset = isEven ? 'mb-0' : 'mb-8'

                    return (
                      <div key={`${topic.name}-${index}`} className="trending-button-wrapper flex-shrink-0 mx-3">
                        <button
                          onClick={() => onSelectTopic(topic.name)}
                          className={`group relative flex-shrink-0 ${size} rounded-full bg-gradient-to-br ${topic.color} p-[2px] hover:scale-110 transition-all duration-300 hover:-translate-y-2 ${yOffset}`}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center p-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:bg-transparent group-hover:text-white transition-all duration-300">
                            <span className="line-clamp-2">{topic.name}</span>
                          </div>
                          <div className="absolute -inset-1 rounded-full bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                        </button>
                      </div>
                    )
                  })}
                </div>
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