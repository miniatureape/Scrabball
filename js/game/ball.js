this.Scrabball = this.Scrabball || {};

(function($, G) {

    var RADIUS = 10;
    var FRICTION = 75;

    G.Ball = new Class({
        id: null,
        loc: null,
        acc: null,
        vel: null,
        rot: null,
        rad: null,
        color: null,
        maxSpeed: 10,
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
            ctx.beginPath();
            ctx.translate(this.loc.x, this.loc.y);
            ctx.arc(0, 0, RADIUS, 0, G.Util.TWO_PI);
            ctx.stroke();
            ctx.restore();

        },

        update: function() {
            this.friction(this.vel);

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

        friction: function(vel) {
            // TODO, you might want to stop thing completely if their vel/acc is too low
            var frict = G.Vector2D.mult(vel, -1).scale(1/FRICTION);
            vel.add(frict);
        }

    });

    G.BallMgr = function(balls) {
        this.balls = balls;
    };

    G.BallMgr.prototype.createAlongLine = function(vec, num, size, spacing) {
        var results = [],
            stepVec = new G.Vector2D(0, size + spacing);

        for (var i = 0; i < num; i++) {
            results.push(new G.Ball(vec));
            vec = G.Vector2D.add(vec, stepVec);
        }

        return results;
    }

    G.BallMgr.prototype.collide = function() {
        tested = {};

        this.balls.each(function(ball) {

            // Collide with other balls.
            this.balls.each(function(other) {
                if (!tested[ball.id]) {
                    ball.collide(other);
                    tested[ball.id] 
                }
            })

            // Collide with walls
            ball.walls();
        });
    
    }
 
 })(document.id, this.Scrabball)
