import Scene from './Scene';

import {TICK_IN_SEC} from './constants';

class AbsoluteScene extends Scene {

  constructor(container, ctx, x, y, width, height, radius, frequency, phaseShift) {
    super(container, ctx);
    this.canvas = ctx.canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.radius = radius;
    this.frequency = frequency || 2 * Math.PI;
    this.phaseShift = phaseShift || Math.PI / 2;

    this.dampingRatio = 0;
    this.t = 0;

    const {x: offsetX, y: offsetY} = this._delta(this.t);
    this._offsetX = offsetX;
    this._offsetY = offsetY;
  }  
  
  setPosition(x, y) {
    this.canvas.style.left = x + 'px';
    this.canvas.style.top = y + 'px';

    return this;
  }

  setRadius(radius) {
    this.radius = radius;
    return this;
  }

  setDampingRatio(dampingRatio) {
    this.dampingRatio = dampingRatio;
    return this;
  }

  clear() {

  }

  reset() {
    super.reset();
    this.t = 0;
    const {x: offsetX, y: offsetY} = this._delta(this.t);
    this._offsetX = offsetX;
    this._offsetY = offsetY;
  }

  draw() {
    super.draw();
    this.t += TICK_IN_SEC;
    const {x, y} = this._delta(this.t);
    this._offsetX = x;
    this._offsetY = y;
    this.setPosition(this.x + x, this.y + y);
  }

  getOffsets() {
    return {
      x: this._offsetX,
      y: this._offsetY
    };
  }

  _delta(t) {
    let x = this.radius * Math.cos(this.frequency * t + this.phaseShift);
    let y = this.radius * Math.sin(this.frequency * t + this.phaseShift);

    if (this.dampingRatio) {
      const e = Math.pow(Math.E, -(this.dampingRatio * t));
      x *= e
      y *= e;
    }

    return {
      x, 
      y
    };
  }
}

export default AbsoluteScene;
