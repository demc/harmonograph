import katex from 'katex';

import {TICK_IN_SEC} from './constants';

function radian_to_tex(value) {
  if (value !== 1) {
    if (value % 1 === 0) {
      return value + '\\pi';
    } else if (value % 0.5 === 0) {
      const multiple = value / 0.5;
      return '\\frac{' + (multiple > 1 ? multiple : '') + '\\pi}{2}';
    } else if (value % 0.25 === 0) {
      const multiple = value / 0.25;
      return '\\frac{' + (multiple > 1 ? multiple : '') + '\\pi}{4}';
    }
  }
  return '\\pi';
}

const FORMULA = (s) => `${s}(t) = A_{${s}} \\cdot\\sin(f_{${s}} \\cdot t + p_{${s}})`;
const FORMULA_X = FORMULA('x');
const FORMULA_Y = FORMULA('y');
const FORMULA_DAMPING = (s) => `${s}(t) = A_{${s}} \\cdot\\sin(f_{${s}} \\cdot t + p_{${s}}) \\cdot e^{-d_{${s}}t}`;
const FORMULA_DAMPING_X = FORMULA_DAMPING('x');
const FORMULA_DAMPING_Y = FORMULA_DAMPING('y');

class Formula2D {

  constructor(
    formulaXNode,
    formulaXValuesNode,
    formulaYNode,
    formulaYValuesNode,
    amplitudeX,
    amplitudeY,
    frequencyX,
    frequencyY,
    phaseShiftX,
    phaseShiftY
  ) {
    this.formulaXNode = formulaXNode;
    this.formulaXValuesNode = formulaXValuesNode;
    this.formulaYNode = formulaYNode;
    this.formulaYValuesNode = formulaYValuesNode;

    this.amplitudeX = amplitudeX;
    this.amplitudeY = amplitudeY;
    this.frequencyX = frequencyX;
    this.frequencyY = frequencyY;
    this.frequencyXMultiplier = frequencyX / Math.PI;
    this.frequencyYMultiplier = frequencyY / Math.PI;
    this.phaseShiftX = phaseShiftX;
    this.phaseShiftY = phaseShiftY;
    this.phaseShiftXMultiplier = phaseShiftX / Math.PI;
    this.phaseShiftYMultiplier = phaseShiftY / Math.PI;
    this.dampingRatio = 0;

    this.t = 0;
    this.last = 0;
  } 

  setAmplitudeX(amplitude) {
    this.amplitudeX = amplitude;
    this.renderX();
    return this;
  }

  setAmplitudeY(amplitude) {
    this.amplitudeY = amplitude;
    this.renderY();
    return this;
  }

  setFrequencyX(frequency) {
    this.frequencyX = frequency;
    this.frequencyXMultiplier = Math.round((frequency / Math.PI) * 100) / 100;
    this.renderX();
    return this;
  }

  setFrequencyY(frequency) {
    this.frequencyY = frequency;
    this.frequencyYMultiplier = Math.round((frequency / Math.PI) * 100) / 100;
    this.renderY();
    return this;
  }

  setPhaseShiftX(phaseShift) {
    this.phaseShiftX = phaseShift;
    this.phaseShiftXMultiplier = Math.round((phaseShift / Math.PI) * 100) / 100;
    this.renderX();
    return this;
  }

  setPhaseShiftY(phaseShift) {
    this.phaseShiftY = phaseShift;
    this.phaseShiftYMultiplier = Math.round((phaseShift / Math.PI) * 100) / 100;
    this.renderY();
    return this;
  }

  setDampingRatio(dampingRatio) {
    this.dampingRatio = dampingRatio;
    this.render();
    return this;
  }

  renderX() {
    katex.render(
      this.dampingRatio ? FORMULA_DAMPING_X : FORMULA_X,
      this.formulaXNode
    );

    katex.render(
      'x = ' + this.amplitudeX + ' \\cdot\\sin(' + 
      radian_to_tex(this.frequencyXMultiplier) + 
      '\\cdot t + ' + 
      radian_to_tex(this.phaseShiftXMultiplier) +
      ')' + 
      (this.dampingRatio ? '\\cdot e^{-' + this.dampingRatio + 't}' : ''),
      this.formulaXValuesNode
    );
  }

  renderY() {
    katex.render(
      this.dampingRatio ? FORMULA_DAMPING_Y : FORMULA_Y,
      this.formulaYNode
    );

    katex.render(
      'y = ' + this.amplitudeY + ' \\cdot\\sin(' + 
      radian_to_tex(this.frequencyYMultiplier) + 
      '\\cdot t + ' + 
      radian_to_tex(this.phaseShiftYMultiplier) +
      ')' + 
      (this.dampingRatio ? '\\cdot e^{-' + this.dampingRatio + 't}' : ''),
      this.formulaYValuesNode
    );
  }

  render() {
    this.renderX();
    this.renderY();
  }
}

export default Formula2D;
