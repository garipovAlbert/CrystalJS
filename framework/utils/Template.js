/**
 * @class CR.utils.Template
 * A template with JavaScript constructions.
 * @example
 * <code>
 * var templateString = '<$ for(var i = 0; i < users.length; i++){ $>'+
 * '<li><a href="<$=users[i].url$>"><$=users[i].name$></a></li>\n'+
 * '<$ } $>';
 * var template = new CR.utils.Template(templateString);
 * var result = template.apply({
 *	users: [{
 *		name: 'John'
 *		,url: 'www.john.com'
 *	}, {
 *		name: 'Steve'
 *		,url: 'www.steve.com'
 *	}]
 * });
 * </code>
 * The 'result' variable contain the string:
 * <html>
 * <li><a href="www.john.com">John</a></li>
 * <li><a href="www.steve.com">Steve</a></li>
 * </html>
 */
CR.define('CR.utils.Template', 'CR.Object', {
    _tplStr: null,
    _chached: true,
    _fn: null,
    /**
     * @param {string} tplStr The template string.
     * @param {boolean} [chached] Whether to use caching. Defaults to true.
     */
    constructor: function(tplStr, chached){
        this._tplStr = tplStr;
        if(chached !== undefined){
            this._chached = chached;
        }
    },
    _compile_: (function(){
        var cache = {};
        // currying
        return function(str){
            if(cache[str] !== undefined){
                return cache[str];
            }
            // create the template function
            var body = '';
            body += "var p=[],print=function(){p.push.apply(p,arguments);};";
            body += "with(obj){p.push('";
            body += str
            .replace(/[\r\t\n]/g, " ")
            .split("<$").join("\t")
            .replace(/((^|\$>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)\$>/g, "',$1,'")
            .split("\t").join("');")
            .split("$>").join("p.push('")
            .split("\r").join("\\'");
            body += "');}return p.join('');";
            var fn = new Function("obj", body);
            if(this._chached){
                cache[str] = fn;
            }
            return fn;
        }
    }()),
    /**
     * Applies specified values to the template and returns a result.
     * @param {Object} values The template values.
     * @return {string}
     */
    apply: function(values){
        if(this._fn === null){
            this._fn = this._compile_(this._tplStr);
        }
        return this._fn(values);
    }
});