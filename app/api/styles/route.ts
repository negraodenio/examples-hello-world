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

  const { id, name, description, tone, styleCharacteristics, trainingText1, trainingText2, trainingText3, isDefault } =
    await req.json()

  if (isDefault) {
    await supabase.from("journalist_styles").update({ is_default: false }).eq("user_id", userProfile.data.id)
  }

  // If ID exists, update existing style
  if (id) {
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ style: updatedStyle })
  }

  // Create new style with 3 training texts
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ style: newStyle })
}
