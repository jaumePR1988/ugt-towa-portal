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
            throw new Error('Configuración de Supabase faltante');
        }

        const { appointment_id, type, user_email, delegate_type } = await req.json();

        if (!appointment_id || !type) {
            throw new Error('appointment_id y type son requeridos');
        }

        // Obtener información de la cita
        const appointmentResponse = await fetch(
            `${supabaseUrl}/rest/v1/appointments?id=eq.${appointment_id}&select=*`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!appointmentResponse.ok) {
            throw new Error('Error al obtener información de la cita');
        }

        const appointments = await appointmentResponse.json();
        const appointment = appointments[0];

        if (!appointment) {
            throw new Error('Cita no encontrada');
        }

        // Crear mensaje según el tipo de notificación
        let title = '';
        let message = '';

        switch (type) {
            case 'confirmation':
                title = 'Cita Confirmada';
                message = `Tu cita con ${appointment.delegate_type} ha sido confirmada para el ${new Date(appointment.start_time).toLocaleString('es-ES')}`;
                break;
            case 'cancellation':
                title = 'Cita Cancelada';
                message = `Tu cita con ${appointment.delegate_type} del ${new Date(appointment.start_time).toLocaleString('es-ES')} ha sido cancelada`;
                break;
            case 'reminder':
                title = 'Recordatorio de Cita';
                message = `Recordatorio: Tienes una cita con ${appointment.delegate_type} el ${new Date(appointment.start_time).toLocaleString('es-ES')}`;
                break;
            case 'delegate_notification':
                title = 'Nueva Cita Reservada';
                message = `Se ha reservado una nueva cita de tipo ${appointment.delegate_type} para el ${new Date(appointment.start_time).toLocaleString('es-ES')}`;
                break;
            default:
                throw new Error('Tipo de notificación no válido');
        }

        // Guardar notificación en la base de datos
        const insertResponse = await fetch(
            `${supabaseUrl}/rest/v1/notifications`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    appointment_id,
                    type,
                    title,
                    message,
                    user_email: user_email || null,
                    delegate_type: delegate_type || appointment.delegate_type,
                    appointment_time: appointment.start_time
                })
            }
        );

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            throw new Error(`Error al guardar notificación: ${errorText}`);
        }

        const notification = await insertResponse.json();

        return new Response(JSON.stringify({
            success: true,
            data: {
                notification: notification[0],
                timestamp: new Date().toISOString()
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en notificaciones:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'NOTIFICATION_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
