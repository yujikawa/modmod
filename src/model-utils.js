import fs from 'fs';
import yaml from 'js-yaml';

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
