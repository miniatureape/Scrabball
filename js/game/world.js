this.Scrabball = this.Scrabball || {};

(function($, G) {

    G.P_ONE = 1;
    G.P_TWO = 2;

    var ONE_SECOND = 1000;
    var TROUGH_OFFSET_H = 10; // % of dim
    var TROUGH_OFFSET_V = 10; // % of dim

    var Board = new Class({
        Implements: [Options],

        sprites: {
            environ: [],
            troughs: [],
            balls: [],
        },

        options: {
            lineColor: '#666666'
        },

        initialize: function(canvas, opts) {
            var canvas = $(canvas);
            this.setOptions(opts);
            this.ctx = canvas.getContext('2d');
            this.coords = canvas.getCoordinates();
            this.width = this.coords.width;
            this.height = this.coords.height;

            this.setupBoard(this.ctx);
            this.setupInputs(canvas);

            var bounds = this.createBounds();
            this.ballMgr = new G.BallMgr(bounds);
        },

        setupInputs: function(canvas) {

            // Initial State
            G.mousePos = new G.Vector2D(0, 0);
            G.lastMousePos = new G.Vector2D(0, 0);
            G.mousePressed = false;   

            canvas.addEvent('mousedown', this.mouseDown.bind(this));
            canvas.addEvent('mouseup', this.mouseUp.bind(this));
            canvas.addEvent('mousemove', this.mouseMove.bind(this));

        },

        mouseDown: function(e) {
            e.preventDefault();
            G.mousePressed = true;
            var hit = this.ballMgr.testClick(this.sprites.balls, G.mousePos);
            if (hit) {
                hit.vel.zero();
            }
        },

        mouseUp: function(e) {
            e.preventDefault();

            // Handle interaction
            if (G.mousePressed && this.ballMgr.hit) {
                var vel = G.mousePos.get().sub(G.lastMousePos);
                this.ballMgr.hit.applyForce(vel);
            }

            G.mousePressed = false;   
            this.ballMgr.hit = null;
        },

        mouseMove: function(e) {
            // convert to element position
            var x = e.page.x - this.coords.left,
                y = e.page.y - this.coords.top;

            // Set global positions
            G.lastMousePos = G.mousePos.get();
            G.mousePos.setCoords(x,y);

            var vel = G.mousePos.get().sub(G.lastMousePos);
            this.ballMgr.hit.applyForce(vel.scale(.1));

        },
        
        createBounds: function() {
            return {
                topleft: {x: 0, y: 0},
                bottomright: {x: this.width, y: this.height}
            };
        },

        setupBoard: function(ctx) {
            this.buildTroughs();
            // TODO, whatelse? Score? Submit Btn?
        },

        buildTroughs: function() {
            var x = TROUGH_OFFSET_H,
                y = TROUGH_OFFSET_V;
                
            var vec = this.getOffset(G.P_ONE, x, y);
            var pOneTrough = new G.Trough(vec);
            this.pushSprite('troughs', pOneTrough);

            vec = this.getOffset(G.P_TWO, x, y);
            var pTwoTrough = new G.Trough(vec);
            this.pushSprite('troughs', pTwoTrough);
        },

        addInitialBalls: function() {
            // TODO When these are finalized, make them their own constants.
            var x = TROUGH_OFFSET_H * 2,
                y = TROUGH_OFFSET_V;

            var vec = this.getOffset(G.P_ONE, x, y);
            var balls = this.ballMgr.createAlongLine(vec, 10, 20, 20);
            this.pushSprite('balls', balls);

            vec = this.getOffset(G.P_TWO, x, y);
            var balls = this.ballMgr.createAlongLine(vec, 10, 20, 20);
            this.pushSprite('balls', balls);
        },
        
        getOffset: function(player, offX, offY) {
            var y = this.height / offY,
                x = this.width / offX;

            if (player === G.P_TWO) {
                x = this.width - x;
            }
            return new G.Vector2D(x, y);
        },

        pushSprite: function(ns, sprites) {
            if (sprites.length) {
                this.sprites[ns] = this.sprites[ns].concat(sprites);        
            } else {
                this.sprites[ns].push(sprites);        
            }
        },

        setup: function() {
            this.addInitialBalls();
        },

        interact: function() {
            if (this.ballMgr.hit) {
                this.ballMgr.hit.loc.set(G.mousePos.get());
            }
        },

        render: function() {
            var ctx = this.ctx;
            this.background(ctx);
            this.renderCenterline(ctx);

            for (set in this.sprites) {
                this.sprites[set].each(function(sprite) {
                    sprite.render(ctx);
                });
            }

            this.ballMgr.collide(this.sprites.balls);
        },

        background: function(ctx) {
            ctx.fillStyle = '#eeeeee';
            ctx.fillRect(0, 0, this.width, this.height)
            ctx.fill();
        },

        renderCenterline: function(ctx) {
            var stroke = this.options.lineColor;
            var x = this.width/2;
            var height = this.height;

            ctx.strokeStyle = stroke;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x,height);
            ctx.stroke();
        },

    });

    var Game = new Class({
        Implements: [Options, Events],

        options: {
            server: 'localhost',
            framerate: 60,
            id: null,
        },

        world: null,
        socket: null, 
        paused: true,

        initialize: function(board, opts) {
            this.setOptions(opts);
            this.board = board;
            this.socket = this.initSocket();
        },

        initSocket: function() {
            var socket = new io.Socket(this.options.server);
            socket.connect();
            socket.on('connect', this.connect.bind(this));
            socket.on('message', this.message.bind(this));
            socket.on('disconnect', this.disconnect.bind(this));
            return socket;
        },

        send: function(type, val) {
            var msg = {type:type, val:val};
            this.socket.send(msg);
        },

        start: function(id) {
            this.send('start', {id: id});
        },

        run: function() {
            this.paused = false;
            var interval = ONE_SECOND / this.options.framerate;
            this.loop = this.update.periodical(interval, this);
        },

        update: function() {
            if (this.paused) return;

            this.board.interact();
            this.board.render();
        },

        connect: function() {
            console.log('connect');
        },

        message: function(msg) {
            console.log('msg');
            this.msgHandlers[msg.type].call(this, msg.val);
        },

        disconnect: function() {
            console.log('disconnnect');
        },

        msgHandlers: {
            id: function(payload) {
                console.log('payload is', payload);
                this.id = payload.id;
                this.fireEvent('game.id', payload.id);
            },

            ready: function(payload) {
                this.board.setup();
            }
        },

    });

    var init = function() {
        var board = new Board('gameboard');
        var game = new Game(board);
        game.run();

        game.addEvent('game.id', function(id) {
            $('invite').set('html', "Send this link to another player: " + window.location + "?game=" +  id);
            $('invite').set('href',  window.location + "?game=" +  id);
            $('status').set('html', "waiting for player to join");
        })

        var gameId = G.Util.qString(window.location.search).game;
        if (gameId) gameId = parseInt(gameId, 10);

        $('start-game').addEvent('click', function(e) {
            e.preventDefault();
            game.start(gameId);
        });
    }

    window.addEvent('domready', init);
 
 })(document.id, this.Scrabball)
