/**
 * @requires CR.dev.AbstractQUnitTest
 * @requires CR.utils.Color
 */

/**
 * @class CR.tests.utils.ColorTest
 */
CR.define('CR.tests.utils.ColorTest', 'CR.dev.AbstractQUnitTest', {
	_name: 'CR.utils.Color',
	testSetGetRgbF: function (assert) {
		var c, rgbF;

		c = new CR.utils.Color();
		c.setRgbF(0.5, 1, 4);
		rgbF = c.getRgbF();
		assert.ok(rgbF[0] === 0.5, 'r');
		assert.ok(rgbF[1] === 1, 'b');
		assert.ok(rgbF[2] === 4, 'g');
	},
	testSetRgbFArray: function (assert) {
		var c, rgbF;

		c = new CR.utils.Color();
		c.setRgbFArray([0.5, 1, 4]);
		rgbF = c.getRgbF();
		assert.ok(rgbF[0] === 0.5, 'r');
		assert.ok(rgbF[1] === 1, 'b');
		assert.ok(rgbF[2] === 4, 'g');
	},
	testSetGetRgb: function (assert) {
		// common
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setRgb(0, 128, 30);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 0, 'r');
			assert.ok(rgb[1] === 128, 'b');
			assert.ok(rgb[2] === 30, 'g');
		})();
		
		// rgbF
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setRgbF(1, 0.5, 4);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 255, 'r (rgbF)');
			assert.ok(rgb[1] === 128, 'b (rgbF)');
			assert.ok(rgb[2] === 1020, 'g (rgbF)');
		})();
		
		// out of bounds
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setRgb(30, -100, 300);
			// bounded
			rgb = c.getRgb(true);
			assert.ok(rgb[1] === 0, 'g (out of bounds, bounded, negative)');
			assert.ok(rgb[2] === 255, 'b (out of bounds, bounded, positive)');
			// unbounded
			rgb = c.getRgb();
			assert.ok(rgb[1] === -100, 'g (out of bounds, unbounded, negative)');
			assert.ok(rgb[2] === 300, 'b (out of bounds, unbounded, positive)');
		})();
	},
	testSetRgbArray: function (assert) {
		// common
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setRgbArray([0, 128, 30]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 0, 'r');
			assert.ok(rgb[1] === 128, 'b');
			assert.ok(rgb[2] === 30, 'g');
		})();
		
		// out of bounds
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setRgbArray([30, -100, 300]);
			// bounded
			rgb = c.getRgb(true);
			assert.ok(rgb[1] === 0, 'g (out of bounds, bounded, negative)');
			assert.ok(rgb[2] === 255, 'b (out of bounds, bounded, positive)');
			// unbounded
			rgb = c.getRgb();
			assert.ok(rgb[1] === -100, 'g (out of bounds, unbounded, negative)');
			assert.ok(rgb[2] === 300, 'b (out of bounds, unbounded, positive)');
		})();
	},
	testGetRgbF: function (assert) {
		(function () {
			var c, rgbF;
			c = new CR.utils.Color();
			c.setRgb(0, 200, 255);
			rgbF = c.getRgbF();
			assert.ok(rgbF[0] === 0, 'r');
			assert.ok(rgbF[1] === 0.7843137254901961, 'b'); // 200/255
			assert.ok(rgbF[2] === 1, 'g');
		}());
	},
	testGetHsvF: function (assert) {
		(function () {
			var c, hsvF;
			c = new CR.utils.Color();
			c.setRgb(100, 200, 0);
			hsvF = c.getHsvF();
			assert.ok(hsvF[0] === 0.25, 'h');
			assert.ok(hsvF[1] === 1, 's');
			assert.ok(hsvF[2] === 0.7843137254901961, 'v');
			// white
			c.setRgb(255, 255, 255);
			hsvF = c.getHsvF();
			assert.ok(hsvF[0] === 0, 'h (white)');
			assert.ok(hsvF[1] === 0, 's (white)');
			assert.ok(hsvF[2] === 1, 'v (white)');
		}());
	},
	testGetHsv: function (assert) {
		// common
		(function () {
			var c, hsv;
			c = new CR.utils.Color();
			c.setRgb(30, 60, 0);
			hsv = c.getHsv();
			assert.ok(hsv[0] === 90, 'h');
			assert.ok(hsv[1] === 100, 's');
			assert.ok(hsv[2] === 24, 'v');
			// white
			c.setRgb(255, 255, 255);
			hsv = c.getHsv();
			assert.ok(hsv[0] === 0, 'h (white)');
			assert.ok(hsv[1] === 0, 's (white)');
			assert.ok(hsv[2] === 100, 'v (white)');
		})();
		
		// out of bounds
		(function () {
			var c, hsv;
			c = new CR.utils.Color();
			c.setRgb(-890, 700, 800);
			// bounded
			hsv = c.getHsv(true);
			assert.ok(hsv[0] === 184, 'r (out of bounds, bounded)');
			assert.ok(hsv[1] === 100, 'g (out of bounds, bounded)');
			assert.ok(hsv[2] === 100, 'b (out of bounds, bounded)');
			// unbounded
			hsv = c.getHsv();
			assert.ok(hsv[0] === 184, 'r (out of bounds, unbounded)');
			assert.ok(hsv[1] === 211, 'g (out of bounds, unbounded)');
			assert.ok(hsv[2] === 314, 'b (out of bounds, unbounded)');
		})();
	},
	testGetHtml: function (assert) {
		(function () {
			var c, html;
			c = new CR.utils.Color();
			c.setRgb(0, 16, 255);
			html = c.getHtml();
			assert.ok(html === '0010ff', 'html');
			// out of bounds
			c.setRgb(0, -100, 300);
			html = c.getHtml();
			assert.ok(html === '0000ff', 'html (out of bounds)');
		})();
	},
	testSetHsvF: function (assert) {
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			// 1
			c.setHsvF(0, 0.5, 0.5);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (1)');
			assert.ok(rgb[1] === 64, 'g (1)');
			assert.ok(rgb[2] === 64, 'b (1)');
			// 2
			c.setHsvF(0.5, 0.25, 0.5);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 96, 'r (2)');
			assert.ok(rgb[1] === 128, 'g (2)');
			assert.ok(rgb[2] === 128, 'b (2)');
		})();
		
		// hue out of bounds
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setHsvF(2, 0.5, 0.5);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (hue out of bounds)');
			assert.ok(rgb[1] === 64, 'g (hue out of bounds)');
			assert.ok(rgb[2] === 64, 'b (hue out of bounds)');
		})();
	},
	testSetHsvFArray: function (assert) {
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			// 1
			c.setHsvFArray([0, 0.5, 0.5]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (1)');
			assert.ok(rgb[1] === 64, 'g (1)');
			assert.ok(rgb[2] === 64, 'b (1)');
			// 2
			c.setHsvFArray([0.5, 0.25, 0.5]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 96, 'r (2)');
			assert.ok(rgb[1] === 128, 'g (2)');
			assert.ok(rgb[2] === 128, 'b (2)');
		})();
		
		// hue out of bounds
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setHsvFArray([2, 0.5, 0.5]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (hue out of bounds)');
			assert.ok(rgb[1] === 64, 'g (hue out of bounds)');
			assert.ok(rgb[2] === 64, 'b (hue out of bounds)');
		})();
	},
	testSetHsv: function (assert) {
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			// 1
			c.setHsv(233, 67, 45);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 38, 'r (1)');
			assert.ok(rgb[1] === 47, 'g (1)');
			assert.ok(rgb[2] === 115, 'b (1)');
			// 2
			c.setHsv(0, 100, 50);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (2)');
			assert.ok(rgb[1] === 0, 'g (2)');
			assert.ok(rgb[2] === 0, 'b (2)');
			// 3
			c.setHsv(127, 99, 1);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 0, 'r (3)');
			assert.ok(rgb[1] === 3, 'g (3)');
			assert.ok(rgb[2] === 0, 'b (3)');
		})();
		// hue out of bounds
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setHsv(720, 100, 50);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (hue out of bounds)');
			assert.ok(rgb[1] === 0, 'g (hue out of bounds)');
			assert.ok(rgb[2] === 0, 'b (hue out of bounds)');
		})();
	},
	testSetHsvArray: function (assert) {
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			// 1
			c.setHsvArray([233, 67, 45]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 38, 'r (1)');
			assert.ok(rgb[1] === 47, 'g (1)');
			assert.ok(rgb[2] === 115, 'b (1)');
			// 2
			c.setHsvArray([0, 100, 50]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (2)');
			assert.ok(rgb[1] === 0, 'g (2)');
			assert.ok(rgb[2] === 0, 'b (2)');
			// 3
			c.setHsvArray([127, 99, 1]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 0, 'r (3)');
			assert.ok(rgb[1] === 3, 'g (3)');
			assert.ok(rgb[2] === 0, 'b (3)');
		})();
		
		// hue out of bounds
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			c.setHsvArray([720, 100, 50]);
			rgb = c.getRgb();
			assert.ok(rgb[0] === 128, 'r (if hue out of bounds)');
			assert.ok(rgb[1] === 0, 'g (if hue out of bounds)');
			assert.ok(rgb[2] === 0, 'b (if hue out of bounds)');
		})();
	},
	testSetHtml: function (assert) {
		(function () {
			var c, rgb;
			c = new CR.utils.Color();
			// with number sign
			c.setHtml('#45fadd');
			rgb = c.getRgb();
			assert.ok(rgb[0] === 69, 'r (with number sign)');
			assert.ok(rgb[1] === 250, 'g (with number sign)');
			assert.ok(rgb[2] === 221, 'b (with number sign)');
			// without number sign
			c.setHtml('ffab00');
			rgb = c.getRgb();
			assert.ok(rgb[0] === 255, 'r (without number sign)');
			assert.ok(rgb[1] === 171, 'g (without number sign)');
			assert.ok(rgb[2] === 0, 'b (without number sign)');
			// different case
			c.setHtml('F1fE3b');
			rgb = c.getRgb();
			assert.ok(rgb[0] === 241, 'r (different case)');
			assert.ok(rgb[1] === 254, 'g (different case)');
			assert.ok(rgb[2] === 59, 'b (different case)');
			// word
			c.setHtml('lightblue');
			rgb = c.getRgb();
			assert.ok(rgb[0] === 173, 'r (word)');
			assert.ok(rgb[1] === 216, 'g (word)');
			assert.ok(rgb[2] === 230, 'b (word)');
			// shorthand
			c.setHtml('#fb2');
			rgb = c.getRgb();
			assert.ok(rgb[0] === 255, 'r (shorthand)');
			assert.ok(rgb[1] === 187, 'g (shorthand)');
			assert.ok(rgb[2] === 34, 'b (shorthand)');
		})();
	},
	test_chainable: function (assert) {
		(function () {
			var c = new CR.utils.Color();
			assert.ok(c.setRgbF(1, 1, 1) === c, 'setRgbF()');
			assert.ok(c.setRgb(1, 1, 1) === c, 'setRgb()');
			assert.ok(c.setHsvF(1, 1, 1) === c, 'setHsvF()');
			assert.ok(c.setHsv(1, 1, 1) === c, 'setHsv()');
			assert.ok(c.setHtml('#abcdef') === c, 'setHtml()');
		})();
	}
});