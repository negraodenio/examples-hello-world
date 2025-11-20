import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "general"

  try {
    const apiKey = process.env.NEWSAPI_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "NewsAPI key not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error("NewsAPI request failed")
    }

    const data = await response.json()

    const articles = data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
      content: article.content,
      category,
    }))

    return NextResponse.json({
      status: "success",
      articles: articles || [],
      totalResults: data.totalResults,
    })
  } catch (error) {
    console.error("[v0] NewsAPI Error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
