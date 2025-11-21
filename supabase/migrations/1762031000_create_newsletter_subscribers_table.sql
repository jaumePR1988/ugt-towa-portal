-- Migration: create_newsletter_subscribers_table
-- Created at: 1762031000

CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Allow service_role full access to newsletter_subscribers"
ON newsletter_subscribers FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Authenticated users can read
CREATE POLICY "Allow authenticated users to read newsletter_subscribers"
ON newsletter_subscribers FOR SELECT
TO authenticated
USING (true);

COMMENT ON TABLE newsletter_subscribers IS 'Tabla de suscriptores del newsletter sindical';