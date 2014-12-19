/**
 * @requires CR.dev.AbstractQUnitTest
 */

/**
 * @class CR.tests.StringTest
 */
CR.define('CR.tests.StringTest', 'CR.dev.AbstractQUnitTest', {
	_name: 'CR.String',
	testCap: function (assert) {
		var capitalized = CR.String.cap('myString');
		assert.ok(capitalized === 'MyString');
	},
	testUnCap: function (assert) {
		var capitalized = CR.String.uncap('MyString');
		assert.ok(capitalized === 'myString');
	},
	testRepeat: function (assert) {
		var repeated;
		repeated = CR.String.repeat('qw', 3);
		assert.ok(repeated === 'qwqwqw', '3 times');
		repeated = CR.String.repeat('string', 0);
		assert.ok(repeated === '', '0 times');
		repeated = CR.String.repeat('', 5);
		assert.ok(repeated === '', 'empty string');
	}
});