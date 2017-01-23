import {HALF_PI, TICK_IN_SEC, TWO_PI} from './constants.js';

class Pendulum1D {

  constructor(scene, x, y, width, height, amplitude, frequency) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;

    this.amplitude = amplitude;
    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per 1 second
    this.phaseShift = HALF_PI; // Must be in radians
    this.dampingRatio = 0;

    this.t = 0;
    this._pendulumXOrigin = this.x + this.width / 2; 
    this._pendulumYOrigin = this.y;
    this._pendulumDelta = this._delta(this.t);
    this._prevPendulumX =
      this._pendulumX = this._pendulumXOrigin + this._pendulumDelta.dx;
    this._prevPendulumY =
      this._pendulumY = this._pendulumYOrigin + this._pendulumDelta.dy;
    
    this._lastRender = 0;

    scene.addObject(this);
  }

  setAmplitude(amplitude) {
    this.amplitude = amplitude;
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
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  }

  reset() {
    this.t = 0;
  }

  draw() {
    this.drawLine();
    this.drawHalfCircle();
    this.drawPendulum();
  }

  drawLine() {
    this.ctx.beginPath();
    this.ctx.moveTo(this._pendulumXOrigin - this.amplitude, this.y);
    this.ctx.lineTo(this._pendulumXOrigin + this.amplitude, this.y);
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawHalfCircle() {
    this.ctx.save();
    this.ctx.setLineDash([4, 2]);
    this.ctx.strokeStyle = '#CCC';
    this.ctx.beginPath();
    this.ctx.arc(this._pendulumXOrigin, this._pendulumYOrigin, this.amplitude, Math.PI, TWO_PI, true);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawPendulum() {
    this.ctx.beginPath();
    this.ctx.moveTo(this._pendulumXOrigin, this.y);
    this.ctx.lineTo(this._pendulumX, this._pendulumY);
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();
  }

  tick() {
    this.t += TICK_IN_SEC;

    const {dx, dy} = this._delta(this.t);

    this._prevPendulumX = this._pendulumX;
    this._prevPendulumY = this._pendulumY;

    this._pendulumX = this._pendulumXOrigin + dx;
    this._pendulumY = this._pendulumYOrigin + dy;
  }

  _delta(t) {
    let dx = this.amplitude * Math.sin(this.frequency * t + this.phaseShift);

    if (this.dampingRatio) {
      dx *= Math.pow(Math.E, -(this.dampingRatio * t));
    }

    return {
      dx,
      dy: Math.sqrt(Math.pow(this.amplitude, 2) - Math.pow(dx, 2)),
    }
  }
}

export default Pendulum1D;
