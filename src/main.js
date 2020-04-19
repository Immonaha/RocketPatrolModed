//IAN MONAHAN
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
    gameTimer: 60000,
    highscore: 0,
    hardMode: false,
}

var keyF,keyLEFT,keyRIGHT,keySPACE,keyESC;

// Implement mouse control for player movement and mouse click to fire (25): DONE
// Create a new title screen (15): DONE
// Display the time remaining (in seconds) on the screen (15): DONE!
// Randomize each spaceship's movement direction at the start of each play (10) DONE!
// Create and implement a new weapon (w/ new behavior and graphics) (25): Done!
// Track a high score that persists across scenes and display it in the UI (10): DONE
// Create your own mod and justify its score (??): (added a bunch of stuff. maybe 50 points worth? ;D)