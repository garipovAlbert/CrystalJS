/**
 * @requires CR.collections.AbstractCollection
 */

/**
 * @class CR.collections.List
 * Implements an integer-indexed collection.
 */
CR.define('CR.collections.List', 'CR.collections.AbstractCollection', {
    _type: undefined,
    /**
     * @param {class|string} [type] The type of list items.
     * It may be a class or a name of following simple types:
     * "object", "boolean", "number", "string", "function", "undefined".
     * Type checking is disabled when parameter not specified.
     */
    constructor: function(type){
        this.parent();
        this._type = type;
    },
    _checkRange: function(i){
        return !(i < 0 || i >= this._data.length || typeof i !== 'number');
    },
    _checkType: function(v){
        return !(this._type !== undefined && !CR.type(v, this._type));
    },
    _checkValues: function(a){
        for(var i = 0; i < a.length; i++){
            this._checkValue(a[i]);
        }
    },
    _checkValue: function(v){
        if(!this._checkType(v)){
            throw new CR.TypeError('Invalid type of the value.');
        }
    },
    /**
     * Appends the specified object to the end of list
     * or inserts it at the specified index.
     * @param {mixed} v The object to add.
     * An object can have any type excepting "undefined".
     * @param {int} [i] The index.
     * @return {CR.collections.List} This list.
     * @throws {CR.TypeError} If a type of the specified object does not
     * match to list type.
     * @throws {CR.RangeError} if the index is out of range
     */
    add: function(v, i){
        this._checkValue(v);
        if(i !== undefined && !this._checkRange(i)){
            throw new CR.RangeError('The index is out of range.');
        }
        i === undefined ? this._data.push(v) : CR.Array.insert(this._data, v, i);
        return this;
    },
    /**
     * Appends objects in the specified list
     * to the end of this list or at the specified index.
     * @param {CR.collections.List} list The list to append.
     * @param {int} [i] The index.
     * @return {CR.collections.List} This list.
     * @throws {CR.TypeError} if the specified list is not a CR.collections.List.
     * @throws {CR.TypeError} if the type of the specified list does not equals
     * to the type of this list.
     * @throws {CR.RangeError} if the index is out of range.
     */
    addList: function(list, i){
        if(!(list instanceof CR.collections.List)){
            throw new CR.TypeError('Invalid type of the argument.');
        }
        var a = list.toArray();
        this._checkValues(a);
        if(i !== undefined && !this._checkRange(i)){
            throw new CR.RangeError('The index is out of range.');
        }
        CR.Array.insertArray(this._data, a, i);
        return this;
    },
    /**
     * Appends objects in the specified array
     * to end of list or at the specified index.
     * @param {Array} a The array to append.
     * @param {int} [i] The index.
     * @return {CR.collections.List} This list.
     * @throws {CR.TypeError} if the specified parameter is not an array.
     * @throws {CR.RangeError} if the index is out of range.
     */
    addArray: function(a, i){
        if(!(a instanceof Array)){
            throw new CR.TypeError('Invalid type of the argument.');
        }
        this._checkValues(a);
        if(i !== undefined && !this._checkRange(i)){
            throw new CR.RangeError('The index is out of range.');
        }
        CR.Array.insertArray(this._data, a, i);
        return this;
    },
    /**
     * Replaces the item at the specified index with the specified object.
     * @param {int} i The index.
     * @param {mixed} v The object of any type excepting 'undefined'.
     * @return {CR.collections.List} This list.
     * @throws {CR.RangeError} if the index is out of range.
     * @throws {CR.TypeError} if the type of the specified object does not
     * match to list type.
     */
    set: function(i, v){
        if(!this._checkRange(i)){
            throw new CR.RangeError('The index is out of range.');
        }
        this._checkValue(v);
        this._data[i] = v;
        return this;
    },
    /**
     * Removes all occurrence of the specified object from list.
     * @param {mixed} v The object.
     * @return {CR.collections.List} This list.
     */
    remove: function(v){
        for(var i = 0; i < this._data.length; i++){
            if(this._data[i] === v){
                this._data.splice(i, 1);
            }
        }
        return this;
    },
    /**
     * Removes list item by the specified index.
     * @param {int} i The index.
     * @return {CR.collections.List} This list.
     * @throws {CR.RangeError} if the index is out of range.
     */
    removeAt: function(i){
        if(!this._checkRange(i)){
            throw new CR.RangeError('The index is out of range.');
        }
        this._data.splice(i, 1);
        return this;
    },
    /**
     * Returns an item by the specified index.
     * @param {int} i The index.
     * @return {mixed} The item.
     * @throws {CR.RangeError} if the index is out of range.
     */
    get: function(i){
        if(!this._checkRange(i)){
            throw new CR.RangeError('The index is out of range.');
        }
        return this._data[i];
    },
    /**
     * Returns an index of the specified object in list.
     * @param {mixed} v The object.
     * @return {int} The index of the first occurrence of the specified object,
     * or -1 if this list does not contain it.
     */
    indexOf: function(v){
        return CR.Array.indexOf(v, this._data);
    },
    /**
     * Returns a type of list.
     * @return {class|string|undefined}.
     */
    getType: function(){
        return this._type;
    },
    /**
     * Creates a copy of list.
     * @return {CR.collections.List} This list.
     */
    clone: function(){
        var list = new CR.collections.List(this._type);
        list.setData(this._data.slice());
        return list;
    },
    /**
     * Returns a last item.
     * @return {mixed}
     * @throws {CR.RangeError} if list has no items.
     * @todo unit test.
     */
    getLast: function(){
        if(this._data.length === 0){
            throw new CR.RangeError('List is empty.');
        }
        return this._data[this._data.length - 1];
    },
    /**
     * Pops an item off the end of list.
     * @return {mixed}
     * @throws {CR.RangeError} if list has no items.
     * @todo unit test.
     */
    pop: function(){
        if(this._data.length === 0){
            throw new CR.RangeError('List is empty.');
        }
        return this._data.pop();
    },
    /**
     * Shifts an item off the beginning of list.
     * @return {mixed}
     * @throws {CR.RangeError} if list has no items.
     * @todo unit test.
     */
    shift: function(){
        if(this._data.length === 0){
            throw new CR.RangeError('List is empty.');
        }
        return this._data.shift();
    },
    /**
     * Prepends the object to the beginning of list.
     * @param {mixed} v The object to prepend.
     * @return {CR.collections.List} This list.
     * @todo unit test.
     */
    unshift: function(v){
        this._checkValue(v);
        this._data.unshift(v);
        return this;
    },
    /**
     * @return {string}
     */
    toString: function(){
        var s = 'list{\n';
        for(var i = 0; i < this._data.length; i++){
            s+=('\t<'+i+'>: <'+this._data[i]+'>,\n');
        }
        s+='}';
        return s;
    }
});