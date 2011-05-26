this.Scrabball = this.Scrabball || {};

(function($, G) {

    var RADIUS = 10;

    G.Ball = new Class({
        pos: null,
        acc: null,
        rot: null,
        rad: null,
        color: null,
        val: '',

        render: function(ctx) {

        }

    });

    G.BallMgr = function() {};

    G.BallMgr.createAlongLine = function(vec, num, size, spacing) {
        var results = [],
            stepVec = new G.Vector2D(0, size + spacing);

        for (var i = 0; i < num; i++) {
            results.push('balls', new G.Ball(vec));
            vec = G.Vector2D._add(vec, stepVec);
        }

        return results;
    }
 
 })(document.id, this.Scrabball)
