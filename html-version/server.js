const http = require('http');
const https = require('https');

const PORT = 5000;
const NVIDIA_API_KEY = "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";

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/gemma') {
    let bodyStr = '';
    req.on('data', chunk => bodyStr += chunk);
    req.on('end', () => {
      try {
        const clientData = JSON.parse(bodyStr);
        const promptText = clientData.prompt || "Generate MCQ questions";

        const nvidiaPayload = JSON.stringify({
          messages: [{ role: 'user', content: promptText }],
          model: clientData.model || 'meta/llama-3.1-8b-instruct',
          max_tokens: 2048,
          temperature: 0.7
        });

        const nvidiaReq = https.request('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(nvidiaPayload)
          }
        }, nvidiaRes => {
          let reply = '';
          nvidiaRes.on('data', c => reply += c);
          nvidiaRes.on('end', () => {
            res.writeHead(nvidiaRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(reply);
          });
        });

        nvidiaReq.on('error', err => {
          console.error("NVIDIA API Proxy error:", err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        });

        nvidiaReq.write(nvidiaPayload);
        nvidiaReq.end();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON input" }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 NVIDIA Gemma Proxy Server running at http://localhost:${PORT}/api/gemma`);
});
