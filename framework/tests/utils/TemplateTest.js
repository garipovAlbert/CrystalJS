/**
 * @requires CR.dev.AbstractQUnitTest
 * @requires CR.utils.Template
 */

/**
 * @class CR.tests.utils.TemplateTest
 */
CR.define('CR.tests.utils.TemplateTest', 'CR.dev.AbstractQUnitTest', {
    _name: 'CR.utils.Template',
    'test apply()': function (assert) {
        var tplStr1 =
            '<$ for(var k in list){ $>' +
            '[<$=k$>:<$=list[k]$>]' +
            '<$ } $>';
        var tplStr2 =
            '<$ ' +
            'var res = "";' +
            'for(var k in list){ ' +
            '	res += (", "+k+": "+list[k]);' +
            '}' +
            'res = res.substring(2);' +
            '$>' +
            '{<$=res$>}';
        var values = {
            list: {
                one: 1,
                two: 2
            }
        };

        //common
        (function () {
            var tpl1 = new CR.utils.Template(tplStr1);
            var result1 = tpl1.apply(values);
            assert.ok(result1 === '[one:1][two:2]', 'common 1');
            var tpl2 = new CR.utils.Template(tplStr2);
            var result2 = tpl2.apply(values);
            assert.ok(result2 === '{one: 1, two: 2}', 'common 2');
        }());
    }
});