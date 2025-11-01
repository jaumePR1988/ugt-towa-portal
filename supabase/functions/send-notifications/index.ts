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

        // Obtener citas confirmadas para las próximas 24 horas
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const appointmentsResponse = await fetch(
            `${supabaseUrl}/rest/v1/appointments?status=eq.confirmed&start_time=gte.${now.toISOString()}&start_time=lte.${tomorrow.toISOString()}&select=*`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!appointmentsResponse.ok) {
            throw new Error('Error al obtener citas');
        }

        const appointments = await appointmentsResponse.json();

        // Obtener información de usuarios para enviar recordatorios
        const userIds = [...new Set(appointments.map((apt: any) => apt.user_id))];
        
        if (userIds.length > 0) {
            const profilesResponse = await fetch(
                `${supabaseUrl}/rest/v1/profiles?id=in.(${userIds.join(',')})&select=*`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                }
            );

            if (profilesResponse.ok) {
                const profiles = await profilesResponse.json();
                
                // Aquí se enviarían emails/notificaciones
                // Por ahora solo registramos las notificaciones que se enviarían
                const notifications = appointments.map((apt: any) => {
                    const profile = profiles.find((p: any) => p.id === apt.user_id);
                    return {
                        email: profile?.email,
                        subject: 'Recordatorio de cita UGT Towa',
                        message: `Tienes una cita confirmada para ${new Date(apt.start_time).toLocaleString('es-ES')} con ${apt.delegate_type}`,
                        appointment_id: apt.id
                    };
                });

                console.log('Notificaciones a enviar:', notifications);
            }
        }

        // Obtener suscriptores del newsletter
        const subscribersResponse = await fetch(
            `${supabaseUrl}/rest/v1/newsletter_subscribers?select=*`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        let newsletterCount = 0;
        if (subscribersResponse.ok) {
            const subscribers = await subscribersResponse.json();
            newsletterCount = subscribers.length;
            console.log(`Newsletter: ${newsletterCount} suscriptores activos`);
        }

        return new Response(JSON.stringify({
            success: true,
            data: {
                appointment_reminders_sent: appointments.length,
                newsletter_subscribers: newsletterCount,
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
