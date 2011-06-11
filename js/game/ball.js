this.Scrabball = this.Scrabball || {};

(function($, G) {

    var RADIUS = 15;
    var FRICTION = 50;

    G.Ball = new Class({
        id: null,
        loc: null,
        acc: null,
        vel: null,
        rot: null,
        rad: null,
        color: null,
        mass: 1,
        maxSpeed: 20,
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

        applyForce: function(force) {
            force.div(this.mass);
            this.acc.add(force);
        },

        collide: function(other) {
            var normal = G.Vector2D.sub(this.loc, other.loc); 
            var dist = normal.mag();
            if (dist < this.rad + other.rad) {
                // Move balls to boundaries so they aren't overlapping
                var unitNormal = normal.get().normalize();
                var offset = this.rad - dist / 2;

                this.loc = this.loc.add(unitNormal.get().scale(offset));
                other.loc = other.loc.add(unitNormal.get().scale(-offset));

                var velDiff = this.vel.get().sub(other.vel.get());
                var un = G.Vector2D.componentVector(velDiff, normal.get());
                var ut = velDiff.sub(un);

                this.vel.set(ut.add(other.vel));
                other.vel.set(un.add(other.vel));
            }
        },

        bounds: function(bounds) {
           var normal, c;
           if (this.loc.x < bounds.topleft.x + this.rad) normal = G.Util.RIGHT;
           if (this.loc.y < bounds.topleft.y + this.rad) normal = G.Util.DOWN;
           if (this.loc.x > bounds.bottomright.x - this.rad) normal = G.Util.LEFT;
           if (this.loc.y > bounds.bottomright.y - this.rad) normal = G.Util.UP;
           if (normal) {
               var c = Vector2D.componentVector(this.vel, normal);
               this.vel.sub(c.mult(2));
           }
        },

        friction: function(vel) {
            // TODO, you might want to stop thing completely if their vel/acc is too low
            var frict = G.Vector2D.mult(vel, -1).scale(1/FRICTION);
            vel.add(frict);
        },

        over: function(pos) {
            var diff = G.Vector2D.sub(pos, this.loc);
            return diff.mag() <= this.rad;
        },


    });

    G.BallMgr = function(bounds) {
        this.bounds = bounds;
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

    G.BallMgr.prototype.collide = function(balls) {
        tested = {};

        balls.each(function(ball) {

            // Collide with other balls.
            balls.each(function(other) {
                if (!tested[ball.id] && ball != other) {
                    ball.collide(other);
                    tested[ball.id] 
                }
            })

            // Collide with walls
            ball.bounds(this.bounds);
        }, this);
    
    }

    G.BallMgr.prototype.testClick = function(balls, pos) {
        this.hit = null;

        balls.each(function(ball) {
            if (ball.over(pos)) {
                this.hit = ball;
            }
        }, this);

        return this.hit;
    }
 
 })(document.id, this.Scrabball)
