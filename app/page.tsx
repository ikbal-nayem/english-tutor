import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Mic } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { PWARegister } from "./pwa";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
      <PWARegister />

      <div className="flex flex-col items-center mb-8">
        <Image src="/logo.png" alt="English Tutor Logo" width={100} height={100} className="mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-center">
          English Tutor
        </h1>
        <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-lg mx-auto text-center mt-3">
          Practice your English speaking skills with AI-powered feedback and realistic conversations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <FeatureCard
          title="Free Practice"
          description="Practice speaking freely and get instant feedback on your pronunciation and grammar"
          icon={<Mic className="h-6 w-6 text-blue-400" />}
          href="/practice/session"
          buttonText="Start Practice"
        />

        <FeatureCard
          title="Real-World Scenarios"
          description="Practice conversations in simulated real-world scenarios with dynamic responses"
          icon={<MessageSquare className="h-6 w-6 text-purple-400" />}
          href="/scenarios"
          buttonText="Try Scenarios"
        />
      </div>

      <hr />
      <small className="text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-lg mx-auto text-center mt-10">
        The project does not collect or store any user informations, or conversations histroy.
        <br />
        Developed by{" "}
        <a
          href="https://github.com/ikbal-nayem"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hover:underline"
        >
          Ikbal Nayem
        </a>
      </small>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
}

function FeatureCard({ title, description, icon, href, buttonText }: FeatureCardProps) {
  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-2 dark:border-gray-700 shadow-lg overflow-hidden dark:bg-gray-800/30 light:bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="bg-white/10 dark:bg-gray-700 light:bg-gray-100 rounded-full p-3 w-fit mb-4">{icon}</div>

          <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 mb-6 flex-grow">{description}</p>

          <Link href={href}>
            <Button className="w-full bg-gradient-to-r from-blue-200 to-purple-300 dark:from-blue-500 dark:to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white">
              {buttonText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
