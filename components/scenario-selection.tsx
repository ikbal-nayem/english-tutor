"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, Briefcase, Users, Plane, ShoppingBag, Stethoscope, School, Phone, Coffee } from "lucide-react"
import { useRouter } from "next/navigation"
import { scenarioData } from "@/lib/scenario-data"

// Define the scenario icons
const scenarioIcons: Record<string, React.ReactNode> = {
  restaurant: <Utensils className="h-6 w-6 text-blue-400" />,
  interview: <Briefcase className="h-6 w-6 text-purple-400" />,
  smalltalk: <Users className="h-6 w-6 text-pink-400" />,
  travel: <Plane className="h-6 w-6 text-green-400" />,
  shopping: <ShoppingBag className="h-6 w-6 text-yellow-400" />,
  healthcare: <Stethoscope className="h-6 w-6 text-red-400" />,
  academic: <School className="h-6 w-6 text-indigo-400" />,
  phonecall: <Phone className="h-6 w-6 text-cyan-400" />,
  coffeechat: <Coffee className="h-6 w-6 text-amber-400" />,
}

export default function ScenarioSelection() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const router = useRouter()

  // Convert scenarioData object to array for easier filtering
  const scenariosArray = Object.entries(scenarioData).map(([id, data]) => ({
    id,
    ...data,
    difficulty: getDifficultyFromId(id), // Function to determine difficulty based on ID
  }))

  const handleStartScenario = () => {
    if (selectedScenario) {
      router.push(`/scenarios/${selectedScenario}`)
    }
  }

  const filteredScenarios =
    filter === "all"
      ? scenariosArray
      : scenariosArray.filter((s) => s.difficulty.toLowerCase() === filter.toLowerCase())

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2 text-white dark:text-white light:text-gray-900">
          Real-World Conversation Practice
        </h1>
        <p className="text-gray-300 dark:text-gray-300 light:text-gray-600">
          Select a scenario to practice your English in realistic conversations
        </p>
      </div>

      <div className="flex flex-wrap justify-center mb-6 gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "text-white dark:text-white light:text-gray-900 border-white/20 dark:border-gray-700 light:border-gray-300"
          }
        >
          All Scenarios
        </Button>
        <Button
          variant={filter === "beginner" ? "default" : "outline"}
          onClick={() => setFilter("beginner")}
          className={
            filter === "beginner"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "text-white dark:text-white light:text-gray-900 border-white/20 dark:border-gray-700 light:border-gray-300"
          }
        >
          Beginner
        </Button>
        <Button
          variant={filter === "intermediate" ? "default" : "outline"}
          onClick={() => setFilter("intermediate")}
          className={
            filter === "intermediate"
              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
              : "text-white dark:text-white light:text-gray-900 border-white/20 dark:border-gray-700 light:border-gray-300"
          }
        >
          Intermediate
        </Button>
        <Button
          variant={filter === "advanced" ? "default" : "outline"}
          onClick={() => setFilter("advanced")}
          className={
            filter === "advanced"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "text-white dark:text-white light:text-gray-900 border-white/20 dark:border-gray-700 light:border-gray-300"
          }
        >
          Advanced
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {filteredScenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={`cursor-pointer transition-all ${
              selectedScenario === scenario.id
                ? "bg-white/20 dark:bg-gray-700/50 light:bg-blue-50 border-blue-400 shadow-lg scale-105"
                : "bg-white/5 dark:bg-gray-800/30 light:bg-white hover:bg-white/10 dark:hover:bg-gray-700/30 light:hover:bg-gray-50 border-transparent"
            }`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-white/10 dark:bg-gray-700 light:bg-gray-100 rounded-full p-2 mr-2">
                    {scenarioIcons[scenario.id] || <Users className="h-6 w-6 text-blue-400" />}
                  </div>
                  <span className="text-2xl">{getEmojiFromTitle(scenario.title)}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    scenario.difficulty === "Beginner"
                      ? "bg-green-500/20 text-green-300 dark:bg-green-900/30 dark:text-green-400 light:bg-green-100 light:text-green-700"
                      : scenario.difficulty === "Intermediate"
                        ? "bg-yellow-500/20 text-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 light:bg-yellow-100 light:text-yellow-700"
                        : "bg-red-500/20 text-red-300 dark:bg-red-900/30 dark:text-red-400 light:bg-red-100 light:text-red-700"
                  }`}
                >
                  {scenario.difficulty}
                </span>
              </div>
              <h3 className="font-bold mb-1 text-white dark:text-gray-100 light:text-gray-900">
                {getTitleWithoutEmoji(scenario.title)}
              </h3>
              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600">
                {scenario.userRole} talking to {scenario.agentName}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 text-white"
        disabled={!selectedScenario}
        onClick={handleStartScenario}
      >
        Start Scenario
      </Button>
    </div>
  )
}

// Helper function to extract emoji from title
function getEmojiFromTitle(title: string): string {
  const emojiMatch = title.match(/[\p{Emoji}]/u)
  return emojiMatch ? emojiMatch[0] : "💬"
}

// Helper function to get title without emoji
function getTitleWithoutEmoji(title: string): string {
  return title.replace(/[\p{Emoji}]/u, "").trim()
}

// Helper function to determine difficulty based on scenario ID
function getDifficultyFromId(id: string): string {
  const difficultyMap: Record<string, string> = {
    restaurant: "Beginner",
    smalltalk: "Beginner",
    shopping: "Beginner",
    coffeechat: "Beginner",
    travel: "Intermediate",
    phonecall: "Intermediate",
    healthcare: "Advanced",
    interview: "Advanced",
    academic: "Advanced",
  }

  return difficultyMap[id] || "Intermediate"
}
