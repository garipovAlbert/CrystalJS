/**
 * @requires CR.dev.AbstractQUnitTest
 */

/**
 * @class CR.tests.ArrayTest
 */
CR.define('CR.tests.ArrayTest', 'CR.dev.AbstractQUnitTest', {
    _name: 'CR.Array',
    testInsert: function (assert) {
        var me = this;
        // insert at the middle
        (function () {
            var a = ['a', 'b', 'c'];
            CR.Array.insert(a, 'x', 1);
            assert.deepEqual(a, ['a', 'x', 'b', 'c'], 'middle: target array ' + a);
        }());
        // insert at the begin
        (function () {
            var a = ['a', 'b', 'c'];
            CR.Array.insert(a, 'x', 0);
            assert.deepEqual(a, ['x', 'a', 'b', 'c'], 'middle: target array ' + a);
        }());
        // insert at the end
        (function () {
            var a = ['a', 'b', 'c'];
            CR.Array.insert(a, 'x', 3);
            assert.deepEqual(a, ['a', 'b', 'c', 'x'], 'middle: target array ' + a);
        }());
        // insert at the exceeding index
        (function () {
            var a = ['a', 'b', 'c'];
            CR.Array.insert(a, 'x', 10);
            assert.deepEqual(a, ['a', 'b', 'c', 'x'], 'middle: target array ' + a);
        }());
        // the index is not specified
        (function () {
            var a = ['a', 'b', 'c'];
            CR.Array.insert(a, 'x');
            assert.deepEqual(a, ['a', 'b', 'c', 'x'], 'middle: target array ' + a);
        }());
    },
    testInsertArray: function (assert) {
        var me = this;
        // insert at the middle
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['x', 'y', 'z'];
            CR.Array.insertArray(a1, a2, 1);
            assert.deepEqual(a2, ['x', 'y', 'z'], 'middle: inserted array ' + a2);
            assert.deepEqual(a1, ['a', 'x', 'y', 'z', 'b', 'c'], 'middle: target array ' + a1);
        }());
        // insert at the begin
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['x', 'y', 'z'];
            CR.Array.insertArray(a1, a2, 0);
            assert.deepEqual(a2, ['x', 'y', 'z'], 'begin: inserted array ' + a2);
            assert.deepEqual(a1, ['x', 'y', 'z', 'a', 'b', 'c'], 'begin: target array ' + a1);
        }());
        // insert at the end
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['x', 'y', 'z'];
            CR.Array.insertArray(a1, a2, 3);
            assert.deepEqual(a2, ['x', 'y', 'z'], 'end: inserted array ' + a2);
            assert.deepEqual(a1, ['a', 'b', 'c', 'x', 'y', 'z'], 'end: target array ' + a1);
        }());
        // insert at the exceeding index
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['x', 'y', 'z'];
            CR.Array.insertArray(a1, a2, 8);
            assert.deepEqual(a2, ['x', 'y', 'z'], 'end: inserted array ' + a2);
            assert.deepEqual(a1, ['a', 'b', 'c', 'x', 'y', 'z'], 'end: target array ' + a1);
        }());
        // the index is not specified
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['x', 'y', 'z'];
            CR.Array.insertArray(a1, a2);
            assert.deepEqual(a2, ['x', 'y', 'z'], 'end: inserted array ' + a2);
            assert.deepEqual(a1, ['a', 'b', 'c', 'x', 'y', 'z'], 'end: target array ' + a1);
        }());
    },
    testIsUnique: function (assert) {
        var unique = ['a', 'b', 'c'];
        assert.ok(CR.Array.isUnique(unique), 'unique');
        var notUnique = ['a', 'b', 'c', 'a'];
        assert.ok(CR.Array.isUnique(notUnique) === false, 'not unique');
    },
    testCompare: function (assert) {
        // identical arrays
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['a', 'b', 'c'];
            assert.ok(CR.Array.compare(a1, a2), 'identical');
        }());

        // non-identical arrays (same length)
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['a', 'b', 'd'];
            assert.ok(CR.Array.compare(a1, a2) === false, 'non-identical (same length)');
        }());

        // non-identical arrays (different length)
        (function () {
            var a1 = ['a', 'b', 'c'];
            var a2 = ['a', 'b'];
            assert.ok(CR.Array.compare(a1, a2) === false, 'non-identical (different length)');
        }());
    }
//    testIndexOf: function(){
//        
//    },
//    testFromMap: function(){
//        
//    }
});

