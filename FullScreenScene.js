import Helpers from './Helpers';
import Scene from './Scene';

class FullScreenScene extends Scene {
 
  constructor(container, ctx) {
    Helpers.syncCanvas(container, ctx.canvas);

    super(container, ctx, container.offsetWidth, container.offsetHeight);

    window.addEventListener('resize', (e) => {
      Helpers.syncCanvas(container, ctx.canvas);
      Helpers.adjustPixelDisplayRadio(ctx);
      this.resizeObjects();
    });
  } 

  resizeObjects() {
    // TODO: resize objects based on container size
    // this.objects.forEach(obj => obj.handleContainerResize(this.width, this.heights));
  }
}

export default FullScreenScene;
