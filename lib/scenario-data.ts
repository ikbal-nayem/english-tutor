import type { ScenarioData } from "@/types/scenarios";

export const scenarioData: Record<string, ScenarioData> = {
  restaurant: {
    title: "Ordering food at a restaurant 🍔",
    agentName: "Server",
    userRole: "Customer",
    initialQuestion: "Welcome to our restaurant! Can I get you something to drink to start?",
  },

  interview: {
    title: "Job interview practice 💼",
    agentName: "Interviewer",
    userRole: "Candidate",
    initialQuestion:
      "Thanks for coming in today. To start, could you tell me a little about yourself and your background?",
  },

  smalltalk: {
    title: "Making small talk at an event 🗣️",
    agentName: "Event Attendee",
    userRole: "You",
    initialQuestion: "Hi there! I don't think we've met before. I'm Alex. What's your name?",
  },

  travel: {
    title: "Travel and directions ✈️",
    agentName: "Local Resident",
    userRole: "Tourist",
    initialQuestion: "Hello there! You look a bit lost. Can I help you find something in our city?",
  },

  healthcare: {
    title: "Doctor's appointment 🏥",
    agentName: "Doctor",
    userRole: "Patient",
    initialQuestion: "Good morning. I'm Dr. Johnson. What brings you in to see me today?",
  },
};
