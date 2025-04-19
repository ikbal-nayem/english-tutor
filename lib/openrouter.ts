const OR_TOKEN = process.env.OR_TOKEN;
const LLM = process.env.LLM || "google/gemma-3-4b-it:free"; // Default to a smaller model if LLM not set

if (!OR_TOKEN) {
  throw new Error("OpenRouter API token is not configured");
}
const tokens = OR_TOKEN.split(",").map((token) => token.trim());

export const tokenLength = tokens.length;
export let tokenIndex = 0;

export const setNextTokenIndex = () => {
  console.log(`Token ${tokenIndex + 1} limit exceeded, trying next token...`);
  tokenIndex = (tokenIndex + 1) % tokenLength;
};

export const getLLMResponse = async (messages: any, response_format?: Record<string, string>): Promise<Response> => {
  console.log(`Trying token ${tokenIndex + 1}/${tokenLength}...`);

  if (tokens.length === 0) {
    throw new Error("No valid OpenRouter API tokens found");
  }
  const currentToken = tokens[tokenIndex];

  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentToken}`,
      // "HTTP-Referer": "https://vercel.com",
      "X-Title": "English Speaking Skills Improvement App",
    },
    body: JSON.stringify({
      model: LLM,
      messages: messages,
      response_format: response_format,
    }),
  });
};
