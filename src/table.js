import { Command } from 'commander';
import { readYaml, writeYaml, findTableById, outputError, outputWarn, outputOk } from './model-utils.js';

export function tableCommand() {
  const cmd = new Command('table').description('Manage tables in a YAML model');

  // list
  cmd
    .command('list <file>')
    .description('List all tables in the model')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const tables = (data.tables || []).map(t => ({ id: t.id, name: t.name }));
      if (opts.json) {
        console.log(JSON.stringify(tables));
      } else {
        if (tables.length === 0) {
          console.log('  (no tables)');
        } else {
          tables.forEach(t => console.log(`  ${t.id}  ${t.name || ''}`));
        }
      }
    });

  // get
  cmd
    .command('get <file>')
    .description('Get a table definition by ID')
    .requiredOption('--id <id>', 'table ID')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const table = findTableById(data, opts.id);
      if (!table) return outputError(opts.json, `Table "${opts.id}" not found`);
      if (opts.json) {
        console.log(JSON.stringify(table));
      } else {
        console.log(JSON.stringify(table, null, 2));
      }
    });

  // add
  cmd
    .command('add <file>')
    .description('Add a new table to the model')
    .requiredOption('--id <id>', 'table ID (snake_case)')
    .requiredOption('--name <name>', 'conceptual name')
    .option('--type <type>', 'appearance type (fact|dimension|mart|hub|link|satellite|table)')
    .option('--logical-name <name>', 'logical (business) name')
    .option('--physical-name <name>', 'physical (database) table name')
    .option('--description <text>', 'conceptual description')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      if (findTableById(data, opts.id)) {
        return outputError(opts.json, `Table "${opts.id}" already exists`, 'Use `table update` instead');
      }
      const table = { id: opts.id, name: opts.name };
      if (opts.logicalName) table.logical_name = opts.logicalName;
      if (opts.physicalName) table.physical_name = opts.physicalName;
      if (opts.type) table.appearance = { type: opts.type };
      if (opts.description) table.conceptual = { description: opts.description };
      if (!data.tables) data.tables = [];
      data.tables.push(table);
      writeYaml(file, data);
      outputOk(opts.json, 'add', 'table', opts.id);
    });

  // update
  cmd
    .command('update <file>')
    .description('Update fields of an existing table')
    .requiredOption('--id <id>', 'table ID to update')
    .option('--name <name>', 'conceptual name')
    .option('--type <type>', 'appearance type')
    .option('--logical-name <name>', 'logical (business) name')
    .option('--physical-name <name>', 'physical (database) table name')
    .option('--description <text>', 'conceptual description')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const table = findTableById(data, opts.id);
      if (!table) return outputError(opts.json, `Table "${opts.id}" not found`, 'Use `table add` instead');
      if (opts.name) table.name = opts.name;
      if (opts.logicalName) table.logical_name = opts.logicalName;
      if (opts.physicalName) table.physical_name = opts.physicalName;
      if (opts.type) {
        table.appearance = table.appearance || {};
        table.appearance.type = opts.type;
      }
      if (opts.description) {
        table.conceptual = table.conceptual || {};
        table.conceptual.description = opts.description;
      }
      writeYaml(file, data);
      outputOk(opts.json, 'update', 'table', opts.id);
    });

  // remove
  cmd
    .command('remove <file>')
    .description('Remove a table from the model')
    .requiredOption('--id <id>', 'table ID to remove')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const before = (data.tables || []).length;
      data.tables = (data.tables || []).filter(t => t.id !== opts.id);
      if (data.tables.length === before) {
        return outputWarn(opts.json, `Table "${opts.id}" not found, nothing removed`);
      }
      writeYaml(file, data);
      outputOk(opts.json, 'remove', 'table', opts.id);
    });

  return cmd;
}
