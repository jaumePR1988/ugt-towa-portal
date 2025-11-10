Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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

        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const in3Hours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

        let remindersCreated = 0;
        let delegateNotificationsCreated = 0;

        // 1. Obtener citas confirmadas para las próximas 24 horas (recordatorio 24h)
        const appointments24hResponse = await fetch(
            `${supabaseUrl}/rest/v1/appointments?status=eq.confirmed&start_time=gte.${in24Hours.toISOString()}&start_time=lte.${in24Hours.toISOString()}&select=*,profiles(full_name,email)`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (appointments24hResponse.ok) {
            const appointments24h = await appointments24hResponse.json();

            for (const appointment of appointments24h) {
                // Verificar si ya existe un recordatorio de 24h para esta cita
                const existingResponse = await fetch(
                    `${supabaseUrl}/rest/v1/notifications?appointment_id=eq.${appointment.id}&type=eq.reminder&message=ilike.*24 horas*&select=id`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                const existing = await existingResponse.json();
                
                if (existing.length === 0) {
                    // Extraer datos del usuario
                    const userFullName = appointment.profiles?.full_name || 'Usuario';
                    const userEmail = appointment.profiles?.email || '';
                    
                    // Crear recordatorio de 24 horas
                    const title = 'Recordatorio: Cita en 24 horas';
                    const message = `Recordatorio: Cita de ${userFullName} (${userEmail}) para mañana ${new Date(appointment.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${appointment.delegate_type}`;

                    const insertResponse = await fetch(
                        `${supabaseUrl}/rest/v1/notifications`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                appointment_id: appointment.id,
                                type: 'reminder',
                                title,
                                message,
                                user_email: userEmail,
                                user_full_name: userFullName,
                                delegate_type: appointment.delegate_type,
                                appointment_time: appointment.start_time
                            })
                        }
                    );

                    if (insertResponse.ok) {
                        remindersCreated++;
                    }
                }
            }
        }

        // 2. Obtener citas confirmadas para las próximas 2-3 horas (recordatorio 2h)
        const appointments2hResponse = await fetch(
            `${supabaseUrl}/rest/v1/appointments?status=eq.confirmed&start_time=gte.${in2Hours.toISOString()}&start_time=lte.${in3Hours.toISOString()}&select=*,profiles(full_name,email)`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (appointments2hResponse.ok) {
            const appointments2h = await appointments2hResponse.json();

            for (const appointment of appointments2h) {
                // Verificar si ya existe un recordatorio de 2h para esta cita
                const existingResponse = await fetch(
                    `${supabaseUrl}/rest/v1/notifications?appointment_id=eq.${appointment.id}&type=eq.reminder&message=ilike.*2 horas*&select=id`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                const existing = await existingResponse.json();
                
                if (existing.length === 0) {
                    // Extraer datos del usuario
                    const userFullName = appointment.profiles?.full_name || 'Usuario';
                    const userEmail = appointment.profiles?.email || '';
                    
                    // Crear recordatorio de 2 horas
                    const title = 'Recordatorio Urgente: Cita en 2 horas';
                    const message = `Recordatorio: Cita de ${userFullName} (${userEmail}) hoy a las ${new Date(appointment.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${appointment.delegate_type}`;

                    const insertResponse = await fetch(
                        `${supabaseUrl}/rest/v1/notifications`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                appointment_id: appointment.id,
                                type: 'reminder',
                                title,
                                message,
                                user_email: userEmail,
                                user_full_name: userFullName,
                                delegate_type: appointment.delegate_type,
                                appointment_time: appointment.start_time
                            })
                        }
                    );

                    if (insertResponse.ok) {
                        remindersCreated++;
                    }
                }
            }
        }

        // 3. Notificar a delegados sobre nuevas citas confirmadas en las últimas 2 horas
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const newAppointmentsResponse = await fetch(
            `${supabaseUrl}/rest/v1/appointments?status=eq.confirmed&created_at=gte.${twoHoursAgo.toISOString()}&select=*,profiles(full_name,email)`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (newAppointmentsResponse.ok) {
            const newAppointments = await newAppointmentsResponse.json();

            for (const appointment of newAppointments) {
                // Verificar si ya existe notificación para delegados
                const existingResponse = await fetch(
                    `${supabaseUrl}/rest/v1/notifications?appointment_id=eq.${appointment.id}&type=eq.delegate_notification&select=id`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                const existing = await existingResponse.json();
                
                if (existing.length === 0) {
                    // Extraer datos del usuario
                    const userFullName = appointment.profiles?.full_name || 'Usuario';
                    const userEmail = appointment.profiles?.email || '';
                    
                    // Crear notificación para delegados
                    const formattedTime = new Date(appointment.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    const formattedDate = new Date(appointment.start_time).toLocaleDateString('es-ES');
                    const title = `Nueva Cita: ${appointment.delegate_type}`;
                    const message = `Nueva cita de ${userFullName} (${userEmail}) - ${formattedTime} el ${formattedDate} - ${appointment.delegate_type}`;

                    const insertResponse = await fetch(
                        `${supabaseUrl}/rest/v1/notifications`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                appointment_id: appointment.id,
                                type: 'delegate_notification',
                                title,
                                message,
                                user_email: userEmail,
                                user_full_name: userFullName,
                                delegate_type: appointment.delegate_type,
                                appointment_time: appointment.start_time
                            })
                        }
                    );

                    if (insertResponse.ok) {
                        delegateNotificationsCreated++;
                    }
                }
            }
        }

        return new Response(JSON.stringify({
            success: true,
            data: {
                reminders_created: remindersCreated,
                delegate_notifications_created: delegateNotificationsCreated,
                timestamp: new Date().toISOString()
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error generando recordatorios:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'REMINDER_GENERATION_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
