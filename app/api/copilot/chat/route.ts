import { streamText, tool } from "ai"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const maxDuration = 30

const newsHunterTool = tool({
  description: "Search for latest news and trends in specified topics. Returns recent articles and updates.",
  parameters: z.object({
    topic: z.string().describe("Topic to search for news"),
    limit: z.number().default(5).describe("Number of results to return"),
  }),
  execute: async ({ topic, limit }) => {
    // Simulate news search with realistic data
    const mockNews = [
      {
        title: `Breaking: ${topic} Market Surges`,
        summary: "Latest developments show positive trends",
        date: new Date().toISOString(),
      },
      {
        title: `Analysis: The Future of ${topic}`,
        summary: "Expert insights on upcoming changes",
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        title: `${topic} Innovation Announced`,
        summary: "New breakthrough could change the industry",
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    return {
      results: mockNews.slice(0, limit),
      count: Math.min(limit, mockNews.length),
      topic,
      searchedAt: new Date().toISOString(),
    }
  },
})

const revenueIntelligenceTool = tool({
  description: "Analyze revenue trends and provide business intelligence insights",
  parameters: z.object({
    period: z.string().describe("Time period to analyze (e.g., 'Q1 2024', 'monthly', 'yearly')"),
    metric: z.string().describe("Metric to analyze (e.g., 'revenue', 'profit', 'growth rate')"),
  }),
  execute: async ({ period, metric }) => {
    const growthRate = Math.random() * 20 + 5 // 5-25% growth
    const trend = growthRate > 15 ? "strong upward" : "moderate upward"

    return {
      period,
      metric,
      currentValue: `$${(Math.random() * 500000 + 100000).toFixed(2)}`,
      growthRate: `${growthRate.toFixed(1)}%`,
      trend,
      analysis: `${metric} shows ${trend} trend for ${period}`,
      recommendation:
        growthRate > 15 ? "Consider scaling operations" : "Maintain current strategy with minor optimizations",
      confidence: 0.85,
    }
  },
})

const contentOptimizerTool = tool({
  description: "Optimize content for better engagement, SEO, and conversion rates",
  parameters: z.object({
    content: z.string().describe("Content to optimize"),
    type: z.enum(["blog", "social", "email"]).describe("Type of content"),
  }),
  execute: async ({ content, type }) => {
    const suggestions = {
      blog: [
        "Add more H2/H3 headings",
        "Include internal links",
        "Add meta description",
        "Optimize for target keyword",
      ],
      social: ["Add hashtags", "Include call-to-action", "Shorten text for mobile", "Add emojis strategically"],
      email: ["Personalize subject line", "Add clear CTA button", "Optimize preheader text", "A/B test variations"],
    }

    const score = Math.random() * 3 + 7 // Score between 7-10

    return {
      originalLength: content.length,
      type,
      suggestions: suggestions[type],
      score: Number.parseFloat(score.toFixed(1)),
      estimatedImprovement: `+${(Math.random() * 30 + 10).toFixed(0)}% engagement`,
      optimizationTips: `Focus on ${type === "blog" ? "SEO keywords" : type === "social" ? "engagement" : "conversion"}`,
    }
  },
})

const tools = {
  newsHunter: newsHunterTool,
  revenueIntelligence: revenueIntelligenceTool,
  contentOptimizer: contentOptimizerTool,
}

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Save user message to database
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === "user") {
      await supabase.from("messages").insert({
        conversation_id: conversationId || null,
        user_id: user.id,
        role: "user",
        content: lastMessage.content,
      })
    }
  }

  const result = streamText({
    model: "groq/mixtral-8x7b-32768",
    system: `You are ContentMaster AI, an intelligent copilot for content optimization, business intelligence, and revenue insights. 
    
    You have access to three powerful tools:
    - newsHunter: Search for latest news and trends
    - revenueIntelligence: Analyze revenue trends and metrics
    - contentOptimizer: Optimize content for engagement and SEO
    
    Use these tools proactively when users ask about news, revenue analysis, or content optimization.
    Be concise, actionable, and data-driven in your responses.`,
    messages,
    tools,
    maxSteps: 5,
  })

  return result.toUIMessageStreamResponse()
}
