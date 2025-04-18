import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { message, scenarioContext, userRole, agentRole } = await req.json()

    // Create a system prompt that explains the scenario and roles
    const systemPrompt = `
You are an AI language tutor named English Tutor, helping someone practice their English conversation skills in a ${scenarioContext} scenario.

You are playing the role of ${agentRole}, and the user is playing the role of ${userRole}.

Your goal is to:
1. Respond naturally as ${agentRole} would in this scenario
2. Keep responses conversational and realistic for the scenario
3. Adjust your language complexity based on the user's level
4. Continue the conversation in a natural way

Important guidelines:
- Keep responses brief (1-3 sentences)
- Stay in character as ${agentRole}
- Don't mention that you're an AI or language tutor
- Don't provide explicit language corrections during the conversation
- Respond directly as if you're having a real conversation
`

    // Generate a response using the AI SDK
    const response = await generateText({
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 150,
    })

    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
