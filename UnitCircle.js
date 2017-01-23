import {HALF_PI, TICK_IN_SEC, TWO_PI} from './constants.js';

class UnitCircle {

  constructor(scene, x, y, radius, frequency, phaseShift) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per 1 second
    this.phaseShift = phaseShift === undefined ? HALF_PI : phaseShift; // must be in radians
    this.dampingRatio = 0;

    this.t = 0;
    this._dialCoordinateDelta = this._delta(this.t);

    scene.addObject(this);
  }

  setAmplitude(amplitude) {
    this.radius = amplitude;
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
    this.ctx.clearRect(
      this.x - this.radius - 20,
      this.y - this.radius - 20,
      this.x + this.radius + 20,
      this.y + this.radius + 20
    );
  }

  draw() {
    this.drawCircle();
    this.drawY();
    this.drawDial();
    this.drawLegend();
  }

  reset() {
    this.t = 0;
  }

  tick() {
    this.t += TICK_IN_SEC;
    this._dialCoordinateDelta = this._delta(this.t);
  }

  drawCircle() {
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;

    this.ctx.beginPath(); 
    this.ctx.arc(this.x, this.y, 1, 0, TWO_PI);
    this.ctx.fill();

    const damping = this.dampingRatio ? Math.pow(Math.E, -(this.dampingRatio * this.t)) : 1;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius * damping, 0, TWO_PI);
    this.ctx.stroke();
  }

  drawDial() {
    const {x, y} = this._dialCoordinateDelta;

    this.ctx.beginPath();
    this.ctx.fillStyle = '#FF0000';
    this.ctx.arc(this.x + x, this.y - y, 2, 0, TWO_PI);
    this.ctx.fill();
  }

  drawY() {
    const {x, y} = this._dialCoordinateDelta;

    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = '#0000FF';

    this.ctx.beginPath();
    this.ctx.moveTo(this.x + x, this.y);
    this.ctx.lineTo(this.x + x, this.y - y);
    this.ctx.stroke();
  }

  drawLegend() {
    const damping = this.dampingRatio ? Math.pow(Math.E, -(this.dampingRatio * this.t)) : 1;
    this.ctx.fillStyle = '#000000'; 
    this.ctx.lineWidth = 1;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText('0', this.x + this.radius * damping + 5, this.y + 5);
    this.ctx.fillText('𝜋 / 2', this.x - 10, this.y - this.radius * damping - 5);
    this.ctx.fillText('𝜋', this.x - this.radius * damping - 12, this.y + 5);
    this.ctx.fillText('3𝜋 / 2', this.x - 15, this.y + this.radius * damping + 13);
  }

  _delta(t) {
    const x = this.radius * Math.cos(this.frequency * t + this.phaseShift);
    const y = this.radius * Math.sin(this.frequency * t + this.phaseShift);

    if (this.dampingRatio) {
      const damping = Math.pow(Math.E, -(this.dampingRatio * t));
      return {
        x: x * damping,
        y: y * damping,
      };
    }

    return {x, y};
  }
}

export default UnitCircle;
