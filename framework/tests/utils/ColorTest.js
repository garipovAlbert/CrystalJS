/**
 * @requires CR.dev.AbstractUnitTest
 * @requires CR.utils.Color
 */

/**
 * @class CR.tests.utils.ColorTest
 */
CR.define('CR.tests.utils.ColorTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_utils_Color',
    testSetGetRgbF: function(){
        var me = this, c, rgbF;
        
        c = new CR.utils.Color();
        c.setRgbF(0.5, 1, 4);
        rgbF = c.getRgbF();
        me.assertTrue('r', rgbF[0] === 0.5);
        me.assertTrue('b', rgbF[1] === 1);
        me.assertTrue('g', rgbF[2] === 4);
    },
    testSetRgbFArray: function(){
        var me = this, c, rgbF;
        
        c = new CR.utils.Color();
        c.setRgbFArray([0.5, 1, 4]);
        rgbF = c.getRgbF();
        me.assertTrue('r', rgbF[0] === 0.5);
        me.assertTrue('b', rgbF[1] === 1);
        me.assertTrue('g', rgbF[2] === 4);
    },
    testSetGetRgb: function(){
        var me = this;
        
        // common
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setRgb(0, 128, 30);
            rgb = c.getRgb();
            me.assertTrue('r', rgb[0] === 0);
            me.assertTrue('b', rgb[1] === 128);
            me.assertTrue('g', rgb[2] === 30);
        })();
        // rgbF
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setRgbF(1, 0.5, 4);
            rgb = c.getRgb();
            me.assertTrue('r (rgbF)', rgb[0] === 255);
            me.assertTrue('b (rgbF)', rgb[1] === 128);
            me.assertTrue('g (rgbF)', rgb[2] === 1020);
        })();
        // out of bounds
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setRgb(30, -100, 300);
            // bounded
            rgb = c.getRgb(true);
            me.assertTrue('g (out of bounds, bounded, negative)', rgb[1] === 0);
            me.assertTrue('b (out of bounds, bounded, positive)', rgb[2] === 255);
            // unbounded
            rgb = c.getRgb();
            me.assertTrue('g (out of bounds, unbounded, negative)', rgb[1] === -100);
            me.assertTrue('b (out of bounds, unbounded, positive)', rgb[2] === 300);
        })();
    },
    testSetRgbArray: function(){
        var me = this;
        
        // common
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setRgbArray([0, 128, 30]);
            rgb = c.getRgb();
            me.assertTrue('r', rgb[0] === 0);
            me.assertTrue('b', rgb[1] === 128);
            me.assertTrue('g', rgb[2] === 30);
        })();
        // out of bounds
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setRgbArray([30, -100, 300]);
            // bounded
            rgb = c.getRgb(true);
            me.assertTrue('g (out of bounds, bounded, negative)', rgb[1] === 0);
            me.assertTrue('b (out of bounds, bounded, positive)', rgb[2] === 255);
            // unbounded
            rgb = c.getRgb();
            me.assertTrue('g (out of bounds, unbounded, negative)', rgb[1] === -100);
            me.assertTrue('b (out of bounds, unbounded, positive)', rgb[2] === 300);
        })();
    },
    testGetRgbF: function(){
        var me = this;

        (function(){
            var c, rgbF;
            c = new CR.utils.Color();
            c.setRgb(0, 200, 255);
            rgbF = c.getRgbF();
            me.assertTrue('r', rgbF[0] === 0);
            me.assertTrue('b', rgbF[1] === 0.7843137254901961); // 200/255
            me.assertTrue('g', rgbF[2] === 1);
        }());
    },
    testGetHsvF: function(){
        var me = this;
        
        (function(){
            var c, hsvF;
            c = new CR.utils.Color();
            c.setRgb(100, 200, 0);
            hsvF = c.getHsvF();
            me.assertTrue('h', hsvF[0] === 0.25);
            me.assertTrue('s', hsvF[1] === 1);
            me.assertTrue('v', hsvF[2] === 0.7843137254901961);
            // white
            c.setRgb(255, 255, 255);
            hsvF = c.getHsvF();
            me.assertTrue('h (white)', hsvF[0] === 0);
            me.assertTrue('s (white)', hsvF[1] === 0);
            me.assertTrue('v (white)', hsvF[2] === 1);
        }());
    },
    testGetHsv: function(){
        var me = this;
        
        // common
        (function(){
            var c, hsv;
            c = new CR.utils.Color();
            c.setRgb(30, 60, 0);
            hsv = c.getHsv();
            me.assertTrue('h', hsv[0] === 90);
            me.assertTrue('s', hsv[1] === 100);
            me.assertTrue('v', hsv[2] === 24);
            // white
            c.setRgb(255, 255, 255);
            hsv = c.getHsv();
            me.assertTrue('h (white)', hsv[0] === 0);
            me.assertTrue('s (white)', hsv[1] === 0);
            me.assertTrue('v (white)', hsv[2] === 100);
        })();
        // out of bounds
        (function(){
            var c, hsv;
            c = new CR.utils.Color();
            c.setRgb(-890, 700, 800);
            // bounded
            hsv = c.getHsv(true);
            me.assertTrue('r (out of bounds, bounded)', hsv[0] === 184);
            me.assertTrue('g (out of bounds, bounded)', hsv[1] === 100);
            me.assertTrue('b (out of bounds, bounded)', hsv[2] === 100);
            // unbounded
            hsv = c.getHsv();
            me.assertTrue('r (out of bounds, unbounded)', hsv[0] === 184);
            me.assertTrue('g (out of bounds, unbounded)', hsv[1] === 211);
            me.assertTrue('b (out of bounds, unbounded)', hsv[2] === 314);
        })();
    },
    testGetHtml: function(){
        var me = this;
        
        (function(){
            var c, html;
            c = new CR.utils.Color();
            c.setRgb(0, 16, 255);
            html = c.getHtml();
            me.assertTrue('html', html === '0010ff');
            // out of bounds
            c.setRgb(0, -100, 300);
            html = c.getHtml();
            me.assertTrue('html (out of bounds)', html === '0000ff');
        })();
    },
    testSetHsvF: function(){
        var me = this;
        
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            // 1
            c.setHsvF(0, 0.5, 0.5);
            rgb = c.getRgb();
            me.assertTrue('r (1)', rgb[0] === 128);
            me.assertTrue('g (1)', rgb[1] === 64);
            me.assertTrue('b (1)', rgb[2] === 64);
            // 2
            c.setHsvF(0.5, 0.25, 0.5);
            rgb = c.getRgb();
            me.assertTrue('r (2)', rgb[0] === 96);
            me.assertTrue('g (2)', rgb[1] === 128);
            me.assertTrue('b (2)', rgb[2] === 128);
        })();
        // hue out of bounds
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setHsvF(2, 0.5, 0.5);
            rgb = c.getRgb();
            me.assertTrue('r (hue out of bounds)', rgb[0] === 128);
            me.assertTrue('g (hue out of bounds)', rgb[1] === 64);
            me.assertTrue('b (hue out of bounds)', rgb[2] === 64);
        })();
    },
    testSetHsvFArray: function(){
        var me = this;
        
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            // 1
            c.setHsvFArray([0, 0.5, 0.5]);
            rgb = c.getRgb();
            me.assertTrue('r (1)', rgb[0] === 128);
            me.assertTrue('g (1)', rgb[1] === 64);
            me.assertTrue('b (1)', rgb[2] === 64);
            // 2
            c.setHsvFArray([0.5, 0.25, 0.5]);
            rgb = c.getRgb();
            me.assertTrue('r (2)', rgb[0] === 96);
            me.assertTrue('g (2)', rgb[1] === 128);
            me.assertTrue('b (2)', rgb[2] === 128);
        })();
        // hue out of bounds
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setHsvFArray([2, 0.5, 0.5]);
            rgb = c.getRgb();
            me.assertTrue('r (hue out of bounds)', rgb[0] === 128);
            me.assertTrue('g (hue out of bounds)', rgb[1] === 64);
            me.assertTrue('b (hue out of bounds)', rgb[2] === 64);
        })();
    },
    testSetHsv: function(){
        var me = this;
        
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            // 1
            c.setHsv(233, 67, 45);
            rgb = c.getRgb();
            me.assertTrue('r (1)', rgb[0] === 38);
            me.assertTrue('g (1)', rgb[1] === 47);
            me.assertTrue('b (1)', rgb[2] === 115);
            // 2
            c.setHsv(0, 100, 50);
            rgb = c.getRgb();
            me.assertTrue('r (2)', rgb[0] === 128);
            me.assertTrue('g (2)', rgb[1] === 0);
            me.assertTrue('b (2)', rgb[2] === 0);
            // 3
            c.setHsv(127, 99, 1);
            rgb = c.getRgb();
            me.assertTrue('r (3)', rgb[0] === 0);
            me.assertTrue('g (3)', rgb[1] === 3);
            me.assertTrue('b (3)', rgb[2] === 0);
        })();
        // hue out of bounds
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setHsv(720, 100, 50);
            rgb = c.getRgb();
            me.assertTrue('r (hue out of bounds)', rgb[0] === 128);
            me.assertTrue('g (hue out of bounds)', rgb[1] === 0);
            me.assertTrue('b (hue out of bounds)', rgb[2] === 0);		
        })();
    },
    testSetHsvArray: function(){
        var me = this;
        
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            // 1
            c.setHsvArray([233, 67, 45]);
            rgb = c.getRgb();
            me.assertTrue('r (1)', rgb[0] === 38);
            me.assertTrue('g (1)', rgb[1] === 47);
            me.assertTrue('b (1)', rgb[2] === 115);
            // 2
            c.setHsvArray([0, 100, 50]);
            rgb = c.getRgb();
            me.assertTrue('r (2)', rgb[0] === 128);
            me.assertTrue('g (2)', rgb[1] === 0);
            me.assertTrue('b (2)', rgb[2] === 0);
            // 3
            c.setHsvArray([127, 99, 1]);
            rgb = c.getRgb();
            me.assertTrue('r (3)', rgb[0] === 0);
            me.assertTrue('g (3)', rgb[1] === 3);
            me.assertTrue('b (3)', rgb[2] === 0);
        })();
        // hue out of bounds
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            c.setHsvArray([720, 100, 50]);
            rgb = c.getRgb();
            me.assertTrue('r (if hue out of bounds)', rgb[0] === 128);
            me.assertTrue('g (if hue out of bounds)', rgb[1] === 0);
            me.assertTrue('b (if hue out of bounds)', rgb[2] === 0);
        })();
    },
    testSetHtml: function(){
        var me = this;
        
        (function(){
            var c, rgb;
            c = new CR.utils.Color();
            // with number sign
            c.setHtml('#45fadd');
            rgb = c.getRgb();
            me.assertTrue('r (with number sign)', rgb[0] === 69);
            me.assertTrue('g (with number sign)', rgb[1] === 250);
            me.assertTrue('b (with number sign)', rgb[2] === 221);
            // without number sign
            c.setHtml('ffab00');
            rgb = c.getRgb();
            me.assertTrue('r (without number sign)', rgb[0] === 255);
            me.assertTrue('g (without number sign)', rgb[1] === 171);
            me.assertTrue('b (without number sign)', rgb[2] === 0);
            // different case
            c.setHtml('F1fE3b');
            rgb = c.getRgb();
            me.assertTrue('r (different case)', rgb[0] === 241);
            me.assertTrue('g (different case)', rgb[1] === 254);
            me.assertTrue('b (different case)', rgb[2] === 59);
            // word
            c.setHtml('lightblue');
            rgb = c.getRgb();
            me.assertTrue('r (word)', rgb[0] === 173);
            me.assertTrue('g (word)', rgb[1] === 216);
            me.assertTrue('b (word)', rgb[2] === 230);
            // shorthand
            c.setHtml('#fb2');
            rgb = c.getRgb();
            me.assertTrue('r (shorthand)', rgb[0] === 255);
            me.assertTrue('g (shorthand)', rgb[1] === 187);
            me.assertTrue('b (shorthand)', rgb[2] === 34);
        })();
    },
    test_chainable: function(){
        var me = this;
        
        (function(){
            var c = new CR.utils.Color();
            me.assertTrue('setRgbF()', c.setRgbF(1, 1 ,1) === c);
            me.assertTrue('setRgb()', c.setRgb(1, 1 ,1) === c);
            me.assertTrue('setHsvF()', c.setHsvF(1, 1 ,1) === c);
            me.assertTrue('setHsv()', c.setHsv(1, 1 ,1) === c);
            me.assertTrue('setHtml()', c.setHtml('#abcdef') === c);
        })();
    }
});