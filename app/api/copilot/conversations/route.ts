import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

async function ensureUserExists(supabase: any, user: any) {
  // Check if user exists in public.users table
  const { data: existingUser } = await supabase.from("users").select("id").eq("id", user.id).single()

  // If user doesn't exist, create it
  if (!existingUser) {
    console.log("[v0] User not found in users table, creating:", user.id)
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("[v0] Failed to create user:", insertError)
      throw insertError
    }
    console.log("[v0] User created successfully:", user.id)
  }
}

export async function POST(req: NextRequest) {
  const { title, description, contextType } = await req.json()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("[v0] Creating conversation for user:", user.id)

  try {
    await ensureUserExists(supabase, user)

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title,
        description,
        context_type: contextType,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Failed to create conversation:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Conversation created successfully:", data.id)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error in conversation creation:", error)
    return NextResponse.json({ error: error.message || "Failed to create conversation" }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await ensureUserExists(supabase, user)
  } catch (error) {
    console.error("[v0] Failed to ensure user exists:", error)
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
