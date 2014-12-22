CR.define('CR.JQuery', 'jQuery', {
    constructor: function () {
        return jQuery.prototype.init.apply(this, arguments);
    },
    equals: function (compareTo) {
        if (!compareTo || this.length != compareTo.length) {
            return false;
        }
        for (var i = 0; i < this.length; ++i) {
            if (this[i] !== compareTo[i]) {
                return false;
            }
        }
        return true;
    },
    pushStack: function (elems) {
        if (this.equals(elems)) {
            return this;
        } else {
            // Build a new jQuery matched element set
            var ret = jQuery.merge(jQuery(), elems);
            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;
            // Return the newly-formed element set
            return ret;
        }
    }
});