class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    init(data){
        this.newHighscore = false;
        if (data.highscore) {
            if (data.highscore > game.settings["highscore"]) {
                game.settings["highscore"] = data.highscore;
                this.newHighscore = true;
            }
        }
    }
    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio("bgmusic","./assets/music/Celebration_in_Slow_Motion.mp3");

    }
    create() {
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // menu display
        var menuConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        var centerX = game.config.width/2;
        var centerY = game.config.height/2;
        var textSpacer = 64;
        this.add.text(centerX, centerY - textSpacer*3, "ROCKET PATROL", menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - textSpacer*2, "Use (mouse) to move", menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - textSpacer, "Use (left click) to Fire", menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = "#00ff00";
        menuConfig.color = "#000"
        this.add.text(centerX, centerY, "Press ← for Easy or → for Hard", menuConfig).setOrigin(0.5);

        this.add.text(centerX, centerY + textSpacer, "HIGHSCORE", menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = "#00ff00";
        menuConfig.color = "#000"
        this.add.text(centerX, centerY + textSpacer*2, "===>"+game.settings["highscore"]+"<===", menuConfig).setOrigin(0.5);
        if (this.newHighscore) {
            this.add.text(centerX, centerY + textSpacer*3, "!!NEW HIGHSCORE!!", menuConfig).setOrigin(0.5);
        }
      }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings["spaceshipSpeed"] = 3;
          game.settings["gameTimer"] = 60000;
          this.sound.play('sfx_select');
          this.scene.start("playScene",{highscore: game.settings["highscore"]});    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings["spaceshipSpeed"] = 4;
          game.settings["gameTimer"] = 4000;
          this.sound.play('sfx_select');
          this.scene.start("playScene",{highscore: game.settings["highscore"]});    
        }
      }
}