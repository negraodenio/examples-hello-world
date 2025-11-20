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
  CheckIcon,
  ArrowRightIcon,
  ZapIcon,
  GlobeIcon,
  BarChart3Icon,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap text-sm">
          <Badge className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-3">NEW</Badge>
          <span className="font-semibold">Limited Time: Get 50% OFF your first 3 months</span>
          <ArrowRightIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">ContentMaster</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="#features" className="hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="hover:text-purple-600 transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="hover:text-purple-600 transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-purple-600 transition-colors">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-gray-950 dark:to-background">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 border-0 text-sm px-4 py-1">
              AI-Powered SEO Content Platform
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance leading-[1.1] tracking-tight">
              Create SEO Content That{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Ranks & Converts
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Generate professional, ready-to-publish articles that sound human, rank on Google, and get cited by
              ChatGPT—all automated with your brand voice.
            </p>

            {/* Email Signup */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-6">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-14 text-base bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white whitespace-nowrap font-semibold"
              >
                Get Started Free
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-green-600" />
                <span className="text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-green-600" />
                <span className="text-muted-foreground">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-green-600" />
                <span className="text-muted-foreground">Cancel anytime</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800 max-w-md mx-auto">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white dark:border-gray-900"
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Trusted by 20,000+</p>
                <p className="text-xs text-muted-foreground">Marketers & Content Teams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">10M+</p>
              <p className="text-sm text-muted-foreground">Articles Generated</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">150+</p>
              <p className="text-sm text-muted-foreground">Languages Supported</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">98%</p>
              <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">5x</p>
              <p className="text-sm text-muted-foreground">Faster Content Creation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 border-0">
              POWERFUL FEATURES
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Everything You Need to Scale Content Production
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From ideation to publication, automate your entire content workflow with AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PenToolIcon,
                title: "AI Content Generation",
                description:
                  "Create professional, SEO-optimized articles in 150+ languages with custom brand voices and journalist styles",
                color: "from-purple-500 to-indigo-500",
              },
              {
                icon: BrainCircuitIcon,
                title: "Smart AI Copilot",
                description:
                  "Intelligent assistant with function calling to optimize content, analyze trends, and automate repetitive tasks",
                color: "from-indigo-500 to-blue-500",
              },
              {
                icon: TrendingUpIcon,
                title: "Trend Discovery",
                description:
                  "Real-time news monitoring with AI-powered opportunity scoring to find viral content ideas automatically",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: ZapIcon,
                title: "Auto-Publishing",
                description:
                  "Seamless integration with your CMS. Generate, review, and publish content without leaving the platform",
                color: "from-cyan-500 to-teal-500",
              },
              {
                icon: GlobeIcon,
                title: "Multi-Language Support",
                description:
                  "Create authentic content in 150+ languages with cultural nuances and local SEO optimization built-in",
                color: "from-teal-500 to-green-500",
              },
              {
                icon: BarChart3Icon,
                title: "Revenue Analytics",
                description:
                  "Track content performance, revenue attribution, and ROI with comprehensive analytics dashboards",
                color: "from-green-500 to-emerald-500",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="p-8 hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 bg-white dark:bg-gray-900"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-b from-purple-50 to-white dark:from-gray-950 dark:to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 border-0">
              SIMPLE PROCESS
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Get Started in 3 Easy Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4">Configure Your Brand</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set up your brand voice, style preferences, and target keywords. Train the AI to write exactly like
                  your team.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4">Generate Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enter your topic or let AI discover trending opportunities. Generate professional articles in seconds.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4">Publish & Scale</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Review, edit if needed, and publish directly to your CMS. Watch your traffic and revenue grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="pricing"
        className="py-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 20,000+ marketers and agencies using ContentMaster to scale their content production and drive real
            business results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="h-14 px-10 text-base bg-white text-purple-700 hover:bg-gray-100 font-semibold shadow-xl"
              >
                Start Your Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base border-white text-white hover:bg-white/10 font-semibold bg-transparent"
              >
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-purple-100">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">ContentMaster</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered content generation platform for modern marketers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 ContentMaster AI. All rights reserved.</p>
            <div className="flex gap-6">{/* Social icons would go here */}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
