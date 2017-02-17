import {HALF_PI, TICK_IN_SEC, TWO_PI} from './constants';

class Cursor2D {

  constructor(scene, x, y, width, height, radius, color, amplitudeX, amplitudeY, frequencyX, frequencyY, phaseShiftX, phaseShiftY) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.amplitudeX = amplitudeX;
    this.amplitudeY = amplitudeY;
    this.frequencyX = frequencyX || TWO_PI;
    this.frequencyY = frequencyY === undefined ? TWO_PI : frequencyY;
    this.phaseShiftX = phaseShiftX || HALF_PI;
    this.phaseShiftY = phaseShiftY || HALF_PI;
    this.dampingRatio = 0;

    this.radius = radius || 2;
    this.color = color || 'red';

    this._xOrigin = this.x + this.width / 2;
    this._yOrigin = this.y + this.height / 2;

    this.t = 0;

    scene.addObject(this);
  }

  setAmplitudeX(amplitude) {
    this.amplitudeX = amplitude;
    this.width = amplitude * 2;
  }

  setAmplitudeY(amplitude) {
    this.amplitudeY = amplitude;
    this.height = amplitude * 2;
  }

  setFrequencyX(frequency) {
    this.frequencyX = frequency;
  }

  setFrequencyY(frequency) {
    this.frequencyY = frequency;
  }

  setPhaseShiftX(phaseShift) {
    this.phaseShiftX = phaseShift;
  }

  setPhaseShiftY(phaseShift) {
    this.phaseShiftY = phaseShift;
  }

  setRadius(radius) {
    this.radius = radius;
    return this;
  }

  setDampingRatio(dampingRatio) {
    this.dampingRatio = dampingRatio;
  }

  reset() {
    this.t = 0;
    this._pendulumX = 0;
    this._pendulumY = 0;
  }

  clear() {
    this.ctx.clearRect(this._prevPendulumX - this.radius * 2, this._prevPendulumY - this.radius * 2, this.radius * 4, this.radius * 4);
  }

  tick() {
    this.t += TICK_IN_SEC;

    const {x, y} = this._delta(this.t);
    this._prevPendulumX = this._pendulumX;
    this._prevPendulumY = this._pendulumY;
    this._pendulumX = this._xOrigin + x;
    this._pendulumY = this._yOrigin + y;
  }

  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = 'red';
    this.ctx.arc(this._pendulumX, this._pendulumY, 2, 0, TWO_PI);
    this.ctx.fill();
    this.ctx.restore();
  }

  _delta(t) {
    let x = this.amplitudeX * Math.sin(this.frequencyX * this.t + this.phaseShiftX);
    let y = this.amplitudeY * Math.sin(this.frequencyY * this.t + this.phaseShiftY);

    if (this.dampingRatio) {
      const e = Math.pow(Math.E, -(this.dampingRatio * t));
      x *= e;
      y *= e;
    }

    return {
      x, 
      y 
    };
  }
}

export default Cursor2D;
