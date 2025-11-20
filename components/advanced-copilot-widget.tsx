"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { useHotkeys } from "react-hotkeys-hook"
import {
  Brain,
  X,
  Send,
  Loader,
  ChevronDown,
  ChevronUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Search,
  DollarSign,
  Target,
  Edit3,
  Sparkles,
  Lightbulb,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const QUICK_ACTIONS = [
  {
    id: "analyze-revenue",
    label: "Analyze Revenue",
    icon: DollarSign,
    prompt: "Analyze my revenue potential with specific optimization strategies and ROI projections",
    color: "text-green-600",
  },
  {
    id: "find-news",
    label: "Find Viral News",
    icon: Search,
    prompt: "Search for trending news with high viral potential in AI and technology",
    color: "text-blue-600",
  },
  {
    id: "optimize-seo",
    label: "Optimize SEO",
    icon: Target,
    prompt: "Perform comprehensive SEO optimization with keyword research and technical improvements",
    color: "text-purple-600",
  },
  {
    id: "rewrite-style",
    label: "Rewrite Content",
    icon: Edit3,
    prompt: "Show me available journalist styles and help me rewrite content professionally",
    color: "text-orange-600",
  },
]

const DailyBriefing = ({ onAction }: { onAction: (prompt: string) => void }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 mb-4 border border-indigo-100 dark:border-indigo-900">
    <div className="flex items-center gap-2 mb-3">
      <Lightbulb className="w-4 h-4 text-amber-500" />
      <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Daily Proactive Briefing</h4>
    </div>
    <div className="space-y-3">
      <div
        onClick={() => onAction("Find trending AI news for my tech blog")}
        className="flex items-start gap-3 p-2 bg-white/60 dark:bg-white/5 rounded-lg cursor-pointer hover:bg-white/80 transition-colors group"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
        <div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
            3 new viral AI stories detected
          </p>
          <p className="text-[10px] text-slate-500">Perfect for your "Tech Guru" style</p>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>

      <div
        onClick={() => onAction("Analyze my recent articles for SEO improvements")}
        className="flex items-start gap-3 p-2 bg-white/60 dark:bg-white/5 rounded-lg cursor-pointer hover:bg-white/80 transition-colors group"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
        <div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-green-600 transition-colors">
            SEO Opportunity: "AI Agents"
          </p>
          <p className="text-[10px] text-slate-500">Volume up 200% this week</p>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>
    </div>
  </div>
)

interface AdvancedCopilotWidgetProps {
  conversationId?: string
  context?: {
    articleId?: string
    niche?: string
    targetAudience?: string
    currentContent?: string
  }
}

export function AdvancedCopilotWidget({ conversationId, context = {} }: AdvancedCopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, setInput, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/copilot/advanced-chat",
    body: {
      conversationId,
      context,
    },
    onFinish: () => {
      setShowQuickActions(false)
    },
  })

  useHotkeys("ctrl+k, meta+k", (e) => {
    e.preventDefault()
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  })

  useHotkeys("escape", () => {
    if (isOpen) setIsOpen(false)
  })

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId || initialMessagesLoaded) return

      try {
        const response = await fetch(`/api/copilot/conversations/${conversationId}/messages`)
        if (response.ok) {
          const dbMessages = await response.json()
          if (dbMessages.length > 0) {
            setMessages(
              dbMessages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                createdAt: new Date(msg.created_at),
              })),
            )
            setShowQuickActions(false)
          }
        }
      } catch (err) {
        console.error("[v0] Failed to load messages:", err)
      } finally {
        setInitialMessagesLoaded(true)
      }
    }

    loadMessages()
  }, [conversationId, setMessages, initialMessagesLoaded])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(scrollToBottom, [messages, scrollToBottom])

  const generateWelcomeMessage = (ctx: typeof context): string => {
    if (ctx.articleId) {
      return `👋 I see you're working on an article! I can help you:\n\n• 💰 Analyze revenue potential and suggest optimizations\n• 🎯 Improve SEO for more organic traffic\n• ✍️ Rewrite in professional journalist styles\n• 🔍 Find related trending news\n\nWhat would you like to do first?`
    }

    if (ctx.niche) {
      return `🚀 Ready to dominate the **${ctx.niche}** niche!\n\nI can help you:\n• Find hot trending news with viral potential\n• Create high-converting content strategies\n• Optimize everything for maximum revenue\n\nHow can I accelerate your results today?`
    }

    return `⚡ **ContentMaster Copilot** at your service!\n\nI'm your specialized AI assistant for:\n🔍 Finding viral news opportunities\n💰 Maximizing content revenue\n✍️ Professional content rewriting\n🎯 SEO domination\n\nType your question or use quick actions below! 👇`
  }

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[0]) => {
    setInput(action.prompt)
    setShowQuickActions(false)
    setTimeout(() => {
      const form = inputRef.current?.form
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
      }
    }, 100)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const provideFeedback = async (messageId: string, isPositive: boolean) => {
    try {
      const response = await fetch("/api/copilot/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          isPositive,
          context: {
            niche: context.niche,
            // We could infer style from the last tool used if available
          },
        }),
      })

      if (response.ok) {
        toast.success(isPositive ? "Thanks! I've learned from this." : "Thanks! I'll improve next time.")
      }
    } catch (err) {
      console.error("Failed to send feedback", err)
    }
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 rounded-full h-16 w-16 p-0"
          >
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span className="hidden group-hover:inline text-sm font-medium whitespace-nowrap pr-4">Copilot (⌘K)</span>
            </div>
          </Button>
        </div>
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 bg-background rounded-2xl shadow-2xl border z-50 transition-all duration-300 flex flex-col",
            isExpanded ? "w-[28rem] h-[42rem]" : "w-[28rem] h-16",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-t-2xl shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">ContentMaster Copilot</h3>
                <p className="text-xs text-muted-foreground">Your AI content assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 && (
                  <>
                    <div className="text-center py-4 text-muted-foreground text-sm whitespace-pre-line">
                      {generateWelcomeMessage(context)}
                    </div>
                    <DailyBriefing
                      onAction={(prompt) => {
                        setInput(prompt)
                        setShowQuickActions(false)
                        setTimeout(() => {
                          const form = inputRef.current?.form
                          if (form) {
                            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
                          }
                        }, 100)
                      }}
                    />
                  </>
                )}

                {messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl p-3 text-sm",
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground",
                      )}
                    >
                      {/* Tool calls indicator */}
                      {message.role === "assistant" &&
                        message.toolInvocations &&
                        message.toolInvocations.length > 0 && (
                          <div className="flex items-center space-x-1 mb-2 text-xs opacity-75">
                            <Sparkles className="w-3 h-3" />
                            <span>Using tools: {message.toolInvocations.map((t: any) => t.toolName).join(", ")}</span>
                          </div>
                        )}

                      <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>

                      {/* Message actions for assistant */}
                      {message.role === "assistant" && message.content && (
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => provideFeedback(message.id || String(index), true)}
                              className="h-6 w-6"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => provideFeedback(message.id || String(index), false)}
                              className="h-6 w-6"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl p-3 flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-muted-foreground">Processing...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                    Error: {error.message}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {showQuickActions && messages.length === 0 && (
                <div className="px-4 pb-2 shrink-0">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Quick Actions:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((action) => {
                      const IconComponent = action.icon
                      return (
                        <Button
                          key={action.id}
                          variant="outline"
                          onClick={() => handleQuickAction(action)}
                          className="flex items-center justify-start space-x-2 h-auto py-2 px-3"
                        >
                          <IconComponent className={cn("w-4 h-4", action.color)} />
                          <span className="text-xs font-medium">{action.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="p-4 border-t bg-muted/30 rounded-b-2xl shrink-0">
                <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything or use quick actions..."
                      className="min-h-[60px] resize-none"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e as any)
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-[60px] w-[60px] shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>

                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <span>⌘K to open</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
