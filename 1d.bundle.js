/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	import Scene from './Scene.js';

	const content = document.getElementById('content');
	const canvas = document.getElementById('canvas');
	setupCanvas(content, canvas);

	function setupCanvas(content, canvas) {
	  const {
	    ctx,
	    scene, 
	    pendulumDial,
	    pendulum1D,
	    unitCircle,
	    sineWave
	  } = getVisualizationState(content, canvas);

	  setupInputHandlers(ctx, scene, pendulumDial, pendulum1D, unitCircle, sineWave);

	  scene.setClearBetweenFrames(true).start();
	}

	function getVisualizationState(content, canvas) {
	  if (canvas._state) {
	    return canvas._state;
	  } else {
	    let ctx = canvas.getContext('2d');
	    let scene = new Scene(content, ctx);

	    const xMidPoint = scene.width / 2;
	    const yMidPoint = scene.height / 2;

	    let pendulumDial = new PendulumDial(scene, xMidPoint - 180, 25, 360, 10, 'horizontal', 100, Math.PI);
	    let pendulum1D = new Pendulum1D(scene, xMidPoint - 180, 50, 360, 180, 100, Math.PI);
	    let unitCircle = new UnitCircle(scene, xMidPoint, 350, 100, Math.PI);
	    let sineWave = new SineWave(scene, xMidPoint - 180, 300, 180, 100, 100, Math.PI);

	    // TODO: resize objects based on container size

	    const state = {
	      ctx,
	      scene,
	      pendulumDial,
	      pendulum1D,
	      unitCircle,
	      sineWave
	    };

	    canvas._state = state;

	    return state;
	  }
	}

	function setupInputHandlers(ctx, scene, pendulumDial, pendulum1D, unitCircle, sineWave) {

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
	        [pendulumDial, unitCircle, pendulum1D, sineWave],
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
	        [pendulumDial, unitCircle, pendulum1D, sineWave],
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
	        [pendulumDial, unitCircle, pendulum1D, sineWave],
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

/***/ }
/******/ ]);