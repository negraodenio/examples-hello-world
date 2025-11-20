import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  SparklesIcon,
  TrendingUpIcon,
  PenToolIcon,
  BrainCircuitIcon,
  ImageIcon,
  VideoIcon,
  LinkIcon,
  ListIcon,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap text-sm">
          <span className="font-semibold">{"LIMITED TIME OFFER"}</span>
          <div className="flex items-center gap-2">
            <span>Get Started Today</span>
            <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold px-3">FREE TRIAL</Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">ContentMaster</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#features" className="hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#solutions" className="hover:text-primary transition-colors">
                Solutions
              </Link>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-background to-blue-50/30 dark:from-purple-950/20 dark:via-background dark:to-blue-950/10" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-balance leading-tight">
              Rank on <span className="text-primary">Google</span> and get cited on{" "}
              <span className="text-primary">ChatGPT</span>{" "}
              <span className="italic text-muted-foreground">– without manual work</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Generate and auto-publish ready-to-rank content that sounds exactly like you (not like AI), ranks faster,
              gets cited, and turns traffic into sales.
            </p>

            {/* Email Signup */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-4">
              <Input type="email" placeholder="your@email.com" className="h-12 text-base bg-card" />
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 whitespace-nowrap">
                Get Started Free
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-3 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-background"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Trusted by 20,000+</span> Marketers & Agencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">
              More Than Just a Writer. Your Complete AI Content System.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create structured, factual, and brand-tailored content that's optimized for search engines and AI
              citations.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: PenToolIcon, label: "AI Rewriting" },
              { icon: ImageIcon, label: "Smart Images" },
              { icon: VideoIcon, label: "Video Content" },
              { icon: LinkIcon, label: "Relevant Links" },
              { icon: ListIcon, label: "Table of Contents" },
            ].map((feature) => (
              <Button key={feature.label} variant="outline" className="gap-2 bg-card hover:bg-accent">
                <feature.icon className="w-4 h-4" />
                {feature.label}
              </Button>
            ))}
          </div>

          {/* Feature Preview */}
          <Card className="overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <BrainCircuitIcon className="w-16 h-16 mx-auto text-primary" />
                <p className="text-lg font-medium">AI-Powered Content Generation</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Professional journalism automation with custom styles, SEO optimization, and revenue analytics
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">AI SEO WRITER</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Write, Publish, and Syndicate</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow bg-card">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <PenToolIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate brand-tailored content</h3>
                <p className="text-muted-foreground">
                  Create professional articles in 150+ languages with custom journalist styles that match your brand
                  voice perfectly
                </p>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-card">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUpIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find viral news opportunities</h3>
                <p className="text-muted-foreground">
                  Real-time news discovery with AI-powered trend analysis and revenue scoring to maximize your content
                  ROI
                </p>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-card">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BrainCircuitIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Copilot Assistant</h3>
                <p className="text-muted-foreground">
                  Intelligent chatbot with function calling to help you optimize content, analyze trends, and automate
                  workflows
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Ready to automate your content workflow?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of marketers and agencies using ContentMaster to scale their content production and revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-card">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold">ContentMaster AI</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 ContentMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
