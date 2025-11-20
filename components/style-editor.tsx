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
  training_text_1?: string
  training_text_2?: string
  training_text_3?: string
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
    trainingText1: "",
    trainingText2: "",
    trainingText3: "",
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
      trainingText1: "",
      trainingText2: "",
      trainingText3: "",
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
      trainingText1: style.training_text_1 || "",
      trainingText2: style.training_text_2 || "",
      trainingText3: style.training_text_3 || "",
      isDefault: style.is_default,
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!formData.trainingText1.trim() && !formData.trainingText2.trim() && !formData.trainingText3.trim()) {
      toast.error("Please provide at least one training text example")
      return
    }

    try {
      const response = await fetch("/api/styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStyle?.id,
          name: formData.name,
          description: formData.description,
          tone: formData.tone,
          styleCharacteristics: {
            vocabulary: "professional",
            sentence_length: "medium",
            use_examples: true,
          },
          trainingText1: formData.trainingText1,
          trainingText2: formData.trainingText2,
          trainingText3: formData.trainingText3,
          isDefault: formData.isDefault,
        }),
      })

      if (response.ok) {
        toast.success(`Style "${formData.name}" ${editingStyle ? "updated" : "created"} successfully!`)
        setIsCreating(false)
        setEditingStyle(null)
        loadStyles()
        setFormData({
          name: "",
          description: "",
          tone: "conversational",
          trainingText1: "",
          trainingText2: "",
          trainingText3: "",
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
      trainingText1: "",
      trainingText2: "",
      trainingText3: "",
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
          <p className="text-muted-foreground">Train custom writing styles with 3 text examples</p>
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

            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Training Examples</Badge>
                <p className="text-sm text-muted-foreground">
                  Cole 3 textos escritos pelo jornalista para a IA aprender o estilo
                </p>
              </div>

              <div>
                <Label htmlFor="training1" className="flex items-center gap-2">
                  Texto de Exemplo 1 *
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                </Label>
                <Textarea
                  id="training1"
                  placeholder="Cole o primeiro texto de exemplo do jornalista aqui..."
                  value={formData.trainingText1}
                  onChange={(e) => setFormData({ ...formData, trainingText1: e.target.value })}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="training2" className="flex items-center gap-2">
                  Texto de Exemplo 2
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </Label>
                <Textarea
                  id="training2"
                  placeholder="Cole o segundo texto de exemplo do jornalista aqui..."
                  value={formData.trainingText2}
                  onChange={(e) => setFormData({ ...formData, trainingText2: e.target.value })}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="training3" className="flex items-center gap-2">
                  Texto de Exemplo 3
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </Label>
                <Textarea
                  id="training3"
                  placeholder="Cole o terceiro texto de exemplo do jornalista aqui..."
                  value={formData.trainingText3}
                  onChange={(e) => setFormData({ ...formData, trainingText3: e.target.value })}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
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

              <div className="flex gap-1">
                {style.training_text_1 && (
                  <Badge variant="secondary" className="text-xs">
                    Example 1 ✓
                  </Badge>
                )}
                {style.training_text_2 && (
                  <Badge variant="secondary" className="text-xs">
                    Example 2 ✓
                  </Badge>
                )}
                {style.training_text_3 && (
                  <Badge variant="secondary" className="text-xs">
                    Example 3 ✓
                  </Badge>
                )}
              </div>

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
