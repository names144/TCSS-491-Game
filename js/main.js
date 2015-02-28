window.onload = function() {

	var GRAVITY = 300;

	// Creates a new Phaser game on the canvas named test. The {} parameter holds all the functions for the game
  var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'gameWindow', { preload: preload, create: create, update: update, render: render });

  /*
  *	The preload function will run before all code. This is where loading assets should occur
  */
  function preload () {
    // Load the clouds for parallax scrolling on level 1
    game.load.image('clouds', 'images/clouds.png');

  	// Load the spritesheet for our player, indicating the location, size of sprites, and the number of images on the sheet
	  game.load.spritesheet('player', 'images/bmario.png', 32, 32, 20);

    // Load the bullet sprite sheet
    game.load.spritesheet('bullet', 'images/bullet_1.png', 32, 32, 4);

    // Load the apple
    game.load.spritesheet('apple', 'images/apple.png', 26, 26, 1);

		// Load the spritesheet for the ground bunnies
		game.load.spritesheet('evilGroundBunny', 'images/evil_bunny_transparent.png', 32, 32, 6);

    // Load the old man spritesheet
    game.load.spritesheet('oldMan', 'images/oldMan.png', 24, 43, 3);

    // Load spritesheet for mini boss
    game.load.spritesheet('miniBoss1', 'images/knight.png', 64, 64, 16);

    // Load the spritesheet for the items
    game.load.spritesheet('items', 'images/items.png', 32, 32, 64);

		// Loads the tilemap data from the JSON exported from tiled.
		game.load.tilemap('tilemap', 'json/map1.json', null, Phaser.Tilemap.TILED_JSON);
		
		// Loads the actual tiles for the tilemap
		game.load.image('map1', 'images/map1.png');

    // Load the healthbar
    game.load.image('healthBar', 'images/healthbar.png');
    game.load.image('healthBarBoss', 'images/healthbarBoss.png');

    // The bg music
    game.load.audio('bgMusic', ['sounds/hub_city_1.mp3']);

    game.load.audio('shoot', ['sounds/bullet.mp3']);
    game.load.audio('hit', ['sounds/punch1.mp3']);
    game.load.audio('shoot', ['sounds/bullet.mp3']);
    game.load.audio('swordSound', ['sounds/swoosh.mp3']);
    game.load.audio('squish', ['sounds/squish.mp3']);
    game.load.audio('jump', ['sounds/jump.mp3']);
    game.load.audio('minibossDead', ['sounds/minibossDead.mp3']);
    game.load.audio('win', ['sounds/win.mp3']);
    game.load.audio('dead', ['sounds/end.mp3']);
  }

  var gameEnd = false;

  var showBossHealth = false;

  var player;		// The Player of the game
  var sword;

  var oldMan;

  var healthBar, miniBoss1Health;
  var healthText, healthTextBoss;

  // Ground bunnies
	var groundBunnies = [];
	var groundBunnyLocations = [];

  // Mini boss
  var miniBoss1;

  // items
  var items = [];

	var map;		// The game world map
	var bg;			// The background image of the game
	var layer;		// The layer that holds the tilemap

  var instructions;
  var bgMusic, winMusic, deadMusic;

	 /*
    *	The create function will set-up our game world. Define players, animations, physics, etc. here
    */
	function create() {
    
		// Start the physics engine for the game
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Sets the gravity for the physics engine.
		game.physics.arcade.gravity.y = GRAVITY;

    // Color the background
    var x = 0;
    var y = 0;
    for (var i = 0; i < 11; i++) {
      game.add.tileSprite(x, y, 600, 800, 'clouds').autoScroll(-5, 0);
      x += 600;
    }
    


    // Add the tilemap created with tiled to the map
    map = game.add.tilemap('tilemap');

	    // Adds the actual tilesheet to the map so the game can render it
 		map.addTilesetImage('map1');

		// Set which tiles to collide on. Number in array corresponds to the tile on the sheet
		map.setCollisionByExclusion([30,31,38,39,46,47,56,57,64,65,72,73,82]);

		// This is the layer from tiled. It needs to be the same name as the JSON from tiled
		layer = map.createLayer('Tile Layer 1');

		// Resizes the world for the layer
		layer.resizeWorld();

		// Create the player and position in the world with given name 48
    player = game.add.sprite(48, 752, 'player');

    player.attributes = new Player();

    // Prepare the bunny locations
    
    groundBunnyLocations[0] = {x: 515, y: 656};
    groundBunnyLocations[1] = {x: 987, y: 624};
    groundBunnyLocations[2] = {x: 1432, y: 464};
    groundBunnyLocations[3] = {x: 1772, y: 368};
    groundBunnyLocations[4] = {x: 2482, y: 656};
    groundBunnyLocations[5] = {x: 3338, y: 656};
    groundBunnyLocations[6] = {x: 3900, y: 752};
    groundBunnyLocations[7] = {x: 4500, y: 752};
    groundBunnyLocations[8] = {x: 3960, y: 560};
    groundBunnyLocations[9] = {x: 5000, y: 752};

    // Create the ground bunnies and position them
    for (var i = 0; i < 10; i++) {
    	groundBunnies[i] = game.add.sprite(groundBunnyLocations[i].x, groundBunnyLocations[i].y, 'evilGroundBunny');
    	game.physics.enable(groundBunnies[i], Phaser.Physics.ARCADE);
    	groundBunnies[i].attributes = new EvilGroundBunny();
    	groundBunnies[i].attributes.create(groundBunnies[i], game);
    }
    
    // Mini boss
    miniBoss1 = game.add.sprite(6200, 720, 'miniBoss1');

    miniBoss1.attributes = new MiniBoss();

    game.physics.enable(miniBoss1, Phaser.Physics.ARCADE);

    miniBoss1.attributes.create(miniBoss1, game);

    // Enable physics on the player and sword
  	game.physics.enable(player, Phaser.Physics.ARCADE);

  	// Creates the player
    player.attributes.create(player, game);

    // Set the camera to follow the player
    game.camera.follow(player);

    // Set up npcs
    oldMan = game.add.sprite(88, 712, 'oldMan');

    game.physics.enable(oldMan, Phaser.Physics.ARCADE);
    oldMan.attributes = new OldMan();
    oldMan.attributes.create(oldMan, game);

    // Items
    game.items = items;
    
    // Instructions to play
    var text = "Move: Arrow Keys  |  Jump: Space  |  Attack: C  |  Shoot: X";
    var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
    instructions = game.add.text(30, 375, text, style);
    instructions.fixedToCamera = true;
    
    // Music
    bgMusic = game.add.audio('bgMusic', 1, true);
    winMusic = game.add.audio('win', 1, false);
    deadMusic = game.add.audio('dead', 1, false);
    bgMusic.play();


    // The healthbar fixed to the camera
    healthBar = game.add.sprite(390, 32, 'healthBar');
    healthBar.fixedToCamera = true;
    healthBar.cropEnabled = true;
    healthBar.cropRect = new Phaser.Rectangle(0, 0, healthBar.width, healthBar.height);
    healthBar.startWidth = healthBar.width + 0;
    healthText = game.add.text(300, 36, "HEALTH: ", { font: "20px Arial", fill: "#f26c4f", align: "center" });
    healthText.fixedToCamera = true;

    // The mini boss health
    miniBoss1Health = game.add.sprite(78, 32, 'healthBarBoss');
    miniBoss1Health.fixedToCamera = true;
    miniBoss1Health.cropEnabled = true;
    miniBoss1Health.cropRect = new Phaser.Rectangle(0, 0, miniBoss1Health.width, miniBoss1Health.height);
    miniBoss1Health.startWidth = miniBoss1Health.width + 0;
    miniBoss1Health.visible = false;
	}


  function checkForWin() {
    if (player.attributes.won) {
      // we won
      var text = "You Got The Key! You Win!";
      var style = { font: "40px Arial", fill: "#ff0044", align: "center" };
      gameEnd = true;
      player.body = null;
      var t = game.add.text(game.camera.x + 50, game.camera.y + 150, text, style);
      bgMusic.stop();
      winMusic.play();
    }
  };

  function checkForDead() {
    if (!player.attributes.alive) {
      bgMusic.stop();
      deadMusic.play();
      gameEnd = true;
      player.body = null;
      var text = "GAME OVER";
      var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
      var t = game.add.text(game.camera.x + 100, game.camera.y + 150, text, style);
    }
  }

  function oldManQuest() {
    var style = { font: "14px Arial", fill: "#000", align: "center" };

    var t = game.add.text(game.camera.x + 50, game.camera.y + 150, oldMan.attributes.QUEST_LINE, style);
  };

  function updateMiniBoss1Health() {
    var w = (miniBoss1.attributes.health / miniBoss1.attributes.MAX_HEALTH) * miniBoss1Health.startWidth;
    if (miniBoss1.attributes.wasAttacked) {
      miniBoss1Health.crop(new Phaser.Rectangle(0, 0, w, miniBoss1Health.height));
      miniBoss1Health.updateCrop();
      miniBoss1.attributes.wasAttacked = false;    
    }
  };

	/*
  *	The update function will run during our game. This is where we check for actions and update based on what is going on in the game
  */
	function update() {

    // Tell the physics engine to collide between the player and our layer for the world
    game.physics.arcade.collide(player, layer);

    game.physics.arcade.collide(oldMan, layer);

    // Collision with items
    for (var i = 0; i < items.length; i++) {
      game.physics.arcade.collide(items[i], layer);
      game.physics.arcade.collide(player, items[i], items[i].attributes.collide);
    }

    // Tell the physics engine to collide between the miniboss and our layer for the world
    game.physics.arcade.collide(miniBoss1, layer);

    // Collision with the players and the bunnies
    game.physics.arcade.collide(player, groundBunnies, player.attributes.collide);

    // Collision with the players and mini boss
    game.physics.arcade.collide(player, miniBoss1, player.attributes.collide);

    // Collision player and old man
    game.physics.arcade.collide(oldMan, player, oldManQuest);

    // Set the collision for the bunnies and the world
    game.physics.arcade.collide(groundBunnies, layer);

    // Updates for the player
    if (player.attributes.alive && !player.attributes.won) {
      player.attributes.update(player, game);
    }
    

    // Update healthbar
    var w = (player.attributes.health / player.attributes.MAX_HEALTH) * healthBar.startWidth;
    if (player.attributes.wasAttacked || player.attributes.gainedHealth) {
      healthBar.crop(new Phaser.Rectangle(0, 0, w, healthBar.height));
      healthBar.updateCrop();
      if (player.attributes.wasAttacked) {
        player.attributes.wasAttacked = false;
      } else {
        player.attributes.gainedHealth = false;
      }        
    }

    // Update mini boss 1 healthbar
    if (player.body.x >= 4752) {
      healthTextBoss = game.add.text(10, 36, "BOSS: ", { font: "20px Arial", fill: "#003FB9", align: "center" });
      healthTextBoss.fixedToCamera = true;
      showBossHealth = true;
      miniBoss1Health.visible = true;
    }

    if (showBossHealth) {
      updateMiniBoss1Health();
    }
    
    

    // Updates for the bullets from player
    for (var i = 0; i < player.attributes.bullets.length; i++) {
      if (player.attributes.bullets[i].attributes !== null) {
        player.attributes.bullets[i].attributes.update(player.attributes.bullets[i], game);

        // Collision bullets with map layer
        game.physics.arcade.collide(player.attributes.bullets[i], layer, player.attributes.bullets[i].attributes.collide);

        // Collision bullets with bunnies
        game.physics.arcade.collide(player.attributes.bullets[i], groundBunnies, player.attributes.bullets[i].attributes.collide);

        // Collision bullets with mini boss
        game.physics.arcade.collide(player.attributes.bullets[i], miniBoss1, player.attributes.bullets[i].attributes.collide);
      }
    }

    // Updates for the ground bunnies
    for (var i = 0; i < 10; i++) {
      groundBunnies[i].attributes.update(groundBunnies[i], game, player);
    }

    // Update for the mini boss
    miniBoss1.attributes.update(miniBoss1, game, player);

    if (!gameEnd) {
      // Check if won the game
      checkForWin();

      // Check if dead
      checkForDead();
    }
	}

	/*
  *	The rendr function will show us the debug information at the top
  */
	function render() {
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 300);

	}
};