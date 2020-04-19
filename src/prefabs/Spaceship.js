class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, pointvalue, frame) {
        super(scene, x, y, texture, frame);

        //push me to scene
        scene.add.existing(this);
        //how much am i worth to you!
        this.points = pointvalue
        //am i exploding!
        this.exploding = false;
    }
    update() {
        //move spaceshit left
        this.x -= game.settings.spaceshipSpeed;
        if (this.x <= 0 - this.width) {
            this.reset(); 
        }
    }
    reset() {
        this.x = game.config.width;
        this.exploding = false;
    }
}