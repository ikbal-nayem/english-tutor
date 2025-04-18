import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Globe, Lightbulb, Mic } from "lucide-react";
import Link from "next/link";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto px-4 py-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Improve Your English Speaking Skills
        </h1>
        <p className="text-gray-300 max-w-lg mx-auto">
          Speak naturally in any language and get instant feedback to enhance your English speaking abilities.
        </p>
      </div>

      <Card className="w-full bg-white/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<Mic className="h-5 w-5 text-blue-400" />}
              title="Speech Recognition"
              description="Speak naturally and get your speech transcribed in real-time"
            />
            <FeatureCard
              icon={<Globe className="h-5 w-5 text-purple-400" />}
              title="Multi-language Support"
              description="Speak in your native language and get English translations"
            />
            <FeatureCard
              icon={<CheckCircle className="h-5 w-5 text-green-400" />}
              title="Grammar Correction"
              description="Get instant corrections for grammar and pronunciation mistakes"
            />
            <FeatureCard
              icon={<Lightbulb className="h-5 w-5 text-amber-400" />}
              title="Improvement Suggestions"
              description="Receive alternative ways to express yourself more naturally"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Link href={"/practice/session"}>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 h-auto text-lg font-medium rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
                <Mic className="mr-2 h-5 w-5" />
                Start Speaking
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Click the button above to begin your speaking practice session</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500">
        <p>Powered by OpenRouter API and Web Speech Recognition</p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-start">
        <div className="bg-white/10 rounded-full p-2 mr-3">{icon}</div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
