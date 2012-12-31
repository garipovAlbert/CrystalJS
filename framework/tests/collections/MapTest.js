/**
 * @requires CR.dev.AbstractUnitTest
 * @requires CR.collections.Map
 */

/**
 * @class CR.tests.collections.MapTest
 */
CR.define('CR.tests.collections.MapTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_collections_Map',
    testGet: function(){
        var me = this, map, typedMap, k1, o1, k2, o2;
        // non-typed map
        map = new CR.collections.Map();
        k1 = 'My object 0';
        k2 = 'My object 1';
        o1 = new Object();
        o2 = new Object();
        map.put(k1, o1);
        map.put(k2, o2);
        me.assertTrue('value 1', map.get(k1) === o1);
        me.assertTrue('value 2', map.get(k2) === o2);
        me.checkException('key not exists', function(){
            map.get('my non-existen object');
        });
        // typed map
        typedMap = new CR.collections.Map(Object, Object);
        typedMap.put(o1, o2);
        me.assertTrue('value (typed map)', typedMap.get(o1) === o2);
    },
    testPut: function(){
        var me = this;
        // type check (non-typed)
        (function(){
            var map = new CR.collections.Map(),
            o = new Object(), 
            a = [];
            map.put(1, o);
            map.put(a, 'Hello!');
            me.assertTrue('non-typed', map.get(1) === o);
            me.assertTrue('non-typed', map.get(a) === 'Hello!');
        }());
        // type check (typed)
        (function(){
            var map = new CR.collections.Map(Array, 'string'),
            a0 = [],
            a1 = [];
            map.put('string0', a0);
            map.put('string1', a1);
            me.assertTrue('typed', map.get('string0') === a0);
            me.assertTrue('typed', map.get('string1') === a1);
            me.checkException('type mismatch (value)', function(){
                map.put('string0', new Date());
            }, CR.TypeError);
            me.checkException('type mismatch (key)', function(){
                map.put(1, a1);
            }, CR.TypeError);
        }());
        // argument is not specified
        (function(){
            var map = new CR.collections.Map();
            me.checkException('argument is not specified (value)', function(){
                map.put('string0');
            }, CR.Error);
            me.checkException('argument is not specified (key)', function(){
                map.put();
            }, CR.Error);
        }());
        // undefined arguments
        (function(){
            var map = new CR.collections.Map();
            map.put(undefined, 3);
            me.assertTrue('undefined key', map.get(undefined) === 3);
            me.assertTrue('undefined key (size)', map.getSize() === 1);
            map.put(3, undefined);
            me.assertTrue('undefined value', map.get(3) === undefined);
            me.assertTrue('undefined value (size)', map.getSize() === 2);
        }());
        // rewriting values of keys
        (function(){
            var map = new CR.collections.Map(Array, 'string'),
            a0 = [],
            a1 = [];
            map.put('string', a0);
            map.put('string', a1);
            me.assertTrue('rewriting values', map.get('string') === a1);
        }());
    },
    testHasKey: function(){
        var me = this, 
        map = new CR.collections.Map();
        map.put('key', new Object());
        me.assertTrue('existing key', map.hasKey('key'));
        me.assertFalse('not existing key', map.hasKey('another key'));
    },
    testRemove: function(){
        var me = this,
        map = new CR.collections.Map(Array, 'string'),
        a0 = [],
        a1 = [];
        map.put('one', a0);
        map.put('two', a1);
        map.put('three', a0);
        map.remove(a0);
        me.assertFalse(map.hasKey('one'));
        me.assertFalse(map.hasKey('three'));
        me.assertTrue(map.hasKey('two'));
        me.assertTrue(map.getSize() === 1);
        map.remove(a1);
        me.assertTrue(map.getSize() === 0);
    },
    testRemoveKey: function(){
        var me = this, 
        map = new CR.collections.Map(Array, 'string'),
        a0 = [],
        a1 = [];
        map.put('one', a0);
        map.put('two', a1);
        map.put('three', a0);
        map.removeKey('three');
        me.assertTrue(map.hasKey('one'));
        me.assertTrue(map.hasKey('two'));
        me.assertFalse(map.hasKey('three'));
        me.assertTrue(map.getSize() === 2);
        me.checkException('key not exists', function(){
            map.removeKey('four');
        }, CR.Error);
    },
    testGetKeys: function(){
        var me = this, keys,
        map = new CR.collections.Map(Array, 'string'),
        a0 = [],
        a1 = [];
        map.put('one', a0);
        map.put('two', a1);
        map.put('three', a0);
        keys = map.getKeys();
        me.assertTrue(keys[0] === 'one');
        me.assertTrue(keys[1] === 'two');
        me.assertTrue(keys[2] === 'three');
        me.assertTrue('length', keys.length === 3);
        map.remove(a0);
        keys = map.getKeys();
        me.assertTrue('after remove', keys[0] === 'two');
        me.assertTrue('length after remove', keys.length === 1);
    },
    testPutObject: function(){
        var me = this;
        // common
        (function(){
            var map = new CR.collections.Map('string', 'string'),
            object = {
                'k1': 'v1', 
                'k2': 'v2'
            };
            map.put('k0', 'v0')
            map.putObject(object);
            me.assertTrue(map.get('k0') === 'v0');
            me.assertTrue(map.get('k1') === 'v1');
            me.assertTrue(map.get('k2') === 'v2');
            me.assertTrue('size', map.getSize() === 3);
        }());
        // argument's type check
        (function(){
            var map = new CR.collections.Map(Array, 'string');
            me.checkException('argument\'s type', function(){
                map.putObject(1);
            }, CR.TypeError);
            me.assertTrue('argument\'s type (check size)', map.getSize() === 0);
        }());
        // item's type check
        (function(){
            var map = new CR.collections.Map(Array, 'string');
            me.checkException('item\'s type', function(){
                map.putObject({
                    'hello!':1
                });
            }, CR.TypeError);
            me.assertTrue('items\'s type (check size)', map.getSize() === 0);
        }());
        // unable to use non-string keys
        (function(){
            // non-string type of key
            var map = new CR.collections.Map(Array, Array);
            map.put([], []);
            me.checkException('not string keys', function(){
                map.putObject({
                    1:[]
                });
            }, CR.TypeError);
            me.checkException('not string keys (empty object)', function(){
                map.putObject({});
            }, CR.TypeError);
            me.assertTrue('not string keys (check size)', map.getSize() === 1);
            // free type of key
            map = new CR.collections.Map();
            map.putObject({
                1:[]
            });
        }());
        // override values
        (function(){
            var map = new CR.collections.Map();
            map.put('k0', 'v0');
            map.put('k1', 'v1');
            map.put('k2', 'v2');
            map.putObject({
                'k1': 'vv1',
                'k2': 'vv2',
                'k3': 'vv3'
            });
            me.assertTrue('override values', map.get('k0') === 'v0');
            me.assertTrue('override values', map.get('k1') === 'vv1');
            me.assertTrue('override values', map.get('k2') === 'vv2');
            me.assertTrue('override values', map.get('k3') === 'vv3');
            me.assertTrue('override values (size)', map.getSize() === 4);
        }());
        // undefined values
        (function(){
            var map = new CR.collections.Map();
            map.put('k0', 'v0');
            map.put('k1', 'v1');
            map.put('k2', 'v2');
            map.putObject({
                'k0': undefined,
                'k1': undefined
            });
            map.put('k0', 'vv0');
            me.assertTrue('undefined values', map.get('k0') === 'vv0');
            me.assertTrue('undefined values', map.get('k1') === undefined);
            me.assertTrue('undefined values', map.get('k2') === 'v2')
            me.assertTrue('undefined values (size)', map.getSize() === 3);
        }());
    },
    testPutMap: function(){
        var me = this;
        // common
        (function(){
            var map = new CR.collections.Map('string', 'string'),
            addedMap = new CR.collections.Map('string', 'string');
            map.put('k0', 'v0');
            addedMap.put('k1', 'v1');
            addedMap.put('k2', 'v2');
            map.putMap(addedMap);
            me.assertTrue('common', map.get('k0') === 'v0');
            me.assertTrue('common', map.get('k1') === 'v1');
            me.assertTrue('common', map.get('k2') === 'v2');
            me.assertTrue('common (size)', map.getSize() === 3);
        }());
        // argument's type check
        (function(){
            var map = new CR.collections.Map('string', 'string');
            me.checkException('type of argument', function(){
                map.putMap(new String());
            }, CR.TypeError);
        }());
        // type of key
        (function(){
            var map = new CR.collections.Map('string', 'string'),
            addedMap = new CR.collections.Map('string', Object);
            me.checkException('type of key', function(){
                map.putMap(addedMap);
            }, CR.TypeError);
            addedMap.put({}, 'str');
            me.checkException('type of key (not empty map)', function(){
                map.putMap(addedMap);
            }, CR.TypeError);
            me.assertTrue('type of key (size)', map.getSize() === 0);
            // free type
            var free = new CR.collections.Map('string');
            free.putMap(addedMap);
        }());
        // type of value
        (function(){
            var free,
            map = new CR.collections.Map('string', 'string'),
            addedMap = new CR.collections.Map(Object, 'string');
            me.checkException('type of value', function(){
                map.putMap(addedMap);
            }, CR.TypeError);
            addedMap.put('str', {});
            me.checkException('type of value (not empty map)', function(){
                map.putMap(addedMap);
            }, CR.TypeError);
            me.assertTrue('type of value (size)', map.getSize() === 0);
            //free type
            free = new CR.collections.Map(undefined, 'string');
            free.putMap(addedMap);
        }());
        // rewrite values
        (function(){
            var map = new CR.collections.Map('string', 'string'),
            addedMap = new CR.collections.Map('string', 'string');
            map.put('k0', 'v0');
            map.put('k1', 'v1');
            addedMap.put('k1', 'vv1');
            addedMap.put('k2', 'vv2');
            map.putMap(addedMap);
            me.assertTrue('rewrite values', map.get('k0') === 'v0');
            me.assertTrue('rewrite values', map.get('k1') === 'vv1');
            me.assertTrue('rewrite values', map.get('k2') === 'vv2');
            me.assertTrue('rewrite values (size)', map.getSize() === 3);
        }());
    },
    testClone: function(){
        var me = this,
        map = new CR.collections.Map(),
        three = [],
        o = {};
        map.put(1, o);
        map.put('two', 2);
        map.put(three, o);
        var clone = map.clone();
        me.assertTrue(clone.get(1) === o);
        me.assertTrue(clone.get('two') === 2);
        me.assertTrue(clone.get(three) === o);
        me.assertTrue('size', clone.getSize() === 3);
        // independence
        map.put(1, 'one');
        me.assertTrue('after change', clone.get(1) === o);
        clone.put(three, 3);
        me.assertTrue('after change', map.get(three) === o);
    },
    test_chainable: function(){
        var me = this,
        map = new CR.collections.Map();
        me.assertTrue('put()', map.put(1,1) === map);
        me.assertTrue('putObject()', map.putObject({
            2: 2
        }) === map);
        me.assertTrue('putMap()', map.putMap(new CR.collections.Map()) === map);
        me.assertTrue('remove()', map.remove(1) === map);
        me.assertTrue('removeKey()', map.removeKey('2') === map);
    }
});