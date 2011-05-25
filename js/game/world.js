this.Scrabball = this.Scrabball || {};

(function($, G) {

    var P_ONE = 1;
    var P_TWO = 2;
    var ONE_SECOND = 1000;
    var TROUGH_OFFSET_H = 10; // % of dim
    var TROUGH_OFFSET_V = 10; // % of dim

    var Board = new Class({
        Implements: [Options],

        sprites: {
            environ: [],
            balls: [],
            troughs: [],
        },

        options: {
            lineColor: '#666666'
        },


        initialize: function(canvas, opts) {
            this.setOptions(opts);
            this.ctx = $(canvas).getContext('2d');
            this.coords = $(canvas).getCoordinates();

            this.setupBoard(this.ctx);
        },

        setupBoard: function(ctx) {
            this.buildTroughs();
            // TODO, whatelse? Score? Submit Btn?
        },

        buildTroughs: function() {
            var vec = this.getTroughLocation(P_ONE);
            var pOneTrough = new G.Trough(vec);
            this.pushSprite('troughs', pOneTrough);

            vec = this.getTroughLocation(P_TWO);
            var pTwoTrough = new G.Trough(vec);
            this.pushSprite('troughs', pTwoTrough);
        },

        getTroughLocation: function(player) {
            var y = this.coords.height / TROUGH_OFFSET_V;
            var x = this.coords.width / TROUGH_OFFSET_H
            if (player === P_TWO) {
                console.log("ptwo");
                x = this.coords.width - x;
            }
            return new G.Vector2D(x, y);
        },

        pushSprite: function(ns, sprite) {
            this.sprites[ns].push(sprite);        
        },

        setup: function() {

        },

        render: function() {
            var ctx = this.ctx;
            this.renderCenterline(ctx);

            for (set in this.sprites) {
                this.sprites[set].each(function(sprite) {
                    sprite.render(ctx);
                });
            }
        },

        renderCenterline: function(ctx) {
            var stroke = this.options.lineColor;
            var x = this.coords.width/2;
            var height = this.coords.height;

            ctx.save();
            ctx.strokeStyle = stroke;
            ctx.moveTo(x, 0);
            ctx.lineTo(x,height);
            ctx.stroke();
            ctx.restore();
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
