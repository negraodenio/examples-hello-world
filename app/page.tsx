import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchIcon, TrendingUpIcon, FileTextIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-balance bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ContentMaster AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Automated journalism platform: Find trending news, rewrite with professional journalist styles, and optimize
            for maximum revenue
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <SearchIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg">Real-Time News Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Find viral news opportunities with AI-powered trend analysis and revenue scoring
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <FileTextIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg">Professional Rewriting</h3>
              <p className="text-sm text-muted-foreground">
                Transform content with custom journalist styles - from tech blogger to investigative reporter
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <TrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg">Revenue Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Maximize monetization with SEO optimization, viral scoring, and engagement analytics
              </p>
            </div>
          </Card>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="text-base">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="text-base bg-transparent">
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="text-base">
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">Complete Journalism Automation</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex gap-3">
              <div className="text-2xl">🔍</div>
              <div>
                <h4 className="font-medium mb-1">Discover Trending News</h4>
                <p className="text-sm text-muted-foreground">Real-time news API with viral potential scoring</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">✍️</div>
              <div>
                <h4 className="font-medium mb-1">Custom Writing Styles</h4>
                <p className="text-sm text-muted-foreground">Create and manage journalist personas</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h4 className="font-medium mb-1">AI Copilot Assistant</h4>
                <p className="text-sm text-muted-foreground">Chat interface with function calling</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <h4 className="font-medium mb-1">Analytics Dashboard</h4>
                <p className="text-sm text-muted-foreground">Track performance and revenue metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
