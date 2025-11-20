"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Connection {
  id: string
  platform: string
  connection_name: string
  is_active: boolean
  last_synced_at: string | null
}

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      console.log("[v0] Fetching connections...")
      const { data, error } = await supabase
        .from("platform_connections")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching connections:", error)
        throw error
      }
      console.log("[v0] Connections fetched:", data)
      setConnections(data || [])
    } catch (error) {
      console.error("[v0] Error in fetchConnections:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    console.log("[v0] Attempting to connect to:", platform)
    setConnecting(platform)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        console.error("[v0] User not authenticated:", userError)
        throw new Error("You must be logged in to connect platforms")
      }

      console.log("[v0] User ID:", userData.user.id)

      // Simulate connection delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data, error } = await supabase
        .from("platform_connections")
        .insert({
          platform,
          connection_name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
          credentials: { token: "demo_token_" + Date.now(), connected_at: new Date().toISOString() },
          user_id: userData.user.id,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error inserting connection:", error)
        throw error
      }

      console.log("[v0] Connection created:", data)
      setConnections([data, ...connections])
      toast.success(`Connected to ${platform} successfully!`)
    } catch (error: any) {
      console.error("[v0] Connection error:", error)
      toast.error(error.message || "Failed to connect. Please try again.")
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (id: string) => {
    console.log("[v0] Disconnecting:", id)
    try {
      const { error } = await supabase.from("platform_connections").delete().eq("id", id)

      if (error) {
        console.error("[v0] Disconnect error:", error)
        throw error
      }

      setConnections(connections.filter((c) => c.id !== id))
      toast.success("Disconnected successfully")
    } catch (error) {
      console.error("[v0] Disconnect failed:", error)
      toast.error("Failed to disconnect")
    }
  }

  const isConnected = (platform: string) => connections.some((c) => c.platform === platform)

  const SocialCard = ({ platform, icon: Icon, label, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {isConnected(platform) ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              Connected
            </Badge>
          ) : (
            <Badge variant="outline">Not Connected</Badge>
          )}
        </div>
        {isConnected(platform) ? (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => handleDisconnect(connections.find((c) => c.platform === platform)?.id!)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Disconnect
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            disabled={connecting === platform}
            onClick={() => handleConnect(platform)}
          >
            {connecting === platform ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Manage your connections to CMS and Social Media platforms.</p>
        </div>
      </div>

      <Tabs defaultValue="social" className="space-y-4">
        <TabsList>
          <TabsTrigger value="social">Social Networks</TabsTrigger>
          <TabsTrigger value="cms">CMS & Blogs</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SocialCard platform="linkedin" icon={Linkedin} label="LinkedIn" color="text-blue-600" />
            <SocialCard platform="twitter" icon={Twitter} label="X (Twitter)" color="text-black dark:text-white" />
            <SocialCard platform="facebook" icon={Facebook} label="Facebook" color="text-blue-500" />
            <SocialCard platform="instagram" icon={Instagram} label="Instagram" color="text-pink-500" />
            <SocialCard platform="youtube" icon={Youtube} label="YouTube" color="text-red-600" />
          </div>
        </TabsContent>

        <TabsContent value="cms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WordPress</CardTitle>
                <Globe className="h-4 w-4 text-blue-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {isConnected("wordpress") ? (
                    <Badge variant="default" className="bg-green-500">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Connected</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() =>
                    isConnected("wordpress")
                      ? handleDisconnect(connections.find((c) => c.platform === "wordpress")?.id!)
                      : handleConnect("wordpress")
                  }
                >
                  {isConnected("wordpress") ? "Disconnect" : "Connect Site"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shopify</CardTitle>
                <Globe className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {isConnected("shopify") ? (
                    <Badge variant="default" className="bg-green-500">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Connected</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() =>
                    isConnected("shopify")
                      ? handleDisconnect(connections.find((c) => c.platform === "shopify")?.id!)
                      : handleConnect("shopify")
                  }
                >
                  {isConnected("shopify") ? "Disconnect" : "Connect Store"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medium</CardTitle>
                <Globe className="h-4 w-4 text-black dark:text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {isConnected("medium") ? (
                    <Badge variant="default" className="bg-green-500">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Connected</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() =>
                    isConnected("medium")
                      ? handleDisconnect(connections.find((c) => c.platform === "medium")?.id!)
                      : handleConnect("medium")
                  }
                >
                  {isConnected("medium") ? "Disconnect" : "Connect Account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Active Connections</h2>
        <div className="rounded-md border">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : connections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active connections found. Connect a platform above to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((conn) => (
                  <div key={conn.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{conn.connection_name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{conn.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Last synced:{" "}
                        {conn.last_synced_at ? new Date(conn.last_synced_at).toLocaleDateString() : "Never"}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => handleDisconnect(conn.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
