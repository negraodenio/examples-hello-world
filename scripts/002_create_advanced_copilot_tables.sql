-- Advanced Copilot System Database Schema

-- Extension for advanced features
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- User Profiles (Enhanced)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  company VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'professional', 'enterprise')),
  credits_balance INTEGER DEFAULT 100,
  total_revenue_generated DECIMAL(12,2) DEFAULT 0,
  copilot_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copilot Sessions
CREATE TABLE IF NOT EXISTS copilot_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_interactions INTEGER DEFAULT 0,
  context_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copilot Interactions
CREATE TABLE IF NOT EXISTS copilot_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES copilot_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  agent_used VARCHAR(100),
  functions_called JSONB DEFAULT '[]',
  context JSONB DEFAULT '{}',
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  execution_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copilot Actions
CREATE TABLE IF NOT EXISTS copilot_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  interaction_id UUID REFERENCES copilot_interactions(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  action_data JSONB NOT NULL,
  result JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_copilot_interactions_user ON copilot_interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_copilot_sessions_user ON copilot_sessions(user_id, session_start DESC);
CREATE INDEX IF NOT EXISTS idx_copilot_actions_type ON copilot_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_copilot_interactions_session ON copilot_interactions(session_id);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users own profile" ON user_profiles;
CREATE POLICY "Users own profile" ON user_profiles
  FOR ALL USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Users own copilot sessions" ON copilot_sessions;
CREATE POLICY "Users own copilot sessions" ON copilot_sessions
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users own interactions" ON copilot_interactions;
CREATE POLICY "Users own interactions" ON copilot_interactions
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users own actions" ON copilot_actions;
CREATE POLICY "Users own actions" ON copilot_actions
  FOR ALL USING (interaction_id IN (
    SELECT id FROM copilot_interactions WHERE user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  ));

-- Function to increment interactions
CREATE OR REPLACE FUNCTION increment_session_interactions(session_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE copilot_sessions 
  SET total_interactions = total_interactions + 1,
      session_end = NOW()
  WHERE id = session_uuid;
END;
$$ LANGUAGE plpgsql;

-- Insert user profiles for existing auth users
INSERT INTO user_profiles (auth_user_id, email, full_name)
SELECT 
  au.id, 
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email)
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles up WHERE up.auth_user_id = au.id
)
ON CONFLICT (auth_user_id) DO NOTHING;
