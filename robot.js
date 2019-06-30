const DIRECTION_NORTH = 'NORTH';
const DIRECTION_SOUTH = 'SOUTH';
const DIRECTION_EAST = 'EAST';
const DIRECTION_WEST = 'WEST';
const fs = require('fs');
class Robot {
  /* istanbul ignore next */
  constructor(params = {}) {
    // lazy dumping of all parameters from constructor to
    // current instance. Defensive coding could come later
    // (picking/omitting certain keys e.g. class methods or only allow primitive values to be passed in)
    Object.assign(
      this,
      {
        // x and y are co-ordinates, starting at 0,0
        x: 0,
        y: 0,
        direction: DIRECTION_NORTH,
        // grid size is 5x5 by default, but override-able
        maxX: 5,
        maxY: 5,
        // check if placement has already happened, or else
        // no movement could take place
        isPlaced: false,
        // stores all possible directions and used to
        // rotate a direction to its left or right
        //     N
        // W       E
        //     S
        directions: [
          DIRECTION_NORTH,
          DIRECTION_WEST,
          DIRECTION_SOUTH,
          DIRECTION_EAST,
        ],
        // count number of processed lines so next time, we could skip them
        linesToSkip: 0,
        start: 0,
      },
      params,
    );

    // alas, no direct arrow function in Node without transpiling so
    // here we manually bind class methods' "this" to the class itself to avoid
    // using class method as callback and having "this" be something else
    'setCoords,process,isValidCoords,isValidDirection,save'
      .split(',')
      .map(s => (this[s] = this[s].bind(this)));
  }
  /**
   * Set co-ordinates by coercing to Int
   * @param {Number} x
   * @param {Number} y
   */
  setCoords(x, y) {
    this.x = parseInt(x, 10);
    this.y = parseInt(y, 10);
  }
  /**
   * check if given co-ordinates are valid - positive ints that aren't beyond the grid boundary
   * @param {Number} x
   * @param {Number} y
   * @returns Boolean
   */
  isValidCoords(x, y) {
    return x >= 0 && y >= 0 && x <= this.maxX && y <= this.maxY;
  }
  /**
   * check if given direction is valid, as one of the default values
   *
   * @param {String} d
   * @returns Boolean
   */
  isValidDirection(d) {
    return this.directions.indexOf(d) >= 0;
  }
  /* istanbul ignore next */
  async save(cb) {
    if (this.savePath) {
      /* istanbul ignore next */
      this.isDebug &&
        console.log(
          'Saving current config',
          {
            x: this.x,
            y: this.y,
            direction: this.direction,
            linesToSkip: this.linesToSkip,
          },
          'to',
          this.savePath,
        );
      await new Promise((resolve, reject) =>
        fs.writeFile(
          this.savePath,
          JSON.stringify({
            x: this.x,
            y: this.y,
            direction: this.direction,
            linesToSkip: this.linesToSkip,
          }),
          'utf-8',
          err => (err ? reject(err) : resolve()),
        ),
      );
    }
    if (cb) {
      cb();
    }
  }
  /**
   * Process an instruction
   *
   * @param {String} str
   * @returns Boolean|Object whether an instruction was successfully processed
   * or rejected due to invalid inputs
   */
  async process(str) {
    // to experiment with resume
    // - uncomment this block
    // - node ./index.js -f tests/3.txt --reset
    // - comment it out again
    // - node ./index.js -f tests/3.txt

    // if (Math.random() > 0.5) {
    //   throw Error('oops');
    // }
    this.start++;
    if (this.start <= this.linesToSkip) {
      console.log(`${this.start} / ${this.linesToSkip} lines skipped.`);
      return;
    }
    this.linesToSkip++;
    const cmd = str.split(' ')[0];
    const i = this.directions.indexOf(this.direction);
    const d = this.direction;
    // strict equality is simplest
    // more lenient/flexible handling could always be easily added later
    switch (cmd) {
      case 'PLACE':
        const rest = str
          .substr(cmd.length)
          .trim()
          .split(',');

        const [x, y, direction] = rest;
        if (this.isValidCoords(x, y) && this.isValidDirection(direction)) {
          this.setCoords(x, y);
          this.direction = direction;
          /* istanbul ignore next */
          this.isDebug &&
            console.log(
              str,
              `Placed. Currently at ${this.x}, ${this.y}, ${this.direction}.`,
            );
          return true;
        }
        /* istanbul ignore next */
        this.isDebug &&
          console.log(
            str,
            `Unable to place. Co-ordinates (${x}, ${y}) are ${
              this.isValidCoords(x, y) ? '' : 'in'
            }valid. Direction ${direction} is ${
              this.isValidDirection(direction) ? '' : 'in'
            }valid.`,
          );
        return false;
        break;
      case 'MOVE':
        // check if moving in the current direction is possible
        // without going out of bounds
        let isMovePossible = false;
        if (
          (this.direction === DIRECTION_NORTH ||
            this.direction === DIRECTION_SOUTH) &&
          this.isValidCoords(this.x, this.y + 1)
        ) {
          this.y++;
          isMovePossible = true;
        }
        if (
          (this.direction === DIRECTION_EAST ||
            this.direction === DIRECTION_WEST) &&
          this.isValidCoords(this.x + 1, this.y)
        ) {
          this.x++;
          isMovePossible = true;
        }
        /* istanbul ignore next */
        this.isDebug &&
          console.log(
            str,
            `${
              isMovePossible
                ? 'Successful'
                : 'Unable to move, would go out of bounds'
            }. Currently at ${this.x}, ${this.y}, ${this.direction}.`,
          );
        return isMovePossible;
        break;
      case 'LEFT':
        // add 1 to current index to find the rotated direction
        // North -> West -> South -> East -> North
        // if increasing beyond array length, reset back to 0
        this.direction = this.directions[
          i + 1 > this.directions.length - 1 ? 0 : i + 1
        ];
        this.isDebug &&
          console.log(str, `Rotated from ${d} to ${this.direction}.`);
        return true;
        break;
      case 'RIGHT':
        // subtract 1 to current index to find the rotated direction
        // North -> West -> South -> East -> North
        // if decreasing beyond array length, reset back to the last element
        this.direction = this.directions[
          i - 1 < 0 ? this.directions.length - 1 : i - 1
        ];
        this.isDebug &&
          console.log(str, `Rotated from ${d} to ${this.direction}.`);
        return true;
        break;
      case 'REPORT':
        /* istanbul ignore next */
        this.isDebug && console.log(str, this.x, this.y, this.direction);
        return { x: this.x, y: this.y, direction: this.direction };
        break;
      default:
        /* istanbul ignore next */
        this.isDebug && console.log(str);
        break;
    }
  }
}
module.exports = Robot;
Object.assign(module.exports, {
  DIRECTION_NORTH,
  DIRECTION_WEST,
  DIRECTION_SOUTH,
  DIRECTION_EAST,
});
