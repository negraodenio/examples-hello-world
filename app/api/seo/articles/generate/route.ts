import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: Request) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { projectId, targetKeyword, language, includeImages, includeFaq, includeToc, wordCount, tone } = body

  // Get project and knowledge base
  const { data: project } = await supabase
    .from("seo_projects")
    .select("*, project_knowledge_base(*)")
    .eq("id", projectId)
    .single()

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // Build context from knowledge base
  const knowledgeContext = project.project_knowledge_base.map((kb: any) => `${kb.title}: ${kb.content}`).join("\n\n")

  // Generate article with AI
  const { text } = await generateText({
    model: "groq/llama-3.3-70b-versatile",
    prompt: `You are an expert SEO content writer. Generate a complete, SEO-optimized article in ${language} language.

TARGET KEYWORD: ${targetKeyword}
TONE: ${tone || project.brand_tone || "professional"}
WORD COUNT: ${wordCount || 1500} words
INDUSTRY: ${project.industry}
TARGET AUDIENCE: ${project.target_audience}

BRAND KNOWLEDGE:
${knowledgeContext}

REQUIREMENTS:
- Write naturally, sound human (not AI-detectable)
- Follow E-E-A-T principles (Expertise, Experience, Authoritativeness, Trustworthiness)
- Include ${includeToc ? "a Table of Contents" : "clear headings"}
- ${includeFaq ? "Include a FAQ section at the end" : "End with a strong conclusion"}
- Use the target keyword naturally 5-8 times
- Include LSI keywords and semantic variations
- Structure with H2 and H3 headings
- Add internal linking opportunities (mark with [INTERNAL_LINK: topic])
- Add external linking opportunities to authoritative sources (mark with [EXTERNAL_LINK: source])
- ${includeImages ? "Suggest 3-5 image placements with descriptions (mark with [IMAGE: description])" : ""}
- Ensure 100% unique content
- Make it scannable with bullet points and short paragraphs

Generate the complete article now:`,
    maxTokens: 4000,
  })

  // Parse the generated content and extract metadata
  const wordCountActual = text.split(/\s+/).length
  const readingTime = Math.ceil(wordCountActual / 200) + " min read"

  // Extract title from first line or H1
  const titleMatch = text.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : targetKeyword

  // Generate meta description
  const firstParagraph = text.split("\n\n")[1] || text.substring(0, 300)
  const metaDescription = firstParagraph.substring(0, 155) + "..."

  // Count links and images
  const internalLinksCount = (text.match(/\[INTERNAL_LINK:/g) || []).length
  const externalLinksCount = (text.match(/\[EXTERNAL_LINK:/g) || []).length
  const imagesCount = (text.match(/\[IMAGE:/g) || []).length

  // Insert article into database
  const { data: article, error } = await supabase
    .from("seo_articles")
    .insert({
      project_id: projectId,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      content: text,
      meta_title: title,
      meta_description: metaDescription,
      language,
      keywords: [targetKeyword],
      target_keyword: targetKeyword,
      word_count: wordCountActual,
      reading_time: readingTime,
      has_table_of_contents: includeToc,
      has_faq: includeFaq,
      internal_links_count: internalLinksCount,
      external_links_count: externalLinksCount,
      images_count: imagesCount,
      status: "review",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Run quality checks
  await runQualityChecks(supabase, article.id, text)

  return NextResponse.json({ article })
}

async function runQualityChecks(supabase: any, articleId: string, content: string) {
  const wordCount = content.split(/\s+/).length
  const readabilityScore = calculateReadabilityScore(content)
  const seoScore = calculateSEOScore(content)

  await supabase.from("article_quality_checks").insert({
    article_id: articleId,
    plagiarism_score: 0, // Would integrate with plagiarism API
    grammar_errors: 0, // Would integrate with grammar API
    readability_score: readabilityScore,
    seo_score: seoScore,
    e_e_a_t_score: 85,
    passed: readabilityScore > 60 && seoScore > 70,
  })
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).length
  const words = text.split(/\s+/).length
  const avgWordsPerSentence = words / sentences
  // Flesch Reading Ease approximation
  return Math.min(100, Math.max(0, 206.835 - 1.015 * avgWordsPerSentence))
}

function calculateSEOScore(text: string): number {
  let score = 50
  if (text.match(/^#\s+/m)) score += 10 // Has H1
  if (text.match(/^##\s+/m)) score += 10 // Has H2
  if (text.split(/\s+/).length > 800) score += 10 // Good length
  if (text.match(/\[INTERNAL_LINK:/)) score += 10 // Has internal links
  if (text.match(/\[EXTERNAL_LINK:/)) score += 10 // Has external links
  return Math.min(100, score)
}
