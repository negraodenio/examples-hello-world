"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ConversationSidebar } from "@/components/conversation-sidebar"
import { AdvancedCopilotWidget } from "@/components/advanced-copilot-widget"

export default function CopilotPage() {
  const [user, setUser] = useState<any>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState({
    niche: "",
    targetAudience: "",
    articleId: undefined as string | undefined,
  })
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

  const handleQuickAction = async (action: string, prompt: string) => {
    if (!user) return

    try {
      // Create a new conversation
      const response = await fetch("/api/copilot/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: action,
          context: {},
        }),
      })

      if (!response.ok) throw new Error("Failed to create conversation")

      const newConversation = await response.json()
      setConversationId(newConversation.id)

      // Set initial prompt context
      setContext((prev) => ({ ...prev, initialPrompt: prompt }))
    } catch (error) {
      console.error("[v0] Failed to create conversation:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ConversationSidebar
        onSelectConversation={setConversationId}
        activeConversationId={conversationId || undefined}
      />
      <div className="flex-1 relative">
        {conversationId ? (
          <AdvancedCopilotWidget conversationId={conversationId} context={context} />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to ContentMaster AI
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Your intelligent copilot for journalism automation and content optimization
              </p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <button
                  onClick={() =>
                    handleQuickAction(
                      "NewsHunter",
                      "Search for trending news with high viral potential in AI and technology",
                    )
                  }
                  className="border rounded-lg p-4 hover:border-blue-500 transition-colors text-left hover:shadow-lg"
                >
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="font-semibold mb-1">NewsHunter</h3>
                  <p className="text-sm text-muted-foreground">Find viral news opportunities</p>
                </button>
                <button
                  onClick={() =>
                    handleQuickAction(
                      "Revenue Intelligence",
                      "Analyze my revenue potential with specific optimization strategies and ROI projections",
                    )
                  }
                  className="border rounded-lg p-4 hover:border-green-500 transition-colors text-left hover:shadow-lg"
                >
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="font-semibold mb-1">Revenue Intelligence</h3>
                  <p className="text-sm text-muted-foreground">Maximize content monetization</p>
                </button>
                <button
                  onClick={() =>
                    handleQuickAction(
                      "Style Expert",
                      "Show me available journalist styles and help me rewrite content professionally",
                    )
                  }
                  className="border rounded-lg p-4 hover:border-orange-500 transition-colors text-left hover:shadow-lg"
                >
                  <div className="text-2xl mb-2">✍️</div>
                  <h3 className="font-semibold mb-1">Style Expert</h3>
                  <p className="text-sm text-muted-foreground">Professional content rewriting</p>
                </button>
                <button
                  onClick={() =>
                    handleQuickAction(
                      "SEO Master",
                      "Perform comprehensive SEO optimization with keyword research and technical improvements",
                    )
                  }
                  className="border rounded-lg p-4 hover:border-purple-500 transition-colors text-left hover:shadow-lg"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold mb-1">SEO Master</h3>
                  <p className="text-sm text-muted-foreground">Dominate search rankings</p>
                </button>
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                Press <kbd className="px-2 py-1 bg-muted rounded border">⌘K</kbd> or click a card to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
