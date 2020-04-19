var config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu,Play],
};
var game = new Phaser.Game(config)

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000    
}

var keyF,keyLEFT,keyRIGHT,keySPACE;