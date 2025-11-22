Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

    const environmentStatus = {
      timestamp: new Date().toISOString(),
      supabaseUrl: {
        configured: !!supabaseUrl,
        value: supabaseUrl ? 'CONFIGURADO' : 'NO_CONFIGURADO',
        expected: 'https://zaxdscclkeytakcowgww.supabase.co'
      },
      serviceRoleKey: {
        configured: !!serviceRoleKey,
        value: serviceRoleKey ? 'CONFIGURADO' : 'NO_CONFIGURADO',
        expected: 'service_role_key_from_supabase_dashboard'
      },
      anonKey: {
        configured: !!anonKey,
        value: anonKey ? 'CONFIGURADO' : 'NO_CONFIGURADO',
        expected: 'anon_key_from_supabase_dashboard'
      }
    };

    // Test connection to Supabase
    let connectionTest = null;
    if (supabaseUrl) {
      try {
        const testResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabaseUrl,
            'Authorization': supabaseUrl
          }
        });
        connectionTest = {
          canConnect: testResponse.ok,
          status: testResponse.status,
          statusText: testResponse.statusText
        };
      } catch (error) {
        connectionTest = { error: error.message };
      }
    }

    return new Response(
      JSON.stringify({
        status: 'ENVIRONMENT_CHECK',
        environment: environmentStatus,
        connection: connectionTest,
        instructions: {
          message: 'Verificar configuración de variables de entorno en Supabase Dashboard',
          steps: [
            '1. Ir a Supabase Dashboard: https://supabase.com/dashboard',
            '2. Seleccionar proyecto: zaxdscclkeytakcowgww',
            '3. Ir a Settings > API',
            '4. Copiar Service Role Key',
            '5. Ir a Project Settings > Edge Functions > Environment Variables',
            '6. Agregar: SUPABASE_URL = https://zaxdscclkeytakcowgww.supabase.co',
            '7. Agregar: SUPABASE_SERVICE_ROLE_KEY = [tu_service_role_key]',
            '8. Agregar: SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ'
          ]
        }
      }, null, 2),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});