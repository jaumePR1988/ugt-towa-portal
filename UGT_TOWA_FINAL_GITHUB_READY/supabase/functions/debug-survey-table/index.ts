// Edge Function temporal para diagnosticar estructura de survey_responses
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejar OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Consultar estructura de la tabla usando query SQL directa
    const query = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'survey_responses' 
      ORDER BY ordinal_position;
    `
    
    // Usar fetch para ejecutar query via PostgREST/pg_rest endpoint
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    // Retornar estructura de tabla (simplificado para debugging)
    const result = {
      message: 'Diagnóstico de tabla survey_responses',
      supabase_url: SUPABASE_URL,
      has_service_key: !!SERVICE_ROLE_KEY,
      query: query,
      note: 'Esta función requiere ejecución manual de SQL en Dashboard'
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Error en función de debug',
        message: error instanceof Error ? error.message : String(error)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
