/**
 * @requires CR.tests.collections.ListTest
 * @requires CR.collections.UniqueList
 */

/**
 * @class CR.tests.collections.UniqueListTest
 */
CR.define('CR.tests.collections.UniqueListTest', 'CR.tests.collections.ListTest', {
    _name: 'CR_collections_UniqueList',
    _getClass_: function(){
        return CR.collections.UniqueList;
    },
    testGet: function(){
        this.parent();
    },
    testGetSize: function(){
        this.parent();
    },
    testAdd: function(){
        this.parent();
        
        var me = this,
        cls = this._getClass_();
        // re-adding
        var uList;
        uList = new cls('string');
        uList.add('my not unique string');
        me.checkException('re-adding', function(){
            uList.add('my not unique string');
        }, CR.Error);
    },
    testAddList: function(){
        var me = this,
        cls = this._getClass_();
        // common
        (function(){
            var list, addedList, o0, o1, o2,
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
                list.addList(new cls(), 40);
            }, CR.RangeError);
        }());
        // repetition error
        (function(){
            var list, uList;
            // value repetition
            uList = new cls('string');
            uList.add('one');
            uList.add('two');
            list = new CR.collections.List('string');
            list.add('one');
            me.checkException('repetition', function(){
                uList.addList(list);
            });
            // repetition in the added list only
            uList = new cls('string');
            list = new CR.collections.List('string');
            list.add('one');
            list.add('two');
            list.add('one');
            me.checkException('repetition in the added', function(){
                uList.addList(list);
            });
        }());
    },
    testAddArray: function(){
        this.parent();
        
        var me = this,
        cls = this._getClass_();
        // repetition error
        (function(){
            var array, uList;
            //value repetition
            uList = new cls('string');
            uList.add('one');
            uList.add('two');
            array = ['one', 'two'];
            me.checkException('repetition', function(){
                uList.addArray(array);
            });
            //repetition in the added array only
            uList = new cls('string');
            uList.add('one');
            array = ['one', 'two', 'two'];
            me.checkException('repetition in added', function(){
                uList.addArray(array);
            }, CR.Error);
        }());
    },
    testIndexOf: function(){
        var me = this,
        cls = this._getClass_(),
        list = new cls(Object),
        o0 = new Object(),
        o1 = new Object();
        list.add(o0);
        list.add(o1);
        me.assertTrue(list.indexOf(o0) === 0);
        me.assertTrue(list.indexOf(o1) === 1);
    },
    testSet: function(){
        this.parent();
        
        var me = this,
        cls = this._getClass_();
        // repetition error
        (function(){
            var uList;
            uList = new cls('string');
            uList.add('one');
            uList.add('two');
            // repetition
            me.checkException('repetition', function(){
                uList.set(1, 'one');
            }, CR.Error);
            // repetition on the same position
            me.checkException('repetition on same', function(){
                uList.set(0, 'one');
            }, CR.Error);
        }());
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
        };
        preset();
        list.remove(o0);
        me.assertTrue(list.get(0) === o1);
        me.assertTrue(list.getSize() === 1);
        preset();
        list.remove(o2);
        me.assertTrue('remove nothing', list.getSize() === 2);
    },
    testRemoveAt: function(){
        this.parent();
    },
    testToArray: function(){
        this.parent();
    },
    testClear: function(){
        this.parent();
    },
    testClone: function(){
        this.parent();
    },
    test_chainable: function(){
        this.parent();
        
        var me = this, 
        cls = this._getClass_(),
        uList = new cls();
        uList.add(1);
        me.assertTrue('move()', uList.move(1, 0) === uList);
    },
    testMove: function(){
        var me = this, uList, arr,
        cls = this._getClass_(),
        preset = function(){
            uList = new cls('string');
            uList.addArray(['a', 'b', 'c']);
        };
        // a -> 1
        preset();
        uList.move('a', 1);
        me.arrayCompare('a -> 1', uList.toArray(), ['b', 'a', 'c']);
        // c -> 1
        preset();
        uList.move('c', 1);
        me.arrayCompare('c -> 1', uList.toArray(), ['a', 'c', 'b']);
        // b -> 2
        preset();
        uList.move('b', 2);
        me.arrayCompare('b -> 2', uList.toArray(), ['a', 'c', 'b']);
        // a -> 3. Out of range
        preset();
        me.checkException('a -> 3. Out of range', function(){
            uList.move('a', 3);
        }, CR.RangeError);
        // b -> -1. Out of range
        preset();
        me.checkException('b -> -1. Out of range error', function(){
            uList.move('b', -1);
        }, CR.RangeError);
        // d -> 1. Not an item
        preset();
        me.checkException('d -> 1. Not an item error', function(){
            uList.move('d', 1);
        }, CR.Error);
    }
});



