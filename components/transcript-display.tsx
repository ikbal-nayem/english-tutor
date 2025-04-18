"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, MessageSquare, Check, X, Lightbulb } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Sentence } from "@/types/speech"

interface TranscriptDisplayProps {
  sentences: Sentence[]
}

export default function TranscriptDisplay({ sentences }: TranscriptDisplayProps) {
  const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"mistakes" | "suggestions">("mistakes")

  // Check if we have any API errors
  const hasCreditErrors = sentences.some((s) => s.errorType === "INSUFFICIENT_CREDITS")
  const hasParsingErrors = sentences.some((s) => s.errorType === "PARSING_ERROR")

  if (sentences.length === 0) {
    return null
  }

  // Create a reversed copy of the sentences array for display
  const reversedSentences = [...sentences].reverse()

  const openSentenceDetails = (sentence: Sentence) => {
    setSelectedSentence(sentence)
    setIsModalOpen(true)

    // Set the active tab based on whether there are mistakes or suggestions
    if (sentence.mistakes && sentence.mistakes.length > 0) {
      setActiveTab("mistakes")
    } else if (sentence.suggestions && sentence.suggestions.length > 0) {
      setActiveTab("suggestions")
    }
  }

  return (
    <>
      <div className="space-y-4">
        {hasCreditErrors && (
          <Alert
            variant="destructive"
            className="border border-red-200 text-sm dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300 light:bg-red-50 light:border-red-200 light:text-red-700"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">OpenRouter API Credit Error</AlertTitle>
            <AlertDescription className="text-xs">
              Insufficient credits. Add more at{" "}
              <a
                href="https://openrouter.ai/settings/credits"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                openrouter.ai
              </a>
            </AlertDescription>
          </Alert>
        )}

        {hasParsingErrors && (
          <Alert
            variant="destructive"
            className="border border-amber-200 bg-amber-50 text-amber-800 text-sm dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-300 light:bg-amber-50 light:border-amber-200 light:text-amber-700"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">Response Format Error</AlertTitle>
            <AlertDescription className="text-xs">
              There was an issue parsing the AI response. This is usually temporary. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {reversedSentences.map((sentence, index) => (
            <Card
              key={index}
              className="border dark:border-gray-700 light:border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openSentenceDetails(sentence)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full dark:bg-indigo-900/50 light:bg-indigo-100 flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400 light:text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Original text */}
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 light:text-gray-800">
                      {sentence.originalText}
                    </p>

                    {/* Corrected text shown directly below original */}
                    {!sentence.apiError &&
                      sentence.correctedText &&
                      sentence.correctedText !== sentence.originalText && (
                        <p className="text-sm text-green-600 mt-2 pl-2 border-l-2 border-green-300 dark:text-green-400 light:text-green-600">
                          <Check className="h-3 w-3 inline mr-1" />
                          {sentence.correctedText}
                        </p>
                      )}

                    {/* Show a brief summary of corrections/suggestions */}
                    {!sentence.apiError && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {sentence.mistakes && sentence.mistakes.length > 0 && (
                          <span className="inline-flex items-center text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 light:bg-red-100 light:text-red-700 light:hover:bg-red-200">
                            <X className="h-3 w-3 mr-1" /> {sentence.mistakes.length} mistake(s)
                          </span>
                        )}

                        {sentence.suggestions && sentence.suggestions.length > 0 && (
                          <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded hover:bg-amber-200 transition-colors dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50 light:bg-amber-100 light:text-amber-700 light:hover:bg-amber-200">
                            <Lightbulb className="h-3 w-3 mr-1" /> {sentence.suggestions.length} suggestion(s)
                          </span>
                        )}
                      </div>
                    )}

                    {sentence.apiError && (
                      <div className="mt-2">
                        <span className="inline-flex items-center text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded dark:bg-red-900/30 dark:text-red-300 light:bg-red-100 light:text-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Processing Error
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Details Modal - Updated to match the FeedbackModal design */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-800 dark:bg-gray-800 light:bg-white border-slate-700 dark:border-gray-700 light:border-gray-200 text-white dark:text-gray-100 light:text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white dark:text-white light:text-gray-900">
              Sentence Details
            </DialogTitle>
          </DialogHeader>

          {selectedSentence && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700 light:bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 light:text-gray-500">You said:</h3>
                <p className="text-base font-medium mt-1 text-gray-900 dark:text-gray-200 light:text-gray-900">
                  {selectedSentence.originalText}
                </p>
              </div>

              {selectedSentence.detectedLanguage &&
                selectedSentence.detectedLanguage !== "en" &&
                selectedSentence.translatedText && (
                  <div className="bg-blue-50 p-3 rounded-lg dark:bg-blue-900/30 light:bg-blue-50">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 light:text-gray-500">
                      Translated from {getLanguageName(selectedSentence.detectedLanguage)}:
                    </h3>
                    <p className="text-base font-medium mt-1 text-blue-700 dark:text-blue-400 light:text-blue-700">
                      {selectedSentence.translatedText}
                    </p>
                  </div>
                )}

              {selectedSentence.correctedText &&
                selectedSentence.correctedText !== selectedSentence.originalText &&
                !selectedSentence.apiError && (
                  <div className="bg-green-50 p-3 rounded-lg dark:bg-green-900/30 light:bg-green-50">
                    <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 light:text-gray-500">
                      <Check className="h-4 w-4 mr-1 text-green-600 dark:text-green-400 light:text-green-600" />{" "}
                      Corrected:
                    </h3>
                    <p className="text-base font-medium mt-1 text-green-700 dark:text-green-400 light:text-green-700">
                      {selectedSentence.correctedText}
                    </p>
                  </div>
                )}

              {!selectedSentence.apiError &&
              (selectedSentence.mistakes?.length || selectedSentence.suggestions?.length) ? (
                <Tabs defaultValue={activeTab} className="mt-4">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 dark:bg-gray-700/50 light:bg-gray-100">
                    <TabsTrigger
                      value="mistakes"
                      className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300 dark:data-[state=active]:text-red-300 light:data-[state=active]:text-red-700"
                      onClick={() => setActiveTab("mistakes")}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mistakes
                    </TabsTrigger>
                    <TabsTrigger
                      value="suggestions"
                      className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 dark:data-[state=active]:text-amber-300 light:data-[state=active]:text-amber-700"
                      onClick={() => setActiveTab("suggestions")}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Suggestions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="mistakes" className="mt-4 space-y-4">
                    {selectedSentence.mistakes && selectedSentence.mistakes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedSentence.mistakes.map((mistake, i) => (
                          <Card
                            key={i}
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
                    {selectedSentence.suggestions && selectedSentence.suggestions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedSentence.suggestions.map((suggestion, i) => (
                          <Card
                            key={i}
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
              ) : selectedSentence.apiError ? (
                <div className="bg-red-50 p-3 rounded-lg dark:bg-red-900/30 light:bg-red-50">
                  <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 light:text-gray-500">
                    <X className="h-4 w-4 mr-1 text-red-600 dark:text-red-400 light:text-red-600" /> Error:
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {selectedSentence.mistakes?.map((mistake, i) => (
                      <li
                        key={i}
                        className="text-sm text-red-600 dark:text-red-400 light:text-red-600 flex items-start"
                      >
                        <span className="inline-block w-4 h-4 bg-red-200 rounded-full text-red-600 flex items-center justify-center text-xs mr-2 mt-0.5 dark:bg-red-800 dark:text-red-300 light:bg-red-200 light:text-red-600">
                          {i + 1}
                        </span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function to get full language name from ISO code
function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
    hi: "Hindi",
    bn: "Bengali",
    // Add more languages as needed
  }

  return languages[code] || code
}
