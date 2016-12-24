const TIMEOUT = 1000 / 500;
const TICK_IN_SEC = TIMEOUT / 1000;
const MAX_TICK = 100000;

const HALF_PI = Math.PI / 2;
const PI = Math.PI;
const THREE_FOURTHS_PI = (3 / 4) * Math.PI;
const TWO_PI = 2 * Math.PI;

let tickCount = 0;

class Helpers {

  static adjustPixelDisplayRadio(ctx) {
    const {canvas} = ctx;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 
      1;
    const ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      canvas.width = oldWidth * ratio;
      canvas.height = oldHeight * ratio;

      canvas.style.width = oldWidth + 'px';
      canvas.style.height = oldHeight + 'px';

      ctx.scale(ratio, ratio);
    }
  }
}

class Scene {

  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.objects = [];
    this.playing = false;

    this._timer = null;

    Helpers.adjustPixelDisplayRadio(ctx);
  }

  addObject(obj) {
    this.objects.push(obj);
    return this;
  }

  start() {
    const draw = this.draw.bind(this);
    this._timer = window.setInterval(
      () => {
        ++tickCount;
        draw();

        if (tickCount >= MAX_TICK) {
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
    tickCount = 0;

    this.objects.forEach((obj) => {
      obj.t = 0;
    });

    this.start();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objects.forEach((obj) => obj.draw());
    this.objects.forEach((obj) => obj.tick());
  }
}

class Harmonograph {

  constructor(ctx, height, width) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;

    this.amplitude = 1;
    this.frequency = 1;
    this.phaseShift = 1;
    this.damping = 1;
  }
}

class PendulumDial {

  constructor(scene, x, y, width, height, amplitude, frequency, phaseShift) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;

    this.amplitude = amplitude || width / 2;
    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per 1 second
    this.phaseShift = phaseShift || HALF_PI; // Must be in radians

    this.t = 0;
    this._dialXOrigin = this.x + this.width / 2; 
    this._dialXDelta = this._delta(this._t);
    this._dialXPosition = this._dialXOrigin + this._dialXDelta;

    scene.addObject(this);
  }

  setAmplitude(amplitude) {
    this.amplitude = amplitude;
    this._ampHalf = this.amplitude / 2;
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

  draw() {
    this.drawLine();
    this.drawDial();
  }

  drawLine() {
    this.ctx.beginPath();
    this.ctx.moveTo(this._dialXOrigin - this.amplitude, this.y);
    this.ctx.lineTo(this._dialXOrigin + this.amplitude, this.y);
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawDial() {
    this.ctx.beginPath();
    this.ctx.moveTo(this._dialXPosition, this.y - 5);
    this.ctx.lineTo(this._dialXPosition, this.y + 5);
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  tick() {
    this.t += TICK_IN_SEC;
    this._dialXDelta = this._delta(this.t);
    this._dialXPosition = this._dialXOrigin + this._dialXDelta;
  }

  _delta(t) {
    return this.amplitude * Math.sin(this.frequency * t + this.phaseShift);
  }
}

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
    this.ctx.lineWidth = 1;
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
    const dx = this.amplitude * Math.sin(this.frequency * t + this.phaseShift);
    return {
      dx,
      dy: Math.sqrt(Math.pow(this.amplitude, 2) - Math.pow(dx, 2)),
    }
  }
}

class UnitCircle {

  constructor(scene, x, y, radius, frequency) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per 1 second
    this.phaseShift = HALF_PI; // must be in radians

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

  draw() {
    this.drawCircle();
    this.drawY();
    this.drawDial();
    this.drawLegend();
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

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
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

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#0000FF';

    this.ctx.beginPath();
    this.ctx.moveTo(this.x + x, this.y);
    this.ctx.lineTo(this.x + x, this.y - y);
    this.ctx.stroke();
  }

  drawLegend() {
    this.ctx.fillStyle = '#000000'; 
    this.ctx.lineWidth = 1;
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText('0', this.x + this.radius + 5, this.y + 5);
    this.ctx.fillText('𝜋 / 2', this.x - 10, this.y - this.radius - 5);
    this.ctx.fillText('𝜋', this.x - this.radius - 12, this.y + 5);
    this.ctx.fillText('3𝜋 / 2', this.x - 15, this.y + this.radius + 13);
  }

  _delta(t) {
    const x = this.radius * Math.cos(this.frequency * t + this.phaseShift);
    const y = this.radius * Math.sin(this.frequency * t + this.phaseShift);
    return {x, y};
  }
}

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
    return this.amplitude * Math.sin(this.frequency * this.t + this.phaseShift);
  }
}
