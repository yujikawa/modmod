#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { startDevServer } from './dev.js';
import { build } from './build.js';
import { initProject } from './init.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VISUALIZER_PATH = path.resolve(__dirname, '../visualizer');
const program = new Command();

program
  .name('modscape')
  .description('A YAML-driven data modeling visualizer CLI')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize project with AI modeling rules')
  .option('-g, --gemini', 'Scaffold for Gemini CLI')
  .option('-x, --codex', 'Scaffold for Codex')
  .option('-c, --claude', 'Scaffold for Claude Code')
  .option('-a, --all', 'Scaffold for all agents')
  .action((options) => {
    initProject(options);
  });

program
  .command('dev')
  .description('Start the development visualizer with local YAML files or directories')
  .argument('<paths...>', 'paths to YAML model files or directories')
  .action((paths) => {
    startDevServer(paths, VISUALIZER_PATH);
  });

program
  .command('build')
  .description('Build a static site from YAML models')
  .argument('<paths...>', 'paths to YAML model files or directories')
  .option('-o, --output <dir>', 'output directory', 'dist')
  .action((paths, options) => {
    build(paths, VISUALIZER_PATH, options.output);
  });

program.parse();
