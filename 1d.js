import Pendulum1D from './Pendulum1D';
import PendulumDial from './PendulumDial';
import Formula1D from './Formula1D';
import FullScreenScene from './FullScreenScene';
import SineWave from './SineWave';
import UnitCircle from './UnitCircle';

const content = document.getElementById('content');
const canvas = document.getElementById('canvas');
const formula = document.getElementById('formula');
const formulaValues = document.getElementById('formula-values');

setupCanvas(content, canvas, formula, formulaValues);

function setupCanvas(content, canvas, formula, formulaValues) {
  const {
    ctx,
    scene, 
    pendulumDial,
    pendulum1D,
    unitCircle,
    sineWave,
    formula1D
  } = getVisualizationState(content, canvas, formula, formulaValues);

  setupInputHandlers(ctx, scene, pendulumDial, pendulum1D, unitCircle, sineWave, formula1D);

  scene.setClearBetweenFrames(true).start();
}

function getVisualizationState(content, canvas, formulaNode, formulaValuesNode) {
  if (canvas._state) {
    return canvas._state;
  } else {
    let ctx = canvas.getContext('2d');
    let scene = new FullScreenScene(content, ctx);

    const xMidPoint = scene.width / 2;
    const yMidPoint = scene.height / 2;

    let pendulumDial = new PendulumDial(scene, xMidPoint - 180, 25, 360, 10, 'horizontal', 100, Math.PI);
    let pendulum1D = new Pendulum1D(scene, xMidPoint - 180, 50, 360, 180, 100, Math.PI);
    let unitCircle = new UnitCircle(scene, xMidPoint, 350, 100, Math.PI);
    let sineWave = new SineWave(scene, xMidPoint - 180, 300, 180, 100, 100, Math.PI);

    // TODO: resize objects based on container size

    let formula1D = new Formula1D(formulaNode, formulaValuesNode, 'x', 100, Math.PI, Math.PI / 2);
    formula1D.render();

    const state = {
      ctx,
      scene,
      pendulumDial,
      pendulum1D,
      unitCircle,
      sineWave,
      formula1D
    };

    canvas._state = state;

    return state;
  }
}

function setupInputHandlers(ctx, scene, pendulumDial, pendulum1D, unitCircle, sineWave, formula1D) {

  const pauseButton = document.getElementById('pause');
  pauseButton.addEventListener('click', (e) => {
    if (scene.playing) {
      scene.stop();
      pauseButton.textContent = 'Resume';
    } else {
      scene.start();
      pauseButton.textContent = 'Pause';
    }
  });

  document.getElementById('reset').addEventListener('click', () => {
    pauseButton.textContent = 'Pause';
    scene.reset();
  });

  const frequencyInput = document.getElementById('frequency');
  const phaseShiftInput = document.getElementById('phase-shift');
  const amplitudeInput = document.getElementById('amplitude');
  const dampingInput = document.getElementById('damping');

  frequencyInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        frequencyInput,
        [pendulumDial, unitCircle, pendulum1D, sineWave, formula1D],
        'setFrequency',
        Math.PI
      ),
      100
    )
  );

  phaseShiftInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        phaseShiftInput,
        [pendulumDial, unitCircle, pendulum1D, sineWave, formula1D],
        'setPhaseShift',
        Math.PI
      ),
      100
    )
  );

  amplitudeInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        amplitudeInput,
        [pendulumDial, unitCircle, pendulum1D, sineWave, formula1D],
        'setAmplitude'
      ),
      100
    )
  );

  dampingInput.addEventListener(
    'input',
    debounce(
      createInputHandler(
        dampingInput,
        [pendulumDial, pendulum1D, unitCircle, sineWave],
        'setDampingRatio'
      ),
      100
    )
  );

  function createInputHandler(input, components, methodName, multiplier) {
    return (e) => {
      let value = parseFloat(e.target.value);

      if (isFinite(value)) {
        scene.reset();

        if (isFinite(multiplier)) {
          value = value * multiplier;
        }
        
        components.forEach(component => component[methodName](value));
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