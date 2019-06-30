const filterObjectPropsByKey = require('./filterObjectPropsByKey');
const pickMerge = require('./pickMerge');

//given a 'main' package, and others, pick out the props from
//each package and merge them into 'main'
module.exports = ({ main = {}, packages = [], props, blacklist = [] } = {}) => {
  const filteredPackages = pickMerge.apply(null, [
    props,
    ...[main, ...packages].map(p => filterObjectPropsByKey(p, props, blacklist))
  ]);

  /* eslint-disable no-unused-vars */
  return (({ author, workspaces, ...p }) => ({
    ...p,
    ...filteredPackages
  }))(main);
};
