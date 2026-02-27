import { createServer } from 'vite';
import express from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import chokidar from 'chokidar';
import open from 'open';

export async function startDevServer(yamlFilePath, visualizerPath) {
  const app = express();
  app.use(express.json());

  const absoluteYamlPath = path.resolve(process.cwd(), yamlFilePath);

  // Helper to read and parse YAML
  const readYaml = () => {
    const content = fs.readFileSync(absoluteYamlPath, 'utf8');
    return yaml.load(content);
  };

  // API to get current YAML data
  app.get('/api/model', (req, res) => {
    try {
      res.json(readYaml());
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
      
      // Update or add layout section
      data.layout = layout;
      
      // Save back to file
      const updatedYaml = yaml.dump(data, { indent: 2, lineWidth: -1 });
      fs.writeFileSync(absoluteYamlPath, updatedYaml, 'utf8');
      
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // API to save entire YAML content
  app.post('/api/save-yaml', (req, res) => {
    try {
      const { yaml: yamlContent } = req.body;
      // Basic validation: check if it's valid yaml before saving
      yaml.load(yamlContent);
      fs.writeFileSync(absoluteYamlPath, yamlContent, 'utf8');
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createServer({
    root: visualizerPath,
    server: { 
      middlewareMode: true,
      hmr: true
    },
    appType: 'spa',
    define: {
      'window.MODMOD_CLI_MODE': JSON.stringify(true)
    }
  });

  app.use(vite.middlewares);

  const port = 5173;
  app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`
  🚀 ModMod Visualizer running at: ${url}`);
    console.log(`  Watching: ${absoluteYamlPath}
`);
    
    // Task 2.4: Open browser
    open(url);
  });

  // Task 2.2: File watching (notify browser via HMR or full reload if needed)
  chokidar.watch(absoluteYamlPath).on('change', () => {
    console.log(`  File changed: ${yamlFilePath}. Reloading...`);
    // We can use vite.ws.send to notify the client
    vite.ws.send({
      type: 'custom',
      event: 'model-update',
      data: readYaml()
    });
  });
}
