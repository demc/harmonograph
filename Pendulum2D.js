import {HALF_PI, TICK_IN_SEC, TWO_PI} from './constants';

class Pendulum2D {

  constructor(scene, x, y, width, height, amplitudeX, amplitudeY, frequencyX, frequencyY, phaseShiftX, phaseShiftY) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;

    this.amplitudeX = amplitudeX;
    this.amplitudeY = amplitudeY;
    this.frequencyX = frequencyX || 2 * Math.PI; // One 'cycle' per 1 second
    this.frequencyY = frequencyY || 2 * Math.PI; // One 'cycle' per 1 second
    this.phaseShiftX = phaseShiftX === undefined ? HALF_PI : phaseShiftX; // Must be in radians
    this.phaseShiftY = phaseShiftY === undefined ? HALF_PI : phaseShiftY; // Must be in radians
    this.dampingRatio = 0;

    this.t = 0;
    this.path = new Path2D();

    this._pendulumXOrigin = this.x + this.width / 2; 
    this._pendulumYOrigin = this.y + this.height / 2; 

    this._pendulumX = this._pendulumXOrigin + this._deltaX(this.amplitudeX, this.t);
    this._pendulumY = this._pendulumYOrigin + this._deltaY(this.amplitudeY, this.t); 

    this.path.moveTo(this._pendulumX, this._pendulumY);

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

  setDampingRatio(dampingRatio) {
    this.dampingRatio = dampingRatio;
    return this;
  }

  reset() {
    this.t = 0;
    this.path = new Path2D();

    this._pendulumX = this._pendulumXOrigin + this._deltaX(this.t);
    this._pendulumY = this._pendulumYOrigin + this._deltaY(this.t); 
  }

  // Intentionally left blank
  clear() { }

  tick() {
    this.t += TICK_IN_SEC;

    this._lastPendulumX = this._pendulumX;
    this._lastPendulumY = this._pendulumY;
    this._pendulumX = this._pendulumXOrigin + this._deltaX(this.t);
    this._pendulumY = this._pendulumYOrigin + this._deltaY(this.t); 
  }

  draw() {
    this.clearCursor();
    this.drawPen();
    this.drawCursor();
  }

  drawPen() {
    this.ctx.save();
    
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 1;
    this.path.lineTo(this._pendulumX, this._pendulumY);
    this.ctx.stroke(this.path);

    this.ctx.restore();
  }

  clearCursor() {
    this.ctx.clearRect(this._lastPendulumX - 3, this._lastPendulumY - 3, 6, 6);
  }

  drawCursor() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = 'red';
    this.ctx.arc(this._pendulumX, this._pendulumY, 2, 0, TWO_PI);
    this.ctx.fill();
    this.ctx.restore();
  }

  _deltaX(t) {
    let dx = this.amplitudeX * Math.sin(this.frequencyX * t + this.phaseShiftX);

    if (this.dampingRatio) {
      dx *= Math.pow(Math.E, -(this.dampingRatio * t));
    }

    return dx;
  }

  _deltaY(t) {
    let dy = this.amplitudeY * Math.sin(this.frequencyY * t + this.phaseShiftY);

    if (this.dampingRatio) {
      dy *= Math.pow(Math.E, -(this.dampingRatio * t));
    }

    return dy;
  }
}

export default Pendulum2D;
