import { Command } from 'commander';
import { readYaml, writeYaml, findTableById, outputError, outputWarn, outputOk } from './model-utils.js';

// Parse "table.column" or "table" into { tableId, columnId }
function parseRef(ref) {
  const parts = ref.split('.');
  return { tableId: parts[0], columnId: parts[1] || null };
}

function sameRel(r, fromTableId, toTableId) {
  return r.from?.table === fromTableId && r.to?.table === toTableId;
}

export function relationshipCommand() {
  const cmd = new Command('relationship').description('Manage relationships in a YAML model');

  // list
  cmd
    .command('list <file>')
    .description('List all relationships')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const rels = data.relationships || [];
      if (opts.json) {
        console.log(JSON.stringify(rels));
      } else {
        if (rels.length === 0) {
          console.log('  (no relationships)');
        } else {
          rels.forEach(r => {
            const from = r.from?.column ? `${r.from.table}.${r.from.column}` : r.from?.table;
            const to = r.to?.column ? `${r.to.table}.${r.to.column}` : r.to?.table;
            console.log(`  ${from} --[${r.type}]--> ${to}`);
          });
        }
      }
    });

  // add
  cmd
    .command('add <file>')
    .description('Add a relationship between two tables')
    .requiredOption('--from <ref>', 'source table (table.column or table)')
    .requiredOption('--to <ref>', 'target table (table.column or table)')
    .requiredOption('--type <type>', 'cardinality (one-to-one|one-to-many|many-to-one|many-to-many)')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const from = parseRef(opts.from);
      const to = parseRef(opts.to);
      if (!findTableById(data, from.tableId)) {
        return outputError(opts.json, `Table "${from.tableId}" not found`);
      }
      if (!findTableById(data, to.tableId)) {
        return outputError(opts.json, `Table "${to.tableId}" not found`);
      }
      const rels = data.relationships || [];
      if (rels.some(r => sameRel(r, from.tableId, to.tableId))) {
        return outputWarn(opts.json, `Relationship ${from.tableId} → ${to.tableId} already exists, skipped`);
      }
      const rel = {
        from: { table: from.tableId, ...(from.columnId ? { column: from.columnId } : {}) },
        to: { table: to.tableId, ...(to.columnId ? { column: to.columnId } : {}) },
        type: opts.type,
      };
      data.relationships = [...rels, rel];
      writeYaml(file, data);
      outputOk(opts.json, 'add', 'relationship', `${opts.from} → ${opts.to}`);
    });

  // remove
  cmd
    .command('remove <file>')
    .description('Remove a relationship')
    .requiredOption('--from <ref>', 'source table (table.column or table)')
    .requiredOption('--to <ref>', 'target table (table.column or table)')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const from = parseRef(opts.from);
      const to = parseRef(opts.to);
      const before = (data.relationships || []).length;
      data.relationships = (data.relationships || []).filter(r => !sameRel(r, from.tableId, to.tableId));
      if (data.relationships.length === before) {
        return outputWarn(opts.json, `Relationship ${from.tableId} → ${to.tableId} not found, nothing removed`);
      }
      writeYaml(file, data);
      outputOk(opts.json, 'remove', 'relationship', `${opts.from} → ${opts.to}`);
    });

  return cmd;
}
