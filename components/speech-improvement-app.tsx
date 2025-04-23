"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguageProcessing } from "@/hooks/use-language-processing";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { Sentence, SessionStats } from "@/types/speech";
import clsx from "clsx";
import { AlertTriangle, Mic, MicOff, Send, StopCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SessionEvaluation from "./session-evaluation";
import TranscriptDisplay from "./transcript-display";

export default function SpeechImprovementApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [manualInput, setManualInput] = useState("");
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    interimTranscript,
    resetTranscript,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    browserSupportsSpeechRecognition,
    error: speechRecognitionError,
  } = useSpeechRecognition();

  const { processText, isProcessing } = useLanguageProcessing();

  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [showSilenceHint, setShowSilenceHint] = useState(false);

  // Track last appended transcript
  const lastAppendedTranscript = useRef("");

  // Handle silence detection
  useEffect(() => {
    // Clear any existing timer when transcript changes or listening state changes
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
      setShowSilenceHint(false);
    }

    // Only set up silence detection when actively listening
    if (isRecording) {
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
  }, [transcript, interimTranscript, isRecording]);

  // Append speech to textarea
  useEffect(() => {
    if (transcript && transcript !== lastAppendedTranscript.current) {
      setManualInput((prev) => {
        const newValue = prev ? `${prev} ${transcript}` : transcript;
        lastAppendedTranscript.current = transcript;
        return newValue;
      });

      if (!interimTranscript) {
        resetTranscript();
        lastAppendedTranscript.current = "";
      }
    }
  }, [transcript, interimTranscript, resetTranscript]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [manualInput]);

  // Pause recording
  const handlePauseRecording = () => {
    console.log("Pausing recording...");
    setIsPaused(true);
    stopSpeechRecognition();
  };

  // Resume recording
  const handleResumeRecording = () => {
    console.log("Resuming recording...");
    setIsPaused(false);
    startSpeechRecognition();
  };

  // End session and show evaluation
  const handleEndSession = () => {
    console.log("Ending session...");
    setIsRecording(false);
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

  const handleProcessText = async () => {
    if (!manualInput.trim()) return;

    handlePauseRecording();

    // Add pending sentence immediately
    const pendingSentence = {
      originalText: manualInput,
      correctedText: "",
      isProcessing: true,
    };
    setSentences((prev) => [...prev, pendingSentence]);
    const inputText = manualInput;
    setManualInput("");

    try {
      const result = await processText(inputText);
      console.log("Processed result:", result);
      setSentences((prev) => [...prev.slice(0, -1), { ...result, isProcessing: false }]);
    } catch (error) {
      console.error("Error processing text:", error);
      setSentences((prev) => [
        ...prev.slice(0, -1),
        {
          ...pendingSentence,
          isProcessing: false,
          apiError: true,
        },
      ]);
    }
  };

  // Start a new session
  const handleStartNewSession = () => {
    setShowEvaluation(false);
    setSentences([]);
    resetTranscript();
    lastProcessedText.current = "";
    sessionStartTime.current = null;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="md:w-1/3 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:from-indigo-600 dark:to-purple-600 light:from-indigo-400 light:via-purple-400 light:to-pink-400 shadow-md">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold">Practice Session</h2>
              {sentences.length > 0 && (
                <button
                  onClick={handleEndSession}
                  className="flex items-center px-2 py-1 rounded-full text-xs bg-red-500 hover:bg-red-600 text-white shadow-md"
                >
                  <StopCircle className="h-3 w-3 mr-1" />
                  End Session
                </button>
              )}
            </div>

            <div className="relative min-h-[60px] p-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-inner flex-grow">
              <textarea
                ref={textareaRef}
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full h-full bg-transparent text-white text-sm mb-2 focus:outline-none resize-none"
                placeholder="Type or speak your text here..."
              />
              <div className="absolute bottom-1 left-1 text-xs text-green-200 flex items-center">
                {isPaused ? <MicOff className="h-3 w-3 mr-1" /> : <Mic className="h-3 w-3 mr-1" />}
                {interimTranscript && <span className="italic">"{interimTranscript?.trim()}"</span>}
                {!interimTranscript && (
                  <div className="text-xs text-gray-300">
                    <span className="animate-pulse">{isPaused ? "Paused" : "Listening..."}</span>
                  </div>
                )}
              </div>

              {isProcessing && (
                <div className="absolute right-1 top-1 bg-blue-600/80 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                  Processing...
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between gap-2">
                {browserSupportsSpeechRecognition ? (
                  <Button
                    onClick={isPaused ? handleResumeRecording : handlePauseRecording}
                    className={clsx("rounded-full", {
                      "bg-blue-600 hover:bg-blue-600/50 text-white shadow-md": !isPaused,
                      "bg-gray-500 hover:bg-gray-600 text-white": isPaused,
                    })}
                    size="sm"
                  >
                    {isPaused ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                ) : null}

                <Button
                  onClick={handleProcessText}
                  className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md"
                  size="sm"
                  disabled={!manualInput.trim()}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
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
                Your text will appear here. Start speaking or typing to begin.
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

      {/* <DebugPanel
        speechRecognitionState={{
          isListening: isSpeechRecognitionListening,
          transcript,
          interimTranscript,
          error: speechRecognitionError,
          browserSupport: browserSupportsSpeechRecognition,
        }}
      /> */}
    </>
  );
}
