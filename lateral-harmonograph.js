import Cursor2D from './Cursor2D';
import Formula2D from './Formula2D';
import FullScreenScene from './FullScreenScene';
import LateralHarmonograph from './LateralHarmonograph';
import LateralScene from './LateralScene';
import PendulumDial from './PendulumDial';

import {HALF_PI} from './constants';
import invariantDefault from './invariantDefault';
import setDefault from './setDefault';

const content = document.getElementById('content');
const fullScreenCanvas = document.getElementById('canvas');
const rotaryCanvas = document.getElementById('rotary');

const formulaX = document.getElementById('formula-x');
const formulaXValues = document.getElementById('formula-x-values');
const formulaY = document.getElementById('formula-y');
const formulaYValues = document.getElementById('formula-y-values');

setupCanvas(content, fullScreenCanvas, rotaryCanvas);

function setupCanvas(content, fullScreenCanvas, rotaryCanvas) {
  const {
    fsScene,
    lScene,
    cursor,
    formula2D,
    lateralHarmonograph,
    pendulumDialX
  } = getVisualizationState(content, fullScreenCanvas, rotaryCanvas);

  setupInputHandlers(fsScene, lScene, pendulumDialX, cursor, lateralHarmonograph, formula2D);

  fsScene.start();
  lScene.start();
}

function getVisualizationState(content, fullScreenCanvas, rotaryCanvas) {
  const fsScene = new FullScreenScene(content, fullScreenCanvas.getContext('2d'));

  const screenWidth = fsScene.width;
  const screenHeight= fsScene.height;

  const xMidpoint = screenWidth / 2;
  const yMidpoint = screenHeight / 2;
  
  const amplitudeX = 100;
  const amplitudeY = 100;

  const x = xMidpoint - amplitudeX;
  const y = yMidpoint - amplitudeY;

  const width = amplitudeX * 2;
  const height = amplitudeY * 2;

  const frequencyX = HALF_PI;
  const frequencyY = HALF_PI;

  const sideLength = amplitudeY * 2;

  const lScene = new LateralScene(content, rotaryCanvas.getContext('2d'), x, y , sideLength, amplitudeY, frequencyX, HALF_PI);
  lScene.setPosition(xMidpoint, yMidpoint);

  let pendulumDialX = new PendulumDial(fsScene, x, yMidpoint - 5, width, 10, 'horizontal', amplitudeX, frequencyX, HALF_PI);
  let cursor = new Cursor2D(fsScene, x, y, width, height, 2, 'red', amplitudeX, 0, frequencyX, 0, frequencyX, 0);

  let lateralHarmonograph = new LateralHarmonograph(
    lScene,
    0,
    0,
    width, 
    height,
    amplitudeX,
    amplitudeY,
    frequencyX, 
    frequencyY,
    HALF_PI, 
    3 * HALF_PI // offset because the harmonograph draws inversely to the moving scene
  );


  let formula2D = new Formula2D(
    formulaX,
    formulaXValues,
    formulaY,
    formulaYValues,
    amplitudeX,
    amplitudeY,
    HALF_PI,
    HALF_PI,
    HALF_PI,
    HALF_PI
  );
  formula2D.render();

  return {
    fsScene,
    lScene,
    cursor,
    formula2D,
    lateralHarmonograph,
    pendulumDialX
  };
}

function setupInputHandlers(fsScene, lScene, pendulumDialX, cursor, lateralHarmonograph, formula2D) {

  const pauseButton = document.getElementById('pause');
  pauseButton.addEventListener('click', (e) => {
    if (fsScene.playing) {
      fsScene.stop();
      lScene.stop();
      pauseButton.textContent = 'Resume';
    } else {
      fsScene.start();
      lScene.start();
      pauseButton.textContent = 'Pause';
    }
  });
  
  document.getElementById('reset').addEventListener('click', () => {
    pauseButton.textContent = 'Pause';
    fsScene.reset();
    lScene.reset();
  });

  const amplitudeXInput = document.getElementById('amplitude-x');
  const amplitudeYInput = document.getElementById('amplitude-y');
  const frequencyXInput = document.getElementById('frequency-x');
  const frequencyYInput = document.getElementById('frequency-y');
  const phaseShiftXInput = document.getElementById('phase-shift-x');
  const phaseShiftYInput = document.getElementById('phase-shift-y');
  const dampingInput = document.getElementById('damping');

  //
  // FREQUENCY X
  //

  frequencyXInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        frequencyXInput,
        [pendulumDialX],
        'setFrequency',
        Math.PI
      ),
      100
    )
  );
  frequencyXInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        frequencyXInput,
        [cursor, lateralHarmonograph, formula2D],
        'setFrequencyX',
        Math.PI
      ),
      100
    )
  );
  setDefault(frequencyXInput, pendulumDialX, 'frequency', Math.PI);
  invariantDefault('frequencyX', pendulumDialX.frequency, [cursor, lateralHarmonograph, formula2D]);

  //
  // FREQUENCY Y
  //

  frequencyYInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        frequencyYInput,
        [lScene],
        'setFrequency',
        Math.PI
      ),
      100
    )
  );
  frequencyYInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        frequencyYInput,
        [cursor, lateralHarmonograph, formula2D],
        'setFrequencyY',
        Math.PI
      ),
      100
    )
  );
  setDefault(frequencyYInput, lScene, 'frequency', Math.PI);
  invariantDefault('frequencyY', lScene.frequency, [lateralHarmonograph, formula2D]);

  //
  // PHASE SHIFT X
  // 

  phaseShiftXInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        phaseShiftXInput,
        [pendulumDialX],
        'setPhaseShift',
        Math.PI
      ),
      100
    )
  );
  phaseShiftXInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        phaseShiftXInput,
        [cursor, lateralHarmonograph, formula2D],
        'setPhaseShiftX',
        Math.PI
      ),
      100
    )
  );
  setDefault(phaseShiftXInput, pendulumDialX, 'phaseShift', Math.PI);
  invariantDefault('phaseShiftX', pendulumDialX.phaseShift, [cursor, lateralHarmonograph, formula2D]);

  //
  // PHASE SHIFT Y
  //

  phaseShiftYInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        phaseShiftYInput,
        [lScene],
        'setPhaseShift',
        Math.PI
      ),
      100
    )
  );
  phaseShiftYInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        phaseShiftYInput,
        [
          cursor,
          formula2D,
          {
            setPhaseShiftY: (phaseShift) => {
              lateralHarmonograph.setPhaseShiftY(phaseShift + Math.PI);
            }
          }
        ],
        'setPhaseShiftY',
        Math.PI
      ),
      100
    )
  );
  setDefault(phaseShiftYInput, lScene, 'phaseShift', Math.PI);
  invariantDefault('phaseShiftY', lScene.phaseShift, [cursor, formula2D]);
  invariantDefault('phaseShiftY', lScene.phaseShift + Math.PI, [lateralHarmonograph]); // has inverse behavior

  //
  // AMPLITUDE X
  //

  amplitudeXInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        amplitudeXInput,
        [pendulumDialX],
        'setAmplitude'
      ),
      100
    )
  );
  amplitudeXInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        amplitudeXInput,
        [cursor, lateralHarmonograph, formula2D],
        'setAmplitudeX'
      ),
      100
    )
  );
  setDefault(amplitudeXInput, pendulumDialX, 'amplitude');
  invariantDefault('amplitudeX', pendulumDialX.amplitude, [cursor, lateralHarmonograph, formula2D]);

  //
  // AMPLITUDE Y
  //

  amplitudeYInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        amplitudeYInput,
        [lScene],
        'setAmplitude'
      ),
      100
    )
  );
  amplitudeYInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        amplitudeYInput,
        [lateralHarmonograph, formula2D],
        'setAmplitudeY'
      ),
      100
    )
  );
  setDefault(amplitudeYInput, lScene, 'amplitude');
  invariantDefault('amplitudeY', lScene.amplitude, [lateralHarmonograph, formula2D]);

  dampingInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        dampingInput,
        [cursor, pendulumDialX, lScene, lateralHarmonograph, formula2D],
        'setDampingRatio'
      ),
      100
    )
  );

  function createInputHandler(input, components, methodName, multiplier) {
    return (e) => {
      let value = parseFloat(e.target.value);

      if (isFinite(value)) {
        if (isFinite(multiplier)) {
          value = value * multiplier;
        }
        
        components.forEach(component => component[methodName](value));

        fsScene.reset();
        lScene.reset();
      }
    };
  }

  function debounce(fn, delay) {
    let timer; 

    return (e) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(fn.bind(this, e), delay);
    };
  }
}

