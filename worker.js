
addEventListener("fetch", async event => {
  if (event.request.method === "POST" && event.request.url.endsWith('/shorten')) {
    const req = await event.request.json();
    const link = req.url;
    const shortUrl = await shortenLink(link);
    event.respondWith(new Response(JSON.stringify({ short_url: shortUrl }), {
      headers: { "content-type": "application/json" },
    }));
  } else if (event.request.method === "GET") {
    const url = new URL(event.request.url);
    const path = url.pathname;
    if (path === '/') {
      const html = await fetch('index.html');
      event.respondWith(new Response(await html.text(), {
        headers: { "content-type": "text/html" },
      }));
    } else {
      // Handle shortened link
      const link = await LINKS.get(path.slice(1));
      if (link) {
        event.respondWith(Response.redirect(link, 302));
      } else {
        event.respondWith(new Response('Not found', { status: 404 }));
      }
    }
  }
});

async function shortenLink(link) {
  const randomKey = await randomString();
  await LINKS.put(randomKey, link);
  return randomKey;
}

async function randomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}