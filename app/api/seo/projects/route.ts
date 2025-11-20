import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: projects, error } = await supabase
    .from("seo_projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching SEO projects:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, domain, description, industry, target_audience, brand_tone, primary_language, project_type } = body

  const { data: project, error } = await supabase
    .from("seo_projects")
    .insert({
      user_id: user.id,
      name,
      domain,
      description,
      industry,
      target_audience,
      brand_tone,
      primary_language: primary_language || "en",
      project_type: project_type || "blog",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating SEO project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ project })
}
