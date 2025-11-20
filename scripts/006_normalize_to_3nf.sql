-- Database Normalization to 3NF
-- This script fixes violations found in the schema

-- 1. Remove redundant user_id from messages (can be derived from conversation)
ALTER TABLE IF EXISTS public.messages 
DROP COLUMN IF EXISTS user_id CASCADE;

-- 2. Remove redundant user_id from tool_executions
ALTER TABLE IF EXISTS public.tool_executions 
DROP COLUMN IF EXISTS user_id CASCADE;

-- 3. Create proper keywords table (normalize array to proper table)
CREATE TABLE IF NOT EXISTS article_keywords (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES news_articles(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  relevance_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, keyword)
);

-- 4. Create index for keyword searches
CREATE INDEX IF NOT EXISTS idx_article_keywords_article ON article_keywords(article_id);
CREATE INDEX IF NOT EXISTS idx_article_keywords_keyword ON article_keywords(keyword);

-- 5. Store journalist style name in rewrites to preserve history
ALTER TABLE IF EXISTS article_rewrites 
ADD COLUMN IF NOT EXISTS style_name_snapshot VARCHAR(255);

-- 6. Create view for computed reading time (removes storage of calculated data)
CREATE OR REPLACE VIEW article_reading_times AS
SELECT 
  ar.id as article_id,
  ar.word_count,
  CASE 
    WHEN ar.word_count <= 200 THEN 1
    ELSE CEIL(ar.word_count::DECIMAL / 200)
  END as reading_time_minutes
FROM seo_articles ar;

-- 7. Create view for session interaction counts (removes redundant column)
CREATE OR REPLACE VIEW session_interaction_counts AS
SELECT 
  cs.id as session_id,
  cs.user_id,
  COUNT(ci.id) as total_interactions,
  cs.session_start,
  cs.session_end
FROM copilot_sessions cs
LEFT JOIN copilot_interactions ci ON ci.session_id = cs.id
GROUP BY cs.id, cs.user_id, cs.session_start, cs.session_end;

-- 8. Remove calculated column from copilot_sessions
ALTER TABLE IF EXISTS copilot_sessions 
DROP COLUMN IF EXISTS total_interactions CASCADE;

-- 9. Add proper foreign key constraints with CASCADE where appropriate
-- Ensure all article_rewrites cascade from journalist_styles deletion
ALTER TABLE IF EXISTS article_rewrites
DROP CONSTRAINT IF EXISTS article_rewrites_journalist_style_id_fkey;

ALTER TABLE IF EXISTS article_rewrites
ADD CONSTRAINT article_rewrites_journalist_style_id_fkey
FOREIGN KEY (journalist_style_id) 
REFERENCES journalist_styles(id) 
ON DELETE SET NULL;

-- 10. Create trigger to snapshot style name before deletion
CREATE OR REPLACE FUNCTION snapshot_journalist_style_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.journalist_style_id IS NOT NULL THEN
    NEW.style_name_snapshot := (
      SELECT name FROM journalist_styles WHERE id = NEW.journalist_style_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_snapshot_style_name ON article_rewrites;
CREATE TRIGGER trg_snapshot_style_name
BEFORE INSERT OR UPDATE ON article_rewrites
FOR EACH ROW
EXECUTE FUNCTION snapshot_journalist_style_name();

-- 11. Update RLS policies to reflect schema changes
DROP POLICY IF EXISTS "messages_select_own" ON public.messages;
CREATE POLICY "messages_select_own" ON public.messages 
FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = (
      SELECT id FROM users WHERE id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "messages_insert_own" ON public.messages 
FOR INSERT WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = (
      SELECT id FROM users WHERE id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "tool_executions_select_own" ON public.tool_executions;
CREATE POLICY "tool_executions_select_own" ON public.tool_executions 
FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = (
      SELECT id FROM users WHERE id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "tool_executions_insert_own" ON public.tool_executions;
CREATE POLICY "tool_executions_insert_own" ON public.tool_executions 
FOR INSERT WITH CHECK (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = (
      SELECT id FROM users WHERE id = auth.uid()
    )
  )
);

-- 12. RLS for article_keywords
ALTER TABLE article_keywords ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users access article keywords" ON article_keywords;
CREATE POLICY "Users access article keywords" ON article_keywords
FOR ALL USING (
  article_id IN (
    SELECT id FROM news_articles WHERE user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  )
);

-- 13. Create migration script for existing data
-- Move keywords from array to normalized table
INSERT INTO article_keywords (article_id, keyword, relevance_score)
SELECT 
  na.id,
  UNNEST(na.keywords) as keyword,
  50.0 as relevance_score
FROM news_articles na
WHERE na.keywords IS NOT NULL AND array_length(na.keywords, 1) > 0
ON CONFLICT (article_id, keyword) DO NOTHING;

-- 14. Create function to maintain keyword table
CREATE OR REPLACE FUNCTION sync_article_keywords()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old keywords
  DELETE FROM article_keywords WHERE article_id = NEW.id;
  
  -- Insert new keywords
  IF NEW.keywords IS NOT NULL AND array_length(NEW.keywords, 1) > 0 THEN
    INSERT INTO article_keywords (article_id, keyword, relevance_score)
    SELECT NEW.id, UNNEST(NEW.keywords), 50.0
    ON CONFLICT (article_id, keyword) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_keywords ON news_articles;
CREATE TRIGGER trg_sync_keywords
AFTER INSERT OR UPDATE OF keywords ON news_articles
FOR EACH ROW
EXECUTE FUNCTION sync_article_keywords();

-- 15. Add documentation comments
COMMENT ON TABLE article_keywords IS 'Normalized keyword storage - replaces keywords array in news_articles';
COMMENT ON VIEW article_reading_times IS 'Computed reading time based on word count (200 words/minute)';
COMMENT ON VIEW session_interaction_counts IS 'Computed interaction counts - replaces total_interactions column';
COMMENT ON TRIGGER trg_snapshot_style_name ON article_rewrites IS 'Preserves journalist style name even after style deletion';

-- Performance optimization: Create GIN index for JSONB searches
CREATE INDEX IF NOT EXISTS idx_conversations_context_gin ON conversations USING GIN(context_type);
CREATE INDEX IF NOT EXISTS idx_tool_contexts_data_gin ON tool_contexts USING GIN(context_data);
CREATE INDEX IF NOT EXISTS idx_journalist_styles_characteristics_gin ON journalist_styles USING GIN(style_characteristics);

COMMENT ON SCHEMA public IS 'ContentMaster AI - Fully normalized to 3NF with CASCADE deletes';
