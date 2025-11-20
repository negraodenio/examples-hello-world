"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper, Sparkles, CheckCircle2, Download, Eye } from "lucide-react"
import { useChat } from "@ai-sdk/react"

export const dynamic = "force-dynamic"

export default function NewspaperGeneratorPage() {
  const [generating, setGenerating] = useState(false)
  const [generatedNewspaper, setGeneratedNewspaper] = useState<any>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/newspapers/generate",
    onFinish: (message) => {
      console.log("[v0] Generation finished:", message)
      // Extract newspaper data from tool results
      const toolResults = message.toolInvocations?.find((inv: any) => inv.toolName === "generateNewspaper")
      if (toolResults?.result) {
        setGeneratedNewspaper(toolResults.result.newspaper)
      }
    },
  })

  const handleQuickGenerate = (theme: string, pages: number) => {
    const message = `Generate a ${pages}-page professional newspaper about "${theme}" targeted at business professionals with balanced editorial style.`
    handleSubmit(new Event("submit") as any, {
      data: { message },
    })
    setGenerating(true)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Newspaper className="w-10 h-10 text-blue-600" />
          Digital Newspaper Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Create professional multi-page newspapers with AI-powered journalism
        </p>
      </div>

      <Tabs defaultValue="copilot" className="space-y-6">
        <TabsList>
          <TabsTrigger value="copilot">AI Copilot</TabsTrigger>
          <TabsTrigger value="quick">Quick Generate</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="copilot" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Editorial Copilot - Interactive Configuration
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto bg-muted/20">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <p className="text-lg mb-2">Welcome to the Editorial Copilot!</p>
                    <p>Tell me about the newspaper you want to create, and I'll help you configure it perfectly.</p>
                    <div className="mt-6 grid gap-2 max-w-md mx-auto">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleInputChange({
                            target: { value: "I want to create a tech newspaper about AI innovations" },
                          } as any)
                        }
                      >
                        Tech & AI Publication
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleInputChange({
                            target: { value: "Create a business newspaper about market trends" },
                          } as any)
                        }
                      >
                        Business & Finance
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleInputChange({ target: { value: "Generate a health & wellness newspaper" } } as any)
                        }
                      >
                        Health & Wellness
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          msg.role === "user"
                            ? "bg-blue-100 dark:bg-blue-900/30 ml-12"
                            : "bg-gray-100 dark:bg-gray-800 mr-12"
                        }`}
                      >
                        <div className="font-semibold mb-2 text-sm text-muted-foreground">
                          {msg.role === "user" ? "You" : "Editorial Copilot"}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {msg.toolInvocations?.map((tool: any, tidx: number) => (
                          <div
                            key={tidx}
                            className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800"
                          >
                            <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                              🛠️ {tool.toolName}
                            </div>
                            {tool.result && (
                              <pre className="text-xs overflow-auto max-h-40 bg-white dark:bg-gray-950 p-2 rounded">
                                {JSON.stringify(tool.result, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="text-center py-4">
                        <div className="inline-flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Describe your newspaper or ask for configuration help..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input || !input.trim()}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isLoading ? "Processing..." : "Send"}
                </Button>
              </form>
            </div>
          </Card>

          {generatedNewspaper && (
            <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">Newspaper Generated Successfully!</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {generatedNewspaper.journal_metadata?.title} - {generatedNewspaper.journal_metadata?.total_pages}{" "}
                    pages
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export HTML
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quick" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Generation Templates</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickGenerate("Artificial Intelligence Trends", 4)}
              >
                <h4 className="font-semibold mb-2">AI & Technology</h4>
                <p className="text-sm text-muted-foreground mb-3">4-page tech-focused publication</p>
                <div className="text-xs text-muted-foreground">~14 min read</div>
              </Card>

              <Card
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickGenerate("Business Market Analysis", 6)}
              >
                <h4 className="font-semibold mb-2">Business & Finance</h4>
                <p className="text-sm text-muted-foreground mb-3">6-page comprehensive analysis</p>
                <div className="text-xs text-muted-foreground">~21 min read</div>
              </Card>

              <Card
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickGenerate("Health & Wellness Innovation", 4)}
              >
                <h4 className="font-semibold mb-2">Health & Wellness</h4>
                <p className="text-sm text-muted-foreground mb-3">4-page health publication</p>
                <div className="text-xs text-muted-foreground">~14 min read</div>
              </Card>

              <Card
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickGenerate("Sustainability and Climate Action", 5)}
              >
                <h4 className="font-semibold mb-2">Environment & Climate</h4>
                <p className="text-sm text-muted-foreground mb-3">5-page environmental coverage</p>
                <div className="text-xs text-muted-foreground">~17 min read</div>
              </Card>

              <Card
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickGenerate("Education Technology Transformation", 4)}
              >
                <h4 className="font-semibold mb-2">Education & EdTech</h4>
                <p className="text-sm text-muted-foreground mb-3">4-page education focus</p>
                <div className="text-xs text-muted-foreground">~14 min read</div>
              </Card>

              <Card
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickGenerate("Digital Marketing Strategies", 6)}
              >
                <h4 className="font-semibold mb-2">Marketing & Growth</h4>
                <p className="text-sm text-muted-foreground mb-3">6-page marketing guide</p>
                <div className="text-xs text-muted-foreground">~21 min read</div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Editorial Templates</h3>
            <p className="text-muted-foreground">
              Pre-configured layouts and structures for different publication types
            </p>
            <div className="mt-4 text-sm text-muted-foreground">Templates library coming soon...</div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
