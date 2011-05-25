this.Scrabball = this.Scrabball || {};

(function($, G) {
    
    var NUM_BOXES = 8;
    var BOX_SIZE = 20; // px
    var BOX_SPACING = 5; //px

    G.Trough = new Class({

        boxes: [],
        player: null,  // todo, should the trough have a player?

        initialize: function(vec) {
            this.createBoxes(vec);
        },

        createBoxes: function(vec) {
            var stepVec = new G.Vector2D(0, BOX_SIZE + BOX_SPACING);
            for (var i = 0; i < NUM_BOXES; i++) {
                this.boxes.push( new G.Scorebox(vec) );
                vec = G.Vector2D._add(vec, stepVec);
            }
        },

        render: function(ctx) {
            this.renderBoxes(ctx);
        },

        renderBoxes: function(ctx) {
            this.boxes.each(function(box){ box.render(ctx) });
        }
        
    });

    G.Scorebox = new Class({

        initialize: function(vec) {
            this.loc = vec;
            console.log("Box is at", vec.toString());
        },

        render: function(ctx) {
            var stroke = '#ff0000';
            ctx.save();
            ctx.strokeStyle = stroke;
            ctx.fillStyle = stroke;
            ctx.translate(this.loc.x, this.loc.y);
            ctx.fillRect(0, 0, BOX_SIZE, BOX_SIZE);
            ctx.stroke();
            ctx.restore();
        }

    });
 
 })(document.id, this.Scrabball)
