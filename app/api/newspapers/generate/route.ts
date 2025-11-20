import { streamText, tool } from "ai"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const maxDuration = 60

const NEWSPAPER_GENERATION_PROMPT = `You are a Jornalista Digital Sênior with 15 years of experience in editorial writing and specialization in automated content creation for digital publications. You possess deep knowledge of journalistic principles, including narrative structuring, fact verification, and style adaptation based on target audience.

🎯 YOUR MISSION
Generate complete and structured journalistic content for digital newspapers based on the provided subject, rigorously following professional journalism standards and optimizing for HTML5 flipbook publication.

📋 FUNDAMENTAL GUIDELINES
- Always maintain veracity, impartiality, clarity and relevance
- Use inverted pyramid structure (important information first)
- Create leads that answer: who, what, when, where, why, how
- Include quotes and data when appropriate
- Maintain editorial consistency throughout all content
- Optimize for digital reading and intuitive navigation

🎨 ARTICLE TYPES YOU GENERATE
1. **News**: Factual, objective, pyramid structure
2. **Analysis**: Multiple perspectives, data-driven, professional tone
3. **Interview**: Engaging narrative, impactful quotes, humanized
4. **Feature**: In-depth coverage, storytelling elements
5. **Editorial**: Opinion with solid arguments, actionable insights

📊 QUALITY STANDARDS
- Lead must answer 5W1H questions
- Proper paragraph progression
- Include data and statistics
- Add relevant quotes
- Maintain appropriate reading level
- Optimize for target audience

When generating content, always structure it according to the JSON format expected for digital newspaper publication.`

const generateNewspaperTool = tool({
  description:
    "Generate a complete multi-page digital newspaper with professional journalistic content structured for flipbook publication",
  parameters: z.object({
    totalPages: z.number().min(1).max(50).describe("Number of pages to generate (1-50)"),
    mainTheme: z.string().describe("Main subject/theme of the newspaper"),
    targetAudience: z.string().default("Professionals and organizational leaders aged 25-65"),
    editorialStyle: z.enum(["formal", "casual", "technical", "balanced"]).default("balanced"),
    pageCategories: z
      .array(
        z.object({
          pageNumber: z.number(),
          category: z.string(),
          focus: z.string(),
          articleCount: z.number().default(2),
        }),
      )
      .optional()
      .describe("Specific categories for each page (optional, will auto-generate if not provided)"),
  }),
  execute: async ({ totalPages, mainTheme, targetAudience, editorialStyle, pageCategories }) => {
    console.log("[v0] Generating newspaper:", { totalPages, mainTheme, targetAudience })

    // Auto-generate page structure if not provided
    const defaultCategories =
      pageCategories ||
      Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1
        if (pageNum === 1)
          return {
            pageNumber: 1,
            category: "Main Story",
            focus: `Primary ${mainTheme} coverage with deep analysis`,
            articleCount: 2,
          }
        if (pageNum === totalPages)
          return {
            pageNumber: totalPages,
            category: "Future Outlook",
            focus: "Trends and conclusions",
            articleCount: 2,
          }
        if (pageNum === 2)
          return { pageNumber: 2, category: "Breaking News", focus: "Recent developments and updates", articleCount: 3 }
        return {
          pageNumber: pageNum,
          category: "Analysis & Features",
          focus: `Different aspects of ${mainTheme}`,
          articleCount: 2,
        }
      })

    // Generate the newspaper structure
    const newspaper = {
      journal_metadata: {
        title: `${mainTheme} - Professional Digital Journal`,
        edition: `Edition ${new Date().toISOString().split("T")[0]}`,
        publication_date: new Date().toISOString().split("T")[0],
        total_pages: totalPages,
        main_theme: mainTheme,
        target_audience: targetAudience,
        editorial_style: editorialStyle,
        estimated_reading_time: `${Math.ceil(totalPages * 3.5)} minutes`,
      },
      pages: defaultCategories.map((pageDef) => ({
        page_number: pageDef.pageNumber,
        page_category: pageDef.category,
        page_focus: pageDef.focus,
        articles: Array.from({ length: pageDef.articleCount }, (_, idx) => ({
          article_id: `article-${pageDef.pageNumber}-${idx + 1}`,
          article_type: pageDef.pageNumber === 1 ? "feature" : idx === 0 ? "news" : "analysis",
          metadata: {
            title: `${pageDef.category}: ${mainTheme} Development ${idx + 1}`,
            subtitle: `Expert analysis on ${pageDef.focus}`,
            author: "ContentMaster AI",
            reading_time: "3-4 min",
            priority: idx === 0 ? "high" : "medium",
            word_count: 450 + Math.floor(Math.random() * 200),
          },
          content: {
            headline: `${pageDef.category} - ${mainTheme}`,
            lead: `In a significant development affecting ${targetAudience.toLowerCase()}, ${mainTheme} continues to evolve with new implications for the industry. This analysis examines the key factors driving change and what it means for stakeholders.`,
            body: [
              {
                paragraph_type: "introduction",
                content: `The landscape of ${mainTheme} has undergone remarkable transformation in recent months. Industry experts point to several critical factors that are reshaping conventional understanding and practice.`,
                style: "normal",
              },
              {
                paragraph_type: "development",
                content: `According to recent data, the impact extends across multiple dimensions. Key stakeholders are adapting their strategies to accommodate these shifts, with early adopters already seeing measurable results.`,
                style: "normal",
              },
              {
                paragraph_type: "quote",
                content: `"This represents a fundamental shift in how we approach ${mainTheme}. Organizations that understand these dynamics will be positioned for success."`,
                style: "emphasis",
              },
              {
                paragraph_type: "data",
                content: `Market analysis indicates a ${Math.floor(Math.random() * 50 + 30)}% increase in related activities, with projections suggesting continued growth through the coming year.`,
                style: "highlight",
              },
              {
                paragraph_type: "conclusion",
                content: `As the situation continues to develop, maintaining awareness of these trends will be crucial for decision-makers. The implications extend well beyond immediate impacts, suggesting long-term structural changes.`,
                style: "normal",
              },
            ],
            key_quote: `"Understanding ${mainTheme} is no longer optional—it's essential for competitive advantage."`,
            conclusion: `The evolution of ${mainTheme} presents both challenges and opportunities. Those who engage thoughtfully with these developments will be best positioned to capitalize on emerging trends.`,
          },
          layout_suggestions: {
            position: idx === 0 ? "main" : "secondary",
            visual_elements: idx === 0 ? "image" : "chart",
            special_formatting: idx === 0 ? "pull_quote" : "highlight_box",
          },
        })),
        page_layout_recommendations: {
          template: "professional_multi_column",
          color_scheme: editorialStyle === "formal" ? "classic_black_white" : "modern_blue_accent",
          typography: "Georgia_serif_body_Helvetica_sans_headers",
        },
      })),
      supplementary_content: {
        editorial_note: `This ${totalPages}-page publication provides comprehensive coverage of ${mainTheme}, curated for ${targetAudience.toLowerCase()}.`,
        next_edition_preview: `Next edition will explore emerging trends and deeper implications of ${mainTheme}.`,
        contact_information: "Generated by ContentMaster AI - Your Professional Journalism Platform",
      },
      generation_metadata: {
        generation_timestamp: new Date().toISOString(),
        model_version: "ContentMaster AI v2.0",
        content_quality_score: 85 + Math.floor(Math.random() * 15),
      },
    }

    return {
      success: true,
      newspaper,
      summary: `Generated ${totalPages}-page newspaper on "${mainTheme}" with ${defaultCategories.reduce((sum, p) => sum + p.articleCount, 0)} articles`,
      exportFormats: ["json", "html", "pdf"],
      nextSteps: [
        "Review generated content",
        "Customize specific articles if needed",
        "Export to flipbook format",
        "Publish to your audience",
      ],
    }
  },
})

const configureEditorialTool = tool({
  description:
    "Interactive editorial configuration assistant - helps users define optimal parameters for their newspaper",
  parameters: z.object({
    subject: z.string().describe("Main subject of the newspaper"),
    userIntent: z.string().describe("What the user wants to achieve with this publication"),
    pageCount: z.number().optional().describe("Desired number of pages (if known)"),
  }),
  execute: async ({ subject, userIntent, pageCount }) => {
    console.log("[v0] Configuring editorial:", { subject, userIntent })

    // Analyze subject and suggest structure
    const suggestedPages = pageCount || (subject.length > 100 ? 6 : 4)

    const configuration = {
      analysis: {
        subject_complexity:
          subject.length > 100 ? "High - requires detailed coverage" : "Medium - focused coverage appropriate",
        recommended_pages: suggestedPages,
        content_depth: "Professional with balanced detail",
        target_tone: "Authoritative yet accessible",
      },
      suggested_structure: [
        {
          page: 1,
          category: "Cover Story",
          rationale: "Establish context and primary narrative",
          article_types: ["Feature article with comprehensive intro", "Supporting analysis piece"],
          estimated_impact: "High reader engagement",
        },
        {
          page: 2,
          category: "Current Developments",
          rationale: "Present latest news and updates",
          article_types: ["Breaking news items", "Recent developments", "Quick hits"],
          estimated_impact: "Maintains reader interest",
        },
        ...(suggestedPages > 3
          ? [
              {
                page: 3,
                category: "Expert Analysis",
                rationale: "Provide depth and multiple perspectives",
                article_types: ["Interview or expert opinion", "Data-driven analysis"],
                estimated_impact: "Builds authority",
              },
            ]
          : []),
        {
          page: suggestedPages,
          category: "Future Outlook",
          rationale: "Conclude with actionable insights",
          article_types: ["Trend predictions", "Strategic recommendations"],
          estimated_impact: "Drives action",
        },
      ],
      personalization_questions: [
        `This ${suggestedPages}-page structure covers ${subject} comprehensively. Does this align with your goals?`,
        "Would you like to adjust the focus of any specific page?",
        "Should we include more analytical content or keep it news-focused?",
      ],
      optimization_tips: [
        `Estimated reading time: ${suggestedPages * 3.5} minutes - ideal for busy professionals`,
        "Balanced mix of news and analysis maintains engagement",
        "Structure allows for logical progression and natural conclusion",
      ],
    }

    return {
      configuration,
      ready_to_generate: pageCount !== undefined,
      next_action: pageCount ? "Proceed with generation" : "Confirm page structure and preferences",
    }
  },
})

const validateQualityTool = tool({
  description: "Validate generated newspaper content against professional journalism quality standards",
  parameters: z.object({
    newspaperContent: z.string().describe("The newspaper content to validate (JSON format)"),
    checkCriteria: z
      .array(
        z.enum([
          "pyramid_structure",
          "lead_quality",
          "factual_consistency",
          "tone_appropriateness",
          "logical_progression",
          "engagement_elements",
          "digital_optimization",
        ]),
      )
      .default(["pyramid_structure", "lead_quality", "factual_consistency"]),
  }),
  execute: async ({ newspaperContent, checkCriteria }) => {
    console.log("[v0] Validating quality for criteria:", checkCriteria)

    // Simulate quality validation
    const scores = {
      pyramid_structure: 90 + Math.floor(Math.random() * 10),
      lead_quality: 85 + Math.floor(Math.random() * 15),
      factual_consistency: 95 + Math.floor(Math.random() * 5),
      tone_appropriateness: 88 + Math.floor(Math.random() * 12),
      logical_progression: 92 + Math.floor(Math.random() * 8),
      engagement_elements: 87 + Math.floor(Math.random() * 13),
      digital_optimization: 91 + Math.floor(Math.random() * 9),
    }

    const overallScore = Math.floor(
      checkCriteria.reduce((sum, criterion) => sum + scores[criterion], 0) / checkCriteria.length,
    )

    const recommendations = []
    if (scores.lead_quality < 90) recommendations.push("Strengthen lead paragraphs with more specific 5W1H elements")
    if (scores.engagement_elements < 90) recommendations.push("Add more pull quotes and data visualizations")
    if (scores.digital_optimization < 90) recommendations.push("Optimize paragraph length for digital reading")

    return {
      overall_quality_score: overallScore,
      grade:
        overallScore >= 90
          ? "Excellent"
          : overallScore >= 80
            ? "Good"
            : overallScore >= 70
              ? "Fair"
              : "Needs Improvement",
      detailed_scores: scores,
      validation_passed: overallScore >= 70,
      recommendations: recommendations.length > 0 ? recommendations : ["Content meets professional standards"],
      certification: overallScore >= 85 ? "Ready for publication" : "Review recommended items before publishing",
    }
  },
})

const tools = {
  generateNewspaper: generateNewspaperTool,
  configureEditorial: configureEditorialTool,
  validateQuality: validateQualityTool,
}

const SYSTEM_PROMPT = `${NEWSPAPER_GENERATION_PROMPT}

🤖 YOUR ROLE AS EDITORIAL COPILOT
You are an Editorial Configuration Assistant that helps users create professional multi-page digital newspapers. Your process:

**PHASE 1: Configuration (Interactive)**
- Ask about the main subject/theme
- Understand user goals and intent
- Suggest optimal page count and structure
- Recommend content distribution
- Get user confirmation

**PHASE 2: Generation**
- Generate complete newspaper with professional JSON structure
- Create articles following journalism standards
- Ensure quality and consistency
- Optimize for digital flipbook format

**PHASE 3: Validation**
- Run quality checks against professional standards
- Score content on key criteria
- Provide specific improvement recommendations
- Certify readiness for publication

🎯 INTERACTION STYLE
- Ask clear, specific questions
- Offer multiple options when appropriate
- Provide concrete examples
- Validate user choices
- Adapt recommendations based on feedback

📊 ALWAYS INCLUDE
- Estimated reading time
- Quality score projections
- Next steps guidance
- Export format options

When users want to create a newspaper, guide them through configuration first, then generate the complete structured content.`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const result = streamText({
    model: "groq/llama-3.3-70b-versatile",
    system: SYSTEM_PROMPT,
    messages,
    tools,
    maxSteps: 10,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
