Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Crear bucket comunicados-attachments
    const createBucketResponse = await fetch(
      `${supabaseUrl}/storage/v1/bucket`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'communique-attachments',
          name: 'communique-attachments',
          public: true,
          file_size_limit: 5242880,
          allowed_mime_types: [
            'application/pdf',
            'image/jpeg', 
            'image/jpg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
        })
      }
    );

    if (!createBucketResponse.ok && createBucketResponse.status !== 409) {
      const errorText = await createBucketResponse.text();
      throw new Error(`Error creando bucket: ${errorText}`);
    }

    // Crear políticas RLS para el bucket
    const policies = [
      {
        name: 'communique-attachments-public-view',
        cmd: 'SELECT',
        roles: 'anon',
        check: 'true'
      },
      {
        name: 'communique-attachments-auth-upload',
        cmd: 'INSERT',
        roles: 'authenticated', 
        check: 'true'
      }
    ];

    const policyResults = [];
    for (const policy of policies) {
      const createPolicyResponse = await fetch(
        `${supabaseUrl}/rest/v1/rpc/create_storage_policy`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bucket_name: 'communique-attachments',
            policy_name: policy.name,
            cmd: policy.cmd,
            roles: policy.roles,
            check: policy.check
          })
        }
      );

      policyResults.push({
        policy: policy.name,
        success: createPolicyResponse.ok || createPolicyResponse.status === 409
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        bucket: 'communique-attachments',
        policies: policyResults,
        message: 'Bucket y políticas creados exitosamente'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});