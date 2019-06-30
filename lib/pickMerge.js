const checkIfObject = (o, k) => {
  if (o[k] !== undefined && typeof o[k] !== 'object') {
    console.error(o, k); //eslint-disable-line no-console
    throw TypeError(`Expect value of key ${k} be Object-type`);
  }
  return o[k];
};

module.exports = (props = '', ...args) => {
  const filteredArgs = args.filter(o => typeof o === 'object');
  return (
    (Array.isArray(props) ? props : [props])
      //at least one object needs to contain those props
      .filter(p => filteredArgs.some(obj => obj.hasOwnProperty(p)))
      .reduce(
        (prev, key) => ({
          ...prev,
          [key]: filteredArgs.reduce(
            (prev, p) => ({
              ...prev,
              ...checkIfObject(p, key)
            }),
            {}
          )
        }),
        {}
      )
  );
};
