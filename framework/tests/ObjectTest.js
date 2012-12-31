/**
 * @requires CR.dev.AbstractUnitTest
 */

/**
 * @class CR.tests.Object
 */
CR.define('CR.tests.ObjectTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_Object',
    testParent: function(){
        var g, d, s;
        CR.define('Granddad', 'CR.Object', {
            method1: function(){
                return 1;
            },
            method2: function(){
                return 2;
            },
            method3: function(num){
                return ++num;
            }
        });
        CR.define('Dad', 'Granddad', {
            construct: function(){
                this.parent();
            },
            method1: function(){
                return this.parent();
            },
            method3: function(num){
                return this.parent(num);
            }
        });
        CR.define('Son', 'Dad', {
            construct: function(){
                this.parent();
            },
            method2: function(){
                return this.parent();
            }
        });
        g = new Granddad();
        d = new Dad();
        s = new Son();
        this.assertTrue('parent call: near inh. Granddad>Dad', d.method1() === 1);
        this.assertTrue('parent call: far inh. Granddad>...>Son', s.method2() === 2);
        this.assertTrue('parent call: pass arguments', d.method3(5) === 6);
    },
    testGetClass: function(){
        CR.define('Test.MyClass', 'CR.Object', {});
        var object = new Test.MyClass();
        var Class = object.getClass();
        this.assertTrue('object.getClass()', Class === Test.MyClass);
        var className = Class.getName();
        this.assertTrue('Class.getName()', className === 'Test.MyClass');
    }
});