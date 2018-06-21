(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Pasta"] = factory();
	else
		root["Pasta"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* globals FormData */

var Pasta = function () {
  _createClass(Pasta, null, [{
    key: 'updateCustomInfo',
    value: function updateCustomInfo(more) {
      Pasta.customInfo = Object.assign({}, Pasta.defaultCustomInfo, more);
    }
  }, {
    key: 'customConfig',
    value: function customConfig(opts) {
      var result = {};
      var customInfo = Pasta.customInfo;
      var keys = Object.keys(customInfo);
      keys.forEach(function (key) {
        if (customInfo[key]) {
          result = Object.assign({}, result, _defineProperty({}, key, customInfo[key](opts)));
        }
      });
      return result;
    }
  }]);

  function Pasta() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Pasta);

    var tmpConfig = Object.assign({}, Pasta.config, config);
    Pasta.updateCustomInfo(tmpConfig.customInfo);
    var customInfo = Pasta.customConfig(tmpConfig);

    this.buffer = []; // [{...}, {...}]
    this.config = Object.assign({}, tmpConfig, customInfo);
    this.customInfo = customInfo;
    this.pending = false;
  }

  _createClass(Pasta, [{
    key: 'push',
    value: function push(data) {
      var maxBuff = this.config.maxBuff;

      this.buffer.push(Object.assign({
        time: new Date().getTime() / 1000
      }, data, this.customInfo));
      if (this.buffer.length >= maxBuff && !this.pending) {
        this.send('auto');
      }
    }
  }, {
    key: 'pop',
    value: function pop() {
      var maxBuff = this.config.maxBuff;

      var length = Math.min(this.buffer.length, maxBuff);
      this.buffer.splice(0, length);
      if (this.buffer.length >= maxBuff) {
        this.send('auto');
      }
    }
  }, {
    key: 'send',
    value: function send() {
      var _this = this;

      var isAuto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _config = this.config,
          maxBuff = _config.maxBuff,
          endpoint = _config.endpoint;
      var bufLen = this.buffer.length;

      var length = isAuto ? Math.min(bufLen, maxBuff) : bufLen;
      var data = this.buffer.slice(0, length);
      if (data.length === 0) {
        return false;
      }
      // sending
      this.pending = true;
      var form = new FormData();
      form.append('json', JSON.stringify(data));
      return fetch(endpoint, {
        body: form,
        method: 'POST',
        mode: 'cors'
      }).then(function (res) {
        _this.pending = false;
        if (res.ok) {
          _this.pop();
        }
      }).catch(function () {
        _this.pending = false;
      });
    }
  }]);

  return Pasta;
}();

Pasta.config = {
  maxBuff: 10,
  endpoint: '',
  username: null,
  customInfo: {}
};
Pasta.customInfo = {};
Pasta.defaultCustomInfo = {
  page_path: function page_path() {
    return location.pathname;
  },
  page_title: function page_title() {
    return document.title;
  },
  page_url: function page_url() {
    return location.href;
  },
  referrer: function referrer() {
    return document.referrer;
  },
  user_agent: function user_agent() {
    return navigator.userAgent;
  },
  username: function username(config) {
    return config.username;
  },
  viewport: function viewport() {
    var clientHeight = document.documentElement && document.documentElement.clientHeight;
    var clientWidth = document.documentElement && document.documentElement.clientWidth;
    var innerHeight = window.innerHeight;
    var innerWidth = window.innerWidth;
    var height = clientHeight < innerHeight ? innerHeight : clientHeight;
    var width = clientWidth < innerWidth ? innerWidth : clientWidth;
    return width + 'x' + height;
  }
};
exports.default = Pasta;

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pasta = undefined;

var _pasta = __webpack_require__(0);

var _pasta2 = _interopRequireDefault(_pasta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Pasta = _pasta2.default;

/***/ })

/******/ });
});