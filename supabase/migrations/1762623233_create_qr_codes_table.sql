-- Migration: create_qr_codes_table
-- Created at: 1762623233

-- Tabla para almacenar metadata de QR codes
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_qr_codes_is_active ON qr_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- RLS Policies
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Cualquiera puede leer QR activos (anon y authenticated)
CREATE POLICY "Allow public read active QR codes"
ON qr_codes FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Policy: Solo service_role puede insertar
CREATE POLICY "Allow service_role insert QR codes"
ON qr_codes FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: Solo service_role puede actualizar
CREATE POLICY "Allow service_role update QR codes"
ON qr_codes FOR UPDATE
TO service_role
USING (true);

-- Policy: Solo service_role puede eliminar
CREATE POLICY "Allow service_role delete QR codes"
ON qr_codes FOR DELETE
TO service_role
USING (true);

-- Comentarios
COMMENT ON TABLE qr_codes IS 'Almacena metadata de codigos QR para sugerencias anonimas';
COMMENT ON COLUMN qr_codes.is_active IS 'Solo un QR puede estar activo a la vez';