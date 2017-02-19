export default (name, value, components, message) => {
  components.forEach(cmp => {
    if (cmp[name] !== value) {
      if (message) {
        throw message;
      } else {
        throw `${name} (${cmp[name]}) on ${cmp.constructor.name} does not match ${value}`;
      }
    }
  });
};