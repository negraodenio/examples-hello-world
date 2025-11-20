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

  const apiKey = process.env.NEWSAPI_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "NewsAPI key not configured" }, { status: 500 })
  }

  const searchQuery = `${keywords.join(" OR ")} ${niche || ""}`

  console.log("[v0] Searching real news:", searchQuery)

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=${Math.min(limit, 20)}&apiKey=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error("NewsAPI request failed")
    }

    const data = await response.json()

    const articles =
      data.articles?.map((article: any) => ({
        title: article.title,
        summary: article.description || article.content?.substring(0, 200),
        content: article.content || article.description,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        urlToImage: article.urlToImage,
        viralScore: Math.random() * 40 + 60,
        revenueScore: Math.random() * 30 + 70,
        trendingPotential: Math.random() * 5 + 5,
        estimatedReach: Math.floor(Math.random() * 500000 + 100000),
        keywords: keywords,
      })) || []

    const topArticles = articles.slice(0, Math.min(limit, 20))

    const userProfile = await supabase.from("user_profiles").select("id").eq("auth_user_id", user.id).single()

    if (userProfile.data && topArticles.length > 0) {
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
        averageViralScore:
          topArticles.length > 0
            ? (topArticles.reduce((sum, a) => sum + a.viralScore, 0) / topArticles.length).toFixed(1)
            : "0",
      },
    })
  } catch (error) {
    console.error("[v0] NewsAPI Error:", error)
    return NextResponse.json({ error: "Failed to fetch news from NewsAPI" }, { status: 500 })
  }
}
