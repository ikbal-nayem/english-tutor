"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Lightbulb, Check } from "lucide-react"
import type { Message } from "@/types/scenarios"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: Message["feedback"] | null
  type: "mistakes" | "suggestions"
}

export function FeedbackModal({ isOpen, onClose, feedback, type }: FeedbackModalProps) {
  if (!feedback) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-800 dark:bg-gray-800 light:bg-white border-slate-700 dark:border-gray-700 light:border-gray-200 text-white dark:text-gray-100 light:text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white dark:text-white light:text-gray-900">
            Language Feedback
          </DialogTitle>
          <DialogDescription className="text-gray-400 dark:text-gray-400 light:text-gray-500">
            Review feedback to improve your English skills
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={type} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 dark:bg-gray-700/50 light:bg-gray-100">
            <TabsTrigger
              value="mistakes"
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300 dark:data-[state=active]:text-red-300 light:data-[state=active]:text-red-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Mistakes
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 dark:data-[state=active]:text-amber-300 light:data-[state=active]:text-amber-700"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mistakes" className="mt-4 space-y-4">
            {feedback.correctedText && (
              <Card className="bg-slate-700/30 dark:bg-gray-700/30 light:bg-gray-50 border-slate-600 dark:border-gray-600 light:border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-green-400 dark:text-green-400 light:text-green-700 mb-2 flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Corrected Text:
                  </h3>
                  <p className="text-white dark:text-gray-100 light:text-gray-900">{feedback.correctedText}</p>
                </CardContent>
              </Card>
            )}

            {feedback.mistakes && feedback.mistakes.length > 0 ? (
              <div className="space-y-3">
                {feedback.mistakes.map((mistake, index) => (
                  <Card
                    key={index}
                    className="bg-slate-700/30 dark:bg-gray-700/30 light:bg-gray-50 border-slate-600 dark:border-gray-600 light:border-gray-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-400 light:text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-white dark:text-gray-100 light:text-gray-900">{mistake}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 dark:text-gray-400 light:text-gray-500">
                <p>No mistakes found. Great job!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4 space-y-4">
            {feedback.suggestions && feedback.suggestions.length > 0 ? (
              <div className="space-y-3">
                {feedback.suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="bg-slate-700/30 dark:bg-gray-700/30 light:bg-gray-50 border-slate-600 dark:border-gray-600 light:border-gray-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-amber-400 dark:text-amber-400 light:text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-white dark:text-gray-100 light:text-gray-900">{suggestion}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 dark:text-gray-400 light:text-gray-500">
                <p>No suggestions available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
