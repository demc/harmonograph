export default (node, component, name, divisor) => {
  let value = component[name];

  if (divisor) {
    value /= divisor;    
  }

  node.value = value;
};