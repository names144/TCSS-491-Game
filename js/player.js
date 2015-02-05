/*
* Handles the Player.
*/

var PLAYER_SPEED = 150;			// Player movement speed
var JUMP_SPEED = 270;			// Player jump speed

var jumpTimer = 0;				// The timer for jumping
var cursors;					// Used for holding the keyboard input and actions
var jumpButton;					// Jump button
var isJumping = false;			// If the player is currently jummping
var playerFacingLeft = false;	// Used for flipping the player left/right based on direction
var facing = 'right';			// The direction the player is facing

// Create the player
var createPlayer = function(player, game) {
	// Sets the anchor for the sprite. Easier to handle axis flips, etc.
    player.anchor.setTo(0.5,0.5);

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
};

// Updates physics based on actions
var updatePlayer = function(player, game) {

	// Idle speed is 0
    player.body.velocity.x = 0;

    // Movement for on a surface
    if (!isJumping) {
	    // Left
	    if (cursors.left.isDown) {
		    player.body.velocity.x = -PLAYER_SPEED;
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
		    player.body.velocity.x = PLAYER_SPEED;

		    // Flipping sprite on horizontal axis
		    if (playerFacingLeft) {
		  		player.scale.x *= -1;
		  		playerFacingLeft = false;
		    }

		    if (facing != 'right') {
		      player.animations.play('right');
		      facing = 'right';
		    }
		// Idle
	    } else {
		    if (facing != 'idle') {
		      player.animations.play('idle');
		      facing = 'idle';
		    }
	    }
    }

    // Jumping
    if (jumpButton.isDown && game.time.now > jumpTimer && player.body.onFloor()) {
	    player.body.velocity.y = -JUMP_SPEED;
	    player.animations.stop();
	    player.animations.frame = 12;
	    isJumping = true;
	    facing = 'none';
    }

    // Movement for jumping
    if (isJumping) {
	    // Left
	    if (cursors.left.isDown) {
		    player.body.velocity.x = -PLAYER_SPEED;
		   	// Flipping sprite on horizontal axis
		    if (!playerFacingLeft) {
		  		player.scale.x *= -1;
		  		playerFacingLeft = true;
		    }
	    // Right
	    } else if (cursors.right.isDown) {
		    player.body.velocity.x = PLAYER_SPEED;

		    // Flipping sprite on horizontal axis
		    if (playerFacingLeft) {
		  		player.scale.x *= -1;
		  		playerFacingLeft = false;
		    }
	    }
    }

    // Jump animation frame for jump up
    if (player.body.velocity.y > 0) {
    	player.animations.frame = 14;
    }

    // jump animation change for end of jump
    if (isJumping && player.body.velocity.y === 0) {
    	player.animations.stop();
    	isJumping = false;
    }
};