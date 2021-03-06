/**
 * @requires CR.dev.AbstractQUnitTest
 */

/**
 * @class CR.tests.Object
 */
CR.define('CR.tests.ObjectTest', 'CR.dev.AbstractQUnitTest', {
    _name: 'CR.Object',
    'test super()': function (assert) {
        var g, d, s;
        CR.define('Granddad', 'CR.Object', {
            method1: function () {
                return 1;
            },
            method2: function () {
                return 2;
            },
            method3: function (num) {
                return ++num;
            }
        });
        CR.define('Dad', 'Granddad', {
            construct: function () {
                this.super();
            },
            method1: function () {
                return this.super();
            },
            method3: function (num) {
                return this.super(num);
            }
        });
        CR.define('Son', 'Dad', {
            construct: function () {
                this.super();
            },
            method2: function () {
                return this.super();
            }
        });
        g = new Granddad();
        d = new Dad();
        s = new Son();
        assert.ok(d.method1() === 1, 'parent call: near inh. Granddad>Dad');
        assert.ok(s.method2() === 2, 'parent call: far inh. Granddad>...>Son');
        assert.ok(d.method3(5) === 6, 'parent call: pass arguments');
    },
    'test getClass()': function (assert) {
        CR.define('Test.MyClass', 'CR.Object', {});
        var object = new Test.MyClass();
        var Class = object.getClass();
        assert.ok(Class === Test.MyClass, 'object.getClass()');
        var className = Class.getName();
        assert.ok(className === 'Test.MyClass', 'Class.getName()');
    }
});