/**
 * @requires CR.dev.AbstractUnitTest
 */

/**
 * @class CR.tests.StringTest
 */
CR.define('CR.tests.StringTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_String',
    testCap: function(){
        var capitalized = CR.String.cap('myString');
        this.assertTrue(capitalized === 'MyString');
    },
    testUnCap: function(){
        var capitalized = CR.String.uncap('MyString');
        this.assertTrue(capitalized === 'myString');
    },
    testRepeat: function(){
        var repeated;
        repeated = CR.String.repeat('qw', 3);
        this.assertTrue('3 times', repeated === 'qwqwqw');
        repeated = CR.String.repeat('string', 0);
        this.assertTrue('0 times', repeated === '');
        repeated = CR.String.repeat('', 5);
        this.assertTrue('empty string', repeated === '');
    }
});