import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function importDbt(projectDir, options) {
  const resolvedDir = path.resolve(projectDir || '.');
  const manifestPath = path.join(resolvedDir, 'target', 'manifest.json');
  const splitBy = options.splitBy || null;

  // dbt_project.ymlからプロジェクト名を取得
  const dbtProjectPath = path.join(resolvedDir, 'dbt_project.yml');
  let projectName = path.basename(resolvedDir); // fallback
  if (fs.existsSync(dbtProjectPath)) {
    const dbtProject = yaml.load(fs.readFileSync(dbtProjectPath, 'utf8'));
    projectName = dbtProject.name || projectName;
  }

  const outputDir = options.output || `modscape-${projectName}`;

  try {
    if (!fs.existsSync(manifestPath)) {
      console.error(`  ❌ manifest.json not found at: ${manifestPath}`);
      console.error(`  💡 Run 'dbt parse' in your dbt project first.`);
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`  🔍 Parsing dbt manifest: ${manifestPath}`);

    const tables = [];
    const domainsMap = new Map();
    const tableIdMap = new Map();
    const tableSplitKeyMap = new Map();

    const allNodes = { ...manifest.nodes, ...manifest.sources };

    for (const [uniqueId, node] of Object.entries(allNodes)) {
      if (!['model', 'seed', 'snapshot', 'source'].includes(node.resource_type)) continue;

      const tableName = node.name;
      tableIdMap.set(uniqueId, tableName);

      const columns = [];
      if (node.columns) {
        for (const [colKey, col] of Object.entries(node.columns)) {
          columns.push({
            id: col.name,
            logical: {
              name: col.name,
              type: col.data_type || 'unknown',
              description: col.description || ''
            }
          });
        }
      }

      const tableEntry = {
        id: tableName,
        name: tableName,
        logical_name: tableName,
        physical_name: node.alias || tableName,
        appearance: { type: 'table' },
        conceptual: { description: node.description || '' },
        columns,
        lineage: { upstream: [] }
      };

      tables.push(tableEntry);

      // split keyを決定
      let splitKey = 'default';
      if (splitBy === 'schema') {
        splitKey = node.schema || node.config?.schema || 'default';
      } else if (splitBy === 'folder') {
        const filePath = node.original_file_path || '';
        const pathParts = filePath.split('/');
        splitKey = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'default';
      } else if (splitBy === 'tag') {
        const tags = node.tags || node.config?.tags || [];
        splitKey = tags.length > 0 ? tags[0] : 'untagged';
      }
      tableSplitKeyMap.set(tableName, splitKey);

      // domainsMap（folder構造から常に構築）
      const filePath = node.original_file_path || '';
      if (filePath) {
        const pathParts = filePath.split('/');
        if (pathParts.length > 1) {
          const domainName = pathParts[pathParts.length - 2];
          if (domainName !== 'models' && domainName !== 'sources') {
            if (!domainsMap.has(domainName)) {
              domainsMap.set(domainName, { id: domainName, name: domainName, tables: [] });
            }
            domainsMap.get(domainName).tables.push(tableName);
          }
        }
      }
    }

    // lineage
    for (const [uniqueId, node] of Object.entries(allNodes)) {
      const tableName = tableIdMap.get(uniqueId);
      if (!tableName) continue;
      const tableEntry = tables.find(t => t.id === tableName);
      if (tableEntry && node.depends_on?.nodes) {
        for (const upstreamId of node.depends_on.nodes) {
          const upstreamName = tableIdMap.get(upstreamId);
          if (upstreamName) tableEntry.lineage.upstream.push(upstreamName);
        }
      }
    }

    // 出力先フォルダを作成
    fs.mkdirSync(outputDir, { recursive: true });

    if (splitBy) {
      // ファイルを分割して出力
      const splitMap = new Map();

      for (const table of tables) {
        const key = tableSplitKeyMap.get(table.id) || 'default';
        if (!splitMap.has(key)) splitMap.set(key, []);
        splitMap.get(key).push(table);
      }

      let fileCount = 0;
      for (const [key, splitTables] of splitMap.entries()) {
        const splitOutputPath = path.join(outputDir, `${key}.yaml`);
        const splitDomains = Array.from(domainsMap.values())
          .filter(d => d.tables.some(tid => splitTables.some(t => t.id === tid)))
          .map(d => ({
            ...d,
            tables: d.tables.filter(tid => splitTables.some(t => t.id === tid))
          }));

        const outputModel = {
          tables: splitTables,
          relationships: [],
          domains: splitDomains
        };

        fs.writeFileSync(splitOutputPath, yaml.dump(outputModel), 'utf8');
        console.log(`  📄 ${splitOutputPath} (${splitTables.length} tables)`);
        fileCount++;
      }

      console.log(`  ✅ Split into ${fileCount} files → ${outputDir}/`);
      console.log(`  🚀 Run 'modscape dev ${outputDir}' to visualize.`);

    } else {
      // 1ファイルに出力
      const outputPath = path.join(outputDir, 'dbt-model.yaml');
      const outputModel = {
        tables,
        relationships: [],
        domains: Array.from(domainsMap.values())
      };

      fs.writeFileSync(outputPath, yaml.dump(outputModel), 'utf8');
      console.log(`  ✅ Successfully imported ${tables.length} tables → ${outputPath}`);
      console.log(`  🚀 Run 'modscape dev ${outputDir}' to visualize.`);
    }

  } catch (error) {
    console.error(`  ❌ Failed to import dbt metadata: ${error.message}`);
  }
}