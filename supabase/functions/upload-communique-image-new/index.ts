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
    console.log('Upload image function called');

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Environment check:', { 
      supabaseUrl: supabaseUrl ? 'present' : 'missing',
      serviceRoleKey: serviceRoleKey ? 'present' : 'missing' 
    });

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Environment variables missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, WebP allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum 5MB allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const fileName = `img_${timestamp}_${randomStr}.${extension}`;

    console.log('Uploading file:', { fileName, type: file.type, size: file.size });

    // Convert file to bytes
    const fileBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBuffer);

    // Upload to Supabase Storage
    const uploadUrl = `${supabaseUrl}/storage/v1/object/communique-images/${fileName}`;
    
    console.log('Upload URL:', uploadUrl);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': file.type,
      },
      body: fileData,
    });

    const uploadResult = await uploadResponse.text();
    console.log('Upload response:', { status: uploadResponse.status, result: uploadResult });

    if (!uploadResponse.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Upload failed', 
          status: uploadResponse.status,
          details: uploadResult 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return success response
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/communique-images/${fileName}`;
    
    console.log('Success. Public URL:', publicUrl);

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        fileName: fileName
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Function error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});