this.Scrabball = this.Scrabball || {};

(function($, G) {

    Vector2D.prototype.fromCoords = function(coords) {
        this.x = coords.left;
        this.y = coords.top;
    }

    G.Vector2D = Vector2D;
 
 })(document.id, this.Scrabball)
