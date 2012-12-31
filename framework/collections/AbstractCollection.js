/**
 * @class CR.collections.AbstractCollection
 * Abstract class that provides base methods for collection classes.
 */
CR.define('CR.collections.AbstractCollection', 'CR.Object', {
    /**
     * @property {Array} The array that contains collection items.
     */
    _data: null,
    constructor: function(){
        this._data = [];
    },
    /**
     * Returns a number of items.
     * @return {int}
     */
    getSize: function(){
        return this._data.length;
    },
    /**
     * Removes all the items.
     * @return {CR.collections.AbstractCollection} This collection.
     */
    clear: function(){
        this._data = [];
        return this;
    },
    setData: function(data){
        this._data = data;
    },
    /**
     * Creates a JavaScript array contained with collection items in same order.
     * @return {Array}
     */
    toArray: function(){
        return this._data.slice();
    }
});