"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText, Zap, BarChart3 } from "lucide-react"

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
        <Sparkles className="w-12 h-12 animate-pulse text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Card className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Executive Dashboard</h2>
              <p className="text-blue-100 text-lg mb-4">
                View your global metrics, revenue analytics, and AI efficiency scores
              </p>
              <Button size="lg" variant="secondary" onClick={() => (window.location.href = "/dashboard/executive")}>
                Open Executive Dashboard
              </Button>
            </div>
            <BarChart3 className="w-24 h-24 opacity-20" />
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ContentMaster Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Complete journalism automation & SEO platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold mb-2">SEO Automation Hub</h3>
              <p className="text-muted-foreground mb-4">
                Generate SEO-optimized articles in 30 seconds, manage multi-client projects, AutoBlog from RSS/YouTube,
                and deploy to any CMS.
              </p>
              <Button onClick={() => (window.location.href = "/dashboard/seo")}>Open SEO Hub</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            <FileText className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Digital Newspaper Generator</h3>
              <p className="text-muted-foreground mb-4">
                Create professional multi-page newspapers with AI-powered journalism and editorial quality control.
              </p>
              <Button onClick={() => (window.location.href = "/dashboard/newspapers")} variant="outline">
                Create Newspaper
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <Zap className="w-8 h-8 text-yellow-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI Copilot</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Interactive AI assistant for content strategy and optimization
          </p>
          <Button variant="outline" onClick={() => (window.location.href = "/copilot")}>
            Launch Copilot
          </Button>
        </Card>

        <Card className="p-6">
          <FileText className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">News Hunter</h3>
          <p className="text-sm text-muted-foreground mb-4">Discover and rewrite trending news from global sources</p>
          <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
            Coming Soon
          </Button>
        </Card>

        <Card className="p-6">
          <BarChart3 className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">Track performance, revenue, and engagement metrics</p>
          <Button variant="outline" onClick={() => (window.location.href = "/dashboard/executive")}>
            View Analytics
          </Button>
        </Card>
      </div>
    </div>
  )
}
