class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    init(data){
        this.highscore = data.highscore;
    }
    preload() {
        this.load.image("rocket","./assets/rocket.png");
        this.load.image("lance","./assets/lance.png");
        this.load.image("spaceship","./assets/spaceship.png");
        this.load.image("starfield","./assets/starfield.png");
        this.load.image("starfieldFront","./assets/starfieldFront.png");
        this.load.spritesheet("explosion", "./assets/explosion.png", {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet("lanceAmmo", "./assets/lanceAmmo.png", {frameWidth: 96, frameHeight: 32});

    }
    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480,"starfield").setOrigin(0,0);
        this.starfieldFront = this.add.tileSprite(0,0,640,480,"starfieldFront").setOrigin(0,0);
        //white rec border
        this.add.rectangle(5,5,630,32,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,443,630,32,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,5,32,455,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603,5,32,455,0xFFFFFF).setOrigin(0,0);
        //green ui background
        this.add.rectangle(37,42,566,64,0x00FF00).setOrigin(0,0);

        //music!
        this.music = this.sound.add("bgmusic");
        this.musicConfig = {
            mute: false,
            volume: 1,
            seek: 0,
            loop: true,
        };
        this.music.play(this.musicConfig);

        //lance uses
        this.lanceAmmo = 6;
        this.lanceAmmoSprite = this.add.sprite(152,74,"lanceAmmo").setOrigin(0,0);
        //this.lanceAmmoSprite2 = this.add.sprite(152,90,"lanceAmmo").setOrigin(0,0);
        var lanceArmedTextConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.lanceArmedText = this.add.text(145,42, "ARMED", lanceArmedTextConfig).setOrigin(0,0);
        this.lanceArmedText.visible = false;

        //add player 1 weapon 1
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, "rocket",0).setScale(0.5,0.5).setOrigin(0,0);
        this.p1Lance = new Lance(this, game.config.width/2, 431, "lance",0).setScale(0.5,0.5).setOrigin(0,0);
       
        //add weapons to weaponlist
        this.weapons = [this.p1Rocket,this.p1Lance];
        this.selectedWeaponIndex = this.weapons.length-1;
        this.swapWeapon();

        //add ships
        this.ship01 = new Spaceship(this, game.config.width+192, 132, "spaceship",game.settings.pointScale[2],0).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width+96, 196, "spaceship",game.settings.pointScale[1],0).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, "spaceship",game.settings.pointScale[0],0).setOrigin(0,0);

        //add ships to list for faster collision
        this.ships = [this.ship01,this.ship02,this.ship03]

        //define keyboard
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        //define mouse
        game.input.mouse.capture = true;
        //add fire ondown listener
        this.input.on('pointerdown', () => this.p1Rocket.fire());
        //this.input.on('pointerdown', () => this.p1Lance.fire());
        this.input.on('pointerdown', () => {
            if (this.lanceAmmo > 0) {
                if (!this.p1Lance.isFiring && this.p1Lance.visible) {
                    this.p1Lance.fire();
                    this.lanceAmmo -= 1;
                    this.lanceAmmoSprite.setFrame(6-this.lanceAmmo);
                    if (this.lanceAmmo == 0) {
                        this.lanceArmedText.text = "NO AMMO";
                    }
                }
            }
        });

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
                bottom: 0,
            },
            fixedWidth: 100
        }
        //66 to align with bottom of green bar (71 without bottom padding)
        //score and clock display
        this.scoreLeft = this.add.text(37, 71, this.p1Score, scoreConfig);
        this.timerText = this.add.text((game.config.width/2), 71, "0", scoreConfig).setOrigin(0.5,0);
        scoreConfig.fixedWidth = 120;
        this.scoreHighscore = this.add.text(483, 71, this.highscore, scoreConfig);

        //hud small text
        var hudTextConfig = {
            fontFamily: "Courier",
            fontSize: "20px",
            color: "#000000",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.scoreText = this.add.text(72, 42, "SCORE", hudTextConfig).setOrigin(0.5,0);
        this.highscoreText = this.add.text(545, 42, "HIGHSCORE", hudTextConfig).setOrigin(0.5,0);
        this.timeLeftText = this.add.text((game.config.width/2), 42, "TIME LEFT", hudTextConfig).setOrigin(0.5,0);

        // 60-second play clock
        var gameOverConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 0,
            },
            fixedWidth: 0
        }
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            console.log("GAME OVER");
            this.timerText.text = 0
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", gameOverConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "(ESC) to return to Main Menu", gameOverConfig).setOrigin(0.5);
            this.gameOver = true;
            this.music.stop();
            this.music.seek = 0;
        }, null, this);


        //flags
        this.gameOver = false;
        this.paused = false;
        this.debugmode = false;

        // and show and hid listener
        game.events.addListener(Phaser.Core.Events.FOCUS, this._onFocus, this);
        game.events.addListener(Phaser.Core.Events.BLUR, this._onBlur, this);
        //pause text
        this.pausedText = this.add.text(game.config.width/2, game.config.height/2, "PAUSED", {
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
        }).setOrigin(0.5);
        this.pausedText.visible = false;

        //debug assignments
        if (this.debugmode) {
            this.renderdebug = this.add.graphics();
        }
    }

    update() {
        this.starfield.tilePositionX -= 4;
        this.starfieldFront.tilePositionX += Math.abs(game.input.mousePointer.x - this.weapons[this.selectedWeaponIndex].x)/64;

        //gameover -> menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene",{highscore: this.p1Score});
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.pauseGame(!this.paused);
        }

        //scroll starfield
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.swapWeapon();
        }
        
        if (!this.gameOver && !this.paused) {               
            this.p1Rocket.update();
            this.p1Lance.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.timerText.text = (game.settings.gameTimer/1000) - this.clock.getElapsedSeconds();
        } 

        //collision for p1Rocket
        //using getbounds because flipping the sprite messes up pos
        this.ships.forEach(function(ship) {
            if (this.checkCollision(this.p1Rocket, ship.getBounds())) {
                this.shipExplode(ship);
                this.p1Rocket.reset();
            }
        },this);
        //collision for p1Lance
        //using getbounds because flipping the sprite messes up pos
        this.ships.forEach(function(ship) {
            if (this.checkCollision(this.p1Lance, ship.getBounds())) {
                if (!ship.exploding) {
                    this.shipExplode(ship);
                }
            }
        },this);

        //debugupdates
        if (this.debugmode) {
            this.renderdebug.clear();
            this.ships.forEach(function(ship){
                this.renderdebug.lineStyle(3, 0xfacade);
                this.renderdebug.strokeRectShape(new Phaser.Geom.Rectangle(
                    ship.x,ship.y,ship.width,ship.height));
            },this);
        }
    }
    checkCollision(rocket, ship) {
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
        var shipBounds = ship.getBounds()
        ship.exploding = true;
        ship.alpha = 0; // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(shipBounds.x, shipBounds.y, "explosion").setOrigin(0, 0);
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
            //show and hide lance ammo text
            if (this.weapons[this.selectedWeaponIndex] instanceof Lance) {
                this.lanceArmedText.visible = true;
            }
            else {
                this.lanceArmedText.visible = false;
            }
        }
    }
    pauseGame(mode) {
        //true to pause the game false to unpause
        if (mode && !this.paused) {
            this.paused = true;
            this.time.paused = true;
            this.music.pause();
            this.pausedText.visible = true;
        }
        if (!mode ){
            this.paused = false;
            this.time.paused = false;
            this.music.resume();
            this.pausedText.visible = false;
        }
    }
    _onFocus() {
        if (!this.gameOver){
            //this.pauseGame(false);
            //console.log("you got focus!");
        }
    }
    _onBlur() {
        if (!this.gameOver){
            this.pauseGame(true);
            //console.log("you lost focus!");
        }
    }
}