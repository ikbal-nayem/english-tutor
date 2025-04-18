"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug } from "lucide-react"

interface DebugPanelProps {
  speechRecognitionState: {
    isListening: boolean
    transcript: string
    interimTranscript: string
    error: string | null
    browserSupport: boolean
  }
}

export default function DebugPanel({ speechRecognitionState }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 bg-white/80 backdrop-blur-sm h-8 w-8 p-0"
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 left-4 w-80 shadow-lg z-50">
      <CardHeader className="py-2 px-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center">
          <Bug className="h-4 w-4 mr-1" /> Speech Recognition Debug
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
          ×
        </Button>
      </CardHeader>
      <CardContent className="p-3 text-xs space-y-2">
        <div>
          <span className="font-semibold">Browser Support:</span>{" "}
          <span className={speechRecognitionState.browserSupport ? "text-green-600" : "text-red-600"}>
            {speechRecognitionState.browserSupport ? "Yes" : "No"}
          </span>
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
          <span className={speechRecognitionState.isListening ? "text-green-600" : "text-gray-600"}>
            {speechRecognitionState.isListening ? "Listening" : "Not Listening"}
          </span>
        </div>
        <div>
          <span className="font-semibold">Recognition Events:</span>
          <div className="mt-1 space-y-1">
            <div className="text-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
              no-speech: Not shown to user, recognition continues
            </div>
            <div className="text-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-red-400 mr-1"></span>
              audio-capture: Microphone access issues
            </div>
            <div className="text-xs">
              <span className="inline-block w-3 h-3 rounded-full bg-red-400 mr-1"></span>
              network: Network connectivity issues
            </div>
          </div>
        </div>
        {speechRecognitionState.error && (
          <div>
            <span className="font-semibold text-red-600">Error:</span>{" "}
            <span className="text-red-600">{speechRecognitionState.error}</span>
          </div>
        )}
        <div>
          <span className="font-semibold">Final Transcript:</span>
          <div className="mt-1 p-1 bg-gray-100 rounded min-h-[20px] max-h-[60px] overflow-y-auto">
            {speechRecognitionState.transcript || <em className="text-gray-400">None</em>}
          </div>
        </div>
        <div>
          <span className="font-semibold">Interim Transcript:</span>
          <div className="mt-1 p-1 bg-gray-100 rounded min-h-[20px] max-h-[60px] overflow-y-auto">
            {speechRecognitionState.interimTranscript || <em className="text-gray-400">None</em>}
          </div>
        </div>
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs h-7"
            onClick={() => {
              console.log("Speech Recognition Debug Info:", speechRecognitionState)
            }}
          >
            Log Debug Info
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
