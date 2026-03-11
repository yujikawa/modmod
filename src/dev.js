import express from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import chokidar from 'chokidar';
import open from 'open';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function scanFiles(inputPaths) {
  const modelMap = new Map();
  inputPaths.forEach(inputPath => {
    const absolutePath = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(absolutePath)) return;
    const stats = fs.statSync(absolutePath);
    if (stats.isDirectory()) {
      fs.readdirSync(absolutePath).forEach(file => {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          modelMap.set(path.parse(file).name, path.join(absolutePath, file));
        }
      });
    } else if (stats.isFile() && (inputPath.endsWith('.yaml') || inputPath.endsWith('.yml'))) {
      modelMap.set(path.parse(absolutePath).name, absolutePath);
    }
  });
  return modelMap;
}

export async function startDevServer(paths) {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json({ limit: '10mb' }));
  const inputPaths = Array.isArray(paths) ? paths : [paths];
  let modelMap = scanFiles(inputPaths);
  const distPath = path.resolve(__dirname, '../visualizer-dist');

  const getModelPath = (slug) => modelMap.get(slug) || modelMap.values().next().value;

  const broadcast = (msg) => {
    const data = JSON.stringify(msg);
    wss.clients.forEach(c => { if (c.readyState === 1) c.send(data); });
  };

  app.get('/api/files', (req, res) => {
    modelMap = scanFiles(inputPaths);
    res.json(Array.from(modelMap.entries()).map(([slug, fullPath]) => ({
      slug, name: slug, path: path.relative(process.cwd(), fullPath)
    })));
  });

  app.get('/api/model', (req, res) => {
    const p = getModelPath(req.query.model);
    if (!p) return res.status(404).json({ error: 'Not found' });
    try { res.json(yaml.load(fs.readFileSync(p, 'utf8'))); } catch (e) { res.status(500).send(e.message); }
  });

  app.post('/api/save', (req, res) => {
    const p = getModelPath(req.query.model);
    try { fs.writeFileSync(p, req.body.yaml, 'utf8'); res.json({ success: true }); } catch (e) { res.status(500).send(e.message); }
  });

  app.use(express.static(distPath, { index: false }));

  app.use((req, res) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      try {
        const html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
        return res.send(html.replace('</head>', '<script>window.MODSCAPE_CLI_MODE=true;</script></head>'));
      } catch (e) {}
    }
    res.status(404).send('Not Found');
  });

  server.listen(5173, () => {
    console.log(`\n  🚀 Modscape Visualizer: http://localhost:5173`);
    console.log(`  👀 Watching: ${inputPaths.join(', ')}`);
    open('http://localhost:5173');
  });

  // Debounced file watcher
  let watchTimeout = null;
  chokidar.watch(inputPaths, { 
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 100 }
  }).on('all', (event, changedPath) => {
    if (!changedPath.endsWith('.yaml') && !changedPath.endsWith('.yml')) return;
    
    if (watchTimeout) clearTimeout(watchTimeout);
    watchTimeout = setTimeout(() => {
      console.log(`  ✨ File ${event}: ${path.relative(process.cwd(), changedPath)}`);
      broadcast({ type: 'update' });
    }, 300);
  });
}
