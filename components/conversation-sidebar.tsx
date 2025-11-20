"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusIcon, MessageSquareIcon, TrashIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Conversation {
  id: string
  title: string
  created_at: string
  context_type: string
}

interface ConversationSidebarProps {
  onSelectConversation: (id: string) => void
  activeConversationId?: string
}

export function ConversationSidebar({ onSelectConversation, activeConversationId }: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    const response = await fetch("/api/copilot/conversations")
    if (response.ok) {
      const data = await response.json()
      setConversations(data)
    }
    setLoading(false)
  }

  const handleNewConversation = async () => {
    const response = await fetch("/api/copilot/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Conversation ${new Date().toLocaleDateString()}`,
        contextType: "general",
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setConversations([data, ...conversations])
      onSelectConversation(data.id)
    }
  }

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const confirmDelete = window.confirm("Are you sure you want to delete this conversation?")
    if (!confirmDelete) return

    await supabase.from("conversations").delete().eq("id", id)
    setConversations(conversations.filter((c) => c.id !== id))

    if (activeConversationId === id) {
      onSelectConversation("")
    }
  }

  return (
    <div className="w-full lg:w-64 border-r bg-sidebar p-4 flex flex-col gap-4 h-screen">
      <Button onClick={handleNewConversation} className="w-full gap-2">
        <PlusIcon className="w-4 h-4" />
        New Conversation
      </Button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                activeConversationId === conversation.id ? "bg-sidebar-accent border-sidebar-primary" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquareIcon className="w-4 h-4 flex-shrink-0 text-sidebar-primary" />
                    <p className="text-sm font-medium truncate">{conversation.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conversation.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                >
                  <TrashIcon className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
