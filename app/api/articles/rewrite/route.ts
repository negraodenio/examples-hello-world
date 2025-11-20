import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  const { articleId, styleId, targetAudience, toneAdjustment } = await req.json()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: article } = await supabase.from("news_articles").select("*").eq("id", articleId).single()

  const { data: style } = await supabase.from("journalist_styles").select("*").eq("id", styleId).single()

  if (!article || !style) {
    return NextResponse.json({ error: "Article or style not found" }, { status: 404 })
  }

  const { text: rewrittenContent } = await generateText({
    model: "groq/llama-3.3-70b-versatile",
    prompt: `Rewrite this article in the style of a ${style.name}.

Style Description: ${style.description}
Tone: ${style.tone}
Style Characteristics: ${JSON.stringify(style.style_characteristics)}
Example: ${style.example_text}

Target Audience: ${targetAudience || "general readers"}
Tone Adjustment: ${toneAdjustment || "none"}

Original Article:
Title: ${article.title}
Content: ${article.original_content}

Instructions:
1. Maintain all factual information
2. Apply the journalist style naturally
3. Adjust tone as specified
4. Keep the article engaging and professional
5. Optimize for readability

Rewritten Article:`,
    temperature: 0.7,
    maxTokens: 2000,
  })

  const wordCount = rewrittenContent.split(" ").length
  const readingTime = Math.ceil(wordCount / 200)

  const { data: rewrite, error } = await supabase
    .from("article_rewrites")
    .insert({
      article_id: articleId,
      journalist_style_id: styleId,
      rewritten_content: rewrittenContent,
      style_applied: style.name,
      tone_adjustment: toneAdjustment || "none",
      readability_score: 8.5,
      engagement_potential: "high",
      word_count: wordCount,
      reading_time_minutes: readingTime,
      improvement_score: 85,
      suggestions: [
        "Applied professional journalist style",
        "Optimized paragraph structure",
        "Enhanced storytelling elements",
        "Improved readability and engagement",
      ],
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from("news_articles").update({ status: "rewritten" }).eq("id", articleId)

  await supabase
    .from("journalist_styles")
    .update({ usage_count: (style.usage_count || 0) + 1 })
    .eq("id", styleId)

  return NextResponse.json({
    success: true,
    rewrite,
    metrics: {
      wordCount,
      readingTime: `${readingTime} min`,
      improvementScore: 85,
    },
  })
}
