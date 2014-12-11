
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
			if (typeof (me[method]) === 'function' && method.indexOf('test') === 0) {
				name = method.substr(4);
				name = CR.String.uncap(name);
				me._tests_[name] = me[method];
			}
		}

		if (autorun) {
			me.run();
		}
	},
	run: function () {
		var me = this;
		QUnit.module(this._name);
		for (var testName in me._tests_) {
			(function (testName) {
				QUnit.test(testName, function (assert) {
					me._tests_[testName].apply(me, [assert]);
				});
			}(testName));
		}
	},
	/**
	 * This method is called before running the tests.
	 * Override it at your discretion.
	 */
	_before: function () {
	},
	/**
	 * This method is called after running the tests.
	 * Override it at your discretion.
	 */
	_after: function () {
	}
});