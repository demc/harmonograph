const TIMEOUT = 1000 / 60; //500
const TICK_IN_SEC = TIMEOUT / 1000;
const MAX_TICK = 100000;

const HALF_PI = Math.PI / 2;
const PI = Math.PI;
const THREE_FOURTHS_PI = (3 / 4) * Math.PI;
const TWO_PI = 2 * Math.PI;

const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';

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

  static syncCanvas(content, canvas) {
    canvas.height = content.offsetHeight;
    canvas.width = content.offsetWidth;
    canvas.style.height = content.offsetHeight + 'px';
    canvas.style.width = content.offsetWidth + 'px';
  }
}

class Scene {

  constructor(container, ctx, width, height) {
    this.container = container;
    this.ctx = ctx;
    this.height = content.offsetHeight;
    this.width = content.offsetWidth;
    this.objects = [];
    this.playing = false;
    this.clearBetweenFrames = false;

    this._timer = null;

    Helpers.syncCanvas(content, ctx.canvas);
    Helpers.adjustPixelDisplayRadio(ctx);

    window.addEventListener('resize', (e) => {
      Helpers.syncCanvas(content, ctx.canvas);
      Helpers.adjustPixelDisplayRadio(ctx);
      this.resizeObjects();
    });
  }

  addObject(obj) {
    this.objects.push(obj);
    return this;
  }

  resizeObjects() {
 
    // TODO: resize objects based on container size
    //   this.objects.forEach(obj => obj.handleContainerResize(this.width, this.heights));
  }

  setClearBetweenFrames(clearBetweenFrames) {
    this.clearBetweenFrames = clearBetweenFrames;
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
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objects.forEach((obj) => obj.reset());
    this.start();
  }

  draw() {
    if (this.clearBetweenFrames) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    } else {
      this.objects.forEach((obj) => obj.clear());  
    }
    
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

class Label {

  constructor(scene, x, y, text, textSize, fontFamily) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.x = x;
    this.y = y;
    this.text = text;
    this.textAlign = 'center';
    this.textSize = textSize;
    this.font = textSize + 'px ' + fontFamily;
    this.fontFamily = fontFamily;

    scene.addObject(this);
  }

  clear() { }

  tick() { }

  reset() { }

  draw() {
    this.ctx.save();
    this.ctx.font = this.font;
    this.ctx.fillStyle = '#222';
    this.ctx.textAlign = this.textAlign;  
    this.ctx.fillText(this.text, this.x, this.y);
    this.ctx.restore();
  }
}
