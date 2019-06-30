/**
 *
 * @param {Object} obj
 * @param {Array|string} blacklist
 * @param {Function} condition
 */
module.exports = (
  obj = {},
  blacklist = '',
  condition = (str, k) => !k || str.indexOf(k) < 0
) =>
  Object.keys(obj)
    .filter(
      objKey =>
        Array.isArray(blacklist)
          ? blacklist.every(k => condition(objKey, k))
          : condition(objKey, blacklist)
    )
    .reduce(
      (prev, p) => ({
        ...prev,
        [p]: obj[p]
      }),
      {}
    );
