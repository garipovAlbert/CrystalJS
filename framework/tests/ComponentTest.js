/**
 * @requires CR.dev.AbstractUnitTest
 * @requires CR.Component
 */

/**
 * @class CR.tests.ComponentTest
 */
CR.define('CR.tests.ComponentTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_Component',
    test_configuration: function(){
        var me = this;
        // common
        (function(){
            CR.define('MyComponent', 'CR.Component', {
                _cfg: {
                    one: 1,
                    two: 2,
                    three: 3
                },
                getCfg: function(n){
                    return this._cfg[n];
                }
            });
            CR.define('ChildComponent', 'MyComponent', {
                _cfg: {
                    one: 'one',
                    four: 4
                }
            });
            var c = new ChildComponent({
                two: 'two'
            });
            me.assertTrue('config: one', c.getCfg('one') === 'one');
            me.assertTrue('config: two', c.getCfg('two') === 'two');
            me.assertTrue('config: three', c.getCfg('three') === 3);
            me.assertTrue('config: four', c.getCfg('four') === 4);
        })();
        // undefined config parameter
        (function(){
            CR.define('MyComponent', 'CR.Component', {
                _cfg: {
                    one: 1
                }
            });
            me.checkException('undefined config parameter error', function(){
                new MyComponent({
                    two: 2
                });
            }, CR.Error);
        })();
        // required config parameter
        (function(){
            CR.define('MyComponent', 'CR.Component', {
                _cfg: {
                    one: undefined // parameter is required
                }
            });
            me.checkException('required config parameter error', function(){
                // the 'one' parameter is not set
                new MyComponent({});
            }, CR.Error);
        })();
    },
    test_eventHandlersInit: function(){
        var me = this;
        // common
        (function(){
            var k;
            var oneHandler = function(){};
            var twoHandler1 = function(){};
            var twoHandler2 = function(){};
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onOne']
            });
            CR.define('ChildComponent', 'MyComponent', {
                _events: ['onTwo']
            });
            var c = new ChildComponent({
                eventHandlers: {
                    onOne: oneHandler,
                    onTwo: [twoHandler1, twoHandler2]
                }
            });
            var onOneHandlers = c.getEventHandlers('onOne');
            me.assertTrue('one: length', onOneHandlers.length === 1);
            me.assertTrue('one: 1', CR.Array.indexOf(oneHandler, onOneHandlers) !== -1);
            var onTwoHandlers = c.getEventHandlers('onTwo');
            me.assertTrue('two: length', onTwoHandlers.length === 2);
            me.assertTrue('two: 1', CR.Array.indexOf(oneHandler, onOneHandlers) !== -1);
        }());
        // undefined event error
        (function(){
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onOne', 'onTwo']
            });
            // test
            new MyComponent({
                eventHandlers: {
                    onOne: function(){}
                }
            });
            me.checkException('undefined event error (single function)', function(){
                new MyComponent({
                    eventHandlers: {
                        onThree: function(){}
                    }
                });
            }, CR.Error);
            me.checkException('undefined event error (array)', function(){
                new MyComponent({
                    eventHandlers: {
                        onThree: [function(){}, function(){}]
                    }
                });
            }, CR.Error);
        })();
    },
    testGetEventHandlers: function(){
    // tested in test_eventHandlersInit() (common)
    },
    testHasEvent: function(){
        CR.define('MyComponent', 'CR.Component', {
            _events: ['onEvent']
        });
        var c = new MyComponent();
        this.assertTrue('has', c.hasEvent('onEvent'));
        this.assertFalse('has not', c.hasEvent('undefinedEvent'));
    },
    testAddEventHandler: function(){
        var me = this;
        // common
        (function(){
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onEvent']
            });
            var c = new MyComponent();
            var eventHandler = function(){};
            c.addEventHandler('onEvent', eventHandler);
            var eventHandlers = c.getEventHandlers('onEvent');
            me.arrayCompare('common', eventHandlers, [eventHandler]);
        })();
        // re-addition
        (function(){
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onEvent']
            });
            var c = new MyComponent();
            var eventHandler = function(){};
            c.addEventHandler('onEvent', eventHandler);
            c.addEventHandler('onEvent', eventHandler);
            c.addEventHandler('onEvent', eventHandler);
            var eventHandlers = c.getEventHandlers('onEvent');
            me.arrayCompare('re-addition', eventHandlers, [eventHandler]);
        })();
        // undefined event error
        (function(){
            CR.define('MyComponent', 'CR.Component', {});
            var c = new MyComponent();
            me.checkException('undefined event error', function(){
                c.addEventHandler('undefinedEvent', function(){});
            }, CR.Error);
        })();
        // handler is not a function error
        (function(){
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onEvent']
            });
            var c = new MyComponent();
            me.checkException('not a function error', function(){
                c.addEventHandler('onEvent', 'a string');
            }, CR.TypeError);
        })();
    },
    testRemoveEventHandler: function(){
        var me = this;
        CR.define('MyComponent', 'CR.Component', {
            _events: ['onEvent']
        });
        var c = new MyComponent();
        var eventHandler = function(){};
        c.addEventHandler('onEvent', eventHandler);
        c.removeEventHandler('onEvent', eventHandler);
        me.checkException('undefined event error', function(){
            c.removeEventHandler('undefinedEvent', eventHandler);
        }, CR.Error);
        var eventHandlers = c.getEventHandlers('onEvent');
        me.arrayCompare('removed', eventHandlers, []);
    },
    testRaiseEvent: function(){
        var me = this;
        var status1, status2;
        CR.define('MyComponent', 'CR.Component', {
            _events: ['onEvent']
        });
        var c = new MyComponent();
        var eventHandler1 = function(data){
            status1 = data+'1';
        }
        var eventHandler2 = function(data){
            status2 = data+'2';
        }
        c.addEventHandler('onEvent', eventHandler1);
        c.addEventHandler('onEvent', eventHandler2);
        c.raiseEvent('onEvent', ['raised']);
        me.checkException('undefined event error', function(){
            c.raiseEvent('undefinedEvent', 'raised');
        }, CR.Error);
        me.assertTrue('raised1', status1 === 'raised1');
        me.assertTrue('raised2', status2 === 'raised2');
    },
    testStaticGet: function(){
        var me = this;
        CR.define('MyComponent', 'CR.Component', {});
        var id = 'test_MyComponentIdentifier';
        var c = new MyComponent({
            id: id
        });
        me.assertTrue(c === CR.Component.get(id));
    },
    testStaticCreate: function(){
        var me = this;
        CR.define('MyComponent', 'CR.Component', {
            _cfg: {
                a: null,
                b: null
            },
            getCfgItem: function(name){
                return this._cfg[name];
            }
        });
        // without merging
        (function(){
            var cfgMap = {
                Class: 'MyComponent',
                a: 1,
                b: 2
            };
            var c1 = CR.Component.create(cfgMap);
            me.assertTrue('c1: a', c1.getCfgItem('a') === 1);
            me.assertTrue('c1: a', c1.getCfgItem('b') === 2);
            me.objectCompare('c1: cfgMap unchanged', cfgMap, {
                Class: 'MyComponent',
                a: 1,
                b: 2
            });
        })();
        // with merging
        (function(){
            var cfgMap1 = {
                Class: MyComponent
            };
            var cfgMap2 = {
                a: 1
            };
            var cfgMap3 = {
                b: 2
            };
            var c2 = CR.Component.create(cfgMap1, cfgMap2, cfgMap3);
            me.assertTrue('c2: a', c2.getCfgItem('a') === 1);
            me.assertTrue('c2: a', c2.getCfgItem('b') === 2);
            me.objectCompare('c2: cfgMap1 unchanged', cfgMap1, {
                Class: MyComponent
            });
            me.objectCompare('c2: cfgMap2 unchanged', cfgMap2, {
                a: 1
            });
            me.objectCompare('c2: cfgMap3 unchanged', cfgMap3, {
                b: 2
            });
        })();
    }
});


