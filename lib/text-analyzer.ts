"use server";

import type { Sentence } from "@/types/speech";
import { getLLMResponse, setNextTokenIndex, tokenIndex, tokenLength } from "./openrouter";

export async function processLanguage(text: string): Promise<Sentence> {
  // Define the prompt for the language model
  const prompt = `
You are an English language tutor helping someone improve their speaking skills.
Analyze the following text that was transcribed from speech:

"${text}"

IMPORTANT GUIDELINES TO MARK AS MISTAKES:
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
`;

  while (tokenIndex < tokenLength) {
    // const currentToken = tokens[tokenIndex]
    try {
      const response = await getLLMResponse([{ role: "user", content: prompt }], { type: "json_object" });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
        console.error(`OpenRouter API error with token ${tokenIndex + 1}:`, response.status, errorData);

        // Check for token limit error
        if (
          response.status === 402 ||
          response.status === 429 ||
          (errorData?.error?.message &&
            (errorData.error.message.includes("limit") ||
              errorData.error.message.includes("quota") ||
              errorData.error.message.includes("exceeded")))
        ) {
          if (tokenIndex === tokenLength - 1) {
            setNextTokenIndex();
            break;
          }
          setNextTokenIndex();
          continue;
        }
        throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("OpenRouter API response:", data);

      // Check if the response has the expected structure
      if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
        console.error("Unexpected API response structure:", data);

        return {
          originalText: text,
          correctedText: text,
          mistakes: ["Error: Received an unexpected response format from the AI service."],
          suggestions: [],
          apiError: true,
          errorType: "PARSING_ERROR",
        };
      }

      try {
        // Get the content from the response
        const content = data.choices[0].message.content;
        if (!content) {
          throw new Error("No content in API response");
        }
        console.log("Raw content:", content);

        // Extract and parse the JSON
        const parsedContent: any = extractJSON(content);
        console.log("Parsed content:", parsedContent);
        return {
          originalText: text,
          detectedLanguage: parsedContent.detectedLanguage,
          translatedText: parsedContent.translatedText,
          correctedText: parsedContent.correctedText,
          mistakes: parsedContent.mistakes || [],
          suggestions: parsedContent.suggestions || [],
        };
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        return {
          originalText: text,
          correctedText: text,
          mistakes: ["Error parsing AI response. Please try again."],
          suggestions: ["The AI response format was unexpected. Try speaking more clearly."],
          apiError: true,
          errorType: "PARSING_ERROR",
        };
      }
    } catch (error) {
      console.error(`Error :`, error);
      break;
    }
  }

  // Return a graceful error response
  return {
    originalText: text,
    correctedText: text,
    mistakes: ["Error processing with AI"],
    suggestions: ["Try again later or check your API configuration"],
    apiError: true,
    errorType: "GENERAL_ERROR",
  };
}

const extractJSON = (text: string): string => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  } else {
    throw new Error("Failed to extract JSON from response");
  }
};
