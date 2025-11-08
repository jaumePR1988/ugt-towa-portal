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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Configuracion de Supabase faltante');
        }

        // Obtener datos del form
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string || 'QR Code Sugerencias Anonimas';
        const description = formData.get('description') as string || '';

        if (!file) {
            throw new Error('No se proporciono archivo');
        }

        // Validar tipo de archivo
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Tipo de archivo no permitido. Solo PNG, JPG, JPEG, WEBP');
        }

        // Validar tamano (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('Archivo demasiado grande. Maximo 5MB');
        }

        // Generar nombre unico
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `qr-${timestamp}.${fileExt}`;

        // Subir a storage
        const arrayBuffer = await file.arrayBuffer();
        const uploadResponse = await fetch(
            `${supabaseUrl}/storage/v1/object/qr-codes/${fileName}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': file.type,
                },
                body: arrayBuffer,
            }
        );

        if (!uploadResponse.ok) {
            const error = await uploadResponse.text();
            throw new Error(`Error subiendo archivo: ${error}`);
        }

        // URL publica del archivo
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/qr-codes/${fileName}`;

        // Desactivar todos los QR activos anteriores
        await fetch(`${supabaseUrl}/rest/v1/qr_codes?is_active=eq.true`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                is_active: false,
                updated_at: new Date().toISOString()
            })
        });

        // Crear nuevo registro de QR activo
        const createResponse = await fetch(`${supabaseUrl}/rest/v1/qr_codes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                title,
                description,
                image_url: publicUrl,
                is_active: true
            })
        });

        if (!createResponse.ok) {
            const error = await createResponse.text();
            throw new Error(`Error creando registro: ${error}`);
        }

        const newQr = await createResponse.json();

        return new Response(JSON.stringify({
            data: {
                success: true,
                qr: newQr[0],
                url: publicUrl,
                message: 'QR code subido exitosamente'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en upload-qr-code:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'UPLOAD_QR_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
