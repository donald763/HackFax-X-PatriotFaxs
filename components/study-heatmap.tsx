"use client"
import { useEffect, useRef } from "react"

interface StudyHeatmapProps {
  data?: Array<{ date: string; intensity: number }>
  compact?: boolean
  className?: string
}

export default function StudyHeatmap({ data = [], compact = false, className = "" }: StudyHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size based on compact prop
    const size = compact ? 120 : 240
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Generate last 90 days of data if not provided
    const heatmapData = data.length > 0 ? data : generateMockData()
    
    // Draw heatmap
    const cellSize = size / 15 // 15x15 grid
    const padding = compact ? 1 : 2

    heatmapData.slice(0, 225).forEach((item, index) => {
      const row = Math.floor(index / 15)
      const col = index % 15
      
      const x = col * cellSize + padding / 2
      const y = row * cellSize + padding / 2
      const cellWidth = cellSize - padding
      const cellHeight = cellSize - padding

      // Color based on intensity - Green theme
      let color
      if (item.intensity === 0) {
        color = compact ? '#E5E7EB' : '#F3F4F6' // gray-200 / gray-100
      } else if (item.intensity < 0.3) {
        color = '#D1FAE5' // green-100
      } else if (item.intensity < 0.6) {
        color = '#6EE7B7' // green-300
      } else if (item.intensity < 0.9) {
        color = '#10B981' // green-500
      } else {
        color = '#059669' // green-600
      }

      ctx.fillStyle = color
      ctx.fillRect(x, y, cellWidth, cellHeight)
      
      // Add subtle border in compact mode
      if (compact) {
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 0.5
        ctx.strokeRect(x, y, cellWidth, cellHeight)
      }
    })

    // Add gradient overlay for visual interest in full size
    if (!compact) {
      const gradient = ctx.createLinearGradient(0, 0, size, size)
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.05)')
      gradient.addColorStop(1, 'rgba(5, 150, 105, 0.05)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
    }

  }, [data, compact])

  function generateMockData() {
    const data = []
    const now = new Date()
    
    for (let i = 0; i < 225; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (224 - i))
      
      // Generate realistic study patterns
      let intensity = 0
      const dayOfWeek = date.getDay()
      
      // More study on weekdays, less on weekends
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Random study intensity for weekdays
        intensity = Math.random() > 0.4 ? Math.random() * 0.8 + 0.2 : 0
      } else {
        // Weekend - less likely to study
        intensity = Math.random() > 0.7 ? Math.random() * 0.6 : 0
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        intensity: Math.round(intensity * 10) / 10
      })
    }
    return data
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-inner"
        style={{
          width: compact ? '120px' : '240px',
          height: compact ? '120px' : '240px',
        }}
      />
      
      {/* Optional tooltip or label - you can expand this */}
      {!compact && (
        <div className="absolute bottom-1 right-1 text-[10px] text-gray-400">
          Last 90 days
        </div>
      )}
    </div>
  )
}