class GameEngine {
    constructor() {
        this.entities = [];
        this.ctx = null;
        this.button = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
    };

    init(ctx, button) {
        this.ctx = ctx;
        this.button = button;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
    };

    start() {
        var that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    };

    startInput() {
        var getXandY = function (e) {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
            return { x: x, y: y };
        }

        var that = this;

        this.ctx.canvas.addEventListener("click", function (e) {
            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            that.mouse = getXandY(e);
        }, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
    };

    update() {
        var entitiesCount = this.entities.length;

        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    flopingLine() {
        var collapseArr = this.entities;
        var centerXDot = 0;
        var centerYDot = 0;
        var flop;
        var delay = 1000 / 60;
        var pTimestamp = [];


        var canvas = document.getElementById('gameWorld');
        var ctx = canvas.getContext('2d');

        function tick(timestamp) {
            var progress = timestamp - delay;
            pTimestamp.push(timestamp);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            for (var i = 0; i < collapseArr.length; i++) {
                if (collapseArr[i].points != 0) {

                    centerXDot = (Math.round(collapseArr[i].points[0].x) + Math.round(collapseArr[i].points[1].x)) / 2;
                    centerYDot = (Math.round(collapseArr[i].points[0].y) + Math.round(collapseArr[i].points[1].y)) / 2;

                    collapseArr[i].points[0].x = (Math.round(collapseArr[i].points[0].x) + Math.round(collapseArr[i].points[1].x)) / 2;
                    collapseArr[i].points[0].y = (Math.round(collapseArr[i].points[0].y) + Math.round(collapseArr[i].points[1].y)) / 2;
                    collapseArr[i].points[1].x = centerXDot;
                    collapseArr[i].points[1].y = centerYDot;
                }
            };

            if (pTimestamp[0] >= progress) {
                flop = requestAnimationFrame(tick);
            } else {
                cancelAnimationFrame(flop);
            };
        };

        flop = requestAnimationFrame(tick);
    };
    loop() {
        this.update();
        this.draw();
        this.click = null;
    };
};
