"use client"

import { BrowseTopics } from "@/components/browse-topics"
import { useRouter } from "next/navigation"

export default function BrowsePage() {
  const router = useRouter()

  const handleSelectTopic = (topic: string) => {
    // Navigate to study page with selected topic
    router.push(`/practice?topic=${encodeURIComponent(topic)}`)
  }

  const handleResumeCourse = (courseId: string, topic: string) => {
    // Navigate to practice with course ID
    router.push(`/practice?topic=${encodeURIComponent(topic)}&courseId=${courseId}`)
  }

  return (
    <BrowseTopics
      onSelectTopic={handleSelectTopic}
      onResumeCourse={handleResumeCourse}
    />
  )
}
