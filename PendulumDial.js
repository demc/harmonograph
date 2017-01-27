import {HALF_PI, HORIZONTAL, TICK_IN_SEC, VERTICAL} from './constants.js';

class PendulumDial {

  constructor(scene, x, y, width, height, orientation, amplitude, frequency, phaseShift) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.orientation = orientation;

    this.amplitude = amplitude || (orientation === HORIZONTAL ? width / 2 : height / 2);
    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per 1 second
    this.phaseShift = phaseShift || HALF_PI; // Must be in radians
    this.dampingRatio = 0;

    this.t = 0;

    // ORIGIN SHOULD BE IN THE MIDDLE OF THE BLOCK
    // EITHER BY HEIGHT OR WIDTH TO ALIGN PROPERLY.
    if (orientation === HORIZONTAL) {
      this._dialXOrigin = this.x + width / 2; 
      this._dialXDelta = this._delta(this.t);
      this._dialXPosition = this._dialXOrigin + this._dialXDelta;
    } else {
      this._dialYOrigin = this.y + height / 2;
      this._dialYDelta = this._delta(this.t);
      this._dialYPosition = this._dialYOrigin + this._dialYDelta;
    }

    scene.addObject(this);
  }

  getAbsolutePosition() {
    return this.orientation === HORIZONTAL ? this._dialXPosition : this._dialYPosition;
  }

  setX(x) {
    this.x = x;

    if (this.orientation === HORIZONTAL) {
      this._dialXOrigin = this.x + this.width / 2; 
      this._dialXDelta = this._delta(this.t);
      this._dialXPosition = this._dialXOrigin + this._dialXDelta;
    }

    return this;
  }

  setY(y) {
    this.y = y;

    if (this.orientation === VERTICAL) {
      this._dialYOrigin = this.y + this.height / 2;
      this._dialYDelta = this._delta(this.t);
      this._dialYPosition = this._dialYOrigin + this._dialYDelta;
    }

    return this;
  }

  setAmplitude(amplitude) {
    this.amplitude = amplitude;
    this._ampHalf = this.amplitude / 2;

    // Resize the boundaries to align with the new amplitude.
    if (this.orientation === HORIZONTAL) {
      const midpoint = this.x + this.width / 2;

      this.x = midpoint - amplitude;
      this.width = amplitude * 2;
    } else {
      const midpoint = this.y + this.height / 2;

      this.y = midpoint - amplitude;
      this.height = amplitude * 2;
    }   

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

  reset() {
    this.t = 0;
    this.update();
  }

  clear() {
    this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
  }

  draw() {
    this.drawLine();
    this.drawDial();
  }

  drawLine() {
    this.ctx.beginPath();

    if (this.orientation === HORIZONTAL) {
      this.ctx.moveTo(this._dialXOrigin - this.amplitude, this.y + this.height / 2);
      this.ctx.lineTo(this._dialXOrigin + this.amplitude, this.y + this.height / 2);
    } else {
      this.ctx.moveTo(this.x + this.width / 2, this._dialYOrigin - this.amplitude);
      this.ctx.lineTo(this.x + this.width / 2, this._dialYOrigin + this.amplitude);
    }

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawDial() {
    this.ctx.beginPath();

    if (this.orientation === HORIZONTAL) { 
      this.ctx.moveTo(this._dialXPosition, this.y + this.height / 2 - 5);
      this.ctx.lineTo(this._dialXPosition, this.y + this.height / 2 + 5);
    } else {
      this.ctx.moveTo(this.x + this.width / 2 - 5, this._dialYPosition);
      this.ctx.lineTo(this.x + this.width / 2 + 5, this._dialYPosition);
    }

    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  tick() {
    this.t += TICK_IN_SEC;
    this.update();
  }

  update() {
    if (this.orientation === HORIZONTAL) {
      this._dialXDelta = this._delta(this.t);
      this._dialXPosition = this._dialXOrigin + this._dialXDelta;
    } else {
      this._dialYDelta = this._delta(this.t);
      this._dialYPosition = this._dialYOrigin + this._dialYDelta;
    }
  }

  _delta(t) {
    const position = this.amplitude * Math.sin(this.frequency * t + this.phaseShift);

    if (this.dampingRatio) {
      return position * Math.pow(Math.E, -(this.dampingRatio * t));
    }

    return position;
  }
}

export default PendulumDial;
