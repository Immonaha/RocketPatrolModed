class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        this.load.image("rocket","./assets/rocket.png");
        this.load.image("rocket","./assets/lance.png");
        this.load.image("spaceship","./assets/spaceship.png");
        this.load.image("starfield","./assets/starfield.png");
        this.load.spritesheet("explosion", "./assets/explosion.png", {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480,"starfield").setOrigin(0,0);
        //white rec border
        this.add.rectangle(5,5,630,32,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,443,630,32,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,5,32,455,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603,5,32,455,0xFFFFFF).setOrigin(0,0);
        //green ui background
        this.add.rectangle(37,42,566,64,0x00FF00).setOrigin(0,0);

        //add player 1 weapon 1
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, "rocket",0).setScale(0.5,0.5).setOrigin(0,0);
        this.p1Lance = new Lance(this, game.config.width/2, 431, "lance",0).setScale(0.5,0.5).setOrigin(0,0);
       
        //add weapons to weaponlist
        this.weapons = [this.p1Rocket,this.p1Lance];
        this.selectedWeaponIndex = this.weapons.length-1;
        this.swapWeapon();

        //add ship#1
        this.ship01 = new Spaceship(this, game.config.width+192, 132, "spaceship",30,0).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width+96, 196, "spaceship",20,0).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, "spaceship",10,0).setOrigin(0,0);


        //define keyboard
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        //define mouse
        game.input.mouse.capture = true;
        //add fire ondown listener
        this.input.on('pointerdown', () => this.p1Rocket.fire());
        this.input.on('pointerdown', () => this.p1Lance.fire());

        //explosion anim
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // score
        this.p1Score = 0;

        // score display
        var scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        
        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "(F)ire to Restartor ← for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        //console.log('X:' + this.input.mousePointer.x);

        //console.log('Y:' + this.input.activePointer.y);

        //scroll starfield
        this.starfield.tilePositionX -= 4;
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.swapWeapon();
        }
        //gameover -> restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }

        //gameover -> menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        
        if (!this.gameOver) {               
            this.p1Rocket.update();
            this.p1Lance.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
} 


        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
    }
    checkCollision(rocket, ship) {
        // did we smack the ship?
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        }
        else {
            return false;
        }
    }
    shipExplode(ship) {
        ship.alpha = 0; // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode"); // play explode animation
        boom.on("animationcomplete", () => { // callback after animation completes
            ship.reset(); // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;  
        // play explosion sound
        this.sound.play("sfx_explosion");    
    }
    swapWeapon() {
        if (!this.weapons[this.selectedWeaponIndex].isFiring) {
            console.log("swapping weapons");
            this.weapons.forEach(function(el){
                el.visible = false;
            });
            if (this.selectedWeaponIndex == this.weapons.length-1) {
                this.selectedWeaponIndex = 0;
            }
            else {
                this.selectedWeaponIndex += 1;
            }
            this.weapons[this.selectedWeaponIndex].visible = true;
            console.log(this.weapons[this.selectedWeaponIndex].constructor.name);
        }
    }
}