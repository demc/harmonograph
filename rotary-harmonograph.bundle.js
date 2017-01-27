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

	var _AbsoluteScene = __webpack_require__(37);

	var _AbsoluteScene2 = _interopRequireDefault(_AbsoluteScene);

	var _Cursor2D = __webpack_require__(38);

	var _Cursor2D2 = _interopRequireDefault(_Cursor2D);

	var _FullScreenScene = __webpack_require__(30);

	var _FullScreenScene2 = _interopRequireDefault(_FullScreenScene);

	var _PendulumDial = __webpack_require__(3);

	var _PendulumDial2 = _interopRequireDefault(_PendulumDial);

	var _RotaryHarmonograph = __webpack_require__(39);

	var _RotaryHarmonograph2 = _interopRequireDefault(_RotaryHarmonograph);

	var _constants = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var content = document.getElementById('content');
	var fullScreenCanvas = document.getElementById('canvas');
	var rotaryCanvas = document.getElementById('rotary');

	setupCanvas(content, fullScreenCanvas, rotaryCanvas);

	function setupCanvas(content, fullScreenCanvas, rotaryCanvas) {
	  var _getVisualizationStat = getVisualizationState(content, fullScreenCanvas, rotaryCanvas),
	      fsScene = _getVisualizationStat.fsScene,
	      rScene = _getVisualizationStat.rScene,
	      pendulumDialX = _getVisualizationStat.pendulumDialX,
	      pendulumDialY = _getVisualizationStat.pendulumDialY,
	      cursor = _getVisualizationStat.cursor,
	      rotaryHarmonograph = _getVisualizationStat.rotaryHarmonograph;

	  setupInputHandlers(fsScene, rScene, pendulumDialX, pendulumDialY, cursor, rotaryHarmonograph);

	  fsScene.start();
	  rScene.start();
	}

	function getVisualizationState(content, fullScreenCanvas, rotaryCanvas) {
	  var fsScene = new _FullScreenScene2.default(content, fullScreenCanvas.getContext('2d'));

	  var screenWidth = fsScene.width;
	  var screenHeight = fsScene.height;

	  var xMidpoint = screenWidth / 2;
	  var yMidpoint = screenHeight / 2;

	  var x = xMidpoint - 150;
	  var y = yMidpoint - 150;

	  var radius = 50;

	  var amplitudeX = 150;
	  var amplitudeY = 150;

	  var width = amplitudeX * 2;
	  var height = amplitudeY * 2;

	  var frequencyX = _constants.HALF_PI;
	  var frequencyY = _constants.HALF_PI;

	  var rScene = new _AbsoluteScene2.default(content, rotaryCanvas.getContext('2d'), x, y, width, height, radius, Math.PI / 2);
	  rScene.setPosition(x, y);

	  var pendulumDialX = new _PendulumDial2.default(fsScene, x, y - 20, width, 10, 'horizontal', amplitudeX - radius, Math.PI / 2);
	  var pendulumDialY = new _PendulumDial2.default(fsScene, x - 20, y, 10, height, 'vertical', amplitudeY - radius, Math.PI / 2, Math.PI);
	  var cursor = new _Cursor2D2.default(fsScene, x, y, width, height, 2, 'red', amplitudeX - radius, amplitudeY - radius, frequencyX, frequencyY, undefined, Math.PI);

	  var rotaryHarmonograph = new _RotaryHarmonograph2.default(rScene, x, y, width, height, function () {
	    var absoluteX = pendulumDialX.getAbsolutePosition();
	    var absoluteY = pendulumDialY.getAbsolutePosition();

	    var relativeX = absoluteX - x;
	    var relativeY = absoluteY - y;

	    var _rScene$getOffsets = rScene.getOffsets(),
	        offsetX = _rScene$getOffsets.x,
	        offsetY = _rScene$getOffsets.y;

	    return { x: relativeX - offsetX, y: relativeY - offsetY };
	  });

	  return {
	    fsScene: fsScene,
	    rScene: rScene,
	    pendulumDialX: pendulumDialX,
	    pendulumDialY: pendulumDialY,
	    cursor: cursor,
	    rotaryHarmonograph: rotaryHarmonograph
	  };
	}

	function setupInputHandlers(fsScene, rScene, pendulumDialX, pendulumDialY, cursor, rotaryHarmonograph) {

	  var pauseButton = document.getElementById('pause');
	  pauseButton.addEventListener('click', function (e) {
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

	  document.getElementById('reset').addEventListener('click', function () {
	    pauseButton.textContent = 'Pause';
	    fsScene.reset();
	    rScene.reset();
	  });

	  var amplitudeXInput = document.getElementById('amplitude-x');
	  var amplitudeYInput = document.getElementById('amplitude-y');
	  var frequencyXInput = document.getElementById('frequency-x');
	  var frequencyYInput = document.getElementById('frequency-y');
	  var phaseShiftXInput = document.getElementById('phase-shift-x');
	  var phaseShiftYInput = document.getElementById('phase-shift-y');
	  var rotaryRadiusInput = document.getElementById('rotary-radius');
	  var dampingInput = document.getElementById('damping');

	  frequencyXInput.addEventListener('input', debounce(createInputHandler(frequencyXInput, [pendulumDialX], 'setFrequency', Math.PI), 100));

	  frequencyXInput.addEventListener('input', debounce(createInputHandler(frequencyXInput, [cursor], 'setFrequencyX', Math.PI), 100));

	  frequencyYInput.addEventListener('input', debounce(createInputHandler(frequencyYInput, [pendulumDialY], 'setFrequency', Math.PI), 100));

	  frequencyYInput.addEventListener('input', debounce(createInputHandler(frequencyYInput, [cursor], 'setFrequencyY', Math.PI), 100));

	  phaseShiftXInput.addEventListener('input', debounce(createInputHandler(phaseShiftXInput, [pendulumDialX], 'setPhaseShift', Math.PI), 100));

	  phaseShiftXInput.addEventListener('input', debounce(createInputHandler(phaseShiftXInput, [cursor], 'setPhaseShiftX', Math.PI), 100));

	  phaseShiftYInput.addEventListener('input', debounce(createInputHandler(phaseShiftYInput, [pendulumDialY], 'setPhaseShift', Math.PI), 100));

	  phaseShiftYInput.addEventListener('input', debounce(createInputHandler(phaseShiftYInput, [cursor], 'setPhaseShiftY', Math.PI), 100));

	  amplitudeXInput.addEventListener('input', debounce(createInputHandler(amplitudeXInput, [pendulumDialX], 'setAmplitude'), 100));

	  amplitudeXInput.addEventListener('input', debounce(createInputHandler(amplitudeXInput, [cursor], 'setAmplitudeX'), 100));

	  amplitudeYInput.addEventListener('input', debounce(createInputHandler(amplitudeYInput, [pendulumDialY], 'setAmplitude'), 100));

	  amplitudeYInput.addEventListener('input', debounce(createInputHandler(amplitudeYInput, [cursor], 'setAmplitudeY'), 100));

	  rotaryRadiusInput.addEventListener('input', debounce(createInputHandler(rotaryRadiusInput, [rScene, cursor], 'setRadius'), 100));

	  dampingInput.addEventListener('input', debounce(createInputHandler(dampingInput, [rScene, cursor, pendulumDialX, pendulumDialY], 'setDampingRatio'), 100));

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

	        fsScene.reset();
	        rScene.reset();
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

/***/ 37:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _Scene2 = __webpack_require__(32);

	var _Scene3 = _interopRequireDefault(_Scene2);

	var _constants = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AbsoluteScene = function (_Scene) {
	  _inherits(AbsoluteScene, _Scene);

	  function AbsoluteScene(container, ctx, x, y, width, height, radius, frequency, phaseShift) {
	    _classCallCheck(this, AbsoluteScene);

	    var _this = _possibleConstructorReturn(this, (AbsoluteScene.__proto__ || Object.getPrototypeOf(AbsoluteScene)).call(this, container, ctx));

	    _this.canvas = ctx.canvas;
	    _this.x = x;
	    _this.y = y;
	    _this.width = width;
	    _this.height = height;

	    _this.radius = radius;
	    _this.frequency = frequency || 2 * Math.PI;
	    _this.phaseShift = phaseShift || Math.PI / 2;

	    _this.dampingRatio = 0;
	    _this.t = 0;

	    var _this$_delta = _this._delta(_this.t),
	        offsetX = _this$_delta.x,
	        offsetY = _this$_delta.y;

	    _this._offsetX = offsetX;
	    _this._offsetY = offsetY;
	    return _this;
	  }

	  _createClass(AbsoluteScene, [{
	    key: 'setPosition',
	    value: function setPosition(x, y) {
	      this.canvas.style.left = x + 'px';
	      this.canvas.style.top = y + 'px';

	      return this;
	    }
	  }, {
	    key: 'setRadius',
	    value: function setRadius(radius) {
	      this.radius = radius;
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
	    value: function clear() {}
	  }, {
	    key: 'reset',
	    value: function reset() {
	      _get(AbsoluteScene.prototype.__proto__ || Object.getPrototypeOf(AbsoluteScene.prototype), 'reset', this).call(this);
	      this.t = 0;

	      var _delta2 = this._delta(this.t),
	          offsetX = _delta2.x,
	          offsetY = _delta2.y;

	      this._offsetX = offsetX;
	      this._offsetY = offsetY;
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      _get(AbsoluteScene.prototype.__proto__ || Object.getPrototypeOf(AbsoluteScene.prototype), 'draw', this).call(this);
	      this.t += _constants.TICK_IN_SEC;

	      var _delta3 = this._delta(this.t),
	          x = _delta3.x,
	          y = _delta3.y;

	      this._offsetX = x;
	      this._offsetY = y;
	      this.setPosition(this.x + x, this.y + y);
	    }
	  }, {
	    key: 'getOffsets',
	    value: function getOffsets() {
	      return {
	        x: this._offsetX,
	        y: this._offsetY
	      };
	    }
	  }, {
	    key: '_delta',
	    value: function _delta(t) {
	      var x = this.radius * Math.cos(this.frequency * t + this.phaseShift);
	      var y = this.radius * Math.sin(this.frequency * t + this.phaseShift);

	      if (this.dampingRatio) {
	        var e = Math.pow(Math.E, -(this.dampingRatio * t));
	        x *= e;
	        y *= e;
	      }

	      return {
	        x: x,
	        y: y
	      };
	    }
	  }]);

	  return AbsoluteScene;
	}(_Scene3.default);

	exports.default = AbsoluteScene;

/***/ },

/***/ 38:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Cursor2D = function () {
	  function Cursor2D(scene, x, y, width, height, radius, color, amplitudeX, amplitudeY, frequencyX, frequencyY, phaseShiftX, phaseShiftY) {
	    _classCallCheck(this, Cursor2D);

	    this.scene = scene;
	    this.ctx = scene.ctx;
	    this.x = x;
	    this.y = y;
	    this.width = width;
	    this.height = height;

	    this.amplitudeX = amplitudeX;
	    this.amplitudeY = amplitudeY;
	    this.frequencyX = frequencyX || _constants.TWO_PI;
	    this.frequencyY = frequencyY || _constants.TWO_PI;
	    this.phaseShiftX = phaseShiftX || _constants.HALF_PI;
	    this.phaseShiftY = phaseShiftY || _constants.HALF_PI;
	    this.dampingRatio = 0;

	    this.radius = radius || 2;
	    this.color = color || 'red';

	    this._xOrigin = this.x + this.width / 2;
	    this._yOrigin = this.y + this.width / 2;

	    this.t = 0;

	    scene.addObject(this);
	  }

	  _createClass(Cursor2D, [{
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
	    key: 'setRadius',
	    value: function setRadius(radius) {
	      this.radius = radius;
	      return this;
	    }
	  }, {
	    key: 'setDampingRatio',
	    value: function setDampingRatio(dampingRatio) {
	      this.dampingRatio = dampingRatio;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.t = 0;
	      this._pendulumX = 0;
	      this._pendulumY = 0;
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.ctx.clearRect(this._prevPendulumX - this.radius * 2, this._prevPendulumY - this.radius * 2, this.radius * 4, this.radius * 4);
	    }
	  }, {
	    key: 'tick',
	    value: function tick() {
	      this.t += _constants.TICK_IN_SEC;

	      var _delta2 = this._delta(this.t),
	          x = _delta2.x,
	          y = _delta2.y;

	      this._prevPendulumX = this._pendulumX;
	      this._prevPendulumY = this._pendulumY;
	      this._pendulumX = this._xOrigin + x;
	      this._pendulumY = this._yOrigin + y;
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.ctx.save();
	      this.ctx.beginPath();
	      this.ctx.fillStyle = 'red';
	      this.ctx.arc(this._pendulumX, this._pendulumY, 2, 0, _constants.TWO_PI);
	      this.ctx.fill();
	      this.ctx.restore();
	    }
	  }, {
	    key: '_delta',
	    value: function _delta(t) {
	      var x = this.amplitudeX * Math.sin(this.frequencyX * this.t + this.phaseShiftX);
	      var y = this.amplitudeY * Math.sin(this.frequencyY * this.t + this.phaseShiftY);

	      if (this.dampingRatio) {
	        var e = Math.pow(Math.E, -(this.dampingRatio * t));
	        x *= e;
	        y *= e;
	      }

	      return {
	        x: x,
	        y: y
	      };
	    }
	  }]);

	  return Cursor2D;
	}();

	exports.default = Cursor2D;

/***/ },

/***/ 39:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RotaryHarmonograph = function () {
		function RotaryHarmonograph(scene, x, y, width, height, callback) {
			_classCallCheck(this, RotaryHarmonograph);

			this.scene = scene;
			this.ctx = scene.ctx;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.dampingRatio = 0;

			this.callback = callback;

			this.path = new Path2D();

			scene.addObject(this);
		}

		_createClass(RotaryHarmonograph, [{
			key: 'setDampingRatio',
			value: function setDampingRatio(dampingRatio) {
				this.dampingRatio = dampingRatio;
				return this;
			}
		}, {
			key: 'clear',
			value: function clear() {}
		}, {
			key: 'reset',
			value: function reset() {
				this.path = new Path2D();
				this.ctx.clearRect(this.x, this.y, this.width, this.height);
			}
		}, {
			key: 'tick',
			value: function tick() {
				var _callback = this.callback(),
				    x = _callback.x,
				    y = _callback.y;

				this.path.lineTo(x, y);
			}
		}, {
			key: 'draw',
			value: function draw() {
				this.ctx.save();
				this.ctx.strokeStyle = '#000';
				this.ctx.lineWidth = 0.1;
				this.ctx.stroke(this.path);
				this.ctx.restore();
			}
		}]);

		return RotaryHarmonograph;
	}();

	exports.default = RotaryHarmonograph;

/***/ }

/******/ });