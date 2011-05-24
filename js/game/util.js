this.Scrabball = this.Scrabball || {};

(function($, G) {

    G.Util = {};
 
    G.Util.qString = function(qs) {
        var result = {};
        if( qs[0] === '?') qs = qs.slice(1, qs.length);
        var parts = qs.split('&');

        parts.each(function(part) {
            var keyvals = part.split('=');
            if (!result[keyvals[0]]) {
                result[keyvals[0]] = keyvals[1];
            }
        });

        return result;
    }


 })(document.id, this.Scrabball)
