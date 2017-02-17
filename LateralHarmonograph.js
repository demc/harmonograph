import {HALF_PI, TICK_IN_SEC, TWO_PI} from './constants';

class LateralHarmonograph {
  
  constructor(scene, x, y, width, height, amplitudeX, amplitudeY, frequencyX, frequencyY, phaseShiftX, phaseShiftY) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.amplitudeX = amplitudeX;
    this.amplitudeY = amplitudeY;
    this.frequencyX = frequencyX;
    this.frequencyY = frequencyY;
    this.phaseShiftX = phaseShiftX;
    this.phaseShiftY = phaseShiftY;
    this.dampingRatio = 0;

    this.path = new Path2D();

    this.t = 0;

    this._xOrigin = this.x + this.width / 2;
    this._yOrigin = this.y + this.height / 2;

    scene.addObject(this);
  } 

  setAmplitudeX(amplitudeX) {
    this.amplitudeX = amplitudeX;
    return this;
  }

  setAmplitudeY(amplitudeY) {
    this.amplitudeY = amplitudeY;

    this.width = amplitudeY * 2;
    this._xOrigin = this.width / 2;
    this.height = amplitudeY * 2;
    this._yOrigin = this.height / 2;

    return this;
  }
  
  setFrequencyX(frequencyX) {
    this.frequencyX = frequencyX;
    return this;
  }

  setFrequencyY(frequencyY) {
    this.frequencyY = frequencyY;
    return this;
  }

  setPhaseShiftX(phaseShiftX) {
    this.phaseShiftX = phaseShiftX;
    return this;
  }

  setPhaseShiftY(phaseShiftY) {
    this.phaseShiftY = phaseShiftY;
    return this;
  }

  setDampingRatio(dampingRatio) {
    this.dampingRatio = dampingRatio;
    return this;
  }

  clear() {

  }

  reset() {
    this.t = 0;
    this.path = new Path2D();
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  }

  tick() {
    this.t += TICK_IN_SEC;
    const {x, y} = this._delta(this.t);
    this.path.lineTo(this._xOrigin + x, this._yOrigin + y);
  }

  draw() {
    this.ctx.save();
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 0.1;
    this.ctx.stroke(this.path);
    this.ctx.restore();
  }

  _delta() {
    let x = this.amplitudeX * Math.sin(this.frequencyX * this.t + this.phaseShiftX);
    let y = this.amplitudeY * Math.sin(this.frequencyY * this.t + this.phaseShiftY);

    if (this.dampingRatio) {
      const e = Math.pow(Math.E, -(this.dampingRatio * this.t));
      x *= e;
      y *= e;
    }

    return {
      x, 
      y 
    };
  }
}

export default LateralHarmonograph;