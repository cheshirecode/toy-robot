/*eslint no-console: 0 */
const { spawn } = require('child_process');
const fs = require('fs');
const { flattenPackages } = require('./lib');
//readFileSync will throw error if file doesn't exist at
//specified path, default value to be returned. "" is the bare minimum
//for JSON.parse() to not fail
const readFileSyncIfExist = (p, defaultValue = '""') =>
  fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : defaultValue;

module.exports = ({
  root = '.',
  location = '.',
  defaultProps = 'dependencies,devDependencies',
  props = '',
  blacklist = '',
  packageFileName = 'package.json',
  outFile,
  debug: isDebug,
  isSilent = false,
  callback
}) => {
  const startingDirectory = process.cwd();
  isDebug && console.log(`Starting directory: ${startingDirectory}`);
  try {
    process.chdir(root);
    isDebug && console.log(`New directory: ${process.cwd()}`);
  } catch (err) {
    console.error(`chdir: ${err}`);
  }
  //recursively find all package.json files
  const findAllPackages = spawn(
    'find',
    [location, '-name', `"${packageFileName}"`],
    {
      shell: true
    }
  );
  findAllPackages.stdout.on('data', stdout => {
    /* a list with full path file names, split by EoL then skip the empty strings */
    const packageFiles = `${stdout}`.split('\n').filter(x => x);
    if (!fs.existsSync(packageFileName)) {
      isDebug &&
        console.warn(`No ${packageFileName} at root location ${root}...`);
    }
    const main = JSON.parse(readFileSyncIfExist(packageFileName));
    const packages = [
      ...packageFiles.map(p => JSON.parse(readFileSyncIfExist(p))),
      main
    ];

    const finalPackage = flattenPackages({
      main,
      packages,
      props: `${props},${defaultProps}`.split(',').filter(x => x),
      blacklist: `${blacklist}`.split(',').filter(x => x)
    });

    /* eslint-enable no-unused-vars */
    if (outFile) {
      //finally, write to another file
      const content = JSON.stringify(finalPackage, null, 2);
      fs.writeFile(outFile, content, 'utf8', function(err) {
        if (err) {
          return console.error(err);
        }

        console.log(`Saved to ${outFile}`);
      });
    } else {
      !isSilent && console.log(finalPackage);
    }
    callback && callback(finalPackage);

    return finalPackage;
  });

  findAllPackages.on('error', stderr => console.log(`error - ${stderr}`));
  findAllPackages.stderr.on('data', stderr =>
    console.log(`stderr - ${stderr}`)
  );
  findAllPackages.on('close', code => process.exit(code));
};
