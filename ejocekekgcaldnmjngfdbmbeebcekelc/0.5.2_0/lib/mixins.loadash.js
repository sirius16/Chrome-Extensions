/**
 * Created by Daniel on 2/10/14.
 */
_.mixin({
    // Receive a number and it's limits and return a determined number
    keepWithinRange: function(number, min, max) {
        if (Number.isNaN(number)) {
            return min;
        } else if (number > max) {
            return max;
        } else if (number < min) {
            return min;
        }
        return number;
    },
    // Execute function not more than once every X milliseconds, otherwise return cached result.
    cacheFor: function(wait, fn) {
        return _.throttle(fn, wait, { trailing: false });
    },
    // Return a copy of an object containing all but the blacklisted properties.
    unpick: function (obj) {
        obj = obj || {};
        return _.pick(obj, _.difference(_.keys(obj), _.flatten(Array.prototype.slice.call(arguments, 1))));
    },
    // Create an object from two mapping functions
    mapObject: function(input, keyMapper, valueMapper, context) {
        return _.object(
            _.map(input, keyMapper , context),
            _.map(input, valueMapper, context)
        );
    },
    // Create an object from two mapping functions
    verifyCallback: function(callback) {
        return _.isFunction(callback) ? callback : $.noop;
    },
    toString: function(value) {
        return !value ? '' : value.toString();
    },
    capitalize: function(str) {
      str = (str == null) ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    camelCase: (function() {
        var rSeparator = /[-_]+([^-_])[-_]*/g;
        var toUpperCase = function($0, $1) {
            return $1.toUpperCase();
        };
        return function(str) {
            str = (str == null) ? '' : String(str);
            return str.replace(rSeparator, toUpperCase);
        };
    }()),
    tryFor: function(tries, fn, endFn) {
        endFn = _.isFunction(endFn) ? endFn : function() {};
        return _.isNumber(tries) && _.isFunction(fn) && (function() {
            (--tries >= 0 ? fn : endFn).apply(this, arguments);
        });
    },
    cachePromise: function(fn, wait) {
        var getPromise;

        if (!_.isNumber(wait)) {
            wait = 1000 * 60 * 30;
        }

        function breakPromise() {
            getPromise = null;
        }

        function cachePromise() {
            var args = arguments;
            getPromise = _.cacheFor(wait, function() {
                return fn.apply(null ,args);
            });
        }

        function getCachedPromise() {
            if (!getPromise) cachePromise.apply(this, arguments);
            return getPromise().fail(breakPromise);
        }
        
        return Object.defineProperties(getCachedPromise, {
            "break"  : {
                value: breakPromise
            },
            "refresh": {
                value: function() {
                    breakPromise();
                    return getCachedPromise.apply(this, arguments);
                }
            }
        });
    },
    whenOnline: function(fn, context) {
        return function() {
            var args = arguments;
            context = context || this;
            if (navigator.onLine) {
                fn.apply(context, args);
            } else {
                window.addEventListener('online', function online() {
                    fn.apply(context, args);
                    window.removeEventListener('online', online);
                });
            }
        };
    },
    digest: function(scope) {
        try {
            scope.$digest();
        } catch(e) {}
    },
    format: function(str, obj) {
        obj = Object(obj);
        return String(str).replace(/{([^{}]+)}/g, function(match, key) {
            return obj[key] || '';
        });
    },
    compactObject: function(o) {
        _.each(o, function(v, k) {
            if(!v) {
                delete o[k];
            }
        });
        return o;
    }
});