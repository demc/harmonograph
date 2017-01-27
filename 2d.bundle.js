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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Label = __webpack_require__(35);

	var _Label2 = _interopRequireDefault(_Label);

	var _Pendulum2D = __webpack_require__(36);

	var _Pendulum2D2 = _interopRequireDefault(_Pendulum2D);

	var _PendulumDial = __webpack_require__(3);

	var _PendulumDial2 = _interopRequireDefault(_PendulumDial);

	var _FullScreenScene = __webpack_require__(30);

	var _FullScreenScene2 = _interopRequireDefault(_FullScreenScene);

	var _UnitCircle = __webpack_require__(34);

	var _UnitCircle2 = _interopRequireDefault(_UnitCircle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var content = document.getElementById('content');
	var canvas = document.getElementById('canvas');
	setupCanvas(content, canvas);

	function setupCanvas(content, canvas) {
	  var _getVisualizationStat = getVisualizationState(content, canvas),
	      ctx = _getVisualizationStat.ctx,
	      scene = _getVisualizationStat.scene,
	      pendulumDialX = _getVisualizationStat.pendulumDialX,
	      pendulumDialY = _getVisualizationStat.pendulumDialY,
	      pendulum2D = _getVisualizationStat.pendulum2D,
	      unitCircleX = _getVisualizationStat.unitCircleX,
	      unitCircleY = _getVisualizationStat.unitCircleY;

	  setupInputHandlers(ctx, scene, pendulumDialX, pendulumDialY, pendulum2D, unitCircleX, unitCircleY);

	  scene.start();
	}

	function getVisualizationState(content, canvas) {
	  if (canvas._state) {
	    return canvas._state;
	  } else {
	    var ctx = canvas.getContext('2d');
	    var scene = new _FullScreenScene2.default(content, ctx);

	    var xMidPoint = scene.width / 2;
	    var yMidPoint = scene.height / 2;

	    var amplitudeX = 100;
	    var amplitudeY = 50;

	    var x = xMidPoint - amplitudeX;
	    var y = yMidPoint - amplitudeY;

	    var width = amplitudeX * 2;
	    var height = amplitudeY * 2;

	    var pendulumDialX = new _PendulumDial2.default(scene, x, y - 20, width, 10, 'horizontal', amplitudeX, Math.PI);
	    var pendulumDialY = new _PendulumDial2.default(scene, x - 20, y, 10, height, 'vertical', amplitudeY, Math.PI, Math.PI);
	    var pendulum2D = new _Pendulum2D2.default(scene, x, y, width, height, amplitudeX, amplitudeY, Math.PI, Math.PI, Math.PI / 2, Math.PI);
	    var unitCircleX = new _UnitCircle2.default(scene, xMidPoint - 75, scene.height - 100, 40, Math.PI);
	    var unitCircleY = new _UnitCircle2.default(scene, xMidPoint + 75, scene.height - 100, 40, Math.PI, Math.PI);
	    var unitCircleXLabel = new _Label2.default(scene, xMidPoint - 75, scene.height - 25, 'X Component', 14, 'courier');
	    var unitCircleYLabel = new _Label2.default(scene, xMidPoint + 75, scene.height - 25, 'Y Component', 14, 'courier');

	    // TODO: resize objects based on container size

	    var state = {
	      ctx: ctx,
	      scene: scene,
	      pendulumDialX: pendulumDialX,
	      pendulumDialY: pendulumDialY,
	      pendulum2D: pendulum2D,
	      unitCircleX: unitCircleX,
	      unitCircleY: unitCircleY
	    };

	    canvas._state = state;

	    return state;
	  }
	}

	function setupInputHandlers(ctx, scene, pendulumDialX, pendulumDialY, pendulum2D, unitCircleX, unitCircleY) {
	  var xMidPoint = scene.width / 2;
	  var yMidPoint = scene.height / 2;

	  var pauseButton = document.getElementById('pause');
	  pauseButton.addEventListener('click', function (e) {
	    if (scene.playing) {
	      scene.stop();
	      pauseButton.textContent = 'Resume';
	    } else {
	      scene.start();
	      pauseButton.textContent = 'Pause';
	    }
	  });

	  document.getElementById('reset').addEventListener('click', function () {
	    pauseButton.textContent = 'Pause';
	    scene.reset();
	  });

	  var amplitudeXInput = document.getElementById('amplitude-x');
	  var amplitudeYInput = document.getElementById('amplitude-y');
	  var frequencyXInput = document.getElementById('frequency-x');
	  var frequencyYInput = document.getElementById('frequency-y');
	  var phaseShiftXInput = document.getElementById('phase-shift-x');
	  var phaseShiftYInput = document.getElementById('phase-shift-y');
	  var dampingInput = document.getElementById('damping');

	  // TODO: set x/y for Pendulum2D

	  frequencyXInput.addEventListener('input', debounce(createInputHandler(frequencyXInput, [pendulumDialX, unitCircleX], 'setFrequency', Math.PI), 100));

	  frequencyXInput.addEventListener('input', debounce(createInputHandler(frequencyXInput, [pendulum2D], 'setFrequencyX', Math.PI), 100));

	  frequencyYInput.addEventListener('input', debounce(createInputHandler(frequencyYInput, [pendulumDialY, unitCircleY], 'setFrequency', Math.PI), 100));

	  frequencyYInput.addEventListener('input', debounce(createInputHandler(frequencyYInput, [pendulum2D], 'setFrequencyY', Math.PI), 100));

	  phaseShiftXInput.addEventListener('input', debounce(createInputHandler(phaseShiftXInput, [pendulumDialX, unitCircleX], 'setPhaseShift', Math.PI), 100));

	  phaseShiftXInput.addEventListener('input', debounce(createInputHandler(phaseShiftXInput, [pendulum2D], 'setPhaseShiftX', Math.PI), 100));

	  phaseShiftYInput.addEventListener('input', debounce(createInputHandler(phaseShiftYInput, [pendulumDialY, unitCircleY], 'setPhaseShift', Math.PI), 100));

	  phaseShiftYInput.addEventListener('input', debounce(createInputHandler(phaseShiftYInput, [pendulum2D], 'setPhaseShiftY', Math.PI), 100));

	  amplitudeXInput.addEventListener('input', debounce(createInputHandler(amplitudeXInput, [pendulumDialX], 'setAmplitude'), 100));

	  amplitudeXInput.addEventListener('input', debounce(createInputHandler(amplitudeXInput, [pendulum2D], 'setAmplitudeX'), 100));

	  amplitudeXInput.addEventListener('input', debounce(function (e) {
	    var value = parseFloat(e.target.value);

	    if (isFinite(value)) {
	      pendulumDialY.setX(xMidPoint - value - 20);
	    }
	  }, 100));

	  amplitudeYInput.addEventListener('input', debounce(createInputHandler(amplitudeYInput, [pendulumDialY], 'setAmplitude'), 100));

	  amplitudeYInput.addEventListener('input', debounce(createInputHandler(amplitudeYInput, [pendulum2D], 'setAmplitudeY'), 100));

	  amplitudeYInput.addEventListener('input', debounce(function (e) {
	    var value = parseFloat(e.target.value);

	    if (isFinite(value)) {
	      pendulumDialX.setY(yMidPoint - value - 20);
	    }
	  }, 100));

	  dampingInput.addEventListener('input', debounce(createInputHandler(dampingInput, [pendulum2D, pendulumDialX, pendulumDialY], 'setDampingRatio'), 100));

	  function createInputHandler(input, components, methodName, multiplier) {
	    return function (e) {
	      var value = parseFloat(e.target.value);

	      if (isFinite(value)) {
	        if (isFinite(multiplier)) {
	          value = value * multiplier;
	        }

	        components.forEach(function (component) {
	          return component[methodName](value);
	        });

	        scene.reset();
	      }
	    };
	  }

	  function debounce(fn, delay) {
	    var _this = this;

	    var timer = void 0;

	    return function (e) {
	      if (timer) {
	        clearTimeout(timer);
	      }

	      timer = setTimeout(fn.bind(_this, e), delay);
	    };
	  }
	}

/***/ },

/***/ 2:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var TIMEOUT = exports.TIMEOUT = 1000 / 60;
	var TICK_IN_SEC = exports.TICK_IN_SEC = TIMEOUT / 1000;
	var MAX_TICK = exports.MAX_TICK = 100000;

	var HALF_PI = exports.HALF_PI = Math.PI / 2;
	var PI = exports.PI = Math.PI;
	var THREE_FOURTHS_PI = exports.THREE_FOURTHS_PI = 3 / 4 * Math.PI;
	var TWO_PI = exports.TWO_PI = 2 * Math.PI;

	var HORIZONTAL = exports.HORIZONTAL = 'horizontal';
	var VERTICAL = exports.VERTICAL = 'vertical';

/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PendulumDial = function () {
	  function PendulumDial(scene, x, y, width, height, orientation, amplitude, frequency, phaseShift) {
	    _classCallCheck(this, PendulumDial);

	    this.scene = scene;
	    this.ctx = scene.ctx;
	    this.height = height;
	    this.width = width;
	    this.x = x;
	    this.y = y;
	    this.orientation = orientation;

	    this.amplitude = amplitude || (orientation === _constants.HORIZONTAL ? width / 2 : height / 2);
	    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per 1 second
	    this.phaseShift = phaseShift || _constants.HALF_PI; // Must be in radians
	    this.dampingRatio = 0;

	    this.t = 0;

	    // ORIGIN SHOULD BE IN THE MIDDLE OF THE BLOCK
	    // EITHER BY HEIGHT OR WIDTH TO ALIGN PROPERLY.
	    if (orientation === _constants.HORIZONTAL) {
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

	  _createClass(PendulumDial, [{
	    key: 'getAbsolutePosition',
	    value: function getAbsolutePosition() {
	      return this.orientation === _constants.HORIZONTAL ? this._dialXPosition : this._dialYPosition;
	    }
	  }, {
	    key: 'setX',
	    value: function setX(x) {
	      this.x = x;

	      if (this.orientation === _constants.HORIZONTAL) {
	        this._dialXOrigin = this.x + this.width / 2;
	        this._dialXDelta = this._delta(this.t);
	        this._dialXPosition = this._dialXOrigin + this._dialXDelta;
	      }

	      return this;
	    }
	  }, {
	    key: 'setY',
	    value: function setY(y) {
	      this.y = y;

	      if (this.orientation === _constants.VERTICAL) {
	        this._dialYOrigin = this.y + this.height / 2;
	        this._dialYDelta = this._delta(this.t);
	        this._dialYPosition = this._dialYOrigin + this._dialYDelta;
	      }

	      return this;
	    }
	  }, {
	    key: 'setAmplitude',
	    value: function setAmplitude(amplitude) {
	      this.amplitude = amplitude;
	      this._ampHalf = this.amplitude / 2;

	      // Resize the boundaries to align with the new amplitude.
	      if (this.orientation === _constants.HORIZONTAL) {
	        var midpoint = this.x + this.width / 2;

	        this.x = midpoint - amplitude;
	        this.width = amplitude * 2;
	      } else {
	        var _midpoint = this.y + this.height / 2;

	        this.y = _midpoint - amplitude;
	        this.height = amplitude * 2;
	      }

	      return this;
	    }
	  }, {
	    key: 'setFrequency',
	    value: function setFrequency(frequency) {
	      this.frequency = frequency;
	      return this;
	    }
	  }, {
	    key: 'setPhaseShift',
	    value: function setPhaseShift(phaseShift) {
	      this.phaseShift = phaseShift;
	      return this;
	    }
	  }, {
	    key: 'setDampingRatio',
	    value: function setDampingRatio(dampingRatio) {
	      this.dampingRatio = dampingRatio;
	      return this;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.t = 0;
	      this.update();
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.drawLine();
	      this.drawDial();
	    }
	  }, {
	    key: 'drawLine',
	    value: function drawLine() {
	      this.ctx.beginPath();

	      if (this.orientation === _constants.HORIZONTAL) {
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
	  }, {
	    key: 'drawDial',
	    value: function drawDial() {
	      this.ctx.beginPath();

	      if (this.orientation === _constants.HORIZONTAL) {
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
	  }, {
	    key: 'tick',
	    value: function tick() {
	      this.t += _constants.TICK_IN_SEC;
	      this.update();
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      if (this.orientation === _constants.HORIZONTAL) {
	        this._dialXDelta = this._delta(this.t);
	        this._dialXPosition = this._dialXOrigin + this._dialXDelta;
	      } else {
	        this._dialYDelta = this._delta(this.t);
	        this._dialYPosition = this._dialYOrigin + this._dialYDelta;
	      }
	    }
	  }, {
	    key: '_delta',
	    value: function _delta(t) {
	      var position = this.amplitude * Math.sin(this.frequency * t + this.phaseShift);

	      if (this.dampingRatio) {
	        return position * Math.pow(Math.E, -(this.dampingRatio * t));
	      }

	      return position;
	    }
	  }]);

	  return PendulumDial;
	}();

	exports.default = PendulumDial;

/***/ },

/***/ 30:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Helpers = __webpack_require__(31);

	var _Helpers2 = _interopRequireDefault(_Helpers);

	var _Scene2 = __webpack_require__(32);

	var _Scene3 = _interopRequireDefault(_Scene2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FullScreenScene = function (_Scene) {
	  _inherits(FullScreenScene, _Scene);

	  function FullScreenScene(container, ctx) {
	    _classCallCheck(this, FullScreenScene);

	    _Helpers2.default.syncCanvas(container, ctx.canvas);

	    var _this = _possibleConstructorReturn(this, (FullScreenScene.__proto__ || Object.getPrototypeOf(FullScreenScene)).call(this, container, ctx));

	    _this.height = container.offsetHeight;
	    _this.width = container.offsetWidth;

	    window.addEventListener('resize', function (e) {
	      _Helpers2.default.syncCanvas(container, ctx.canvas);
	      _Helpers2.default.adjustPixelDisplayRadio(ctx);
	      _this.resizeObjects();
	    });
	    return _this;
	  }

	  _createClass(FullScreenScene, [{
	    key: 'resizeObjects',
	    value: function resizeObjects() {
	      // TODO: resize objects based on container size
	      // this.objects.forEach(obj => obj.handleContainerResize(this.width, this.heights));
	    }
	  }]);

	  return FullScreenScene;
	}(_Scene3.default);

	exports.default = FullScreenScene;

/***/ },

/***/ 31:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Helpers = function () {
	  function Helpers() {
	    _classCallCheck(this, Helpers);
	  }

	  _createClass(Helpers, null, [{
	    key: 'adjustPixelDisplayRadio',
	    value: function adjustPixelDisplayRadio(ctx) {
	      var canvas = ctx.canvas;

	      var devicePixelRatio = window.devicePixelRatio || 1;
	      var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
	      var ratio = devicePixelRatio / backingStoreRatio;

	      if (devicePixelRatio !== backingStoreRatio) {
	        var oldWidth = canvas.width;
	        var oldHeight = canvas.height;

	        canvas.width = oldWidth * ratio;
	        canvas.height = oldHeight * ratio;

	        canvas.style.width = oldWidth + 'px';
	        canvas.style.height = oldHeight + 'px';

	        ctx.scale(ratio, ratio);
	      }
	    }
	  }, {
	    key: 'syncCanvas',
	    value: function syncCanvas(content, canvas) {
	      canvas.height = content.offsetHeight;
	      canvas.width = content.offsetWidth;
	      canvas.style.height = content.offsetHeight + 'px';
	      canvas.style.width = content.offsetWidth + 'px';
	    }
	  }]);

	  return Helpers;
	}();

	exports.default = Helpers;

/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Helpers = __webpack_require__(31);

	var _Helpers2 = _interopRequireDefault(_Helpers);

	var _constants = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Scene = function () {
	  function Scene(container, ctx, width, height) {
	    _classCallCheck(this, Scene);

	    this.container = container;
	    this.ctx = ctx;
	    this.height = width;
	    this.width = height;
	    this.objects = [];
	    this.playing = false;
	    this.clearBetweenFrames = false;
	    this.tickCount = 0;

	    this._timer = null;

	    _Helpers2.default.adjustPixelDisplayRadio(ctx);
	  }

	  _createClass(Scene, [{
	    key: 'addObject',
	    value: function addObject(obj) {
	      this.objects.push(obj);
	      return this;
	    }
	  }, {
	    key: 'setClearBetweenFrames',
	    value: function setClearBetweenFrames(clearBetweenFrames) {
	      this.clearBetweenFrames = clearBetweenFrames;
	      return this;
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      var _this = this;

	      var draw = this.draw.bind(this);
	      this._timer = window.setInterval(function () {
	        ++_this.tickCount;
	        draw();

	        if (_this.tickCount >= _constants.MAX_TICK) {
	          window.clearInterval(_this._timer);
	          console.log('MAX TICK LIMIT HIT');
	        }
	      }, _constants.TIMEOUT);
	      this.playing = true;
	      return this;
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      clearInterval(this._timer);
	      this.playing = false;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.stop();
	      this.tickCount = 0;
	      this.ctx.clearRect(0, 0, this.width, this.height);
	      this.objects.forEach(function (obj) {
	        return obj.reset();
	      });
	      this.start();
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      if (this.clearBetweenFrames) {
	        this.ctx.clearRect(0, 0, this.width, this.height);
	      } else {
	        this.objects.forEach(function (obj) {
	          return obj.clear();
	        });
	      }

	      this.objects.forEach(function (obj) {
	        return obj.draw();
	      });
	      this.objects.forEach(function (obj) {
	        return obj.tick();
	      });
	    }
	  }]);

	  return Scene;
	}();

	exports.default = Scene;

/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UnitCircle = function () {
	  function UnitCircle(scene, x, y, radius, frequency, phaseShift) {
	    _classCallCheck(this, UnitCircle);

	    this.scene = scene;
	    this.ctx = scene.ctx;
	    this.x = x;
	    this.y = y;

	    this.radius = radius;
	    this.frequency = frequency || 2 * Math.PI; // One 'cycle' per 1 second
	    this.phaseShift = phaseShift === undefined ? _constants.HALF_PI : phaseShift; // must be in radians
	    this.dampingRatio = 0;

	    this.t = 0;
	    this._dialCoordinateDelta = this._delta(this.t);

	    scene.addObject(this);
	  }

	  _createClass(UnitCircle, [{
	    key: 'setAmplitude',
	    value: function setAmplitude(amplitude) {
	      this.radius = amplitude;
	      return this;
	    }
	  }, {
	    key: 'setFrequency',
	    value: function setFrequency(frequency) {
	      this.frequency = frequency;
	      return this;
	    }
	  }, {
	    key: 'setPhaseShift',
	    value: function setPhaseShift(phaseShift) {
	      this.phaseShift = phaseShift;
	      return this;
	    }
	  }, {
	    key: 'setDampingRatio',
	    value: function setDampingRatio(dampingRatio) {
	      this.dampingRatio = dampingRatio;
	      return this;
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.ctx.clearRect(this.x - this.radius - 20, this.y - this.radius - 20, this.x + this.radius + 20, this.y + this.radius + 20);
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.drawCircle();
	      this.drawY();
	      this.drawDial();
	      this.drawLegend();
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.t = 0;
	    }
	  }, {
	    key: 'tick',
	    value: function tick() {
	      this.t += _constants.TICK_IN_SEC;
	      this._dialCoordinateDelta = this._delta(this.t);
	    }
	  }, {
	    key: 'drawCircle',
	    value: function drawCircle() {
	      this.ctx.strokeStyle = '#000000';
	      this.ctx.lineWidth = 1;

	      this.ctx.beginPath();
	      this.ctx.arc(this.x, this.y, 1, 0, _constants.TWO_PI);
	      this.ctx.fill();

	      var damping = this.dampingRatio ? Math.pow(Math.E, -(this.dampingRatio * this.t)) : 1;
	      this.ctx.beginPath();
	      this.ctx.arc(this.x, this.y, this.radius * damping, 0, _constants.TWO_PI);
	      this.ctx.stroke();
	    }
	  }, {
	    key: 'drawDial',
	    value: function drawDial() {
	      var _dialCoordinateDelta = this._dialCoordinateDelta,
	          x = _dialCoordinateDelta.x,
	          y = _dialCoordinateDelta.y;


	      this.ctx.beginPath();
	      this.ctx.fillStyle = '#FF0000';
	      this.ctx.arc(this.x + x, this.y - y, 2, 0, _constants.TWO_PI);
	      this.ctx.fill();
	    }
	  }, {
	    key: 'drawY',
	    value: function drawY() {
	      var _dialCoordinateDelta2 = this._dialCoordinateDelta,
	          x = _dialCoordinateDelta2.x,
	          y = _dialCoordinateDelta2.y;


	      this.ctx.lineWidth = 1.5;
	      this.ctx.strokeStyle = '#0000FF';

	      this.ctx.beginPath();
	      this.ctx.moveTo(this.x + x, this.y);
	      this.ctx.lineTo(this.x + x, this.y - y);
	      this.ctx.stroke();
	    }
	  }, {
	    key: 'drawLegend',
	    value: function drawLegend() {
	      var damping = this.dampingRatio ? Math.pow(Math.E, -(this.dampingRatio * this.t)) : 1;
	      this.ctx.fillStyle = '#000000';
	      this.ctx.lineWidth = 1;
	      this.ctx.font = '12px sans-serif';
	      this.ctx.fillText('0', this.x + this.radius * damping + 5, this.y + 5);
	      this.ctx.fillText('𝜋 / 2', this.x - 10, this.y - this.radius * damping - 5);
	      this.ctx.fillText('𝜋', this.x - this.radius * damping - 12, this.y + 5);
	      this.ctx.fillText('3𝜋 / 2', this.x - 15, this.y + this.radius * damping + 13);
	    }
	  }, {
	    key: '_delta',
	    value: function _delta(t) {
	      var x = this.radius * Math.cos(this.frequency * t + this.phaseShift);
	      var y = this.radius * Math.sin(this.frequency * t + this.phaseShift);

	      if (this.dampingRatio) {
	        var damping = Math.pow(Math.E, -(this.dampingRatio * t));
	        return {
	          x: x * damping,
	          y: y * damping
	        };
	      }

	      return { x: x, y: y };
	    }
	  }]);

	  return UnitCircle;
	}();

	exports.default = UnitCircle;

/***/ },

/***/ 35:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Label = function () {
	  function Label(scene, x, y, text, textSize, fontFamily) {
	    _classCallCheck(this, Label);

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

	  _createClass(Label, [{
	    key: 'clear',
	    value: function clear() {}
	  }, {
	    key: 'tick',
	    value: function tick() {}
	  }, {
	    key: 'reset',
	    value: function reset() {}
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.ctx.save();
	      this.ctx.font = this.font;
	      this.ctx.fillStyle = '#222';
	      this.ctx.textAlign = this.textAlign;
	      this.ctx.fillText(this.text, this.x, this.y);
	      this.ctx.restore();
	    }
	  }]);

	  return Label;
	}();

	exports.default = Label;

/***/ },

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Pendulum2D = function () {
	  function Pendulum2D(scene, x, y, width, height, amplitudeX, amplitudeY, frequencyX, frequencyY, phaseShiftX, phaseShiftY) {
	    _classCallCheck(this, Pendulum2D);

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
	    this.phaseShiftX = phaseShiftX === undefined ? _constants.HALF_PI : phaseShiftX; // Must be in radians
	    this.phaseShiftY = phaseShiftY === undefined ? _constants.HALF_PI : phaseShiftY; // Must be in radians
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

	  _createClass(Pendulum2D, [{
	    key: 'setAmplitudeX',
	    value: function setAmplitudeX(amplitude) {
	      this.amplitudeX = amplitude;
	      this.width = amplitude * 2;
	    }
	  }, {
	    key: 'setAmplitudeY',
	    value: function setAmplitudeY(amplitude) {
	      this.amplitudeY = amplitude;
	      this.height = amplitude * 2;
	    }
	  }, {
	    key: 'setFrequencyX',
	    value: function setFrequencyX(frequency) {
	      this.frequencyX = frequency;
	    }
	  }, {
	    key: 'setFrequencyY',
	    value: function setFrequencyY(frequency) {
	      this.frequencyY = frequency;
	    }
	  }, {
	    key: 'setPhaseShiftX',
	    value: function setPhaseShiftX(phaseShift) {
	      this.phaseShiftX = phaseShift;
	    }
	  }, {
	    key: 'setPhaseShiftY',
	    value: function setPhaseShiftY(phaseShift) {
	      this.phaseShiftY = phaseShift;
	    }
	  }, {
	    key: 'setDampingRatio',
	    value: function setDampingRatio(dampingRatio) {
	      this.dampingRatio = dampingRatio;
	      return this;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.t = 0;
	      this.path = new Path2D();

	      this._pendulumX = this._pendulumXOrigin + this._deltaX(this.t);
	      this._pendulumY = this._pendulumYOrigin + this._deltaY(this.t);
	    }

	    // Intentionally left blank

	  }, {
	    key: 'clear',
	    value: function clear() {}
	  }, {
	    key: 'tick',
	    value: function tick() {
	      this.t += _constants.TICK_IN_SEC;

	      this._lastPendulumX = this._pendulumX;
	      this._lastPendulumY = this._pendulumY;
	      this._pendulumX = this._pendulumXOrigin + this._deltaX(this.t);
	      this._pendulumY = this._pendulumYOrigin + this._deltaY(this.t);
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.clearCursor();
	      this.drawPen();
	      this.drawCursor();
	    }
	  }, {
	    key: 'drawPen',
	    value: function drawPen() {
	      this.ctx.save();

	      this.ctx.strokeStyle = '#222';
	      this.ctx.lineWidth = 1;
	      this.path.lineTo(this._pendulumX, this._pendulumY);
	      this.ctx.stroke(this.path);

	      this.ctx.restore();
	    }
	  }, {
	    key: 'clearCursor',
	    value: function clearCursor() {
	      this.ctx.clearRect(this._lastPendulumX - 3, this._lastPendulumY - 3, 6, 6);
	    }
	  }, {
	    key: 'drawCursor',
	    value: function drawCursor() {
	      this.ctx.save();
	      this.ctx.beginPath();
	      this.ctx.fillStyle = 'red';
	      this.ctx.arc(this._pendulumX, this._pendulumY, 2, 0, _constants.TWO_PI);
	      this.ctx.fill();
	      this.ctx.restore();
	    }
	  }, {
	    key: '_deltaX',
	    value: function _deltaX(t) {
	      var dx = this.amplitudeX * Math.sin(this.frequencyX * t + this.phaseShiftX);

	      if (this.dampingRatio) {
	        dx *= Math.pow(Math.E, -(this.dampingRatio * t));
	      }

	      return dx;
	    }
	  }, {
	    key: '_deltaY',
	    value: function _deltaY(t) {
	      var dy = this.amplitudeY * Math.sin(this.frequencyY * t + this.phaseShiftY);

	      if (this.dampingRatio) {
	        dy *= Math.pow(Math.E, -(this.dampingRatio * t));
	      }

	      return dy;
	    }
	  }]);

	  return Pendulum2D;
	}();

	exports.default = Pendulum2D;

/***/ }

/******/ });