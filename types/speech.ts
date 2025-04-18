export interface Sentence {
  originalText: string
  detectedLanguage?: string
  translatedText?: string | null
  correctedText?: string
  mistakes?: string[]
  suggestions?: string[]
  apiError?: boolean
  errorType?: "INSUFFICIENT_CREDITS" | "GENERAL_ERROR" | "PARSING_ERROR"
}

export interface SessionStats {
  totalSentences: number
  mistakesDetected: number
  correctionsMade: number
  suggestionsProvided: number
  sessionDuration: number
  apiErrors?: number
}
