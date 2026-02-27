import { build as viteBuild } from 'vite';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

export async function build(yamlFilePath, visualizerPath, outputDir) {
  const absoluteYamlPath = path.resolve(process.cwd(), yamlFilePath);
  const absoluteOutputDir = path.resolve(process.cwd(), outputDir);

  const modelData = yaml.load(fs.readFileSync(absoluteYamlPath, 'utf8'));

  console.log(`
  📦 Building static site...`);
  console.log(`  Model: ${absoluteYamlPath}`);
  console.log(`  Output: ${absoluteOutputDir}
`);

  await viteBuild({
    root: visualizerPath,
    base: './',
    build: {
      outDir: absoluteOutputDir,
      emptyOutDir: true
    },
    plugins: [
      {
        name: 'modmod-inject-data',
        transformIndexHtml(html) {
          return html.replace(
            '</head>',
            `<script>window.__MODMOD_DATA__ = ${JSON.stringify(modelData)};</script></head>`
          );
        }
      }
    ],
    define: {
      'window.MODMOD_CLI_MODE': JSON.stringify(false)
    }
  });

  console.log(`
  ✅ Build complete! Static site generated in: ${outputDir}`);
}
