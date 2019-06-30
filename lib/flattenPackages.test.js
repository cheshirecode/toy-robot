#!/usr/bin/env node
const test = require('tape');

test('flattenPackages', t => {
  const flattenPackages = require('./flattenPackages');
  const dependencies = {
    'is-sorted': 'latest',
    mirrarray: 'latest'
  };
  const devDependencies = {
    semver: 'latest'
  };
  const sampleData = {
    main: {},
    packages: [
      {
        devDependencies
      }
    ]
  };
  const sampleDataWithMain = {
    ...sampleData,
    main: {
      dependencies
    }
  };
  t.deepEqual(
    flattenPackages(sampleData),
    {},
    'empty main, package with devDeps'
  );

  t.deepEqual(
    flattenPackages(sampleDataWithMain),
    {
      dependencies
    },
    'main with dep, package with devDeps'
  );

  t.deepEqual(
    flattenPackages({
      ...sampleDataWithMain,
      props: ['devDependencies']
    }),
    {
      dependencies,
      devDependencies
    },
    'main with dep, package with devDeps, props devDeps'
  );

  t.deepEqual(
    flattenPackages({
      ...sampleDataWithMain,
      props: ['dependencies', 'devDependencies'],
      blacklist: ['is-sorted', 'semver']
    }),
    {
      dependencies: {
        mirrarray: 'latest'
      },
      devDependencies: {}
    },
    'main with dep, package with devDeps, all props, blacklist dep'
  );

  t.end();
});
