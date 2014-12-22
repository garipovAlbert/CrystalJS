/**
 * @requires CR.tests.collections.ListTest
 * @requires CR.collections.UniqueList
 */

/**
 * @class CR.tests.collections.UniqueListTest
 */
CR.define('CR.tests.collections.UniqueListTest', 'CR.tests.collections.ListTest', {
    _name: 'CR.collections.UniqueList',
    _getClass_: function (assert) {
        return CR.collections.UniqueList;
    },
    testGet: function (assert) {
        this.super(assert);
    },
    testGetSize: function (assert) {
        this.super(assert);
    },
    testAdd: function (assert) {
        this.super(assert);

        var cls = this._getClass_();
        // re-adding
        var uList;
        uList = new cls('string');
        uList.add('my not unique string');
        assert.throws(function () {
            uList.add('my not unique string');
        }, CR.Error, 're-adding');
    },
    testAddList: function (assert) {
        var cls = this._getClass_();

        // common
        (function () {
            var list, addedList, o0, o1, o2,
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
                list.addList(new cls(), 40);
            }, CR.RangeError, 'index is out of range');
        }());

        // repetition error
        (function () {
            var list, uList;
            // value repetition
            uList = new cls('string');
            uList.add('one');
            uList.add('two');
            list = new CR.collections.List('string');
            list.add('one');
            assert.throws(function () {
                uList.addList(list);
            }, 'repetition');
            // repetition in the added list only
            uList = new cls('string');
            list = new CR.collections.List('string');
            list.add('one');
            list.add('two');
            list.add('one');
            assert.throws(function () {
                uList.addList(list);
            }, 'repetition in the added');
        }());
    },
    testAddArray: function (assert) {
        this.super(assert);

        var cls = this._getClass_();

        // repetition error
        (function () {
            var array, uList;
            //value repetition
            uList = new cls('string');
            uList.add('one');
            uList.add('two');
            array = ['one', 'two'];
            assert.throws(function () {
                uList.addArray(array);
            }, 'repetition');
            //repetition in the added array only
            uList = new cls('string');
            uList.add('one');
            array = ['one', 'two', 'two'];
            assert.throws(function () {
                uList.addArray(array);
            }, CR.Error, 'repetition in added');
        }());
    },
    testIndexOf: function (assert) {
        var cls = this._getClass_();
        var list = new cls(Object);
        var o0 = new Object();
        var o1 = new Object();
        list.add(o0);
        list.add(o1);
        assert.ok(list.indexOf(o0) === 0);
        assert.ok(list.indexOf(o1) === 1);
    },
    testSet: function (assert) {
        this.super(assert);

        var cls = this._getClass_();

        // repetition error
        (function () {
            var uList;
            uList = new cls('string');
            uList.add('one');
            uList.add('two');
            // repetition
            assert.throws(function () {
                uList.set(1, 'one');
            }, CR.Error, 'repetition');
            // repetition on the same position
            assert.throws(function () {
                uList.set(0, 'one');
            }, CR.Error, 'repetition on same');
        }());
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
        };
        preset();
        list.remove(o0);
        assert.ok(list.get(0) === o1);
        assert.ok(list.getSize() === 1);
        preset();
        list.remove(o2);
        assert.ok(list.getSize() === 2, 'remove nothing');
    },
    testRemoveAt: function (assert) {
        this.super(assert);
    },
    testToArray: function (assert) {
        this.super(assert);
    },
    testClear: function (assert) {
        this.super(assert);
    },
    testClone: function (assert) {
        this.super(assert);
    },
    test_chainable: function (assert) {
        this.super(assert);

        var cls = this._getClass_();
        var uList = new cls();
        uList.add(1);
        assert.ok(uList.move(1, 0) === uList, 'move()');
    },
    testMove: function (assert) {
        var uList, arr;
        var cls = this._getClass_();
        var preset = function () {
            uList = new cls('string');
            uList.addArray(['a', 'b', 'c']);
        };
        // a -> 1
        preset();
        uList.move('a', 1);
        assert.deepEqual(uList.toArray(), ['b', 'a', 'c'], 'a -> 1');
        // c -> 1
        preset();
        uList.move('c', 1);
        assert.deepEqual(uList.toArray(), ['a', 'c', 'b'], 'c -> 1');
        // b -> 2
        preset();
        uList.move('b', 2);
        assert.deepEqual(uList.toArray(), ['a', 'c', 'b'], 'b -> 2');
        // a -> 3. Out of range
        preset();
        assert.throws(function () {
            uList.move('a', 3);
        }, CR.RangeError, 'a -> 3. Out of range');
        // b -> -1. Out of range
        preset();
        assert.throws(function () {
            uList.move('b', -1);
        }, CR.RangeError, 'b -> -1. Out of range error');
        // d -> 1. Not an item
        preset();
        assert.throws(function () {
            uList.move('d', 1);
        }, CR.Error, 'd -> 1. Not an item error');
    }
});



