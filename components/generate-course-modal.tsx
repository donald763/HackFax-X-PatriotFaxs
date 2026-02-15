// components/generate-course-modal.tsx
"use client"
import { useState, useRef, DragEvent, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface GenerateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (topic: string) => void
}

export default function GenerateCourseModal({ isOpen, onClose, onGenerate }: GenerateCourseModalProps) {
  const [topic, setTopic] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']
      return validTypes.includes(file.type) && file.size <= 10485760 // 10MB
    })

    setFiles(prev => [...prev, ...validFiles])
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    if (topic.trim()) {
      onGenerate(topic.trim())
      setTopic("")
      setFiles([])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return '📄'
    if (file.type.includes('word')) return '📝'
    if (file.type.includes('text')) return '📃'
    return '📎'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50">
        <Card className="bg-white dark:bg-gray-900 border-2 border-green-200 dark:border-green-800 shadow-2xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Generate New Course
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Topic Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Topic <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., Machine Learning, Organic Chemistry, etc."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-12 px-4 text-base border-2 border-green-200 dark:border-green-800 rounded-xl focus:border-green-500 focus:ring-0"
                autoFocus
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Materials (Optional)
              </label>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-300 relative overflow-hidden
                  ${isDragging 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20 scale-105' 
                    : 'border-green-200 dark:border-green-800 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-950/10'
                  }
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
                  className="hidden"
                />
                
                {/* Animated background on drag */}
                {isDragging && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse" />
                )}
                
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className={`
                    p-3 rounded-full transition-all duration-300
                    ${isDragging 
                      ? 'bg-green-500 text-white scale-110' 
                      : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }
                  `}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 16v-6m0 0l-3 3m3-3l3 3M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      or click to browse (PDF, DOC, DOCX, TXT, MD - up to 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Uploaded Files ({files.length})
                  </h3>
                  <button
                    onClick={() => setFiles([])}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xl">{getFileIcon(file)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                        aria-label="Remove file"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Course
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-2 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-xl py-6 text-base transition-all duration-300"
              >
                Cancel
              </Button>
            </div>

            {/* Optional: Show warning if no topic */}
            {!topic.trim() && (
              <p className="text-xs text-red-500 mt-3 text-center">
                * Please enter a course topic to continue
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}