// Edge Function temporal para aplicar migración RLS de survey_responses
// Se debe eliminar después de ejecutar

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      db: { schema: 'public' },
      auth: { persistSession: false }
    })

    // Ejecutar las sentencias SQL una por una
    const sqlStatements = [
      // Eliminar políticas existentes
      `DROP POLICY IF EXISTS "Allow authenticated users to insert responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "Allow users to insert their own responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "Users can insert responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "authenticated_insert_responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "Allow anyone to view responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "Allow public to view responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "public_view_responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "users_view_own_responses" ON survey_responses;`,
      `DROP POLICY IF EXISTS "users_view_all_responses" ON survey_responses;`,
      
      // Habilitar RLS
      `ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;`,
      
      // Crear nuevas políticas
      `CREATE POLICY "public_view_responses" ON survey_responses FOR SELECT USING (true);`,
      `CREATE POLICY "authenticated_insert_responses" ON survey_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "users_view_all_responses" ON survey_responses FOR SELECT TO authenticated USING (true);`
    ];

    const results = [];
    for (const sql of sqlStatements) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { query: sql });
        if (error) {
          console.log(`Error en statement: ${sql}`, error);
          results.push({ sql, status: 'error', error: error.message });
        } else {
          results.push({ sql, status: 'success' });
        }
      } catch (err) {
        console.log(`Excepción en statement: ${sql}`, err);
        results.push({ sql, status: 'exception', error: err.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Migración completada',
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
