"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CopilotWidget } from "@/components/copilot-widget"
import { ConversationSidebar } from "@/components/conversation-sidebar"

export default function CopilotPage() {
  const [user, setUser] = useState<any>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
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
    <div className="flex h-screen">
      <ConversationSidebar
        onSelectConversation={setConversationId}
        activeConversationId={conversationId || undefined}
      />
      <div className="flex-1">
        {conversationId ? (
          <CopilotWidget conversationId={conversationId} />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-balance">Welcome to ContentMaster AI</h2>
              <p className="text-muted-foreground">Select or create a conversation to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
