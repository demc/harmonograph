import Helpers from './Helpers.js';

import {MAX_TICK, TIMEOUT} from './constants.js';

class Scene {

  constructor(container, ctx, width, height) {
    this.container = container;
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.objects = [];
    this.playing = false;
    this.clearBetweenFrames = false;
    this.tickCount = 0;

    this._timer = null;

    const canvas = this.ctx.canvas;
    canvas.width = width;
    canvas.height = height;

    Helpers.adjustPixelDisplayRadio(this.ctx);
  }

  addObject(obj) {
    this.objects.push(obj);
    return this;
  }

  setClearBetweenFrames(clearBetweenFrames) {
    this.clearBetweenFrames = clearBetweenFrames;
    return this;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;

    const canvas = this.ctx.canvas;
    canvas.width = width;
    canvas.height = height;

    Helpers.adjustPixelDisplayRadio(this.ctx);
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
