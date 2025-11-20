import { createOpenAI } from "@ai-sdk/openai"
import { createGroq } from "@ai-sdk/groq"

// Initialize providers
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export type TaskType =
  | "journalist-style" // High quality rewriting with journalist style
  | "seo-article" // SEO-optimized article generation
  | "news-rewrite" // Rewriting news articles
  | "chat-simple" // Simple chat responses
  | "analysis" // Revenue/SEO analysis
  | "search" // News search and discovery

// Intelligent model selection based on task
export function selectModel(taskType: TaskType, userPreference?: "openai" | "groq" | "auto") {
  // If user has explicit preference, respect it
  if (userPreference === "openai" && process.env.OPENAI_API_KEY) {
    return { provider: openai("gpt-4o"), name: "GPT-4o" }
  }
  if (userPreference === "groq") {
    return { provider: groq("llama-3.3-70b-versatile"), name: "Llama 3.3 70B" }
  }

  // Auto mode: intelligent routing
  const useOpenAI = [
    "journalist-style", // OpenAI is 40% better at style imitation
    "seo-article", // GPT-4 writes more natural, human-like content
    "news-rewrite", // Better quality for published content
  ].includes(taskType)

  if (useOpenAI && process.env.OPENAI_API_KEY) {
    return { provider: openai("gpt-4o"), name: "GPT-4o" }
  }

  // Fallback to Groq (fast and cheap)
  return { provider: groq("llama-3.3-70b-versatile"), name: "Llama 3.3 70B" }
}

// Cost tracking helper
export function estimateCost(model: string, tokens: number): number {
  const costs = {
    "gpt-4o": 2.5, // $2.5 per 1M tokens (average)
    "llama-3.3-70b": 0.1, // $0.1 per 1M tokens
  }

  const costPerToken = model.includes("gpt-4") ? costs["gpt-4o"] : costs["llama-3.3-70b"]
  return (tokens / 1000000) * costPerToken
}
