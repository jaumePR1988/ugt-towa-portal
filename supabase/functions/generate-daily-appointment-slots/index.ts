// Edge Function: generate-daily-appointment-slots
// Automatically generates appointment slots for today and future dates

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    const requestData = await req.json();
    const { days = 30 } = requestData; // Generate slots for next 30 days by default

    const headers = {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey
    };

    const startDate = new Date();
    const slotsCreated = [];
    const timeSlots = [
      { start: '08:00', end: '09:00' },
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' }
    ];

    const delegateTypes = ['sindical', 'prevencion'];

    for (let day = 0; day < days; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);

      // Skip weekends (optional, adjust as needed)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue; // Skip Sunday (0) and Saturday (6)
      }

      const dateStr = currentDate.toISOString().split('T')[0];

      for (const delegateType of delegateTypes) {
        for (const timeSlot of timeSlots) {
          const startTime = new Date(`${dateStr}T${timeSlot.start}:00.000Z`);
          const endTime = new Date(`${dateStr}T${timeSlot.end}:00.000Z`);

          // Check if slot already exists
          const existingSlotResponse = await fetch(
            `${supabaseUrl}/rest/v1/appointment_slots?appointment_date=eq.${dateStr}&delegate_type=eq.${delegateType}&start_time=eq.${startTime.toISOString()}`,
            { headers }
          );

          const existingSlots = await existingSlotResponse.json();

          if (existingSlots.length === 0) {
            // Create new slot
            const slotData = {
              delegate_type: delegateType,
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString(),
              appointment_date: dateStr,
              status: 'available'
            };

            const createResponse = await fetch(
              `${supabaseUrl}/rest/v1/appointment_slots`,
              {
                method: 'POST',
                headers,
                body: JSON.stringify(slotData)
              }
            );

            if (createResponse.ok) {
              slotsCreated.push({
                date: dateStr,
                type: delegateType,
                start: timeSlot.start,
                end: timeSlot.end
              });
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${slotsCreated.length} new appointment slots`,
        slotsCreated: slotsCreated
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error generating appointment slots:', error);

    const errorResponse = {
      error: {
        code: 'SLOT_GENERATION_ERROR',
        message: error.message || 'Failed to generate appointment slots'
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});