/**
 * @class CR.utils.Color
 * Encapsulates a color. Provides functionality for color manipulaions 
 * in RGB and HSV color spaces.
 */
CR.define('CR.utils.Color', 'CR.Object', {
	__static: {
		webColors: {
			'aqua': [0, 255, 255],
			'azure': [240, 255, 255],
			'beige': [245, 245, 220],
			'black': [0, 0, 0],
			'blue': [0, 0, 255],
			'brown': [165, 42, 42],
			'cyan': [0, 255, 255],
			'darkblue': [0, 0, 139],
			'darkcyan': [0, 139, 139],
			'darkgrey': [169, 169, 169],
			'darkgreen': [0, 100, 0],
			'darkkhaki': [189, 183, 107],
			'darkmagenta': [139, 0, 139],
			'darkolivegreen': [85, 107, 47],
			'darkorange': [255, 140, 0],
			'darkorchid': [153, 50, 204],
			'darkred': [139, 0, 0],
			'darksalmon': [233, 150, 122],
			'darkviolet': [148, 0, 211],
			'fuchsia': [255, 0, 255],
			'gold': [255, 215, 0],
			'green': [0, 128, 0],
			'indigo': [75, 0, 130],
			'khaki': [240, 230, 140],
			'lightblue': [173, 216, 230],
			'lightcyan': [224, 255, 255],
			'lightgreen': [144, 238, 144],
			'lightgrey': [211, 211, 211],
			'lightpink': [255, 182, 193],
			'lightyellow': [255, 255, 224],
			'lime': [0, 255, 0],
			'magenta': [255, 0, 255],
			'maroon': [128, 0, 0],
			'navy': [0, 0, 128],
			'olive': [128, 128, 0],
			'orange': [255, 165, 0],
			'pink': [255, 192, 203],
			'purple': [128, 0, 128],
			'violet': [128, 0, 128],
			'red': [255, 0, 0],
			'silver': [192, 192, 192],
			'white': [255, 255, 255],
			'yellow': [255, 255, 0]
		}
	},
	/**
	 * @property {float} The red color component.
	 */
	_r: 0,
	/**
	 * @property {float} The green color component.
	 */
	_g: 0,
	/**
	 * @property {float} The blue color component.
	 */
	_b: 0,
	/**
	 * Returns a float array containing color components of
	 * current color, in RGB color space.
	 * Component's valid value range is [0, 1].
	 * @retrun {[float, float, float]} RGB components in a float array.
	 */
	getRgbF: function () {
		return [this._r, this._g, this._b];
	},
	/**
	 * Returns an int array containing color components of
	 * current color, in RGB color space.
	 * Component's value range is [0, 255].
	 * @param {boolean} bounded Whether the color components be bounded in
	 * valid value range. Defaults to false.
	 * @return {[int, int, int]} RGB components in an int array.
	 */
	getRgb: function (bounded) {
		var r, g, b;
		r = Math.round(this._r * 255);
		g = Math.round(this._g * 255);
		b = Math.round(this._b * 255);
		if (bounded === true) {
			r = Math.min(Math.max(r, 0), 255);
			g = Math.min(Math.max(g, 0), 255);
			b = Math.min(Math.max(b, 0), 255);
		}
		return [r, g, b];
	},
	/**
	 * Returns a float array containing color components of
	 * current color, in HSV color space.
	 * Component's value range is [0, 1].
	 * @retrun {[float, float, float]} HSV components in a float array.
	 */
	getHsvF: function () {
		// rgb float to hsv float converting
		var me = this;
		var max = Math.max(me._r, me._g, me._b);
		var min = Math.min(me._r, me._g, me._b);
		var h, s, v = max;
		var d = max - min;
		s = max == 0 ? 0 : d / max;
		if (max == min) {
			h = 0; // achromatic
		} else {
			switch (max) {
				case me._r:
					h = (me._g - me._b) / d + (me._g < me._b ? 6 : 0);
					break;
				case me._g:
					h = (me._b - me._r) / d + 2;
					break;
				case me._b:
					h = (me._r - me._g) / d + 4;
					break;
			}
			h /= 6;
		}
		return [h, s, v];
	},
	/**
	 * Returns an int array containing color components of
	 * current color, in HSV color space.
	 * Hue component's value range is [0, 360].
	 * Saturation component's value range is [0, 100].
	 * Value component's value range is [0, 100].
	 * @param {boolean} bounded Whether the color components to be bounded in
	 * valid value range. Defaults to false.
	 * @retrun {[int, int, int]} the HSV components in an int array.
	 */
	getHsv: function (bounded) {
		var h, s, v, hsvF = this.getHsvF();
		h = Math.round(hsvF[0] * 360);
		s = Math.round(hsvF[1] * 100);
		v = Math.round(hsvF[2] * 100);
		if (bounded === true) {
			h = Math.min(Math.max(h, 0), 360);
			s = Math.min(Math.max(s, 0), 100);
			v = Math.min(Math.max(v, 0), 100);
		}
		return [h, s, v];
	},
	/**
	 * Returns a hexadecimal code of current color.
	 * @return {string} A six-digit hex triplet. eg. "f3d4aa".
	 */
	getHtml: function () {
		var rgb = this.getRgb(true);
		//rgb 256 to html hex converting
		var decColor = rgb[2] + 256 * rgb[1] + 65536 * rgb[0];
		var s = decColor.toString(16);
		return CR.String.repeat('0', 6 - s.length) + s;
	},
	/**
	 * Sets current color with specified color components, in RGB color space.
	 * Component's value range is [0, 1].
	 * @param {float} r The red component.
	 * @param {float} b The blue component.
	 * @param {float} g The green component.
	 * @return {CR.utils.Color} This object.
	 */
	setRgbF: function (r, g, b) {
		this._r = r;
		this._g = g;
		this._b = b;
		return this;
	},
	/**
	 * Sets current color with the specified color components,
	 * in the RGB color space.
	 * @param {[float, float, float]} a The array whose elements correspond to parameters
	 * of the 'setRgbF' method.
	 * @return {CR.utils.Color} This object.
	 */
	setRgbFArray: function (a) {
		this.setRgbF.apply(this, a);
		return this;
	},
	/**
	 * Sets current color with specified color components, in RGB color space.
	 * Component's value range is [0, 255].
	 * @param {int} r The red component.
	 * @param {int} b The blue component.
	 * @param {int} g The green component.
	 * @return {CR.utils.Color} This object.
	 */
	setRgb: function (r, g, b) {
		this.setRgbF(r / 255, g / 255, b / 255);
		return this;
	},
	/**
	 * Sets current color with specified color components, in RGB color space.
	 * @param {[int, int, int]} a The array whose elements correspond to parameters
	 * of 'setRgb' method.
	 * @return {CR.utils.Color} This object.
	 */
	setRgbArray: function (a) {
		this.setRgb.apply(this, a);
		return this;
	},
	/**
	 * Sets current color with the specified color components,
	 * in the HSV color space.
	 * @param {float} h The hue component (range 0 - 1).
	 * @param {float} s The saturation component (range 0 - 1).
	 * @param {float} v The value component (range 0 - 1).
	 * @return {CR.utils.Color} This object.
	 */
	setHsvF: function (h, s, v) {
		if (h < 0) {
			h = 1 + (h % 1);
		}
		if (h >= 1) {
			h = h % 1;
		}
		//hsv float to rgb float converting
		var r, g, b;
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0:
				r = v, g = t, b = p;
				break;
			case 1:
				r = q, g = v, b = p;
				break;
			case 2:
				r = p, g = v, b = t;
				break;
			case 3:
				r = p, g = q, b = v;
				break;
			case 4:
				r = t, g = p, b = v;
				break;
			case 5:
				r = v, g = p, b = q;
				break;
		}
		this.setRgbF(r, g, b);
		return this;
	},
	/**
	 * Sets current color with specified color components, in HSV color space.
	 * @param {[float, float, float]} a The array whose elements correspond to 
	 * parameters of 'setHsvF' method.
	 * @return {CR.utils.Color} This object.
	 */
	setHsvFArray: function (a) {
		this.setHsvF.apply(this, a);
		return this;
	},
	/**
	 * Sets current color with specified color components, in HSV color space.
	 * @param {int} h The hue component (range 0 - 360).
	 * @param {int} s The saturation component (range 0 - 100).
	 * @param {int} v The value component (range 0 - 100).
	 * @return {CR.utils.Color} This object.
	 */
	setHsv: function (h, s, v) {
		this.setHsvF(h / 360, s / 100, v / 100);
		return this;
	},
	/**
	 * Sets current color with specified color components, in HSV color space.
	 * @param {[int, int, int]} a The array whose elements correspond to parameters
	 * of 'setHsv' method.
	 * @return {CR.utils.Color} This object.
	 */
	setHsvArray: function (a) {
		this.setHsv.apply(this, a);
		return this;
	},
	/**
	 * Sets current color with the specified HTML color code.
	 * @param {string} hex A value of the parameter can be a six-digit or
	 * three-digit (shortcut) hex triplet, with or without a number sign,
	 * or an HTML color name.
	 * eg. "f3d4aa", "be8", "#12fd00", "#fff", "white".
	 * @return {CR.utils.Color} This object.
	 */
	setHtml: function (hex) {
		var r, g, b;
		if (this._cls.webColors[hex] !== undefined) {
			var wc = this._cls.webColors[hex];
			r = wc[0];
			g = wc[1];
			b = wc[2];
		} else {
			if (hex.indexOf('#') === 0)
				hex = hex.substr(1);
			if (hex.length === 3) {
				hex = hex.charAt(0) + hex.charAt(0) +
					hex.charAt(1) + hex.charAt(1) +
					hex.charAt(2) + hex.charAt(2);
			}
			r = parseInt(hex.substring(0, 2), 16);
			g = parseInt(hex.substring(2, 4), 16);
			b = parseInt(hex.substring(4, 6), 16);
		}
		this.setRgb(r, g, b);
		return this;
	},
	/**
	 * Sets a random color.
	 * @return {CR.utils.Color} This object.
	 */
	random: function () {
		this._r = Math.random();
		this._g = Math.random();
		this._b = Math.random();
		return this;
	}
});