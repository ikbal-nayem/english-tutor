"use client"

import { useState } from "react"
import type { Sentence } from "@/types/speech"
import { processLanguage } from "@/lib/openrouter-api"

interface LanguageProcessingHook {
  processText: (text: string) => Promise<Sentence>
  isProcessing: boolean
}

export function useLanguageProcessing(): LanguageProcessingHook {
  const [isProcessing, setIsProcessing] = useState(false)

  const processText = async (text: string): Promise<Sentence> => {
    console.log("Processing text:", text)
    setIsProcessing(true)

    try {
      const result = await processLanguage(text)
      console.log("Processed result:", result)
      return result
    } catch (error) {
      console.error("Error processing text:", error)
      // Return a basic sentence object with the original text
      return {
        originalText: text,
        correctedText: text,
        mistakes: ["Error processing text. Please try again."],
        suggestions: [],
        apiError: true,
        errorType: "GENERAL_ERROR",
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    processText,
    isProcessing,
  }
}
