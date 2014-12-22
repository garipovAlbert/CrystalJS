/**
 * @requires CR.dev.AbstractQUnitTest
 * @requires CR.collections.List
 */

/**
 * @class CR.tests.collections.ListTest
 */
CR.define('CR.tests.collections.ListTest', 'CR.dev.AbstractQUnitTest', {
    _name: 'CR.collections.List',
    _getClass_: function (assert) {
        return CR.collections.List;
    },
    testGet: function (assert) {
        var cls = this._getClass_(), list;
        // non-typed list
        list = new cls;
        list.add(0);
        list.add(1);
        assert.ok(list.get(0) === 0 && list.get(1) === 1, 'value check');
        assert.throws(function () {
            list.get(2);
        }, CR.RangeError, 'out of range');
        assert.throws(function () {
            list.get(-1);
        }, CR.RangeError, 'index out of range');
        // typed list
        list = new cls(Array);
        var a = [];
        list.add(a);
        assert.strictEqual(list.get(0), a, 'value check (typed list)');
    },
    testGetSize: function (assert) {
        var me = this, cls = this._getClass_(),
            list = new cls();
        list.add(0);
        list.add(1);
        assert.ok(list.getSize() === 2);
    },
    testAdd: function (assert) {
        var cls = this._getClass_(), list;

        // type check (simple type)
        list = new cls('string');
        list.add('Hello!');
        assert.throws(function () {
            list.add(1);
        }, CR.TypeError, 'type mismatch (simple)');

        // type check (class)
        list = new cls(Array);
        list.add([]);
        assert.throws(function () {
            list.add(new String());
        }, CR.TypeError, 'type mismatch (class)');
        assert.ok('size after type mismatch exception', list.getSize() === 1);

        // undefined value
        list = new cls();
        list.add(undefined);
        assert.ok(list.get(0) === undefined, 'undefined value');
        assert.ok(list.getSize() === 1, 'undefined value (size)');

        // add at index
        list = new cls('string');
        list.add('one');
        list.add('two', 0);
        assert.ok(list.get(0) === 'two', 'at index');
        assert.ok(list.get(1) === 'one', 'at index');
        assert.throws(function () {
            list.add('three', 2);
        }, CR.RangeError, 'index out of range');
        assert.throws(function () {
            list.add('three', -1);
        }, CR.RangeError, 'index out of range (negative value)');
        assert.throws(function () {
            list.add('three', 'hi!');
        }, CR.RangeError, 'index out of range (NaN)');
    },
    testAddList: function (assert) {
        var list, addedList, o0, o1, o2,
            cls = this._getClass_(),
            preset = function () {
                list = new cls(Array);
                o0 = new Array();
                list.add(o0);
                addedList = new cls(Array);
                o1 = new Array();
                o2 = new Array();
                addedList.add(o1);
                addedList.add(o2);
            };

        // add to end
        preset();
        list.addList(addedList);
        assert.ok(list.get(0) === o0, 'add to end 0');
        assert.ok(list.get(1) === o1, 'add to end 1');
        assert.ok(list.get(2) === o2, 'add to end 2');
        assert.ok(list.getSize() === 3, 'add to end (size)');

        // insert at index
        preset();
        list.addList(addedList, 0);
        assert.ok(list.get(0) === o1, 'insert at index 0');
        assert.ok(list.get(1) === o2, 'insert at index 1');
        assert.ok(list.get(2) === o0, 'insert at index 2');
        assert.ok(list.getSize() === 3, 'insert at index (size)');
        preset();
        assert.throws(function () {
            list.addList(list, 40);
        }, CR.RangeError, 'index is out of range');
    },
    testAddArray: function (assert) {
        var list, array, o0, o1, o2,
            cls = this._getClass_(),
            preset = function () {
                list = new cls(Object);
                o0 = new Object();
                list.add(o0);
                o1 = new Object();
                o2 = new Object();
                array = [o1, o2];
            };

        //add to end
        preset();
        list.addArray(array);
        assert.ok(list.get(0) === o0, 'add to end');
        assert.ok(list.get(1) === o1, 'add to end');
        assert.ok(list.get(2) === o2, 'add to end');
        assert.ok(list.getSize() === 3, 'add to end (size)');

        //insert at index
        preset();
        list.addArray(array, 0);
        assert.ok(list.get(0) === o1, 'insert at index');
        assert.ok(list.get(1) === o2, 'insert at index');
        assert.ok(list.get(2) === o0, 'insert at index)');
        assert.ok(list.getSize() === 3, 'insert at index (size)');

        //array with an undefined values
        preset();
        assert.throws(function () {
            list.addArray([o0, undefined, o2], 0);
        }, CR.Error, 'unedfined values exception');
        preset();
        assert.throws(function () {
            list.addArray([o0, undefined, o2]);
        }, CR.Error, 'unedfined values exception');

        //index is out of range
        preset();
        assert.throws(function () {
            list.addArray(array, 40);
        }, CR.RangeError, 'index is out of range');
    },
    testIndexOf: function (assert) {
        var cls = this._getClass_();
        var list = new cls(Object);
        var o0 = new Object();
        var o1 = new Object();
        list.add(o0);
        list.add(o1);
        list.add(o0);
        list.add(o1);
        assert.ok(list.indexOf(o0) === 0);
        assert.ok(list.indexOf(o1) === 1);
    },
    testSet: function (assert) {
        var list, o0, o1,
            cls = this._getClass_(),
            preset = function () {
                list = new cls(Object);
                o0 = new Object();
                o1 = new Object();
                list.add(o0);
            };
        preset();
        list.set(0, o1);
        assert.ok(list.get(0) === o1);
        preset();
        assert.throws(function () {
            list.set(1, o1);
        }, CR.RangeError, 'out of range');
        preset();
        assert.throws(function () {
            list.set(0, 444);
        }, CR.TypeError, 'type mismatch');
        preset();
        assert.throws(function () {
            list.set(0, undefined);
        }, CR.Error, 'undefined value');
    },
    testRemove: function (assert) {
        var list, o0, o1, o2;
        var cls = this._getClass_();
        var preset = function () {
            list = new cls(Object);
            o0 = new Object();
            o1 = new Object();
            o2 = new Object();
            list.add(o0);
            list.add(o1);
            list.add(o0);
        };
        preset();
        list.remove(o1);
        assert.ok(list.get(0) === o0);
        assert.ok(list.get(1) === o0);
        assert.ok(list.getSize() === 2);
        preset();
        list.remove(o0);
        assert.ok(list.get(0) === o1, 'multiple remove');
        assert.ok(list.getSize() === 1, 'multiple remove');
        preset();
        list.remove(o2);
        assert.ok(list.getSize() === 3, 'remove nothing');
    },
    testRemoveAt: function (assert) {
        var list, o0, o1;
        var cls = this._getClass_();
        var preset = function () {
            list = new cls(Object);
            o0 = new Object();
            o1 = new Object();
            list.add(o0);
            list.add(o1);
        };
        preset();
        list.removeAt(0);
        assert.ok(list.get(0) === o1);
        assert.ok(list.getSize() === 1);
        preset();
        assert.throws(function () {
            list.removeAt(2);
        }, CR.RangeError, 'out of range');
    },
    testToArray: function (assert) {
        var me = this, array,
            cls = this._getClass_(),
            list = new cls('number');
        list.add(0);
        list.add(1);
        array = list.toArray();
        assert.ok(array.length === 2);
        assert.ok(array[0] === 0);
        assert.ok(array[1] === 1);
    },
    testClear: function (assert) {
        var cls = this._getClass_();
        var list = new cls('number');
        list.add(0);
        list.add(1);
        list.add(3);
        list.clear();
        assert.ok(list.getSize() === 0);
    },
    testClone: function (assert) {
        var cls = this._getClass_();
        var list = new cls();
        var three = [];
        list.add(1);
        list.add('two');
        list.add(three);
        var clone = list.clone();
        assert.ok(clone.get(0) === 1, 'check value 0');
        assert.ok(clone.get(1) === 'two', 'check value 1');
        assert.ok(clone.get(2) === three, 'check value 2');
        assert.ok(clone.getSize() === 3, 'size');
        //independence
        list.set(0, 'hello');
        assert.ok(clone.get(0) === 1, 'after change');
        clone.set(2, []);
        assert.ok(list.get(2) === three, 'after change');
    },
    test_chainable: function (assert) {
        var cls = this._getClass_();
        var list = new cls();
        assert.ok(list.add(1) === list, 'add()');
        assert.ok(list.add(3) === list, 'add()');
        assert.ok(list.addList(new cls()) === list, 'addList()');
        assert.ok(list.addArray([]) === list, 'addArray()');
        assert.ok(list.set(0, 2) === list, 'set()');
        assert.ok(list.remove(3) === list, 'remove()');
        assert.ok(list.removeAt(0) === list, 'removeAt()');
    }
});