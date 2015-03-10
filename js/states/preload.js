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

    // Load the clouds for parallax scrolling on level 3
    this.game.load.image('nightClouds', 'images/night.jpg');

    // Load the castle background for level 2
    this.game.load.image('castle_inside', 'images/castle_inside.jpg');

    // OK button
    this.game.load.image('play', 'images/playBtn.png');

    // NO button
    this.game.load.image('noBtn', 'images/noBtn.png');

    // Play button
    this.game.load.image('okBtn', 'images/okBtn.png');

    // Title Screen
    this.game.load.image('titleScreen', 'images/titleScreen.png');

    // Load the spritesheet for our player, indicating the location, size of sprites, and the number of images on the sheet
    this.game.load.spritesheet('player', 'images/player.png', 32, 32, 4);

    this.game.load.spritesheet('princess', 'images/princess.png', 22, 40, 1);

    // Load the sword
    this.game.load.spritesheet('sword', 'images/sword.png', 32, 32, 3);

    // Load the dude
    this.game.load.spritesheet('dude', 'images/dude.png', 32, 32, 1);

    // Load smoke
    this.game.load.spritesheet('smoke', 'images/smoke.png', 51, 41, 5);

    // Load the rat
    this.game.load.spritesheet('rat', 'images/rat.png', 32, 32, 3);

    // Load the dialog image
    this.game.load.image('dialog', 'images/dialog.png');

    // Load the bullet sprite sheet
    this.game.load.spritesheet('bullet', 'images/bullet_1.png', 32, 32, 4);

    // Load the bullet sprite sheet
    this.game.load.spritesheet('bullet2', 'images/bullet_2.png', 32, 32, 2);

    // Load the archer
    this.game.load.spritesheet('archer', 'images/archer.png', 48, 48, 4);

    // Load the boss
    this.game.load.spritesheet('boss', 'images/boss.png', 84, 84, 22);

    // Load the arrow
    this.game.load.spritesheet('arrow', 'images/arrow.png', 32, 16, 2);

    // Load the bomb
    this.game.load.spritesheet('bomb', 'images/missile.png', 17, 43, 1);

    // Load the rocket
    this.game.load.spritesheet('rocket', 'images/rockets.png', 46, 32, 4);

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

    // Load spritesheet for mini boss 2
    this.game.load.spritesheet('miniBoss2', 'images/miniboss2.png', 67, 58, 14);

    // Load the spritesheet for the items
    this.game.load.spritesheet('items', 'images/items.png', 32, 32, 64);

    // Loads the tilemap data from the JSON exported from tiled.
    this.game.load.tilemap('tilemap1', 'json/map1.json', null, Phaser.Tilemap.TILED_JSON);

    //
    this.game.load.tilemap('tilemap2', 'json/map2.json', null, Phaser.Tilemap.TILED_JSON);

    // Loads the tilemap data from the JSON exported from tiled.
    this.game.load.tilemap('tilemap3', 'json/map3.json', null, Phaser.Tilemap.TILED_JSON);
    
    // Loads the chest
    this.game.load.spritesheet('chest', 'images/chest.png', 27, 26, 1);

    // Loads the actual tiles for the tilemap
    this.game.load.image('map1', 'images/map1.png');

    //
    this.game.load.image('Castle2', 'images/castle_1_1.png');

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
    this.game.load.audio('bones', ['sounds/bones.mp3']);
    this.game.load.audio('arrowFire', ['sounds/arrowfire.mp3']);
    this.game.load.audio('level3Music', ['sounds/level3.mp3']);
    this.game.load.audio('rocketSound', ['sounds/rocket.mp3']);
    this.game.load.audio('explode', ['sounds/explode.mp3']);
    this.game.load.audio('level2Music', ['sounds/level2.mp3']);
    this.game.load.audio('bombSound', ['sounds/bomb.mp3']);
  },

  create: function() {
    this.game.state.start('Title');
  }
};