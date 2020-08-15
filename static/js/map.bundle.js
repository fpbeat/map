
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var yaMapRoute = (function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  var StringUtil = {
    trim: function trim(string) {
      return String(string).replace(/^\s+|\s+$/g, '');
    },
    test: function test(string, regexp) {
      return regexp.test(this.trim(string));
    },
    isEmpty: function isEmpty(string) {
      return ['false', 'null', '', 'undefined', 'NaN'].includes(this.trim(string));
    },
    substitute: function substitute(string, object, regexp) {
      return String(string).replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
        if (match.charAt(0) === '\\') return match.slice(1);
        return object[name] !== null ? object[name] : '';
      });
    },
    lcFirst: function lcFirst(string) {
      var first = string.charAt(0).toLowerCase();
      return first + string.substr(1, string.length - 1);
    },
    toCamelCase: function toCamelCase(string) {
      return String(string).replace(/-\D/g, function (match) {
        return match.charAt(1).toUpperCase();
      });
    },
    sanitize: function sanitize(string) {
      return String(string).replace(/[^a-z0-9]/gi, '').toLowerCase();
    },
    hyphenate: function hyphenate(string) {
      return this.lcFirst(String(string)).replace(/[A-Z]/g, function (match) {
        return '-' + match.charAt(0).toLowerCase();
      });
    },
    uuid: function uuid() {
      return Math.random().toString(36).substring(2);
    }
  };

  var hasOwn = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;
  var defineProperty = Object.defineProperty;
  var gOPD = Object.getOwnPropertyDescriptor;

  var isArray = function isArray(arr) {
  	if (typeof Array.isArray === 'function') {
  		return Array.isArray(arr);
  	}

  	return toStr.call(arr) === '[object Array]';
  };

  var isPlainObject = function isPlainObject(obj) {
  	if (!obj || toStr.call(obj) !== '[object Object]') {
  		return false;
  	}

  	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
  	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  	// Not own constructor property must be Object
  	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
  		return false;
  	}

  	// Own properties are enumerated firstly, so to speed up,
  	// if last one is own, then all properties are own.
  	var key;
  	for (key in obj) { /**/ }

  	return typeof key === 'undefined' || hasOwn.call(obj, key);
  };

  // If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
  var setProperty = function setProperty(target, options) {
  	if (defineProperty && options.name === '__proto__') {
  		defineProperty(target, options.name, {
  			enumerable: true,
  			configurable: true,
  			value: options.newValue,
  			writable: true
  		});
  	} else {
  		target[options.name] = options.newValue;
  	}
  };

  // Return undefined instead of __proto__ if '__proto__' is not an own property
  var getProperty = function getProperty(obj, name) {
  	if (name === '__proto__') {
  		if (!hasOwn.call(obj, name)) {
  			return void 0;
  		} else if (gOPD) {
  			// In early versions of node, obj['__proto__'] is buggy when obj has
  			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
  			return gOPD(obj, name).value;
  		}
  	}

  	return obj[name];
  };

  var extend = function extend() {
  	var options, name, src, copy, copyIsArray, clone;
  	var target = arguments[0];
  	var i = 1;
  	var length = arguments.length;
  	var deep = false;

  	// Handle a deep copy situation
  	if (typeof target === 'boolean') {
  		deep = target;
  		target = arguments[1] || {};
  		// skip the boolean and the target
  		i = 2;
  	}
  	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
  		target = {};
  	}

  	for (; i < length; ++i) {
  		options = arguments[i];
  		// Only deal with non-null/undefined values
  		if (options != null) {
  			// Extend the base object
  			for (name in options) {
  				src = getProperty(target, name);
  				copy = getProperty(options, name);

  				// Prevent never-ending loop
  				if (target !== copy) {
  					// Recurse if we're merging plain objects or arrays
  					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
  						if (copyIsArray) {
  							copyIsArray = false;
  							clone = src && isArray(src) ? src : [];
  						} else {
  							clone = src && isPlainObject(src) ? src : {};
  						}

  						// Never move original objects, clone them
  						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

  					// Don't bring in undefined values
  					} else if (typeof copy !== 'undefined') {
  						setProperty(target, { name: name, newValue: copy });
  					}
  				}
  			}
  		}
  	}

  	// Return the modified object
  	return target;
  };

  var ObjectUtil = {
    getPath: function getPath(obj, path, def) {
      if (def === void 0) {
        def = null;
      }

      var pathArray = StringUtil.stringToPath(path);
      var current = obj;

      for (var i = 0; i < pathArray.length; i++) {
        if (!current[pathArray[i]]) {
          return def;
        }

        current = current[pathArray[i]];
      }

      return current;
    },
    pick: function pick(keys, obj) {
      return keys.reduce(function (a, c) {
        var _extends2;

        return _extends({}, a, (_extends2 = {}, _extends2[c] = obj[c], _extends2));
      }, {});
    },
    merge: function merge() {
      return extend.apply(void 0, arguments);
    },
    map: function map(object, fn) {
      return Object.keys(object).reduce(function (result, key) {
        result[key] = fn(object[key]);
        return result;
      }, {});
    },
    toQueryString: function toQueryString(object, base) {
      var _this = this;

      var queryString = [];
      Object.keys(object).forEach(function (key) {
        var value = object[key],
            result;

        if (base) {
          key = base + '[' + key + ']';
        }

        switch (GenericUtil.getType(value)) {
          case 'object':
            result = _this.toQueryString(value, key);
            break;

          case 'array':
            var qs = {};
            value.forEach(function (val, i) {
              qs[i] = val;
            });
            result = _this.toQueryString(qs, key);
            break;

          default:
            result = key + '=' + encodeURIComponent(value);
        }

        if (value !== null) {
          queryString.push(result);
        }
      });
      return queryString.join('&');
    }
  };

  var GenericUtil = {
    getType: function getType(obj) {
      if (typeof obj === 'undefined' && obj === void 0) {
        return void 0;
      }

      if (obj === null) {
        return null;
      }

      if (!!(obj && obj.nodeType === 1)) {
        return 'element';
      }

      return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
    },
    isEmpty: function isEmpty(obj) {
      return this.getType(obj) === null || this.getType(obj) === void 0;
    },
    isIterable: function isIterable(obj) {
      if (this.isEmpty(obj)) {
        return false;
      }

      return typeof obj[Symbol.iterator] === 'function';
    },
    setOptions: function setOptions(instance, options) {
      if (!this.isEmpty(options)) {
        for (var _i = 0, _Object$keys = Object.keys(options); _i < _Object$keys.length; _i++) {
          var option = _Object$keys[_i];

          if (/^on/.test(option) && this.getType(instance.on) === 'function') {
            instance.on(StringUtil.lcFirst(option.substr(2)), options[option].bind(instance));
          }
        }

        ObjectUtil.merge(true, instance.options || {}, options);
      }
    }
  };

  var ElementUtil = {
    inject: function inject(el, element, where) {
      if (where === void 0) {
        where = 'bottom';
      }

      var appendInserters = {
        before: 'beforeBegin',
        after: 'afterEnd',
        bottom: 'beforeEnd',
        top: 'afterBegin'
      };
      GenericUtil.getType(element) === 'element' ? el.insertAdjacentElement(appendInserters[where], element) : el.insertAdjacentHTML(appendInserters[where], element);
      return element;
    },
    create: function create(name, options) {
      if (options === void 0) {
        options = {};
      }

      var element = document.createElement(name.toLowerCase());
      this.set(element, options);
      return element;
    },
    createAndInject: function createAndInject(name, options, inject, where) {
      if (options === void 0) {
        options = {};
      }

      if (where === void 0) {
        where = 'bottom';
      }

      return this.inject(inject, this.create(name, options), where);
    },
    getDataAttributes: function getDataAttributes(element) {
      var response = {};

      if (GenericUtil.getType(element) === 'element' && GenericUtil.isIterable(element.attributes)) {
        for (var _iterator = _createForOfIteratorHelperLoose(element.attributes), _step; !(_step = _iterator()).done;) {
          var attribute = _step.value;
          var components = String(attribute.nodeName).match(new RegExp("^data-(.*)", 'i'));

          if (!GenericUtil.isEmpty(components)) {
            response[StringUtil.toCamelCase(components[1])] = String(attribute.nodeValue);
          }
        }
      }

      return response;
    },
    getDataAttribute: function getDataAttribute(element, name, def) {
      if (def === void 0) {
        def = null;
      }

      var attributes = this.getDataAttributes(element);
      return name !== null ? attributes[name] || def : attributes;
    },
    set: function set(element) {
      var _ref;

      var params = (arguments.length <= 1 ? 0 : arguments.length - 1) === 2 ? (_ref = {}, _ref[arguments.length <= 1 ? undefined : arguments[1]] = arguments.length <= 2 ? undefined : arguments[2], _ref) : arguments.length <= 1 ? undefined : arguments[1];

      for (var _i = 0, _Object$keys = Object.keys(params); _i < _Object$keys.length; _i++) {
        var param = _Object$keys[_i];

        switch (param) {
          case 'html':
            element.innerHTML = params[param];
            break;

          case 'text':
            if (['input', 'button', 'checkbox'].includes(element.tagName.toLowerCase())) {
              element.value = params[param];
            } else {
              element.innerText = params[param];
            }

            break;

          case 'class':
            params[param].split(' ').forEach(function (name) {
              var classTest = String(name).match(/^(\!)?(.*)/);

              if (StringUtil.trim(name) !== '' && classTest) {
                element.classList[classTest[1] === '!' ? 'remove' : 'add'].call(element.classList, classTest[2]);
              }
            });
            break;

          case 'events':
            Object.entries(params[param]).forEach(function (params) {
              return element.addEventListener.apply(element, params);
            });
            break;

          case 'styles':
            for (var _i2 = 0, _Object$entries = Object.entries(params[param]); _i2 < _Object$entries.length; _i2++) {
              var _Object$entries$_i = _Object$entries[_i2],
                  name = _Object$entries$_i[0],
                  style = _Object$entries$_i[1];
              element.style[name] = style;
            }

            break;

          default:
            var hyphenatedParam = StringUtil.hyphenate(param);

            if (/^data\-/.test(hyphenatedParam) && params[param] === null) {
              element.removeAttribute(hyphenatedParam);
            } else {
              element.setAttribute(hyphenatedParam, params[param]);
            }

        }
      }

      return element;
    },
    destroy: function destroy(element) {
      this.empty(element);
      this.dispose(element);
    },
    empty: function empty(element) {
      Array.from(element.childNodes).forEach(this.dispose);
    },
    dispose: function dispose(element) {
      return element.parentNode ? element.parentNode.removeChild(element) : element;
    }
  };

  var GeoUtil = {
    parseCoords: function parseCoords(coordinates) {
      var parts = String(coordinates).split(',');

      if (parts.length === 2) {
        return parts.map(parseFloat);
      }

      return [];
    }
  };

  var domain;

  // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).
  function EventHandlers() {}
  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  // nodejs oddity
  // require('events') === require('events').EventEmitter
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.usingDomains = false;

  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function() {
    this.domain = null;
    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active ) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.
  function emitNone(handler, isFn, self) {
    if (isFn)
      handler.call(self);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self);
    }
  }
  function emitOne(handler, isFn, self, arg1) {
    if (isFn)
      handler.call(self, arg1);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1);
    }
  }
  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn)
      handler.call(self, arg1, arg2);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2);
    }
  }
  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn)
      handler.call(self, arg1, arg2, arg3);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn)
      handler.apply(self, args);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = (type === 'error');

    events = this._events;
    if (events)
      doError = (doError && events.error == null);
    else if (!doError)
      return false;

    domain = this.domain;

    // If there is no 'error' event listener then throw.
    if (doError) {
      er = arguments[1];
      if (domain) {
        if (!er)
          er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
      return false;
    }

    handler = events[type];

    if (!handler)
      return false;

    var isFn = typeof handler === 'function';
    len = arguments.length;
    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;
      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;
      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;
      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower
      default:
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');

    events = target._events;
    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] :
                                            [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      // Check for listener leak
      if (!existing.warned) {
        m = $getMaxListeners(target);
        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + type + ' listeners added. ' +
                              'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }
  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function _onceWrap(target, type, listener) {
    var fired = false;
    function g() {
      target.removeListener(type, g);
      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }
    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || (list.listener && list.listener === listener)) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length; i-- > 0;) {
            if (list[i] === listener ||
                (list[i].listener && list[i].listener === listener)) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list[0] = undefined;
            if (--this._eventsCount === 0) {
              this._events = new EventHandlers();
              return this;
            } else {
              delete events[type];
            }
          } else {
            spliceOne(list, position);
          }

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };

  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = new EventHandlers();
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          for (var i = 0, key; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = new EventHandlers();
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          do {
            this.removeListener(type, listeners[listeners.length - 1]);
          } while (listeners[0]);
        }

        return this;
      };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;

    if (!events)
      ret = [];
    else {
      evlistener = events[type];
      if (!evlistener)
        ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else
        ret = unwrapListeners(evlistener);
    }

    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  // About 1.5x faster than the two-arg version of Array#splice().
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);
    while (i--)
      copy[i] = arr[i];
    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  var _default = /*#__PURE__*/function (_EventEmitter) {
    _inheritsLoose(_default, _EventEmitter);

    function _default() {
      return _EventEmitter.apply(this, arguments) || this;
    }

    var _proto = _default.prototype;

    _proto.getCenter = function getCenter() {
      return GeoUtil.parseCoords(this.options.map.center);
    };

    _proto.getZoom = function getZoom() {
      return parseInt(this.options.map.zoom, 10);
    };

    _proto.getType = function getType() {
      return String(this.options.map.type);
    };

    _proto.getControls = function getControls() {
      return this.options.map.controls;
    };

    _proto.getMap = function getMap() {
      var map = new ymaps.Map(this.container, {
        center: this.getCenter(),
        zoom: this.getZoom(),
        type: this.getType(),
        controls: this.getControls()
      });
      this.attachMapControls(map);
      return map;
    };

    _proto.attachMapControls = function attachMapControls(map) {
      map.controls.add('routePanelControl').add('zoomControl', {
        size: 'small',
        position: {
          right: 10,
          bottom: 40
        }
      }).add('typeSelector', {
        panoramasItemMode: 'off'
      });
      map.controls.get('routePanelControl').routePanel.options.set(this.options.panel);
    };

    _proto.createMarker = function createMarker(param) {
      var marker = new ymaps.Placemark(this.map.getCenter(), {
        balloonContent: param.content,
        iconCaption: param.caption
      }, {
        hideIconOnBalloonOpen: false,
        iconOffset: [0, 20],
        preset: param.preset,
        visible: false
      });
      this.map.geoObjects.add(marker);
      return marker;
    };

    return _default;
  }(EventEmitter);

  var _default$1 = /*#__PURE__*/function (_EventEmitter) {
    _inheritsLoose(_default, _EventEmitter);

    function _default(options) {
      var _this;

      if (options === void 0) {
        options = {};
      }

      _this = _EventEmitter.call(this) || this;

      _defineProperty(_assertThisInitialized(_this), "options", {
        version: '2.1.77',
        apiKey: 'c0bf728c-baeb-4404-884a-55e2c1790c53',
        language: 'ru_RU',
        endPoint: '//api-maps.yandex.ru/{version}/?apikey={key}&lang={lang}&onload={callback}'
      });

      GenericUtil.setOptions(_assertThisInitialized(_this), options);

      _this.bootstrap();

      return _this;
    }

    var _proto = _default.prototype;

    _proto.bootstrap = function bootstrap() {
      this.load();
    };

    _proto.formatEndpoint = function formatEndpoint() {
      return StringUtil.substitute(this.options.endPoint, {
        version: this.options.version,
        key: this.options.apiKey,
        lang: this.options.language,
        callback: this.createCallback()
      });
    };

    _proto.load = function load() {
      var injector = document.head || document.body || document.lastChild;
      ElementUtil.createAndInject('script', {
        type: 'text/javascript',
        src: this.formatEndpoint()
      }, injector);
    };

    _proto.createCallback = function createCallback() {
      var funcName = 'yamap_' + StringUtil.uuid();
      window[funcName] = this.emit.bind(this, 'loaded');
      return funcName;
    };

    _proto.getVersion = function getVersion() {
      return this.options.version.replace(/[^\d]/g, '-');
    };

    return _default;
  }(EventEmitter);

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var dayjs_min = createCommonjsModule(function (module, exports) {
  !function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",f="date",h=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,c=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,d=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},$={s:d,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+d(r,2,"0")+":"+d(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.add(r,u),s=n-i<0,a=e.add(r+(s?-1:1),u);return +(-(r+(n-i)/(s?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:i,D:f,h:r,m:n,s:e,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},l={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},y="en",M={};M[y]=l;var m=function(t){return t instanceof S},D=function(t,e,n){var r;if(!t)return y;if("string"==typeof t)M[t]&&(r=t),e&&(M[t]=e,r=t);else {var i=t.name;M[i]=t,r=i;}return !n&&r&&(y=r),r||!n&&y},v=function(t,e){if(m(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new S(n)},g=$;g.l=D,g.i=m,g.w=function(t,e){return v(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var S=function(){function d(t){this.$L=this.$L||D(t.locale,null,!0),this.parse(t);}var $=d.prototype;return $.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(g.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r){var i=r[2]-1||0;return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}}return new Date(e)}(t),this.init();},$.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},$.$utils=function(){return g},$.isValid=function(){return !("Invalid Date"===this.$d.toString())},$.isSame=function(t,e){var n=v(t);return this.startOf(e)<=n&&n<=this.endOf(e)},$.isAfter=function(t,e){return v(t)<this.startOf(e)},$.isBefore=function(t,e){return this.endOf(e)<v(t)},$.$g=function(t,e,n){return g.u(t)?this[e]:this.set(n,t)},$.unix=function(){return Math.floor(this.valueOf()/1e3)},$.valueOf=function(){return this.$d.getTime()},$.startOf=function(t,a){var h=this,c=!!g.u(a)||a,d=g.p(t),$=function(t,e){var n=g.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return c?n:n.endOf(i)},l=function(t,e){return g.w(h.toDate()[t].apply(h.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},y=this.$W,M=this.$M,m=this.$D,D="set"+(this.$u?"UTC":"");switch(d){case o:return c?$(1,0):$(31,11);case u:return c?$(1,M):$(0,M+1);case s:var v=this.$locale().weekStart||0,S=(y<v?y+7:y)-v;return $(c?m-S:m+(6-S),M);case i:case f:return l(D+"Hours",0);case r:return l(D+"Minutes",1);case n:return l(D+"Seconds",2);case e:return l(D+"Milliseconds",3);default:return this.clone()}},$.endOf=function(t){return this.startOf(t,!1)},$.$set=function(s,a){var h,c=g.p(s),d="set"+(this.$u?"UTC":""),$=(h={},h[i]=d+"Date",h[f]=d+"Date",h[u]=d+"Month",h[o]=d+"FullYear",h[r]=d+"Hours",h[n]=d+"Minutes",h[e]=d+"Seconds",h[t]=d+"Milliseconds",h)[c],l=c===i?this.$D+(a-this.$W):a;if(c===u||c===o){var y=this.clone().set(f,1);y.$d[$](l),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},$.set=function(t,e){return this.clone().$set(t,e)},$.get=function(t){return this[g.p(t)]()},$.add=function(t,a){var f,h=this;t=Number(t);var c=g.p(a),d=function(e){var n=v(h);return g.w(n.date(n.date()+Math.round(e*t)),h)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(f={},f[n]=6e4,f[r]=36e5,f[e]=1e3,f)[c]||1,l=this.$d.getTime()+t*$;return g.w(l,this)},$.subtract=function(t,e){return this.add(-1*t,e)},$.format=function(t){var e=this;if(!this.isValid())return "Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=g.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,f=i.months,h=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return g.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:g.s(a+1,2,"0"),MMM:h(i.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:g.s(this.$D,2,"0"),d:String(this.$W),dd:h(i.weekdaysMin,this.$W,o,2),ddd:h(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:g.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:g.s(u,2,"0"),s:String(this.$s),ss:g.s(this.$s,2,"0"),SSS:g.s(this.$ms,3,"0"),Z:r};return n.replace(c,function(t,e){return e||l[t]||r.replace(":","")})},$.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},$.diff=function(t,f,h){var c,d=g.p(f),$=v(t),l=6e4*($.utcOffset()-this.utcOffset()),y=this-$,M=g.m(this,$);return M=(c={},c[o]=M/12,c[u]=M,c[a]=M/3,c[s]=(y-l)/6048e5,c[i]=(y-l)/864e5,c[r]=y/36e5,c[n]=y/6e4,c[e]=y/1e3,c)[d]||y,h?M:g.a(M)},$.daysInMonth=function(){return this.endOf(u).$D},$.$locale=function(){return M[this.$L]},$.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=D(t,e,!0);return r&&(n.$L=r),n},$.clone=function(){return g.w(this.$d,this)},$.toDate=function(){return new Date(this.valueOf())},$.toJSON=function(){return this.isValid()?this.toISOString():null},$.toISOString=function(){return this.$d.toISOString()},$.toString=function(){return this.$d.toUTCString()},d}(),p=S.prototype;return v.prototype=p,[["$ms",t],["$s",e],["$m",n],["$H",r],["$W",i],["$M",u],["$y",o],["$D",f]].forEach(function(t){p[t[1]]=function(e){return this.$g(e,t[0],t[1])};}),v.extend=function(t,e){return t(e,S,v),v},v.locale=D,v.isDayjs=m,v.unix=function(t){return v(1e3*t)},v.en=M[y],v.Ls=M,v});
  });

  var _default$2 = /*#__PURE__*/function (_EventEmitter) {
    _inheritsLoose(_default, _EventEmitter);

    function _default(options) {
      var _this;

      _this = _EventEmitter.call(this) || this;

      _defineProperty(_assertThisInitialized(_this), "options", {
        version: '',
        template: {
          driving: "<p><strong>{time}</strong> Прибытие {when}</p>" + "<p>{distance}, без пробок {distanceNoTraffic}</p>" + "<a href='javascript:void(0)'>Подробнее</a>",
          pedestrian: "<p><strong>{time}</strong>, растояние {distance}</p>" + "<p>Прибытие {when}</p>" + "<a href='javascript:void(0)'>Подробнее</a>",
          masstransit: "<p><strong>{time}</strong>, растояние {distance}</p>" + "<p>Прибытие {when}</p>" + "<a href='javascript:void(0)'>Подробнее</a>"
        },
        position: '.ymaps-{version}-controls__toolbar .ymaps-{version}-route-panel__points',
        classes: {
          container: 'ya-map-route__directions',
          current: 'ya-map-route__directions-current'
        },
        texts: {
          tomorrow: 'завтра, {time}'
        }
      });

      _defineProperty(_assertThisInitialized(_this), "directions", []);

      GenericUtil.setOptions(_assertThisInitialized(_this), options);
      return _this;
    }

    var _proto = _default.prototype;

    _proto.init = function init() {
      var position = document.querySelector(StringUtil.substitute(this.options.position, {
        version: this.options.version
      }));

      if (position !== null) {
        this.container = ElementUtil.createAndInject('DIV', {
          class: this.options.classes.container
        }, position, 'after');
        this.emit('init', this.container);
      }
    };

    _proto.build = function build(route, params) {
      var direction = ElementUtil.create('LI', {
        class: params.current ? this.options.classes.current : '',
        events: {
          click: this.changeRoute.bind(this, route, params.index)
        },
        html: this.getTemplateByType(params.type, params),
        dataIndex: params.index
      });
      this.directions.push(direction);
    };

    _proto.render = function render() {
      var _this2 = this;

      if (this.container && this.directions.length > 0) {
        var list = ElementUtil.create('UL');

        for (var _iterator = _createForOfIteratorHelperLoose(this.directions), _step; !(_step = _iterator()).done;) {
          var direction = _step.value;
          ElementUtil.inject(list, direction);
          var more = direction.querySelector('a');
          more.addEventListener('click', function () {
            return _this2.emit('moreClick');
          });
        }

        ElementUtil.inject(this.container, list);
      }
    };

    _proto.clean = function clean() {
      if (this.container) {
        ElementUtil.empty(this.container);
      }

      this.directions = [];
    };

    _proto.getWhenDate = function getWhenDate(seconds) {
      var date = dayjs_min().add(parseInt(seconds, 10), 'second'),
          now = dayjs_min();

      if (date.format('YY/M/D') === now.format('YY/M/D')) {
        return date.format('HH:mm');
      }

      if (date.format('YY/M/D') === now.add(1, 'day').format('YY/M/D')) {
        return StringUtil.substitute(this.options.texts.tomorrow, {
          time: date.format('HH:mm')
        });
      }

      return date.format('DD-MM-YY HH:mm');
    };

    _proto.getTemplateByType = function getTemplateByType(type, params) {
      var variables = {};

      switch (type) {
        case 'driving':
          variables = {
            time: params.durationInTraffic.text,
            when: this.getWhenDate(params.durationInTraffic.value),
            distance: params.distance.text,
            distanceNoTraffic: params.duration.text
          };
          break;

        default:
          variables = {
            time: params.duration.text,
            when: this.getWhenDate(params.duration.value),
            distance: params.distance.text
          };
      }

      return StringUtil.substitute(this.options.template[type], variables);
    };

    _proto.changeRoute = function changeRoute(route, index) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(this.directions), _step2; !(_step2 = _iterator2()).done;) {
        var direction = _step2.value;
        ElementUtil.set(direction, {
          class: parseInt(ElementUtil.getDataAttribute(direction, 'index'), 10) === index ? this.options.classes.current : '!' + this.options.classes.current
        });
      }

      this.emit('change', route, index);
    };

    return _default;
  }(EventEmitter);

  var _default$3 = /*#__PURE__*/function (_EventEmitter) {
    _inheritsLoose(_default, _EventEmitter);

    function _default(options) {
      var _this;

      if (options === void 0) {
        options = {};
      }

      _this = _EventEmitter.call(this) || this;

      _defineProperty(_assertThisInitialized(_this), "options", {
        yandexLink: 'https://yandex.ru/maps/?{params}'
      });

      _defineProperty(_assertThisInitialized(_this), "types", {
        'driving': 'auto',
        'masstransit': 'mt',
        'pedestrian': 'pd'
      });

      GenericUtil.setOptions(_assertThisInitialized(_this), options);

      _this.bootstrap();

      return _this;
    }

    var _proto = _default.prototype;

    _proto.bootstrap = function bootstrap() {};

    _proto.get = function get(params) {
      var queryParams = {
        rtext: this.getCoords(params),
        rtt: this.getTransport(params),
        rtn: this.getIndex(params)
      };
      return StringUtil.substitute(this.options.yandexLink, {
        params: ObjectUtil.toQueryString(queryParams)
      });
    };

    _proto.getCoords = function getCoords(params) {
      var cords = [];

      for (var _iterator = _createForOfIteratorHelperLoose(params.coords), _step; !(_step = _iterator()).done;) {
        var coord = _step.value;
        cords.push(coord.join(','));
      }

      return cords.join('~');
    };

    _proto.getTransport = function getTransport(params) {
      return this.types[params.type || 'auto'];
    };

    _proto.getIndex = function getIndex(params) {
      return params.index || 0;
    };

    _proto.open = function open(url) {
      var win = window.open(url, '_blank');
      win.focus();
    };

    return _default;
  }(EventEmitter);

  var sweetalert2_all = createCommonjsModule(function (module, exports) {
  /*!
  * sweetalert2 v9.17.1
  * Released under the MIT License.
  */
  (function (global, factory) {
     module.exports = factory() ;
  }(commonjsGlobal, function () {
    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      }

      return _assertThisInitialized(self);
    }

    function _createSuper(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct();

      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived),
            result;

        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;

          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }

        return _possibleConstructorReturn(this, result);
      };
    }

    function _superPropBase(object, property) {
      while (!Object.prototype.hasOwnProperty.call(object, property)) {
        object = _getPrototypeOf(object);
        if (object === null) break;
      }

      return object;
    }

    function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
      } else {
        _get = function _get(target, property, receiver) {
          var base = _superPropBase(target, property);

          if (!base) return;
          var desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.get) {
            return desc.get.call(receiver);
          }

          return desc.value;
        };
      }

      return _get(target, property, receiver || target);
    }

    var consolePrefix = 'SweetAlert2:';
    /**
     * Filter the unique values into a new array
     * @param arr
     */

    var uniqueArray = function uniqueArray(arr) {
      var result = [];

      for (var i = 0; i < arr.length; i++) {
        if (result.indexOf(arr[i]) === -1) {
          result.push(arr[i]);
        }
      }

      return result;
    };
    /**
     * Capitalize the first letter of a string
     * @param str
     */

    var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    /**
     * Returns the array of object values (Object.values isn't supported in IE11)
     * @param obj
     */

    var objectValues = function objectValues(obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    };
    /**
     * Convert NodeList to Array
     * @param nodeList
     */

    var toArray = function toArray(nodeList) {
      return Array.prototype.slice.call(nodeList);
    };
    /**
     * Standardise console warnings
     * @param message
     */

    var warn = function warn(message) {
      console.warn("".concat(consolePrefix, " ").concat(message));
    };
    /**
     * Standardise console errors
     * @param message
     */

    var error = function error(message) {
      console.error("".concat(consolePrefix, " ").concat(message));
    };
    /**
     * Private global state for `warnOnce`
     * @type {Array}
     * @private
     */

    var previousWarnOnceMessages = [];
    /**
     * Show a console warning, but only if it hasn't already been shown
     * @param message
     */

    var warnOnce = function warnOnce(message) {
      if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
        previousWarnOnceMessages.push(message);
        warn(message);
      }
    };
    /**
     * Show a one-time console warning about deprecated params/methods
     */

    var warnAboutDepreation = function warnAboutDepreation(deprecatedParam, useInstead) {
      warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
    };
    /**
     * If `arg` is a function, call it (with no arguments or context) and return the result.
     * Otherwise, just pass the value through
     * @param arg
     */

    var callIfFunction = function callIfFunction(arg) {
      return typeof arg === 'function' ? arg() : arg;
    };
    var hasToPromiseFn = function hasToPromiseFn(arg) {
      return arg && typeof arg.toPromise === 'function';
    };
    var asPromise = function asPromise(arg) {
      return hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
    };
    var isPromise = function isPromise(arg) {
      return arg && Promise.resolve(arg) === arg;
    };

    var DismissReason = Object.freeze({
      cancel: 'cancel',
      backdrop: 'backdrop',
      close: 'close',
      esc: 'esc',
      timer: 'timer'
    });

    var isJqueryElement = function isJqueryElement(elem) {
      return _typeof(elem) === 'object' && elem.jquery;
    };

    var isElement = function isElement(elem) {
      return elem instanceof Element || isJqueryElement(elem);
    };

    var argsToParams = function argsToParams(args) {
      var params = {};

      if (_typeof(args[0]) === 'object' && !isElement(args[0])) {
        _extends(params, args[0]);
      } else {
        ['title', 'html', 'icon'].forEach(function (name, index) {
          var arg = args[index];

          if (typeof arg === 'string' || isElement(arg)) {
            params[name] = arg;
          } else if (arg !== undefined) {
            error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(_typeof(arg)));
          }
        });
      }

      return params;
    };

    var swalPrefix = 'swal2-';
    var prefix = function prefix(items) {
      var result = {};

      for (var i in items) {
        result[items[i]] = swalPrefix + items[i];
      }

      return result;
    };
    var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'toast-column', 'show', 'hide', 'close', 'title', 'header', 'content', 'html-container', 'actions', 'confirm', 'cancel', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error']);
    var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

    var getContainer = function getContainer() {
      return document.body.querySelector(".".concat(swalClasses.container));
    };
    var elementBySelector = function elementBySelector(selectorString) {
      var container = getContainer();
      return container ? container.querySelector(selectorString) : null;
    };

    var elementByClass = function elementByClass(className) {
      return elementBySelector(".".concat(className));
    };

    var getPopup = function getPopup() {
      return elementByClass(swalClasses.popup);
    };
    var getIcons = function getIcons() {
      var popup = getPopup();
      return toArray(popup.querySelectorAll(".".concat(swalClasses.icon)));
    };
    var getIcon = function getIcon() {
      var visibleIcon = getIcons().filter(function (icon) {
        return isVisible(icon);
      });
      return visibleIcon.length ? visibleIcon[0] : null;
    };
    var getTitle = function getTitle() {
      return elementByClass(swalClasses.title);
    };
    var getContent = function getContent() {
      return elementByClass(swalClasses.content);
    };
    var getHtmlContainer = function getHtmlContainer() {
      return elementByClass(swalClasses['html-container']);
    };
    var getImage = function getImage() {
      return elementByClass(swalClasses.image);
    };
    var getProgressSteps = function getProgressSteps() {
      return elementByClass(swalClasses['progress-steps']);
    };
    var getValidationMessage = function getValidationMessage() {
      return elementByClass(swalClasses['validation-message']);
    };
    var getConfirmButton = function getConfirmButton() {
      return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
    };
    var getCancelButton = function getCancelButton() {
      return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
    };
    var getActions = function getActions() {
      return elementByClass(swalClasses.actions);
    };
    var getHeader = function getHeader() {
      return elementByClass(swalClasses.header);
    };
    var getFooter = function getFooter() {
      return elementByClass(swalClasses.footer);
    };
    var getTimerProgressBar = function getTimerProgressBar() {
      return elementByClass(swalClasses['timer-progress-bar']);
    };
    var getCloseButton = function getCloseButton() {
      return elementByClass(swalClasses.close);
    }; // https://github.com/jkup/focusable/blob/master/index.js

    var focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
    var getFocusableElements = function getFocusableElements() {
      var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
      .sort(function (a, b) {
        a = parseInt(a.getAttribute('tabindex'));
        b = parseInt(b.getAttribute('tabindex'));

        if (a > b) {
          return 1;
        } else if (a < b) {
          return -1;
        }

        return 0;
      });
      var otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(function (el) {
        return el.getAttribute('tabindex') !== '-1';
      });
      return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(function (el) {
        return isVisible(el);
      });
    };
    var isModal = function isModal() {
      return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
    };
    var isToast = function isToast() {
      return document.body.classList.contains(swalClasses['toast-shown']);
    };
    var isLoading = function isLoading() {
      return getPopup().hasAttribute('data-loading');
    };

    var states = {
      previousBodyPadding: null
    };
    var setInnerHtml = function setInnerHtml(elem, html) {
      // #1926
      elem.textContent = '';

      if (html) {
        var parser = new DOMParser();
        var parsed = parser.parseFromString(html, "text/html");
        toArray(parsed.querySelector('head').childNodes).forEach(function (child) {
          elem.appendChild(child);
        });
        toArray(parsed.querySelector('body').childNodes).forEach(function (child) {
          elem.appendChild(child);
        });
      }
    };
    var hasClass = function hasClass(elem, className) {
      if (!className) {
        return false;
      }

      var classList = className.split(/\s+/);

      for (var i = 0; i < classList.length; i++) {
        if (!elem.classList.contains(classList[i])) {
          return false;
        }
      }

      return true;
    };

    var removeCustomClasses = function removeCustomClasses(elem, params) {
      toArray(elem.classList).forEach(function (className) {
        if (!(objectValues(swalClasses).indexOf(className) !== -1) && !(objectValues(iconTypes).indexOf(className) !== -1) && !(objectValues(params.showClass).indexOf(className) !== -1)) {
          elem.classList.remove(className);
        }
      });
    };

    var applyCustomClass = function applyCustomClass(elem, params, className) {
      removeCustomClasses(elem, params);

      if (params.customClass && params.customClass[className]) {
        if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
          return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(_typeof(params.customClass[className]), "\""));
        }

        addClass(elem, params.customClass[className]);
      }
    };
    function getInput(content, inputType) {
      if (!inputType) {
        return null;
      }

      switch (inputType) {
        case 'select':
        case 'textarea':
        case 'file':
          return getChildByClass(content, swalClasses[inputType]);

        case 'checkbox':
          return content.querySelector(".".concat(swalClasses.checkbox, " input"));

        case 'radio':
          return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

        case 'range':
          return content.querySelector(".".concat(swalClasses.range, " input"));

        default:
          return getChildByClass(content, swalClasses.input);
      }
    }
    var focusInput = function focusInput(input) {
      input.focus(); // place cursor at end of text in text input

      if (input.type !== 'file') {
        // http://stackoverflow.com/a/2345915
        var val = input.value;
        input.value = '';
        input.value = val;
      }
    };
    var toggleClass = function toggleClass(target, classList, condition) {
      if (!target || !classList) {
        return;
      }

      if (typeof classList === 'string') {
        classList = classList.split(/\s+/).filter(Boolean);
      }

      classList.forEach(function (className) {
        if (target.forEach) {
          target.forEach(function (elem) {
            condition ? elem.classList.add(className) : elem.classList.remove(className);
          });
        } else {
          condition ? target.classList.add(className) : target.classList.remove(className);
        }
      });
    };
    var addClass = function addClass(target, classList) {
      toggleClass(target, classList, true);
    };
    var removeClass = function removeClass(target, classList) {
      toggleClass(target, classList, false);
    };
    var getChildByClass = function getChildByClass(elem, className) {
      for (var i = 0; i < elem.childNodes.length; i++) {
        if (hasClass(elem.childNodes[i], className)) {
          return elem.childNodes[i];
        }
      }
    };
    var applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
      if (value || parseInt(value) === 0) {
        elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
      } else {
        elem.style.removeProperty(property);
      }
    };
    var show = function show(elem) {
      var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
      elem.style.opacity = '';
      elem.style.display = display;
    };
    var hide = function hide(elem) {
      elem.style.opacity = '';
      elem.style.display = 'none';
    };
    var toggle = function toggle(elem, condition, display) {
      condition ? show(elem, display) : hide(elem);
    }; // borrowed from jquery $(elem).is(':visible') implementation

    var isVisible = function isVisible(elem) {
      return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
    };
    /* istanbul ignore next */

    var isScrollable = function isScrollable(elem) {
      return !!(elem.scrollHeight > elem.clientHeight);
    }; // borrowed from https://stackoverflow.com/a/46352119

    var hasCssAnimation = function hasCssAnimation(elem) {
      var style = window.getComputedStyle(elem);
      var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
      var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
      return animDuration > 0 || transDuration > 0;
    };
    var contains = function contains(haystack, needle) {
      if (typeof haystack.contains === 'function') {
        return haystack.contains(needle);
      }
    };
    var animateTimerProgressBar = function animateTimerProgressBar(timer) {
      var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var timerProgressBar = getTimerProgressBar();

      if (isVisible(timerProgressBar)) {
        if (reset) {
          timerProgressBar.style.transition = 'none';
          timerProgressBar.style.width = '100%';
        }

        setTimeout(function () {
          timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
          timerProgressBar.style.width = '0%';
        }, 10);
      }
    };
    var stopTimerProgressBar = function stopTimerProgressBar() {
      var timerProgressBar = getTimerProgressBar();
      var timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
      timerProgressBar.style.removeProperty('transition');
      timerProgressBar.style.width = '100%';
      var timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
      var timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
      timerProgressBar.style.removeProperty('transition');
      timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
    };

    // Detect Node env
    var isNodeEnv = function isNodeEnv() {
      return typeof window === 'undefined' || typeof document === 'undefined';
    };

    var sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <div class=\"").concat(swalClasses.header, "\">\n     <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.error, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.question, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.warning, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.info, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.success, "\"></div>\n     <img class=\"").concat(swalClasses.image, "\" />\n     <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n     <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.content, "\">\n     <div id=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses['html-container'], "\"></div>\n     <input class=\"").concat(swalClasses.input, "\" />\n     <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n     <div class=\"").concat(swalClasses.range, "\">\n       <input type=\"range\" />\n       <output></output>\n     </div>\n     <select class=\"").concat(swalClasses.select, "\"></select>\n     <div class=\"").concat(swalClasses.radio, "\"></div>\n     <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n       <input type=\"checkbox\" />\n       <span class=\"").concat(swalClasses.label, "\"></span>\n     </label>\n     <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n     <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   </div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\">OK</button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\">Cancel</button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

    var resetOldContainer = function resetOldContainer() {
      var oldContainer = getContainer();

      if (!oldContainer) {
        return false;
      }

      oldContainer.parentNode.removeChild(oldContainer);
      removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
      return true;
    };

    var oldInputVal; // IE11 workaround, see #1109 for details

    var resetValidationMessage = function resetValidationMessage(e) {
      if (Swal.isVisible() && oldInputVal !== e.target.value) {
        Swal.resetValidationMessage();
      }

      oldInputVal = e.target.value;
    };

    var addInputChangeListeners = function addInputChangeListeners() {
      var content = getContent();
      var input = getChildByClass(content, swalClasses.input);
      var file = getChildByClass(content, swalClasses.file);
      var range = content.querySelector(".".concat(swalClasses.range, " input"));
      var rangeOutput = content.querySelector(".".concat(swalClasses.range, " output"));
      var select = getChildByClass(content, swalClasses.select);
      var checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input"));
      var textarea = getChildByClass(content, swalClasses.textarea);
      input.oninput = resetValidationMessage;
      file.onchange = resetValidationMessage;
      select.onchange = resetValidationMessage;
      checkbox.onchange = resetValidationMessage;
      textarea.oninput = resetValidationMessage;

      range.oninput = function (e) {
        resetValidationMessage(e);
        rangeOutput.value = range.value;
      };

      range.onchange = function (e) {
        resetValidationMessage(e);
        range.nextSibling.value = range.value;
      };
    };

    var getTarget = function getTarget(target) {
      return typeof target === 'string' ? document.querySelector(target) : target;
    };

    var setupAccessibility = function setupAccessibility(params) {
      var popup = getPopup();
      popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
      popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

      if (!params.toast) {
        popup.setAttribute('aria-modal', 'true');
      }
    };

    var setupRTL = function setupRTL(targetElement) {
      if (window.getComputedStyle(targetElement).direction === 'rtl') {
        addClass(getContainer(), swalClasses.rtl);
      }
    };
    /*
     * Add modal + backdrop to DOM
     */


    var init = function init(params) {
      // Clean up the old popup container if it exists
      var oldContainerExisted = resetOldContainer();
      /* istanbul ignore if */

      if (isNodeEnv()) {
        error('SweetAlert2 requires document to initialize');
        return;
      }

      var container = document.createElement('div');
      container.className = swalClasses.container;

      if (oldContainerExisted) {
        addClass(container, swalClasses['no-transition']);
      }

      setInnerHtml(container, sweetHTML);
      var targetElement = getTarget(params.target);
      targetElement.appendChild(container);
      setupAccessibility(params);
      setupRTL(targetElement);
      addInputChangeListeners();
    };

    var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
      // DOM element
      if (param instanceof HTMLElement) {
        target.appendChild(param); // Object
      } else if (_typeof(param) === 'object') {
        handleObject(param, target); // Plain string
      } else if (param) {
        setInnerHtml(target, param);
      }
    };

    var handleObject = function handleObject(param, target) {
      // JQuery element(s)
      if (param.jquery) {
        handleJqueryElem(target, param); // For other objects use their string representation
      } else {
        setInnerHtml(target, param.toString());
      }
    };

    var handleJqueryElem = function handleJqueryElem(target, elem) {
      target.textContent = '';

      if (0 in elem) {
        for (var i = 0; (i in elem); i++) {
          target.appendChild(elem[i].cloneNode(true));
        }
      } else {
        target.appendChild(elem.cloneNode(true));
      }
    };

    var animationEndEvent = function () {
      // Prevent run in Node env

      /* istanbul ignore if */
      if (isNodeEnv()) {
        return false;
      }

      var testEl = document.createElement('div');
      var transEndEventNames = {
        WebkitAnimation: 'webkitAnimationEnd',
        OAnimation: 'oAnimationEnd oanimationend',
        animation: 'animationend'
      };

      for (var i in transEndEventNames) {
        if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
          return transEndEventNames[i];
        }
      }

      return false;
    }();

    // https://github.com/twbs/bootstrap/blob/master/js/src/modal.js

    var measureScrollbar = function measureScrollbar() {
      var scrollDiv = document.createElement('div');
      scrollDiv.className = swalClasses['scrollbar-measure'];
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    };

    var renderActions = function renderActions(instance, params) {
      var actions = getActions();
      var confirmButton = getConfirmButton();
      var cancelButton = getCancelButton(); // Actions (buttons) wrapper

      if (!params.showConfirmButton && !params.showCancelButton) {
        hide(actions);
      } // Custom class


      applyCustomClass(actions, params, 'actions'); // Render confirm button

      renderButton(confirmButton, 'confirm', params); // render Cancel Button

      renderButton(cancelButton, 'cancel', params);

      if (params.buttonsStyling) {
        handleButtonsStyling(confirmButton, cancelButton, params);
      } else {
        removeClass([confirmButton, cancelButton], swalClasses.styled);
        confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = '';
        cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = '';
      }

      if (params.reverseButtons) {
        confirmButton.parentNode.insertBefore(cancelButton, confirmButton);
      }
    };

    function handleButtonsStyling(confirmButton, cancelButton, params) {
      addClass([confirmButton, cancelButton], swalClasses.styled); // Buttons background colors

      if (params.confirmButtonColor) {
        confirmButton.style.backgroundColor = params.confirmButtonColor;
      }

      if (params.cancelButtonColor) {
        cancelButton.style.backgroundColor = params.cancelButtonColor;
      } // Loading state


      if (!isLoading()) {
        var confirmButtonBackgroundColor = window.getComputedStyle(confirmButton).getPropertyValue('background-color');
        confirmButton.style.borderLeftColor = confirmButtonBackgroundColor;
        confirmButton.style.borderRightColor = confirmButtonBackgroundColor;
      }
    }

    function renderButton(button, buttonType, params) {
      toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
      setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

      button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
      // Add buttons custom classes

      button.className = swalClasses[buttonType];
      applyCustomClass(button, params, "".concat(buttonType, "Button"));
      addClass(button, params["".concat(buttonType, "ButtonClass")]);
    }

    function handleBackdropParam(container, backdrop) {
      if (typeof backdrop === 'string') {
        container.style.background = backdrop;
      } else if (!backdrop) {
        addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
      }
    }

    function handlePositionParam(container, position) {
      if (position in swalClasses) {
        addClass(container, swalClasses[position]);
      } else {
        warn('The "position" parameter is not valid, defaulting to "center"');
        addClass(container, swalClasses.center);
      }
    }

    function handleGrowParam(container, grow) {
      if (grow && typeof grow === 'string') {
        var growClass = "grow-".concat(grow);

        if (growClass in swalClasses) {
          addClass(container, swalClasses[growClass]);
        }
      }
    }

    var renderContainer = function renderContainer(instance, params) {
      var container = getContainer();

      if (!container) {
        return;
      }

      handleBackdropParam(container, params.backdrop);

      if (!params.backdrop && params.allowOutsideClick) {
        warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
      }

      handlePositionParam(container, params.position);
      handleGrowParam(container, params.grow); // Custom class

      applyCustomClass(container, params, 'container'); // Set queue step attribute for getQueueStep() method

      var queueStep = document.body.getAttribute('data-swal2-queue-step');

      if (queueStep) {
        container.setAttribute('data-queue-step', queueStep);
        document.body.removeAttribute('data-swal2-queue-step');
      }
    };

    /**
     * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
     * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
     * This is the approach that Babel will probably take to implement private methods/fields
     *   https://github.com/tc39/proposal-private-methods
     *   https://github.com/babel/babel/pull/7555
     * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
     *   then we can use that language feature.
     */
    var privateProps = {
      promise: new WeakMap(),
      innerParams: new WeakMap(),
      domCache: new WeakMap()
    };

    var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
    var renderInput = function renderInput(instance, params) {
      var content = getContent();
      var innerParams = privateProps.innerParams.get(instance);
      var rerender = !innerParams || params.input !== innerParams.input;
      inputTypes.forEach(function (inputType) {
        var inputClass = swalClasses[inputType];
        var inputContainer = getChildByClass(content, inputClass); // set attributes

        setAttributes(inputType, params.inputAttributes); // set class

        inputContainer.className = inputClass;

        if (rerender) {
          hide(inputContainer);
        }
      });

      if (params.input) {
        if (rerender) {
          showInput(params);
        } // set custom class


        setCustomClass(params);
      }
    };

    var showInput = function showInput(params) {
      if (!renderInputType[params.input]) {
        return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
      }

      var inputContainer = getInputContainer(params.input);
      var input = renderInputType[params.input](inputContainer, params);
      show(input); // input autofocus

      setTimeout(function () {
        focusInput(input);
      });
    };

    var removeAttributes = function removeAttributes(input) {
      for (var i = 0; i < input.attributes.length; i++) {
        var attrName = input.attributes[i].name;

        if (!(['type', 'value', 'style'].indexOf(attrName) !== -1)) {
          input.removeAttribute(attrName);
        }
      }
    };

    var setAttributes = function setAttributes(inputType, inputAttributes) {
      var input = getInput(getContent(), inputType);

      if (!input) {
        return;
      }

      removeAttributes(input);

      for (var attr in inputAttributes) {
        // Do not set a placeholder for <input type="range">
        // it'll crash Edge, #1298
        if (inputType === 'range' && attr === 'placeholder') {
          continue;
        }

        input.setAttribute(attr, inputAttributes[attr]);
      }
    };

    var setCustomClass = function setCustomClass(params) {
      var inputContainer = getInputContainer(params.input);

      if (params.customClass) {
        addClass(inputContainer, params.customClass.input);
      }
    };

    var setInputPlaceholder = function setInputPlaceholder(input, params) {
      if (!input.placeholder || params.inputPlaceholder) {
        input.placeholder = params.inputPlaceholder;
      }
    };

    var getInputContainer = function getInputContainer(inputType) {
      var inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
      return getChildByClass(getContent(), inputClass);
    };

    var renderInputType = {};

    renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function (input, params) {
      if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
        input.value = params.inputValue;
      } else if (!isPromise(params.inputValue)) {
        warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(_typeof(params.inputValue), "\""));
      }

      setInputPlaceholder(input, params);
      input.type = params.input;
      return input;
    };

    renderInputType.file = function (input, params) {
      setInputPlaceholder(input, params);
      return input;
    };

    renderInputType.range = function (range, params) {
      var rangeInput = range.querySelector('input');
      var rangeOutput = range.querySelector('output');
      rangeInput.value = params.inputValue;
      rangeInput.type = params.input;
      rangeOutput.value = params.inputValue;
      return range;
    };

    renderInputType.select = function (select, params) {
      select.textContent = '';

      if (params.inputPlaceholder) {
        var placeholder = document.createElement('option');
        setInnerHtml(placeholder, params.inputPlaceholder);
        placeholder.value = '';
        placeholder.disabled = true;
        placeholder.selected = true;
        select.appendChild(placeholder);
      }

      return select;
    };

    renderInputType.radio = function (radio) {
      radio.textContent = '';
      return radio;
    };

    renderInputType.checkbox = function (checkboxContainer, params) {
      var checkbox = getInput(getContent(), 'checkbox');
      checkbox.value = 1;
      checkbox.id = swalClasses.checkbox;
      checkbox.checked = Boolean(params.inputValue);
      var label = checkboxContainer.querySelector('span');
      setInnerHtml(label, params.inputPlaceholder);
      return checkboxContainer;
    };

    renderInputType.textarea = function (textarea, params) {
      textarea.value = params.inputValue;
      setInputPlaceholder(textarea, params);

      if ('MutationObserver' in window) {
        // #1699
        var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
        var popupPadding = parseInt(window.getComputedStyle(getPopup()).paddingLeft) + parseInt(window.getComputedStyle(getPopup()).paddingRight);

        var outputsize = function outputsize() {
          var contentWidth = textarea.offsetWidth + popupPadding;

          if (contentWidth > initialPopupWidth) {
            getPopup().style.width = "".concat(contentWidth, "px");
          } else {
            getPopup().style.width = null;
          }
        };

        new MutationObserver(outputsize).observe(textarea, {
          attributes: true,
          attributeFilter: ['style']
        });
      }

      return textarea;
    };

    var renderContent = function renderContent(instance, params) {
      var content = getContent().querySelector("#".concat(swalClasses.content)); // Content as HTML

      if (params.html) {
        parseHtmlToContainer(params.html, content);
        show(content, 'block'); // Content as plain text
      } else if (params.text) {
        content.textContent = params.text;
        show(content, 'block'); // No content
      } else {
        hide(content);
      }

      renderInput(instance, params); // Custom class

      applyCustomClass(getContent(), params, 'content');
    };

    var renderFooter = function renderFooter(instance, params) {
      var footer = getFooter();
      toggle(footer, params.footer);

      if (params.footer) {
        parseHtmlToContainer(params.footer, footer);
      } // Custom class


      applyCustomClass(footer, params, 'footer');
    };

    var renderCloseButton = function renderCloseButton(instance, params) {
      var closeButton = getCloseButton();
      setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

      applyCustomClass(closeButton, params, 'closeButton');
      toggle(closeButton, params.showCloseButton);
      closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
    };

    var renderIcon = function renderIcon(instance, params) {
      var innerParams = privateProps.innerParams.get(instance); // if the give icon already rendered, apply the custom class without re-rendering the icon

      if (innerParams && params.icon === innerParams.icon && getIcon()) {
        applyCustomClass(getIcon(), params, 'icon');
        return;
      }

      hideAllIcons();

      if (!params.icon) {
        return;
      }

      if (Object.keys(iconTypes).indexOf(params.icon) !== -1) {
        var icon = elementBySelector(".".concat(swalClasses.icon, ".").concat(iconTypes[params.icon]));
        show(icon); // Custom or default content

        setContent(icon, params);
        adjustSuccessIconBackgoundColor(); // Custom class

        applyCustomClass(icon, params, 'icon'); // Animate icon

        addClass(icon, params.showClass.icon);
      } else {
        error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
      }
    };

    var hideAllIcons = function hideAllIcons() {
      var icons = getIcons();

      for (var i = 0; i < icons.length; i++) {
        hide(icons[i]);
      }
    }; // Adjust success icon background color to match the popup background color


    var adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
      var popup = getPopup();
      var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
      var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

      for (var i = 0; i < successIconParts.length; i++) {
        successIconParts[i].style.backgroundColor = popupBackgroundColor;
      }
    };

    var setContent = function setContent(icon, params) {
      icon.textContent = '';

      if (params.iconHtml) {
        setInnerHtml(icon, iconContent(params.iconHtml));
      } else if (params.icon === 'success') {
        setInnerHtml(icon, "\n      <div class=\"swal2-success-circular-line-left\"></div>\n      <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n      <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n      <div class=\"swal2-success-circular-line-right\"></div>\n    ");
      } else if (params.icon === 'error') {
        setInnerHtml(icon, "\n      <span class=\"swal2-x-mark\">\n        <span class=\"swal2-x-mark-line-left\"></span>\n        <span class=\"swal2-x-mark-line-right\"></span>\n      </span>\n    ");
      } else {
        var defaultIconHtml = {
          question: '?',
          warning: '!',
          info: 'i'
        };
        setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
      }
    };

    var iconContent = function iconContent(content) {
      return "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");
    };

    var renderImage = function renderImage(instance, params) {
      var image = getImage();

      if (!params.imageUrl) {
        return hide(image);
      }

      show(image, ''); // Src, alt

      image.setAttribute('src', params.imageUrl);
      image.setAttribute('alt', params.imageAlt); // Width, height

      applyNumericalStyle(image, 'width', params.imageWidth);
      applyNumericalStyle(image, 'height', params.imageHeight); // Class

      image.className = swalClasses.image;
      applyCustomClass(image, params, 'image');
    };

    var currentSteps = [];
    /*
     * Global function for chaining sweetAlert popups
     */

    var queue = function queue(steps) {
      var Swal = this;
      currentSteps = steps;

      var resetAndResolve = function resetAndResolve(resolve, value) {
        currentSteps = [];
        resolve(value);
      };

      var queueResult = [];
      return new Promise(function (resolve) {
        (function step(i, callback) {
          if (i < currentSteps.length) {
            document.body.setAttribute('data-swal2-queue-step', i);
            Swal.fire(currentSteps[i]).then(function (result) {
              if (typeof result.value !== 'undefined') {
                queueResult.push(result.value);
                step(i + 1);
              } else {
                resetAndResolve(resolve, {
                  dismiss: result.dismiss
                });
              }
            });
          } else {
            resetAndResolve(resolve, {
              value: queueResult
            });
          }
        })(0);
      });
    };
    /*
     * Global function for getting the index of current popup in queue
     */

    var getQueueStep = function getQueueStep() {
      return getContainer() && getContainer().getAttribute('data-queue-step');
    };
    /*
     * Global function for inserting a popup to the queue
     */

    var insertQueueStep = function insertQueueStep(step, index) {
      if (index && index < currentSteps.length) {
        return currentSteps.splice(index, 0, step);
      }

      return currentSteps.push(step);
    };
    /*
     * Global function for deleting a popup from the queue
     */

    var deleteQueueStep = function deleteQueueStep(index) {
      if (typeof currentSteps[index] !== 'undefined') {
        currentSteps.splice(index, 1);
      }
    };

    var createStepElement = function createStepElement(step) {
      var stepEl = document.createElement('li');
      addClass(stepEl, swalClasses['progress-step']);
      setInnerHtml(stepEl, step);
      return stepEl;
    };

    var createLineElement = function createLineElement(params) {
      var lineEl = document.createElement('li');
      addClass(lineEl, swalClasses['progress-step-line']);

      if (params.progressStepsDistance) {
        lineEl.style.width = params.progressStepsDistance;
      }

      return lineEl;
    };

    var renderProgressSteps = function renderProgressSteps(instance, params) {
      var progressStepsContainer = getProgressSteps();

      if (!params.progressSteps || params.progressSteps.length === 0) {
        return hide(progressStepsContainer);
      }

      show(progressStepsContainer);
      progressStepsContainer.textContent = '';
      var currentProgressStep = parseInt(params.currentProgressStep === undefined ? getQueueStep() : params.currentProgressStep);

      if (currentProgressStep >= params.progressSteps.length) {
        warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
      }

      params.progressSteps.forEach(function (step, index) {
        var stepEl = createStepElement(step);
        progressStepsContainer.appendChild(stepEl);

        if (index === currentProgressStep) {
          addClass(stepEl, swalClasses['active-progress-step']);
        }

        if (index !== params.progressSteps.length - 1) {
          var lineEl = createLineElement(params);
          progressStepsContainer.appendChild(lineEl);
        }
      });
    };

    var renderTitle = function renderTitle(instance, params) {
      var title = getTitle();
      toggle(title, params.title || params.titleText);

      if (params.title) {
        parseHtmlToContainer(params.title, title);
      }

      if (params.titleText) {
        title.innerText = params.titleText;
      } // Custom class


      applyCustomClass(title, params, 'title');
    };

    var renderHeader = function renderHeader(instance, params) {
      var header = getHeader(); // Custom class

      applyCustomClass(header, params, 'header'); // Progress steps

      renderProgressSteps(instance, params); // Icon

      renderIcon(instance, params); // Image

      renderImage(instance, params); // Title

      renderTitle(instance, params); // Close button

      renderCloseButton(instance, params);
    };

    var renderPopup = function renderPopup(instance, params) {
      var popup = getPopup(); // Width

      applyNumericalStyle(popup, 'width', params.width); // Padding

      applyNumericalStyle(popup, 'padding', params.padding); // Background

      if (params.background) {
        popup.style.background = params.background;
      } // Classes


      addClasses(popup, params);
    };

    var addClasses = function addClasses(popup, params) {
      // Default Class + showClass when updating Swal.update({})
      popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');

      if (params.toast) {
        addClass([document.documentElement, document.body], swalClasses['toast-shown']);
        addClass(popup, swalClasses.toast);
      } else {
        addClass(popup, swalClasses.modal);
      } // Custom class


      applyCustomClass(popup, params, 'popup');

      if (typeof params.customClass === 'string') {
        addClass(popup, params.customClass);
      } // Icon class (#1842)


      if (params.icon) {
        addClass(popup, swalClasses["icon-".concat(params.icon)]);
      }
    };

    var render = function render(instance, params) {
      renderPopup(instance, params);
      renderContainer(instance, params);
      renderHeader(instance, params);
      renderContent(instance, params);
      renderActions(instance, params);
      renderFooter(instance, params);

      if (typeof params.onRender === 'function') {
        params.onRender(getPopup());
      }
    };

    /*
     * Global function to determine if SweetAlert2 popup is shown
     */

    var isVisible$1 = function isVisible$$1() {
      return isVisible(getPopup());
    };
    /*
     * Global function to click 'Confirm' button
     */

    var clickConfirm = function clickConfirm() {
      return getConfirmButton() && getConfirmButton().click();
    };
    /*
     * Global function to click 'Cancel' button
     */

    var clickCancel = function clickCancel() {
      return getCancelButton() && getCancelButton().click();
    };

    function fire() {
      var Swal = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _construct(Swal, args);
    }

    /**
     * Returns an extended version of `Swal` containing `params` as defaults.
     * Useful for reusing Swal configuration.
     *
     * For example:
     *
     * Before:
     * const textPromptOptions = { input: 'text', showCancelButton: true }
     * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
     * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
     *
     * After:
     * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
     * const {value: firstName} = await TextPrompt('What is your first name?')
     * const {value: lastName} = await TextPrompt('What is your last name?')
     *
     * @param mixinParams
     */
    function mixin(mixinParams) {
      var MixinSwal = /*#__PURE__*/function (_this) {
        _inherits(MixinSwal, _this);

        var _super = _createSuper(MixinSwal);

        function MixinSwal() {
          _classCallCheck(this, MixinSwal);

          return _super.apply(this, arguments);
        }

        _createClass(MixinSwal, [{
          key: "_main",
          value: function _main(params) {
            return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, _extends({}, mixinParams, params));
          }
        }]);

        return MixinSwal;
      }(this);

      return MixinSwal;
    }

    /**
     * Show spinner instead of Confirm button
     */

    var showLoading = function showLoading() {
      var popup = getPopup();

      if (!popup) {
        Swal.fire();
      }

      popup = getPopup();
      var actions = getActions();
      var confirmButton = getConfirmButton();
      show(actions);
      show(confirmButton, 'inline-block');
      addClass([popup, actions], swalClasses.loading);
      confirmButton.disabled = true;
      popup.setAttribute('data-loading', true);
      popup.setAttribute('aria-busy', true);
      popup.focus();
    };

    var RESTORE_FOCUS_TIMEOUT = 100;

    var globalState = {};

    var focusPreviousActiveElement = function focusPreviousActiveElement() {
      if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
        globalState.previousActiveElement.focus();
        globalState.previousActiveElement = null;
      } else if (document.body) {
        document.body.focus();
      }
    }; // Restore previous active (focused) element


    var restoreActiveElement = function restoreActiveElement() {
      return new Promise(function (resolve) {
        var x = window.scrollX;
        var y = window.scrollY;
        globalState.restoreFocusTimeout = setTimeout(function () {
          focusPreviousActiveElement();
          resolve();
        }, RESTORE_FOCUS_TIMEOUT); // issues/900

        /* istanbul ignore if */

        if (typeof x !== 'undefined' && typeof y !== 'undefined') {
          // IE doesn't have scrollX/scrollY support
          window.scrollTo(x, y);
        }
      });
    };

    /**
     * If `timer` parameter is set, returns number of milliseconds of timer remained.
     * Otherwise, returns undefined.
     */

    var getTimerLeft = function getTimerLeft() {
      return globalState.timeout && globalState.timeout.getTimerLeft();
    };
    /**
     * Stop timer. Returns number of milliseconds of timer remained.
     * If `timer` parameter isn't set, returns undefined.
     */

    var stopTimer = function stopTimer() {
      if (globalState.timeout) {
        stopTimerProgressBar();
        return globalState.timeout.stop();
      }
    };
    /**
     * Resume timer. Returns number of milliseconds of timer remained.
     * If `timer` parameter isn't set, returns undefined.
     */

    var resumeTimer = function resumeTimer() {
      if (globalState.timeout) {
        var remaining = globalState.timeout.start();
        animateTimerProgressBar(remaining);
        return remaining;
      }
    };
    /**
     * Resume timer. Returns number of milliseconds of timer remained.
     * If `timer` parameter isn't set, returns undefined.
     */

    var toggleTimer = function toggleTimer() {
      var timer = globalState.timeout;
      return timer && (timer.running ? stopTimer() : resumeTimer());
    };
    /**
     * Increase timer. Returns number of milliseconds of an updated timer.
     * If `timer` parameter isn't set, returns undefined.
     */

    var increaseTimer = function increaseTimer(n) {
      if (globalState.timeout) {
        var remaining = globalState.timeout.increase(n);
        animateTimerProgressBar(remaining, true);
        return remaining;
      }
    };
    /**
     * Check if timer is running. Returns true if timer is running
     * or false if timer is paused or stopped.
     * If `timer` parameter isn't set, returns undefined
     */

    var isTimerRunning = function isTimerRunning() {
      return globalState.timeout && globalState.timeout.isRunning();
    };

    var defaultParams = {
      title: '',
      titleText: '',
      text: '',
      html: '',
      footer: '',
      icon: undefined,
      iconHtml: undefined,
      toast: false,
      animation: true,
      showClass: {
        popup: 'swal2-show',
        backdrop: 'swal2-backdrop-show',
        icon: 'swal2-icon-show'
      },
      hideClass: {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      customClass: undefined,
      target: 'body',
      backdrop: true,
      heightAuto: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      stopKeydownPropagation: true,
      keydownListenerCapture: false,
      showConfirmButton: true,
      showCancelButton: false,
      preConfirm: undefined,
      confirmButtonText: 'OK',
      confirmButtonAriaLabel: '',
      confirmButtonColor: undefined,
      cancelButtonText: 'Cancel',
      cancelButtonAriaLabel: '',
      cancelButtonColor: undefined,
      buttonsStyling: true,
      reverseButtons: false,
      focusConfirm: true,
      focusCancel: false,
      showCloseButton: false,
      closeButtonHtml: '&times;',
      closeButtonAriaLabel: 'Close this dialog',
      showLoaderOnConfirm: false,
      imageUrl: undefined,
      imageWidth: undefined,
      imageHeight: undefined,
      imageAlt: '',
      timer: undefined,
      timerProgressBar: false,
      width: undefined,
      padding: undefined,
      background: undefined,
      input: undefined,
      inputPlaceholder: '',
      inputValue: '',
      inputOptions: {},
      inputAutoTrim: true,
      inputAttributes: {},
      inputValidator: undefined,
      validationMessage: undefined,
      grow: false,
      position: 'center',
      progressSteps: [],
      currentProgressStep: undefined,
      progressStepsDistance: undefined,
      onBeforeOpen: undefined,
      onOpen: undefined,
      onRender: undefined,
      onClose: undefined,
      onAfterClose: undefined,
      onDestroy: undefined,
      scrollbarPadding: true
    };
    var updatableParams = ['title', 'titleText', 'text', 'html', 'footer', 'icon', 'hideClass', 'customClass', 'allowOutsideClick', 'allowEscapeKey', 'showConfirmButton', 'showCancelButton', 'confirmButtonText', 'confirmButtonAriaLabel', 'confirmButtonColor', 'cancelButtonText', 'cancelButtonAriaLabel', 'cancelButtonColor', 'buttonsStyling', 'reverseButtons', 'showCloseButton', 'closeButtonHtml', 'closeButtonAriaLabel', 'imageUrl', 'imageWidth', 'imageHeight', 'imageAlt', 'progressSteps', 'currentProgressStep', 'onClose', 'onAfterClose', 'onDestroy'];
    var deprecatedParams = {
      animation: 'showClass" and "hideClass'
    };
    var toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusCancel', 'heightAuto', 'keydownListenerCapture'];
    /**
     * Is valid parameter
     * @param {String} paramName
     */

    var isValidParameter = function isValidParameter(paramName) {
      return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
    };
    /**
     * Is valid parameter for Swal.update() method
     * @param {String} paramName
     */

    var isUpdatableParameter = function isUpdatableParameter(paramName) {
      return updatableParams.indexOf(paramName) !== -1;
    };
    /**
     * Is deprecated parameter
     * @param {String} paramName
     */

    var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
      return deprecatedParams[paramName];
    };

    var checkIfParamIsValid = function checkIfParamIsValid(param) {
      if (!isValidParameter(param)) {
        warn("Unknown parameter \"".concat(param, "\""));
      }
    };

    var checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
      if (toastIncompatibleParams.indexOf(param) !== -1) {
        warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
      }
    };

    var checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
      if (isDeprecatedParameter(param)) {
        warnAboutDepreation(param, isDeprecatedParameter(param));
      }
    };
    /**
     * Show relevant warnings for given params
     *
     * @param params
     */


    var showWarningsForParams = function showWarningsForParams(params) {
      for (var param in params) {
        checkIfParamIsValid(param);

        if (params.toast) {
          checkIfToastParamIsValid(param);
        }

        checkIfParamIsDeprecated(param);
      }
    };



    var staticMethods = /*#__PURE__*/Object.freeze({
      isValidParameter: isValidParameter,
      isUpdatableParameter: isUpdatableParameter,
      isDeprecatedParameter: isDeprecatedParameter,
      argsToParams: argsToParams,
      isVisible: isVisible$1,
      clickConfirm: clickConfirm,
      clickCancel: clickCancel,
      getContainer: getContainer,
      getPopup: getPopup,
      getTitle: getTitle,
      getContent: getContent,
      getHtmlContainer: getHtmlContainer,
      getImage: getImage,
      getIcon: getIcon,
      getIcons: getIcons,
      getCloseButton: getCloseButton,
      getActions: getActions,
      getConfirmButton: getConfirmButton,
      getCancelButton: getCancelButton,
      getHeader: getHeader,
      getFooter: getFooter,
      getTimerProgressBar: getTimerProgressBar,
      getFocusableElements: getFocusableElements,
      getValidationMessage: getValidationMessage,
      isLoading: isLoading,
      fire: fire,
      mixin: mixin,
      queue: queue,
      getQueueStep: getQueueStep,
      insertQueueStep: insertQueueStep,
      deleteQueueStep: deleteQueueStep,
      showLoading: showLoading,
      enableLoading: showLoading,
      getTimerLeft: getTimerLeft,
      stopTimer: stopTimer,
      resumeTimer: resumeTimer,
      toggleTimer: toggleTimer,
      increaseTimer: increaseTimer,
      isTimerRunning: isTimerRunning
    });

    /**
     * Enables buttons and hide loader.
     */

    function hideLoading() {
      // do nothing if popup is closed
      var innerParams = privateProps.innerParams.get(this);

      if (!innerParams) {
        return;
      }

      var domCache = privateProps.domCache.get(this);

      if (!innerParams.showConfirmButton) {
        hide(domCache.confirmButton);

        if (!innerParams.showCancelButton) {
          hide(domCache.actions);
        }
      }

      removeClass([domCache.popup, domCache.actions], swalClasses.loading);
      domCache.popup.removeAttribute('aria-busy');
      domCache.popup.removeAttribute('data-loading');
      domCache.confirmButton.disabled = false;
      domCache.cancelButton.disabled = false;
    }

    function getInput$1(instance) {
      var innerParams = privateProps.innerParams.get(instance || this);
      var domCache = privateProps.domCache.get(instance || this);

      if (!domCache) {
        return null;
      }

      return getInput(domCache.content, innerParams.input);
    }

    var fixScrollbar = function fixScrollbar() {
      // for queues, do not do this more than once
      if (states.previousBodyPadding !== null) {
        return;
      } // if the body has overflow


      if (document.body.scrollHeight > window.innerHeight) {
        // add padding so the content doesn't shift after removal of scrollbar
        states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
        document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
      }
    };
    var undoScrollbar = function undoScrollbar() {
      if (states.previousBodyPadding !== null) {
        document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
        states.previousBodyPadding = null;
      }
    };

    /* istanbul ignore file */

    var iOSfix = function iOSfix() {
      var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

      if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
        var offset = document.body.scrollTop;
        document.body.style.top = "".concat(offset * -1, "px");
        addClass(document.body, swalClasses.iosfix);
        lockBodyScroll();
        addBottomPaddingForTallPopups(); // #1948
      }
    };

    var addBottomPaddingForTallPopups = function addBottomPaddingForTallPopups() {
      var safari = !navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i);

      if (safari) {
        var bottomPanelHeight = 44;

        if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
          getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
        }
      }
    };

    var lockBodyScroll = function lockBodyScroll() {
      // #1246
      var container = getContainer();
      var preventTouchMove;

      container.ontouchstart = function (e) {
        preventTouchMove = shouldPreventTouchMove(e.target);
      };

      container.ontouchmove = function (e) {
        if (preventTouchMove) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
    };

    var shouldPreventTouchMove = function shouldPreventTouchMove(target) {
      var container = getContainer();

      if (target === container) {
        return true;
      }

      if (!isScrollable(container) && target.tagName !== 'INPUT' && // #1603
      !(isScrollable(getContent()) && // #1944
      getContent().contains(target))) {
        return true;
      }

      return false;
    };

    var undoIOSfix = function undoIOSfix() {
      if (hasClass(document.body, swalClasses.iosfix)) {
        var offset = parseInt(document.body.style.top, 10);
        removeClass(document.body, swalClasses.iosfix);
        document.body.style.top = '';
        document.body.scrollTop = offset * -1;
      }
    };

    /* istanbul ignore file */

    var isIE11 = function isIE11() {
      return !!window.MSInputMethodContext && !!document.documentMode;
    }; // Fix IE11 centering sweetalert2/issues/933


    var fixVerticalPositionIE = function fixVerticalPositionIE() {
      var container = getContainer();
      var popup = getPopup();
      container.style.removeProperty('align-items');

      if (popup.offsetTop < 0) {
        container.style.alignItems = 'flex-start';
      }
    };

    var IEfix = function IEfix() {
      if (typeof window !== 'undefined' && isIE11()) {
        fixVerticalPositionIE();
        window.addEventListener('resize', fixVerticalPositionIE);
      }
    };
    var undoIEfix = function undoIEfix() {
      if (typeof window !== 'undefined' && isIE11()) {
        window.removeEventListener('resize', fixVerticalPositionIE);
      }
    };

    // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
    // elements not within the active modal dialog will not be surfaced if a user opens a screen
    // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

    var setAriaHidden = function setAriaHidden() {
      var bodyChildren = toArray(document.body.children);
      bodyChildren.forEach(function (el) {
        if (el === getContainer() || contains(el, getContainer())) {
          return;
        }

        if (el.hasAttribute('aria-hidden')) {
          el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
        }

        el.setAttribute('aria-hidden', 'true');
      });
    };
    var unsetAriaHidden = function unsetAriaHidden() {
      var bodyChildren = toArray(document.body.children);
      bodyChildren.forEach(function (el) {
        if (el.hasAttribute('data-previous-aria-hidden')) {
          el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
          el.removeAttribute('data-previous-aria-hidden');
        } else {
          el.removeAttribute('aria-hidden');
        }
      });
    };

    /**
     * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
     * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
     * This is the approach that Babel will probably take to implement private methods/fields
     *   https://github.com/tc39/proposal-private-methods
     *   https://github.com/babel/babel/pull/7555
     * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
     *   then we can use that language feature.
     */
    var privateMethods = {
      swalPromiseResolve: new WeakMap()
    };

    /*
     * Instance method to close sweetAlert
     */

    function removePopupAndResetState(instance, container, isToast$$1, onAfterClose) {
      if (isToast$$1) {
        triggerOnAfterCloseAndDispose(instance, onAfterClose);
      } else {
        restoreActiveElement().then(function () {
          return triggerOnAfterCloseAndDispose(instance, onAfterClose);
        });
        globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
          capture: globalState.keydownListenerCapture
        });
        globalState.keydownHandlerAdded = false;
      }

      if (container.parentNode && !document.body.getAttribute('data-swal2-queue-step')) {
        container.parentNode.removeChild(container);
      }

      if (isModal()) {
        undoScrollbar();
        undoIOSfix();
        undoIEfix();
        unsetAriaHidden();
      }

      removeBodyClasses();
    }

    function removeBodyClasses() {
      removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['toast-column']]);
    }

    function close(resolveValue) {
      var popup = getPopup();

      if (!popup) {
        return;
      }

      var innerParams = privateProps.innerParams.get(this);

      if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
        return;
      }

      var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
      removeClass(popup, innerParams.showClass.popup);
      addClass(popup, innerParams.hideClass.popup);
      var backdrop = getContainer();
      removeClass(backdrop, innerParams.showClass.backdrop);
      addClass(backdrop, innerParams.hideClass.backdrop);
      handlePopupAnimation(this, popup, innerParams);

      if (typeof resolveValue !== 'undefined') {
        resolveValue.isDismissed = typeof resolveValue.dismiss !== 'undefined';
        resolveValue.isConfirmed = typeof resolveValue.dismiss === 'undefined';
      } else {
        resolveValue = {
          isDismissed: true,
          isConfirmed: false
        };
      } // Resolve Swal promise


      swalPromiseResolve(resolveValue || {});
    }

    var handlePopupAnimation = function handlePopupAnimation(instance, popup, innerParams) {
      var container = getContainer(); // If animation is supported, animate

      var animationIsSupported = animationEndEvent && hasCssAnimation(popup);
      var onClose = innerParams.onClose,
          onAfterClose = innerParams.onAfterClose;

      if (onClose !== null && typeof onClose === 'function') {
        onClose(popup);
      }

      if (animationIsSupported) {
        animatePopup(instance, popup, container, onAfterClose);
      } else {
        // Otherwise, remove immediately
        removePopupAndResetState(instance, container, isToast(), onAfterClose);
      }
    };

    var animatePopup = function animatePopup(instance, popup, container, onAfterClose) {
      globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, isToast(), onAfterClose);
      popup.addEventListener(animationEndEvent, function (e) {
        if (e.target === popup) {
          globalState.swalCloseEventFinishedCallback();
          delete globalState.swalCloseEventFinishedCallback;
        }
      });
    };

    var triggerOnAfterCloseAndDispose = function triggerOnAfterCloseAndDispose(instance, onAfterClose) {
      setTimeout(function () {
        if (typeof onAfterClose === 'function') {
          onAfterClose();
        }

        instance._destroy();
      });
    };

    function setButtonsDisabled(instance, buttons, disabled) {
      var domCache = privateProps.domCache.get(instance);
      buttons.forEach(function (button) {
        domCache[button].disabled = disabled;
      });
    }

    function setInputDisabled(input, disabled) {
      if (!input) {
        return false;
      }

      if (input.type === 'radio') {
        var radiosContainer = input.parentNode.parentNode;
        var radios = radiosContainer.querySelectorAll('input');

        for (var i = 0; i < radios.length; i++) {
          radios[i].disabled = disabled;
        }
      } else {
        input.disabled = disabled;
      }
    }

    function enableButtons() {
      setButtonsDisabled(this, ['confirmButton', 'cancelButton'], false);
    }
    function disableButtons() {
      setButtonsDisabled(this, ['confirmButton', 'cancelButton'], true);
    }
    function enableInput() {
      return setInputDisabled(this.getInput(), false);
    }
    function disableInput() {
      return setInputDisabled(this.getInput(), true);
    }

    function showValidationMessage(error) {
      var domCache = privateProps.domCache.get(this);
      setInnerHtml(domCache.validationMessage, error);
      var popupComputedStyle = window.getComputedStyle(domCache.popup);
      domCache.validationMessage.style.marginLeft = "-".concat(popupComputedStyle.getPropertyValue('padding-left'));
      domCache.validationMessage.style.marginRight = "-".concat(popupComputedStyle.getPropertyValue('padding-right'));
      show(domCache.validationMessage);
      var input = this.getInput();

      if (input) {
        input.setAttribute('aria-invalid', true);
        input.setAttribute('aria-describedBy', swalClasses['validation-message']);
        focusInput(input);
        addClass(input, swalClasses.inputerror);
      }
    } // Hide block with validation message

    function resetValidationMessage$1() {
      var domCache = privateProps.domCache.get(this);

      if (domCache.validationMessage) {
        hide(domCache.validationMessage);
      }

      var input = this.getInput();

      if (input) {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedBy');
        removeClass(input, swalClasses.inputerror);
      }
    }

    function getProgressSteps$1() {
      var domCache = privateProps.domCache.get(this);
      return domCache.progressSteps;
    }

    var Timer = /*#__PURE__*/function () {
      function Timer(callback, delay) {
        _classCallCheck(this, Timer);

        this.callback = callback;
        this.remaining = delay;
        this.running = false;
        this.start();
      }

      _createClass(Timer, [{
        key: "start",
        value: function start() {
          if (!this.running) {
            this.running = true;
            this.started = new Date();
            this.id = setTimeout(this.callback, this.remaining);
          }

          return this.remaining;
        }
      }, {
        key: "stop",
        value: function stop() {
          if (this.running) {
            this.running = false;
            clearTimeout(this.id);
            this.remaining -= new Date() - this.started;
          }

          return this.remaining;
        }
      }, {
        key: "increase",
        value: function increase(n) {
          var running = this.running;

          if (running) {
            this.stop();
          }

          this.remaining += n;

          if (running) {
            this.start();
          }

          return this.remaining;
        }
      }, {
        key: "getTimerLeft",
        value: function getTimerLeft() {
          if (this.running) {
            this.stop();
            this.start();
          }

          return this.remaining;
        }
      }, {
        key: "isRunning",
        value: function isRunning() {
          return this.running;
        }
      }]);

      return Timer;
    }();

    var defaultInputValidators = {
      email: function email(string, validationMessage) {
        return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
      },
      url: function url(string, validationMessage) {
        // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
        return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
      }
    };

    function setDefaultInputValidators(params) {
      // Use default `inputValidator` for supported input types if not provided
      if (!params.inputValidator) {
        Object.keys(defaultInputValidators).forEach(function (key) {
          if (params.input === key) {
            params.inputValidator = defaultInputValidators[key];
          }
        });
      }
    }

    function validateCustomTargetElement(params) {
      // Determine if the custom target element is valid
      if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
        warn('Target parameter is not valid, defaulting to "body"');
        params.target = 'body';
      }
    }
    /**
     * Set type, text and actions on popup
     *
     * @param params
     * @returns {boolean}
     */


    function setParameters(params) {
      setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

      if (params.showLoaderOnConfirm && !params.preConfirm) {
        warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
      } // params.animation will be actually used in renderPopup.js
      // but in case when params.animation is a function, we need to call that function
      // before popup (re)initialization, so it'll be possible to check Swal.isVisible()
      // inside the params.animation function


      params.animation = callIfFunction(params.animation);
      validateCustomTargetElement(params); // Replace newlines with <br> in title

      if (typeof params.title === 'string') {
        params.title = params.title.split('\n').join('<br />');
      }

      init(params);
    }

    /**
     * Open popup, add necessary classes and styles, fix scrollbar
     *
     * @param {Array} params
     */

    var openPopup = function openPopup(params) {
      var container = getContainer();
      var popup = getPopup();

      if (typeof params.onBeforeOpen === 'function') {
        params.onBeforeOpen(popup);
      }

      var bodyStyles = window.getComputedStyle(document.body);
      var initialBodyOverflow = bodyStyles.overflowY;
      addClasses$1(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

      setScrollingVisibility(container, popup);

      if (isModal()) {
        fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
        setAriaHidden();
      }

      if (!isToast() && !globalState.previousActiveElement) {
        globalState.previousActiveElement = document.activeElement;
      }

      if (typeof params.onOpen === 'function') {
        setTimeout(function () {
          return params.onOpen(popup);
        });
      }

      removeClass(container, swalClasses['no-transition']);
    };

    function swalOpenAnimationFinished(event) {
      var popup = getPopup();

      if (event.target !== popup) {
        return;
      }

      var container = getContainer();
      popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
      container.style.overflowY = 'auto';
    }

    var setScrollingVisibility = function setScrollingVisibility(container, popup) {
      if (animationEndEvent && hasCssAnimation(popup)) {
        container.style.overflowY = 'hidden';
        popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
      } else {
        container.style.overflowY = 'auto';
      }
    };

    var fixScrollContainer = function fixScrollContainer(container, scrollbarPadding, initialBodyOverflow) {
      iOSfix();
      IEfix();

      if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
        fixScrollbar();
      } // sweetalert2/issues/1247


      setTimeout(function () {
        container.scrollTop = 0;
      });
    };

    var addClasses$1 = function addClasses(container, popup, params) {
      addClass(container, params.showClass.backdrop);
      show(popup); // Animate popup right after showing it

      addClass(popup, params.showClass.popup);
      addClass([document.documentElement, document.body], swalClasses.shown);

      if (params.heightAuto && params.backdrop && !params.toast) {
        addClass([document.documentElement, document.body], swalClasses['height-auto']);
      }
    };

    var handleInputOptionsAndValue = function handleInputOptionsAndValue(instance, params) {
      if (params.input === 'select' || params.input === 'radio') {
        handleInputOptions(instance, params);
      } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(params.input) !== -1 && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
        handleInputValue(instance, params);
      }
    };
    var getInputValue = function getInputValue(instance, innerParams) {
      var input = instance.getInput();

      if (!input) {
        return null;
      }

      switch (innerParams.input) {
        case 'checkbox':
          return getCheckboxValue(input);

        case 'radio':
          return getRadioValue(input);

        case 'file':
          return getFileValue(input);

        default:
          return innerParams.inputAutoTrim ? input.value.trim() : input.value;
      }
    };

    var getCheckboxValue = function getCheckboxValue(input) {
      return input.checked ? 1 : 0;
    };

    var getRadioValue = function getRadioValue(input) {
      return input.checked ? input.value : null;
    };

    var getFileValue = function getFileValue(input) {
      return input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;
    };

    var handleInputOptions = function handleInputOptions(instance, params) {
      var content = getContent();

      var processInputOptions = function processInputOptions(inputOptions) {
        return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
      };

      if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
        showLoading();
        asPromise(params.inputOptions).then(function (inputOptions) {
          instance.hideLoading();
          processInputOptions(inputOptions);
        });
      } else if (_typeof(params.inputOptions) === 'object') {
        processInputOptions(params.inputOptions);
      } else {
        error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
      }
    };

    var handleInputValue = function handleInputValue(instance, params) {
      var input = instance.getInput();
      hide(input);
      asPromise(params.inputValue).then(function (inputValue) {
        input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : "".concat(inputValue);
        show(input);
        input.focus();
        instance.hideLoading();
      })["catch"](function (err) {
        error("Error in inputValue promise: ".concat(err));
        input.value = '';
        show(input);
        input.focus();
        instance.hideLoading();
      });
    };

    var populateInputOptions = {
      select: function select(content, inputOptions, params) {
        var select = getChildByClass(content, swalClasses.select);

        var renderOption = function renderOption(parent, optionLabel, optionValue) {
          var option = document.createElement('option');
          option.value = optionValue;
          setInnerHtml(option, optionLabel);

          if (params.inputValue.toString() === optionValue.toString()) {
            option.selected = true;
          }

          parent.appendChild(option);
        };

        inputOptions.forEach(function (inputOption) {
          var optionValue = inputOption[0];
          var optionLabel = inputOption[1]; // <optgroup> spec:
          // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
          // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
          // check whether this is a <optgroup>

          if (Array.isArray(optionLabel)) {
            // if it is an array, then it is an <optgroup>
            var optgroup = document.createElement('optgroup');
            optgroup.label = optionValue;
            optgroup.disabled = false; // not configurable for now

            select.appendChild(optgroup);
            optionLabel.forEach(function (o) {
              return renderOption(optgroup, o[1], o[0]);
            });
          } else {
            // case of <option>
            renderOption(select, optionLabel, optionValue);
          }
        });
        select.focus();
      },
      radio: function radio(content, inputOptions, params) {
        var radio = getChildByClass(content, swalClasses.radio);
        inputOptions.forEach(function (inputOption) {
          var radioValue = inputOption[0];
          var radioLabel = inputOption[1];
          var radioInput = document.createElement('input');
          var radioLabelElement = document.createElement('label');
          radioInput.type = 'radio';
          radioInput.name = swalClasses.radio;
          radioInput.value = radioValue;

          if (params.inputValue.toString() === radioValue.toString()) {
            radioInput.checked = true;
          }

          var label = document.createElement('span');
          setInnerHtml(label, radioLabel);
          label.className = swalClasses.label;
          radioLabelElement.appendChild(radioInput);
          radioLabelElement.appendChild(label);
          radio.appendChild(radioLabelElement);
        });
        var radios = radio.querySelectorAll('input');

        if (radios.length) {
          radios[0].focus();
        }
      }
    };
    /**
     * Converts `inputOptions` into an array of `[value, label]`s
     * @param inputOptions
     */

    var formatInputOptions = function formatInputOptions(inputOptions) {
      var result = [];

      if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
        inputOptions.forEach(function (value, key) {
          var valueFormatted = value;

          if (_typeof(valueFormatted) === 'object') {
            // case of <optgroup>
            valueFormatted = formatInputOptions(valueFormatted);
          }

          result.push([key, valueFormatted]);
        });
      } else {
        Object.keys(inputOptions).forEach(function (key) {
          var valueFormatted = inputOptions[key];

          if (_typeof(valueFormatted) === 'object') {
            // case of <optgroup>
            valueFormatted = formatInputOptions(valueFormatted);
          }

          result.push([key, valueFormatted]);
        });
      }

      return result;
    };

    var handleConfirmButtonClick = function handleConfirmButtonClick(instance, innerParams) {
      instance.disableButtons();

      if (innerParams.input) {
        handleConfirmWithInput(instance, innerParams);
      } else {
        confirm(instance, innerParams, true);
      }
    };
    var handleCancelButtonClick = function handleCancelButtonClick(instance, dismissWith) {
      instance.disableButtons();
      dismissWith(DismissReason.cancel);
    };

    var handleConfirmWithInput = function handleConfirmWithInput(instance, innerParams) {
      var inputValue = getInputValue(instance, innerParams);

      if (innerParams.inputValidator) {
        instance.disableInput();
        var validationPromise = Promise.resolve().then(function () {
          return asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage));
        });
        validationPromise.then(function (validationMessage) {
          instance.enableButtons();
          instance.enableInput();

          if (validationMessage) {
            instance.showValidationMessage(validationMessage);
          } else {
            confirm(instance, innerParams, inputValue);
          }
        });
      } else if (!instance.getInput().checkValidity()) {
        instance.enableButtons();
        instance.showValidationMessage(innerParams.validationMessage);
      } else {
        confirm(instance, innerParams, inputValue);
      }
    };

    var succeedWith = function succeedWith(instance, value) {
      instance.closePopup({
        value: value
      });
    };

    var confirm = function confirm(instance, innerParams, value) {
      if (innerParams.showLoaderOnConfirm) {
        showLoading(); // TODO: make showLoading an *instance* method
      }

      if (innerParams.preConfirm) {
        instance.resetValidationMessage();
        var preConfirmPromise = Promise.resolve().then(function () {
          return asPromise(innerParams.preConfirm(value, innerParams.validationMessage));
        });
        preConfirmPromise.then(function (preConfirmValue) {
          if (isVisible(getValidationMessage()) || preConfirmValue === false) {
            instance.hideLoading();
          } else {
            succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
          }
        });
      } else {
        succeedWith(instance, value);
      }
    };

    var addKeydownHandler = function addKeydownHandler(instance, globalState, innerParams, dismissWith) {
      if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
        globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
          capture: globalState.keydownListenerCapture
        });
        globalState.keydownHandlerAdded = false;
      }

      if (!innerParams.toast) {
        globalState.keydownHandler = function (e) {
          return keydownHandler(instance, e, dismissWith);
        };

        globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
        globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
        globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
          capture: globalState.keydownListenerCapture
        });
        globalState.keydownHandlerAdded = true;
      }
    }; // Focus handling

    var setFocus = function setFocus(innerParams, index, increment) {
      var focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

      for (var i = 0; i < focusableElements.length; i++) {
        index = index + increment; // rollover to first item

        if (index === focusableElements.length) {
          index = 0; // go to last item
        } else if (index === -1) {
          index = focusableElements.length - 1;
        }

        return focusableElements[index].focus();
      } // no visible focusable elements, focus the popup


      getPopup().focus();
    };
    var arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down' // IE11
    ];
    var escKeys = ['Escape', 'Esc' // IE11
    ];

    var keydownHandler = function keydownHandler(instance, e, dismissWith) {
      var innerParams = privateProps.innerParams.get(instance);

      if (innerParams.stopKeydownPropagation) {
        e.stopPropagation();
      } // ENTER


      if (e.key === 'Enter') {
        handleEnter(instance, e, innerParams); // TAB
      } else if (e.key === 'Tab') {
        handleTab(e, innerParams); // ARROWS - switch focus between buttons
      } else if (arrowKeys.indexOf(e.key) !== -1) {
        handleArrows(); // ESC
      } else if (escKeys.indexOf(e.key) !== -1) {
        handleEsc(e, innerParams, dismissWith);
      }
    };

    var handleEnter = function handleEnter(instance, e, innerParams) {
      // #720 #721
      if (e.isComposing) {
        return;
      }

      if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
        if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
          return; // do not submit
        }

        clickConfirm();
        e.preventDefault();
      }
    };

    var handleTab = function handleTab(e, innerParams) {
      var targetElement = e.target;
      var focusableElements = getFocusableElements();
      var btnIndex = -1;

      for (var i = 0; i < focusableElements.length; i++) {
        if (targetElement === focusableElements[i]) {
          btnIndex = i;
          break;
        }
      }

      if (!e.shiftKey) {
        // Cycle to the next button
        setFocus(innerParams, btnIndex, 1);
      } else {
        // Cycle to the prev button
        setFocus(innerParams, btnIndex, -1);
      }

      e.stopPropagation();
      e.preventDefault();
    };

    var handleArrows = function handleArrows() {
      var confirmButton = getConfirmButton();
      var cancelButton = getCancelButton(); // focus Cancel button if Confirm button is currently focused

      if (document.activeElement === confirmButton && isVisible(cancelButton)) {
        cancelButton.focus(); // and vice versa
      } else if (document.activeElement === cancelButton && isVisible(confirmButton)) {
        confirmButton.focus();
      }
    };

    var handleEsc = function handleEsc(e, innerParams, dismissWith) {
      if (callIfFunction(innerParams.allowEscapeKey)) {
        e.preventDefault();
        dismissWith(DismissReason.esc);
      }
    };

    var handlePopupClick = function handlePopupClick(instance, domCache, dismissWith) {
      var innerParams = privateProps.innerParams.get(instance);

      if (innerParams.toast) {
        handleToastClick(instance, domCache, dismissWith);
      } else {
        // Ignore click events that had mousedown on the popup but mouseup on the container
        // This can happen when the user drags a slider
        handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

        handleContainerMousedown(domCache);
        handleModalClick(instance, domCache, dismissWith);
      }
    };

    var handleToastClick = function handleToastClick(instance, domCache, dismissWith) {
      // Closing toast by internal click
      domCache.popup.onclick = function () {
        var innerParams = privateProps.innerParams.get(instance);

        if (innerParams.showConfirmButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.input) {
          return;
        }

        dismissWith(DismissReason.close);
      };
    };

    var ignoreOutsideClick = false;

    var handleModalMousedown = function handleModalMousedown(domCache) {
      domCache.popup.onmousedown = function () {
        domCache.container.onmouseup = function (e) {
          domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
          // have any other direct children aside of the popup

          if (e.target === domCache.container) {
            ignoreOutsideClick = true;
          }
        };
      };
    };

    var handleContainerMousedown = function handleContainerMousedown(domCache) {
      domCache.container.onmousedown = function () {
        domCache.popup.onmouseup = function (e) {
          domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

          if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
            ignoreOutsideClick = true;
          }
        };
      };
    };

    var handleModalClick = function handleModalClick(instance, domCache, dismissWith) {
      domCache.container.onclick = function (e) {
        var innerParams = privateProps.innerParams.get(instance);

        if (ignoreOutsideClick) {
          ignoreOutsideClick = false;
          return;
        }

        if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
          dismissWith(DismissReason.backdrop);
        }
      };
    };

    function _main(userParams) {
      showWarningsForParams(userParams);

      if (globalState.currentInstance) {
        globalState.currentInstance._destroy();
      }

      globalState.currentInstance = this;
      var innerParams = prepareParams(userParams);
      setParameters(innerParams);
      Object.freeze(innerParams); // clear the previous timer

      if (globalState.timeout) {
        globalState.timeout.stop();
        delete globalState.timeout;
      } // clear the restore focus timeout


      clearTimeout(globalState.restoreFocusTimeout);
      var domCache = populateDomCache(this);
      render(this, innerParams);
      privateProps.innerParams.set(this, innerParams);
      return swalPromise(this, domCache, innerParams);
    }

    var prepareParams = function prepareParams(userParams) {
      var showClass = _extends({}, defaultParams.showClass, userParams.showClass);

      var hideClass = _extends({}, defaultParams.hideClass, userParams.hideClass);

      var params = _extends({}, defaultParams, userParams);

      params.showClass = showClass;
      params.hideClass = hideClass; // @deprecated

      if (userParams.animation === false) {
        params.showClass = {
          popup: 'swal2-noanimation',
          backdrop: 'swal2-noanimation'
        };
        params.hideClass = {};
      }

      return params;
    };

    var swalPromise = function swalPromise(instance, domCache, innerParams) {
      return new Promise(function (resolve) {
        // functions to handle all closings/dismissals
        var dismissWith = function dismissWith(dismiss) {
          instance.closePopup({
            dismiss: dismiss
          });
        };

        privateMethods.swalPromiseResolve.set(instance, resolve);

        domCache.confirmButton.onclick = function () {
          return handleConfirmButtonClick(instance, innerParams);
        };

        domCache.cancelButton.onclick = function () {
          return handleCancelButtonClick(instance, dismissWith);
        };

        domCache.closeButton.onclick = function () {
          return dismissWith(DismissReason.close);
        };

        handlePopupClick(instance, domCache, dismissWith);
        addKeydownHandler(instance, globalState, innerParams, dismissWith);

        if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
          addClass(document.body, swalClasses['toast-column']);
        } else {
          removeClass(document.body, swalClasses['toast-column']);
        }

        handleInputOptionsAndValue(instance, innerParams);
        openPopup(innerParams);
        setupTimer(globalState, innerParams, dismissWith);
        initFocus(domCache, innerParams); // Scroll container to top on open (#1247, #1946)

        setTimeout(function () {
          domCache.container.scrollTop = 0;
        });
      });
    };

    var populateDomCache = function populateDomCache(instance) {
      var domCache = {
        popup: getPopup(),
        container: getContainer(),
        content: getContent(),
        actions: getActions(),
        confirmButton: getConfirmButton(),
        cancelButton: getCancelButton(),
        closeButton: getCloseButton(),
        validationMessage: getValidationMessage(),
        progressSteps: getProgressSteps()
      };
      privateProps.domCache.set(instance, domCache);
      return domCache;
    };

    var setupTimer = function setupTimer(globalState$$1, innerParams, dismissWith) {
      var timerProgressBar = getTimerProgressBar();
      hide(timerProgressBar);

      if (innerParams.timer) {
        globalState$$1.timeout = new Timer(function () {
          dismissWith('timer');
          delete globalState$$1.timeout;
        }, innerParams.timer);

        if (innerParams.timerProgressBar) {
          show(timerProgressBar);
          setTimeout(function () {
            if (globalState$$1.timeout.running) {
              // timer can be already stopped at this point
              animateTimerProgressBar(innerParams.timer);
            }
          });
        }
      }
    };

    var initFocus = function initFocus(domCache, innerParams) {
      if (innerParams.toast) {
        return;
      }

      if (!callIfFunction(innerParams.allowEnterKey)) {
        return blurActiveElement();
      }

      if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
        return domCache.cancelButton.focus();
      }

      if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
        return domCache.confirmButton.focus();
      }

      setFocus(innerParams, -1, 1);
    };

    var blurActiveElement = function blurActiveElement() {
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
    };

    /**
     * Updates popup parameters.
     */

    function update(params) {
      var popup = getPopup();
      var innerParams = privateProps.innerParams.get(this);

      if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
        return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
      }

      var validUpdatableParams = {}; // assign valid params from `params` to `defaults`

      Object.keys(params).forEach(function (param) {
        if (Swal.isUpdatableParameter(param)) {
          validUpdatableParams[param] = params[param];
        } else {
          warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js"));
        }
      });

      var updatedParams = _extends({}, innerParams, validUpdatableParams);

      render(this, updatedParams);
      privateProps.innerParams.set(this, updatedParams);
      Object.defineProperties(this, {
        params: {
          value: _extends({}, this.params, params),
          writable: false,
          enumerable: true
        }
      });
    }

    function _destroy() {
      var domCache = privateProps.domCache.get(this);
      var innerParams = privateProps.innerParams.get(this);

      if (!innerParams) {
        return; // This instance has already been destroyed
      } // Check if there is another Swal closing


      if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
        globalState.swalCloseEventFinishedCallback();
        delete globalState.swalCloseEventFinishedCallback;
      } // Check if there is a swal disposal defer timer


      if (globalState.deferDisposalTimer) {
        clearTimeout(globalState.deferDisposalTimer);
        delete globalState.deferDisposalTimer;
      }

      if (typeof innerParams.onDestroy === 'function') {
        innerParams.onDestroy();
      }

      disposeSwal(this);
    }

    var disposeSwal = function disposeSwal(instance) {
      // Unset this.params so GC will dispose it (#1569)
      delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

      delete globalState.keydownHandler;
      delete globalState.keydownTarget; // Unset WeakMaps so GC will be able to dispose them (#1569)

      unsetWeakMaps(privateProps);
      unsetWeakMaps(privateMethods);
    };

    var unsetWeakMaps = function unsetWeakMaps(obj) {
      for (var i in obj) {
        obj[i] = new WeakMap();
      }
    };



    var instanceMethods = /*#__PURE__*/Object.freeze({
      hideLoading: hideLoading,
      disableLoading: hideLoading,
      getInput: getInput$1,
      close: close,
      closePopup: close,
      closeModal: close,
      closeToast: close,
      enableButtons: enableButtons,
      disableButtons: disableButtons,
      enableInput: enableInput,
      disableInput: disableInput,
      showValidationMessage: showValidationMessage,
      resetValidationMessage: resetValidationMessage$1,
      getProgressSteps: getProgressSteps$1,
      _main: _main,
      update: update,
      _destroy: _destroy
    });

    var currentInstance;

    var SweetAlert = /*#__PURE__*/function () {
      function SweetAlert() {
        _classCallCheck(this, SweetAlert);

        // Prevent run in Node env
        if (typeof window === 'undefined') {
          return;
        } // Check for the existence of Promise


        if (typeof Promise === 'undefined') {
          error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
        }

        currentInstance = this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var outerParams = Object.freeze(this.constructor.argsToParams(args));
        Object.defineProperties(this, {
          params: {
            value: outerParams,
            writable: false,
            enumerable: true,
            configurable: true
          }
        });

        var promise = this._main(this.params);

        privateProps.promise.set(this, promise);
      } // `catch` cannot be the name of a module export, so we define our thenable methods here instead


      _createClass(SweetAlert, [{
        key: "then",
        value: function then(onFulfilled) {
          var promise = privateProps.promise.get(this);
          return promise.then(onFulfilled);
        }
      }, {
        key: "finally",
        value: function _finally(onFinally) {
          var promise = privateProps.promise.get(this);
          return promise["finally"](onFinally);
        }
      }]);

      return SweetAlert;
    }(); // Assign instance methods from src/instanceMethods/*.js to prototype


    _extends(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor


    _extends(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility


    Object.keys(instanceMethods).forEach(function (key) {
      SweetAlert[key] = function () {
        if (currentInstance) {
          var _currentInstance;

          return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
        }
      };
    });
    SweetAlert.DismissReason = DismissReason;
    SweetAlert.version = '9.17.1';

    var Swal = SweetAlert;
    Swal["default"] = Swal;

    return Swal;

  }));
  if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){  commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}

  "undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;overflow-y:hidden;background:#fff;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row;padding:0}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;padding:0;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex-basis:auto!important;width:auto;height:auto;margin:0 .3125em}.swal2-popup.swal2-toast .swal2-styled{margin:0 .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(50,100,150,.4)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-no-transition{transition:none!important}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:.3125em;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center;padding:0 1.8em}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-actions.swal2-loading .swal2-styled.swal2-confirm{box-sizing:border-box;width:2.5em;height:2.5em;margin:.46875em;padding:0;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:.25em solid transparent;border-radius:100%;border-color:transparent;background-color:transparent!important;color:transparent!important;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-actions.swal2-loading .swal2-styled.swal2-cancel{margin-right:30px;margin-left:30px}.swal2-actions.swal2-loading :not(.swal2-styled).swal2-confirm::after{content:\"\";display:inline-block;width:15px;height:15px;margin-left:5px;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:3px solid #999;border-radius:50%;border-right-color:transparent;box-shadow:1px 1px 1px #fff}.swal2-styled{margin:.3125em;padding:.625em 2em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#3085d6;color:#fff;font-size:1.0625em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#aaa;color:#fff;font-size:1.0625em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(50,100,150,.4)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;height:.25em;overflow:hidden;border-bottom-right-radius:.3125em;border-bottom-left-radius:.3125em}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;z-index:2;top:0;right:0;align-items:center;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:0;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close::-moz-focus-inner{border:0}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0 1.6em;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 3px #c4e6f5}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::-ms-input-placeholder,.swal2-input::-ms-input-placeholder,.swal2-textarea::-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{margin:0 .4em}.swal2-validation-message{display:none;align-items:center;justify-content:center;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{align-items:center;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;width:2em;height:2em;border-radius:2em;background:#3085d6;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#3085d6}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;width:2.5em;height:.4em;margin:0 -1px;background:#3085d6}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-moz-document url-prefix(){.swal2-close:focus{outline:2px solid rgba(50,100,150,.4)}}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent!important}body.swal2-no-backdrop .swal2-container>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-container.swal2-top{top:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-top-left,body.swal2-no-backdrop .swal2-container.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-top-end,body.swal2-no-backdrop .swal2-container.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-container.swal2-center{top:50%;left:50%;transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-left,body.swal2-no-backdrop .swal2-container.swal2-center-start{top:50%;left:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-end,body.swal2-no-backdrop .swal2-container.swal2-center-right{top:50%;right:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom{bottom:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom-left,body.swal2-no-backdrop .swal2-container.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-bottom-end,body.swal2-no-backdrop .swal2-container.swal2-bottom-right{right:0;bottom:0}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}");
  });

  var _default$4 = /*#__PURE__*/function (_EventEmitter) {
    _inheritsLoose(_default, _EventEmitter);

    function _default(options) {
      var _this;

      if (options === void 0) {
        options = {};
      }

      _this = _EventEmitter.call(this) || this;

      _defineProperty(_assertThisInitialized(_this), "options", {
        telegram: 'tg://resolve?domain=fpbeat',
        viber: 'viber://public?id=swelly',
        whatsapp: 'whatsapp://send?abid=+380930250200&text=sometext',
        classes: {
          container: 'ya-map-route__share-button',
          hidden: 'ya-map-route__share-button-hidden'
        },
        texts: {
          button: 'Отправить на телефон'
        },
        template: '<div class="ya-map-route__share-popup">' + '<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={qr}">' + '<div class="ya-map-route__share-social">' + '<a href="{telegram}" target="_blank" rel="telegram"></a>' + '<a href="{whatsapp}" target="_blank" rel="whatsapp"></a>' + '<a href="{viber}" target="_blank" rel="viber"></a>' + '</div>' + '</div>'
      });

      GenericUtil.setOptions(_assertThisInitialized(_this), options);
      return _this;
    }

    var _proto = _default.prototype;

    _proto.init = function init(position) {
      this.container = ElementUtil.createAndInject('DIV', {
        class: this.options.classes.container + ' ' + this.options.classes.hidden
      }, position, 'after');
      this.addButton();
    };

    _proto.addButton = function addButton() {
      ElementUtil.createAndInject('BUTTON', {
        html: this.options.texts.button,
        class: this.options.classes.container,
        events: {
          click: this.process.bind(this)
        }
      }, this.container);
    };

    _proto.process = function process() {
      var options = ObjectUtil.pick(['telegram', 'viber', 'whatsapp'], this.options);
      sweetalert2_all.fire({
        title: 'Отправить на телефон',
        html: StringUtil.substitute(this.options.template, Object.assign({}, options, {
          qr: this.options.beforeOpen()
        })),
        showConfirmButton: false,
        showCloseButton: true
      });
    };

    _proto.toggle = function toggle(state) {
      ElementUtil.set(this.container, 'class', state ? this.options.classes.hidden : '!' + this.options.classes.hidden);
    };

    return _default;
  }(EventEmitter);

  var _default$5 = /*#__PURE__*/function (_YaMap) {
    _inheritsLoose(_default, _YaMap);

    function _default(container, options) {
      var _this;

      if (options === void 0) {
        options = {};
      }

      _this = _YaMap.call(this) || this;

      _defineProperty(_assertThisInitialized(_this), "options", {
        map: {
          center: '55.8941, 37.8620',
          zoom: 10,
          type: 'yandex#map',
          controls: []
        },
        markers: {
          start: {
            content: '',
            caption: 'Вы здесь',
            preset: 'islands#greenHomeCircleIcon',
            visible: true
          },
          destination: {
            content: 'Пейнтбол, лазертаг и отдых в заповеднике "Лосиный остров",<br /> г. Королев',
            caption: 'Дикий лось',
            preset: 'islands#orangeParkCircleIcon',
            visible: true
          }
        },
        panel: {
          allowSwitch: false,
          reverseGeocoding: true,
          autofocus: false,
          types: {
            auto: true,
            masstransit: true,
            pedestrian: true,
            bicycle: false,
            taxi: true
          }
        },
        classes: {
          loading: 'wp-poi-map__loading',
          template: 'wp-poi-map__popup'
        },
        loader: {},
        share: {},
        link: {},
        directions: {}
      });

      _defineProperty(_assertThisInitialized(_this), "current", {
        coords: [],
        type: 'auto',
        index: 0
      });

      _defineProperty(_assertThisInitialized(_this), "markers", []);

      _defineProperty(_assertThisInitialized(_this), "pageMarker", null);

      GenericUtil.setOptions(_assertThisInitialized(_this), options);

      _this.bootstrap(container);

      return _this;
    }

    var _proto = _default.prototype;

    _proto.bootstrap = function bootstrap(container) {
      var _this2 = this;

      this.container = document.querySelector(container);
      this.loader = new _default$1(Object.assign({}, this.options.loader, {
        onLoaded: this.start.bind(this)
      }));
      this.link = new _default$3(this.options.link);
      this.share = new _default$4(Object.assign({}, this.options.share, {
        beforeOpen: function beforeOpen() {
          return _this2.link.get(_this2.current);
        }
      }));
      this.directions = new _default$2(Object.assign({}, this.options.directions, {
        version: this.loader.getVersion(),
        onMoreClick: this.openOnYandex.bind(this),
        onInit: function onInit(container) {
          _this2.share.init(container);
        }
      }));
    };

    _proto.openOnYandex = function openOnYandex() {
      this.link.open(this.link.get(this.current));
    };

    _proto.intersectionWatcher = function intersectionWatcher() {
      var _this3 = this;

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              observer.unobserve(_this3.container);

              _this3.requestUserLocation();
            }
          });
        }, {
          root: null,
          rootMargin: '0px',
          threshold: 0
        });
        observer.observe(this.container);
      } else {
        this.requestUserLocation();
      }
    };

    _proto.start = function start() {
      var _this4 = this;

      this.map = this.getMap();
      this.markers = [this.createMarker(this.options.markers.start), this.createMarker(this.options.markers.destination)];
      var control = this.map.controls.get('routePanelControl');
      control.options.set({
        autofocus: false,
        maxWidth: 300
      });
      control.routePanel.state.set({
        type: 'auto',
        toEnabled: false,
        to: this.map.getCenter()
      });
      this.intersectionWatcher();
      control.routePanel.getRouteAsync().then(function (route) {
        _this4.directions.init();

        _this4.directions.on('change', function (current, index) {
          route.setActiveRoute(current);
          _this4.current.index = index;
        });

        route.model.events.add('requestsuccess', function () {
          _this4.directions.clean();

          _this4.setCurrentRouteParams(route);

          _this4.buildDirections(route);

          _this4.directions.render();

          _this4.share.toggle(route.getActiveRoute() === null);

          route.getWayPoints().each(function (r) {
            var index = parseInt(r.properties.get('index'), 10);

            if (index === 0) {
              _this4.markers[index].properties.set('balloonContent', r.properties.get('address'));
            }
          });

          for (var _iterator = _createForOfIteratorHelperLoose(Array.from(route.model.getAllPoints()).entries()), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
                index = _step$value[0],
                point = _step$value[1];
            var coordinate = point.geometry.getCoordinates();

            _this4.markers[index].options.set('visible', coordinate !== null);

            if (coordinate !== null) {
              _this4.markers[index].geometry.setCoordinates(coordinate);
            }
          }
        });
        route.options.set({
          wayPointVisible: false
        });
      }, function (error) {// none
      });
    };

    _proto.setCurrentRouteParams = function setCurrentRouteParams(route) {
      var _this5 = this;

      var current = route.getActiveRoute(),
          points = route.getWayPoints();

      if (current !== null) {
        this.current.coords = [];
        points.each(function (point) {
          _this5.current.coords.push(point.geometry.getCoordinates());
        });
        Object.assign(this.current, {
          type: current.properties.get('type'),
          index: parseInt(current.properties.get('index'), 10)
        });
      } else {
        Object.assign(this.current, {
          coords: [],
          type: 'auto',
          index: 0
        });
      }
    };

    _proto.buildDirections = function buildDirections(route) {
      var _this6 = this;

      route.getRoutes().each(function (current) {
        var index = parseInt(current.properties.get('index'), 10);

        _this6.directions.build(current, Object.assign({}, current.properties.getAll(), {
          current: index === _this6.current.index
        }));

        current.events.add('click', function () {
          return _this6.directions.changeRoute(current, index);
        });
      });
    };

    _proto.requestUserLocation = function requestUserLocation() {
      var control = this.map.controls.get('routePanelControl');
      var location = ymaps.geolocation.get({
        provider: 'auto'
      });
      location.then(function (res) {
        var userTextLocation = res.geoObjects.get(0).properties.get('text');
        control.routePanel.state.set({
          from: userTextLocation
        });
      });
    };

    return _default;
  }(_default);

  var app = {
    version: '1.0.1',
    build: function build(container, options) {
      return new _default$5(container, options);
    }
  };

  return app;

}());
