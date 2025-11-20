"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Globe, Zap, DollarSign, FileText, Search, Sparkles, BarChart3, Clock, Target } from "lucide-react"

interface DashboardData {
  revenue: {
    total: number
    thisMonth: number
    projected: number
    growth: string
  }
  reach: {
    totalViews: number
    uniqueReaders: number
    countries: number
  }
  efficiency: {
    score: number
    hoursSaved: number
    costPerArticle: string
  }
  performance: {
    roi: string
    viralAccuracy: number
  }
  articles: {
    total: number
    published: number
    drafts: number
  }
  credits: {
    balance: number
    usedToday: number
  }
  plan: string
}

export default function ExecutiveDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics/dashboard")
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-600" />
          <div className="text-lg text-muted-foreground">Loading executive dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* HEADER PREMIUM */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ContentMaster AI</h1>
                <p className="text-sm text-muted-foreground">Global AI Journalism Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Global CDN Active
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  AI Models Online
                </Badge>
                <Badge variant="outline">Processing 247 req/min</Badge>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right">
                  <div className="text-sm font-medium">${data?.credits.balance || 0}</div>
                  <div className="text-xs text-muted-foreground">Credits</div>
                </div>
                <Badge variant="secondary" className="uppercase">
                  {data?.plan || "Free"}
                </Badge>
                <Button size="sm">Upgrade</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* MÉTRICAS DE IMPACTO MUNDIAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue This Month</p>
                <h3 className="text-3xl font-bold">${data?.revenue.thisMonth.toFixed(0) || 0}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {data?.revenue.growth || 0}%
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Projected: ${data?.revenue.projected.toFixed(0) || 0}K
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Global Reach</p>
                <h3 className="text-3xl font-bold">{(data?.reach.totalViews || 0) / 1000}K</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{data?.reach.countries || 0} countries</Badge>
                  <span className="text-sm text-muted-foreground">
                    {data?.reach.uniqueReaders.toLocaleString() || 0} readers
                  </span>
                </div>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">AI Efficiency Score</p>
                <h3 className="text-3xl font-bold">{data?.efficiency.score || 0}%</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{data?.efficiency.hoursSaved || 0} hours saved</Badge>
                  <span className="text-sm text-muted-foreground">
                    Cost: ${data?.efficiency.costPerArticle || 0}/article
                  </span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Content Performance</p>
                <h3 className="text-3xl font-bold">ROI {data?.performance.roi || 0}%</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">Viral accuracy: {data?.performance.viralAccuracy || 0}%</Badge>
                </div>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* AI CONTENT FACTORY */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              AI Content Factory
            </h2>

            <Tabs defaultValue="generate" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="generate">Generate Article</TabsTrigger>
                <TabsTrigger value="hunt">Hunt & Rewrite News</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Creation</TabsTrigger>
                <TabsTrigger value="api">API Integration</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Article Topic / News URL</label>
                    <Input placeholder="Enter topic or paste news URL..." className="text-lg" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">AI Journalist</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select journalist" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ana">Ana Investigativa Pro ($0.35)</SelectItem>
                          <SelectItem value="carlos">Carlos Tech Guru ($0.25)</SelectItem>
                          <SelectItem value="maria">Maria Global News ($0.30)</SelectItem>
                          <SelectItem value="joao">João Viral Content ($0.20)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Audience</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Public</SelectItem>
                          <SelectItem value="tech">Tech Enthusiasts</SelectItem>
                          <SelectItem value="business">Business Professionals</SelectItem>
                          <SelectItem value="youth">Youth & Millennials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button size="lg" className="gap-2">
                      <Search className="w-5 h-5" />
                      Hunt Fresh News ($0.05)
                    </Button>
                    <Button size="lg" variant="default" className="gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Premium Article ($0.25)
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                      <FileText className="w-5 h-5" />
                      Bulk Process ($2.99)
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hunt">
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">News Hunter Interface</h3>
                  <p className="text-muted-foreground mb-4">Discover and rewrite news from 247 global sources</p>
                  <Button onClick={() => (window.location.href = "/dashboard/news-hunter")}>Launch News Hunter</Button>
                </div>
              </TabsContent>

              <TabsContent value="bulk">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Bulk Content Creation</h3>
                  <p className="text-muted-foreground mb-4">Generate hundreds of articles at once</p>
                  <Button>Start Bulk Generation</Button>
                </div>
              </TabsContent>

              <TabsContent value="api">
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">API Integration</h3>
                  <p className="text-muted-foreground mb-4">Integrate ContentMaster into your workflow</p>
                  <Button variant="outline">View API Documentation</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* QUICK STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Articles</h3>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Published</span>
                <span className="font-medium">{data?.articles.published || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Drafts</span>
                <span className="font-medium">{data?.articles.drafts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-medium">{data?.articles.total || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Performance</h3>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. ROI</span>
                <span className="font-medium text-green-600">{data?.performance.roi || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Efficiency</span>
                <span className="font-medium">{data?.efficiency.score || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Viral Accuracy</span>
                <span className="font-medium">{data?.performance.viralAccuracy || 0}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Credits</h3>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-medium">{data?.credits.balance || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Used Today</span>
                <span className="font-medium">{data?.credits.usedToday || 0}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2 bg-transparent">
                Buy More Credits
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
