import { Command } from 'commander';
import { readYaml, writeYaml, findTableById, outputError, outputWarn, outputOk } from './model-utils.js';

function findColumnById(table, id) {
  return (table.columns || []).find(c => c.id === id) || null;
}

export function columnCommand() {
  const cmd = new Command('column').description('Manage columns in a table');

  // add
  cmd
    .command('add <file>')
    .description('Add a column to a table')
    .requiredOption('--table <tableId>', 'target table ID')
    .requiredOption('--id <id>', 'column ID (snake_case)')
    .requiredOption('--name <name>', 'logical name')
    .option('--type <type>', 'logical type (Int|String|Decimal|Date|Timestamp|Boolean|...)')
    .option('--primary-key', 'mark as primary key')
    .option('--foreign-key', 'mark as foreign key')
    .option('--physical-name <name>', 'physical column name')
    .option('--physical-type <type>', 'physical column type (e.g. BIGINT)')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const table = findTableById(data, opts.table);
      if (!table) return outputError(opts.json, `Table "${opts.table}" not found`);
      if (findColumnById(table, opts.id)) {
        return outputError(opts.json, `Column "${opts.id}" already exists in table "${opts.table}"`, 'Use `column update` instead');
      }
      const column = { id: opts.id, logical: { name: opts.name } };
      if (opts.type) column.logical.type = opts.type;
      if (opts.primaryKey) column.logical.isPrimaryKey = true;
      if (opts.foreignKey) column.logical.isForeignKey = true;
      if (opts.physicalName || opts.physicalType) {
        column.physical = {};
        if (opts.physicalName) column.physical.name = opts.physicalName;
        if (opts.physicalType) column.physical.type = opts.physicalType;
      }
      if (!table.columns) table.columns = [];
      table.columns.push(column);
      writeYaml(file, data);
      outputOk(opts.json, 'add', 'column', `${opts.table}.${opts.id}`);
    });

  // update
  cmd
    .command('update <file>')
    .description('Update a column in a table')
    .requiredOption('--table <tableId>', 'target table ID')
    .requiredOption('--id <id>', 'column ID to update')
    .option('--name <name>', 'logical name')
    .option('--type <type>', 'logical type')
    .option('--primary-key <bool>', 'set isPrimaryKey (true|false)')
    .option('--foreign-key <bool>', 'set isForeignKey (true|false)')
    .option('--physical-name <name>', 'physical column name')
    .option('--physical-type <type>', 'physical column type')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const table = findTableById(data, opts.table);
      if (!table) return outputError(opts.json, `Table "${opts.table}" not found`);
      const column = findColumnById(table, opts.id);
      if (!column) return outputError(opts.json, `Column "${opts.id}" not found in table "${opts.table}"`, 'Use `column add` instead');
      column.logical = column.logical || {};
      if (opts.name) column.logical.name = opts.name;
      if (opts.type) column.logical.type = opts.type;
      if (opts.primaryKey !== undefined) column.logical.isPrimaryKey = opts.primaryKey === 'true';
      if (opts.foreignKey !== undefined) column.logical.isForeignKey = opts.foreignKey === 'true';
      if (opts.physicalName || opts.physicalType) {
        column.physical = column.physical || {};
        if (opts.physicalName) column.physical.name = opts.physicalName;
        if (opts.physicalType) column.physical.type = opts.physicalType;
      }
      writeYaml(file, data);
      outputOk(opts.json, 'update', 'column', `${opts.table}.${opts.id}`);
    });

  // remove
  cmd
    .command('remove <file>')
    .description('Remove a column from a table')
    .requiredOption('--table <tableId>', 'target table ID')
    .requiredOption('--id <id>', 'column ID to remove')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const table = findTableById(data, opts.table);
      if (!table) return outputError(opts.json, `Table "${opts.table}" not found`);
      const before = (table.columns || []).length;
      table.columns = (table.columns || []).filter(c => c.id !== opts.id);
      if (table.columns.length === before) {
        return outputWarn(opts.json, `Column "${opts.id}" not found in table "${opts.table}", nothing removed`);
      }
      writeYaml(file, data);
      outputOk(opts.json, 'remove', 'column', `${opts.table}.${opts.id}`);
    });

  return cmd;
}
