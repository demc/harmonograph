export default (canvas, name) => {
  return (e) => {
    const url = canvas.toDataURL();
    const el = document.createElement('a');
    el.href = url;
    el.download = name || 'harmonograph.png';
    el.click();
    // document.body.appendChild(el);
  };
}