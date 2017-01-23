class Helpers {

  static adjustPixelDisplayRadio(ctx) {
    const {canvas} = ctx;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 
      1;
    const ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      canvas.width = oldWidth * ratio;
      canvas.height = oldHeight * ratio;

      canvas.style.width = oldWidth + 'px';
      canvas.style.height = oldHeight + 'px';

      ctx.scale(ratio, ratio);
    }
  }

  static syncCanvas(content, canvas) {
    canvas.height = content.offsetHeight;
    canvas.width = content.offsetWidth;
    canvas.style.height = content.offsetHeight + 'px';
    canvas.style.width = content.offsetWidth + 'px';
  }
}

export default Helpers;