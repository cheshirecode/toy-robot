#!/usr/bin/env node
/*eslint no-console: 0 */

// This script merges all package.json into a singular package.json

//spawn is more complicated than exec but could handle stdout size > 200Kb by default
// see this [issue](https://github.com/nodejs/node/issues/9829)
// global __dirname

const path = require('path');
const currentDir = path.resolve(__dirname);

const pkg = require(`${currentDir}/package.json`);
const program = require('commander');
const main = require(`${currentDir}/main`);

//setup options
program
  .version(pkg.version)
  .description(
    'Extract out package.json files in a project with multiple package.json and write to package-ejected.json'
  )
  .option('-r, --root <root>', 'Root folder. Default to .')
  .option(
    '-l, --location <location>',
    'Packages location relative to root. Default to .'
  )
  .option(
    '-b, --blacklist <blacklist>',
    'comma-separated string of keywords to filter out' +
      'Default is empty string, meaning everything is allowed'
  )
  .option('-o, --out-file <outFile>', 'path to output')
  .option(
    '-d, --debug',
    'Debug flag to print out helpful messages during runtime.'
  )
  .parse(process.argv);

const options = program.opts();
//pass along options as-is, processing should happen in main
main({
  ...options
});
