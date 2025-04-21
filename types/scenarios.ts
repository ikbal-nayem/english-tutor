export interface FollowUpQuestion {
  keywords?: string[]
  response: string
  category: string
}

export interface ScenarioData {
  title: string
  agentName: string
  userRole: string
  initialQuestion: string
  followUpQuestions: Record<string, FollowUpQuestion[]>
}

export interface Message {
  role: "agent" | "user"
  content: string
  category?: string
  feedback?: {
    correctedText?: string
    mistakes?: string[]
    suggestions?: string[]
  }
  // vocabularyAnalysis?: {
  //   commonWords: {
  //     word: string
  //     index: number
  //     alternatives: string[]
  //   }[]
  //   advancedWords: {
  //     word: string
  //     index: number
  //   }[]
  // }
}
