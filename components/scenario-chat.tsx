"use client"

import type React from "react"
import type { Message } from "@/types/scenarios"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Send, ArrowLeft, Volume2, Info, AlertTriangle, User, Lightbulb, Check } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useLanguageProcessing } from "@/hooks/use-language-processing"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import ScenarioEvaluation from "@/components/scenario-evaluation"
import { scenarioData } from "@/lib/scenario-data"
import { analyzeVocabulary } from "@/lib/vocabulary-analyzer"
import { generateChatResponse } from "@/lib/chat-actions"
import { FeedbackModal } from "@/components/feedback-modal"

export default function ScenarioChat({ scenarioId }: { scenarioId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [textInput, setTextInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wantsToQuit, setWantsToQuit] = useState(false)

  // New state for feedback modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackModalType, setFeedbackModalType] = useState<"mistakes" | "suggestions">("mistakes")
  const [selectedFeedback, setSelectedFeedback] = useState<Message["feedback"] | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Get the scenario data
  const scenario = scenarioData[scenarioId]

  // If scenario doesn't exist, show error and redirect
  useEffect(() => {
    if (!scenario && scenarioId) {
      console.error(`Scenario with ID "${scenarioId}" not found`)
      router.push("/scenarios")
    }
  }, [scenario, scenarioId, router])

  const {
    transcript,
    interimTranscript,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
    error: speechRecognitionError,
  } = useSpeechRecognition()

  const { processText } = useLanguageProcessing()

  // Initialize with first question
  useEffect(() => {
    if (!scenario) {
      return
    }

    // Only set the initial message if the messages array is empty
    if (messages.length === 0) {
      setMessages([
        {
          role: "agent",
          content: scenario.initialQuestion,
        },
      ])
    }

    // Set up navigation interception
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (messages.length > 1 && !isComplete && !showEvaluation) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [scenario, showEvaluation, isComplete, messages.length]) // Only depend on messages.length, not the entire messages array

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px` // Max 10 lines (approx 200px)
    }
  }, [textInput])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle transcript from speech recognition - append to existing text instead of replacing
  useEffect(() => {
    if (transcript && isRecording) {
      // Append the new transcript to the existing text input
      setTextInput((prev) => {
        // If the previous input is empty, just use the transcript
        if (!prev.trim()) return transcript

        // Otherwise, check if we need to add a space between the previous text and new transcript
        const needsSpace = !prev.endsWith(" ") && !transcript.startsWith(" ")
        return prev + (needsSpace ? " " : "") + transcript
      })

      // Reset the transcript to prepare for the next chunk
      resetTranscript()
    }
  }, [transcript, isRecording, resetTranscript])

  // Handle navigation
  const handleNavigation = () => {
    if (messages.length > 1 && !isComplete && !showEvaluation) {
      setWantsToQuit(true)
      setShowConfirmDialog(true)
    } else {
      router.push("/scenarios")
    }
  }

  const confirmNavigation = () => {
    setShowConfirmDialog(false)

    if (wantsToQuit && messages.length > 1) {
      // Show evaluation before leaving
      setIsComplete(true)
      setShowEvaluation(true)
    } else {
      router.push("/scenarios")
    }
  }

  const handleStartRecording = () => {
    resetTranscript()
    setIsRecording(true)
    startListening()
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    stopListening()
  }

  // Open feedback modal
  const openFeedbackModal = (feedback: Message["feedback"], type: "mistakes" | "suggestions") => {
    setSelectedFeedback(feedback)
    setFeedbackModalType(type)
    setShowFeedbackModal(true)
  }

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isProcessing || !scenario) return

    // Stop recording if active
    if (isRecording) {
      stopListening()
      setIsRecording(false)
    }

    setIsProcessing(true)
    setError(null)

    // Analyze vocabulary
    const vocabularyAnalysis = analyzeVocabulary(text)

    // Add user message immediately
    const userMessage: Message = {
      role: "user",
      content: text,
      vocabularyAnalysis,
    }

    // Update messages state with user message
    setMessages((prevMessages) => [...prevMessages, userMessage])

    // Clear input field immediately
    setTextInput("")

    try {
      // Process the text with AI for language feedback
      const result = await processText(text)

      // Update the user message with feedback
      setMessages((prevMessages) => {
        const updated = [...prevMessages]
        // Find the last user message
        const lastUserMessageIndex = updated.findIndex((msg, idx) => msg.role === "user" && idx === updated.length - 1)

        if (lastUserMessageIndex !== -1) {
          updated[lastUserMessageIndex] = {
            ...updated[lastUserMessageIndex],
            feedback: {
              correctedText: result.correctedText,
              mistakes: result.mistakes,
              suggestions: result.suggestions,
            },
          }
        }

        return updated
      })

      // Use OpenRouter API to generate a response with full conversation history
      const response = await generateChatResponse(text, scenario.title, scenario.userRole, scenario.agentName, messages)
      console.log("API response:", response)

      // Add the agent's response
      const agentMessage: Message = {
        role: "agent",
        content: response.success
          ? response.response
          : "I'm sorry, I didn't quite understand. Could you rephrase that?",
      }

      setMessages((prevMessages) => [...prevMessages, agentMessage])

      // Check if we should end the conversation (after 10 exchanges)
      const userMessageCount = messages.filter((m) => m.role === "user").length

      if (userMessageCount >= 9) {
        // Changed from 8 to 9 to make it end after 10 exchanges (including the one just added)
        // End the conversation after 10 exchanges
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "agent",
              content: "I think we've covered quite a bit in our conversation. Let's review how you did!",
            },
          ])
          setIsComplete(true)
          setTimeout(() => setShowEvaluation(true), 1500)
        }, 1500)
      }
    } catch (error) {
      console.error("Error processing text:", error)
      setError("Failed to process your message. Please try again.")

      // Add a fallback response if the chat generation fails
      const fallbackMessage: Message = {
        role: "agent",
        content:
          "I'm having trouble responding right now. Let's continue our conversation. What would you like to talk about?",
      }

      setMessages((prevMessages) => [...prevMessages, fallbackMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim()) {
      handleSubmit(textInput)
    }
  }

  const handleTryAgain = () => {
    if (!scenario) return

    setMessages([
      {
        role: "agent",
        content: scenario.initialQuestion,
      },
    ])
    setIsComplete(false)
    setShowEvaluation(false)
    setWantsToQuit(false)
  }

  // Function to handle text-to-speech with custom voice
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)

      // Get available voices
      const voices = window.speechSynthesis.getVoices()

      // Try to find a female voice
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("female") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Victoria") ||
          voice.name.includes("Tessa"),
      )

      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      // Set other properties
      utterance.rate = 1.0
      utterance.pitch = 1.1

      window.speechSynthesis.speak(utterance)
    }
  }

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 text-white dark:text-white light:text-gray-900">Scenario Not Found</h2>
          <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 mb-4">
            The scenario you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button onClick={() => router.push("/scenarios")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Return to Scenarios
          </Button>
        </div>
      </div>
    )
  }

  if (showEvaluation) {
    return <ScenarioEvaluation messages={messages} scenarioTitle={scenario.title} onTryAgain={handleTryAgain} />
  }

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:text-white dark:text-gray-300 dark:hover:text-white light:text-gray-700 light:hover:text-gray-900"
          onClick={handleNavigation}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Scenarios
        </Button>
        <h1 className="text-xl font-bold ml-2 text-white dark:text-white light:text-gray-900">{scenario.title}</h1>
      </div>

      {/* Fancy Redesigned Chat UI */}
      <Card className="flex-grow flex flex-col overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-gray-800 dark:to-gray-900 light:from-white light:to-gray-50 border-slate-700 dark:border-gray-700 light:border-gray-200 shadow-xl rounded-xl">
        {/* Chat Header */}
        <CardHeader className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 dark:from-gray-700/50 dark:to-gray-800/50 light:from-indigo-50 light:to-purple-50 py-3 border-b border-slate-700 dark:border-gray-700 light:border-gray-200">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 light:from-indigo-300 light:to-purple-400 flex items-center justify-center mr-3 text-white shadow-lg">
                {scenario.agentName.charAt(0)}
              </div>
              <div>
                <span className="text-white dark:text-white light:text-gray-900 font-medium">{scenario.agentName}</span>
                <div className="text-xs text-white/70 dark:text-gray-400 light:text-gray-500 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                  Online
                </div>
              </div>
            </span>
            <div className="flex items-center">
              <span className="text-sm font-normal text-white/70 dark:text-gray-300 light:text-gray-600 mr-2 px-2 py-1 rounded-full bg-white/10 dark:bg-gray-700 light:bg-gray-100">
                Your role: {scenario.userRole}
              </span>
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 dark:text-gray-300 light:text-gray-600 rounded-full bg-white/10 dark:bg-gray-700 light:bg-gray-100"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-800 dark:bg-gray-900 light:bg-white rounded-md shadow-lg z-10 hidden group-hover:block text-xs text-white dark:text-gray-200 light:text-gray-800 border border-gray-700 dark:border-gray-700 light:border-gray-200">
                  <p className="mb-2">
                    Practice your English in this scenario. The AI will respond based on your messages.
                  </p>
                  <p>Your responses will be analyzed for grammar, vocabulary, and fluency.</p>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Chat Messages */}
        <CardContent className="flex-grow overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-700 dark:scrollbar-thumb-gray-700 light:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "agent" ? "justify-start" : "justify-end"} animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg transition-all duration-300 ${
                      message.role === "agent"
                        ? "bg-gradient-to-br from-indigo-500/30 to-purple-600/30 dark:from-indigo-900/40 dark:to-purple-900/40 light:from-indigo-50 light:to-purple-50 border border-indigo-500/30 dark:border-indigo-700/30 light:border-indigo-200 speech-bubble-agent"
                        : "bg-gradient-to-br from-blue-500/30 to-teal-500/30 dark:from-blue-900/40 dark:to-teal-900/40 light:from-blue-50 light:to-teal-50 border border-blue-500/30 dark:border-blue-700/30 light:border-blue-200 speech-bubble-user"
                    }`}
                  >
                    {message.role === "agent" ? (
                      <div className="flex items-start">
                        <div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-white shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          onClick={() => speakText(message.content)}
                        >
                          <Volume2 className="h-5 w-5 group-hover:animate-pulse" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white dark:text-gray-100 light:text-gray-900">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="pr-2 text-white dark:text-gray-100 light:text-gray-900">
                            {/* Highlight vocabulary in the message */}
                            {message.vocabularyAnalysis ? (
                              <>
                                {message.content.split(" ").map((word, i) => {
                                  const cleanWord = word.replace(/[.,!?;:'"()]/g, "").toLowerCase()

                                  // Check if it's an advanced word
                                  const isAdvanced = message.vocabularyAnalysis?.advancedWords.some(
                                    (w) => w.word === cleanWord,
                                  )

                                  // Check if it's a common word
                                  const isCommon = message.vocabularyAnalysis?.commonWords.some(
                                    (w) => w.word === cleanWord,
                                  )

                                  if (isAdvanced) {
                                    return (
                                      <span
                                        key={i}
                                        className="text-green-300 dark:text-green-400 light:text-green-700 font-medium"
                                      >
                                        {word}{" "}
                                      </span>
                                    )
                                  } else if (isCommon) {
                                    return (
                                      <span
                                        key={i}
                                        className="text-yellow-300 dark:text-yellow-400 light:text-yellow-700"
                                      >
                                        {word}{" "}
                                      </span>
                                    )
                                  } else {
                                    return <span key={i}>{word} </span>
                                  }
                                })}
                              </>
                            ) : (
                              message.content
                            )}
                          </p>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center ml-2 flex-shrink-0 text-white shadow-md">
                            <User className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Show corrected text directly below user message */}
                        {message.feedback?.correctedText && message.feedback.correctedText !== message.content && (
                          <div className="mt-2 pl-2 border-l-2 border-green-500 dark:border-green-500 light:border-green-600">
                            <div className="flex items-start">
                              <Check className="h-4 w-4 text-green-400 dark:text-green-400 light:text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-green-300 dark:text-green-300 light:text-green-700">
                                {message.feedback.correctedText}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Feedback buttons */}
                        {message.feedback && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.feedback.mistakes && message.feedback.mistakes.length > 0 && (
                              <button
                                onClick={() => openFeedbackModal(message.feedback, "mistakes")}
                                className="inline-flex items-center text-xs bg-red-900/30 dark:bg-red-900/30 light:bg-red-100 text-red-300 dark:text-red-300 light:text-red-700 px-2 py-1 rounded hover:bg-red-900/50 dark:hover:bg-red-900/50 light:hover:bg-red-200 transition-colors"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {message.feedback.mistakes.length} mistake
                                {message.feedback.mistakes.length !== 1 ? "s" : ""}
                              </button>
                            )}

                            {message.feedback.suggestions && message.feedback.suggestions.length > 0 && (
                              <button
                                onClick={() => openFeedbackModal(message.feedback, "suggestions")}
                                className="inline-flex items-center text-xs bg-amber-900/30 dark:bg-amber-900/30 light:bg-amber-100 text-amber-300 dark:text-amber-300 light:text-amber-700 px-2 py-1 rounded hover:bg-amber-900/50 dark:hover:bg-amber-900/50 light:hover:bg-amber-200 transition-colors"
                              >
                                <Lightbulb className="h-3 w-3 mr-1" />
                                {message.feedback.suggestions.length} suggestion
                                {message.feedback.suggestions.length !== 1 ? "s" : ""}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center">
                <div className="text-center p-8 text-gray-400 dark:text-gray-500 light:text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-indigo-900/30 dark:bg-gray-800/50 light:bg-indigo-50 border border-indigo-700/30 dark:border-gray-700 light:border-indigo-200 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 light:bg-indigo-600 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 light:bg-indigo-600 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 light:bg-indigo-600 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-white dark:text-gray-200 light:text-gray-900">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-500/30 text-red-200 light:bg-red-50 light:border-red-300 light:text-red-700"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Redesigned Chat Input */}
        {!isComplete && (
          <div className="p-4 border-t border-slate-700 dark:border-gray-700 light:border-gray-200 bg-slate-800/50 dark:bg-gray-800/50 light:bg-white/90 backdrop-blur-sm">
            {speechRecognitionError && (
              <Alert
                variant="destructive"
                className="mb-3 py-2 px-3 bg-red-900/20 dark:bg-red-900/20 light:bg-red-50 border-red-500/30 dark:border-red-500/30 light:border-red-300 text-red-200 dark:text-red-200 light:text-red-700"
              >
                <AlertDescription className="text-xs">
                  {speechRecognitionError}. Try using text input instead.
                </AlertDescription>
              </Alert>
            )}

            {isRecording && (
              <div className="mb-3 py-2 px-3 bg-indigo-900/30 dark:bg-indigo-900/30 light:bg-indigo-50 border border-indigo-500/30 dark:border-indigo-500/30 light:border-indigo-200 rounded-md">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <Mic className="h-4 w-4 text-indigo-400 dark:text-indigo-400 light:text-indigo-600" />
                    <span className="absolute -inset-1 rounded-full bg-indigo-400/30 dark:bg-indigo-400/30 light:bg-indigo-400/50 animate-pulse"></span>
                  </div>
                  <span className="text-indigo-200 dark:text-indigo-200 light:text-indigo-700 text-sm">
                    {interimTranscript ? interimTranscript : "Listening..."}
                  </span>
                </div>
              </div>
            )}

            {/* Redesigned input area */}
            <div className="relative flex items-end gap-2 bg-slate-700/30 dark:bg-gray-700/30 light:bg-gray-100 rounded-xl p-1 border border-slate-600/50 dark:border-gray-600/50 light:border-gray-300">
              {/* Mic button moved to the left */}
              {browserSupportsSpeechRecognition && (
                <button
                  type="button"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={isProcessing}
                  className={`p-2 rounded-full flex-shrink-0 transition-all duration-200 ${
                    isRecording
                      ? "bg-red-500/80 text-white hover:bg-red-600/80"
                      : "bg-blue-500/80 text-white hover:bg-blue-600/80"
                  }`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}

              <form onSubmit={handleTextSubmit} className="flex-grow flex items-end">
                <div className="relative flex-grow">
                  <textarea
                    ref={textareaRef}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full bg-transparent border-0 rounded-lg px-3 py-2 text-white dark:text-gray-100 light:text-gray-900 placeholder:text-white/50 dark:placeholder:text-gray-400 light:placeholder:text-gray-500 focus:outline-none focus:ring-0 resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
                    disabled={isProcessing}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (textInput.trim()) {
                          handleSubmit(textInput)
                        }
                      }
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing || !textInput.trim()}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full p-2 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </Card>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedback={selectedFeedback}
        type={feedbackModalType}
      />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmNavigation}
        title="Leave Conversation?"
        message="You're in the middle of a conversation. If you leave now, your progress will be lost. Would you like to see your evaluation before leaving?"
        confirmText="Yes, Show Evaluation"
        cancelText="Continue Conversation"
      />
    </div>
  )
}
