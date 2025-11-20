-- Fix platform_connections to reference users table correctly
DROP TABLE IF EXISTS platform_connections CASCADE;

CREATE TABLE platform_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('wordpress', 'shopify', 'linkedin', 'twitter', 'facebook', 'instagram', 'medium', 'youtube')),
  connection_name VARCHAR(255) NOT NULL,
  credentials JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own connections" ON platform_connections;
CREATE POLICY "Users can view own connections" 
  ON platform_connections FOR SELECT 
  USING (user_id IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own connections" ON platform_connections;
CREATE POLICY "Users can insert own connections" 
  ON platform_connections FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own connections" ON platform_connections;
CREATE POLICY "Users can update own connections" 
  ON platform_connections FOR UPDATE 
  USING (user_id IN (SELECT id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own connections" ON platform_connections;
CREATE POLICY "Users can delete own connections" 
  ON platform_connections FOR DELETE 
  USING (user_id IN (SELECT id FROM users WHERE id = auth.uid()));

-- Index
CREATE INDEX IF NOT EXISTS idx_platform_connections_user ON platform_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_platform ON platform_connections(platform);
