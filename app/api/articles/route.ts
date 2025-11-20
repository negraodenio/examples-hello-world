import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userProfile = await supabase.from("user_profiles").select("id").eq("auth_user_id", user.id).single()

  if (!userProfile.data) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 })
  }

  let query = supabase
    .from("news_articles")
    .select("*")
    .eq("user_id", userProfile.data.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq("status", status)
  }

  const { data: articles, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ articles })
}
