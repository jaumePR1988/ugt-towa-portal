Deno.serve(async (req) => {
  console.log('Simple function called at:', new Date().toISOString());
  
  const response = {
    message: 'Function is working',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries())
  };

  console.log('Response:', response);

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
});