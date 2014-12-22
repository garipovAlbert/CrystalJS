/**
 * @requires CR.dev.AbstractQUnitTest
 * @requires CR.Component
 */

/**
 * @class CR.tests.ComponentTest
 */
CR.define('CR.tests.ComponentTest', 'CR.dev.AbstractQUnitTest', {
    _name: 'CR.Component',
    test_configuration: function (assert) {
        // common
        (function () {
            CR.define('MyComponent', 'CR.Component', {
                _cfg: {
                    one: 1,
                    two: 2,
                    three: 3
                },
                getCfg: function (n) {
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
            assert.ok(c.getCfg('one') === 'one', 'config: one');
            assert.ok(c.getCfg('two') === 'two', 'config: two');
            assert.ok(c.getCfg('three') === 3, 'config: three');
            assert.ok(c.getCfg('four') === 4, 'config: four');
        })();

        // undefined config parameter
        (function () {
            CR.define('MyComponent', 'CR.Component', {
                _cfg: {
                    one: 1
                }
            });

            assert.throws(function () {
                new MyComponent({
                    two: 2
                });
            }, CR.Error, 'undefined config parameter error');
        })();

        // required config parameter
        (function () {
            // When parameter is set but equal to the undefined js constant,
            // it becomes a required parameter, which should be specified on instantiation.
            CR.define('MyComponent', 'CR.Component', {
                _cfg: {
                    one: undefined // parameter is required
                }
            });
            assert.throws(function () {
                // the 'one' parameter is not set
                new MyComponent({});
            }, CR.Error, 'required config parameter error');
        })();
    },
    test_eventHandlersInit: function (assert) {
        // common
        (function () {
            var k;
            var oneHandler = function () {
            };
            var twoHandler1 = function () {
            };
            var twoHandler2 = function () {
            };
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
            assert.ok(onOneHandlers.length === 1, 'one: length');
            assert.ok(CR.Array.indexOf(oneHandler, onOneHandlers) !== -1, 'one: 1');
            var onTwoHandlers = c.getEventHandlers('onTwo');
            assert.ok(onTwoHandlers.length === 2, 'two: length');
            assert.ok(CR.Array.indexOf(oneHandler, onOneHandlers) !== -1, 'two: 1');
        }());

        // undefined event error
        (function () {
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onOne', 'onTwo']
            });
            // test
            new MyComponent({
                eventHandlers: {
                    onOne: function () {
                    }
                }
            });
            assert.throws(function () {
                new MyComponent({
                    eventHandlers: {
                        onThree: function () {
                        }
                    }
                });
            }, CR.Error, 'undefined event error (single function)');
            assert.throws(function () {
                new MyComponent({
                    eventHandlers: {
                        onThree: [function () {
                            }, function () {
                            }]
                    }
                });
            }, CR.Error, 'undefined event error (array)');
        })();
    },
//    testGetEventHandlers: function(assert){
//    // tested in test_eventHandlersInit() (common)
//    },
    testHasEvent: function (assert) {
        CR.define('MyComponent', 'CR.Component', {
            _events: ['onEvent']
        });
        var c = new MyComponent();
        assert.ok(c.hasEvent('onEvent'), 'has');
        assert.ok(c.hasEvent('undefinedEvent') === false, 'has not');
    },
    testAddEventHandler: function (assert) {
        // common
        (function () {
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onEvent']
            });
            var c = new MyComponent();
            var eventHandler = function () {
            };
            c.addEventHandler('onEvent', eventHandler);
            var eventHandlers = c.getEventHandlers('onEvent');
            assert.deepEqual(eventHandlers, [eventHandler], 'common');
        })();

        // re-addition
        (function () {
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onEvent']
            });
            var c = new MyComponent();
            var eventHandler = function () {
            };
            c.addEventHandler('onEvent', eventHandler);
            c.addEventHandler('onEvent', eventHandler);
            c.addEventHandler('onEvent', eventHandler);
            var eventHandlers = c.getEventHandlers('onEvent');
            assert.deepEqual(eventHandlers, [eventHandler], 're-addition');
        })();

        // undefined event error
        (function () {
            CR.define('MyComponent', 'CR.Component', {});
            var c = new MyComponent();
            assert.throws(function () {
                c.addEventHandler('undefinedEvent', function () {
                });
            }, CR.Error, 'undefined event error');
        })();

        // handler is not a function error
        (function () {
            CR.define('MyComponent', 'CR.Component', {
                _events: ['onEvent']
            });
            var c = new MyComponent();
            assert.throws(function () {
                c.addEventHandler('onEvent', 'a string');
            }, CR.TypeError, 'not a function error');
        })();
    },
    testRemoveEventHandler: function (assert) {
        CR.define('MyComponent', 'CR.Component', {
            _events: ['onEvent']
        });
        var c = new MyComponent();
        var eventHandler = function () {
        };
        c.addEventHandler('onEvent', eventHandler);
        c.removeEventHandler('onEvent', eventHandler);
        assert.throws(function () {
            c.removeEventHandler('undefinedEvent', eventHandler);
        }, CR.Error, 'undefined event error');

        var eventHandlers = c.getEventHandlers('onEvent');
        assert.deepEqual(eventHandlers, [], 'removed');
    },
    testRaiseEvent: function (assert) {
        var status1, status2;
        CR.define('MyComponent', 'CR.Component', {
            _events: ['onEvent']
        });
        var c = new MyComponent();
        var eventHandler1 = function (data) {
            status1 = data + '1';
        };
        var eventHandler2 = function (data) {
            status2 = data + '2';
        };
        c.addEventHandler('onEvent', eventHandler1);
        c.addEventHandler('onEvent', eventHandler2);
        c.raiseEvent('onEvent', ['raised']);

        assert.throws(function () {
            c.raiseEvent('undefinedEvent', 'raised');
        }, CR.Error, 'undefined event error');
        assert.ok(status1 === 'raised1', 'raised1');
        assert.ok(status2 === 'raised2', 'raised2');
    },
    testStaticGet: function (assert) {
        var me = this;
        CR.define('MyComponent', 'CR.Component', {});
        var id = 'test_MyComponentIdentifier';
        var c = new MyComponent({
            id: id
        });
        assert.ok(c === CR.Component.get(id));
    },
    testStaticCreate: function (assert) {
        var me = this;
        CR.define('MyComponent', 'CR.Component', {
            _cfg: {
                a: null,
                b: null
            },
            getCfgItem: function (name) {
                return this._cfg[name];
            }
        });

        // without merging
        (function () {
            var cfgMap = {
                Class: 'MyComponent',
                a: 1,
                b: 2
            };
            var c1 = CR.Component.create(cfgMap);
            assert.ok(c1.getCfgItem('a') === 1, 'c1: a');
            assert.ok(c1.getCfgItem('b') === 2, 'c1: a');
            assert.propEqual(cfgMap, {
                Class: 'MyComponent',
                a: 1,
                b: 2
            }, 'c1: cfgMap unchanged');
        })();

        // with merging
        (function () {
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
            assert.ok(c2.getCfgItem('a') === 1, 'c2: a');
            assert.ok(c2.getCfgItem('b') === 2, 'c2: a');
            assert.propEqual(cfgMap1, {
                Class: MyComponent
            }, 'c2: cfgMap1 unchanged');
            assert.propEqual(cfgMap2, {a: 1}, 'c2: cfgMap2 unchanged');
            assert.propEqual(cfgMap3, {b: 2}, 'c2: cfgMap3 unchanged');
        })();
    }
});


