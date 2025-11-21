Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase credentials');
    }

    // SQL para crear buckets
    const createBucketsSQL = `
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES 
        ('communique-images', 'communique-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
        ('communique-attachments', 'communique-attachments', true, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
      ON CONFLICT (id) DO NOTHING;
    `;

    // SQL para crear políticas RLS
    const createPoliciesSQL = `
      -- Política pública para leer imágenes
      CREATE POLICY IF NOT EXISTS "Public read access for communique-images" ON storage.objects
        FOR SELECT USING (bucket_id = 'communique-images');

      -- Política para subir imágenes (permite anon y service_role)
      CREATE POLICY IF NOT EXISTS "Allow upload via edge function for images" ON storage.objects
        FOR INSERT
        WITH CHECK (
          bucket_id = 'communique-images'
          AND (auth.role() = 'anon' OR auth.role() = 'service_role')
        );

      -- Política para eliminar imágenes (solo service_role)
      CREATE POLICY IF NOT EXISTS "Service role delete images" ON storage.objects
        FOR DELETE USING (
          bucket_id = 'communique-images' 
          AND auth.role() = 'service_role'
        );

      -- Política pública para leer archivos adjuntos
      CREATE POLICY IF NOT EXISTS "Public read access for communique-attachments" ON storage.objects
        FOR SELECT USING (bucket_id = 'communique-attachments');

      -- Política para subir archivos adjuntos (permite anon y service_role)
      CREATE POLICY IF NOT EXISTS "Allow upload via edge function for attachments" ON storage.objects
        FOR INSERT
        WITH CHECK (
          bucket_id = 'communique-attachments'
          AND (auth.role() = 'anon' OR auth.role() = 'service_role')
        );

      -- Política para eliminar archivos adjuntos (solo service_role)
      CREATE POLICY IF NOT EXISTS "Service role delete attachments" ON storage.objects
        FOR DELETE USING (
          bucket_id = 'communique-attachments' 
          AND auth.role() = 'service_role'
        );
    `;

    // Ejecutar SQL para crear buckets
    const bucketsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({ sql: createBucketsSQL }),
    });

    if (!bucketsResponse.ok) {
      const error = await bucketsResponse.text();
      console.log('Buckets creation result:', error);
    }

    // Ejecutar SQL para crear políticas
    const policiesResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({ sql: createPoliciesSQL }),
    });

    if (!policiesResponse.ok) {
      const error = await policiesResponse.text();
      console.log('Policies creation result:', error);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Storage setup completed successfully',
        buckets: await bucketsResponse.text(),
        policies: await policiesResponse.text()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error setting up storage:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Setup failed'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});