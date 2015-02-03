window.onload = function() {

		// Creates a new Phaser game on the canvas named test. The {} parameter holds all the functions for the game
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Test', { preload: preload, create: create, update: update, render: render });

    /*
    *	The preload function will run before all code. This is where loading assets should occur
    */
    function preload () {
    	// Load the spritesheet for our player, indicating the location, size of sprites, and the number of images on the sheet
			game.load.spritesheet('player', 'bmario.png', 32, 32, 18);

			// Loads the tilemap data from the JSON exported from tiled.
			game.load.tilemap('tilemap', 'tilemap.json', null, Phaser.Tilemap.TILED_JSON);
			
			// Loads the actual tiles for the tilemap
			game.load.image('tiles', 'tiles.bmp');

			// Loads the background image
			game.load.image('background', 'sand.jpg');
    }

    var player;												// The Player of the game
		var cursors;											// Used for holding the keyboard input and actions
		var facing = 'right';							// The direction the player is facing
		var map;													// The game world map
		var bg;														// The background image of the game
		var jumpTimer = 0;								// The timer for jumping
		var layer;												// The layer that holds the tilemap
		var jumpButton;										// Jump button
		var playerFacingLeft = false;			// Used for flipping the player left/right based on direction

		/*
    *	The create function will set-up our game world. Define players, animations, physics, etc. here
    */
		function create() {

			// Start the physics engine for the game
			game.physics.startSystem(Phaser.Physics.ARCADE);

			// Sets the gravity for the physics engine.
			game.physics.arcade.gravity.y = 500;

			// The background image as a tileSprite
	    bg = game.add.tileSprite(0, 0, 1920, 1920, 'background');
	    bg.fixedToCamera = true;

	    // Add the tilemap created with tiled to the map
	    map = game.add.tilemap('tilemap');

	    // Adds the actual tilesheet to the map so the game can render it
 			map.addTilesetImage('tiles');

 			// Set which tiles to collide on. Number in array corresponds to the tile on the sheet
  		map.setCollisionByExclusion([41]);

  		// This is the layer from tiled. It needs to be the same name as the JSON from tiled
  		layer = map.createLayer('Tile Layer 1');

  		// Resizes the world for the layer
  		layer.resizeWorld();

  		// Create the player and position in the world with given name
	    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	    
	    // Sets the anchor for the sprite. Easier to handle axis flips, etc.
	    player.anchor.setTo(0.5,0.5);
	    
	    // Enable physics on the player
	    game.physics.enable(player, Phaser.Physics.ARCADE);

	    // Sets the size of the player physics body. 32px x 32px with 0 offsets
  		player.body.setSize(32, 32, 0, 0);

  		// The player should collide with the bounds of the world
	    player.body.collideWorldBounds = true;
	    
	    // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	    player.animations.add('idle', [0,1,2], 0.5, true);
			player.animations.add('left', [3, 4, 5], 20, true);
    	player.animations.add('turn', [1], 20, true);
    	player.animations.add('right', [3, 4, 5], 20, true);
    	player.animations.add('jump', [12, 14], 20, false);

    	// Creates the keys for detecting key input
	    cursors = game.input.keyboard.createCursorKeys();
	    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    
	    // Set the camera to follow the player
	    game.camera.follow(player);
		}

		/*
    *	The update function will run during our game. This is where we check for actions and update based on what is going on in the game
    */
		function update() {

			// Tell the physics engine to collide between the player and our layer for the world
	    game.physics.arcade.collide(player, layer);

	    // Idle speed is 0
	    player.body.velocity.x = 0;

	    // Left
	    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
       	// Flipping sprite on horizontal axis
        if (!playerFacingLeft) {
      		player.scale.x *= -1;
      		playerFacingLeft = true;
        }

        if (facing != 'left') {
          player.animations.play('left');
          facing = 'left';
        }
	    // Right
	    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;

        // Flipping sprite on horizontal axis
        if (playerFacingLeft) {
      		player.scale.x *= -1;
      		playerFacingLeft = false;
        }

        if (facing != 'right') {
          player.animations.play('right');
          facing = 'right';
        }
	    } else {
        if (facing != 'idle') {
          player.animations.play('idle');
          facing = 'idle';
        }
	    }
	    
	    // Jumping
	    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -270;
        jumpTimer = game.time.now + 650;
        player.animations.play('jump');
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