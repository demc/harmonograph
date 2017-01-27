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

const FORMULA = 'x = A \\cdot\\sin(f \\cdot t + p)';

class Formula1D {

	constructor(formulaNode, formulaValuesNode, variable, amplitude, frequency, phaseShift) {
		this.formulaNode = formulaNode;
		this.formulaValuesNode = formulaValuesNode;
	
		this.variable = variable;
		this.amplitude = amplitude;
		this.frequencyMultiplier = frequency / Math.PI; 
		this.phaseShiftMultiplier = phaseShift / Math.PI;
		this.dampingRatio = 0;

		this.t = 0;
		this.last = 0;
	}	

	setAmplitude(amplitude) {
		this.amplitude = amplitude;
		this.render();
		return this;
	}

	setFrequency(frequency) {
		this.frequencyMultiplier = Math.round((frequency / Math.PI) * 100) / 100;
		this.render();
		return this;
	}

	setPhaseShift(phaseShift) {
		this.phaseShiftMultiplier = Math.round((phaseShift / Math.PI) * 100) / 100;
		this.render();
		return this;
	}

	setDampingRatio(dampingRatio) {
		this.dampingRatio = dampingRatio;
		this.render();
		return this;
	}

	render() {
    katex.render(
      FORMULA,
      this.formulaNode
    );

    katex.render(
			this.variable + ' = ' + this.amplitude + ' \\cdot\\sin(' + 
      radian_to_tex(this.frequencyMultiplier) + 
      '\\cdot t + ' + 
    	radian_to_tex(this.phaseShiftMultiplier) +
      ')',
      this.formulaValuesNode
    );
	}
}

export default Formula1D;
