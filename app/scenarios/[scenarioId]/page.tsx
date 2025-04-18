import ScenarioChat from "@/components/scenario-chat";
import { Button } from "@/components/ui/button";
import { scenarioData } from "@/lib/scenario-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ScenarioPage({ params }: { params: { scenarioId: string } }) {
  const scenario = scenarioData[params.scenarioId];

  if (!scenario) {
    redirect("/scenarios");
  }

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="flex items-center mb-4">
        <Link href="/scenarios">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white dark:text-gray-300 dark:hover:text-white light:text-gray-700 light:hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Scenarios
          </Button>
        </Link>
        <h1 className="text-xl font-bold ml-2 text-white dark:text-white light:text-gray-900">{scenario.title}</h1>
      </div>

      <ScenarioChat scenario={scenario} />
    </div>
  );
}
