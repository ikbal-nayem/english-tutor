"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SpeechRecognitionHook {
  transcript: string
  interimTranscript: string
  resetTranscript: () => void
  startListening: () => void
  stopListening: () => void
  isListening: boolean
  browserSupportsSpeechRecognition: boolean
  error: string | null
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use refs to maintain instance across renders
  const recognitionRef = useRef<any>(null)
  const isListeningRef = useRef(false)

  // Check browser support
  const browserSupportsSpeechRecognition =
    typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    console.log("Initializing speech recognition...")
    if (typeof window === "undefined") {
      console.log("Window is undefined - not in browser environment")
      return
    }

    try {
      console.log("Checking for SpeechRecognition API...")
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        const errorMsg = "Your browser doesn't support speech recognition"
        console.error(errorMsg)
        setError(errorMsg)
        return
      }
      console.log("SpeechRecognition API found:", SpeechRecognition)

      // Create a new recognition instance
      const recognition = new SpeechRecognition()
      console.log("SpeechRecognition instance created:", recognition)

      // Configure recognition
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"
      console.log("SpeechRecognition configured:", {
        continuous: recognition.continuous,
        interimResults: recognition.interimResults,
        lang: recognition.lang
      })

      // Set up event handlers
      recognition.onstart = () => {
        console.log("Speech recognition started")
        setError(null)
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        console.log("SpeechRecognition onresult event:", event)
        let finalTranscript = ""
        let currentInterimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          console.log("Speech result:", {
            transcript,
            isFinal: result.isFinal,
            confidence: result[0].confidence
          })

          if (result.isFinal) {
            finalTranscript += transcript
            console.log("Final transcript:", finalTranscript)
          } else {
            currentInterimTranscript += transcript
            console.log("Interim transcript:", currentInterimTranscript)
          }
        }

        if (finalTranscript) {
          console.log("Setting final transcript:", finalTranscript)
          setTranscript(finalTranscript)
          setInterimTranscript("")
          console.log("Transcript state updated")
        } else if (currentInterimTranscript) {
          console.log("Setting interim transcript:", currentInterimTranscript)
          setInterimTranscript(currentInterimTranscript)
          console.log("InterimTranscript state updated")
        }
      }

      recognition.onerror = (event: any) => {
        console.log("Speech recognition error:", event.error)

        // Handle "no-speech" error differently - don't show it to the user as it's common
        if (event.error === "no-speech") {
          console.log("No speech detected, continuing to listen...")
          // Don't set error state for no-speech as it's not a critical error
          return
        }

        // For other errors, set the error state
        setError(`Recognition error: ${event.error}`)

        // Don't stop on these errors
        if (event.error === "audio-capture") {
          return
        }

        // For other errors, stop and restart if needed
        try {
          recognition.stop()
          setIsListening(false)
        } catch (e) {
          console.error("Error stopping recognition after error:", e)
        }

        // Restart if we're still supposed to be listening
        if (isListeningRef.current) {
          setTimeout(() => {
            try {
              recognition.start()
              setIsListening(true)
            } catch (e) {
              console.error("Error restarting recognition after error:", e)
              setError(`Failed to restart recognition: ${e}`)
            }
          }, 1000)
        }
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)

        // Restart if we're still supposed to be listening
        if (isListeningRef.current) {
          console.log("Restarting speech recognition...")
          setTimeout(() => {
            try {
              recognition.start()
              setIsListening(true)
            } catch (e) {
              console.error("Error restarting recognition:", e)
              setError(`Failed to restart recognition: ${e}`)
              setIsListening(false)
              isListeningRef.current = false
            }
          }, 500)
        }
      }

      recognitionRef.current = recognition
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
      setError(`Failed to initialize speech recognition: ${error}`)
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    initRecognition()

    return () => {
      // Clean up
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping recognition during cleanup:", e)
        }
      }
    }
  }, [initRecognition])

  const startListening = useCallback(() => {
    console.log("Starting speech recognition...")

    if (!recognitionRef.current) {
      initRecognition()
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        isListeningRef.current = true
        setError(null)

        // Clear any existing transcript
        setTranscript("")
        setInterimTranscript("")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setError(`Failed to start speech recognition: ${error}`)

        // Try to reinitialize and start again
        setTimeout(() => {
          initRecognition()
          try {
            if (recognitionRef.current) {
              recognitionRef.current.start()
              setIsListening(true)
              isListeningRef.current = true
            }
          } catch (e) {
            console.error("Error on second attempt to start recognition:", e)
            setError(`Failed to start speech recognition after retry: ${e}`)
          }
        }, 500)
      }
    } else {
      setError("Speech recognition not available")
    }
  }, [initRecognition])

  const stopListening = useCallback(() => {
    console.log("Stopping speech recognition...")

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }

    setIsListening(false)
    isListeningRef.current = false
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
  }, [])

  return {
    transcript,
    interimTranscript,
    resetTranscript,
    startListening,
    stopListening,
    isListening,
    browserSupportsSpeechRecognition,
    error,
  }
}

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
