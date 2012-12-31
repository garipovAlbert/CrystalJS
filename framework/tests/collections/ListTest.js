/**
 * @requires CR.dev.AbstractUnitTest
 * @requires CR.collections.List
 */

/**
 * @class CR.tests.collections.ListTest
 */
CR.define('CR.tests.collections.ListTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_collections_List',
    _getClass_: function(){
        return CR.collections.List;
    },
    testGet: function(){
        var me = this, cls = this._getClass_(), list;
        // non-typed list
        list = new cls;
        list.add(0);
        list.add(1);
        me.assertTrue('value check', list.get(0) === 0 && list.get(1) === 1);
        me.checkException('out of range', function(){
            list.get(2);
        }, CR.RangeError);
        me.checkException('index out of range', function(){
            list.get(-1);
        }, CR.RangeError);
        // typed list
        list = new cls(Array);
        var a = [];
        list.add(a);
        me.assertEquals('value check (typed list)', list.get(0), a);
    },
    testGetSize: function(){
        var me = this, cls = this._getClass_(),
        list = new cls();
        list.add(0);
        list.add(1);
        me.assertTrue(list.getSize() === 2);
    },
    testAdd: function(){
        var me = this, cls = this._getClass_(), list;
        // type check (simple type)
        list = new cls('string');
        list.add('Hello!');
        me.checkException('type mismatch (simple)', function(){
            list.add(1);
        }, CR.TypeError);
        // type check (class)
        list = new cls(Array);
        list.add([]);
        me.checkException('type mismatch (class)', function(){
            list.add(new String());
        }, CR.TypeError);
        me.assertTrue('size after type mismatch exception', list.getSize() === 1);
        // undefined value
        list = new cls();
        list.add(undefined);
        me.assertTrue('undefined value', list.get(0) === undefined);
        me.assertTrue('undefined value (size)', list.getSize() === 1);
        // add at index
        list = new cls('string');
        list.add('one');
        list.add('two', 0);
        me.assertTrue('at index', list.get(0) === 'two');
        me.assertTrue('at index', list.get(1) === 'one');
        me.checkException('index out of range', function(){
            list.add('three', 2);
        }, CR.RangeError);
        me.checkException('index out of range (negative value)', function(){
            list.add('three', -1);
        }, CR.RangeError);
        me.checkException('index out of range (NaN)', function(){
            list.add('three', 'hi!');
        }, CR.RangeError);
    },
    testAddList: function(){
        var me = this, list, addedList, o0, o1, o2,
        cls = this._getClass_(),
        preset = function(){
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
        me.assertTrue('add to end 0', list.get(0) === o0);
        me.assertTrue('add to end 1', list.get(1) === o1);
        me.assertTrue('add to end 2', list.get(2) === o2);
        me.assertTrue('add to end (size)', list.getSize() === 3);
        // insert at index
        preset();
        list.addList(addedList, 0);
        me.assertTrue('insert at index 0', list.get(0) === o1);
        me.assertTrue('insert at index 1', list.get(1) === o2);
        me.assertTrue('insert at index 2', list.get(2) === o0);
        me.assertTrue('insert at index (size)', list.getSize() === 3);
        preset();
        me.checkException('index is out of range', function(){
            list.addList(list, 40);
        }, CR.RangeError);
    },
    testAddArray: function(){
        var me = this, list, array, o0, o1, o2,
        cls = this._getClass_(),
        preset = function(){
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
        me.assertTrue('add to end', list.get(0) === o0);
        me.assertTrue('add to end', list.get(1) === o1);
        me.assertTrue('add to end', list.get(2) === o2);
        me.assertTrue('add to end (size)', list.getSize() === 3);
        //insert at index
        preset();
        list.addArray(array, 0);
        me.assertTrue('insert at index', list.get(0) === o1);
        me.assertTrue('insert at index', list.get(1) === o2);
        me.assertTrue('insert at index)', list.get(2) === o0);
        me.assertTrue('insert at index (size)', list.getSize() === 3);
        //array with an undefined values
        preset();
        me.checkException('unedfined values exception', function(){
            list.addArray([o0, undefined, o2], 0);
        }, CR.Error);
        preset();
        me.checkException('unedfined values exception', function(){
            list.addArray([o0, undefined, o2]);
        }, CR.Error);
        //index is out of range
        preset();
        me.checkException('index is out of range', function(){
            list.addArray(array, 40);
        }, CR.RangeError);
    },
    testIndexOf: function(){
        var me = this,
        cls = this._getClass_(),
        list = new cls(Object),
        o0 = new Object(),
        o1 = new Object();
        list.add(o0);
        list.add(o1);
        list.add(o0);
        list.add(o1);
        me.assertTrue(list.indexOf(o0) === 0);
        me.assertTrue(list.indexOf(o1) === 1);
    },
    testSet: function(){
        var me = this, list, o0, o1,
        cls = this._getClass_(),
        preset = function(){
            list = new cls(Object);
            o0 = new Object();
            o1 = new Object();
            list.add(o0);
        };
        preset();
        list.set(0, o1);
        me.assertTrue(list.get(0) === o1);
        preset();
        me.checkException('out of range', function(){
            list.set(1, o1);
        }, CR.RangeError);
        preset();
        me.checkException('type mismatch', function(){
            list.set(0, 444);
        }, CR.TypeError);
        preset();
        me.checkException('undefined value', function(){
            list.set(0, undefined);
        }, CR.Error);
    },
    testRemove: function(){
        var me = this, list, o0, o1, o2,
        cls = this._getClass_(),
        preset = function(){
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
        me.assertTrue(list.get(0) === o0);
        me.assertTrue(list.get(1) === o0);
        me.assertTrue(list.getSize() === 2);
        preset();
        list.remove(o0);
        me.assertTrue('multiple remove', list.get(0) === o1);
        me.assertTrue('multiple remove', list.getSize() === 1);
        preset();
        list.remove(o2);
        me.assertTrue('remove nothing', list.getSize() === 3);
    },
    testRemoveAt: function(){
        var me = this, list, o0, o1,
        cls = this._getClass_(),
        preset = function(){
            list = new cls(Object);
            o0 = new Object();
            o1 = new Object();
            list.add(o0);
            list.add(o1);
        };
        preset();
        list.removeAt(0);
        me.assertTrue(list.get(0) === o1);
        me.assertTrue(list.getSize() === 1);
        preset();
        me.checkException('out of range', function(){
            list.removeAt(2);
        }, CR.RangeError);
    },
    testToArray: function(){
        var me = this, array, 
        cls = this._getClass_(),
        list = new cls('number');
        list.add(0);
        list.add(1);
        array = list.toArray();
        me.assertTrue(array.length === 2);
        me.assertTrue(array[0] === 0);
        me.assertTrue(array[1] === 1);
    },
    testClear: function(){
        var me = this,
        cls = this._getClass_(),
        list = new cls('number');
        list.add(0);
        list.add(1);
        list.add(3);
        list.clear();
        me.assertTrue(list.getSize() === 0);
    },
    testClone: function(){
        var me = this,
        cls = this._getClass_(),
        list = new cls(),
        three = [];
        list.add(1);
        list.add('two');
        list.add(three);
        var clone = list.clone();
        me.assertTrue('check value 0', clone.get(0) === 1);
        me.assertTrue('check value 1', clone.get(1) === 'two');
        me.assertTrue('check value 2', clone.get(2) === three);
        me.assertTrue('size', clone.getSize() === 3);
        //independence
        list.set(0, 'hello');
        me.assertTrue('after change', clone.get(0) === 1);
        clone.set(2, []);
        me.assertTrue('after change', list.get(2) === three);
    },
    test_chainable: function(){
        var me = this,
        cls = this._getClass_(),
        list = new cls();
        me.assertTrue('add()', list.add(1) === list);
        me.assertTrue('add()', list.add(3) === list);
        me.assertTrue('addList()', list.addList(new cls()) === list);
        me.assertTrue('addArray()', list.addArray([]) === list);
        me.assertTrue('set()', list.set(0, 2) === list);
        me.assertTrue('remove()', list.remove(3) === list);
        me.assertTrue('removeAt()', list.removeAt(0) === list);
    }
});