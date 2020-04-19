class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, pointvalue, frame) {
        super(scene, x, y, texture, frame);

        //push me to scene
        scene.add.existing(this);
        //how much am i worth to you!
        this.points = pointvalue
        //am i exploding!
        this.exploding = false;
        this.path = [];
        this.initY = y;
        this.initX = x;
        if (game.settings.hardMode) {
            this.moveDirection = ["right-left","left-right"][Math.floor(Math.random()*2)];
            if (this.moveDirection == "left-right" ) {
                this.setOrigin(0.5,0.5);
                //this.scale = -1;
                
                this.angle = 180;
                //this.rotate = 50;
            }
        }
    }
    update() {
        if (!game.settings.hardMode) {
            //move spaceshit left
            this.x -= game.settings.spaceshipSpeed;
            if (this.x <= 0 - this.width) {
                this.reset(); 
            }
        }
        else if (this.path.length == 0){
            var posx = 0;
            var posy = 0;
            var amplitude = 40;
            var frequency = 20;
            //console.log(game.config.width);
            while (posx < game.config.width) {
                posy = this.initY + amplitude * Math.sin(posx/frequency);
                this.path.push([posx,posy]);
                posx = posx + 1;
            }
        }
        if (this.path.length) {
            var newMoveY = this.path[0][1];
            for (let i = 0; i < game.settings.spaceshipSpeed; i++) {
                var newMove = this.path[0];
                this.path.shift();
                if (this.moveDirection == "right-left") {
                    this.x = game.config.width - newMove[0];
                }
                if (this.moveDirection == "left-right") {
                    this.x = newMove[0];
                }
                this.y = newMoveY;   
            }
        }
        //this.x -= Math.round(Math.random() * 10);
        if (this.x <= 0 - this.width) {
            this.reset(); 
        }
        if (this.x + this.width >= game.config.width) {

        }
    }
    reset() {
        this.path = [];
        this.x = game.config.width;
        this.exploding = false;
    }
}