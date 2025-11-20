import type React from "react"
import { Navigation } from "@/components/navigation"

export default function CopilotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Navigation />
      {children}
    </div>
  )
}
