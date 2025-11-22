// Edge Function para aplicar corrección RLS en survey_responses
// Esta función ejecuta los comandos SQL necesarios para habilitar la votación

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Ejecutar comandos SQL directamente usando el service role
    const sqlCommands = [
      // Eliminar políticas existentes
      `DROP POLICY IF EXISTS "authenticated_insert_responses" ON survey_responses`,
      `DROP POLICY IF EXISTS "public_view_responses" ON survey_responses`,
      `DROP POLICY IF EXISTS "users_view_all_responses" ON survey_responses`,
      `DROP POLICY IF EXISTS "Allow authenticated users to insert responses" ON survey_responses`,
      `DROP POLICY IF EXISTS "Allow anyone to view responses" ON survey_responses`,
      
      // Asegurar RLS habilitado
      `ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY`,
      
      // Crear políticas correctas
      `CREATE POLICY "public_view_responses" ON survey_responses FOR SELECT USING (true)`,
      `CREATE POLICY "authenticated_insert_responses" ON survey_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)`
    ]

    const results = []
    
    for (const sql of sqlCommands) {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: sql })
      })

      const result = {
        sql: sql.substring(0, 50) + '...',
        status: response.status,
        ok: response.ok
      }
      
      results.push(result)
      
      if (!response.ok) {
        const error = await response.text()
        result.error = error
      }
    }

    // Verificar políticas creadas
    const checkResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exec`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({
          query: "SELECT policyname, cmd FROM pg_policies WHERE tablename = 'survey_responses'"
        })
      }
    )

    const verification = await checkResponse.json()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Corrección RLS aplicada',
        results: results,
        verification: verification
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
