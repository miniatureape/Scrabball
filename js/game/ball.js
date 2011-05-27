this.Scrabball = this.Scrabball || {};

(function($, G) {

    var RADIUS = 30;

    G.Ball = new Class({
        id: null,
        loc: null,
        acc: null,
        vel: null,
        rot: null,
        rad: null,
        color: null,
        val: '',

        initialize: function(loc) {
            this.loc = loc;
            this.acc = G.Vector2D.random(2);
            this.vel = G.Vector2D.random(2);
            this.rad = RADIUS;
        },

        render: function(ctx) {
            this.update();

            var stroke = '#ff0000';
            ctx.save();
            ctx.strokeStyle = stroke;
            ctx.fillStyle = stroke;
            ctx.translate(this.loc.x, this.loc.y);
            ctx.fillRect(0, 0, RADIUS, RADIUS);
            ctx.stroke();
            ctx.restore();

        },

        update: function() {
            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.loc.add(this.vel);
            this.acc.mult(0); 
        },

        collide: function(other) {
            var dist = G.Vector2D.sub(this.loc, other.loc).mag();
            if (dist < this.rad + other.rad) {
                console.log('Collision!', this, other);
            }
        },

    });

    G.BallMgr = function() {};

    G.BallMgr.createAlongLine = function(vec, num, size, spacing) {
        var results = [],
            stepVec = new G.Vector2D(0, size + spacing);

        for (var i = 0; i < num; i++) {
            results.push(new G.Ball(vec));
            vec = G.Vector2D.add(vec, stepVec);
        }

        return results;
    }

    G.BallMgr.collide = function(balls) {
        tested = {};
        balls.each(function(ball) {
            balls.each(function(other) {
                if (!tested[ball.id]) {
                    ball.collide(other);
                    tested[ball.id] 
                }
            })
        });
    
    }
 
 })(document.id, this.Scrabball)
