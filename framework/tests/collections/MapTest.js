/**
 * @requires CR.dev.AbstractQUnitTest
 * @requires CR.collections.Map
 */

/**
 * @class CR.tests.collections.MapTest
 */
CR.define('CR.tests.collections.MapTest', 'CR.dev.AbstractQUnitTest', {
    _name: 'CR.collections.Map',
    testGet: function (assert) {
        var map, typedMap, k1, o1, k2, o2;

        // non-typed map
        map = new CR.collections.Map();
        k1 = 'My object 0';
        k2 = 'My object 1';
        o1 = new Object();
        o2 = new Object();
        map.put(k1, o1);
        map.put(k2, o2);
        assert.ok(map.get(k1) === o1, 'value 1');
        assert.ok(map.get(k2) === o2, 'value 2');
        assert.throws(function () {
            map.get('my non-existen object');
        }, 'key not exists');

        // typed map
        typedMap = new CR.collections.Map(Object, Object);
        typedMap.put(o1, o2);
        assert.ok(typedMap.get(o1) === o2, 'value (typed map)');
    },
    testPut: function (assert) {
        // type check (non-typed)
        (function () {
            var map = new CR.collections.Map();
            var o = new Object();
            var a = [];
            map.put(1, o);
            map.put(a, 'Hello!');
            assert.ok(map.get(1) === o, 'non-typed');
            assert.ok(map.get(a) === 'Hello!', 'non-typed');
        }());

        // type check (typed)
        (function () {
            var map = new CR.collections.Map(Array, 'string');
            var a0 = [];
            var a1 = [];
            map.put('string0', a0);
            map.put('string1', a1);
            assert.ok(map.get('string0') === a0, 'typed');
            assert.ok(map.get('string1') === a1, 'typed');
            assert.throws(function () {
                map.put('string0', new Date());
            }, CR.TypeError, 'type mismatch (value)');
            assert.throws(function () {
                map.put(1, a1);
            }, CR.TypeError, 'type mismatch (key)');
        }());

        // argument is not specified
        (function () {
            var map = new CR.collections.Map();
            assert.throws(function () {
                map.put('string0');
            }, CR.Error, 'argument is not specified (value)');
            assert.throws(function () {
                map.put();
            }, CR.Error, 'argument is not specified (key)');
        }());

        // undefined arguments
        (function () {
            var map = new CR.collections.Map();
            map.put(undefined, 3);
            assert.ok(map.get(undefined) === 3, 'undefined key');
            assert.ok(map.getSize() === 1, 'undefined key (size)');
            map.put(3, undefined);
            assert.ok(map.get(3) === undefined, 'undefined value');
            assert.ok(map.getSize() === 2, 'undefined value (size)');
        }());

        // rewriting values of keys
        (function () {
            var map = new CR.collections.Map(Array, 'string');
            var a0 = [];
            var a1 = [];
            map.put('string', a0);
            map.put('string', a1);
            assert.ok(map.get('string') === a1, 'rewriting values');
        }());
    },
    testHasKey: function (assert) {
        var map = new CR.collections.Map();
        map.put('key', new Object());
        assert.ok(map.hasKey('key'), 'existing key');
        assert.ok(map.hasKey('another key') === false, 'not existing key');
    },
    testRemove: function (assert) {
        var map = new CR.collections.Map(Array, 'string');
        var a0 = [];
        var a1 = [];
        map.put('one', a0);
        map.put('two', a1);
        map.put('three', a0);
        map.remove(a0);
        assert.ok(map.hasKey('one') === false);
        assert.ok(map.hasKey('three') === false);
        assert.ok(map.hasKey('two'));
        assert.ok(map.getSize() === 1);
        map.remove(a1);
        assert.ok(map.getSize() === 0);
    },
    testRemoveKey: function (assert) {
        var map = new CR.collections.Map(Array, 'string');
        var a0 = [];
        var a1 = [];
        map.put('one', a0);
        map.put('two', a1);
        map.put('three', a0);
        map.removeKey('three');
        assert.ok(map.hasKey('one'));
        assert.ok(map.hasKey('two'));
        assert.ok(map.hasKey('three') === false);
        assert.ok(map.getSize() === 2);
        assert.throws(function () {
            map.removeKey('four');
        }, CR.Error, 'key not exists');
    },
    testGetKeys: function (assert) {
        var keys;
        var map = new CR.collections.Map(Array, 'string');
        var a0 = [];
        var a1 = [];
        map.put('one', a0);
        map.put('two', a1);
        map.put('three', a0);
        keys = map.getKeys();
        assert.ok(keys[0] === 'one');
        assert.ok(keys[1] === 'two');
        assert.ok(keys[2] === 'three');
        assert.ok(keys.length === 3, 'length');
        map.remove(a0);
        keys = map.getKeys();
        assert.ok(keys[0] === 'two', 'after remove');
        assert.ok(keys.length === 1, 'length after remove');
    },
    testPutObject: function (assert) {
        // common
        (function () {
            var map = new CR.collections.Map('string', 'string');
            var object = {
                'k1': 'v1',
                'k2': 'v2'
            };
            map.put('k0', 'v0');
            map.putObject(object);
            assert.ok(map.get('k0') === 'v0');
            assert.ok(map.get('k1') === 'v1');
            assert.ok(map.get('k2') === 'v2');
            assert.ok(map.getSize() === 3, 'size');
        }());

        // argument's type check
        (function () {
            var map = new CR.collections.Map(Array, 'string');
            assert.throws(function () {
                map.putObject(1);
            }, CR.TypeError, 'argument\'s type');
            assert.ok(map.getSize() === 0, 'argument\'s type (check size)');
        }());

        // item's type check
        (function () {
            var map = new CR.collections.Map(Array, 'string');
            assert.throws(function () {
                map.putObject({
                    'hello!': 1
                });
            }, CR.TypeError, 'item\'s type');
            assert.ok(map.getSize() === 0, 'items\'s type (check size)');
        }());

        // unable to use non-string keys
        (function () {
            // non-string type of key
            var map = new CR.collections.Map(Array, Array);
            map.put([], []);
            assert.throws(function () {
                map.putObject({
                    1: []
                });
            }, CR.TypeError, 'not string keys');
            assert.throws(function () {
                map.putObject({});
            }, CR.TypeError, 'not string keys (empty object)');
            assert.ok(map.getSize() === 1, 'not string keys (check size)');
            // free type of key
            map = new CR.collections.Map();
            map.putObject({
                1: []
            });
        }());

        // override values
        (function () {
            var map = new CR.collections.Map();
            map.put('k0', 'v0');
            map.put('k1', 'v1');
            map.put('k2', 'v2');
            map.putObject({
                'k1': 'vv1',
                'k2': 'vv2',
                'k3': 'vv3'
            });
            assert.ok(map.get('k0') === 'v0', 'override values');
            assert.ok(map.get('k1') === 'vv1', 'override values');
            assert.ok(map.get('k2') === 'vv2', 'override values');
            assert.ok(map.get('k3') === 'vv3', 'override values');
            assert.ok(map.getSize() === 4, 'override values (size)');
        }());

        // undefined values
        (function () {
            var map = new CR.collections.Map();
            map.put('k0', 'v0');
            map.put('k1', 'v1');
            map.put('k2', 'v2');
            map.putObject({
                'k0': undefined,
                'k1': undefined
            });
            map.put('k0', 'vv0');
            assert.ok(map.get('k0') === 'vv0', 'undefined values');
            assert.ok(map.get('k1') === undefined, 'undefined values');
            assert.ok(map.get('k2') === 'v2', 'undefined values');
            assert.ok(map.getSize() === 3, 'undefined values (size)');
        }());
    },
    testPutMap: function (assert) {
        // common
        (function () {
            var map = new CR.collections.Map('string', 'string');
            var addedMap = new CR.collections.Map('string', 'string');
            map.put('k0', 'v0');
            addedMap.put('k1', 'v1');
            addedMap.put('k2', 'v2');
            map.putMap(addedMap);
            assert.ok(map.get('k0') === 'v0', 'common');
            assert.ok(map.get('k1') === 'v1', 'common');
            assert.ok(map.get('k2') === 'v2', 'common');
            assert.ok(map.getSize() === 3, 'common (size)');
        }());

        // argument's type check
        (function () {
            var map = new CR.collections.Map('string', 'string');
            assert.throws(function () {
                map.putMap(new String());
            }, CR.TypeError, 'type of argument');
        }());

        // type of key
        (function () {
            var map = new CR.collections.Map('string', 'string');
            var addedMap = new CR.collections.Map('string', Object);
            assert.throws(function () {
                map.putMap(addedMap);
            }, CR.TypeError, 'type of key');
            addedMap.put({}, 'str');
            assert.throws(function () {
                map.putMap(addedMap);
            }, CR.TypeError, 'type of key (not empty map)');
            assert.ok(map.getSize() === 0, 'type of key (size)');
            // free type
            var free = new CR.collections.Map('string');
            free.putMap(addedMap);
        }());

        // type of value
        (function () {
            var free;
            var map = new CR.collections.Map('string', 'string');
            var addedMap = new CR.collections.Map(Object, 'string');
            assert.throws(function () {
                map.putMap(addedMap);
            }, CR.TypeError, 'type of value');
            addedMap.put('str', {});
            assert.throws(function () {
                map.putMap(addedMap);
            }, CR.TypeError, 'type of value (not empty map)');
            assert.ok(map.getSize() === 0, 'type of value (size)');
            //free type
            free = new CR.collections.Map(undefined, 'string');
            free.putMap(addedMap);
        }());

        // rewrite values
        (function () {
            var map = new CR.collections.Map('string', 'string');
            var addedMap = new CR.collections.Map('string', 'string');
            map.put('k0', 'v0');
            map.put('k1', 'v1');
            addedMap.put('k1', 'vv1');
            addedMap.put('k2', 'vv2');
            map.putMap(addedMap);
            assert.ok(map.get('k0') === 'v0', 'rewrite values');
            assert.ok(map.get('k1') === 'vv1', 'rewrite values');
            assert.ok(map.get('k2') === 'vv2', 'rewrite values');
            assert.ok(map.getSize() === 3, 'rewrite values (size)');
        }());
    },
    testClone: function (assert) {
        var map = new CR.collections.Map();
        var three = [];
        var o = {};
        map.put(1, o);
        map.put('two', 2);
        map.put(three, o);
        var clone = map.clone();
        assert.ok(clone.get(1) === o);
        assert.ok(clone.get('two') === 2);
        assert.ok(clone.get(three) === o);
        assert.ok(clone.getSize() === 3, 'size');
        // independence
        map.put(1, 'one');
        assert.ok(clone.get(1) === o, 'after change');
        clone.put(three, 3);
        assert.ok(map.get(three) === o, 'after change');
    },
    test_chainable: function (assert) {
        var map = new CR.collections.Map();
        assert.ok(map.put(1, 1) === map, 'put()');
        assert.ok(map.putObject({2: 2}) === map, 'putObject()');
        assert.ok(map.putMap(new CR.collections.Map()) === map, 'putMap()');
        assert.ok(map.remove(1) === map, 'remove()');
        assert.ok(map.removeKey('2') === map, 'removeKey()');
    }
});