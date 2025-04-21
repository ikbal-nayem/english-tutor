export interface ScenarioData {
  title: string;
  agentName: string;
  userRole: string;
  initialQuestion: string;
}

export interface Message {
  role: "agent" | "user";
  content: string;
  category?: string;
  feedback?: {
    correctedText?: string;
    mistakes?: string[];
    suggestions?: string[];
  };
}
