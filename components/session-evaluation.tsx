"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { formatTime } from "@/lib/utils";
import type { Sentence, SessionStats } from "@/types/speech";
import { AlertTriangle, BarChart, CheckCircle, Clock, Lightbulb, MessageSquare, Star } from "lucide-react";
import type React from "react";

interface SessionEvaluationProps {
  stats: SessionStats;
  sentences: Sentence[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionEvaluation({ stats, sentences, isOpen, onClose }: SessionEvaluationProps) {
  // Calculate score based on mistakes and corrections
  const calculateScore = () => {
    if (stats.totalSentences === 0) return 0;

    // Count sentences with API errors
    const apiErrorCount = sentences.filter((s) => s.apiError).length;

    // If all sentences have API errors, return a default score
    if (apiErrorCount === stats.totalSentences) {
      return 50; // Default score when all processing failed
    }

    // Base score starts at 100
    let score = 100;

    // Deduct points for mistakes (max 50 points deduction)
    // Only consider sentences without API errors
    const validSentences = stats.totalSentences - apiErrorCount;
    const mistakeRatio = validSentences > 0 ? Math.min(stats.mistakesDetected / validSentences, 0.5) : 0;

    score -= mistakeRatio * 100;

    return Math.round(score);
  };

  const score = calculateScore();
  const scoreColor =
    score >= 90 ? "text-green-500" : score >= 75 ? "text-blue-500" : score >= 60 ? "text-amber-500" : "text-red-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Evaluation" className="max-w-lg">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-lg border-4 border-blue-100">
            <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
            <div className="absolute -top-2 -right-2">
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className={`text-xl font-semibold ${scoreColor}`}>
            {score >= 90
              ? "Excellent!"
              : score >= 75
              ? "Very Good!"
              : score >= 60
              ? "Good Progress!"
              : "Keep Practicing!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
            label="Sentences"
            value={stats.totalSentences.toString()}
            color="blue"
          />
          <StatCard
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            label="Mistakes"
            value={stats.mistakesDetected.toString()}
            color="red"
          />
          <StatCard
            icon={<CheckCircle className="h-4 w-4 text-green-500" />}
            label="Corrections"
            value={stats.correctionsMade.toString()}
            color="green"
          />
          <StatCard
            icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
            label="Suggestions"
            value={stats.suggestionsProvided.toString()}
            color="amber"
          />
        </div>

        <div className="flex items-center justify-center bg-blue-50 py-2 px-3 rounded-lg">
          <Clock className="h-4 w-4 text-blue-500 mr-2" />
          <span className="text-blue-700 text-sm">Session Duration: {formatTime(stats.sessionDuration)}</span>
        </div>

        {sentences.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm mb-2 text-purple-700 flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                Performance Analysis
              </h3>
              {sentences.some((s) => !s.apiError && s.mistakes && s.mistakes.length > 0) ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-purple-600 mb-1">Common Mistakes:</h4>
                    <ul className="space-y-1">
                      {sentences
                        .filter((s) => !s.apiError)
                        .flatMap((s) => s.mistakes || [])
                        .slice(0, 3)
                        .map((mistake, i) => (
                          <li key={i} className="text-xs text-purple-800 flex items-start">
                            <span className="w-4 h-4 bg-purple-200 rounded-full text-purple-600 flex items-center justify-center text-xs mr-1 mt-0.5">
                              {i + 1}
                            </span>
                            {mistake}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-purple-600 mb-1">Suggested Improvements:</h4>
                    <ul className="space-y-1">
                      {sentences
                        .filter((s) => !s.apiError)
                        .flatMap((s) => s.suggestions || [])
                        .slice(0, 2)
                        .map((suggestion, i) => (
                          <li key={i} className="text-xs text-purple-800 flex items-start">
                            <span className="w-4 h-4 bg-purple-200 rounded-full text-purple-600 flex items-center justify-center text-xs mr-1 mt-0.5">
                              {i + 1}
                            </span>
                            {suggestion}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {sentences.every((s) => s.apiError)
                    ? "No mistake analysis available due to API errors."
                    : "No mistakes detected in this session."}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <Button
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
            onClick={onClose}
          >
            Start New Session
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "red" | "green" | "amber";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100",
    red: "bg-red-50 border-red-100",
    green: "bg-green-50 border-green-100",
    amber: "bg-amber-50 border-amber-100",
  };

  return (
    <div className={`rounded-lg p-2 flex items-center border ${colorClasses[color]}`}>
      <div className="mr-2">{icon}</div>
      <div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
