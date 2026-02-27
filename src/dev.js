import express from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import chokidar from 'chokidar';
import open from 'open';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startDevServer(yamlFilePath, visualizerPath) {
  const app = express();
  app.use(express.json());

  const absoluteYamlPath = path.resolve(process.cwd(), yamlFilePath);
  const distPath = path.resolve(__dirname, '../visualizer-dist');

  if (!fs.existsSync(distPath)) {
    console.error(`\n  ❌ Error: visualizer-dist not found at ${distPath}`);
    console.log('  Please run "npm run build-ui" first.\n');
    return;
  }

  // API to get current YAML data
  app.get('/api/model', (req, res) => {
    try {
      const content = fs.readFileSync(absoluteYamlPath, 'utf8');
      res.json(yaml.load(content));
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // API to save layout changes
  app.post('/api/layout', (req, res) => {
    try {
      const layout = req.body;
      const content = fs.readFileSync(absoluteYamlPath, 'utf8');
      const data = yaml.load(content);
      data.layout = layout;
      fs.writeFileSync(absoluteYamlPath, yaml.dump(data, { indent: 2, lineWidth: -1 }), 'utf8');
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // API to save entire YAML content
  app.post('/api/save-yaml', (req, res) => {
    try {
      const { yaml: yamlContent } = req.body;
      yaml.load(yamlContent);
      fs.writeFileSync(absoluteYamlPath, yamlContent, 'utf8');
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
      // Inject the flag here
      html = html.replace(
        '</head>',
        '<script>window.MODMOD_CLI_MODE = true;</script></head>'
      );
      res.send(html);
    } catch (e) {
      res.status(500).send('Error loading visualizer');
    }
  });

  const port = 5173;
  app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n  🚀 ModMod Visualizer running at: ${url}`);
    console.log(`  Watching: ${absoluteYamlPath}\n`);
    open(url);
  });

  chokidar.watch(absoluteYamlPath).on('change', () => {
    console.log(`  File changed: ${yamlFilePath}. Please refresh the browser.`);
  });
}
