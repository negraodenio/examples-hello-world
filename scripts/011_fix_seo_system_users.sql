-- Fix all references from user_profiles to users in SEO system
ALTER TABLE seo_projects DROP CONSTRAINT IF EXISTS seo_projects_user_id_fkey;
ALTER TABLE seo_projects 
  ADD CONSTRAINT seo_projects_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update RLS policies to use users table directly
DROP POLICY IF EXISTS "Users own projects" ON seo_projects;
CREATE POLICY "Users own projects" ON seo_projects
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users access project knowledge" ON project_knowledge_base;
CREATE POLICY "Users access project knowledge" ON project_knowledge_base
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access articles" ON seo_articles;
CREATE POLICY "Users access articles" ON seo_articles
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access issues" ON seo_technical_issues;
CREATE POLICY "Users access issues" ON seo_technical_issues
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access autoblog configs" ON autoblog_configs;
CREATE POLICY "Users access autoblog configs" ON autoblog_configs
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access autoblog runs" ON autoblog_runs;
CREATE POLICY "Users access autoblog runs" ON autoblog_runs
  FOR ALL USING (config_id IN (SELECT id FROM autoblog_configs WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access cms integrations" ON cms_integrations;
CREATE POLICY "Users access cms integrations" ON cms_integrations
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access social posts" ON social_posts;
CREATE POLICY "Users access social posts" ON social_posts
  FOR ALL USING (article_id IN (SELECT id FROM seo_articles WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access search console" ON search_console_submissions;
CREATE POLICY "Users access search console" ON search_console_submissions
  FOR ALL USING (article_id IN (SELECT id FROM seo_articles WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Users access templates" ON content_templates;
CREATE POLICY "Users access templates" ON content_templates
  FOR ALL USING (project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users access quality checks" ON article_quality_checks;
CREATE POLICY "Users access quality checks" ON article_quality_checks
  FOR ALL USING (article_id IN (SELECT id FROM seo_articles WHERE project_id IN (SELECT id FROM seo_projects WHERE user_id = auth.uid())));
