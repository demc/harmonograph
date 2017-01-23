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

	function setupCanvas(content, canvas) {
	  const {
	    ctx,
	    scene, 
	    pendulumDialX,
	    pendulumDialY,
	    pendulum2D,
	    unitCircleX,
	    unitCircleY
	  } = getVisualizationState(content, canvas);

	  setupInputHandlers(ctx, scene, pendulumDialX, pendulumDialY, pendulum2D, unitCircleX, unitCircleY);

	  scene.start();
	}

	function getVisualizationState(content, canvas) {
	  if (canvas._state) {
	    return canvas._state;
	  } else {
	    let ctx = canvas.getContext('2d');
	    let scene = new Scene(content, ctx);

	    const xMidPoint = scene.width / 2;
	    const yMidPoint = scene.height / 2;

	    const amplitudeX = 100;
	    const amplitudeY = 50;

	    const x = xMidPoint - amplitudeX;
	    const y = yMidPoint - amplitudeY;

	    const width = amplitudeX * 2;
	    const height = amplitudeY * 2;

	    let pendulumDialX = new PendulumDial(scene, x, y - 20, width, 10, 'horizontal', amplitudeX, Math.PI);
	    let pendulumDialY = new PendulumDial(scene, x - 20, y, 10, height, 'vertical', amplitudeY, Math.PI, Math.PI);
	    let pendulum2D = new Pendulum2D(scene, x, y, width, height, amplitudeX, amplitudeY, Math.PI, Math.PI, Math.PI / 2, Math.PI);
	    let unitCircleX = new UnitCircle(scene, xMidPoint - 75, scene.height - 100, 40, Math.PI);
	    let unitCircleY = new UnitCircle(scene, xMidPoint + 75, scene.height - 100, 40, Math.PI, Math.PI);
	    let unitCircleXLabel = new Label(scene, xMidPoint - 75, scene.height - 25, 'X Component', 14, 'courier');
	    let unitCircleYLabel = new Label(scene, xMidPoint + 75, scene.height - 25, 'Y Component', 14, 'courier');

	    // TODO: resize objects based on container size

	    const state = {
	      ctx,
	      scene,
	      pendulumDialX,
	      pendulumDialY,
	      pendulum2D,
	      unitCircleX,
	      unitCircleY
	    };

	    canvas._state = state;

	    return state;
	  }
	}

	function setupInputHandlers(ctx, scene, pendulumDialX, pendulumDialY, pendulum2D, unitCircleX, unitCircleY) {
	  const xMidPoint = scene.width / 2;
	  const yMidPoint = scene.height / 2;

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

	  const amplitudeXInput = document.getElementById('amplitude-x');
	  const amplitudeYInput = document.getElementById('amplitude-y');
	  const frequencyXInput = document.getElementById('frequency-x');
	  const frequencyYInput = document.getElementById('frequency-y');
	  const phaseShiftXInput = document.getElementById('phase-shift-x');
	  const phaseShiftYInput = document.getElementById('phase-shift-y');
	  const dampingInput = document.getElementById('damping');

	  // TODO: set x/y for Pendulum2D

	  frequencyXInput.addEventListener(
	    'input',
	    debounce(
	      createInputHandler(
	        frequencyXInput,
	        [pendulumDialX, unitCircleX],
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
	        [pendulum2D],
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
	        [pendulumDialY, unitCircleY],
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
	        [pendulum2D],
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
	        [pendulumDialX, unitCircleX],
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
	        [pendulum2D],
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
	        [pendulumDialY, unitCircleY],
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
	        [pendulum2D],
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
	        [pendulum2D],
	        'setAmplitudeX'
	      ),
	      100
	    )
	  );

	  amplitudeXInput.addEventListener(
	    'input',
	    debounce(
	      (e) => {
	        const value = parseFloat(e.target.value);

	        if (isFinite(value)) {
	          pendulumDialY.setX(xMidPoint - value - 20);
	        }
	      },
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
	        [pendulum2D],
	        'setAmplitudeY'
	      ),
	      100
	    )
	  );

	  amplitudeYInput.addEventListener(
	    'input',
	    debounce(
	      (e) => {
	        const value = parseFloat(e.target.value);

	        if (isFinite(value)) {
	          pendulumDialX.setY(yMidPoint - value - 20);
	        }
	      },
	      100
	    )
	  );

	  dampingInput.addEventListener(
	    'input',
	    debounce(
	      createInputHandler(
	        dampingInput,
	        [pendulum2D, pendulumDialX, pendulumDialY],
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

	        scene.reset();
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