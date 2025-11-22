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
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionó ningún archivo' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'El archivo excede el tamaño máximo permitido de 5MB' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validar tipo de archivo (solo imágenes)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, JPG, PNG o WEBP' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = crypto.randomUUID().split('-')[0];
    const fileExtension = file.name.split('.').pop();
    const fileName = `communique-image-${timestamp}-${randomString}.${fileExtension}`;

    // Leer el archivo como ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Obtener URL y Service Role Key desde variables de entorno
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    // Subir a Supabase Storage usando el bucket communique-images que funciona
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/communique-images/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': file.type,
        },
        body: uint8Array,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Error al subir la imagen: ${errorText}`);
    }

    // Generar URL pública de la imagen
    const fileUrl = `${supabaseUrl}/storage/v1/object/public/communique-images/${fileName}`;

    return new Response(
      JSON.stringify({
        success: true,
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error en upload-communique-image:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Error desconocido al subir la imagen',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});