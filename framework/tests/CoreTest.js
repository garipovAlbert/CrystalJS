/**
 * @requires CR.dev.AbstractUnitTest
 */

/**
 * @class CR.tests.CoreTest
 */
CR.define('CR.tests.CoreTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_core',
    testNs: function(){
        var me = this, ns;
        
        // check equality
        ns = CR.ns('My.yet.another.namespace');
        me.assertTrue('check equality', My.yet.another.namespace === ns);
        // check invariability
        CR.ns('My.yet.another.namespace');
        me.assertTrue('check invariability', My.yet.another.namespace === ns);
    },
    testCheckType: function(){
    // no need to check efficiency of this function because of it's simplicity.
    },
    testGetClass: function(){
        var me = this;
        
        // common
        (function(){
            var cls;
            // get class without namespace
            CR.define('MyClass', 'CR.Object', {});
            cls = CR.getClass('MyClass');
            me.assertTrue('class without namespace', cls === MyClass);
            // get class with namespace
            CR.define('Some.namespace.MyClass', 'CR.Object', {});
            cls = CR.getClass('Some.namespace.MyClass');
            me.assertTrue('class with namespace', cls === Some.namespace.MyClass);
        }());
        // class is undefined error
        (function(){
            me.checkException('class is undefined error' , function(){
                CR.getClass('MyUndefinedClass');
            }, CR.Error);
            me.checkException('class is undefined error (namespace)' , function(){
                CR.getClass('My.undefined.Class');
            }, CR.Error);
        }());
        // not a class error
        (function(){
            var ns = CR.ns('My.namespace');
            ns.notAClass1 = [];
            ns.notAClass2 = {};
            ns.notAClass3 = 1;
            ns.notAClass4 = '';
            ns.notAClass5 = null;
            ns.notAClass6 = undefined;
            me.checkException('not a class error 1' , function(){
                CR.getClass('My.namespace.notAClass1');
            }, CR.Error);
            me.checkException('not a class error 2' , function(){
                CR.getClass('My.namespace.notAClass2');
            }, CR.Error);
            me.checkException('not a class error 3' , function(){
                CR.getClass('My.namespace.notAClass3');
            }, CR.Error);
            me.checkException('not a class error 4' , function(){
                CR.getClass('My.namespace.notAClass4');
            }, CR.Error);
            me.checkException('not a class error 5' , function(){
                CR.getClass('My.namespace.notAClass5');
            }, CR.Error);
            me.checkException('not a class error 6' , function(){
                CR.getClass('My.namespace.notAClass6');
            }, CR.Error);
        }());
    },
    testPut: function(){
        var me = this, result, 
        o1 = {
            a: 1, 
            b: 2
        },
        o2 = {
            b: 3, 
            c: 4
        },
        o3 = {
            d: 5
        };
        
        // two objects
        result = CR.put(o1, o2);
        me.assertTrue('two objects: equality of o1 and result', o1 === result);
        me.assertFalse('two objects: equality of o1 and result', o2 === result);
        me.objectCompare('two objects: check values of o2', o2, {
            b: 3, 
            c: 4
        });
        me.objectCompare('two objects: check values of result', result, {
            a: 1,
            b: 3,
            c: 4
        });
        // three objects
        result = CR.put(o1, o2, o3);
        me.objectCompare('three objects: check values of result', result, {
            a: 1,
            b: 3,
            c: 4,
            d: 5
        });
    },
    testCls: function(){
        var me = this;
        
        // create a class
        (function(){
            // without namespace
            CR.define('MyClass', 'CR.Object', {});
            var o1 = new MyClass();
            me.assertTrue('create class', o1 instanceof MyClass);
            // with namespace
            CR.define('In.namespace.MyClass', 'CR.Object', {});
            var o2 = new In.namespace.MyClass();
            me.assertTrue('create class in namespace', o2 instanceof In.namespace.MyClass);
        })();
        // common inheritance
        (function(){
            CR.define('Test.Granddad', 'Object', {
                v1: 9,
                v2: 10,
                f1: function(){
                    return 1;
                },
                f3: function(){
                    return 5;
                }
            });
            CR.define('Test.Dad', 'Test.Granddad', {
                f1: function(){
                    return 2;
                },
                f2: function(){
                    return 4;
                }
            });
            CR.define('Test.Son', 'Test.Dad', {
                constructor: function(){
                    this.v2 = 55;
                },
                f1: function(){
                    return this.f2() + this.f3();
                }
            });
            var g = new Test.Granddad();
            var d = new Test.Dad();
            var s = new Test.Son();
            me.assertTrue('direct access to property', g.v1 === 9);
            me.assertTrue('inherited property', s.v1 === 9);
            me.assertTrue('function call', g.f1() === 1);
            me.assertTrue('overrided function', d.f1() === 2);
            me.assertTrue('extended function', d.f2() === 4);
            me.assertTrue('function inheritance', d.f3() === 5);
            me.assertTrue('cascade inheritance', s.f3() === 5);
            me.assertTrue('constructor', s.v2 === 55);
            me.assertTrue('call another function of a class', s.f1() === 9);
        })();
        // innerMap inheritance
        (function(){
            CR.define('Test.Granddad', 'CR.Object', {
                __override: {
                    one: CR.override.innerMap
                },
                one: {
                    a: 1,
                    b: 2
                }
            });
            CR.define('Test.Dad', 'Test.Granddad', {
                __override: {
                    two: CR.override.innerMap
                },
                two: {
                    a: 3
                }
            });
            CR.define('Test.Son', 'Test.Dad', {
                __override: {
                    three: CR.override.innerMap
                },
                one: {
                    a: 4,
                    c: 5
                },
                three: {
                    a: 6
                }
            });
            var g = new Test.Granddad();
            var d = new Test.Dad();
            var s = new Test.Son();
            me.objectCompare('innerMap inh.: g.one', g.one, {
                a: 1, 
                b: 2
            });
            me.objectCompare('innerMap inh.: d.one', d.one, {
                a: 1, 
                b: 2
            });
            me.objectCompare('innerMap inh.: d.two', d.two, {
                a: 3
            });
            me.objectCompare('innerMap inh.: s.one', s.one, {
                a: 4, 
                b: 2, 
                c: 5
            });
            me.objectCompare('innerMap inh.: s.two', s.two, {
                a: 3
            });
            me.objectCompare('innerMap inh.: s.three', s.three, {
                a: 6
            });
        })();
        // innerArray inheritance
        (function(){
            CR.define('Test.Granddad', 'CR.Object', {
                __override: {
                    a: CR.override.innerArray,
                    b: CR.override.innerArray
                },
                a: [0,1],
                b: [0]
            });
            CR.define('Test.Dad', 'Test.Granddad', {});
            CR.define('Test.Son', 'Test.Dad', {
                a: [1,2,3]
            });
            var g = new Test.Granddad();
            var d = new Test.Dad();
            var s = new Test.Son();
            me.arrayCompare('innerArray inh.: g.a', g.a, [0,1]);
            me.arrayCompare('innerArray inh.: g.b', g.b, [0]);
            me.arrayCompare('innerArray inh.: d.a', d.a, [0,1]);
            me.arrayCompare('innerArray inh.: d.b', d.b, [0]);
            me.assertTrue('innerArray inh.: d.c', d.c === undefined);
            me.arrayCompare('innerArray inh.: s.a', s.a, [0,1,2,3]);
            me.arrayCompare('innerArray inh.: s.b', s.b, [0]);
        })();
        // static properties
        (function(){
            var g, d, s;
            CR.define('Granddad', 'CR.Object', {
                __static: {
                    v1: 1,
                    v2: 2
                },
                inner: function(k){
                    return this._cls[k];
                }
            });
            CR.define('Dad', 'Granddad', {
                __static: {
                    v1: 3
                }
            });
            CR.define('Son', 'Dad', {
                __static: {
                    v2: 4,
                    v3: 5
                }
            });
            g = new Granddad();
            d = new Dad();
            s = new Son();
            // inner access
            me.assertTrue('static: g v1 inner', g.inner('v1') === 1);
            me.assertTrue('static: g v2 inner', g.inner('v2') === 2);
            me.assertTrue('static: g v3 inner', g.inner('v3') === undefined);
            me.assertTrue('static: d v1 inner', d.inner('v1') === 3);
            me.assertTrue('static: d v2 inner', d.inner('v2') === 2); // same
            me.assertTrue('static: d v3 inner', d.inner('v3') === undefined); // same
            me.assertTrue('static: s v1 inner', s.inner('v1') === 3); // same
            me.assertTrue('static: s v2 inner', s.inner('v2') === 4); //
            me.assertTrue('static: s v3 inner', s.inner('v3') === 5);
            // outer access
            me.assertTrue('static: g v1 outer', Granddad.v1 === 1);
            me.assertTrue('static: g v2 outer', Granddad.v2 === 2);
            me.assertTrue('static: g v3 outer', Granddad.v3 === undefined);
            me.assertTrue('static: d v1 outer', Dad.v1 === 3);
            me.assertTrue('static: d v2 outer', Dad.v2 === 2); // same
            me.assertTrue('static: d v3 outer', Dad.v3 === undefined); // same
            me.assertTrue('static: s v1 outer', Son.v1 === 3); // same
            me.assertTrue('static: s v2 outer', Son.v2 === 4); //
            me.assertTrue('static: s v3 outer', Son.v3 === 5);
        })();
    }
});