/**
 * @requires CR.Component
 */

/**
 * @class CR.utils.Interval
 * Encapsulates JavaScript interval.
 */
CR.define('CR.utils.Interval', 'CR.Component', {
	_cfg: {
		/**
		 * @config {Function} The interval function. Required.
		 */
		func: undefined,
		/**
		 * @config {int} The frequency of calling the interval 
		 * function (in milliseconds).
		 */
		freq: 100,
		/**
		 * @config {bool} Start automatically.
		 */
		autostart: false
	},
	_freq_: null,
	_func_: null,
	_intervalId_: null,
	/**
	 * @property {boolean} If the interval is started.
	 */
	_started: false,
	/**
	 * @property {boolean} If the interval is delayed.
	 */
	_delayed: false,
	/**
	 * @inheritdoc
	 */
	constructor: function (cfg) {
		this.super(cfg);
		this._freq_ = this._cfg.freq;
		this._func_ = this._getFunc();
		if (this._cfg.autostart) {
			this.start();
		}
	},
	/**
	 * Returns the interval function.
	 * @return {Function}
	 * @throws {CR.Error} if config argument "func" is not a function.
	 */
	_getFunc: function () {
		if (typeof (this._cfg.func) !== 'function') {
			throw new CR.Error('Config argument "func" must be a function.');
		}
		return this._cfg.func;
	},
	/**
	 * Starts the interval.
	 * @return {CR.utils.Process} This object.
	 */
	start: function () {
		this._delayed = false;
		if (!this._started) {
			this._started = true;
			var me = this;
			this._intervalId_ = window.setInterval(function () {
				try {
					me._func_.apply(me);
				} catch (e) {
					me.stop();
					throw e;
				}
			}, this._freq_);
		}
		return this;
	},
	/**
	 * Stops the interval.
	 * @return {CR.utils.Process} This object.
	 */
	stop: function () {
		this._delayed = false;
		if (this._started) {
			if (this._intervalId_ !== null)
				window.clearInterval(this._intervalId_);
			this._intervalId_ = null;
			this._started = false;
		}
		return this;
	},
	/**
	 * Stops the interval if it started or starts if it stopped.
	 * @return {CR.utils.Process} This object.
	 */
	toggle: function () {
		this._started ? this.stop() : this.start();
		return this;
	},
	/**
	 * Whether the interval is started.
	 * @return {boolean}
	 */
	isStarted: function () {
		return this._started;
	},
	/**
	 * Sets a delay.
	 * @param {int} time The delay time in milliseconds.
	 * @return {CR.utils.Process} This object.
	 */
	delay: function (time) {
		var me = this;
		if (this._started) {
			this.stop();
			this._delayed = true;
			window.setTimeout(function () {
				if (this._delayed) me.start();
			}, time);
		}
		return this;
	},
	/**
	 * @return {string}
	 */
	toString: function () {
		return '{' + this.Class.getName() + '('
			+ ((this._started === true) ? 'started' : 'stopped')
			+ ')' + '}';
	}
});