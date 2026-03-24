import { Command } from 'commander';
import { readYaml, writeYaml, findTableById, findDomainById, outputError, outputWarn, outputOk } from './model-utils.js';

export function domainCommand() {
  const cmd = new Command('domain').description('Manage domains in a YAML model');

  // list
  cmd
    .command('list <file>')
    .description('List all domains')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const domains = (data.domains || []).map(d => ({ id: d.id, name: d.name }));
      if (opts.json) {
        console.log(JSON.stringify(domains));
      } else {
        if (domains.length === 0) {
          console.log('  (no domains)');
        } else {
          domains.forEach(d => console.log(`  ${d.id}  ${d.name || ''}`));
        }
      }
    });

  // get
  cmd
    .command('get <file>')
    .description('Get a domain definition by ID')
    .requiredOption('--id <id>', 'domain ID')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const domain = findDomainById(data, opts.id);
      if (!domain) return outputError(opts.json, `Domain "${opts.id}" not found`);
      if (opts.json) {
        console.log(JSON.stringify(domain));
      } else {
        console.log(JSON.stringify(domain, null, 2));
      }
    });

  // add
  cmd
    .command('add <file>')
    .description('Add a new domain')
    .requiredOption('--id <id>', 'domain ID (snake_case)')
    .requiredOption('--name <name>', 'display name')
    .option('--description <text>', 'description')
    .option('--color <color>', 'background color (e.g. rgba(59,130,246,0.1))')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      if (findDomainById(data, opts.id)) {
        return outputError(opts.json, `Domain "${opts.id}" already exists`, 'Use `domain update` instead');
      }
      const domain = { id: opts.id, name: opts.name, tables: [] };
      if (opts.description) domain.description = opts.description;
      if (opts.color) domain.color = opts.color;
      if (!data.domains) data.domains = [];
      data.domains.push(domain);
      writeYaml(file, data);
      outputOk(opts.json, 'add', 'domain', opts.id);
    });

  // update
  cmd
    .command('update <file>')
    .description('Update fields of an existing domain')
    .requiredOption('--id <id>', 'domain ID to update')
    .option('--name <name>', 'display name')
    .option('--description <text>', 'description')
    .option('--color <color>', 'background color')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const domain = findDomainById(data, opts.id);
      if (!domain) return outputError(opts.json, `Domain "${opts.id}" not found`, 'Use `domain add` instead');
      if (opts.name) domain.name = opts.name;
      if (opts.description) domain.description = opts.description;
      if (opts.color) domain.color = opts.color;
      writeYaml(file, data);
      outputOk(opts.json, 'update', 'domain', opts.id);
    });

  // remove
  cmd
    .command('remove <file>')
    .description('Remove a domain from the model')
    .requiredOption('--id <id>', 'domain ID to remove')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const before = (data.domains || []).length;
      data.domains = (data.domains || []).filter(d => d.id !== opts.id);
      if (data.domains.length === before) {
        return outputWarn(opts.json, `Domain "${opts.id}" not found, nothing removed`);
      }
      writeYaml(file, data);
      outputOk(opts.json, 'remove', 'domain', opts.id);
    });

  // member subcommand
  const member = new Command('member').description('Manage table membership in a domain');

  member
    .command('add <file>')
    .description('Add a table to a domain')
    .requiredOption('--domain <domainId>', 'domain ID')
    .requiredOption('--table <tableId>', 'table ID to add')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const domain = findDomainById(data, opts.domain);
      if (!domain) return outputError(opts.json, `Domain "${opts.domain}" not found`);
      if (!findTableById(data, opts.table)) {
        return outputError(opts.json, `Table "${opts.table}" not found`);
      }
      if (!domain.tables) domain.tables = [];
      if (domain.tables.includes(opts.table)) {
        return outputWarn(opts.json, `Table "${opts.table}" is already in domain "${opts.domain}", skipped`);
      }
      domain.tables.push(opts.table);
      writeYaml(file, data);
      outputOk(opts.json, 'member_add', 'domain', `${opts.domain} ← ${opts.table}`);
    });

  member
    .command('remove <file>')
    .description('Remove a table from a domain')
    .requiredOption('--domain <domainId>', 'domain ID')
    .requiredOption('--table <tableId>', 'table ID to remove')
    .option('--json', 'output as JSON')
    .action((file, opts) => {
      const data = readYaml(file);
      const domain = findDomainById(data, opts.domain);
      if (!domain) return outputError(opts.json, `Domain "${opts.domain}" not found`);
      const before = (domain.tables || []).length;
      domain.tables = (domain.tables || []).filter(t => t !== opts.table);
      if (domain.tables.length === before) {
        return outputWarn(opts.json, `Table "${opts.table}" not found in domain "${opts.domain}", nothing removed`);
      }
      writeYaml(file, data);
      outputOk(opts.json, 'member_remove', 'domain', `${opts.domain} ✕ ${opts.table}`);
    });

  cmd.addCommand(member);
  return cmd;
}
