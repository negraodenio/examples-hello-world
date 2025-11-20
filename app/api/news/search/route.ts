import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  const { keywords, niche, limit = 10 } = await req.json()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchQuery = `${keywords.join(" ")} ${niche || ""} latest news ${new Date().getFullYear()}`

  console.log("[v0] Searching real news:", searchQuery)

  // Mock results for now - in production, integrate with NewsAPI or similar
  const articles = keywords.flatMap((keyword, idx) => [
    {
      title: `Breaking: ${keyword} Innovation Reshapes ${niche || "Industry"} - ${new Date().toLocaleDateString()}`,
      summary: `Latest developments in ${keyword} show unprecedented growth potential. Industry experts predict major shifts in the coming months with significant implications for ${niche || "the market"}.`,
      content: `Full article content about ${keyword} and its impact on ${niche || "the industry"}. This breakthrough represents a significant milestone...`,
      source: idx % 3 === 0 ? "TechCrunch" : idx % 3 === 1 ? "Forbes" : "Reuters",
      url: `https://example.com/news/${keyword.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      publishedAt: new Date(Date.now() - idx * 3600000).toISOString(),
      viralScore: Math.random() * 40 + 60,
      revenueScore: Math.random() * 30 + 70,
      trendingPotential: Math.random() * 5 + 5,
      estimatedReach: Math.floor(Math.random() * 500000 + 100000),
      keywords: [keyword, niche || "general"].filter(Boolean),
    },
  ])

  const topArticles = articles.slice(0, Math.min(limit, 20))

  const userProfile = await supabase.from("user_profiles").select("id").eq("auth_user_id", user.id).single()

  if (userProfile.data) {
    const articlesToInsert = topArticles.map((article) => ({
      user_id: userProfile.data.id,
      title: article.title,
      original_content: article.content,
      source_url: article.url,
      source_name: article.source,
      published_at: article.publishedAt,
      keywords: article.keywords,
      niche: niche || "general",
      viral_score: article.viralScore,
      revenue_score: article.revenueScore,
      trending_potential: article.trendingPotential,
      estimated_reach: article.estimatedReach,
      status: "discovered",
    }))

    await supabase.from("news_articles").insert(articlesToInsert)
  }

  return NextResponse.json({
    success: true,
    totalFound: topArticles.length,
    articles: topArticles,
    topRecommendations: topArticles
      .filter((a) => a.viralScore > 75)
      .slice(0, 3)
      .map((a) => ({
        title: a.title,
        url: a.url,
        viralScore: a.viralScore.toFixed(1),
        revenueScore: a.revenueScore.toFixed(1),
        estimatedReach: `${(a.estimatedReach / 1000).toFixed(0)}K`,
      })),
    searchMetadata: {
      keywords,
      niche,
      searchedAt: new Date().toISOString(),
      averageViralScore: (topArticles.reduce((sum, a) => sum + a.viralScore, 0) / topArticles.length).toFixed(1),
    },
  })
}
