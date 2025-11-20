-- Social Media & CMS Connections
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('wordpress', 'shopify', 'linkedin', 'twitter', 'facebook', 'instagram', 'medium', 'youtube')),
  connection_name VARCHAR(255) NOT NULL, -- e.g. "My Personal Blog" or "Company LinkedIn"
  credentials JSONB NOT NULL, -- Stores encrypted tokens/keys
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own connections" ON platform_connections;
CREATE POLICY "Users own connections" ON platform_connections
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

-- Index
CREATE INDEX IF NOT EXISTS idx_platform_connections_user ON platform_connections(user_id);
