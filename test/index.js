#!/usr/bin/env node
//until tap has watch mode https://github.com/tapjs/node-tap/issues/411
const test = require('tape');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

const currentDir = path.resolve(__dirname);
/*eslint no-console: 0 */
const done = (err, data) => {
  if (err) {
    throw err;
  }
  if (data) {
    console.log(data);
  }
};

fs.readdir(currentDir, (err, list) => {
  if (err) return done(err);
  list.forEach(file => {
    const filePath = path.resolve(currentDir, file);
    fs.stat(filePath, (err, stat) => {
      const files = [
        `${filePath}/package.actual.json`,
        `${filePath}/package.expected.json`
      ];
      if (stat && stat.isDirectory() && files.every(f => fs.existsSync(f))) {
        const { stdout } = spawnSync('diff', files, {
          shell: true
        });
        test(`CLI test - ${file}`, t1 => {
          t1.equal(
            decoder.write(stdout),
            '',
            'Expect JSON structure to be the same'
          );
          t1.end();
        });
      }
    });
  });
});
