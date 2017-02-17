import Scene from './Scene';

import {TICK_IN_SEC} from './constants';

class LateralScene extends Scene {

  constructor(container, ctx, x, y, sideLength, amplitude, frequency, phaseShift) {

    super(container, ctx, sideLength, sideLength);
    this.canvas = ctx.canvas;
    this.x = x;
    this.y = y;
    this.sideLength = sideLength;
    
    this.amplitude = amplitude;
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

  setAmplitude(amplitude) {
    this.amplitude = amplitude;

    const xMidpoint = this.x + this.width / 2;
    this.x = xMidpoint - amplitude;

    const yMidpoint = this.y + this.height / 2;
    this.y = yMidpoint - amplitude;

    this.setSize(amplitude * 2, amplitude * 2);

    return this;
  }

  setFrequency(frequency) {
    this.frequency = frequency;
    return this;
  }

  setPhaseShift(phaseShift) {
    this.phaseShift = phaseShift;
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
    const {y: offsetY} = this._delta(this.t);
    // this._offsetX = offsetX;
    this._offsetY = offsetY;
  }

  draw() {
    super.draw();
    this.t += TICK_IN_SEC;
    const {x, y} = this._delta(this.t);
    // this._offsetX = x;
    this._offsetY = y;
    // this.setPosition(this.x + x, this.y + y);
    this.setPosition(this.x, this.y + y);
  }

  getOffsets() {
    return {
      // x: this._offsetX,
      x: this.x,
      y: this._offsetY
    };
  }

  _delta(t) {
    // let x = this.amplitude * Math.cos(this.frequency * t + this.phaseShift);
    let y = this.amplitude * Math.sin(this.frequency * t + this.phaseShift);

    if (this.dampingRatio) {
      const e = Math.pow(Math.E, -(this.dampingRatio * t));
      // x *= e
      y *= e;
    }

    return {
      // x, 
      y
    };
  }
}

export default LateralScene;
