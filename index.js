#!/usr/bin/env node
/*eslint no-console: 0 */

// global __dirname

const path = require('path');
const currentDir = path.resolve(__dirname);

const pkg = require(`${currentDir}/package.json`);
const program = require('commander');
const main = require(`${currentDir}/main`);

//setup options
program
  .version(pkg.version)
  .description(pkg.description)
  .usage('<input> PLACE*4,4,NORTH_MOVE_LEFT_RIGHT_REPORT')
  .option(
    '-f, --file <path>',
    `Input file of multi-line commands such as:
  PLACE 0,0,NORTH
  MOVE
  LEFT
  RIGHT
  REPORT
    `,
  )
  .option(
    '-d, --debug',
    'Debug flag to print out helpful messages during runtime.',
  )
  .option(
    '-s, --store',
    'Create a checksum of input file and store config there to continue next time. Implied by default. Use -r to override.',
  )
  .option('--reset', 'Ignore stored config and start anew.')
  .parse(process.argv);

const options = program.opts();
//pass along options as-is, processing should happen in main
main({
  ...options,
  args: program.args,
});
