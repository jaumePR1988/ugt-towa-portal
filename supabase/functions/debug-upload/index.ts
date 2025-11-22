Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Verificar variables de entorno
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
      supabaseUrl: supabaseUrl ? 'CONFIGURADO' : 'NO CONFIGURADO',
      serviceRoleKey: serviceRoleKey ? 'CONFIGURADO' : 'NO CONFIGURADO',
      contentType: req.headers.get('content-type'),
    };

    // Si es POST, analizar el FormData
    let formDataInfo = null;
    if (req.method === 'POST') {
      try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (file) {
          formDataInfo = {
            hasFile: true,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileLastModified: file.lastModified
          };
        } else {
          formDataInfo = { hasFile: false, error: 'No file found in FormData' };
        }
      } catch (formError) {
        formDataInfo = { formDataError: formError.message };
      }
    }

    // Probar conexión con Supabase
    let bucketTest = null;
    if (supabaseUrl && serviceRoleKey) {
      try {
        const testResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          }
        });
        bucketTest = {
          canConnect: testResponse.ok,
          status: testResponse.status,
          statusText: testResponse.statusText
        };
      } catch (connError) {
        bucketTest = { canConnect: false, error: connError.message };
      }
    }

    return new Response(
      JSON.stringify({
        debug: debugInfo,
        formData: formDataInfo,
        supabaseConnection: bucketTest,
        environment: {
          denoVersion: Deno.version.deno,
          typescript: Deno.version.typescript
        }
      }, null, 2),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Debug error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});