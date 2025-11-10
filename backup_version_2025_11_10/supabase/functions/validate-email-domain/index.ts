Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { email } = await req.json();

        if (!email) {
            throw new Error('Email es requerido');
        }

        // Validar que el email sea del dominio @towapharmaceutical.com
        const allowedDomain = '@towapharmaceutical.com';
        
        if (!email.toLowerCase().endsWith(allowedDomain)) {
            return new Response(JSON.stringify({
                valid: false,
                message: 'Solo se permiten correos del dominio @towapharmaceutical.com'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            valid: true,
            message: 'Email válido'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en validación de email:', error);

        const errorResponse = {
            error: {
                code: 'EMAIL_VALIDATION_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
