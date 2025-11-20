-- Table for complete newspaper/journal publications
CREATE TABLE IF NOT EXISTS digital_newspapers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  edition VARCHAR(100),
  publication_date DATE NOT NULL,
  total_pages INTEGER NOT NULL,
  main_theme VARCHAR(500),
  target_audience VARCHAR(255),
  editorial_style VARCHAR(100),
  estimated_reading_time VARCHAR(50),
  journal_metadata JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'published')),
  quality_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for individual pages within newspapers
CREATE TABLE IF NOT EXISTS newspaper_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  newspaper_id UUID REFERENCES digital_newspapers(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  page_category VARCHAR(255),
  page_focus TEXT,
  page_layout_recommendations JSONB DEFAULT '{}',
  articles JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(newspaper_id, page_number)
);

-- Table for tracking editorial configurations and templates
CREATE TABLE IF NOT EXISTS editorial_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(100) NOT NULL CHECK (template_type IN ('news', 'analysis', 'interview', 'feature', 'mixed')),
  page_structure JSONB NOT NULL DEFAULT '[]',
  default_styles JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for quality validation scores
CREATE TABLE IF NOT EXISTS content_quality_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  newspaper_id UUID REFERENCES digital_newspapers(id) ON DELETE CASCADE,
  page_id UUID REFERENCES newspaper_pages(id) ON DELETE CASCADE,
  check_type VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  validation_details JSONB DEFAULT '{}',
  recommendations TEXT[],
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_digital_newspapers_user ON digital_newspapers(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_digital_newspapers_status ON digital_newspapers(status);
CREATE INDEX IF NOT EXISTS idx_newspaper_pages_newspaper ON newspaper_pages(newspaper_id, page_number);
CREATE INDEX IF NOT EXISTS idx_editorial_templates_user ON editorial_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_editorial_templates_public ON editorial_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_quality_checks_newspaper ON content_quality_checks(newspaper_id);

-- RLS Policies
ALTER TABLE digital_newspapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newspaper_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_quality_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own newspapers" ON digital_newspapers;
CREATE POLICY "Users own newspapers" ON digital_newspapers
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access newspaper pages" ON newspaper_pages;
CREATE POLICY "Users access newspaper pages" ON newspaper_pages
  FOR ALL USING (newspaper_id IN (
    SELECT id FROM digital_newspapers WHERE user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users own templates" ON editorial_templates;
CREATE POLICY "Users own templates" ON editorial_templates
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()) OR is_public = true);

DROP POLICY IF EXISTS "Users access quality checks" ON content_quality_checks;
CREATE POLICY "Users access quality checks" ON content_quality_checks
  FOR ALL USING (newspaper_id IN (
    SELECT id FROM digital_newspapers WHERE user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  ));

-- Insert default editorial templates
INSERT INTO editorial_templates (user_id, name, description, template_type, page_structure, is_public)
SELECT 
  up.id,
  'Professional News Layout',
  'Standard 4-page news publication with balanced coverage',
  'news',
  '[
    {"page": 1, "category": "Main News", "focus": "Primary story with in-depth analysis", "articles": 2},
    {"page": 2, "category": "Updates", "focus": "Recent developments and breaking news", "articles": 3},
    {"page": 3, "category": "Analysis", "focus": "Expert opinions and perspectives", "articles": 2},
    {"page": 4, "category": "Outlook", "focus": "Future trends and conclusions", "articles": 2}
  ]'::jsonb,
  true
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM editorial_templates et 
  WHERE et.user_id = up.id AND et.name = 'Professional News Layout'
);

INSERT INTO editorial_templates (user_id, name, description, template_type, page_structure, is_public)
SELECT 
  up.id,
  'Tech Publication',
  'Technology-focused 6-page layout with deep technical content',
  'feature',
  '[
    {"page": 1, "category": "Cover Story", "focus": "Major tech announcement or trend", "articles": 1},
    {"page": 2, "category": "Industry News", "focus": "Recent tech developments", "articles": 3},
    {"page": 3, "category": "Product Reviews", "focus": "In-depth product analysis", "articles": 2},
    {"page": 4, "category": "Developer Corner", "focus": "Technical tutorials and guides", "articles": 2},
    {"page": 5, "category": "Startup Spotlight", "focus": "Emerging companies and innovations", "articles": 2},
    {"page": 6, "category": "Future Tech", "focus": "Trends and predictions", "articles": 2}
  ]'::jsonb,
  true
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM editorial_templates et 
  WHERE et.user_id = up.id AND et.name = 'Tech Publication'
);
