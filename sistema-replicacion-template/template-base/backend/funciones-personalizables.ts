// Template Genérico - Edge Function Personalizable
// Esta función se puede personalizar para cada empresa

interface EmpresaConfig {
  nombre: string;
  dominio: string;
  email: string;
  colores: {
    primario: string;
    secundario: string;
    acento: string;
  };
}

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        // Variables de entorno personalizables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const empresaConfig = {
            nombre: Deno.env.get('EMPRESA_NOMBRE') || 'Portal Sindical',
            dominio: Deno.env.get('EMPRESA_DOMINIO') || 'empresa.com',
            email: Deno.env.get('EMPRESA_EMAIL') || 'contacto@empresa.com',
            colores: {
                primario: Deno.env.get('EMPRESA_COLOR_PRIMARIO') || '#1e40af',
                secundario: Deno.env.get('EMPRESA_COLOR_SECUNDARIO') || '#059669',
                acento: Deno.env.get('EMPRESA_COLOR_ACENTO') || '#dc2626'
            }
        };

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Configuración de Supabase faltante');
        }

        // Procesar la solicitud según la función específica
        const { action, data } = await req.json();

        let result = {};

        switch (action) {
            case 'get_company_info':
                result = {
                    empresa: empresaConfig,
                    configuracion: {
                        validacionDominio: Deno.env.get('VALIDACION_DOMINIO') === 'true',
                        dominiosPermitidos: (Deno.env.get('DOMINIOS_PERMITIDOS') || '@empresa.com').split(','),
                        tiposCitas: JSON.parse(Deno.env.get('TIPOS_CITAS_CONFIG') || '[]'),
                        horarios: JSON.parse(Deno.env.get('HORARIOS_TRABAJO_CONFIG') || '{}')
                    }
                };
                break;

            case 'custom_notification':
                // Personalizar notificaciones por empresa
                const { tipo, mensaje, usuario } = data;
                result = await procesarNotificacionPersonalizada({
                    tipo,
                    mensaje,
                    usuario,
                    empresa: empresaConfig
                });
                break;

            case 'export_data':
                // Exportar datos en formato de la empresa
                result = await exportarDatosPersonalizados(data, empresaConfig);
                break;

            default:
                throw new Error('Acción no reconocida');
        }

        return new Response(JSON.stringify({
            success: true,
            data: result,
            empresa: empresaConfig
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en función personalizable:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'FUNCTION_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Función para procesar notificaciones personalizadas
async function procesarNotificacionPersonalizada({ tipo, mensaje, usuario, empresa }) {
    // Personalizar el mensaje según la empresa
    const mensajePersonalizado = mensaje.replace('{{EMPRESA_NOMBRE}}', empresa.nombre);
    const colorTipo = getColorPorTipo(tipo, empresa.colores);
    
    return {
        mensaje: mensajePersonalizado,
        tipo,
        empresa: empresa.nombre,
        color: colorTipo,
        timestamp: new Date().toISOString()
    };
}

// Función para exportar datos personalizados
async function exportarDatosPersonalizados(data, empresa) {
    // Personalizar la exportación según la empresa
    const exportacion = {
        empresa: empresa.nombre,
        dominio: empresa.dominio,
        fechaExportacion: new Date().toISOString(),
        datos: data
    };

    return exportacion;
}

// Función auxiliar para obtener colores por tipo
function getColorPorTipo(tipo, colores) {
    const mapaColores = {
        confirmacion: colores.secundario,
        cancelacion: colores.acento,
        recordatorio: colores.primario,
        default: colores.primario
    };

    return mapaColores[tipo] || mapaColores.default;
}
