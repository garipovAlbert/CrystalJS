/**
 * @requires CR.collections.AbstractCollection
 */

/**
 * @class CR.collections.Map
 * Implements a collection that takes key-value pairs.
 */
CR.define('CR.collections.Map', 'CR.collections.AbstractCollection', {
	_kType: undefined,
	_vType: undefined,
	_keys: null,
	/**
	 * @param {mixed} [kType] The type of map keys.
	 * It may be a class or a name of following simple types:
	 * "object", "boolean", "number", "string", "function", "undefined".
	 * Type checking is disabled when parameter not specified (free key type).
	 * @param {mixed} [vType] The type of map values.
	 * It may be a class or a name of following simple types:
	 * "object", "boolean", "number", "string", "function", "undefined".
	 * Type checking is disabled when parameter not specified (free value type).
	 */
	constructor: function (vType, kType) {
		this.super();
		this._keys = [];
		this._kType = kType;
		this._vType = vType;
	},
	_checkVType: function (v) {
		return !(this._vType !== undefined && !CR.type(v, this._vType));
	},
	_set: function (k, v) {
		var i = CR.Array.indexOf(k, this._keys);
		this._data[i !== -1 ? i : this._keys.push(k) - 1] = v;
	},
	/**
	 * Puts key-value pair into map.
	 * @param {mixed} k The key.
	 * @param {mixed} v The value.
	 * @return {CR.collections.Map} This map.
	 * @throws {CR.Error} if one of required arguments (key, value) 
	 * is not specified.
	 * @throws {CR.TypeError} if the key type or the value type is invalid.
	 */
	put: function (k, v) {
		if (arguments.length < 2) {
			throw new CR.Error('The required argument is not specified.');
		}
		if (this._kType !== undefined && !CR.type(k, this._kType)) {
			throw new CR.TypeError('Invalid type of the key.');
		}
		if (!this._checkVType(v)) {
			throw new CR.TypeError('Invalid type of the value.');
		}
		this._set(k, v);
		return this;
	},
	/**
	 * Merges this map with specified object.
	 * Allowed only for a maps there key type is 'string' or free.
	 * @param {Object} o The object.
	 * @return {CR.collections.Map} This map.
	 * @throws {CR.TypeError} if this map's key type is not the 'string' and not 
	 * free. JavaScript objects can only have strings as keys.
	 * @throws {CR.TypeError} if the argument (object) is not instance of Object.
	 * @throws {CR.TypeError} if a type of a value in the object is invalid.
	 */
	putObject: function (o) {
		if (this._kType !== undefined && this._kType !== 'string') {
			throw new CR.TypeError('Unable to use a strings as a keys.');
		}
		if (!(o instanceof Object)) {
			throw new CR.TypeError('Argument is not an instance of Object.');
		}
		for (var k in o) {
			if (!this._checkVType(o[k])) {
				throw new CR.TypeError('Invalid type of the value.');
			}
		}
		for (k in o) {
			this._set(k, o[k]);
		}
		return this;
	},
	/**
	 * Merges this map with the specified map.
	 * @param {CR.collections.Map} map The map to merge.
	 * @return {CR.collections.Map} This map.
	 * @throws {CR.TypeError} if the argument (map) is not an instance of 
	 * CR.collections.Map.
	 * @throws {CR.TypeError} if a key type of the specified map does not
	 * match to the key type of this map.
	 * @throws {CR.TypeError} if a value type of the specified map does not
	 * match to the value type of this map.
	 */
	putMap: function (map) {
		if (!(map instanceof CR.collections.Map)) {
			throw new CR.TypeError('Argument is not an instance of CR.collections.Map.');
		}
		if (this._kType !== undefined && map.getKeyType() !== this._kType) {
			throw new CR.TypeError('Key type mismatch.');
		}
		if (this._vType !== undefined && map.getValueType() !== this._vType) {
			throw new CR.TypeError('Value type mismatch.');
		}
		var keys = map.getKeys();
		var data = map.toArray();
		for (var i in keys) {
			this._set(keys[i], data[i]);
		}
		return this;
	},
	/**
	 * Removes all items by the specified value.
	 * @param {mixed} v The value.
	 * @return {CR.collections.Map} This map.
	 */
	remove: function (v) {
		for (var i = 0; i < this._data.length; i++) {
			if (this._data[i] === v) {
				this._data.splice(i, 1);
				this._keys.splice(i, 1);
			}
		}
		return this;
	},
	/**
	 * Removes the specified key.
	 * @param {mixed} k The key.
	 * @return {CR.collections.Map} This map.
	 * @throws {CR.Error} if map has not the specified key.
	 */
	removeKey: function (k) {
		var i = CR.Array.indexOf(k, this._keys);
		if (i === -1)
			throw new CR.Error('The key is not exist.');
		this._data.splice(i, 1);
		this._keys.splice(i, 1);
		return this;
	},
	/**
	 * Returns value for the specified key.
	 * @param {mixed} k The key.
	 * @return {mixed} An item value.
	 * @throws {CR.Error} if map has not the specified key.
	 */
	get: function (k) {
		var i = CR.Array.indexOf(k, this._keys);
		if (i === -1) {
			var e = new CR.Error('The key is not exist.');
			e.o = this;
			throw e;
		}
		return this._data[i];
	},
	/**
	 * Returns true if map has the specified key.
	 * @return {boolean}
	 */
	hasKey: function (k) {
		return CR.Array.indexOf(k, this._keys) !== -1;
	},
	/**
	 * Returns a type of values.
	 * @return {class|string|undefined}
	 */
	getValueType: function () {
		return this._vType;
	},
	/**
	 * Returns a type of keys.
	 * @return {class|string|null}
	 */
	getKeyType: function () {
		return this._kType;
	},
	/**
	 * Creates an array of map keys.
	 * @return {Array}
	 */
	getKeys: function () {
		return this._keys.slice();
	},
	/**
	 * Removes all items of map.
	 */
	clear: function () {
		this._keys = [];
		this._data = [];
		return this;
	},
	setKeys: function (keys) {
		this._keys = keys;
	},
	/**
	 * Creates a copy of map.
	 * return {CR.collections.Map}
	 */
	clone: function () {
		var map = new CR.collections.Map(this._vType, this._kType);
		map.setKeys(this._keys.slice());
		map.setData(this._data.slice());
		return map;
	},
	/**
	 * @return {string}
	 */
	toString: function () {
		var s = 'map{\n';
		for (var i = 0; i < this._keys.length; i++)
			s += ('\t<' + this._keys[i] + '>: <' + this._data[i] + '>,\n');
		s += '}';
		return s;
	}
});