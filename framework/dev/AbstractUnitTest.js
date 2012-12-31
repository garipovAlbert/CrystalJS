/**
 * @requires webroot.jsunit.app.jsUnitCore
 */

/**
 * @class CR.dev.AbstractUnitTest
 * The abstract class that provides base functionality for unit test classes.
 * Requires JsUnit library.
 */
CR.define('CR.dev.AbstractUnitTest', 'CR.Object', {
    _tests_: null,
    _currentTestName_: null,
    /** 
     * @property {string} The test name.
     * Usually it is the name of a tested class where dots replaced 
     * with underscore. By example, name of a test for 
     * the class CR.utils.Color is 'CR_utils_color'.
     */
    _name: null,
    /**
     * Runs the test.
     */
    constructor: function(){
        var me = this, name, method;
        me._tests_ = {};
        for(method in me){
            if(typeof(me[method]) === 'function' && method.indexOf('test') === 0){
                name = method.substr(4);
                name = CR.String.uncap(name);
                me._tests_[name] = me[method];
            }
        }
        // register test
        window['test_'+me._name] = function(){
            me._before.apply(me);
            for(var testName in me._tests_){
                me._currentTestName_ = testName;
                me._tests_[testName].apply(me);
                me._currentTestName_ = null;
            }
            me._after.apply(me);
        };
    },
    /**
     * This method is called before running the tests.
     * Override it at your discretion.
     */
    _before: function(){
    },
    /**
     * This method is called after running the tests.
     * Override it at your discretion.
     */
    _after: function(){
    },
    /**
     * Checks if the specified value is true.
     * @param {string} [comment]
     * The user's comment what is shown when the assertion fails.
     * @param {boolean} v The value to be checked.
     */
    assertTrue: function(comment, v){
        if(v === undefined){
            v = comment;
            window['assertTrue']('['+this._currentTestName_+']', v);
        }else{
            window['assertTrue']('['+this._currentTestName_+'] '+comment, v);
        }
    },
    /**
     * Asserts that the specified value is false.
     * @param {string} [comment]
     * The user's comment what is shown when the assertion fails.
     * @param {boolean} v The value to be checked.
     */
    assertFalse: function(comment, v){
        if(v === undefined){
            v = comment;
            window['assertFalse']('['+this._currentTestName_+']', v);
        }else{
            window['assertFalse']('['+this._currentTestName_+'] '+comment, v);
        }
    },
    /**
     * Asserts that specified values equals.
     * @param {string} [comment]
     * The user's comment what is shown when the assertion fails.
     * @param {mixed} v1 The first value.
     * @param {mixed} v2 The second value.
     */
    assertEquals: function(comment, v1, v2){
        if(v2 === undefined){
            v1 = comment;
            v2 = v1;
            window['assertEquals']('['+this._currentTestName_+']', v1, v2);
        }else{
            window['assertEquals']('['+this._currentTestName_+'] '+comment, v1, v2);
        }
    },
    /**
     * Asserts that specified values not equals.
     * @param {string} [comment]
     * The user's comment what is shown when the assertion fails.
     * @param {mixed} v1 The first value.
     * @param {mixed} v2 The second value.
     */
    assertNotEquals: function(comment, v1, v2){
        if(v2 === undefined){
            v1 = comment;
            v2 = v1;
            window['assertNotEquals']('['+this._currentTestName_+']', v1, v2);
        }else{
            window['assertNotEquals']('['+this._currentTestName_+'] '+comment, v1, v2);
        }
    },
    /**
     * Asserts the throwing of an exception from the specified function.
     * @param {string} [comment]
     * The user's comment what is shown when the assertion fails.
     * @param {Function} func The function that throws an exception.
     * @param {class} [cls] The class of a throwed exception.
     * By default Error.
     */
    checkException: function(comment, func, cls){
        var msg, f, errorMessage;
        if(typeof(comment) === 'function'){
            cls = func;
            func = comment;
            msg = '['+this._currentTestName_+']';
        }else{
            msg = '['+this._currentTestName_+'] '+comment;
        }
        if(cls === undefined){
            cls = Error;
        }
        try{
            func.apply(this);
            f = true;
        }catch(e){
            if(e instanceof cls){
                f = false;
            }else{
                f = true;
                msg+=' {e type mismatch}';
            }
            errorMessage = e.message;
        }
        f && fail(msg);
        return errorMessage;
    },
    /**
     * Asserts that two arrays have same values at same indexes.
     * @param {string} [comment]
     * The user's comment what is shown when the assertion fails.
     * @param {Array} a1 The first array.
     * @param {Array} a2 The second array.
     */
    arrayCompare: function(comment, a1, a2){
        if(a2 === undefined){
            a1 = comment;
            a2 = a1;
        }
        if(!CR.type(a1, Array)){
            throw new CR.Error('UnitTest(arrayCompare): 1st argument is not an array');
        }
        if(!CR.type(a2, Array)){
            throw new CR.Error('UnitTest(arrayCompare): 2nd argument is not an array');
        }
        var isEqual = (function(){
            if(a1.length !== a2.length){
                return false;
            }
            for(var i = 0; i < a1.length; i++){
                if(a1[i] !== a2[i]){
                    return false;
                }
            }
            return true;
        }());
        if(!isEqual){
            window['fail']('['+this._currentTestName_+'] '+comment);
        }
    },
    /**
     * Asserts that two objects have same values and same keys.
     * @param {string} [comment]
     * The user's comment what is shown when the assertion fails.
     * @param {Object} o1 The first object.
     * @param {Object} o2 The second object.
     */
    objectCompare: function(comment, o1, o2){
        if(o2 === undefined){
            o1 = comment;
            o2 = o1;
        }
        var isEqual = (function(){
            var k;
            for(k in o1){
                if(o1[k] !== o2[k]){
                    return false;
                }
            }
            for(k in o2){
                if(o2[k] !== o1[k]){
                    return false;
                }
            }
            return true;
        }());
        if(!isEqual){
            window['fail']('['+this._currentTestName_+'] '+comment);
        }
    }
});