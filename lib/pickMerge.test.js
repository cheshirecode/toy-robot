#!/usr/bin/env node
const test = require('tape');

test('pickMerge', t => {
  const pickMerge = require('./pickMerge');

  t.deepEqual(pickMerge(), {}, 'Nothing');

  t.deepEqual(pickMerge(null, {}), {}, 'Empty object');

  t.deepEqual(pickMerge(1, { 1: {} }), { 1: {} }, 'Empty object');

  t.deepEqual(
    pickMerge(null, { 1: { a: 2 } }, { 1: { a: 1, b: 3 } }),
    {},
    'No props'
  );

  t.deepEqual(
    pickMerge([1], { 1: { a: 2 } }, { 1: { a: 1, b: 3 } }),
    {
      1: { a: 1, b: 3 }
    },
    '1 prop'
  );

  t.deepEqual(
    pickMerge([1, 2], { 1: { a: 2 }, 2: { 1: 2 } }, { 1: { b: 3 } }),
    { 1: { a: 2, b: 3 }, 2: { 1: 2 } },
    'Multiple props'
  );

  t.end();
});
