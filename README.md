# toy-robot
[![npm version](https://badge.fury.io/js/toy-robot.svg)](https://badge.fury.io/js/toy-robot) [![Build Status](https://travis-ci.org/cheshirecode/toy-robot.svg?branch=master)](https://travis-ci.org/cheshirecode/toy-robot) [![Coverage Status](https://coveralls.io/repos/github/cheshirecode/toy-robot/badge.svg?branch=master)](https://coveralls.io/github/cheshirecode/toy-robot?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/cheshirecode/toy-robot.svg)](https://greenkeeper.io/)

A simple CLI to demonstrate a few concepts:
- [Reading a file line by line for better memory footprint at the cost of slower performance](https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options)
- [Cryptographic hashes for randomised and uniquely specific checksums](https://nodejs.org/api/crypto.html#crypto_crypto)
- [async/await fs.readFileSync as alternative to fs.readFile's callback](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)
- [CLI wrapper for Node](https://tj.github.io/commander.js/)

## Setup
Requires
- Node LTS
- `yarn` 

### Installation
Run `yarn` at root folder

### Usage
Use -h to see codified information. Below are some examples:
> ./index.js -h
```
  Usage: index <input> PLACE*4,4,NORTH_MOVE_LEFT_RIGHT_REPORT

  CLI to process multiple instructions in batches, with the ability to resume

  Options:

    -V, --version      output the version number
    -f, --file <path>  Input file of multi-line commands such as:
      PLACE 0,0,NORTH
      MOVE
      LEFT
      RIGHT
      REPORT
        
    -d, --debug        Debug flag to print out helpful messages during runtime.
    -s, --store        Create a checksum of input file and store config there to continue next time. Implied by default. Use -r to override.
    --reset            Ignore stored config and start anew.
    -h, --help         output usage information
```

> ./index.js -f tests/1.txt -d
```
Input file, tests/1.txt
File checksum da39a3ee5e6b4b0d3255bfef95601890afd80709
Processing line by line...
Previous config { x: 0, y: 0, direction: 'NORTH', linesToSkip: 0 }
Saving current config { x: 0, y: 0, direction: 'NORTH', linesToSkip: 0 } to /tmp/toy-robot-da39a3ee5e6b4b0d3255bfef95601890afd80709
```

> ./index.js -f tests/3.txt --reset -d
```
Input file, tests/3.txt
File checksum b6895a8822defbfad7180ab18cd667ab5db02b52
Processing line by line...
Previous config {}
PLACE 6,6,WEST Unable to place. Co-ordinates (6, 6) are invalid. Direction WEST is valid.
PLACE 5,5,WEST1 Unable to place. Co-ordinates (5, 5) are valid. Direction WEST1 is invalid.
PLACE 4,4,NORTH Placed. Currently at 4, 4, NORTH.
MOVE Successful. Currently at 4, 5, NORTH.
LEFT Rotated from NORTH to WEST.
MOVE Successful. Currently at 5, 5, WEST.
MOVE Unable to move, would go out of bounds. Currently at 5, 5, WEST.
MOVE Unable to move, would go out of bounds. Currently at 5, 5, WEST.
REPORT 5 5 WEST
REPORT 5 5 WEST
Saving current config { x: 5, y: 5, direction: 'WEST', linesToSkip: 10 } to /tmp/toy-robot-b6895a8822defbfad7180ab18cd667ab5db02b52
```

> ./index.js -f tests/3.txt -d
```
Input file, tests/3.txt
File checksum b6895a8822defbfad7180ab18cd667ab5db02b52
Processing line by line...
Previous config { x: 5, y: 5, direction: 'WEST', linesToSkip: 10 }
1 / 10 lines skipped.
2 / 10 lines skipped.
3 / 10 lines skipped.
4 / 10 lines skipped.
5 / 10 lines skipped.
6 / 10 lines skipped.
7 / 10 lines skipped.
8 / 10 lines skipped.
9 / 10 lines skipped.
10 / 10 lines skipped.
Saving current config { x: 5, y: 5, direction: 'WEST', linesToSkip: 10 } to /tmp/toy-robot-b6895a8822defbfad7180ab18cd667ab5db02b52
```