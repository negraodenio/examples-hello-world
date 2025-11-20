"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FolderOpen, Settings, Zap, FileText, BarChart, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SEODashboard() {
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const response = await fetch("/api/seo/projects")
    const data = await response.json()
    setProjects(data.projects || [])
    if (data.projects && data.projects.length > 0) {
      setSelectedProject(data.projects[0].id)
    }
    setLoading(false)
  }

  const createProject = async (formData: any) => {
    const response = await fetch("/api/seo/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      toast.success("Project created successfully!")
      loadProjects()
    } else {
      toast.error("Failed to create project")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SEO Automation Hub
          </h1>
          <p className="text-muted-foreground text-lg">Complete SEO content generation and management platform</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New SEO Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSubmit={createProject} />
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first SEO project to start generating optimized content
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Your First Project</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New SEO Project</DialogTitle>
              </DialogHeader>
              <ProjectForm onSubmit={createProject} />
            </DialogContent>
          </Dialog>
        </Card>
      ) : (
        <Tabs defaultValue="articles" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedProject || undefined} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TabsList>
              <TabsTrigger value="articles" className="gap-2">
                <FileText className="w-4 h-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="autoblog" className="gap-2">
                <Zap className="w-4 h-4" />
                AutoBlog
              </TabsTrigger>
              <TabsTrigger value="seo-agents" className="gap-2">
                <Settings className="w-4 h-4" />
                SEO Agents
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="articles">
            <ArticlesPanel projectId={selectedProject} />
          </TabsContent>

          <TabsContent value="autoblog">
            <AutoBlogPanel projectId={selectedProject} />
          </TabsContent>

          <TabsContent value="seo-agents">
            <SEOAgentsPanel projectId={selectedProject} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsPanel projectId={selectedProject} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function ProjectForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
    industry: "",
    target_audience: "",
    brand_tone: "professional",
    primary_language: "en",
    project_type: "blog",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="My Blog"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            placeholder="example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your project..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="Technology, Finance, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_audience">Target Audience</Label>
          <Input
            id="target_audience"
            value={formData.target_audience}
            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            placeholder="Developers, Marketers, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand_tone">Brand Tone</Label>
          <Select
            value={formData.brand_tone}
            onValueChange={(value) => setFormData({ ...formData, brand_tone: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="authoritative">Authoritative</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="primary_language">Language</Label>
          <Select
            value={formData.primary_language}
            onValueChange={(value) => setFormData({ ...formData, primary_language: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project_type">Project Type</Label>
          <Select
            value={formData.project_type}
            onValueChange={(value) => setFormData({ ...formData, project_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="news">News Site</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  )
}

function ArticlesPanel({ projectId }: { projectId: string | null }) {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)

  useEffect(() => {
    if (projectId) {
      loadArticles()
    }
  }, [projectId])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/seo/projects/${projectId}/articles`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error("Failed to load articles", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/seo/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          ...formData,
        }),
      })

      if (response.ok) {
        toast.success("Article generated successfully!")
        setShowGenerateDialog(false)
        loadArticles()
      } else {
        toast.error("Failed to generate article")
      }
    } catch (error) {
      toast.error("Error generating article")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!projectId) return <div>Please select a project</div>

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">SEO Articles</h3>
            <p className="text-muted-foreground text-sm">
              Generate professional, ready-to-publish articles optimized for Google.
            </p>
          </div>
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Generate Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate SEO Article</DialogTitle>
              </DialogHeader>
              <GenerateArticleForm onSubmit={handleGenerate} isGenerating={isGenerating} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h4 className="text-lg font-medium mb-1">No articles yet</h4>
            <p className="text-muted-foreground mb-4">Generate your first SEO-optimized article to get started.</p>
            <Button variant="outline" onClick={() => setShowGenerateDialog(true)}>
              Generate Article
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{article.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{article.target_keyword}</span>
                    <span>•</span>
                    <span>{article.word_count} words</span>
                    <span>•</span>
                    <span className="capitalize">{article.status}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function GenerateArticleForm({ onSubmit, isGenerating }: { onSubmit: (data: any) => void; isGenerating: boolean }) {
  const [formData, setFormData] = useState({
    targetKeyword: "",
    wordCount: 1500,
    includeImages: true,
    includeFaq: true,
    includeToc: true,
    language: "en",
    tone: "professional",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="keyword">Target Keyword *</Label>
        <Input
          id="keyword"
          value={formData.targetKeyword}
          onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
          placeholder="e.g., how to start a blog, best seo tools 2024"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wordCount">Word Count</Label>
          <Select
            value={formData.wordCount.toString()}
            onValueChange={(value) => setFormData({ ...formData, wordCount: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">Short (1000 words)</SelectItem>
              <SelectItem value="1500">Standard (1500 words)</SelectItem>
              <SelectItem value="2500">Long Form (2500+ words)</SelectItem>
              <SelectItem value="4000">Pillar Page (4000+ words)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Tone of Voice</Label>
        <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional & Authoritative</SelectItem>
            <SelectItem value="casual">Casual & Friendly</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="journalistic">Journalistic</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2">
        <Label>Content Elements</Label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="images"
            className="rounded border-gray-300"
            checked={formData.includeImages}
            onChange={(e) => setFormData({ ...formData, includeImages: e.target.checked })}
          />
          <Label htmlFor="images" className="font-normal">
            Suggest AI Image Placements
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="faq"
            className="rounded border-gray-300"
            checked={formData.includeFaq}
            onChange={(e) => setFormData({ ...formData, includeFaq: e.target.checked })}
          />
          <Label htmlFor="faq" className="font-normal">
            Include FAQ Section (Schema optimized)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="toc"
            className="rounded border-gray-300"
            checked={formData.includeToc}
            onChange={(e) => setFormData({ ...formData, includeToc: e.target.checked })}
          />
          <Label htmlFor="toc" className="font-normal">
            Include Table of Contents
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Optimized Content...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Generate Article
          </>
        )}
      </Button>
    </form>
  )
}

function AutoBlogPanel({ projectId }: { projectId: string | null }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">AutoBlog Configuration</h3>
      <p className="text-muted-foreground mb-4">
        Set up automatic content generation from RSS feeds, keywords, YouTube videos, or trending topics.
      </p>
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        Create AutoBlog
      </Button>
    </Card>
  )
}

function SEOAgentsPanel({ projectId }: { projectId: string | null }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">SEO Technical Agents</h3>
      <p className="text-muted-foreground mb-4">
        AI agents that automatically identify and fix SEO issues like missing meta tags, broken links, and schema
        markup.
      </p>
      <Button>Run SEO Audit</Button>
    </Card>
  )
}

function AnalyticsPanel({ projectId }: { projectId: string | null }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
      <p className="text-muted-foreground">
        Track article performance, keyword rankings, and SEO scores across all your projects.
      </p>
    </Card>
  )
}
