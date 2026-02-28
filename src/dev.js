import express from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import chokidar from 'chokidar';
import open from 'open';
import { fileURLToPath } from 'url';

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
  app.use(express.json());

  const modelMap = scanFiles(Array.isArray(paths) ? paths : [paths]);
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

  // API to list all available models
  app.get('/api/files', (req, res) => {
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

  // API to save layout changes
  app.post('/api/layout', (req, res) => {
    const modelPath = getModelPath(req.query.model);
    if (!modelPath) return res.status(404).json({ error: 'Model not found' });

    try {
      const layout = req.body;
      const content = fs.readFileSync(modelPath, 'utf8');
      const data = yaml.load(content);
      data.layout = layout;
      fs.writeFileSync(modelPath, yaml.dump(data, { indent: 2, lineWidth: -1 }), 'utf8');
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // API to save entire YAML content
  app.post('/api/save-yaml', (req, res) => {
    const modelPath = getModelPath(req.query.model);
    if (!modelPath) return res.status(404).json({ error: 'Model not found' });

    try {
      const { yaml: yamlContent } = req.body;
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
  app.get('{/*path}', (req, res) => {
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
  app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n  🚀 Modscape Visualizer running at: ${url}`);
    console.log(`  Watching ${modelMap.size} file(s)`);
    open(url);
  });

  chokidar.watch(Array.from(modelMap.values())).on('change', (changedPath) => {
    console.log(`  File changed: ${path.relative(process.cwd(), changedPath)}. Please refresh the browser.`);
  });
}
