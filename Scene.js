import Helpers from './Helpers.js';

import {MAX_TICK, TIMEOUT} from './constants.js';

class Scene {

  constructor(container, ctx, width, height) {
    this.container = container;
    this.ctx = ctx;
    this.height = content.offsetHeight;
    this.width = content.offsetWidth;
    this.objects = [];
    this.playing = false;
    this.clearBetweenFrames = false;
    this.tickCount = 0;

    this._timer = null;

    Helpers.syncCanvas(content, ctx.canvas);
    Helpers.adjustPixelDisplayRadio(ctx);

    window.addEventListener('resize', (e) => {
      Helpers.syncCanvas(content, ctx.canvas);
      Helpers.adjustPixelDisplayRadio(ctx);
      this.resizeObjects();
    });
  }

  addObject(obj) {
    this.objects.push(obj);
    return this;
  }

  resizeObjects() {
 
    // TODO: resize objects based on container size
    //   this.objects.forEach(obj => obj.handleContainerResize(this.width, this.heights));
  }

  setClearBetweenFrames(clearBetweenFrames) {
    this.clearBetweenFrames = clearBetweenFrames;
    return this;
  }

  start() {
    const draw = this.draw.bind(this);
    this._timer = window.setInterval(
      () => {
        ++this.tickCount;
        draw();

        if (this.tickCount >= MAX_TICK) {
          window.clearInterval(this._timer);
          console.log('MAX TICK LIMIT HIT');
        }
      },
      TIMEOUT
    );
    this.playing = true;
    return this;
  }

  stop() {
    clearInterval(this._timer);
    this.playing = false;
  }

  reset() {
    this.stop();
    this.tickCount = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objects.forEach((obj) => obj.reset());
    this.start();
  }

  draw() {
    if (this.clearBetweenFrames) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    } else {
      this.objects.forEach((obj) => obj.clear());  
    }
    
    this.objects.forEach((obj) => obj.draw());
    this.objects.forEach((obj) => obj.tick());
  }
}

export default Scene;
