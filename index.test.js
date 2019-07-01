const test = require('tape');
const { spawn } = require('child_process');
const readline = require('readline');
const {
  DIRECTION_NORTH,
  DIRECTION_WEST,
  DIRECTION_SOUTH,
  DIRECTION_EAST,
} = require('./robot');
const testFiles = ['1.txt', '2.txt', '3.txt'];
const expectedLastLines = [
  `{ x: 0, y: 0, direction: '${DIRECTION_NORTH}', linesToSkip: 0 }`,
  `{ x: 4, y: 5, direction: '${DIRECTION_EAST}', linesToSkip: 10 }`,
  `{ x: 5, y: 5, direction: '${DIRECTION_WEST}', linesToSkip: 10 }`,
];
const runWithPath = (path, isReset = true) =>
  spawn('./index.js', ['-f', path, `${isReset ? '--reset ' : ''}`, '-d'], {
    shell: true,
  });
test(`Test for expected last line output, with reset flag`, t => {
  testFiles.map((name, i) => {
    const a = runWithPath(`tests/${name}`);
    const rl = readline.createInterface({ input: a.stdout });
    rl.on('line', line => {
      if (line.indexOf('Saving current config') >= 0) {
        t.equal(
          line.split('Saving current config ')[1].split(' to ')[0],
          expectedLastLines[i],
          `Expect ${name} to produce ${expectedLastLines[i]}`,
        );
      }
    });
    a.on('close', () => {
      i >= testFiles.length - 1 && t.end();
    });
  });
});

test(`Test for expected last line output, with no reset flag`, t1 => {
  testFiles.map((name, i) => {
    const a = runWithPath(`tests/${name}`);
    a.on('close', () => {
      if (i >= testFiles.length - 1) {
        testFiles.map((n, j) => {
          const b = runWithPath(`tests/${n}`);
          const rl = readline.createInterface({ input: b.stdout });
          rl.on('line', l => {
            if (l.indexOf('Saving current config') >= 0) {
              t1.equal(
                l.split('Saving current config ')[1].split(' to ')[0],
                expectedLastLines[j],
                `Expect ${n} with stored and reused config to still produce ${
                  expectedLastLines[j]
                }`,
              );
            }
          });
          b.on('close', () => {
            if (j >= testFiles.length - 1) {
              t1.end();
            }
          });
        });
      }
    });
  });
});
