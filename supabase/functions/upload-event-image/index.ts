Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Obtener el token del usuario
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parsear FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const eventDate = formData.get('eventDate') as string;
    const displayOrder = formData.get('displayOrder') as string;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 5MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generar nombre único
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    // Subir a Storage
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/event-images/${filePath}`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${supabaseServiceKey}`,
          'content-type': file.type,
        },
        body: await file.arrayBuffer(),
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      return new Response(
        JSON.stringify({ error: `Storage upload failed: ${error}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // URL pública de la imagen
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/event-images/${filePath}`;

    // Obtener user ID del token
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { authorization: authHeader },
    });

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    // Insertar en la tabla event_images
    const insertResponse = await fetch(
      `${supabaseUrl}/rest/v1/event_images`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          apikey: supabaseServiceKey,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          title: title || 'Evento UGT Towa',
          description: description || '',
          image_url: imageUrl,
          event_date: eventDate || null,
          display_order: displayOrder ? parseInt(displayOrder) : 0,
          is_active: true,
          created_by: userId,
        }),
      }
    );

    if (!insertResponse.ok) {
      const error = await insertResponse.text();
      return new Response(
        JSON.stringify({ error: `Database insert failed: ${error}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const insertedData = await insertResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: insertedData[0],
        message: 'Event image uploaded successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
