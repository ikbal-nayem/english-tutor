"use server"

import type { Sentence } from "@/types/speech"

// Function to process language using OpenRouter API
export async function processLanguage(text: string): Promise<Sentence> {
  const OR_TOKEN = process.env.OR_TOKEN
  const LLM = process.env.LLM || "anthropic/claude-3-haiku:beta" // Default to a smaller model if LLM not set

  if (!OR_TOKEN) {
    throw new Error("OpenRouter API token is not configured")
  }

  // Parse the comma-separated list of tokens
  const tokens = OR_TOKEN.split(",").map((token) => token.trim())

  if (tokens.length === 0) {
    throw new Error("No valid OpenRouter API tokens found")
  }

  console.log(`Processing text with model: ${LLM} (${tokens.length} tokens available)`)

  // Define the prompt for the language model
  const prompt = `
You are an English language tutor helping someone improve their speaking skills.
Analyze the following text that was transcribed from speech:

"${text}"

IMPORTANT GUIDELINES:
- IGNORE ALL punctuation issues including missing or incorrect commas, periods, question marks, etc.
- Ignore capitalization issues unless they significantly change meaning
- Ignore filler words like "um", "uh", "like" as these are normal in spoken language
- Focus only on significant grammar, vocabulary, and pronunciation issues
- Pay special attention to verb tense consistency and word choice based on context
- Be lenient with spoken language patterns that differ from formal written English
- Do not correct minor stylistic choices or regional variations

Respond with a JSON object that includes:
1. detectedLanguage: The ISO code of the detected language (e.g., "en" for English, "bn" for Bangla)
2. translatedText: If the text is not in English, provide an English translation. Otherwise, null.
3. correctedText: The grammatically correct version of the text (or translation if not English), fixing ONLY significant errors
4. mistakes: An array of specific grammar or pronunciation mistakes found (be specific about each mistake, but IGNORE ALL punctuation and filler words)
5. suggestions: An array of COMPLETE ALTERNATIVE SENTENCES that the person could have said instead (these should be full sentences, not just tips)

IMPORTANT: Return ONLY the JSON object without any markdown formatting, code blocks, or additional text.

Example response format:
{
  "detectedLanguage": "en",
  "translatedText": null,
  "correctedText": "This is the corrected text.",
  "mistakes": ["Incorrect verb tense in 'I goes to the store'", "Missing article before 'store'"],
  "suggestions": ["I went to the store yesterday.", "I am going to the store now.", "I will go to the store tomorrow."]
}
`

  // Try each token until one works or we run out of tokens
  let lastError = null
  let tokenIndex = 0

  while (tokenIndex < tokens.length) {
    const currentToken = tokens[tokenIndex]

    try {
      console.log(`Trying token ${tokenIndex + 1}/${tokens.length}...`)
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
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
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

        // Check specifically for credit error
        if (response.status === 402) {
          // If this is the last token, return error
          if (tokenIndex === tokens.length - 1) {
            return {
              originalText: text,
              correctedText: text,
              mistakes: ["OpenRouter API credit error: Insufficient credits."],
              suggestions: [
                "Please add more credits to your OpenRouter account at https://openrouter.ai/settings/credits",
              ],
              apiError: true,
              errorType: "INSUFFICIENT_CREDITS",
            }
          } else {
            // Try next token
            tokenIndex++
            continue
          }
        }

        // For other errors, throw and try next token
        throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log("OpenRouter API response:", data)

      // Check if the response has the expected structure
      if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
        console.error("Unexpected API response structure:", data)

        // If this is the last token, return error
        if (tokenIndex === tokens.length - 1) {
          return {
            originalText: text,
            correctedText: text,
            mistakes: ["Error: Received an unexpected response format from the AI service."],
            suggestions: ["Please try again later. The service might be experiencing issues."],
            apiError: true,
            errorType: "PARSING_ERROR",
          }
        } else {
          // Try next token
          tokenIndex++
          continue
        }
      }

      // Parse the response content
      let parsedContent: any
      try {
        // Get the content from the response
        const content = data.choices[0].message.content
        console.log("Raw content:", content)

        // Function to extract JSON from potentially markdown-formatted text
        const extractJSON = (text: string): string => {
          // Remove markdown code block formatting if present
          let cleanedText = text

          // Remove \`\`\`json or \`\`\` at the beginning
          cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/m, "")

          // Remove \`\`\` at the end
          cleanedText = cleanedText.replace(/\n?```$/m, "")

          // Trim any extra whitespace
          cleanedText = cleanedText.trim()

          return cleanedText
        }

        // Extract and parse the JSON
        const jsonText = extractJSON(content)
        console.log("Extracted JSON text:", jsonText)
        parsedContent = JSON.parse(jsonText)
        console.log("Parsed content:", parsedContent)
      } catch (e) {
        console.error("Error parsing JSON response:", e)

        // Fallback: Try to extract JSON using regex
        try {
          if (!data.choices[0].message.content) {
            throw new Error("No content in API response")
          }

          const content = data.choices[0].message.content
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[0])
            console.log("Extracted JSON content using regex:", parsedContent)
          } else {
            throw new Error("Failed to extract JSON from response")
          }
        } catch (regexError) {
          console.error("Regex extraction failed:", regexError)

          // If this is the last token, return error
          if (tokenIndex === tokens.length - 1) {
            // Return a graceful error response if all parsing attempts fail
            return {
              originalText: text,
              correctedText: text,
              mistakes: ["Error parsing AI response. Please try again."],
              suggestions: ["The AI response format was unexpected. Try speaking more clearly."],
              apiError: true,
              errorType: "PARSING_ERROR",
            }
          } else {
            // Try next token
            tokenIndex++
            continue
          }
        }
      }

      // Create and return the sentence object
      return {
        originalText: text,
        detectedLanguage: parsedContent.detectedLanguage,
        translatedText: parsedContent.translatedText,
        correctedText: parsedContent.correctedText,
        mistakes: parsedContent.mistakes || [],
        suggestions: parsedContent.suggestions || [],
      }
    } catch (error) {
      console.error(`Error with token ${tokenIndex + 1}:`, error)
      lastError = error

      // Try the next token
      tokenIndex++
    }
  }

  // If we've tried all tokens and none worked
  console.error("All tokens failed. Last error:", lastError)

  // Return a graceful error response
  return {
    originalText: text,
    correctedText: text,
    mistakes: [
      "Error processing with AI: All available tokens failed. " +
        (lastError instanceof Error ? lastError.message : String(lastError)),
    ],
    suggestions: ["Try again later or check your API configuration"],
    apiError: true,
    errorType: "GENERAL_ERROR",
  }
}
