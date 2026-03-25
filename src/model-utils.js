import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Resolve `imports:` entries in a schema, merging tables from referenced YAML files.
 * Local tables take precedence over imported ones (first-local-wins on duplicate IDs).
 * Returns { schema, importedPaths } where importedPaths is the list of resolved file paths.
 *
 * @param {object} schema - Parsed schema object (may contain `imports:` key)
 * @param {string} basePath - Absolute path to the directory of the main YAML file
 * @param {Set<string>} [visited] - Set of already-visited absolute paths (circular import guard)
 */
export function resolveImports(schema, basePath, visited = new Set()) {
  const importEntries = Array.isArray(schema.imports) ? schema.imports : [];
  if (importEntries.length === 0) {
    return { schema, importedPaths: [] };
  }

  const localTableIds = new Set((schema.tables || []).map(t => t.id));
  const importedTables = [];
  const importedPaths = [];

  for (const entry of importEntries) {
    if (!entry.from) {
      console.warn('  ⚠️  imports entry missing `from` field, skipping');
      continue;
    }

    const resolvedPath = path.resolve(basePath, entry.from);

    // Circular import guard
    if (visited.has(resolvedPath)) {
      console.warn(`  ⚠️  Circular import detected: ${resolvedPath}, skipping`);
      continue;
    }

    // Missing file guard
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`  ⚠️  Import file not found: ${resolvedPath}, skipping`);
      continue;
    }

    importedPaths.push(resolvedPath);

    let sourceData;
    try {
      sourceData = yaml.load(fs.readFileSync(resolvedPath, 'utf8')) || {};
    } catch (e) {
      console.warn(`  ⚠️  Failed to read import file ${resolvedPath}: ${e.message}, skipping`);
      continue;
    }

    const sourceTables = Array.isArray(sourceData.tables) ? sourceData.tables : [];
    const filterIds = Array.isArray(entry.ids) ? new Set(entry.ids) : null;

    // Warn about ids that don't exist in the source
    if (filterIds) {
      for (const id of filterIds) {
        if (!sourceTables.some(t => t.id === id)) {
          console.warn(`  ⚠️  Import id "${id}" not found in ${resolvedPath}, skipping`);
        }
      }
    }

    for (const table of sourceTables) {
      if (filterIds && !filterIds.has(table.id)) continue;
      // Local tables take precedence — skip if already defined locally
      if (localTableIds.has(table.id)) continue;
      importedTables.push({ ...table, isImported: true });
      localTableIds.add(table.id); // Prevent duplicates from multiple import entries
    }
  }

  const resolvedSchema = {
    ...schema,
    tables: [...(schema.tables || []), ...importedTables],
    imports: undefined, // Strip imports from the resolved schema
  };

  return { schema: resolvedSchema, importedPaths };
}

export function readYaml(filePath) {
  const data = yaml.load(fs.readFileSync(filePath, 'utf8'));
  return data || {};
}

export function writeYaml(filePath, data) {
  fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
}

export function findTableById(data, id) {
  return (data.tables || []).find(t => t.id === id) || null;
}

export function findDomainById(data, id) {
  return (data.domains || []).find(d => d.id === id) || null;
}

export function output(json, message, opts = {}) {
  if (opts.json) {
    console.log(JSON.stringify(message));
  } else {
    console.log(message);
  }
}

export function outputError(json, message, hint) {
  if (json) {
    console.error(JSON.stringify({ ok: false, error: message, hint: hint || '' }));
  } else {
    console.error(`  ❌ ${message}${hint ? '\n  💡 ' + hint : ''}`);
  }
  process.exit(1);
}

export function outputWarn(json, message) {
  if (json) {
    console.error(JSON.stringify({ ok: false, warning: message }));
  } else {
    console.warn(`  ⚠️  ${message}`);
  }
}

export function outputOk(json, action, resource, id, extra = {}) {
  if (json) {
    console.log(JSON.stringify({ ok: true, action, resource, id, ...extra }));
  } else {
    const icons = { add: '✅', update: '✏️', remove: '🗑️', list: '📋', get: '🔍', member_add: '✅', member_remove: '🗑️' };
    console.log(`  ${icons[action] || '✅'} ${action} ${resource}: ${id}`);
  }
}
