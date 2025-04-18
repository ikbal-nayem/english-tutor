"use server"

import type { Message } from "@/types/scenarios"

export async function generateChatResponse(
  message: string,
  scenarioContext: string,
  userRole: string,
  agentRole: string,
  conversationHistory: Message[] = [],
): Promise<{ success: boolean; response: string }> {
  const OR_TOKEN = process.env.OR_TOKEN
  const LLM = process.env.LLM || "anthropic/claude-3-haiku:beta" // Use the same LLM as in other parts

  if (!OR_TOKEN) {
    console.error("OpenRouter API token is not configured")
    return {
      success: false,
      response: "I'm sorry, I couldn't process your message. Please check the API configuration.",
    }
  }

  // Parse the comma-separated list of tokens
  const tokens = OR_TOKEN.split(",").map((token) => token.trim())

  if (tokens.length === 0) {
    console.error("No valid OpenRouter API tokens found")
    return {
      success: false,
      response: "I'm sorry, I couldn't process your message. No valid API tokens found.",
    }
  }

  // Create a system prompt that explains the scenario and roles
  const systemPrompt = `
You are an AI language tutor named English Tutor, helping someone practice their English conversation skills in a ${scenarioContext} scenario.

You are playing the role of ${agentRole}, and the user is playing the role of ${userRole}.

Your goal is to:
1. Respond naturally as ${agentRole} would in this scenario
2. Keep responses conversational and realistic for the scenario
3. Adjust your language complexity based on the user's level
4. Continue the conversation in a natural way
5. Maintain context from the entire conversation history

Important guidelines:
- Keep responses brief (1-3 sentences)
- Stay in character as ${agentRole}
- Don't mention that you're an AI or language tutor
- Don't provide explicit language corrections during the conversation
- Respond directly as if you're having a real conversation
`

  // Format conversation history for the API
  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ]

  // Add conversation history to maintain context
  if (conversationHistory.length > 0) {
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role === "agent" ? "assistant" : "user",
        content: msg.content,
      })
    })
  }

  // Add the current user message
  messages.push({
    role: "user",
    content: message,
  })

  console.log("Sending messages to OpenRouter:", messages)

  // Try each token until one works or we run out of tokens
  let lastError = null
  let tokenIndex = 0

  while (tokenIndex < tokens.length) {
    const currentToken = tokens[tokenIndex]

    try {
      console.log(`Trying token ${tokenIndex + 1}/${tokens.length} for chat response...`)

      // Make the API request to OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
          "HTTP-Referer": "https://vercel.com",
          "X-Title": "English Speaking Skills Improvement App",
        },
        body: JSON.stringify({
          model: LLM,
          messages: messages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
        console.error(`OpenRouter API error with token ${tokenIndex + 1}:`, response.status, errorData)

        // Check for token limit error
        if (
          response.status === 429 ||
          (errorData?.error?.message &&
            (errorData.error.message.includes("limit") ||
              errorData.error.message.includes("quota") ||
              errorData.error.message.includes("exceeded")))
        ) {
          console.log(`Token ${tokenIndex + 1} limit exceeded, trying next token...`)
          tokenIndex++
          continue
        }

        // For other errors, throw and try next token
        throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()

      // Check if the response has the expected structure
      if (
        !data ||
        !data.choices ||
        !data.choices.length ||
        !data.choices[0].message ||
        !data.choices[0].message.content
      ) {
        console.error("Unexpected API response structure:", data)

        // If this is the last token, return error
        if (tokenIndex === tokens.length - 1) {
          return {
            success: false,
            response: "I'm sorry, I couldn't process your message due to a technical issue. Let's try again.",
          }
        } else {
          // Try next token
          tokenIndex++
          continue
        }
      }

      const content = data.choices[0].message.content
      return { success: true, response: content }
    } catch (error) {
      console.error(`Error with token ${tokenIndex + 1}:`, error)
      lastError = error

      // Try the next token
      tokenIndex++
    }
  }

  // If we've tried all tokens and none worked
  console.error("All tokens failed for chat response. Last error:", lastError)

  return {
    success: false,
    response: "I'm sorry, I couldn't process your message. All available tokens failed. Let's try again.",
  }
}
