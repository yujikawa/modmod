import { Command } from 'commander';
import { readYaml, writeYaml, findTableById, outputError, outputWarn, outputOk } from './model-utils.js';

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
          entries.forEach(e => console.log(`  ${e.from} --> ${e.to}`));
        }
      }
    });

  // add
  cmd
    .command('add <file>')
    .description('Add a lineage entry (data flow from → to)')
    .requiredOption('--from <tableId>', 'upstream table ID')
    .requiredOption('--to <tableId>', 'downstream table ID')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      if (!findTableById(data, opts.from)) {
        return outputError(opts.json, `Table "${opts.from}" not found`);
      }
      if (!findTableById(data, opts.to)) {
        return outputError(opts.json, `Table "${opts.to}" not found`);
      }
      const entries = data.lineage || [];
      if (entries.some(e => e.from === opts.from && e.to === opts.to)) {
        return outputWarn(opts.json, `Lineage ${opts.from} → ${opts.to} already exists, skipped`);
      }
      data.lineage = [...entries, { from: opts.from, to: opts.to }];
      writeYaml(file, data);
      outputOk(opts.json, 'add', 'lineage', `${opts.from} → ${opts.to}`);
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
