/**
 * @requires CR.dev.AbstractQUnitTest
 */

/**
 * @class CR.tests.CoreTest
 */
CR.define('CR.tests.CoreTest', 'CR.dev.AbstractQUnitTest', {
    _name: 'CR.core',
    testNs: function (assert) {
        // check equality
        ns = CR.ns('My.yet.another.namespace');
        assert.ok(My.yet.another.namespace === ns, 'check equality');

        // check invariability
        CR.ns('My.yet.another.namespace');
        assert.ok(My.yet.another.namespace === ns, 'check invariability');
    },
//	testCheckType: function (assert) {
//		// no need to check efficiency of this function because of it's simplicity.
//	},
    testPut: function (assert) {
        var result;
        var o1 = {
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
        assert.ok(o1 === result, 'two objects: equality of o1 and result');
        assert.ok(o2 !== result, 'two objects: equality of o2 and result');
        assert.propEqual(o2, {
            b: 3,
            c: 4
        }, 'two objects: check values of o2');
        assert.propEqual(result, {
            a: 1,
            b: 3,
            c: 4
        }, 'two objects: check values of result');

        // three objects
        result = CR.put(o1, o2, o3);
        assert.propEqual(result, {
            a: 1,
            b: 3,
            c: 4,
            d: 5
        }, 'three objects: check values of result');
    },
    testDefine: function (assert) {

        // create a class
        (function () {
            // without namespace
            CR.define('MyClass', 'CR.Object', {});
            var o1 = new MyClass();
            assert.ok(o1 instanceof MyClass, 'create class');
            // with namespace
            CR.define('In.namespace.MyClass', 'CR.Object', {});
            var o2 = new In.namespace.MyClass();
            assert.ok(o2 instanceof In.namespace.MyClass, 'create class in namespace');
        })();

        // common inheritance
        (function () {
            CR.define('Test.Granddad', 'Object', {
                v1: 9,
                v2: 10,
                f1: function () {
                    return 1;
                },
                f3: function () {
                    return 5;
                }
            });
            CR.define('Test.Dad', 'Test.Granddad', {
                f1: function () {
                    return 2;
                },
                f2: function () {
                    return 4;
                }
            });
            CR.define('Test.Son', 'Test.Dad', {
                constructor: function () {
                    this.v2 = 55;
                },
                f1: function () {
                    return this.f2() + this.f3();
                }
            });
            var g = new Test.Granddad();
            var d = new Test.Dad();
            var s = new Test.Son();
            assert.ok(g.v1 === 9, 'direct access to property');
            assert.ok(s.v1 === 9, 'inherited property');
            assert.ok(g.f1() === 1, 'function call');
            assert.ok(d.f1() === 2, 'overrided function');
            assert.ok(d.f2() === 4, 'extended function');
            assert.ok(d.f3() === 5, 'function inheritance');
            assert.ok(s.f3() === 5, 'cascade inheritance');
            assert.ok(s.v2 === 55, 'constructor');
            assert.ok(s.f1() === 9, 'call another function of a class');
        })();

        // innerMap inheritance
        (function () {
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
            assert.propEqual(g.one, {
                a: 1,
                b: 2
            }, 'innerMap inh.: g.one');
            assert.propEqual(d.one, {
                a: 1,
                b: 2
            }, 'innerMap inh.: d.one');
            assert.propEqual(d.two, {
                a: 3
            }, 'innerMap inh.: d.two');
            assert.propEqual(s.one, {
                a: 4,
                b: 2,
                c: 5
            }, 'innerMap inh.: s.one');
            assert.propEqual(s.two, {
                a: 3
            }, 'innerMap inh.: s.two');
            assert.propEqual(s.three, {
                a: 6
            }, 'innerMap inh.: s.three');
        })();

        // innerArray inheritance
        (function () {
            CR.define('Test.Granddad', 'CR.Object', {
                __override: {
                    a: CR.override.innerArray,
                    b: CR.override.innerArray
                },
                a: [0, 1],
                b: [0]
            });
            CR.define('Test.Dad', 'Test.Granddad', {});
            CR.define('Test.Son', 'Test.Dad', {
                a: [1, 2, 3]
            });
            var g = new Test.Granddad();
            var d = new Test.Dad();
            var s = new Test.Son();
            assert.deepEqual(g.a, [0, 1], 'innerArray inh.: g.a');
            assert.deepEqual(g.b, [0], 'innerArray inh.: g.b');
            assert.deepEqual(d.a, [0, 1], 'innerArray inh.: d.a');
            assert.deepEqual(d.b, [0], 'innerArray inh.: d.b');
            assert.ok(d.c === undefined, 'innerArray inh.: d.c');
            assert.deepEqual(s.a, [0, 1, 2, 3], 'innerArray inh.: s.a');
            assert.deepEqual(s.b, [0], 'innerArray inh.: s.b');
        })();

        // static properties
        (function () {
            var g, d, s;
            CR.define('Granddad', 'CR.Object', {
                __static: {
                    v1: 1,
                    v2: 2
                },
                inner: function (k) {
                    return this.Class[k];
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
            assert.ok(g.inner('v1') === 1, 'static: g v1 inner');
            assert.ok(g.inner('v2') === 2, 'static: g v2 inner');
            assert.ok(g.inner('v3') === undefined, 'static: g v3 inner');
            assert.ok(d.inner('v1') === 3, 'static: d v1 inner');
            assert.ok(d.inner('v2') === 2, 'static: d v2 inner'); // same
            assert.ok(d.inner('v3') === undefined, 'static: d v3 inner'); // same
            assert.ok(s.inner('v1') === 3, 'static: s v1 inner'); // same
            assert.ok(s.inner('v2') === 4, 'static: s v2 inner'); //
            assert.ok(s.inner('v3') === 5, 'static: s v3 inner');
            // outer access
            assert.ok(Granddad.v1 === 1, 'static: g v1 outer');
            assert.ok(Granddad.v2 === 2, 'static: g v2 outer');
            assert.ok(Granddad.v3 === undefined, 'static: g v3 outer');
            assert.ok(Dad.v1 === 3, 'static: d v1 outer');
            assert.ok(Dad.v2 === 2, 'static: d v2 outer'); // same
            assert.ok(Dad.v3 === undefined, 'static: d v3 outer'); // same
            assert.ok(Son.v1 === 3, 'static: s v1 outer'); // same
            assert.ok(Son.v2 === 4, 'static: s v2 outer');
            assert.ok(Son.v3 === 5, 'static: s v3 outer');
        })();
    },
    testGetClass: function (assert) {
        // common
        (function () {
            var cls;

            // get class without namespace
            CR.define('MyClass', 'CR.Object', {});
            cls = CR.getClass('MyClass');
            assert.ok(cls === MyClass, 'class without namespace');

            // get class with namespace
            CR.define('Some.namespace.MyClass', 'CR.Object', {});
            cls = CR.getClass('Some.namespace.MyClass');
            assert.ok(cls === Some.namespace.MyClass, 'class with namespace');
        }());

        // class is undefined error
        (function () {
            assert.throws(function () {
                CR.getClass('MyUndefinedClass');
            }, CR.Error, 'class is undefined error');

            assert.throws(function () {
                CR.getClass('My.undefined.Class');
            }, CR.Error, 'class is undefined error (namespace)');
        }());

        // not a class error
        (function () {
            var ns = CR.ns('My.namespace');
            ns.notAClass1 = [];
            ns.notAClass2 = {};
            ns.notAClass3 = 1;
            ns.notAClass4 = '';
            ns.notAClass5 = null;
            ns.notAClass6 = undefined;

            for (var i = 1; i <= 6; i++) {
                assert.throws(function () {
                    CR.getClass('My.namespace.notAClass' + i);
                }, CR.Error, 'not a class error ' + i);
            }
        }());
    }
});