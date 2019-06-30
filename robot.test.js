const Robot = require('./robot');
const test = require('tape');
const {
  DIRECTION_NORTH,
  DIRECTION_WEST,
  DIRECTION_SOUTH,
  DIRECTION_EAST,
} = Robot;
test('Robot class', async t => {
  const r = new Robot({});
  t.equal(r.x, 0, `x should be 0`);
  t.equal(r.y, 0, `y should be 0`);
  t.equal(
    r.setCoords(1, 1),
    undefined,
    `setCoords(${r.x}, ${r.y}) should work`,
  );
  t.equal(r.x, 1, `x should be 1`);
  t.equal(r.y, 1, `y should be 1`);
  t.equal(r.isValidCoords(r.x, r.y), true, `${r.x}, ${r.y} should be valid`);
  t.equal(r.isValidCoords(6, 6), false, `6, 6 should be invalid`);
  t.equal(
    r.isValidDirection(DIRECTION_EAST),
    true,
    `${DIRECTION_EAST} should be valid`,
  );
  t.equal(
    r.isValidDirection(DIRECTION_EAST + '1'),
    false,
    `${DIRECTION_EAST + '1'} should be invalid`,
  );
  t.equal(await r.process('MOVE'), true, `Able to move`);
  t.equal(
    await r.process('PLACE 5,5,NORTH'),
    true,
    `Able to place at 5,5,NORTH`,
  );
  t.equal(await r.process('MOVE'), false, `Unable to move`);
  t.deepEqual(
    await r.process('REPORT'),
    { x: 5, y: 5, direction: DIRECTION_NORTH },
    `Should be facing ${DIRECTION_NORTH}`,
  );
  t.equal(await r.process('LEFT'), true, `Able to turn left`);
  t.deepEqual(
    await r.process('REPORT'),
    { x: 5, y: 5, direction: DIRECTION_WEST },
    `Should be facing ${DIRECTION_WEST}`,
  );
  t.equal(await r.process('RIGHT'), true, `Able to turn right`);
  t.deepEqual(
    await r.process('REPORT'),
    { x: 5, y: 5, direction: DIRECTION_NORTH },
    `Should be facing ${DIRECTION_NORTH}`,
  );
  t.end();
});
