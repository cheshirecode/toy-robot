/*eslint no-console: 0 */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const Robot = require('./robot');
/**
 *
 * @param {String} filePath
 * @param {Function} lineCallback
 * @param {Function} closeCallback
 */
const processLineByLine = (filePath, lineCallback, closeCallback) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  rl.on('line', lineCallback);
  rl.on('close', closeCallback);
};

module.exports = async ({
  // root = '.',
  debug: isDebug = false,
  store = true,
  file,
  args = [],
  separator = '_',
  reset = false,
  ...rest
}) => {
  if (!file) {
    // console.log(args[0].replace('*', ' ').split(separator));
    //unfortunately, CSV format wouldn't work due to PLACE X,Y,F syntax.
    //handling that would take too much effort and not really adding value
    //so forcing '_' is enough for now
    if (args[0] && separator === '_') {
      file = `/tmp/${crypto.randomBytes(20).toString('hex')}.txt`;
      await new Promise((resolve, reject) =>
        fs.writeFile(
          file,
          args[0]
            .replace('*', ' ')
            .split(separator)
            .join('\n'),
          'utf-8',
          err => (err ? reject(err) : resolve()),
        ),
      );
      /* istanbul ignore next */
      isDebug &&
        console.log(`Written output to temp file ${file} for processing`);
    } else {
      isDebug && console.log(args[0], `Unable to process empty input.`);
    }
  }
  /* istanbul ignore next */
  if (!file) {
    console.error('No data nor input file. Unable to proceed');
  } else {
    /* istanbul ignore next */
    isDebug && console.log(`Input file, ${file}`);
    // create a checksum based on file content. Changing the content would lead
    // to a different save file.
    const fileCheckSum =
      !!store &&
      (await new Promise((resolve, reject) =>
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) reject(err);
          else
            resolve(
              crypto
                .createHash('sha1')
                .update(data, 'utf8')
                .digest('hex'),
            );
        }),
      ));
    /* istanbul ignore next */
    isDebug && console.log('File checksum', fileCheckSum);
    const savePath = fileCheckSum ? `/tmp/toy-robot-${fileCheckSum}` : '';
    /* istanbul ignore next */
    isDebug && console.log(`Processing line by line...`);
    const prevConfig =
      !reset && store && fs.existsSync(savePath)
        ? await new Promise((resolve, reject) =>
            fs.readFile(savePath, 'utf-8', (err, data) => {
              if (err) reject(err);
              else resolve(JSON.parse(data));
            }),
          )
        : {};
    /* istanbul ignore next */
    isDebug && console.log('Previous config', prevConfig);
    const r = new Robot({
      ...prevConfig,
      isDebug,
      savePath,
    });

    processLineByLine(file, r.process, () => {
      r.save(() => {
        process.exit(0);
      });
    });
    // process.on('exit', code => {
    //   /* istanbul ignore next */
    //   isDebug && console.log(`Exiting with code ${code}...`);
    // });
    // https://stackoverflow.com/a/40574758
    // wild idea to save work in progress, not tested yet
    [
      'SIGHUP',
      'SIGINT',
      'SIGQUIT',
      'SIGILL',
      'SIGTRAP',
      'SIGABRT',
      'SIGBUS',
      'SIGFPE',
      'SIGUSR1',
      'SIGSEGV',
      'SIGUSR2',
      'SIGTERM',
    ].forEach(sig =>
      process.on(sig, s => {
        if (typeof s === 'string') {
          // trapping terminating signal, and save the work before exiting
          r.save(() => {
            process.exit(1);
          });
        }
      }),
    );
  }
};
