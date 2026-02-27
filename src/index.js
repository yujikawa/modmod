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
  .name('modmod')
  .description('A YAML-driven data modeling visualizer CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize project with AI modeling rules')
  .action(() => {
    initProject();
  });

program
  .command('dev')
  .description('Start the development visualizer with a local YAML file')
  .argument('<yamlFile>', 'path to the YAML model file')
  .action((yamlFile) => {
    startDevServer(yamlFile, VISUALIZER_PATH);
  });

program
  .command('build')
  .description('Build a static site from a YAML model')
  .argument('<yamlFile>', 'path to the YAML model file')
  .option('-o, --output <dir>', 'output directory', 'dist')
  .action((yamlFile, options) => {
    build(yamlFile, VISUALIZER_PATH, options.output);
  });

program.parse();
