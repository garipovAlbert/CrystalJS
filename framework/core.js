/**
 * The global object (namespace) encapsulates all classes, functions 
 * provided by CrystalJS framework.
 */
var CR = {
    /**
     * Creates global objects (namespaces) to be used for containing classes, 
     * functions and data so that they are not global. 
     * By example, <code>CR.ns('My.namespace');</code> creates 
     * the global object 'My' which contains the variable 'namespace' with 
     * the object as the value, and this object to be returned by the function.
     * @param {string} ns The namespace name.
     * @return {Object} The namespace object.
     */
    ns: function(ns){
        var i, parts, obj;
        parts = ns.split('.'),
        obj = window[parts[0]] = window[parts[0]] || {};
        parts = parts.slice(1);
        for(i = 0; i < parts.length; i++){
            obj = obj[parts[i]] = obj[parts[i]] || {};
        }
        return obj;
    },
    /**
     * Checks type of the specified value.
     * @param {mixed} v The object which type is checked.
     * @param {string|class} t If the specified argument is a string
     * the type of the value is checked by the javascript operator 'typeof'.
     * Otherwise, the argument is considered as class and the value's type
     * is checked by the 'instanceof' operator.
     * @return {boolean}
     */
    type: function(v, t){
        return typeof(t) === 'string' ? typeof(v) === t : v instanceof t;
    },
    /**
     * Returns a class by the specified class name.
     * @param {string} n The class name with or without namespace
     * e.g. 'MyClass' or 'Some.namespace.MyClass'.
     * @return {class}
     * @throws {CR.Error} if an object with the specified name is undefined or 
     * not a constructor (function).
     */
    getClass: function(n){
        var i, 
        Class = window,
        parts = n.split('.');
        for(i = 0; i < parts.length; i++){
            if(!(parts[i] in Class)){
                throw new CR.Error('Class "'+n+'" is undefined.');
            }
            Class = Class[parts[i]];
        }
        if(typeof(Class) !== 'function'){
            throw new CR.Error('Object "'+n+'" is not a class.');
        }
        return Class;
    },
    /**
     * Copies all properties from one or several specified objects to another.
     * By example, <code>CR.put(o1, o2, o3);</code> first copies all properties 
     * from o2 then from o3 to o1.
     * @param {Object} to The target object. 
     * @param {Object} fromN The object from which properties is copied.
     * @return {Object} The target object (first argument).
     */
    put: function(to, fromN){
        var i, from, n;
        for(i = 1; i < arguments.length; i++){
            from = arguments[i];
            for(n in from)
                to[n] = from[n];
        }
        return to;
    },
    /**
     * Passes the argument to the 'console.log' function if console object 
     * is exists, otherwise to the 'alert' function.
     * @param {mixed} o
     */
    log: function(o){
        if(window['console'] !== undefined){
            console.log(o);
        }else{
            alert(o);
        }
    },
    /**
     * Defines a class.
     * @param {string} n The class name with or without namespace e.g. 
     * 'MyClass' or 'My.namespace.MyClass'
     * @param {string} [pN] The name of parent class that this class extends.
     * Defaults to 'CR.Object'.
     * @param {map} over Class properties.
     * @todo detailed description
     */
    define: function(n, pN, over){
        var Class, F, k, v, pos, dirs, Parent, pp, cp;
        
        if(arguments.length < 3){
            over = pN;
            pN = 'CR.Object';
        }
        
        Parent = this.getClass(pN);
        pp = Parent.prototype;
		
        // basic inheritance
        if(over.constructor !== Object.prototype.constructor){
            Class = over.constructor;
        }else{
            Class = function(){
                arguments.callee.__parent.apply(this, arguments);
            };
        }
        F = function(){};
        F.prototype = pp;
        Class.prototype = new F();
        cp = Class.prototype;
        cp.constructor = Class;
        for(k in over){
            v = over[k];
            cp[k] = v;
            // for the "parent" method
            if(typeof v === 'function'){
                v.__parent = pp[k];
            }
        }
        cp.constructor.__parent = pp.constructor;

        // inherit the "__override" directive
        cp.__override = this.put({}, pp.__override, cp.__override);
        
        // retrieve class system directives
        dirs = {};
        for(k in cp){
            if(k.substr(0, 2) == '__'){
                dirs[k] = cp[k];
            }
        }
	
        // process the "__override" directive
        if(pp.__override !== undefined){
            for(k in pp.__override){
                v = pp.__override[k];
                cp[k] = v(pp[k], over[k]);
            }
        }
        
        // set class property
        cp._cls = Class;
        Class.getName = function(){
            return n;
        };
        
        // process the "__static" directive
        if(cp['__static'] !== undefined){
            for(k in cp['__static']){
                if(Class[k] === undefined){
                    Class[k] = cp['__static'][k];
                }
            }
        }
        
        // put to namespace
        pos = n.lastIndexOf('.');
        if(pos === -1){
            window[n] = Class;
        }else{
            this.ns(n.substr(0, pos))[n.substr(pos+1)] = Class;
        }
    },
    /**
     * @todo write JsDoc
     */
    override: {
        innerMap: function(p, c){
            return c === undefined ? p : CR.put({}, p, c);
        },
        innerArray: function(p, c){
            var result = p.slice();
            if(c !== undefined){
                for(var i in c){
                    if(CR.Array.indexOf(c[i], result) === -1){
                        result.push(c[i]);
                    }
                }
            }
            return result;
        }
    },
    /**
     * Provides common array manipulation functions.
     */
    Array: {
        /**
         * Inserts the specified value in the specified array
         * at the specified index.
         * @param {Array} array The target array.
         * @param {Array} v The value to be inserted in the target array.
         * @param {int} [i] The index where the value should be inserted.
         * If the argument not specified the value will be inserted at the end of
         * the target array.
         * If the index exceed the last index of the target array, the value will
         * be inserted at the end.
         */
        insert: function(array, v, i){
            i !== undefined ? array.splice(i, 0, v) : array.push(v);
        },
        /**
         * Inserts one array into another at the specified position.
         * @param {Array} target The target array.
         * @param {Array} a The array to be inserted in the target array.
         * @param {int} [i] The index where the array should be inserted.
         * If the argument not specified the array will be inserted at the end of
         * the target array.
         * If the index exceed the last index of the target array, the array will
         * be inserted at the end.
         */
        insertArray: function(target, a, i){
            i !== undefined ? 
            Array.prototype.splice.apply(target, [i, 0].concat(a)) :
            Array.prototype.push.apply(target, a);
        },
        /**
         * Checks if the specified array has only unique values.
         * @param {Array} a The array to check.
         * @return {boolean}
         */
        isUnique: function(a){
            var unique = [];
            for(var i = 0; i < a.length; i++){
                if(this.indexOf(a[i], unique) === -1){
                    unique.push(a[i]);
                }else{
                    return false;
                }
            }
            return true;
        },
        /**
         * Checks if specified arrays has same values at same indexes.
         * @param {Array} a1 The first array.
         * @param {Array} a2 The second array.
         * @return {boolean}
         */
        compare: function(a1, a2){
            if(a1.length !== a2.length){
                return false;
            }
            for(var i = 0; i < a1.length; i++){
                if(a1[i] !== a2[i]){
                    return false;
                }
            }
            return true;
        },
        /**
         * Search for the specified value within an array and return its 
         * index or -1 if not found.
         * @param {mixed} elem The value to search for.
         * @param {Array} array An array through which to search.
         * @param {int} [i] The index of the array at which to begin the search. 
         * Defaults to 0.
         * @return {int}
         */
        indexOf: function(elem, array, i){
            var len;
            if (array){
                if(Array.prototype.indexOf){
                    return Array.prototype.indexOf.call(array, elem, i);
                }else{
                    len = array.length;
                    i = i ? (i < 0 ? Math.max(0, len + i) : i) : 0;
                    for (; i < len; i++) {
                        if (i in array && array[i] === elem){
                            return i;
                        }
                    }
                }
            }
            return -1;
        },
        /**
         * Creates an array from the specified object.
         * @param {Object}
         * @return {Array}
         */
        fromMap: function(map){
            var arr = [];
            Array.prototype.push.apply(arr, map);
            return arr;
        }
    },
    /**
     * Provides common string manipulation functions.
     */
    String: {
        /**
         * Makes a string's first character uppercase.
         * @param {string} s
         * @return {string}
         */
        cap: function(s){
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        /**
         * Makes a string's first character lowercase.
         * @param {string} s
         * @return {string}
         */
        uncap: function(s){
            return s.charAt(0).toLowerCase() + s.slice(1);
        },
        /**
         * Repeats the specified string.
         * @param {string} s The string to be repeated.
         * @param {int} times Number of time the specified string should be repeated.
         * @return {string}
         */
        repeat: function(s, times){
            return new Array(times + 1).join(s);
        }
    }
}

/**
 * @class CR.Object
 * Base class. Provides some utility methods for it's inheritors.
 */
CR.define('CR.Object', 'Object', {
    /**
     * @directive property overriding methods
     */
    __override: {
        // the '__static' property should be overrided by the 
        // 'innerMap' override method.
        __static: CR.override.innerMap
    },
    /**
     * Calls the same method of parent class with specified arguments 
     * and returns a result.
     * @return {mixed}
     */
    parent: function(){
        return arguments.callee.caller.__parent.apply(this, arguments);
    },
    /**
     * Returns a class of the object.
     * @return {class}
     */
    getClass: function(){
        return this._cls;
    }
});

/**
 * @class CR.AbstractError
 * The base class for all error classes provided by CrystalJS. 
 * Inherits JavaScript's Error.
 */
CR.define('CR.AbstractError', 'Error', {
    message: '',
    /**
     * @param {string} message The error message.
     * @param {CR.Object} [object] The object in which the error occurred.
     */
    constructor: function(message, object){
        this.message = message;
        if(object instanceof CR.Object){
            this.message += (' (class:'+object.getClass().getName()+')');
        }
    }
});

/**
 * @class CR.Error
 */
CR.define('CR.Error', 'CR.AbstractError', {
    name: 'CrystalJS Error'
});

/**
 * @class CR.TypeError
 */
CR.define('CR.TypeError', 'CR.Error', {
    name: 'CrystalJS TypeError'
});

/**
 * @class CR.RangeError.
 */
CR.define('CR.RangeError', 'CR.Error', {
    name: 'CrystalJS RangeError'
});