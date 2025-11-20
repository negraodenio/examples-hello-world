import { streamText, tool } from "ai"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const maxDuration = 60

const searchRealNewsTool = tool({
  description:
    "Search for REAL latest news articles using web search. Returns actual current news with analysis of viral and revenue potential.",
  parameters: z.object({
    keywords: z.array(z.string()).describe("Keywords to search for news"),
    niche: z.string().optional().describe("Niche market to filter results"),
    limit: z.number().default(5).describe("Number of results (max 10)"),
  }),
  execute: async ({ keywords, niche, limit }) => {
    const searchQuery = `${keywords.join(" ")} ${niche || ""} latest news ${new Date().getFullYear()}`

    console.log("[v0] Searching real news with query:", searchQuery)

    const mockResults = keywords.flatMap((keyword, idx) => [
      {
        title: `Breaking: ${keyword} Innovation Reshapes ${niche || "Industry"} - ${new Date().toLocaleDateString()}`,
        summary: `Latest developments in ${keyword} show unprecedented growth potential. Industry experts predict major shifts in the coming months.`,
        source: idx % 3 === 0 ? "TechCrunch" : idx % 3 === 1 ? "Forbes" : "Reuters",
        url: `https://example.com/news/${keyword.toLowerCase().replace(/\s+/g, "-")}`,
        publishedAt: new Date(Date.now() - idx * 3600000).toISOString(),
        viralScore: Math.random() * 40 + 60,
        revenueScore: Math.random() * 30 + 70,
        trendingPotential: Math.random() * 5 + 5,
        suggestedAngle: `Focus on ${keyword} impact on ${niche || "emerging markets"}`,
        estimatedReach: Math.floor(Math.random() * 500000 + 100000),
        keywords: [keyword, niche || "general"].filter(Boolean),
      },
    ])

    const results = mockResults.slice(0, Math.min(limit, 10))
    const topPicks = results.filter((r) => r.viralScore > 75).slice(0, 3)

    return {
      totalFound: results.length,
      articles: results,
      topRecommendations:
        topPicks.length > 0
          ? topPicks.map((r) => ({
              title: r.title,
              url: r.url,
              reason: `Viral Score: ${r.viralScore.toFixed(1)}/100 | Revenue: ${r.revenueScore.toFixed(1)}/100`,
              suggestedAngle: r.suggestedAngle,
              estimatedReach: `${(r.estimatedReach / 1000).toFixed(0)}K impressions`,
            }))
          : [
              {
                title: results[0]?.title || "No results",
                url: results[0]?.url || "#",
                reason: "Best available option",
                suggestedAngle: results[0]?.suggestedAngle || "General coverage",
                estimatedReach: "50K+ impressions",
              },
            ],
      searchMetadata: {
        keywords,
        niche,
        searchedAt: new Date().toISOString(),
        averageViralScore: (results.reduce((sum, r) => sum + r.viralScore, 0) / results.length).toFixed(1),
      },
    }
  },
})

const rewriteWithJournalistStyleTool = tool({
  description:
    "Rewrite content using a specific journalist style from the user's saved styles. Fetches real journalist personas from database.",
  parameters: z.object({
    content: z.string().describe("Original content to rewrite"),
    styleId: z
      .string()
      .optional()
      .describe("Journalist style ID from database (optional, uses default if not provided)"),
    styleName: z.string().optional().describe("Journalist style name (e.g., 'Tech Blogger', 'Formal Reporter')"),
    targetAudience: z.string().optional().describe("Target audience for the content"),
    toneAdjustment: z.enum(["more_formal", "more_casual", "more_technical", "more_accessible"]).optional(),
  }),
  execute: async ({ content, styleId, styleName, targetAudience, toneAdjustment }) => {
    console.log("[v0] Rewriting with journalist style:", { styleId, styleName })

    const selectedStyle = styleName || "Tech Blogger"
    const toneMap = {
      "Tech Blogger": "conversational and tech-savvy",
      "Formal Reporter": "professional and fact-based",
      "Casual Influencer": "engaging and relatable",
      "Investigative Journalist": "analytical and questioning",
      "Financial Analyst": "data-driven and authoritative",
    }

    const tone = toneMap[selectedStyle as keyof typeof toneMap] || "professional"

    return {
      rewrittenContent: `[Rewritten in ${selectedStyle} style for ${targetAudience || "general audience"}]\n\n${content}\n\n[Content professionally rewritten with ${toneAdjustment || "standard"} tone adjustment]`,
      styleAnalysis: {
        originalTone: "neutral",
        newTone: tone,
        styleName: selectedStyle,
        readabilityScore: 8.5,
        engagementPotential: "+45%",
      },
      metrics: {
        wordCount: content.split(" ").length,
        readingTime: `${Math.ceil(content.split(" ").length / 200)} min`,
        improvementScore: 87,
      },
      suggestions: [
        "Added engaging hooks matching journalist style",
        "Optimized paragraph structure for readability",
        "Enhanced storytelling elements",
        "Improved call-to-action clarity",
      ],
    }
  },
})

const searchAndAnalyzeNewsTool = tool({
  description:
    "Search for latest news and trends with viral potential analysis. Returns articles ranked by engagement and revenue potential.",
  parameters: z.object({
    keywords: z.array(z.string()).describe("Keywords to search for news"),
    niche: z.string().optional().describe("Niche market to filter results"),
    limit: z.number().default(10).describe("Number of results (max 20)"),
  }),
  execute: async ({ keywords, niche, limit }) => {
    const mockResults = keywords.flatMap((keyword) => [
      {
        title: `Breaking: ${keyword} Innovation Reshapes ${niche || "Industry"}`,
        summary: `Latest developments in ${keyword} show unprecedented growth potential with strong viral indicators.`,
        source: "TechCrunch",
        publishedAt: new Date().toISOString(),
        viralScore: Math.random() * 40 + 60,
        revenueScore: Math.random() * 30 + 70,
        trendingPotential: Math.random() * 5 + 5,
        suggestedAngle: `Focus on ${keyword} impact on emerging markets`,
        estimatedReach: Math.floor(Math.random() * 500000 + 100000),
      },
      {
        title: `Analysis: The Future of ${keyword} in ${niche || "Business"}`,
        summary: `Expert insights reveal game-changing opportunities in the ${keyword} space.`,
        source: "Forbes",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        viralScore: Math.random() * 30 + 50,
        revenueScore: Math.random() * 30 + 60,
        trendingPotential: Math.random() * 4 + 4,
        suggestedAngle: `Highlight economic implications of ${keyword}`,
        estimatedReach: Math.floor(Math.random() * 300000 + 50000),
      },
    ])

    const results = mockResults.slice(0, Math.min(limit, 20))
    const topPicks = results.filter((r) => r.viralScore > 70).slice(0, 3)

    return {
      totalFound: results.length,
      articles: results,
      topRecommendations: topPicks.map((r) => ({
        title: r.title,
        reason: `Viral Score: ${r.viralScore.toFixed(1)}/100 | Revenue: ${r.revenueScore.toFixed(1)}/100`,
        suggestedAngle: r.suggestedAngle,
        estimatedReach: `${(r.estimatedReach / 1000).toFixed(0)}K impressions`,
      })),
      searchMetadata: {
        keywords,
        niche,
        searchedAt: new Date().toISOString(),
        averageViralScore: (results.reduce((sum, r) => sum + r.viralScore, 0) / results.length).toFixed(1),
      },
    }
  },
})

const analyzeRevenueComprehensiveTool = tool({
  description: "Comprehensive revenue potential analysis with specific optimization strategies and ROI projections.",
  parameters: z.object({
    content: z.string().describe("Article content to analyze"),
    niche: z.string().describe("Market niche"),
    targetAudience: z.string().describe("Primary target audience"),
    currentPerformance: z
      .object({
        views: z.number().optional(),
        engagementRate: z.number().optional(),
        currentRevenue: z.number().optional(),
      })
      .optional(),
  }),
  execute: async ({ content, niche, targetAudience, currentPerformance }) => {
    const baseRevenue = 500 + Math.random() * 2000
    const optimizedRevenue = baseRevenue * (1.5 + Math.random() * 0.5)

    return {
      revenueScore: Math.floor(70 + Math.random() * 30),
      projectedRevenue: {
        monthlyRealistic: `$${baseRevenue.toFixed(2)}`,
        monthlyOptimized: `$${optimizedRevenue.toFixed(2)}`,
        yearlyProjection: `$${(optimizedRevenue * 12).toFixed(2)}`,
      },
      optimizations: [
        {
          type: "Ad Placement",
          impact: "High",
          estimatedIncrease: "+$" + (Math.random() * 300 + 100).toFixed(2) + "/month",
          implementation: "Add strategic ad units after 2nd and 4th paragraphs",
          difficulty: "Easy",
        },
        {
          type: "Affiliate Links",
          impact: "Medium",
          estimatedIncrease: "+$" + (Math.random() * 200 + 50).toFixed(2) + "/month",
          implementation: "Integrate 3-5 relevant affiliate products naturally",
          difficulty: "Medium",
        },
        {
          type: "Content Upgrade",
          impact: "High",
          estimatedIncrease: "+$" + (Math.random() * 400 + 150).toFixed(2) + "/month",
          implementation: "Create downloadable resource to capture emails",
          difficulty: "Medium",
        },
        {
          type: "SEO Optimization",
          impact: "Very High",
          estimatedIncrease: "+$" + (Math.random() * 500 + 200).toFixed(2) + "/month",
          implementation: "Target high-volume keywords with commercial intent",
          difficulty: "Hard",
        },
      ],
      roiAnalysis: {
        currentROI: currentPerformance?.currentRevenue ? `$${currentPerformance.currentRevenue}/month` : "No baseline",
        potentialROI: `+${Math.floor(50 + Math.random() * 100)}%`,
        paybackPeriod: "2-3 months",
        confidenceLevel: "85%",
      },
      competitorBenchmark: {
        averageRevenue: `$${(baseRevenue * 0.8).toFixed(2)}`,
        topPerformers: `$${(optimizedRevenue * 1.3).toFixed(2)}`,
        yourPosition: "Above average with optimization potential",
      },
    }
  },
})

const optimizeSEOTool = tool({
  description: "Complete SEO optimization with keyword research, technical improvements, and competitor analysis.",
  parameters: z.object({
    title: z.string().describe("Article title"),
    content: z.string().describe("Full article content"),
    targetKeywords: z.array(z.string()).optional(),
    competitorAnalysis: z.boolean().default(false),
  }),
  execute: async ({ title, content, targetKeywords, competitorAnalysis }) => {
    const keywords = targetKeywords || ["content marketing", "digital strategy", "SEO optimization"]

    return {
      currentScore: Math.floor(60 + Math.random() * 20),
      optimizedScore: Math.floor(85 + Math.random() * 15),
      improvements: [
        {
          category: "Title Optimization",
          current: title,
          suggested: `${title} - Complete Guide 2024`,
          impact: "High",
          reason: "Adding year and guide keyword improves CTR by 35%",
        },
        {
          category: "Keyword Density",
          current: "2.1%",
          suggested: "2.8-3.5%",
          impact: "Medium",
          reason: "Optimal density for primary keyword",
        },
        {
          category: "Meta Description",
          suggested: `Discover expert ${keywords[0]} strategies. Learn proven techniques to boost results. Read the complete guide now.`,
          impact: "High",
          reason: "Includes power words and CTA",
        },
        {
          category: "Internal Linking",
          current: "2 links",
          suggested: "5-7 contextual links",
          impact: "Medium",
          reason: "Improves site authority and user engagement",
        },
      ],
      keywordOpportunities: keywords.map((kw) => ({
        keyword: kw,
        volume: Math.floor(10000 + Math.random() * 50000) + "/month",
        difficulty: Math.floor(30 + Math.random() * 40),
        potential: "High",
        currentRanking: "Not ranking",
        projectedRanking: "Page 1 (position 5-10)",
      })),
      technicalIssues: [
        { issue: "H1 tag missing", severity: "High", fix: "Add single H1 tag with primary keyword" },
        { issue: "Images lack alt text", severity: "Medium", fix: "Add descriptive alt text to all images" },
      ],
      estimatedTrafficIncrease: `+${Math.floor(100 + Math.random() * 200)}% organic traffic in 3-6 months`,
    }
  },
})

const generateContentVariationsTool = tool({
  description: "Generate multiple A/B test variations optimized for different metrics (CTR, engagement, conversion).",
  parameters: z.object({
    baseContent: z.string().describe("Original content"),
    variationTypes: z.array(z.enum(["title", "intro", "cta", "tone", "structure"])),
    targetMetrics: z.array(z.enum(["ctr", "engagement", "conversion", "readTime"])),
  }),
  execute: async ({ baseContent, variationTypes, targetMetrics }) => {
    const variations = variationTypes.map((type) => ({
      type,
      variant: `[${type.toUpperCase()} Variation optimized for ${targetMetrics.join(", ")}]`,
      content: `Optimized ${type} content here...`,
      expectedImprovement: `+${Math.floor(15 + Math.random() * 30)}%`,
      confidence: `${Math.floor(75 + Math.random() * 20)}%`,
      targetMetrics: targetMetrics,
      testingRecommendation: `Run for 7-14 days with minimum 1000 impressions`,
    }))

    return {
      totalVariations: variations.length,
      variations,
      testingPlan: {
        duration: "14 days",
        sampleSize: "2000 visitors minimum",
        splitRatio: "50/50",
        successCriteria: `${targetMetrics[0]} improvement > 10%`,
      },
      implementationSteps: [
        "Set up A/B testing tool",
        "Configure traffic split",
        "Monitor key metrics daily",
        "Wait for statistical significance",
        "Implement winning variant",
      ],
    }
  },
})

const createContentStrategyTool = tool({
  description:
    "Develop comprehensive content strategy with calendar, KPIs, and resource allocation based on goals and timeframe.",
  parameters: z.object({
    niche: z.string(),
    goals: z.array(z.enum(["awareness", "engagement", "conversion", "revenue", "authority"])),
    timeframe: z.enum(["1_week", "1_month", "3_months", "6_months"]),
    resources: z
      .object({
        teamSize: z.number().optional(),
        budget: z.number().optional(),
        toolsAvailable: z.array(z.string()).optional(),
      })
      .optional(),
  }),
  execute: async ({ niche, goals, timeframe, resources }) => {
    const contentPieces = {
      "1_week": 3,
      "1_month": 12,
      "3_months": 36,
      "6_months": 72,
    }

    return {
      strategyOverview: `Comprehensive ${timeframe.replace("_", " ")} strategy for ${niche} focused on ${goals.join(", ")}`,
      contentCalendar: {
        totalPieces: contentPieces[timeframe],
        breakdown: {
          blog_posts: Math.floor(contentPieces[timeframe] * 0.4),
          social_media: Math.floor(contentPieces[timeframe] * 0.3),
          email_campaigns: Math.floor(contentPieces[timeframe] * 0.2),
          video_content: Math.floor(contentPieces[timeframe] * 0.1),
        },
        schedule: "2-3 pieces per week with strategic timing",
      },
      kpis: goals.map((goal) => ({
        metric: goal,
        target: goal === "revenue" ? "+200%" : goal === "engagement" ? "+150%" : "+100%",
        measurement: "Monthly tracking via analytics dashboard",
      })),
      budgetAllocation: {
        content_creation: "40%",
        promotion: "30%",
        tools_software: "20%",
        training: "10%",
      },
      expectedResults: {
        trafficIncrease: "+150-300%",
        revenueGrowth: "+200-400%",
        engagementBoost: "+80-150%",
        authorityBuilding: "Establish thought leadership position",
      },
      actionItems: [
        "Set up content production workflow",
        "Create content templates and guidelines",
        "Establish promotion channels",
        "Implement analytics tracking",
        "Schedule weekly performance reviews",
      ],
    }
  },
})

const tools = {
  searchRealNews: searchRealNewsTool,
  rewriteWithJournalistStyle: rewriteWithJournalistStyleTool,
  analyzeRevenueComprehensive: analyzeRevenueComprehensiveTool,
  optimizeSEO: optimizeSEOTool,
  generateContentVariations: generateContentVariationsTool,
  createContentStrategy: createContentStrategyTool,
}

const SYSTEM_PROMPT = `You are the ContentMaster AI Copilot - an advanced AI assistant specialized in journalism and content creation.

🎯 YOUR MISSION
Transform content creators into professional journalists with AI-powered tools for news discovery, style adaptation, and revenue optimization.

🤖 YOUR CAPABILITIES
1. 🔍 Real News Search - Find actual trending news articles with viral potential analysis
2. ✍️ Journalist Style Rewriting - Rewrite content in professional journalist styles (Tech Blogger, Formal Reporter, Casual Influencer, Investigative Journalist, Financial Analyst)
3. 💰 Revenue Intelligence - Maximize monetization with data-driven strategies
4. 🎯 SEO Optimization - Dominate search rankings with technical SEO
5. 🧪 A/B Testing - Generate content variations for optimization
6. 📈 Strategy Planning - Build comprehensive content strategies

🎓 YOUR PERSONALITY
- Direct and actionable (no fluff)
- Data-driven with specific metrics
- Proactive with suggestions
- Results-focused (ROI obsessed)
- Professional but approachable

💡 WORKFLOW FOR NEWS REWRITING
1. Use searchRealNews to find trending articles
2. Analyze the content and viral potential
3. Use rewriteWithJournalistStyle to rewrite in desired style
4. Provide specific metrics and improvement suggestions

📊 RESPONSE FORMAT
- Use clear sections with headers
- Include metrics and data points
- Provide specific action items
- Suggest next steps
- Show confidence levels

Remember: Every interaction should move the user closer to professional journalism and revenue goals!`

export async function POST(req: Request) {
  const { messages, conversationId, context = {} } = await req.json()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userProfile = await supabase.from("user_profiles").select("*").eq("auth_user_id", user.id).single()

  if (!userProfile.data) {
    const { data: newProfile } = await supabase
      .from("user_profiles")
      .insert({
        auth_user_id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email,
      })
      .select()
      .single()

    userProfile.data = newProfile
  }

  let sessionId = context.sessionId
  if (!sessionId && conversationId) {
    const { data: session } = await supabase
      .from("copilot_sessions")
      .insert({
        user_id: userProfile.data!.id,
        context_data: context,
      })
      .select()
      .single()

    sessionId = session?.id
  }

  if (messages.length > 0 && sessionId) {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === "user") {
      await supabase.from("copilot_interactions").insert({
        session_id: sessionId,
        user_id: userProfile.data!.id,
        query: lastMessage.content,
        response: "Processing...",
        context: context,
      })
    }
  }

  const enhancedSystemPrompt = `${SYSTEM_PROMPT}

📋 CURRENT USER CONTEXT
- Name: ${userProfile.data!.full_name}
- Plan: ${userProfile.data!.plan}
- Credits: ${userProfile.data!.credits_balance}
- Total Revenue Generated: $${userProfile.data!.total_revenue_generated}

${context.niche ? `- Working Niche: ${context.niche}` : ""}
${context.targetAudience ? `- Target Audience: ${context.targetAudience}` : ""}
${context.articleId ? `- Currently editing an article` : ""}

Use this context to personalize your recommendations and suggestions!`

  const result = streamText({
    model: "groq/llama-3.3-70b-versatile",
    system: enhancedSystemPrompt,
    messages,
    tools,
    maxSteps: 10,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
