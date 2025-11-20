"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText, Zap, BarChart3, Edit3, Share2, Newspaper, ArrowRight, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        redirect("/auth/login")
      }
      setUser(user)
      setLoading(false)
    }

    checkAuth()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Sparkles className="w-12 h-12 animate-pulse text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
            Welcome back, {user.email?.split("@")[0]}
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            ContentMaster Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your intelligent copilot for journalism automation and content optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  AI Powered
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-3">SEO Automation Hub</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Generate SEO-optimized articles in 30 seconds, manage multi-client projects, AutoBlog from RSS/YouTube,
                and deploy to any CMS.
              </p>
              <Button className="w-full group/btn" size="lg" onClick={() => (window.location.href = "/dashboard/seo")}>
                Open SEO Hub
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Newspaper className="w-8 h-8 text-purple-600" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Professional
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-3">Digital Newspaper Generator</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Create professional multi-page newspapers with AI-powered journalism and editorial quality control.
              </p>
              <Button
                className="w-full group/btn bg-transparent"
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = "/dashboard/newspapers")}
              >
                Create Newspaper
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Copilot</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Interactive
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Interactive AI assistant for content strategy and optimization
            </p>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/copilot")}
            >
              Launch Copilot
              <ArrowRight className="ml-auto w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Edit3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Writing Styles</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Personas
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Create and manage journalist personas and writing styles
            </p>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/dashboard/styles")}
            >
              Manage Styles
              <ArrowRight className="ml-auto w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">News Hunter</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Global
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Discover and rewrite trending news from global sources
            </p>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/dashboard/news")}
            >
              Open News Hunter
              <ArrowRight className="ml-auto w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Analytics</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Insights
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Track performance, revenue, and engagement metrics
            </p>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/dashboard/executive")}
            >
              View Analytics
              <ArrowRight className="ml-auto w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Integrations</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Connect
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Connect social media and CMS platforms</p>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => (window.location.href = "/dashboard/integrations")}
            >
              Manage Integrations
              <ArrowRight className="ml-auto w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Documentation</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Learn
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Complete guides and feature documentation
            </p>
            <Button variant="ghost" className="w-full justify-start">
              View Docs
              <ArrowRight className="ml-auto w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
