"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguageProcessing } from "@/hooks/use-language-processing";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { Sentence, SessionStats } from "@/types/speech";
import { AlertTriangle, Mic, MicOff, Pause, Play, StopCircle, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DebugPanel from "./debug-panel";
import SessionEvaluation from "./session-evaluation";
import TranscriptDisplay from "./transcript-display";

export default function SpeechImprovementApp() {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalSentences: 0,
    mistakesDetected: 0,
    correctionsMade: 0,
    suggestionsProvided: 0,
    sessionDuration: 0,
  });
  const sessionStartTime = useRef<number | null>(null);
  const lastProcessedText = useRef<string>("");

  const {
    transcript,
    interimTranscript,
    resetTranscript,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    isListening: isSpeechRecognitionListening,
    browserSupportsSpeechRecognition,
    error: speechRecognitionError,
  } = useSpeechRecognition();

  const { processText, isProcessing } = useLanguageProcessing();

  // Add a state to track silence duration and provide feedback
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [showSilenceHint, setShowSilenceHint] = useState(false);

  // Handle new transcript
  useEffect(() => {
    const handleNewTranscript = async () => {
      if (transcript && transcript.trim() !== "" && transcript !== lastProcessedText.current) {
        console.log("Processing new transcript:", transcript);
        lastProcessedText.current = transcript;

        try {
          // Process the transcript with OpenRouter API
          const result = await processText(transcript);
          console.log("Processed result:", result);

          // Add the processed sentence to the list
          setSentences((prev) => [...prev, result]);
        } catch (error) {
          console.error("Error processing transcript:", error);
        }

        // Reset the transcript for the next sentence
        resetTranscript();
      }
    };

    // If we have a transcript and we're not processing, handle it
    if (transcript && !isProcessing && isListening && !isPaused) {
      handleNewTranscript();
    }
  }, [transcript, isProcessing, isListening, isPaused, processText, resetTranscript]);

  // Handle silence detection
  useEffect(() => {
    // Clear any existing timer when transcript changes or listening state changes
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
      setShowSilenceHint(false);
    }

    // Only set up silence detection when actively listening
    if (isListening && !isPaused) {
      // Set a timer to show a hint if no speech is detected for 10 seconds
      const timer = setTimeout(() => {
        setShowSilenceHint(true);
      }, 10000);

      setSilenceTimer(timer);
    }

    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [transcript, interimTranscript, isListening, isPaused]);

  // Start listening
  const handleStartListening = () => {
    console.log("Starting listening...");
    setIsListening(true);
    setIsPaused(false);
    startSpeechRecognition();
    setSentences([]);
    setShowEvaluation(false);
    sessionStartTime.current = Date.now();
    lastProcessedText.current = "";
  };

  // Pause listening
  const handlePauseListening = () => {
    console.log("Pausing listening...");
    setIsPaused(true);
    stopSpeechRecognition();
  };

  // Resume listening
  const handleResumeListening = () => {
    console.log("Resuming listening...");
    setIsPaused(false);
    startSpeechRecognition();
  };

  // Stop listening and show evaluation
  const handleStopListening = () => {
    console.log("Stopping listening...");
    setIsListening(false);
    setIsPaused(false);
    stopSpeechRecognition();

    // Calculate session stats
    const apiErrorCount = sentences.filter((s) => s.apiError).length;

    // Only count mistakes from sentences without API errors
    const mistakesCount = sentences
      .filter((s) => !s.apiError)
      .reduce((count, sentence) => count + (sentence.mistakes?.length || 0), 0);

    const correctionsCount = sentences
      .filter((s) => !s.apiError)
      .reduce((count, sentence) => (sentence.correctedText !== sentence.originalText ? count + 1 : count), 0);

    const suggestionsCount = sentences
      .filter((s) => !s.apiError)
      .reduce((count, sentence) => count + (sentence.suggestions?.length || 0), 0);

    const duration = sessionStartTime.current ? Math.floor((Date.now() - sessionStartTime.current) / 1000) : 0;

    setSessionStats({
      totalSentences: sentences.length,
      mistakesDetected: mistakesCount,
      correctionsMade: correctionsCount,
      suggestionsProvided: suggestionsCount,
      sessionDuration: duration,
      apiErrors: apiErrorCount,
    });

    setShowEvaluation(true);
  };

  // Start a new session
  const handleStartNewSession = () => {
    setShowEvaluation(false);
    setSentences([]);
    resetTranscript();
    lastProcessedText.current = "";
    sessionStartTime.current = null;
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-lg border border-red-200">
        <h2 className="text-xl font-bold mb-2">Browser Not Supported</h2>
        <p>Your browser doesn't support the Speech Recognition API. Please try using Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* New compact recorder design */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="md:w-1/3 p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 light:from-indigo-400 light:via-purple-400 light:to-pink-400 shadow-md">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold">Speech Recorder</h2>
              {/* Only show recording indicator when actually recording (not paused) */}
              {isListening && !isPaused && (
                <div className="flex items-center text-xs bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <span className="animate-pulse mr-1 text-red-300">●</span> Recording
                </div>
              )}
            </div>

            <div className="relative min-h-[60px] p-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-inner flex-grow">
              {isListening ? (
                isPaused ? (
                  <div className="flex items-center text-yellow-200 text-xs">
                    <MicOff className="mr-1 h-3 w-3" />
                    Paused
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center text-green-200 text-xs">
                      <div className="relative mr-1">
                        <Mic className="h-3 w-3" />
                        <div className="absolute -inset-1 rounded-full bg-green-400/30 animate-pulse" />
                      </div>
                      Listening...
                    </div>

                    {interimTranscript && (
                      <div className="text-xs text-white/90 italic bg-black/20 p-1 rounded-lg max-h-[40px] overflow-y-auto">
                        "{interimTranscript}"
                      </div>
                    )}

                    {showSilenceHint && !interimTranscript && (
                      <div className="mt-2 text-xs text-yellow-200 bg-black/20 p-1.5 rounded-lg animate-pulse">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        No speech detected. Please speak or check your microphone.
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-white/80 text-xs py-1">
                  <Volume2 className="h-3 w-3 mr-1 opacity-70" />
                  Click Start to begin
                </div>
              )}

              {isProcessing && (
                <div className="absolute right-1 top-1 bg-blue-600/80 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                  Processing...
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 mt-2">
              {!isListening ? (
                <Button
                  onClick={handleStartListening}
                  className="bg-green-500 hover:bg-green-600 text-white shadow-md dark:bg-green-600 dark:hover:bg-green-700 light:bg-green-500 light:hover:bg-green-600"
                  size="sm"
                >
                  <Mic className="mr-1 h-3 w-3" />
                  Start
                </Button>
              ) : (
                <>
                  {isPaused ? (
                    <Button
                      onClick={handleResumeListening}
                      className="bg-amber-500 hover:bg-amber-600 text-white shadow-md dark:bg-amber-600 dark:hover:bg-amber-700 light:bg-amber-500 light:hover:bg-amber-600"
                      size="sm"
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePauseListening}
                      className="bg-amber-500 hover:bg-amber-600 text-white shadow-md dark:bg-amber-600 dark:hover:bg-amber-700 light:bg-amber-500 light:hover:bg-amber-600"
                      size="sm"
                    >
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={handleStopListening}
                    className="bg-red-500 hover:bg-red-600 text-white shadow-md dark:bg-red-600 dark:hover:bg-red-700 light:bg-red-500 light:hover:bg-red-600"
                    size="sm"
                  >
                    <StopCircle className="mr-1 h-3 w-3" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Main content area */}
        <div className="md:w-2/3 flex flex-col gap-4">
          {speechRecognitionError && (
            <Alert
              variant="destructive"
              className="py-2 px-3 bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300 light:bg-red-50 light:border-red-200 light:text-red-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription className="text-xs">{speechRecognitionError}</AlertDescription>
            </Alert>
          )}

          {sentences.length > 0 ? (
            <TranscriptDisplay sentences={sentences} />
          ) : (
            <Card className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 text-center dark:bg-gray-800/30 dark:border-gray-700/30 light:bg-white light:border-gray-200">
              <p className="text-gray-300 text-sm dark:text-gray-400 light:text-gray-500">
                Your conversation will appear here. Start speaking to begin.
              </p>
            </Card>
          )}
        </div>
      </div>

      <SessionEvaluation
        stats={sessionStats}
        sentences={sentences}
        isOpen={showEvaluation}
        onClose={handleStartNewSession}
      />

      <DebugPanel
        speechRecognitionState={{
          isListening: isSpeechRecognitionListening,
          transcript,
          interimTranscript,
          error: speechRecognitionError,
          browserSupport: browserSupportsSpeechRecognition,
        }}
      />
    </div>
  );
}
