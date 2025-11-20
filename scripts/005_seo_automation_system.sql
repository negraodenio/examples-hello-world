-- Multi-Project System (ideal para agências)
CREATE TABLE IF NOT EXISTS seo_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(500),
  description TEXT,
  industry VARCHAR(100),
  target_audience TEXT,
  brand_tone VARCHAR(100),
  primary_language VARCHAR(10) DEFAULT 'en',
  project_type VARCHAR(50) DEFAULT 'blog' CHECK (project_type IN ('blog', 'ecommerce', 'saas', 'news', 'agency')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base por Projeto (brand voice, guidelines, etc)
CREATE TABLE IF NOT EXISTS project_knowledge_base (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content_type VARCHAR(100) CHECK (content_type IN ('brand_voice', 'guidelines', 'product_info', 'faq', 'glossary', 'style_guide', 'document')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Articles com multi-language support
CREATE TABLE IF NOT EXISTS seo_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  title VARCHAR(1000) NOT NULL,
  slug VARCHAR(1000) NOT NULL,
  content TEXT NOT NULL,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  language VARCHAR(10) DEFAULT 'en',
  keywords TEXT[],
  target_keyword VARCHAR(255),
  readability_score INTEGER,
  seo_score INTEGER,
  word_count INTEGER,
  reading_time VARCHAR(50),
  featured_image_url TEXT,
  has_table_of_contents BOOLEAN DEFAULT false,
  has_faq BOOLEAN DEFAULT false,
  internal_links_count INTEGER DEFAULT 0,
  external_links_count INTEGER DEFAULT 0,
  images_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'review', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  cms_post_id VARCHAR(255),
  cms_platform VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Technical Issues (identificados por agentes)
CREATE TABLE IF NOT EXISTS seo_technical_issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  article_id UUID REFERENCES seo_articles(id) ON DELETE CASCADE,
  issue_type VARCHAR(100) NOT NULL CHECK (issue_type IN ('missing_meta', 'missing_alt_text', 'broken_links', 'missing_schema', 'duplicate_content', 'poor_heading_structure', 'missing_canonical', 'slow_load', 'mobile_issues')),
  severity VARCHAR(50) CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description TEXT NOT NULL,
  recommendation TEXT,
  auto_fix_available BOOLEAN DEFAULT false,
  fixed BOOLEAN DEFAULT false,
  fixed_at TIMESTAMP WITH TIME ZONE,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AutoBlog Configuration (RSS, Keywords, YouTube)
CREATE TABLE IF NOT EXISTS autoblog_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) CHECK (source_type IN ('rss_feed', 'keywords', 'youtube', 'news_api', 'trending')),
  source_config JSONB NOT NULL,
  schedule VARCHAR(50) CHECK (schedule IN ('manual', 'hourly', 'daily', 'weekly', 'monthly')),
  auto_publish BOOLEAN DEFAULT false,
  publish_to_social BOOLEAN DEFAULT false,
  social_platforms TEXT[] DEFAULT '{}',
  template_settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AutoBlog Execution History
CREATE TABLE IF NOT EXISTS autoblog_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  config_id UUID REFERENCES autoblog_configs(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK (status IN ('running', 'completed', 'failed', 'partial')),
  articles_generated INTEGER DEFAULT 0,
  articles_published INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  error_message TEXT,
  run_details JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- CMS Integrations (WordPress, Shopify, Ghost, etc)
CREATE TABLE IF NOT EXISTS cms_integrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('wordpress', 'shopify', 'ghost', 'wix', 'webflow', 'blogger', 'custom')),
  site_url VARCHAR(500) NOT NULL,
  api_credentials JSONB NOT NULL,
  default_category VARCHAR(255),
  default_tags TEXT[],
  auto_add_images BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Posts (para sindicação automática)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES seo_articles(id) ON DELETE CASCADE,
  platform VARCHAR(50) CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram')),
  post_content TEXT NOT NULL,
  image_url TEXT,
  post_url TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  engagement_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Google Search Console Integration
CREATE TABLE IF NOT EXISTS search_console_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES seo_articles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  submission_status VARCHAR(50) CHECK (submission_status IN ('pending', 'submitted', 'indexed', 'failed')),
  indexed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Templates (estruturas recorrentes)
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_structure JSONB NOT NULL,
  include_faq BOOLEAN DEFAULT false,
  include_toc BOOLEAN DEFAULT true,
  min_word_count INTEGER DEFAULT 800,
  max_word_count INTEGER DEFAULT 2000,
  tone VARCHAR(100),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Checks (plágio, gramática, legibilidade)
CREATE TABLE IF NOT EXISTS article_quality_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES seo_articles(id) ON DELETE CASCADE,
  plagiarism_score INTEGER,
  grammar_errors INTEGER,
  readability_score INTEGER,
  seo_score INTEGER,
  e_e_a_t_score INTEGER,
  recommendations TEXT[],
  passed BOOLEAN DEFAULT false,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_projects_user ON seo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_knowledge_project ON project_knowledge_base(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_articles_project ON seo_articles(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_articles_status ON seo_articles(status);
CREATE INDEX IF NOT EXISTS idx_seo_technical_issues_project ON seo_technical_issues(project_id, fixed);
CREATE INDEX IF NOT EXISTS idx_autoblog_configs_project ON autoblog_configs(project_id);
CREATE INDEX IF NOT EXISTS idx_autoblog_runs_config ON autoblog_runs(config_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_integrations_project ON cms_integrations(project_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_article ON social_posts(article_id);
CREATE INDEX IF NOT EXISTS idx_search_console_article ON search_console_submissions(article_id);

-- RLS Policies
ALTER TABLE seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_technical_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoblog_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE autoblog_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_console_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_quality_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own projects" ON seo_projects;
CREATE POLICY "Users own projects" ON seo_projects
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access project knowledge" ON project_knowledge_base;
CREATE POLICY "Users access project knowledge" ON project_knowledge_base
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access articles" ON seo_articles;
CREATE POLICY "Users access articles" ON seo_articles
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access issues" ON seo_technical_issues;
CREATE POLICY "Users access issues" ON seo_technical_issues
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access autoblog configs" ON autoblog_configs;
CREATE POLICY "Users access autoblog configs" ON autoblog_configs
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access autoblog runs" ON autoblog_runs;
CREATE POLICY "Users access autoblog runs" ON autoblog_runs
  FOR ALL USING (config_id IN (SELECT id FROM autoblog_configs WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users access cms integrations" ON cms_integrations;
CREATE POLICY "Users access cms integrations" ON cms_integrations
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access social posts" ON social_posts;
CREATE POLICY "Users access social posts" ON social_posts
  FOR ALL USING (article_id IN (SELECT id FROM seo_articles WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users access search console" ON search_console_submissions;
CREATE POLICY "Users access search console" ON search_console_submissions
  FOR ALL USING (article_id IN (SELECT id FROM seo_articles WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users access templates" ON content_templates;
CREATE POLICY "Users access templates" ON content_templates
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access quality checks" ON article_quality_checks;
CREATE POLICY "Users access quality checks" ON article_quality_checks
  FOR ALL USING (article_id IN (SELECT id FROM seo_articles WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()))));
