class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //push object to scene
        scene.add.existing(this);

        // add rocket sfx
        this.sfxRocket = scene.sound.add('sfx_rocket');

        //bool
        this.isFiring = false;
    }
    update() {
        //movement
        if (!this.isFiring) {
            this.x = game.input.mousePointer.x;
            if(this.x < 47) {
                this.x = 47;
            }
            else if(this.x > 578) {
                this.x = 578;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            if (!this.isFiring) {
                this.sfxRocket.play();
            }
            this.isFiring = true;
        }
        if (this.isFiring && this.y >= 108) {
            this.y -= 2;
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
}