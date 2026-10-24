const http = require('node:http');
http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html');
  response.end(`<!doctype html><html><head><title>Navbar viewport check</title><style>body{margin:0;font:14px sans-serif}header{padding:8px}iframe{display:block;border:0;height:700px;}</style></head><body><header><label>Viewport width <select aria-label="Viewport width" onchange="document.querySelector('iframe').style.width=this.value+'px'">${[320,360,390,430,768,1024,1280,1440].map(w => `<option>${w}</option>`).join('')}</select></label></header><iframe title="Clinic viewport" width="320" src="http://127.0.0.1:5173/"></iframe></body></html>`);
}).listen(5174, '127.0.0.1', () => console.log('Navbar checks: http://127.0.0.1:5174'));
