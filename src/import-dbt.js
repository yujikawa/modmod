import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function importDbt(manifestPath, options) {
  const outputPath = options.output || 'dbt-model.yaml';

  try {
    if (!fs.existsSync(manifestPath)) {
      console.error(`  ❌ target/manifest.json not found at: ${manifestPath}`);
      console.error(`  💡 Run 'dbt parse' in your dbt project first to generate this file.`);
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`  🔍 Parsing dbt manifest: ${manifestPath}`);

    const tables = [];
    const domainsMap = new Map();
    const tableIdMap = new Map(); // dbt unique_id -> table name

    // 1. Process Nodes (models, seeds, snapshots) and Sources
    const allNodes = { ...manifest.nodes, ...manifest.sources };

    for (const [uniqueId, node] of Object.entries(allNodes)) {
      // Filter only relevant resource types
      if (!['model', 'seed', 'snapshot', 'source'].includes(node.resource_type)) {
        continue;
      }

      const tableName = node.name;
      tableIdMap.set(uniqueId, tableName);

      // Extract columns if present
      const columns = [];
      if (node.columns) {
        for (const [colKey, col] of Object.entries(node.columns)) {
          columns.push({
            id: col.name,
            logical: {
              name: col.name,
              type: col.data_type || 'unknown',
              description: col.description || '' // Column description added in v1.3.0
            }
          });
        }
      }

      const tableEntry = {
        id: tableName,
        name: tableName,        // Conceptual Name (Short)
        logical_name: tableName, // Logical Name (Short)
        physical_name: node.alias || tableName,
        appearance: {
          type: 'table'
        },
        conceptual: {
          description: node.description || '' // 👈 Correct place for long description
        },
        columns: columns,
        lineage: {
          upstream: []
        }
      };

      tables.push(tableEntry);

      // 2. Domain Grouping (based on folder structure)
      const filePath = node.original_file_path || '';
      if (filePath) {
        const pathParts = filePath.split('/');
        if (pathParts.length > 1) {
          const domainName = pathParts[pathParts.length - 2];
          if (domainName !== 'models' && domainName !== 'sources') {
            if (!domainsMap.has(domainName)) {
              domainsMap.set(domainName, {
                id: domainName,
                name: domainName,
                tables: []
              });
            }
            domainsMap.get(domainName).tables.push(tableName);
          }
        }
      }
    }

    // 3. Populate Lineage
    for (const [uniqueId, node] of Object.entries(allNodes)) {
      const tableName = tableIdMap.get(uniqueId);
      if (!tableName) continue;

      const tableEntry = tables.find(t => t.id === tableName);
      if (tableEntry && node.depends_on && node.depends_on.nodes) {
        for (const upstreamId of node.depends_on.nodes) {
          const upstreamName = tableIdMap.get(upstreamId);
          if (upstreamName) {
            tableEntry.lineage.upstream.push(upstreamName);
          }
        }
      }
    }

    const outputModel = {
      tables: tables,
      relationships: [],
      domains: Array.from(domainsMap.values())
    };

    fs.writeFileSync(outputPath, yaml.dump(outputModel), 'utf8');
    console.log(`  ✅ Successfully imported dbt metadata to: ${outputPath}`);
    console.log(`  🚀 Run 'modscape dev ${outputPath}' to visualize.`);

  } catch (error) {
    console.error(`  ❌ Failed to import dbt metadata: ${error.message}`);
  }
}
