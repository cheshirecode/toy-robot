const filterObjectByKey = require('./filterObjectByKey');

/**
 *
 * @param {Object.<string, Object>} obj
 * @param {string|Array} props keys to apply filter over, invalid keys are ignored
 * @param {string} blacklist omit certain keys from props extracted by 'props',
 *  others are not affected
 * @param {Function} condition
 */
module.exports = (obj, props = [], blacklist, condition) => ({
  ...obj,
  ...(Array.isArray(props) ? props.slice(0) : [props])
    .filter(p => obj.hasOwnProperty(p))
    .reduce(
      (prev, p) => ({
        ...prev,
        [p]: filterObjectByKey(obj[p] || {}, blacklist, condition)
      }),
      {}
    )
});
