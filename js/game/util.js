this.Scrabball = this.Scrabball || {};

(function($, G) {

    G.Util = {};

    G.Util.UP = new Vector2D(0, -1);
    G.Util.DOWN = new Vector2D(0, 1);
    G.Util.LEFT = new Vector2D(-1, 0);
    G.Util.RIGHT = new Vector2D(1, 0);

    G.Util.TWO_PI = Math.PI * 2;
 
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
    };

    // physics
    G.Util.wallCollision = function(ball, normal) {

    };


 })(document.id, this.Scrabball)
