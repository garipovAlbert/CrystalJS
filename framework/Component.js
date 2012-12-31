/**
 * @class CR.Component
 * Provides configuration ability, events and other functionality 
 * required for complex components.
 * @abstract
 **/
CR.define('CR.Component', 'CR.Object', {
    __override: {
        _cfg: CR.override.innerMap,
        _events: CR.override.innerArray
    },
    __static: {
        /**
         * Creates a component by the specified configuration.
         * @param {map} config1 The configuration map. The map should have 
         * required 'Class' key which is a class or name of a class to be instantiated.
         * @param {map} [configN] All arguments after the first will be merged to 
         * the first argument.
         * @return {CR.Component}
         */
        create: function(config1, configN){
            var cfg, Class, configs = CR.Array.fromMap(arguments);
            configs.unshift({});
            cfg = CR.put.apply(CR, configs);
            if(typeof(cfg.Class) === 'string'){
                Class = CR.getClass(cfg.Class);
            }else{
                Class = cfg.Class;
            }
            delete(cfg['Class']);
            return new Class(cfg);
        },
        _idValuePairs_: {},
        /**
         * Return a component by the specified global identifier.
         * @param {string} id The component identifier.
         * @return {CR.Component}
         */
        get: function(id){
            return this._idValuePairs_[id];
        }
    },
    /**
     * @property {map} The component configuration. In the constructor 
     * to be merged with the configuration passed into the constructor.
     * The 'innerMap' override method is used for this property.
     */
    _cfg: {
        /**
         * @config {map(Function|Array[Function])} Event handlers.
         * A map with event names as keys, and event handler functions 
         * or arrays of event handlers functions as values.
         */
        eventHandlers: {},
        /**
         * @config {string} global identifier.
         */
        id: null
    },
    /**
     * @property {Array} A list of available event.
     * The 'innerArray' override method is used for this property.
     */
    _events: [],
    _eventHandlers_: null,
    /**
     * @param {map} [config] The configutration map.
     * @throws {CR.Error} if a configuration parameter is undefined or
     * a required configuration parameter is not specified.
     */
    constructor: function(config){
        var me = this, k, i;
        me._eventHandlers_ = {};
        // configuration
        me._cfg = CR.put({}, me._cfg);
        if(config !== undefined){
            for(k in config){
                if(!(k in me._cfg)){
                    throw new CR.Error('Config key "'+k+'" is undefined', me);
                }
                me._cfg[k] = config[k];
            }
        }
        for(k in me._cfg){
            if(me._cfg[k] === undefined){
                throw new CR.Error('Config parameter "'+k+'" must be specified', me);
            }
        }
        // add event handlers
        for(k in me._cfg.eventHandlers){
            var handler = me._cfg.eventHandlers[k];
            if(handler instanceof Array){
                for(i = 0; i < handler.length; i++){
                    me.addEventHandler(k, handler[i]);
                }
            }else{ // assume the handler is a function
                me.addEventHandler(k, handler);
            }
        }
        // set global identifier
        if(me._cfg.id !== null){
            this._cls._idValuePairs_[me._cfg.id] = this;
        }
    },
    _getEventHandlerArray_: function(n){
        if(!this.hasEvent(n)){
            throw new CR.Error('Event "'+n+'" is undefined', this);
        }
        if(!(n in this._eventHandlers_)){
            this._eventHandlers_[n] = [];
        }
        return this._eventHandlers_[n];
    },
    /**
     * If this component has the specified event.
     * @param {string} n Event name.
     * @return {boolean}
     */
    hasEvent: function(n){
        return CR.Array.indexOf(n, this._events) !== -1;
    },
    /**
     * Adds the event handler function.
     * @param {string} n The event name.
     * @param {Function} h The event handler function.
     * @return {CR.Component} This object.
     * @throws {CR.TypeError} if the event handler is not a function.
     * @throws {CR.Error} if event is undefined.
     */
    addEventHandler: function(n, h){
        var arr =  this._getEventHandlerArray_(n);
        if(typeof(h) !== 'function'){
            throw new CR.TypeError('The event handler is not a function', this);
        }
        if(CR.Array.indexOf(h, arr) === -1){
            arr.push(h);
        }
        return this;
    },
    /**
     * Creates an array contained with event handlers for the specified event.
     * @param {string} n The event name.
     * @return {Array[Function]} The array of event handlers.
     * @throws {CR.Error} if event is undefined.
     */
    getEventHandlers: function(n){
        return this._getEventHandlerArray_(n).slice();
    },
    /**
     * Removes the specified event handler function.
     * @param {string} n The event name.
     * @param {Function} h The event handler function.
     * @return {CR.Component} This object.
     * @throws {CR.Error} if event is undefined.
     */
    removeEventHandler: function(n, h){
        var i, arr =  this._getEventHandlerArray_(n);
        i = CR.Array.indexOf(h, arr);
        if(i !== -1){
            arr.splice(i, 1);
        }
        return this;
    },
    /**
     * Raises the event. Calls all the event handlers of specified event.
     * @param {string} n The event name.
     * @param {mixed} data The data that passed to event handler functions
     * when the event is raised.
     * @return {CR.Component} This object.
     * @throws {CR.Error} if event is undefined.
     */
    raiseEvent: function(n, params){
        var arr =  this._getEventHandlerArray_(n);
        for(var i = 0; i < arr.length; i++){
            arr[i].apply(this, params);
        }
        return this;
    }
});