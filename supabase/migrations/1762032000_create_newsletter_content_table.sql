-- Migration: create_newsletter_content_table
-- Created at: 1762032000

CREATE TABLE newsletter_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('news',
    'events',
    'statistics',
    'directives',
    'suggestions')),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_by UUID
);

-- Enable RLS
ALTER TABLE newsletter_content ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Allow service_role full access to newsletter_content"
ON newsletter_content FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Authenticated users can read published content
CREATE POLICY "Allow authenticated users to read published newsletter_content"
ON newsletter_content FOR SELECT
TO authenticated
USING (is_published = true);

-- Policy: Authenticated users can read own content
CREATE POLICY "Allow authenticated users to read own newsletter_content"
ON newsletter_content FOR SELECT
TO authenticated
USING (created_by = auth.uid());

-- Policy: Authenticated users can insert content
CREATE POLICY "Allow authenticated users to insert newsletter_content"
ON newsletter_content FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Policy: Authenticated users can update own content
CREATE POLICY "Allow authenticated users to update own newsletter_content"
ON newsletter_content FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Policy: Authenticated users can delete own content
CREATE POLICY "Allow authenticated users to delete own newsletter_content"
ON newsletter_content FOR DELETE
TO authenticated
USING (created_by = auth.uid());

COMMENT ON TABLE newsletter_content IS 'Contenido del newsletter sindical por categorías';