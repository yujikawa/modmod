import inquirer from 'inquirer';
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
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `File ${filePath} already exists. Overwrite?`,
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log(`  Skipping ${filePath}`);
      return;
    }
  }

  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`  Created ${filePath}`);
}

export async function initProject() {
  console.log('\n  🛠️  ModMod Project Initialization\n');

  try {
    const { agents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'agents',
        message: 'Which AI agents do you use? (Select all that apply)',
              choices: [
                { name: 'Gemini CLI', value: 'gemini' },
                { name: 'Codex', value: 'codex' },
                { name: 'Claude Code', value: 'claude' },
              ],      },
    ]);

    console.log('\n  Scaffolding modeling rules...');

    // 1. Create .modmod/rules.md
    const rulesTemplate = fs.readFileSync(path.join(__dirname, 'templates/rules.md.template'), 'utf8');
    await safeWriteFile('.modmod/rules.md', rulesTemplate);

    // 2. Create agent-specific files
    if (agents.includes('gemini')) {
      const geminiTemplate = fs.readFileSync(path.join(__dirname, 'templates/gemini-skill.md.template'), 'utf8');
      await safeWriteFile('.gemini/skills/modeler.md', geminiTemplate);
    }

    if (agents.includes('codex')) {
      const codexTemplate = fs.readFileSync(path.join(__dirname, 'templates/codex-instructions.md.template'), 'utf8');
      await safeWriteFile('.codex/instructions.md', codexTemplate);
    }

    if (agents.includes('claude')) {
      const claudeTemplate = fs.readFileSync(path.join(__dirname, 'templates/clauderules.template'), 'utf8');
      await safeWriteFile('.clauderules', claudeTemplate);
    }

    console.log('\n  ✅ Initialization complete! Customize ".modmod/rules.md" to match your project standards.\n');
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log('\n  Initialization cancelled by user.');
    } else {
      console.error('\n  An error occurred during initialization:', error.message);
    }
  }
}
