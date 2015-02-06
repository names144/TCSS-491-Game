window.onload = function() {

	var GRAVITY = 200;

	// Creates a new Phaser game on the canvas named test. The {} parameter holds all the functions for the game
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Game Name Here', { preload: preload, create: create, update: update, render: render });

    /*
    *	The preload function will run before all code. This is where loading assets should occur
    */
    function preload () {
    	// Load the spritesheet for our player, indicating the location, size of sprites, and the number of images on the sheet
		game.load.spritesheet('player', 'images/bmario.png', 32, 32, 18);

		// Load the spritesheet for the ground bunnies
		game.load.spritesheet('evilGroundBunny', 'images/evil_bunny_transparent.png', 32, 32, 6);

		// Loads the tilemap data from the JSON exported from tiled.
		game.load.tilemap('tilemap', 'json/prototype-map.json', null, Phaser.Tilemap.TILED_JSON);
		
		// Loads the actual tiles for the tilemap
		game.load.image('grass', 'images/grass_1_2.png');

		// Loads the background image
		game.load.image('background', 'images/sand.jpg');
    }

    var player;		// The Player of the game

    // Ground bunnies
	var groundBunnies = [];
	var groundBunnyLocations = [];

	var map;		// The game world map
	var bg;			// The background image of the game
	var layer;		// The layer that holds the tilemap

	/*
    *	The create function will set-up our game world. Define players, animations, physics, etc. here
    */
	function create() {

		// Start the physics engine for the game
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Sets the gravity for the physics engine.
		game.physics.arcade.gravity.y = GRAVITY;

		// The background image as a tileSprite
	    //bg = game.add.tileSprite(0, 0, 1920, 1920, 'background');
	    //bg.fixedToCamera = true;

	    // Color the background
	    game.stage.backgroundColor = '#83E8F7';

	    // Add the tilemap created with tiled to the map
	    map = game.add.tilemap('tilemap');

	    // Adds the actual tilesheet to the map so the game can render it
 		map.addTilesetImage('grass');

 		// Set which tiles to collide on. Number in array corresponds to the tile on the sheet
  		map.setCollisionByExclusion([]);

  		// This is the layer from tiled. It needs to be the same name as the JSON from tiled
  		layer = map.createLayer('Tile Layer 1');

  		// Resizes the world for the layer
  		layer.resizeWorld();

  		// Create the player and position in the world with given name
	    player = game.add.sprite(64, 64, 'player');

	    player.attributes = new Player();

	    // Prepare the bunny locations
	    groundBunnyLocations[0] = {x: 700, y: 336};
	    groundBunnyLocations[1] = {x: 1200, y: 592};
	    groundBunnyLocations[2] = {x: 829, y: 848};
	    groundBunnyLocations[3] = {x: 369, y: 976};
	    groundBunnyLocations[4] = {x: 1130, y: 1168};
	    groundBunnyLocations[5] = {x: 1800, y: 1392};
	    groundBunnyLocations[6] = {x: 2546, y: 1616};
	    groundBunnyLocations[7] = {x: 2500, y: 1936};
	    groundBunnyLocations[8] = {x: 1720, y: 2128};
	    groundBunnyLocations[9] = {x: 1060, y: 2640};

	    // Create the ground bunnies and position them
	    for (var i = 0; i < 10; i++) {
	    	groundBunnies[i] = game.add.sprite(groundBunnyLocations[i].x, groundBunnyLocations[i].y, 'evilGroundBunny');
	    	game.physics.enable(groundBunnies[i], Phaser.Physics.ARCADE);
	    	groundBunnies[i].attributes = new EvilGroundBunny();
	    	groundBunnies[i].attributes.create(groundBunnies[i], game);
	    }

	    // Enable physics on the player
    	game.physics.enable(player, Phaser.Physics.ARCADE);

    	// Creates the player
	    player.attributes.create(player, game);
	    
	    // Set the camera to follow the player
	    game.camera.follow(player);

	}

	/*
    *	The update function will run during our game. This is where we check for actions and update based on what is going on in the game
    */
	function update() {

		// Tell the physics engine to collide between the player and our layer for the world
	    game.physics.arcade.collide(player, layer);

	    // Collision with the players and the bunnies
	    game.physics.arcade.collide(player, groundBunnies, player.attributes.collide);

	    // Set the collision for the bunnies and the world
	    game.physics.arcade.collide(groundBunnies, layer);

	    // Updates for the player
	    player.attributes.update(player, game);

	    // Updates for the ground bunnies
	    for (var i = 0; i < 10; i++) {
	    	groundBunnies[i].attributes.update(groundBunnies[i], game);
	    }
	}

	/*
    *	The rendr function will show us the debug information at the top
    */
	function render() {

	    game.debug.cameraInfo(game.camera, 32, 32);
	    game.debug.spriteCoords(player, 32, 500);

	}
};