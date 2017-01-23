import {HALF_PI, TICK_IN_SEC} from './constants.js';

class SineWave {

  constructor(scene, x, y, width, height, amplitude, frequency) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;

    this.amplitude = amplitude;
    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per second
    this.phaseShift = HALF_PI;
    this.dampingRatio = 0;

    this.t = 0;
    this._steps = [this._computeStepY()];

    scene.addObject(this);
  }

  setAmplitude(amplitude) {
    this.amplitude = amplitude;
    this._steps = [];
    return this;
  }

  setFrequency(frequency) {
    this.frequency = frequency;
    this._steps = [];
    return this;
  }

  setPhaseShift(phaseShift) {
    this.phaseShift = phaseShift;
    this._steps = [];
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
    this._steps = [];
  }

  tick() {
    this.t += TICK_IN_SEC;
    this._steps.push(this._computeStepY());
  }

  draw() {
    this.drawAxes();
    this.drawWave();
  }

  drawAxes() {
    const xPos = this.width / 10;
    const yPos = this.height / 2;

    this.ctx.save();

    this.ctx.setLineDash([4, 2]);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#CCC';

    // Y Axis
    // this.ctx.beginPath();
    // this.ctx.moveTo(this.x + xPos, this.y);
    // this.ctx.lineTo(this.x + xPos, this.y + this.height);
    // this.ctx.stroke();
    // this.ctx.closePath();

    // X Axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y + yPos);
    this.ctx.lineTo(this.x + this.width, this.y + yPos);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawWave() {
    const xPos = this.x + this.width;
    const yPos = this.y + this.height / 2;

    this.ctx.save();
    this.ctx.strokeStyle = '#00FF00';

    this.ctx.beginPath();

    for (let i = 0; i < this._steps.length; i++) {
      const y = this._steps[this._steps.length - i - 1];
      const x = (this.frequency * i * TICK_IN_SEC * this.amplitude) / Math.PI;

      const dx = xPos - x;
      const dy = yPos - y;

      this.ctx.lineTo(dx, dy);  
    }
    
    this.ctx.stroke();
    this.ctx.restore();
  }

  _computeStepY() {
    let dy = this.amplitude * Math.sin(this.frequency * this.t + this.phaseShift);

    if (this.dampingRatio) {
      dy *= Math.pow(Math.E, -(this.dampingRatio * this.t));
    }

    return dy;
  }
}

export default SineWave;
