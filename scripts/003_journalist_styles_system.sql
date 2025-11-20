-- New table for journalist writing styles/personas
CREATE TABLE IF NOT EXISTS journalist_styles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tone VARCHAR(100) NOT NULL CHECK (tone IN ('formal', 'casual', 'technical', 'conversational', 'authoritative', 'friendly', 'investigative', 'analytical')),
  style_characteristics JSONB NOT NULL DEFAULT '{}',
  example_text TEXT,
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing news articles found and processed
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  original_content TEXT NOT NULL,
  source_url VARCHAR(1000),
  source_name VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE,
  keywords TEXT[],
  niche VARCHAR(255),
  viral_score DECIMAL(5,2),
  revenue_score DECIMAL(5,2),
  trending_potential DECIMAL(5,2),
  estimated_reach INTEGER,
  status VARCHAR(50) DEFAULT 'discovered' CHECK (status IN ('discovered', 'processing', 'rewritten', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for rewritten versions of articles
CREATE TABLE IF NOT EXISTS article_rewrites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  journalist_style_id UUID REFERENCES journalist_styles(id) ON DELETE SET NULL,
  rewritten_content TEXT NOT NULL,
  style_applied VARCHAR(255),
  tone_adjustment VARCHAR(100),
  readability_score DECIMAL(5,2),
  engagement_potential VARCHAR(50),
  word_count INTEGER,
  reading_time_minutes INTEGER,
  improvement_score INTEGER,
  suggestions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_journalist_styles_user ON journalist_styles(user_id);
CREATE INDEX IF NOT EXISTS idx_journalist_styles_default ON journalist_styles(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_news_articles_user ON news_articles(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_viral ON news_articles(viral_score DESC) WHERE viral_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_article_rewrites_article ON article_rewrites(article_id);

-- RLS Policies
ALTER TABLE journalist_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_rewrites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own journalist styles" ON journalist_styles;
CREATE POLICY "Users own journalist styles" ON journalist_styles
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users own news articles" ON news_articles;
CREATE POLICY "Users own news articles" ON news_articles
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users own article rewrites" ON article_rewrites;
CREATE POLICY "Users own article rewrites" ON article_rewrites
  FOR ALL USING (article_id IN (
    SELECT id FROM news_articles WHERE user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  ));

-- Insert default journalist styles for all users
INSERT INTO journalist_styles (user_id, name, description, tone, style_characteristics, example_text, is_default)
SELECT 
  up.id,
  'Tech Blogger',
  'Conversational and tech-savvy style perfect for technology and startup content',
  'conversational',
  '{"vocabulary": "technical but accessible", "sentence_length": "medium", "use_examples": true, "personality": "enthusiastic"}'::jsonb,
  'Breaking news in the tech world today! The latest innovation is reshaping how we think about...',
  true
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM journalist_styles js WHERE js.user_id = up.id AND js.name = 'Tech Blogger'
);

INSERT INTO journalist_styles (user_id, name, description, tone, style_characteristics, example_text)
SELECT 
  up.id,
  'Formal Reporter',
  'Professional and fact-based style for serious journalism and news reporting',
  'formal',
  '{"vocabulary": "professional", "sentence_length": "varied", "use_examples": false, "personality": "objective"}'::jsonb,
  'According to recent reports, industry experts have confirmed that...'
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM journalist_styles js WHERE js.user_id = up.id AND js.name = 'Formal Reporter'
);

INSERT INTO journalist_styles (user_id, name, description, tone, style_characteristics, example_text)
SELECT 
  up.id,
  'Casual Influencer',
  'Engaging and relatable style for social media and lifestyle content',
  'casual',
  '{"vocabulary": "simple and relatable", "sentence_length": "short", "use_examples": true, "personality": "friendly"}'::jsonb,
  'Hey everyone! You won''t believe what I just discovered...'
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM journalist_styles js WHERE js.user_id = up.id AND js.name = 'Casual Influencer'
);

INSERT INTO journalist_styles (user_id, name, description, tone, style_characteristics, example_text)
SELECT 
  up.id,
  'Investigative Journalist',
  'Deep-dive analytical style for investigative reporting and exposés',
  'investigative',
  '{"vocabulary": "precise and detailed", "sentence_length": "long", "use_examples": true, "personality": "questioning"}'::jsonb,
  'An investigation into the matter reveals a complex web of connections that...'
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM journalist_styles js WHERE js.user_id = up.id AND js.name = 'Investigative Journalist'
);

INSERT INTO journalist_styles (user_id, name, description, tone, style_characteristics, example_text)
SELECT 
  up.id,
  'Financial Analyst',
  'Data-driven and analytical style for business and finance content',
  'analytical',
  '{"vocabulary": "technical and precise", "sentence_length": "medium", "use_examples": true, "personality": "authoritative"}'::jsonb,
  'Market analysis indicates a significant trend emerging in the sector, with key indicators showing...'
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM journalist_styles js WHERE js.user_id = up.id AND js.name = 'Financial Analyst'
);
