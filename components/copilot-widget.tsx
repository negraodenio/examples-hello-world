"use client"
import { useChat } from "@ai-sdk/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { SendIcon, StopCircle } from "lucide-react"

interface CopilotWidgetProps {
  conversationId?: string
  onConversationChange?: (id: string) => void
}

export function CopilotWidget({ conversationId, onConversationChange }: CopilotWidgetProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/copilot/chat",
    body: {
      conversationId: conversationId,
    },
  })

  const [activeConversation, setActiveConversation] = useState(conversationId)

  useEffect(() => {
    if (conversationId && conversationId !== activeConversation) {
      setActiveConversation(conversationId)
      setMessages([])
    }
  }, [conversationId, activeConversation, setMessages])

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-2xl font-bold mb-2 text-balance">ContentMaster AI Copilot</div>
            <p className="text-muted-foreground">Start a conversation to get intelligent insights</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-xs lg:max-w-md px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="whitespace-pre-wrap text-pretty">{message.content}</div>
                {message.toolInvocations && message.toolInvocations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    {message.toolInvocations.map((tool, idx) => (
                      <div key={idx} className="text-xs opacity-70">
                        <span className="font-mono">🔧 {tool.toolName}</span>
                        {tool.state === "result" && tool.result && (
                          <div className="mt-1 text-xs">{JSON.stringify(tool.result, null, 2)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner />
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask anything..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
            {isLoading ? <StopCircle className="w-4 h-4" /> : <SendIcon className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
