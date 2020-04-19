class Lance extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //push object to scene
        scene.add.existing(this);

        //rocket sfx
        this.sfxRocket = scene.sound.add('sfx_rocket');

        //is in motion bool
        this.isFiring = false;
    }
    update() {
        //movement
        //this.x = game.input.mousePointer.x;
        if(this.x < 47) {
            this.x = 47;
        }
        else if(this.x > 578) {
            this.x = 578;
        }
        //move the rocket with cursor
        // no isFiring check so you can aim
        if (!this.isFiring){
            if (game.input.mousePointer.x > this.x) {
                this.x +=2;
            }
            if (game.input.mousePointer.x < this.x) {
                this.x -=2;
            }
        }
        //speed of rocket
        if (this.isFiring && this.y >= 108) {
            this.y -= 10;
        }
        //reset on miss
        if (this.y <= 108) {
            this.reset();
        }
    }
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
    fire() {
        if(this.visible) {
            if (!this.isFiring) {
                this.isFiring = true;
                this.sfxRocket.play();
            }
        }
    }
}