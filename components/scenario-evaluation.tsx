"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Lightbulb, Star, Award, BookOpen } from "lucide-react"
import Link from "next/link"

interface Feedback {
  correctedText?: string
  mistakes?: string[]
  suggestions?: string[]
}

interface Message {
  role: "agent" | "user"
  content: string
  feedback?: Feedback
  vocabularyAnalysis?: {
    commonWords: {
      word: string
      index: number
      alternatives: string[]
    }[]
    advancedWords: {
      word: string
      index: number
    }[]
  }
}

interface ScenarioEvaluationProps {
  messages: Message[]
  scenarioTitle: string
  onTryAgain: () => void
}

export default function ScenarioEvaluation({ messages, scenarioTitle, onTryAgain }: ScenarioEvaluationProps) {
  // Filter out only user messages with feedback
  const userMessages = messages.filter((m) => m.role === "user" && m.feedback)

  // Calculate statistics
  const totalMessages = userMessages.length
  const messagesWithMistakes = userMessages.filter((m) => m.feedback?.mistakes && m.feedback.mistakes.length > 0).length
  const totalMistakes = userMessages.reduce((sum, m) => sum + (m.feedback?.mistakes?.length || 0), 0)
  const totalSuggestions = userMessages.reduce((sum, m) => sum + (m.feedback?.suggestions?.length || 0), 0)

  // Calculate vocabulary stats
  const totalCommonWords = userMessages.reduce((sum, m) => sum + (m.vocabularyAnalysis?.commonWords.length || 0), 0)
  const totalAdvancedWords = userMessages.reduce((sum, m) => sum + (m.vocabularyAnalysis?.advancedWords.length || 0), 0)

  // Calculate score (basic algorithm)
  const accuracyScore = Math.max(0, 100 - (messagesWithMistakes / totalMessages) * 100)
  const vocabularyScore = Math.min(100, totalAdvancedWords * 10 - totalCommonWords * 5 + 70)
  const overallScore = Math.round(accuracyScore * 0.7 + vocabularyScore * 0.3)

  // Get all unique mistakes for summary
  const allMistakes = new Set<string>()
  userMessages.forEach((m) => {
    m.feedback?.mistakes?.forEach((mistake) => {
      allMistakes.add(mistake)
    })
  })

  // Get common word suggestions
  const wordSuggestions = new Map<string, string[]>()
  userMessages.forEach((m) => {
    m.vocabularyAnalysis?.commonWords.forEach((word) => {
      wordSuggestions.set(word.word, word.alternatives)
    })
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2 text-white dark:text-white light:text-gray-900">
          Conversation Evaluation
        </h1>
        <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">{scenarioTitle}</p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 light:from-indigo-400 light:to-purple-500 shadow-lg animate-glowPulse">
          <div className="absolute inset-1 rounded-full bg-slate-800 dark:bg-slate-900 light:bg-white flex items-center justify-center">
            <span className="text-5xl font-bold text-white dark:text-white light:text-gray-900">{overallScore}</span>
          </div>
          <div className="absolute -top-2 -right-2">
            <Award className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-green-400" />}
          label="Accuracy"
          value={`${Math.round(accuracyScore)}%`}
          color="green"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-blue-400" />}
          label="Vocabulary"
          value={`${Math.round(vocabularyScore)}%`}
          color="blue"
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-red-400" />}
          label="Mistakes"
          value={totalMistakes.toString()}
          color="red"
        />
        <StatCard
          icon={<Lightbulb className="h-5 w-5 text-yellow-400" />}
          label="Suggestions"
          value={totalSuggestions.toString()}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Common mistakes */}
        <Card
          className="bg-white/5 border-red-500/20 dark:bg-gray-800/30 light:bg-white animate-slideInFromLeft"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white dark:text-white light:text-gray-900">
              <XCircle className="h-4 w-4 mr-2 text-red-400" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allMistakes.size > 0 ? (
              <ul className="space-y-1 text-sm">
                {Array.from(allMistakes)
                  .slice(0, 5)
                  .map((mistake, i) => (
                    <li key={i} className="text-red-200 dark:text-red-300 light:text-red-700">
                      • {mistake}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                No significant mistakes detected. Great job!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Vocabulary improvement */}
        <Card
          className="bg-white/5 border-blue-500/20 dark:bg-gray-800/30 light:bg-white animate-slideInFromRight"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white dark:text-white light:text-gray-900">
              <BookOpen className="h-4 w-4 mr-2 text-blue-400" />
              Vocabulary Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wordSuggestions.size > 0 ? (
              <ul className="space-y-1 text-sm">
                {Array.from(wordSuggestions.entries())
                  .slice(0, 5)
                  .map(([word, alternatives], i) => (
                    <li key={i} className="text-blue-200 dark:text-blue-300 light:text-blue-700">
                      Instead of "
                      <span className="text-yellow-300 dark:text-yellow-300 light:text-yellow-600">{word}</span>", try:{" "}
                      {alternatives.slice(0, 3).join(", ")}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                Your vocabulary usage is excellent!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced vocabulary used */}
      <Card
        className="bg-white/5 border-purple-500/20 dark:bg-gray-800/30 light:bg-white animate-slideInFromLeft"
        style={{ animationDelay: "0.3s" }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center text-white dark:text-white light:text-gray-900">
            <Star className="h-4 w-4 mr-2 text-purple-400" />
            Advanced Vocabulary Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalAdvancedWords > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600">
                You used{" "}
                <span className="text-purple-300 dark:text-purple-300 light:text-purple-700 font-bold">
                  {totalAdvancedWords}
                </span>{" "}
                advanced vocabulary words in your conversation!
              </p>
              <div className="flex flex-wrap gap-2">
                {userMessages
                  .flatMap((m) => m.vocabularyAnalysis?.advancedWords.map((word) => word.word) || [])
                  .filter((word, index, self) => self.indexOf(word) === index)
                  .slice(0, 8)
                  .map((word, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 dark:bg-purple-900/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-700 rounded-full text-xs"
                    >
                      {word}
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
              Try using more advanced vocabulary in your next conversation!
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={onTryAgain}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Try Again
        </Button>
        <Link href="/scenarios">
          <Button
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 dark:border-gray-600 dark:text-white light:border-gray-300 light:text-gray-900 light:hover:bg-gray-100"
          >
            Choose Another Scenario
          </Button>
        </Link>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color: "green" | "red" | "blue" | "yellow"
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    green:
      "bg-green-500/20 border-green-500/30 dark:bg-green-900/20 dark:border-green-900/30 light:bg-green-50 light:border-green-200",
    red: "bg-red-500/20 border-red-500/30 dark:bg-red-900/20 dark:border-red-900/30 light:bg-red-50 light:border-red-200",
    blue: "bg-blue-500/20 border-blue-500/30 dark:bg-blue-900/20 dark:border-blue-900/30 light:bg-blue-50 light:border-blue-200",
    yellow:
      "bg-yellow-500/20 border-yellow-500/30 dark:bg-yellow-900/20 dark:border-yellow-900/30 light:bg-yellow-50 light:border-yellow-200",
  }

  return (
    <div
      className={`rounded-lg p-3 flex items-center border ${colorClasses[color]} animate-fadeIn`}
      style={{
        animationDelay: `${color === "green" ? "0.1s" : color === "blue" ? "0.2s" : color === "red" ? "0.3s" : "0.4s"}`,
      }}
    >
      <div className="mr-3">{icon}</div>
      <div>
        <div className="text-lg font-bold text-white dark:text-white light:text-gray-900">{value}</div>
        <div className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">{label}</div>
      </div>
    </div>
  )
}
