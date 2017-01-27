import AbsoluteScene from './AbsoluteScene';
import Cursor2D from './Cursor2D';
import FullScreenScene from './FullScreenScene';
import PendulumDial from './PendulumDial';
import RotaryHarmonograph from './RotaryHarmonograph';

import {HALF_PI} from './constants';

const content = document.getElementById('content');
const fullScreenCanvas = document.getElementById('canvas');
const rotaryCanvas = document.getElementById('rotary');

setupCanvas(content, fullScreenCanvas, rotaryCanvas);

function setupCanvas(content, fullScreenCanvas, rotaryCanvas) {
  const {
    fsScene,
    rScene,
    pendulumDialX,
    pendulumDialY,
    cursor,
    rotaryHarmonograph
  } = getVisualizationState(content, fullScreenCanvas, rotaryCanvas);

  setupInputHandlers(fsScene, rScene, pendulumDialX, pendulumDialY, cursor, rotaryHarmonograph);

  fsScene.start();
  rScene.start();
}

function getVisualizationState(content, fullScreenCanvas, rotaryCanvas) {
  const fsScene = new FullScreenScene(content, fullScreenCanvas.getContext('2d'));

  const screenWidth = fsScene.width;
  const screenHeight= fsScene.height;

  const xMidpoint = screenWidth / 2;
  const yMidpoint = screenHeight / 2;

  const x = xMidpoint - 150;
  const y = yMidpoint - 150;

  const radius = 50;
  
  const amplitudeX = 150;
  const amplitudeY = 150;

  const width = amplitudeX * 2;
  const height = amplitudeY * 2;

  const frequencyX = HALF_PI;
  const frequencyY = HALF_PI;

  const rScene = new AbsoluteScene(content, rotaryCanvas.getContext('2d'), x, y, width, height, radius, Math.PI / 2);
  rScene.setPosition(x, y);

  let pendulumDialX = new PendulumDial(fsScene, x, y - 20, width, 10, 'horizontal', amplitudeX - radius, Math.PI / 2);
  let pendulumDialY = new PendulumDial(fsScene, x - 20, y, 10, height, 'vertical', amplitudeY - radius, Math.PI / 2, Math.PI);
  let cursor = new Cursor2D(fsScene, x, y, width, height, 2, 'red', amplitudeX - radius, amplitudeY - radius, frequencyX, frequencyY, undefined, Math.PI);

  let rotaryHarmonograph = new RotaryHarmonograph(
    rScene,
    x,
    y,
    width,
    height,
    () => {
      let absoluteX = pendulumDialX.getAbsolutePosition();
      let absoluteY = pendulumDialY.getAbsolutePosition();

      let relativeX = absoluteX - x;
      let relativeY = absoluteY - y;

      const {x: offsetX, y: offsetY} = rScene.getOffsets();

      return {x: relativeX - offsetX, y: relativeY - offsetY};
    }
  );

  return {
    fsScene,
    rScene,
    pendulumDialX,
    pendulumDialY,
    cursor,
    rotaryHarmonograph
  };
}

function setupInputHandlers(fsScene, rScene, pendulumDialX, pendulumDialY, cursor, rotaryHarmonograph) {

  const pauseButton = document.getElementById('pause');
  pauseButton.addEventListener('click', (e) => {
    if (fsScene.playing) {
      fsScene.stop();
      rScene.stop();
      pauseButton.textContent = 'Resume';
    } else {
      fsScene.start();
      rScene.start();
      pauseButton.textContent = 'Pause';
    }
  });
  
  document.getElementById('reset').addEventListener('click', () => {
    pauseButton.textContent = 'Pause';
    fsScene.reset();
    rScene.reset();
  });

  const amplitudeXInput = document.getElementById('amplitude-x');
  const amplitudeYInput = document.getElementById('amplitude-y');
  const frequencyXInput = document.getElementById('frequency-x');
  const frequencyYInput = document.getElementById('frequency-y');
  const phaseShiftXInput = document.getElementById('phase-shift-x');
  const phaseShiftYInput = document.getElementById('phase-shift-y');
  const rotaryRadiusInput = document.getElementById('rotary-radius');
  const dampingInput = document.getElementById('damping');

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
        [cursor],
        'setFrequencyX',
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
        [pendulumDialY],
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
        [cursor],
        'setFrequencyY',
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
        [cursor],
        'setPhaseShiftX',
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
        [pendulumDialY],
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
        [cursor],
        'setPhaseShiftY',
        Math.PI
      ),
      100
    )
  );

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
        [cursor],
        'setAmplitudeX'
      ),
      100
    )
  );

  amplitudeYInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        amplitudeYInput,
        [pendulumDialY],
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
        [cursor],
        'setAmplitudeY'
      ),
      100
    )
  );

  rotaryRadiusInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        rotaryRadiusInput,
        [rScene, cursor],
        'setRadius'
      ),
      100
    )
  );

  dampingInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        dampingInput,
        [rScene, cursor, pendulumDialX, pendulumDialY],
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
        rScene.reset();
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

