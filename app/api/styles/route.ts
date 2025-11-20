import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
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

  const { data: styles, error } = await supabase
    .from("journalist_styles")
    .select("*")
    .eq("user_id", userProfile.data.id)
    .order("is_default", { ascending: false })
    .order("usage_count", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ styles })
}

export async function POST(req: Request) {
  console.log("[v0] API /api/styles POST request received")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] User authenticated:", user?.id)

  if (!user) {
    console.log("[v0] No user found, returning 401")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userProfile = await supabase.from("user_profiles").select("id").eq("auth_user_id", user.id).single()

  console.log("[v0] User profile:", userProfile.data?.id)

  if (!userProfile.data) {
    console.log("[v0] No user profile found, returning 404")
    return NextResponse.json({ error: "User profile not found" }, { status: 404 })
  }

  const { id, name, description, tone, styleCharacteristics, trainingText1, trainingText2, trainingText3, isDefault } =
    await req.json()

  console.log("[v0] Request data:", {
    id,
    name,
    tone,
    isDefault,
    hasTraining1: !!trainingText1,
    hasTraining2: !!trainingText2,
    hasTraining3: !!trainingText3,
  })

  if (isDefault) {
    console.log("[v0] Setting other styles to non-default")
    await supabase.from("journalist_styles").update({ is_default: false }).eq("user_id", userProfile.data.id)
  }

  // If ID exists, update existing style
  if (id) {
    console.log("[v0] Updating existing style:", id)
    const { data: updatedStyle, error } = await supabase
      .from("journalist_styles")
      .update({
        name,
        description,
        tone,
        style_characteristics: styleCharacteristics,
        training_text_1: trainingText1 || null,
        training_text_2: trainingText2 || null,
        training_text_3: trainingText3 || null,
        is_default: isDefault || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userProfile.data.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating style:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Style updated successfully:", updatedStyle.id)
    return NextResponse.json({ style: updatedStyle, success: true })
  }

  // Create new style with 3 training texts
  console.log("[v0] Creating new style")
  const { data: newStyle, error } = await supabase
    .from("journalist_styles")
    .insert({
      user_id: userProfile.data.id,
      name,
      description,
      tone,
      style_characteristics: styleCharacteristics,
      training_text_1: trainingText1 || null,
      training_text_2: trainingText2 || null,
      training_text_3: trainingText3 || null,
      is_default: isDefault || false,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating style:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log("[v0] Style created successfully:", newStyle.id)
  return NextResponse.json({ style: newStyle, success: true })
}
