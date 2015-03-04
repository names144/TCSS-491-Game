/*
* Preloads all assets for the game.
*/
var Preload = function(game) {
  console.log('Loading all assets...');
};

Preload.prototype = {

  preload: function() {
    // Display the loading indication
    var loadBar = this.add.sprite(225,120, 'loading');
    var text = 'Loading . . .';
    var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
    this.game.add.text(245, 280, text, style);
    // Load all assets
    // Load the clouds for parallax scrolling on level 1
    this.game.load.image('clouds', 'images/clouds.png');

    // Play button
    this.game.load.image('play', 'images/playBtn.png');

    // Title Screen
    this.game.load.image('titleScreen', 'images/titleScreen.png');

    // Load the spritesheet for our player, indicating the location, size of sprites, and the number of images on the sheet
    this.game.load.spritesheet('player', 'images/bmario.png', 32, 32, 20);

    // Load the sword
    this.game.load.spritesheet('sword', 'images/sword.png', 32, 32, 3);

    // Load the bullet sprite sheet
    this.game.load.spritesheet('bullet', 'images/bullet_1.png', 32, 32, 4);

    // Load the bat sprite
    this.game.load.spritesheet('bat', 'images/bat.png', 32, 32, 24);

    // Load the apple
    this.game.load.spritesheet('apple', 'images/apple.png', 26, 26, 1);

    // Load the spritesheet for the ground bunnies
    this.game.load.spritesheet('evilGroundBunny', 'images/evil_bunny_transparent.png', 32, 32, 6);

    // Load the old man spritesheet
    this.game.load.spritesheet('oldMan', 'images/oldMan.png', 24, 43, 3);

    // Load spritesheet for mini boss
    this.game.load.spritesheet('miniBoss1', 'images/knight.png', 64, 64, 16);

    // Load the spritesheet for the items
    this.game.load.spritesheet('items', 'images/items.png', 32, 32, 64);

    // Loads the tilemap data from the JSON exported from tiled.
    this.game.load.tilemap('tilemap', 'json/map1.json', null, Phaser.Tilemap.TILED_JSON);
    
    // Loads the actual tiles for the tilemap
    this.game.load.image('map1', 'images/map1.png');

    // Load the healthbar
    this.game.load.image('healthBar', 'images/healthbar.png');
    this.game.load.image('healthBarBoss', 'images/healthbarBoss.png');

    // The bg music
    this.game.load.audio('bgMusic', ['sounds/hub_city_1.mp3']);
    this.game.load.audio('titleMusic', ['sounds/title.mp3']);
    this.game.load.audio('shoot', ['sounds/bullet.mp3']);
    this.game.load.audio('hit', ['sounds/punch1.mp3']);
    this.game.load.audio('shoot', ['sounds/bullet.mp3']);
    this.game.load.audio('swordSound', ['sounds/swoosh.mp3']);
    this.game.load.audio('squish', ['sounds/squish.mp3']);
    this.game.load.audio('jump', ['sounds/jump.mp3']);
    this.game.load.audio('minibossDead', ['sounds/minibossDead.mp3']);
    this.game.load.audio('win', ['sounds/win.mp3']);
    this.game.load.audio('dead', ['sounds/end.mp3']);
  },

  create: function() {
    this.game.state.start('Title');
  }
};