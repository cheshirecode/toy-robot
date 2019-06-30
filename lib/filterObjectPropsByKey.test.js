#!/usr/bin/env node
const test = require('tape');

test('filterObjectPropsByKey', t => {
  const filterObjectPropsByKey = require('./filterObjectPropsByKey');
  const sampleObj = {
    1: 2,
    2: { 1: 2 },
    3: { 1: 3 }
  };
  t.deepEqual(filterObjectPropsByKey(), {}, 'No arguments');
  t.deepEqual(filterObjectPropsByKey({}), {}, 'Empty object');
  t.deepEqual(filterObjectPropsByKey(sampleObj), sampleObj, 'No props');
  t.deepEqual(
    filterObjectPropsByKey(sampleObj, 2),
    sampleObj,
    'Props, no blacklist'
  );

  t.deepEqual(
    filterObjectPropsByKey(sampleObj, ['', 4], 1),
    sampleObj,
    'Empty/invaliad props, blacklist'
  );

  t.deepEqual(
    filterObjectPropsByKey(sampleObj, '', 1),
    sampleObj,
    'No props, blacklist'
  );

  t.deepEqual(
    filterObjectPropsByKey(sampleObj, 2, 1),
    {
      1: 2,
      2: {},
      3: { 1: 3 }
    },
    'Props, blacklist of 1 item'
  );

  t.deepEqual(
    filterObjectPropsByKey(sampleObj, [2, 3], 1),
    {
      1: 2,
      2: {},
      3: {}
    },
    'Props, blacklist of 2 items'
  );

  t.deepEqual(
    filterObjectPropsByKey(sampleObj, [2, 3], 1, () => true),
    sampleObj,
    'Props, blacklist of 2 items and TRUE condition'
  );
  t.end();
});
