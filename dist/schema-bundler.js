(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("schemaBundler", [], factory);
	else if(typeof exports === 'object')
		exports["schemaBundler"] = factory();
	else
		root["schemaBundler"] = factory();
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Schema", function() { return Schema; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__deep__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__url__ = __webpack_require__(2);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Schema = function () {
    function Schema(url, progress, yamlParse, httpGet) {
        _classCallCheck(this, Schema);

        this.cache = {};
        this.totalFiles = 0;
        this.loadedFiles = 0;
        // private DEFINITIONS: string = '$def';
        this.DEFINITIONS = 'definitions';
        this.url = url;
        this.progress = progress;
        this.parsedUrl = new __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */](this.url);
        this.yamlParse = yamlParse || YAML.parse;
        this.httpGet = httpGet || axios.get;
    }

    _createClass(Schema, [{
        key: 'load',
        value: function load() {
            return this.loadFile(this.url);
        }
    }, {
        key: 'bundle',
        value: function bundle() {
            this.bundled = Object(__WEBPACK_IMPORTED_MODULE_0__deep__["a" /* default */])(this.cache[this.url]);
            this.refs = this.bundlePart(this.bundled, this.url);
            this.refs = Object.keys(this.cache).length === 1 ? this.refs : this.getRefs(this.bundled);
            this.simplifyRefs(this.refs);
        }
    }, {
        key: 'deref',
        value: function deref() {
            var _this = this;

            var direct = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var refs = this.refs;
            var cache = {};
            if (direct) {
                refs.forEach(function (ref) {
                    cache[ref.val.$ref] = cache[ref.val.$ref] || _this.getObjectByPath(_this.bundled, ref.val.$ref, false);
                });
                refs.forEach(function (ref) {
                    if (typeof cache[ref.val.$ref].val !== 'undefined') {
                        ref.owner[ref.key] = cache[ref.val.$ref].val;
                    }
                });
                var parents = {};
                var leftovers = refs.filter(function (ref) {
                    return ref.val === ref.owner[ref.key];
                });
                leftovers.forEach(function (ref) {
                    leftovers[ref.val.$ref] = leftovers[ref.val.$ref] || _this.getObjectByPath(_this.bundled, ref.val.$ref, false);
                });
                Object.keys(cache).forEach(function (k) {
                    var s = k.split('/');
                    s.pop();
                    var p = s.join('/');
                    parents[p] = true;
                    if (!cache[p] && !leftovers[k]) {
                        var o = cache[k];
                        delete o.owner[o.key];
                    }
                });
                Object.keys(parents).forEach(function (k) {
                    var o = _this.getObjectByPath(_this.bundled, k, false);
                    if (o.val && Object.keys(o.val).length === 0) {
                        delete o.owner[o.key];
                    }
                });
                var original = this.cache[this.url];
                for (var key in this.bundled) {
                    if (!original.hasOwnProperty(key)) {
                        delete this.bundled[key];
                    }
                }
            } else {
                refs.forEach(function (ref) {
                    ref.val.$deref = ref.val.$deref || _this.getObjectByPath(_this.bundled, ref.val.$ref).val;
                });
            }
        }
    }, {
        key: 'bundledPath',
        value: function bundledPath(relativePart, hash) {
            var path = '#' + (relativePart ? '/' + relativePart : '') + (hash ? hash : '');
            var s = path.split('/');
            if (s[1] !== this.DEFINITIONS && !this.bundled[s[1]]) {
                s.splice(1, 0, this.DEFINITIONS);
            }
            return s.join('/');
        }
    }, {
        key: 'getRefs',
        value: function getRefs(obj) {
            var refs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            var owner = arguments[3];
            var key = arguments[4];

            if (obj && obj.$ref) {
                refs.push({ val: obj, owner: owner, key: key });
            }
            for (var i = 0, keys = Object.keys(obj); i < keys.length; i++) {
                var k = keys[i];
                if (obj[k] && _typeof(obj[k]) === 'object' && index.indexOf(obj[k]) === -1) {
                    index.push(obj[k]);
                    this.getRefs(obj[k], refs, index, obj, k);
                }
            }
            return refs;
        }
    }, {
        key: 'getUrls',
        value: function getUrls(refs, parsedBase) {
            var _this2 = this;

            var urls = {};
            refs.forEach(function (ref) {
                var parsedUrl = new __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */](ref.val.$ref);
                var url = Schema.getUrl(parsedBase, parsedUrl);
                if (!_this2.cache[url] && !urls[url] && parsedUrl.path) {
                    urls[url] = true;
                }
            });
            return Object.keys(urls);
        }
    }, {
        key: 'parseFile',
        value: function parseFile(json, url) {
            var _this3 = this;

            var refs = this.getRefs(json);
            var parsedUrl = new __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */](url);
            var urls = this.getUrls(refs, parsedUrl);
            var promises = [];
            urls.forEach(function (u) {
                promises.push(_this3.loadFile(u));
            });
            return Promise.all(promises);
        }
    }, {
        key: 'report',
        value: function report() {
            if (this.progress) {
                this.progress({ total: this.totalFiles, loaded: this.loadedFiles });
            }
        }
    }, {
        key: 'loadFile',
        value: function loadFile(url) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                if (_this4.cache[url]) {
                    _this4.parseFile(_this4.cache[url], url).then(resolve);
                } else {
                    _this4.cache[url] = true;
                    _this4.totalFiles++;
                    _this4.report();
                    _this4.httpGet(url).then(function (res) {
                        _this4.loadedFiles++;
                        _this4.report();
                        if (typeof res.data === 'string' && (res.headers && res.headers['content-type'] && res.headers['content-type'].indexOf('yaml') > -1 || __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */].extension(url).toLowerCase() === 'yaml')) {
                            try {
                                res.data = _this4.yamlParse(res.data);
                            } catch (ign) {
                                // Invalid YAML as text...?
                            }
                        }
                        _this4.cache[url] = res.data;
                        _this4.parseFile(_this4.cache[url], url).then(resolve);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
            });
        }
    }, {
        key: 'getObjectByPath',
        value: function getObjectByPath(root, path) {
            var create = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var parts = (path || '').split('/');
            parts.shift();
            var o = root;
            var key = null;
            var owner = null;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var part = _step.value;

                    if (o) {
                        key = decodeURIComponent(part);
                        o[key] = typeof o[key] !== 'undefined' ? o[key] : create ? {} : undefined;
                        owner = o;
                        o = o[key];
                    } else {
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return { val: o, owner: owner, key: key };
        }
    }, {
        key: 'getObjectByUrl',
        value: function getObjectByUrl(parsedBase, parsedUrl) {
            var url = Schema.getUrl(parsedBase, parsedUrl);
            return this.getObjectByPath(this.cache[url], parsedUrl.hash);
        }
    }, {
        key: 'bundlePart',
        value: function bundlePart(item, url) {
            var _this5 = this;

            var refs = this.getRefs(item);
            var selfUrl = new __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */](url);
            var bundle = [];
            refs.forEach(function (ref) {
                var parsedUrl = new __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */](ref.val.$ref);
                var partUrl = Schema.getUrl(selfUrl, parsedUrl);
                var relativePart = __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */].relative(_this5.url, partUrl);
                var path = _this5.bundledPath(relativePart, parsedUrl.hash);
                var t = _this5.getObjectByUrl(selfUrl, parsedUrl);
                if (t.val && _typeof(t.val) === 'object' && Object.keys(t.val).length) {
                    var o = _this5.getObjectByPath(_this5.bundled, path);
                    if (Schema.isRef(o.val) && (!o.val.$ref || o.val.$ref !== t.val.$ref)) {
                        if (t.val.$ref) {
                            o.val.$ref = t.val.$ref;
                        } else {
                            Object.assign(o.val, Object(__WEBPACK_IMPORTED_MODULE_0__deep__["a" /* default */])(t.val));
                        }
                        ref.val.$ref = path;
                        bundle.push([o.val, partUrl]);
                    }
                } else if (!t.val || _typeof(t.val) !== 'object') {
                    var _o = _this5.getObjectByPath(_this5.bundled, path);
                    _o.owner[_o.key] = t.val;
                }
                ref.val.$ref = path;
            });
            bundle.forEach(function (d) {
                return _this5.bundlePart(d[0], d[1]);
            });
            return refs;
        }
    }, {
        key: 'followRef',
        value: function followRef(url) {
            var parts = url.split('/');
            parts.shift();
            var o = this.bundled;
            var included = [];
            for (var i = 0; i < parts.length; i++) {
                o = o[decodeURIComponent(parts[i])];
                var next = o && i + 1 < parts.length ? o[decodeURIComponent(parts[i + 1])] : null;
                if (!next && o && o.$ref && o.$ref !== url) {
                    if (included.indexOf(o) > -1) {
                        break;
                    }
                    included.push(o);
                    var rest = parts.slice(i + 1);
                    rest.unshift(o.$ref);
                    parts = rest.join('/').split('/');
                    parts.shift();
                    i = 0;
                    o = this.bundled;
                    o = o[decodeURIComponent(parts[i])];
                } else if (!o) {
                    break;
                }
            }
            parts.unshift('#');
            return parts.join('/');
        }
    }, {
        key: 'simplifyRefs',
        value: function simplifyRefs(refs) {
            var _this6 = this;

            refs.forEach(function (ref) {
                ref.val.$ref = _this6.followRef(ref.val.$ref);
            });
        }
    }], [{
        key: 'getUrl',
        value: function getUrl(parsedBase, parsedUrl) {
            return __WEBPACK_IMPORTED_MODULE_1__url__["a" /* default */].join(parsedBase.base, parsedUrl.path || parsedBase.file);
        }
    }, {
        key: 'isRef',
        value: function isRef(obj) {
            return Object.keys(obj).length - (obj.$ref ? 1 : 0) === 0;
        }
    }]);

    return Schema;
}();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = deep;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function deep(obj) {
    if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return obj;
    }
    var temp = obj.constructor();
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = deep(obj[key]);
        }
    }
    return temp;
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Url = function () {
    _createClass(Url, null, [{
        key: 'join',
        value: function join(base, file) {
            var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            return Url.resolve(base + '/' + file) + (hash ? '#' + hash : '');
        }
    }, {
        key: 'relative',
        value: function relative(u1, u2) {
            var s1 = u1.split('/');
            var s2 = u2.split('/');
            while (s2[0] !== undefined && s1.shift() === s2[0]) {
                s2.shift();
            }
            return s2.join('/');
        }
    }, {
        key: 'extension',
        value: function extension(url) {
            var s = url.split('.');
            return s[s.length - 1];
        }
    }, {
        key: 'resolve',
        value: function resolve(url) {
            var path = url.split('/');
            // from https://github.com/defunctzombie/node-url
            var up = 0;
            for (var i = path.length; i > 0; i--) {
                var last = path[i];
                if (last === '.') {
                    path.splice(i, 1);
                } else if (last === '..') {
                    path.splice(i, 1);
                    up++;
                } else if (up) {
                    path.splice(i, 1);
                    up--;
                }
            }
            return path.join('/');
        }
    }]);

    function Url(url) {
        _classCallCheck(this, Url);

        this.url = url.replace(/ /g, '%20');
        var hashSplit = this.url.split('#');
        this.path = hashSplit[0];
        this.hash = hashSplit[1];
        var pathSplit = this.path.split('/');
        this.file = pathSplit.pop();
        this.base = pathSplit.join('/');
        this.isRelative = pathSplit[1] === '' && pathSplit[0][pathSplit[0].length - 1] === ':';
    }

    return Url;
}();

/* harmony default export */ __webpack_exports__["a"] = (Url);

/***/ })
/******/ ]);
});