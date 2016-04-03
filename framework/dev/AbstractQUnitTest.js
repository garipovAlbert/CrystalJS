
/**
 * @class CR.dev.AbstractUnitTest
 * The abstract class that provides base functionality for unit test classes.
 * Requires JsUnit library.
 */
CR.define('CR.dev.AbstractQUnitTest', 'CR.Object', {
    _tests_: null,
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
    constructor: function (autorun) {
        var me = this, name, method;

        if (autorun === undefined) {
            autorun = true;
        }

        me._tests_ = {};
        for (method in me) {
            if (typeof (me[method]) === 'function') {
                if (method.indexOf('test') === 0 && method !== 'test') {
                    name = CR.String.uncap(method.substr('test'.length)).trim();
                    me._tests_[name] = me[method];
                }
                if (method.indexOf('asyncTest') === 0 && method !== 'asyncTest') {
                    name = CR.String.uncap(method.substr('asyncTest'.length)).trim();
                    me[method].async = true;
                    me._tests_[name] = me[method];
                }
                if (method.indexOf('customTest') === 0 && method !== 'customTest') {
                    name = CR.String.uncap(method.substr('customTest'.length)).trim();
                    me[method]['customTest'] = true;
                    me._tests_[name] = me[method];
                }
            }
        }

        if (autorun) {
            me.run();
        }
    },
    run: function () {
        var me = this;
        QUnit.module(this._name, {
            'setup': function () {
                me._before();
            },
            'teardown': function () {
                me._after();
            }
        });
        for (var testName in me._tests_) {
            (function (testName) {
                if (me._tests_[testName].async) {
                    QUnit.asyncTest(testName, function (assert) {
                        me._tests_[testName].call(me, assert, testName);
                    });
                } else if (me._tests_[testName].customTest) {
                    me._tests_[testName].call(me, testName);
                } else {
                    QUnit.test(testName, function (assert) {
                        me._tests_[testName].call(me, assert, testName);
                    });
                }
            }(testName));
        }
    },
    /**
     * Runs before each test.
     * Override it at your discretion.
     */
    _before: function () {
    },
    /**
     * Runs after each test.
     * Override it at your discretion.
     */
    _after: function () {
    }
});