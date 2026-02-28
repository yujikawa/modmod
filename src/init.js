import { confirm } from '@inquirer/prompts';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function safeWriteFile(filePath, content) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(absolutePath)) {
    const overwrite = await confirm({
      message: `File ${filePath} already exists. Overwrite?`,
      default: false,
    });
    if (!overwrite) {
      console.log(`  Skipping ${filePath}`);
      return;
    }
  }

  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`  Created ${filePath}`);
}

export async function initProject(options = {}) {
  console.log('\n  🛠️  ModMod Project Initialization\n');

  try {
    const agents = [];

    // If options are provided via CLI flags, use them
    if (options.all) {
      agents.push('gemini', 'codex', 'claude');
    } else if (options.gemini || options.codex || options.claude) {
      if (options.gemini) agents.push('gemini');
      if (options.codex) agents.push('codex');
      if (options.claude) agents.push('claude');
    } else {
      // Otherwise, ask one by one (more robust than checkbox in some terminals)
      console.log('  Please confirm which AI agents you want to scaffold for:\n');
      
      if (await confirm({ message: 'Scaffold for Gemini CLI?', default: false })) {
        agents.push('gemini');
      }
      if (await confirm({ message: 'Scaffold for Codex?', default: false })) {
        agents.push('codex');
      }
      if (await confirm({ message: 'Scaffold for Claude Code?', default: false })) {
        agents.push('claude');
      }
    }

    if (agents.length === 0) {
      console.log('\n  ⚠️  No agents selected. Only ".modscape/rules.md" will be created.');
    } else {
      console.log(`\n  Selected agents: ${agents.join(', ')}`);
    }

    console.log('\n  Scaffolding modeling rules and commands...');

    // 1. Create .modscape/rules.md
    const rulesTemplatePath = path.join(__dirname, 'templates/rules.md');
    const rulesTemplate = fs.readFileSync(rulesTemplatePath, 'utf8');
    await safeWriteFile('.modscape/rules.md', rulesTemplate);

    // 2. Create agent-specific files
    if (agents.includes('gemini')) {
      const skillTemplate = fs.readFileSync(path.join(__dirname, 'templates/gemini/SKILL.md'), 'utf8');
      await safeWriteFile('.gemini/skills/modmod/SKILL.md', skillTemplate);
      
      const commandTemplate = fs.readFileSync(path.join(__dirname, 'templates/gemini/command.toml'), 'utf8');
      await safeWriteFile('.gemini/commands/modmod/modeling.toml', commandTemplate);
    }

    if (agents.includes('codex')) {
      const promptTemplate = fs.readFileSync(path.join(__dirname, 'templates/codex/prompt.md'), 'utf8');
      await safeWriteFile('.codex/prompts/modmod-modeling.md', promptTemplate);
    }

    if (agents.includes('claude')) {
      const clauderules = fs.readFileSync(path.join(__dirname, 'templates/claude/clauderules'), 'utf8');
      await safeWriteFile('.clauderules', clauderules);
      
      const commandTemplate = fs.readFileSync(path.join(__dirname, 'templates/claude/command.md'), 'utf8');
      await safeWriteFile('.claude/commands/modmod/modeling.md', commandTemplate);
    }

    console.log('\n  ✅ Initialization complete! Customize ".modscape/rules.md" to match your project standards.\n');
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log('\n  Initialization cancelled by user.');
    } else {
      console.error('\n  An error occurred during initialization:', error.message);
    }
  }
}
