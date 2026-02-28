import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
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

export async function build(paths, visualizerPath, outputDir) {
  const modelMap = scanFiles(Array.isArray(paths) ? paths : [paths]);
  const absoluteOutputDir = path.resolve(process.cwd(), outputDir);
  const distPath = path.resolve(__dirname, '../visualizer-dist');

  if (modelMap.size === 0) {
    console.error('\n  ❌ Error: No YAML files found in the specified paths.');
    return;
  }

  if (!fs.existsSync(distPath)) {
    console.error('\n  ❌ Error: visualizer-dist not found. Please run "npm run build-ui" first.\n');
    return;
  }

  console.log(`\n  📦 Building static site with ${modelMap.size} model(s)...`);
  
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

  // Prepare data for injection
  const modelsData = [];
  for (const [slug, absolutePath] of modelMap.entries()) {
    try {
      const content = fs.readFileSync(absolutePath, 'utf8');
      const schema = yaml.load(content);
      const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, ' ');
      modelsData.push({ slug, name, schema });
    } catch (e) {
      console.warn(`  ⚠️ Warning: Failed to load ${absolutePath}: ${e.message}`);
    }
  }

  // Inject data into index.html
  const indexPath = path.join(absoluteOutputDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  const injectionData = {
    isMultiFile: modelsData.length > 1,
    models: modelsData
  };

  html = html.replace(
    '</head>',
    `<script>window.__MODSCAPE_DATA__ = ${JSON.stringify(injectionData)}; window.MODSCAPE_CLI_MODE = false;</script></head>`
  );
  fs.writeFileSync(indexPath, html, 'utf8');

  console.log(`\n  ✅ Build complete! Static site generated in: ${outputDir}`);
}
