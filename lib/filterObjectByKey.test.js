#!/usr/bin/env node
const test = require('tape');

test('filterObjectByKey', t => {
  const filterObjectByKey = require('./filterObjectByKey');
  const sampleObj = { 1: 2, 2: 3 };
  t.deepEqual(filterObjectByKey({}), {}, 'empty -> empty');
  t.deepEqual(
    filterObjectByKey(sampleObj, 2),
    { 1: 2 },
    'simple object with key'
  );

  t.deepEqual(
    filterObjectByKey({ ...sampleObj, 3: sampleObj }, 2),
    {
      1: 2,
      3: sampleObj
    },
    'nested object with blacklist'
  );

  t.deepEqual(
    filterObjectByKey({ ...sampleObj, 3: sampleObj }, 2, () => true),
    {
      ...sampleObj,
      3: sampleObj
    },
    'nested object with blacklist and TRUE condition '
  );

  t.end();
});
