import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Normalizes the schema data to ensure it's in a consistent format.
 * Similar to visualizer/src/lib/parser.ts but for the CLI side.
 */
function normalizeSchema(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid YAML: Root must be an object');
  }

  const schema = {
    tables: Array.isArray(data.tables) ? data.tables : [],
    relationships: Array.isArray(data.relationships) ? data.relationships : [],
    domains: Array.isArray(data.domains) ? data.domains : [],
    layout: data.layout || {}
  };

  schema.tables = schema.tables.map(table => ({
    ...table,
    id: table.id || 'unknown',
    name: table.name || table.id || 'Unnamed Table',
    columns: Array.isArray(table.columns) ? table.columns : []
  }));

  return schema;
}

/**
 * Sanitizes a string for use as a Mermaid entity name.
 * Spaces and hyphens are replaced with underscores.
 */
function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Generates Mermaid ER diagram syntax.
 */
function generateMermaidER(schema) {
  let mermaid = 'erDiagram\n';

  // Tables (Entities)
  schema.tables.forEach(table => {
    const tableName = sanitize(table.name);
    mermaid += `    ${tableName} {\n`;
    table.columns.forEach(col => {
      const colName = sanitize(col.logical?.name || col.id);
      const colType = sanitize(col.logical?.type || 'string');
      let markers = '';
      if (col.logical?.isPrimaryKey) markers += ' PK';
      if (col.logical?.isForeignKey) markers += ' FK';
      mermaid += `        ${colType} ${colName}${markers}\n`;
    });
    mermaid += '    }\n';
  });

  // Relationships
  schema.relationships.forEach(rel => {
    const fromTable = sanitize(schema.tables.find(t => t.id === rel.from.table)?.name || rel.from.table);
    const toTable = sanitize(schema.tables.find(t => t.id === rel.to.table)?.name || rel.to.table);
    
    // Default to one-to-many if type is missing
    let connector = '||--o{';
    if (rel.type === 'one-to-one') connector = '||--||';
    if (rel.type === 'many-to-many') connector = '}|--|{';
    if (rel.type === 'one-to-many') connector = '||--o{';

    mermaid += `    ${fromTable} ${connector} ${toTable} : ""\n`;
  });

  return mermaid;
}

/**
 * Generates the full Markdown document.
 */
export function generateMarkdown(schema, modelName) {
  let md = `# ${modelName} Data Model Definition\n\n`;

  // Mermaid ER Diagram
  md += '## ER Diagram\n\n';
  md += '```mermaid\n';
  md += generateMermaidER(schema);
  md += '```\n\n';

  // Domains
  if (schema.domains && schema.domains.length > 0) {
    md += '## Domains\n\n';
    schema.domains.forEach(domain => {
      md += `### ${domain.name}\n`;
      if (domain.description) md += `${domain.description}\n\n`;
      md += 'Associated Tables:\n';
      domain.tables.forEach(tableId => {
        const table = schema.tables.find(t => t.id === tableId);
        md += `- ${table?.name || tableId}\n`;
      });
      md += '\n';
    });
  }

  // Table Catalog
  md += '## Table Catalog\n\n';
  schema.tables.forEach(table => {
    md += `### ${table.name} ${table.appearance?.icon || ''}\n`;
    if (table.conceptual?.description) {
      md += `**Description**: ${table.conceptual.description}\n\n`;
    }
    if (table.appearance?.type) {
      md += `**Type**: ${table.appearance.type}\n\n`;
    }

    // Columns Table
    if (table.columns && table.columns.length > 0) {
      md += '#### Column Definitions\n\n';
      md += '| ID | Logical Name | Type | Key | Description |\n';
      md += '| --- | --- | --- | --- | --- |\n';
      table.columns.forEach(col => {
        const key = [
          col.logical?.isPrimaryKey ? 'PK' : '',
          col.logical?.isForeignKey ? 'FK' : ''
        ].filter(Boolean).join(', ');
        md += `| ${col.id} | ${col.logical?.name || '-'} | ${col.logical?.type || '-'} | ${key || '-'} | ${col.logical?.description || '-'} |\n`;
      });
      md += '\n';
    }

    // Sample Data
    if (table.sampleData && table.sampleData.rows && table.sampleData.rows.length > 0) {
      md += '#### Sample Data\n\n';
      md += '| ' + table.sampleData.columns.join(' | ') + ' |\n';
      md += '| ' + table.sampleData.columns.map(() => '---').join(' | ') + ' |\n';
      table.sampleData.rows.slice(0, 5).forEach(row => {
        md += '| ' + row.join(' | ') + ' |\n';
      });
      if (table.sampleData.rows.length > 5) {
        md += `\n*(Showing 5 of ${table.sampleData.rows.length} rows)*\n`;
      }
      md += '\n';
    }
  });

  return md;
}

/**
 * Main export function called by the CLI
 */
export async function exportModel(paths, options) {
  for (const inputPath of paths) {
    const absolutePath = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`  ⚠️ Warning: Path not found: ${inputPath}`);
      continue;
    }

    const stats = fs.statSync(absolutePath);
    const files = stats.isDirectory()
      ? fs.readdirSync(absolutePath).filter(f => f.endsWith('.yaml') || f.endsWith('.yml')).map(f => path.join(absolutePath, f))
      : [absolutePath];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const data = yaml.load(content);
        const schema = normalizeSchema(data);
        const modelName = path.parse(file).name.charAt(0).toUpperCase() + path.parse(file).name.slice(1).replace(/[-_]/g, ' ');
        const markdown = generateMarkdown(schema, modelName);

        if (options.output) {
          // If output is specified, we either append or use it as a directory/base
          // For now, let's just write to the specified output file if it's one file, 
          // or treat as a directory if multiple.
          let outputPath = options.output;
          if (files.length > 1 || stats.isDirectory()) {
             // ensure directory exists
             if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });
             outputPath = path.join(outputPath, `${path.parse(file).name}.md`);
          }
          
          fs.writeFileSync(outputPath, markdown, 'utf8');
          console.log(`  ✅ Exported: ${path.relative(process.cwd(), file)} -> ${outputPath}`);
        } else {
          process.stdout.write(markdown + '\n');
        }
      } catch (e) {
        console.error(`  ❌ Error exporting ${file}: ${e.message}`);
      }
    }
  }
}
