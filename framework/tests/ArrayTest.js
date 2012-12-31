/**
 * @requires CR.dev.AbstractUnitTest
 */

/**
 * @class CR.tests.ArrayTest
 */
CR.define('CR.tests.ArrayTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_Array',
    testInsert: function(){
        var me = this;
        // insert at the middle
        (function(){
            var a = ['a','b','c'];
            CR.Array.insert(a, 'x', 1);
            me.arrayCompare('middle: target array '+a, a, ['a','x','b','c']);
        }());
        // insert at the begin
        (function(){
            var a = ['a','b','c'];
            CR.Array.insert(a, 'x', 0);
            me.arrayCompare('middle: target array '+a, a, ['x','a','b','c']);
        }());
        // insert at the end
        (function(){
            var a = ['a','b','c'];
            CR.Array.insert(a, 'x', 3);
            me.arrayCompare('middle: target array '+a, a, ['a','b','c','x']);
        }());
        // insert at the exceeding index
        (function(){
            var a = ['a','b','c'];
            CR.Array.insert(a, 'x', 10);
            me.arrayCompare('middle: target array '+a, a, ['a','b','c','x']);
        }());
        // the index is not specified
        (function(){
            var a = ['a','b','c'];
            CR.Array.insert(a, 'x');
            me.arrayCompare('middle: target array '+a, a, ['a','b','c','x']);
        }());
    },
    testInsertArray: function(){
        var me = this;
        // insert at the middle
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['x','y','z'];
            CR.Array.insertArray(a1, a2, 1);
            me.arrayCompare('middle: inserted array '+a2, a2, ['x','y','z']);
            me.arrayCompare('middle: target array '+a1, a1, ['a','x','y','z','b','c']);
        }());
        // insert at the begin
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['x','y','z'];
            CR.Array.insertArray(a1, a2, 0);
            me.arrayCompare('begin: inserted array '+a2, a2, ['x','y','z']);
            me.arrayCompare('begin: target array '+a1, a1, ['x','y','z','a','b','c']);
        }());
        // insert at the end
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['x','y','z'];
            CR.Array.insertArray(a1, a2, 3);
            me.arrayCompare('end: inserted array '+a2, a2, ['x','y','z']);
            me.arrayCompare('end: target array '+a1, a1, ['a','b','c','x','y','z']);
        }());
        // insert at the exceeding index
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['x','y','z'];
            CR.Array.insertArray(a1, a2, 8);
            me.arrayCompare('end: inserted array '+a2, a2, ['x','y','z']);
            me.arrayCompare('end: target array '+a1, a1, ['a','b','c','x','y','z']);
        }());
        // the index is not specified
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['x','y','z'];
            CR.Array.insertArray(a1, a2);
            me.arrayCompare('end: inserted array '+a2, a2, ['x','y','z']);
            me.arrayCompare('end: target array '+a1, a1, ['a','b','c','x','y','z']);
        }());
    },
    testIsUnique: function(){
        var unique = ['a', 'b', 'c'];
        this.assertTrue('unique', CR.Array.isUnique(unique));
        var notUnique = ['a', 'b', 'c', 'a'];
        this.assertFalse('unique', CR.Array.isUnique(notUnique));
    },
    testCompare: function(){
        var me = this;
        // identical arrays
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['a','b','c'];
            me.assertTrue('identical', CR.Array.compare(a1, a2));
        }());
        // non-identical arrays (same length)
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['a','b','d'];
            me.assertFalse('non-identical (same length)', CR.Array.compare(a1, a2));
        }());
        // non-identical arrays (different length)
        (function(){
            var a1 = ['a','b','c'];
            var a2 = ['a','b'];
            me.assertFalse('non-identical (different length)', CR.Array.compare(a1, a2));
        }());
    },
    testIndexOf: function(){
        
    },
    testFromMap: function(){
        
    }
});

