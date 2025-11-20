"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Newspaper, Search, TrendingUp, Globe, Filter, ArrowRight, Zap } from "lucide-react"

export default function NewsHunterPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("trending")
  const supabase = createClient()

  useEffect(() => {
    fetchNews()
  }, [activeTab])

  const fetchNews = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would fetch from an external News API
      // For now, we'll simulate fetching trending news or use stored items
      const response = await fetch(`/api/news/trending?category=${activeTab}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data.articles || [])
      } else {
        // Fallback mock data if API fails or is not configured
        setNews(getMockNews(activeTab))
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setNews(getMockNews(activeTab))
    } finally {
      setLoading(false)
    }
  }

  const handleRewrite = (article: any) => {
    // Redirect to copilot with the article context
    const prompt = `Rewrite this news article: "${article.title}". Source: ${article.url}`
    window.location.href = `/copilot?initialPrompt=${encodeURIComponent(prompt)}`
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Globe className="w-10 h-10 text-green-600" />
            News Hunter
          </h1>
          <p className="text-muted-foreground text-lg">Discover trending global news and rewrite them with AI</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search topics..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="trending" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="politics">Politics</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-64 animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, idx) => (
                <Card key={idx} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-muted relative overflow-hidden">
                    {item.urlToImage ? (
                      <img
                        src={item.urlToImage || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <Newspaper className="w-12 h-12 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 backdrop-blur-sm">
                      {item.source?.name || "Unknown Source"}
                    </Badge>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span>{new Date(item.publishedAt || Date.now()).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        High Viral Potential
                      </span>
                    </div>

                    <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight">{item.title}</h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                      {item.description || "No description available for this news item."}
                    </p>

                    <div className="flex gap-2 mt-auto pt-4 border-t">
                      <Button
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => handleRewrite(item)}
                      >
                        <Zap className="w-4 h-4" />
                        Rewrite with AI
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data generator for fallback
function getMockNews(category: string) {
  const categories: Record<string, any[]> = {
    trending: [
      {
        title: "Global Markets Rally as Inflation Data Shows Cooling Trends",
        description:
          "Major stock indices hit record highs today as the latest consumer price index report indicated inflation is falling faster than expected.",
        source: { name: "Financial Times" },
        urlToImage: "https://images.unsplash.com/photo-1611974765215-e28ed48003b8?w=800&q=80",
        publishedAt: new Date().toISOString(),
        url: "#",
      },
      {
        title: "Breakthrough in Quantum Computing Error Correction Announced",
        description:
          "Researchers have demonstrated a new method for correcting errors in quantum bits, bringing practical quantum computers one step closer.",
        source: { name: "TechCrunch" },
        urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
        publishedAt: new Date().toISOString(),
        url: "#",
      },
      {
        title: "New Sustainable Energy Storage Solution Unveiled",
        description:
          "A startup has revealed a new battery technology based on abundant materials that could revolutionize grid energy storage.",
        source: { name: "Green Energy News" },
        urlToImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
        publishedAt: new Date().toISOString(),
        url: "#",
      },
    ],
    technology: [
      {
        title: "The Next Generation of AI Models: What to Expect",
        description:
          "Leading AI labs are preparing to release their next frontier models. Here's what insiders are saying about their capabilities.",
        source: { name: "The Verge" },
        urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        publishedAt: new Date().toISOString(),
        url: "#",
      },
      {
        title: "Smartphone Sales Rebound in Q3 Driven by Emerging Markets",
        description:
          "Global smartphone shipments grew 5% year-over-year, signaling a recovery in the mobile device market.",
        source: { name: "Reuters" },
        urlToImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        publishedAt: new Date().toISOString(),
        url: "#",
      },
    ],
  }

  return categories[category] || categories["trending"]
}
