/**
 * @requires CR.collections.List
 */

/**
 * @class CR.collections.UniqueList
 * Implements an integer-indexed collection with unique items.
 */
CR.define('CR.collections.UniqueList', 'CR.collections.List', {
    _checkValues: function(a){
        this.parent(a);
        if(!CR.Array.isUnique(a)){
            throw new CR.Error('Unable to add the item repeatedly.');
        }
        for(var i = 0; i < a.length; i++){
            this._checkValue(a[i]);
        }
    },
    _checkValue: function(v){
        this.parent(v);
        if(CR.Array.indexOf(v, this._data) !== -1){
            throw new CR.Error('Unable to add the item repeatedly.');
        }
    },
    /**
     * Moves the specified item to the specified index.
     * @param {mixed} v The item (should be contained in list).
     * @param {int} i The index.
     * @return {CR.collections.UniqueList} This list.
     * @throws {CR.RangeError} if the index is out of range.
     * @throws {CR.Error} if a list doesn't contain specified item.
     */
    move: function(v, i){
        if(!this._checkRange(i)){
            throw new CR.RangeError('The index is out of range.');
        }
        var fromIndex = this.indexOf(v);
        if(fromIndex === -1){
            throw new CR.Error('The specified value is not an item of this list.');
        }
        this._data.splice(fromIndex, 1);
        this._data.splice(i, 0, v);
        return this;
    }
});