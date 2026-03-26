import path from 'path';
import { Command } from 'commander';
import { readYaml, writeYaml, findTableById, resolveImports, outputError, outputWarn, outputOk } from './model-utils.js';

export function lineageCommand() {
  const cmd = new Command('lineage').description('Manage data lineage in a YAML model');

  // list
  cmd
    .command('list <file>')
    .description('List all lineage entries')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const entries = data.lineage || [];
      if (opts.json) {
        console.log(JSON.stringify(entries));
      } else {
        if (entries.length === 0) {
          console.log('  (no lineage)');
        } else {
          entries.forEach(e => {
            const desc = e.description ? `  # ${e.description}` : '';
            console.log(`  ${e.from} --> ${e.to}${desc}`);
          });
        }
      }
    });

  // add
  cmd
    .command('add <file>')
    .description('Add a lineage entry (data flow from → to)')
    .requiredOption('--from <tableId>', 'upstream table ID')
    .requiredOption('--to <tableId>', 'downstream table ID')
    .option('--description <text>', 'description of the transformation or filter')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const { schema: resolved } = resolveImports(data, path.dirname(path.resolve(file)));
      if (!findTableById(resolved, opts.from)) {
        return outputError(opts.json, `Table "${opts.from}" not found`);
      }
      if (!findTableById(resolved, opts.to)) {
        return outputError(opts.json, `Table "${opts.to}" not found`);
      }
      const entries = data.lineage || [];
      if (entries.some(e => e.from === opts.from && e.to === opts.to)) {
        return outputWarn(opts.json, `Lineage ${opts.from} → ${opts.to} already exists, skipped`);
      }
      const entry = { from: opts.from, to: opts.to };
      if (opts.description) entry.description = opts.description;
      data.lineage = [...entries, entry];
      writeYaml(file, data);
      outputOk(opts.json, 'add', 'lineage', `${opts.from} → ${opts.to}`);
    });

  // update
  cmd
    .command('update <file>')
    .description('Update a lineage entry (e.g. set description)')
    .requiredOption('--from <tableId>', 'upstream table ID')
    .requiredOption('--to <tableId>', 'downstream table ID')
    .option('--description <text>', 'description of the transformation or filter')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const entries = data.lineage || [];
      const idx = entries.findIndex(e => e.from === opts.from && e.to === opts.to);
      if (idx === -1) {
        return outputError(opts.json, `Lineage ${opts.from} → ${opts.to} not found`);
      }
      const updated = { ...entries[idx] };
      if (opts.description !== undefined) {
        if (opts.description === '') {
          delete updated.description;
        } else {
          updated.description = opts.description;
        }
      }
      data.lineage = [...entries.slice(0, idx), updated, ...entries.slice(idx + 1)];
      writeYaml(file, data);
      outputOk(opts.json, 'update', 'lineage', `${opts.from} → ${opts.to}`);
    });

  // remove
  cmd
    .command('remove <file>')
    .description('Remove a lineage entry')
    .requiredOption('--from <tableId>', 'upstream table ID')
    .requiredOption('--to <tableId>', 'downstream table ID')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const before = (data.lineage || []).length;
      data.lineage = (data.lineage || []).filter(e => !(e.from === opts.from && e.to === opts.to));
      if (data.lineage.length === before) {
        return outputWarn(opts.json, `Lineage ${opts.from} → ${opts.to} not found, nothing removed`);
      }
      writeYaml(file, data);
      outputOk(opts.json, 'remove', 'lineage', `${opts.from} → ${opts.to}`);
    });

  return cmd;
}
