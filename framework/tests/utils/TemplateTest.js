/**
 * @requires CR.dev.AbstractUnitTest
 * @requires CR.utils.Template
 */

/**
 * @class CR.tests.utils.TemplateTest
 */
CR.define('CR.tests.utils.TemplateTest', 'CR.dev.AbstractUnitTest', {
    _name: 'CR_utils_Template',
    testApply: function(){
        var me = this,
        tplStr1 =
        '<$ for(var k in list){ $>'+
        '[<$=k$>:<$=list[k]$>]'+
        '<$ } $>',
        tplStr2 =
        '<$ '+
        'var res = "";'+
        'for(var k in list){ '+
        '	res += (", "+k+": "+list[k]);'+
        '}'+
        'res = res.substring(2);'+
        '$>'+
        '{<$=res$>}',
        values = {
            list: {
                one: 1,
                two: 2
            }
        };
        
        //common
        (function(){
            var tpl1 = new CR.utils.Template(tplStr1);
            var result1 = tpl1.apply(values);
            me.assertTrue('common', result1 === '[one:1][two:2]');
            var tpl2 = new CR.utils.Template(tplStr2);
            var result2 = tpl2.apply(values);
            me.assertTrue('common', result2 === '{one: 1, two: 2}');
        }());
    }
});