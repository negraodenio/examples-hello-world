"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Edit3, Plus, Save, Check } from "lucide-react"
import { toast } from "sonner"

interface JournalistStyle {
  id: string
  name: string
  description: string
  tone: string
  style_characteristics: any
  example_text: string
  is_default: boolean
  usage_count: number
}

export function StyleEditor() {
  const [styles, setStyles] = useState<JournalistStyle[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStyle, setEditingStyle] = useState<JournalistStyle | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tone: "conversational",
    exampleText: "",
    isDefault: false,
  })

  useEffect(() => {
    loadStyles()
  }, [])

  const loadStyles = async () => {
    try {
      const response = await fetch("/api/styles")
      const data = await response.json()
      if (data.styles) {
        setStyles(data.styles)
      }
    } catch (error) {
      toast.error("Failed to load styles")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setEditingStyle(null)
    setFormData({
      name: "",
      description: "",
      tone: "conversational",
      exampleText: "",
      isDefault: false,
    })
  }

  const handleEdit = (style: JournalistStyle) => {
    setEditingStyle(style)
    setIsCreating(false)
    setFormData({
      name: style.name,
      description: style.description,
      tone: style.tone,
      exampleText: style.example_text,
      isDefault: style.is_default,
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          tone: formData.tone,
          styleCharacteristics: {
            vocabulary: "professional",
            sentence_length: "medium",
            use_examples: true,
          },
          exampleText: formData.exampleText,
          isDefault: formData.isDefault,
        }),
      })

      if (response.ok) {
        toast.success(`Style "${formData.name}" created successfully!`)
        setIsCreating(false)
        setEditingStyle(null)
        loadStyles()
        setFormData({
          name: "",
          description: "",
          tone: "conversational",
          exampleText: "",
          isDefault: false,
        })
      } else {
        toast.error("Failed to save style")
      }
    } catch (error) {
      toast.error("Error saving style")
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingStyle(null)
    setFormData({
      name: "",
      description: "",
      tone: "conversational",
      exampleText: "",
      isDefault: false,
    })
  }

  const toneOptions = [
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "technical", label: "Technical" },
    { value: "conversational", label: "Conversational" },
    { value: "authoritative", label: "Authoritative" },
    { value: "friendly", label: "Friendly" },
    { value: "investigative", label: "Investigative" },
    { value: "analytical", label: "Analytical" },
  ]

  if (loading) {
    return <div className="text-center py-12">Loading styles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Journalist Writing Styles</h2>
          <p className="text-muted-foreground">Manage your custom journalist personas and writing styles</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Style
        </Button>
      </div>

      {(isCreating || editingStyle) && (
        <Card className="p-6 border-2 border-primary">
          <h3 className="text-lg font-semibold mb-4">
            {isCreating ? "Create New Style" : `Edit: ${editingStyle?.name}`}
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Style Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Tech Blogger, Investigative Reporter..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the characteristics of this writing style..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tone">Tone</Label>
              <select
                id="tone"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full border rounded-md p-2 bg-background"
              >
                {toneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="example">Example Text</Label>
              <Textarea
                id="example"
                placeholder="Provide an example of this writing style..."
                value={formData.exampleText}
                onChange={(e) => setFormData({ ...formData, exampleText: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="default"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="default">Set as default style</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Style
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {styles.map((style) => (
          <Card key={style.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{style.name}</h3>
                    {style.is_default && (
                      <Badge variant="default" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{style.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{style.tone}</Badge>
                <Badge variant="secondary" className="text-xs">
                  Used {style.usage_count} times
                </Badge>
              </div>

              {style.example_text && (
                <div className="bg-muted p-2 rounded text-xs italic border-l-2 border-primary">
                  "{style.example_text.slice(0, 100)}..."
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(style)} className="gap-1">
                  <Edit3 className="w-3 h-3" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {styles.length === 0 && !isCreating && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Edit3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No custom styles yet. Create your first journalist style!</p>
          <Button onClick={handleCreateNew} variant="outline" className="gap-2 bg-transparent">
            <Plus className="w-4 h-4" />
            Create Style
          </Button>
        </div>
      )}
    </div>
  )
}
