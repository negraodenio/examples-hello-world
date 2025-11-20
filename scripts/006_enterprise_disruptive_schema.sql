-- EXTENSÕES AVANÇADAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABELA DE USUÁRIOS EXPANDIDA (se não existe)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
    CREATE TABLE user_profiles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      auth_user_id UUID REFERENCES auth.users(id) UNIQUE,
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(255),
      company VARCHAR(255),
      plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise', 'api')),
      credits_balance INTEGER DEFAULT 100,
      credits_used_today INTEGER DEFAULT 0,
      api_key VARCHAR(255) UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64'),
      api_calls_today INTEGER DEFAULT 0,
      api_calls_total BIGINT DEFAULT 0,
      revenue_total DECIMAL(12,2) DEFAULT 0,
      revenue_this_month DECIMAL(12,2) DEFAULT 0,
      subscription_id VARCHAR(255),
      subscription_status VARCHAR(50),
      trial_ends_at TIMESTAMP WITH TIME ZONE,
      settings JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- TABELA DE PERFIS DE IA JORNALÍSTICA (atualizada)
CREATE TABLE IF NOT EXISTS ai_journalist_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  specialization TEXT[] NOT NULL,
  writing_style TEXT NOT NULL,
  tone VARCHAR(50) NOT NULL,
  target_audience TEXT,
  language VARCHAR(10) DEFAULT 'pt-BR',
  avatar_url TEXT,
  prompt_template TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  pricing_tier VARCHAR(20) DEFAULT 'standard',
  cost_per_use DECIMAL(5,2) DEFAULT 0.15,
  usage_count BIGINT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE ARTIGOS AVANÇADA (atualizada)
CREATE TABLE IF NOT EXISTS articles_advanced (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE,
  content TEXT NOT NULL,
  content_html TEXT NOT NULL,
  summary TEXT,
  meta_description VARCHAR(300),
  keywords TEXT[] DEFAULT '{}',
  ai_journalist_id UUID REFERENCES ai_journalist_profiles(id),
  
  -- SEO & Performance
  seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  readability_score INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  
  -- Status & Publishing
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'optimized', 'published', 'archived')),
  language VARCHAR(10) DEFAULT 'pt-BR',
  
  -- Source & Attribution
  source_type VARCHAR(50) CHECK (source_type IN ('original', 'news_rewrite', 'template', 'api')),
  source_url TEXT,
  source_data JSONB,
  
  -- Engagement & Revenue
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_time_on_page INTEGER DEFAULT 0,
  
  -- Revenue Tracking
  revenue_total DECIMAL(10,2) DEFAULT 0,
  revenue_adsense DECIMAL(10,2) DEFAULT 0,
  revenue_affiliate DECIMAL(10,2) DEFAULT 0,
  revenue_sponsored DECIMAL(10,2) DEFAULT 0,
  cost_to_generate DECIMAL(5,2) DEFAULT 0,
  roi DECIMAL(8,2) DEFAULT 0,
  
  -- AI & Generation Data
  generation_model VARCHAR(100),
  generation_cost DECIMAL(5,2) DEFAULT 0,
  generation_time INTEGER DEFAULT 0,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  
  -- Metadata & Tracking
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  featured_image_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  last_viewed_at TIMESTAMP WITH TIME ZONE
);

-- TABELA DE NEWS SOURCES (atualizada)
CREATE TABLE IF NOT EXISTS news_sources_global (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  country VARCHAR(10) NOT NULL,
  language VARCHAR(10) NOT NULL,
  category VARCHAR(100),
  api_endpoint TEXT,
  reliability_score DECIMAL(3,2) DEFAULT 5.0,
  articles_per_hour INTEGER DEFAULT 0,
  last_crawled_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE NOTÍCIAS PROCESSADAS (atualizada)
CREATE TABLE IF NOT EXISTS processed_news_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_title VARCHAR(500) NOT NULL,
  original_content TEXT,
  original_url TEXT NOT NULL,
  source_id UUID REFERENCES news_sources_global(id),
  
  -- AI Analysis
  relevance_score INTEGER DEFAULT 0 CHECK (relevance_score >= 0 AND relevance_score <= 10),
  viral_potential INTEGER DEFAULT 0 CHECK (viral_potential >= 0 AND viral_potential <= 10),
  monetization_potential INTEGER DEFAULT 0 CHECK (monetization_potential >= 0 AND monetization_potential <= 10),
  sentiment VARCHAR(20) DEFAULT 'neutral',
  
  -- Keywords & Classification
  auto_keywords TEXT[] DEFAULT '{}',
  auto_tags TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  
  -- Rewrite Tracking
  rewrite_count INTEGER DEFAULT 0,
  total_revenue_generated DECIMAL(10,2) DEFAULT 0,
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE API USAGE E BILLING
CREATE TABLE IF NOT EXISTS api_usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  request_data JSONB,
  response_status INTEGER,
  response_time INTEGER,
  cost DECIMAL(8,4) DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE REVENUE TRACKING
CREATE TABLE IF NOT EXISTS revenue_events_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles_advanced(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  source VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA DE PUBLICAÇÕES MULTI-PLATAFORMA
CREATE TABLE IF NOT EXISTS multi_platform_publications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES articles_advanced(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  platform VARCHAR(50) NOT NULL,
  platform_post_id VARCHAR(255),
  platform_url TEXT,
  
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  
  platform_config JSONB DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  views INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES OTIMIZADOS
CREATE INDEX IF NOT EXISTS idx_articles_advanced_user_status ON articles_advanced(user_id, status);
CREATE INDEX IF NOT EXISTS idx_articles_advanced_published_at ON articles_advanced(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_advanced_revenue ON articles_advanced(revenue_total DESC) WHERE revenue_total > 0;
CREATE INDEX IF NOT EXISTS idx_articles_advanced_seo_score ON articles_advanced(seo_score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_advanced_keywords_gin ON articles_advanced USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_articles_advanced_full_text ON articles_advanced USING GIN(to_tsvector('english', title || ' ' || content));

-- VIEWS PARA ANALYTICS
CREATE OR REPLACE VIEW user_analytics_dashboard AS
SELECT 
  up.id,
  up.full_name,
  up.plan,
  up.credits_balance,
  up.revenue_total,
  up.revenue_this_month,
  COUNT(a.id) as total_articles,
  COUNT(a.id) FILTER (WHERE a.status = 'published') as published_articles,
  AVG(a.seo_score) as avg_seo_score,
  SUM(a.views) as total_views,
  SUM(a.revenue_total) as articles_revenue,
  AVG(a.roi) as avg_roi
FROM user_profiles up
LEFT JOIN articles_advanced a ON up.id = a.user_id
GROUP BY up.id, up.full_name, up.plan, up.credits_balance, up.revenue_total, up.revenue_this_month;

-- ROW LEVEL SECURITY
ALTER TABLE articles_advanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_platform_publications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own articles advanced" ON articles_advanced;
CREATE POLICY "Users manage own articles advanced" ON articles_advanced
FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users view own API usage tracking" ON api_usage_tracking;
CREATE POLICY "Users view own API usage tracking" ON api_usage_tracking
FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

-- INSERIR PERFIS INICIAIS (se não existem)
INSERT INTO ai_journalist_profiles (name, description, specialization, writing_style, tone, prompt_template, system_prompt, pricing_tier, cost_per_use) 
VALUES
('Ana Investigativa Pro', 'Jornalista investigativa especializada em política e economia', ARRAY['política', 'economia', 'corrupção'], 'Analytical and in-depth', 'investigativo', 'Escreva um artigo investigativo sobre {topic}...', 'Você é uma jornalista investigativa experiente...', 'premium', 0.35),
('Carlos Tech Guru', 'Expert em tecnologia, startups e inovação', ARRAY['tecnologia', 'IA', 'startups', 'blockchain'], 'Technical but accessible', 'técnico', 'Crie um artigo técnico sobre {topic}...', 'Você é um jornalista de tecnologia...', 'standard', 0.25),
('Maria Global News', 'Correspondente internacional especializada em geopolítica', ARRAY['internacional', 'geopolítica', 'economia global'], 'Formal and contextual', 'formal', 'Desenvolva análise internacional sobre {topic}...', 'Você é uma correspondente internacional...', 'premium', 0.30),
('João Viral Content', 'Especialista em conteúdo viral e redes sociais', ARRAY['viral', 'redes sociais', 'entretenimento'], 'Engaging and shareable', 'casual', 'Crie conteúdo viral sobre {topic}...', 'Você é um criador de conteúdo viral...', 'standard', 0.20)
ON CONFLICT DO NOTHING;
