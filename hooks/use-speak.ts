import { useState, useRef } from "react"

export function useSpeak() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const sourceRef = useRef<any>(null)
  const contextRef = useRef<any>(null)

  const stop = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch (e) {
        // Already stopped, ignore
      }
      sourceRef.current = null
    }
    setIsPlaying(false)
  }

  const speak = async (text: string) => {
    if (!text || !text.trim()) return

    // Stop currently playing audio
    stop()

    setIsLoading(true)
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Speech API error: ${response.status} - ${error}`)
      }

      const audioBuffer = await response.arrayBuffer()
      const audioContext = contextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)()
      contextRef.current = audioContext

      const audioData = await audioContext.decodeAudioData(audioBuffer)
      const source = audioContext.createBufferSource()
      sourceRef.current = source
      source.buffer = audioData
      source.connect(audioContext.destination)
      source.start(0)
      setIsPlaying(true)

      // Clear ref when finished
      source.onended = () => {
        sourceRef.current = null
        setIsPlaying(false)
      }
    } catch (error) {
      console.error("Speech error:", error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  return { speak, stop, isLoading, isPlaying }
}
