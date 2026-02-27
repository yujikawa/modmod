import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function build(yamlFilePath, visualizerPath, outputDir) {
  const absoluteYamlPath = path.resolve(process.cwd(), yamlFilePath);
  const absoluteOutputDir = path.resolve(process.cwd(), outputDir);
  const distPath = path.resolve(__dirname, '../visualizer-dist');

  if (!fs.existsSync(distPath)) {
    console.error('Error: visualizer-dist not found. Please run build in development first.');
    return;
  }

  const modelData = yaml.load(fs.readFileSync(absoluteYamlPath, 'utf8'));

  console.log(`\n  📦 Building static site...`);
  
  // Create output dir and copy all files from visualizer-dist
  if (!fs.existsSync(absoluteOutputDir)) {
    fs.mkdirSync(absoluteOutputDir, { recursive: true });
  }

  // Copy recursive helper
  const copyDir = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  copyDir(distPath, absoluteOutputDir);

  // Inject data into index.html
  const indexPath = path.join(absoluteOutputDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(
    '</head>',
    `<script>window.__MODMOD_DATA__ = ${JSON.stringify(modelData)}; window.MODMOD_CLI_MODE = false;</script></head>`
  );
  fs.writeFileSync(indexPath, html, 'utf8');

  console.log(`\n  ✅ Build complete! Static site generated in: ${outputDir}`);
}
