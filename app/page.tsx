import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchIcon, TrendingUpIcon, FileTextIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-balance">ContentMaster AI Copilot</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Your intelligent assistant for content optimization, revenue insights, and business intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <SearchIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">NewsHunter</h3>
              <p className="text-sm text-muted-foreground">
                Stay updated with latest trends and breaking news in your industry
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-full">
                <TrendingUpIcon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">Revenue Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Track and analyze revenue patterns with AI-powered insights
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-accent/10 rounded-full">
                <FileTextIcon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Content Optimizer</h3>
              <p className="text-sm text-muted-foreground">
                Improve engagement and SEO with intelligent content suggestions
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
        </div>
      </div>
    </div>
  )
}
