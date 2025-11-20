"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, DollarSign, ExternalLink, Sparkles, Loader } from "lucide-react"
import { toast } from "sonner"

interface NewsArticle {
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  viralScore: number
  revenueScore: number
  trendingPotential: number
  estimatedReach: number
  keywords: string[]
}

export function NewsSearchInterface() {
  const [keywords, setKeywords] = useState("")
  const [niche, setNiche] = useState("")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [topRecommendations, setTopRecommendations] = useState<any[]>([])

  const handleSearch = async () => {
    if (!keywords.trim()) {
      toast.error("Please enter keywords to search")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/news/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords.split(",").map((k) => k.trim()),
          niche,
          limit: 10,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setArticles(data.articles)
        setTopRecommendations(data.topRecommendations || [])
        toast.success(`Found ${data.totalFound} articles!`)
      } else {
        toast.error("Failed to search news")
      }
    } catch (error) {
      toast.error("Error searching news")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    if (score >= 60) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Keywords (comma separated): AI, Technology, Business..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Input
            placeholder="Niche (optional): Tech, Finance, Health..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-64"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading} className="gap-2">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search News
          </Button>
        </div>
      </div>

      {topRecommendations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Top Recommendations
          </h3>
          <div className="grid gap-3">
            {topRecommendations.map((rec, idx) => (
              <Card
                key={idx}
                className="p-4 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-medium">{rec.estimatedReach} reach</span>
                      <span className="text-muted-foreground">{rec.suggestedAngle}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={rec.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Search Results ({articles.length})</h3>
          <div className="grid gap-4">
            {articles.map((article, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{article.source}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium">Viral:</span>
                      <Badge className={getScoreBadge(article.viralScore)} variant="secondary">
                        {article.viralScore.toFixed(0)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium">Revenue:</span>
                      <Badge className={getScoreBadge(article.revenueScore)} variant="secondary">
                        {article.revenueScore.toFixed(0)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium">Trending:</span>
                      <Badge variant="outline">{article.trendingPotential.toFixed(1)}/10</Badge>
                    </div>

                    <div className="ml-auto text-xs text-muted-foreground">
                      {(article.estimatedReach / 1000).toFixed(0)}K reach
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {article.keywords.map((keyword, kidx) => (
                      <Badge key={kidx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!loading && articles.length === 0 && keywords && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No articles found. Try different keywords.</p>
        </div>
      )}
    </div>
  )
}
