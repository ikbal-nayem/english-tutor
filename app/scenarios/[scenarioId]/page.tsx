import ScenarioChat from "@/components/scenario-chat"

export default function ScenarioPage({ params }: { params: { scenarioId: string } }) {
  return <ScenarioChat scenarioId={params.scenarioId} />
}
