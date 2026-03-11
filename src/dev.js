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
    if (!fs.existsSync(absolutePath)) {
      console.warn(`  ⚠️ Warning: Path not found: ${inputPath}`);
      return;
    }

    const stats = fs.statSync(absolutePath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(absolutePath);
      files.forEach(file => {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const slug = path.parse(file).name;
          const fullPath = path.join(absolutePath, file);
          if (modelMap.has(slug)) {
            // Collision handling: append folder name
            const parentName = path.basename(absolutePath);
            modelMap.set(`${parentName}-${slug}`, fullPath);
          } else {
            modelMap.set(slug, fullPath);
          }
        }
      });
    } else if (stats.isFile() && (inputPath.endsWith('.yaml') || inputPath.endsWith('.yml'))) {
      const slug = path.parse(absolutePath).name;
      modelMap.set(slug, absolutePath);
    }
  });
  return modelMap;
}

export async function startDevServer(paths, visualizerPath) {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json({ limit: '10mb' }));

  const inputPaths = Array.isArray(paths) ? paths : [paths];
  let modelMap = scanFiles(inputPaths);
  const distPath = path.resolve(__dirname, '../visualizer-dist');

  if (modelMap.size === 0) {
    console.error(`\n  ❌ Error: No YAML files found in the specified paths.`);
    return;
  }

  if (!fs.existsSync(distPath)) {
    console.error(`\n  ❌ Error: visualizer-dist not found at ${distPath}`);
    console.log('  Please run "npm run build-ui" first.\n');
    return;
  }

  // Helper to get absolute path from model slug
  const getModelPath = (slug) => {
    if (slug) return modelMap.get(slug);
    // If no slug provided, return the first available model
    return modelMap.values().next().value;
  };

  // Broadcast function to notify all connected clients
  const broadcast = (message) => {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(data);
      }
    });
  };

  // API to list all available models - re-scans on every request
  app.get('/api/files', (req, res) => {
    modelMap = scanFiles(inputPaths);
    const files = Array.from(modelMap.entries()).map(([slug, fullPath]) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, ' '),
      path: path.relative(process.cwd(), fullPath)
    }));
    res.json(files);
  });

  // API to get current YAML data
  app.get('/api/model', (req, res) => {
    const modelPath = getModelPath(req.query.model);
    if (!modelPath || !fs.existsSync(modelPath)) {
      return res.status(404).json({ error: 'Model not found' });
    }

    try {
      const content = fs.readFileSync(modelPath, 'utf8');
      res.json(yaml.load(content));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // API to save entire YAML content
  app.post('/api/save', (req, res) => {
    const modelPath = getModelPath(req.query.model);
    if (!modelPath) return res.status(404).json({ error: 'Model not found' });

    try {
      const { yaml: yamlContent } = req.body;
      // Basic validation
      yaml.load(yamlContent);
      fs.writeFileSync(modelPath, yamlContent, 'utf8');
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Serve static files EXCEPT index.html
  app.use(express.static(distPath, { index: false }));

  // Intercept index.html to inject CLI_MODE flag
  app.use((req, res) => {
    try {
      let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
      html = html.replace(
        '</head>',
        '<script>window.MODSCAPE_CLI_MODE = true;</script></head>'
      );
      res.send(html);
    } catch (e) {
      res.status(500).send('Error loading visualizer');
    }
  });

  const port = 5173;
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n  🚀 Modscape Visualizer running at: ${url}`);
    console.log(`  Watching ${modelMap.size} file(s)`);
    open(url);
  });

  // Debounced file watcher
  let changeTimeout = null;
  chokidar.watch(inputPaths, { ignoreInitial: true }).on('all', (event, changedPath) => {
    if (!changedPath.endsWith('.yaml') && !changedPath.endsWith('.yml')) return;
    
    if (changeTimeout) clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
      console.log(`  File system event (${event}): ${path.relative(process.cwd(), changedPath)}`);
      
      if (event === 'change') {
        broadcast({ type: 'update', path: changedPath });
      } else if (event === 'add' || event === 'unlink') {
        broadcast({ type: 'files_changed' });
      }
    }, 200);
  });
}

