import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messageId, isPositive, feedbackText, context } = await req.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // 1. Get User Profile
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("auth_user_id", user.id).single()

    if (!profile) return new NextResponse("Profile not found", { status: 404 })

    // 2. Update Interaction Satisfaction Score (if we had the interaction ID)
    // For now, we'll log it in a new 'copilot_feedback' table or just update preferences directly
    // Since we want "Learning", let's update the user's preferences JSON

    const currentPrefs = profile.copilot_preferences || {}
    const newPrefs = { ...currentPrefs }

    // Simple learning logic: Track preferred topics and styles
    if (isPositive) {
      if (context?.niche) {
        newPrefs.favorite_niches = [...(newPrefs.favorite_niches || []), context.niche]
        // Remove duplicates
        newPrefs.favorite_niches = [...new Set(newPrefs.favorite_niches)]
      }
      if (context?.style) {
        newPrefs.preferred_style = context.style
      }
      newPrefs.last_positive_interaction = new Date().toISOString()
    } else {
      if (context?.style) {
        newPrefs.avoid_styles = [...(newPrefs.avoid_styles || []), context.style]
      }
    }

    // 3. Save updated preferences (The "Learning" part)
    const { error } = await supabase
      .from("user_profiles")
      .update({
        copilot_preferences: newPrefs,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    if (error) throw error

    return NextResponse.json({ success: true, learned: true })
  } catch (error) {
    console.error("[v0] Feedback error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
