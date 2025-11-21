-- Migration: create_newsletters_sent_table
-- Created at: 1762033000

CREATE TABLE newsletters_sent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    total_sent INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft',
    'approved',
    'sent',
    'failed')),
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE newsletters_sent ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Allow service_role full access to newsletters_sent"
ON newsletters_sent FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Authenticated users can read
CREATE POLICY "Allow authenticated users to read newsletters_sent"
ON newsletters_sent FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can insert
CREATE POLICY "Allow authenticated users to insert newsletters_sent"
ON newsletters_sent FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Policy: Authenticated users can update own newsletters
CREATE POLICY "Allow authenticated users to update own newsletters_sent"
ON newsletters_sent FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Policy: Authenticated users can delete own newsletters
CREATE POLICY "Allow authenticated users to delete own newsletters_sent"
ON newsletters_sent FOR DELETE
TO authenticated
USING (created_by = auth.uid());

COMMENT ON TABLE newsletters_sent IS 'Newsletter enviados o generados';