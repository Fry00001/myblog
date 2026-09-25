export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
  
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
  
    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  
    // POST：增加浏览量
    if (request.method === 'POST') {
      const current = parseInt(await env.BLOG_VIEWS.get(path)) || 0;
      const updated = current + 1;
      await env.BLOG_VIEWS.put(path, updated.toString());
      return new Response(JSON.stringify({ views: updated }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  
    // GET：查询浏览量
    if (request.method === 'GET') {
      const views = parseInt(await env.BLOG_VIEWS.get(path)) || 0;
      return new Response(JSON.stringify({ views }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  
    return new Response('Method Not Allowed', { status: 405 });
  }