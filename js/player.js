/*
* Handles the Player.
*/

// Our Player class
function Player() {
	// Player Globals
	this.PLAYER_SPEED = 150;	// Player movement speed
	this.JUMP_SPEED = 270;		// Player jump speed
	this.BOUNCE_SPEED = 150;	// The bounce speed for collision with enemies
	this.MAX_BOUNCE_TIME = 500;// Maximum time to bounce on collision in ms

	this.jumpTimer = 0;			// The timer for jumping
	this.cursors = null;		// Used for holding the keyboard input and actions
	this.jumpButton = null;
	this.isJumping = false;		// If the player is currently jummping
	this.playerFacingLeft = false;	// Used for flipping the player left/right based on direction
	this.facing = 'right';		// The direction the player is facing

	this.bounceLeft = false;	// If the player should bounce to the left on collision
	this.bounceRight = false;	// If the player should bounce to the right on collision
	this.bounceTop = false;		// If the player should bounce up on collision
	this.bounceTime = 0;		// The time to bounce

	this.health = 100;			// Players health
	this.alive = true;			// True if the player is alive

	// Methods of the player
	// Create the player
	// player = Phaser Sprite for the player
	// game = the Phaser game instance
	this.create = function(player, game) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	    player.anchor.setTo(0.5,0.5);

	    // Sets the size of the player physics body. 32px x 32px with 0 offsets
		player.body.setSize(32, 32, 0, 0);

		player.body.drag.set(0.1);

		// The player should collide with the bounds of the world
	    player.body.collideWorldBounds = true;
	    
	    // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	    player.animations.add('idle', [0,1,2], 0.5, true);
		player.animations.add('left', [3, 4, 5], 20, true);
		player.animations.add('turn', [1], 20, true);
		player.animations.add('right', [3, 4, 5], 20, true);
		player.animations.add('jump', [12, 14], 20, false);

		// Creates the keys for detecting key input
		this.cursors = game.input.keyboard.createCursorKeys();
		this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	};

	// Updates physics based on actions
	// player = Phaser Sprite for the player
	// game = the Phaser game instance
	this.update = function(player, game) {
		// Idle speed is 0
	    if (this.bounceLeft && (game.time.now - this.bounceTime) <= this.MAX_BOUNCE_TIME) {
	    	player.body.velocity.x = -this.BOUNCE_SPEED;
	    } else if (this.bounceRight && (game.time.now - this.bounceTime) <= this.MAX_BOUNCE_TIME) {
	    	player.body.velocity.x = this.BOUNCE_SPEED;
	    } else if (this.bounceUp && (game.time.now - this.bounceTime) <= this.MAX_BOUNCE_TIME) {
	    	player.body.velocity.y = -this.BOUNCE_SPEED;
	    } else {
	    	this.bounceTime = 0;
	    	this.bounceLeft = false;
	    	this.bounceRight = false;
	    	player.body.velocity.x = 0;
	    

		    // Movement for on a surface
		    if (!this.isJumping) {
			    // Left
			    if (this.cursors.left.isDown) {
				    player.body.velocity.x = -this.PLAYER_SPEED;
				   	// Flipping sprite on horizontal axis
				    if (!this.playerFacingLeft) {
				  		player.scale.x *= -1;
				  		this.playerFacingLeft = true;
				    }

				    if (this.facing != 'left') {
				      player.animations.play('left');
				      this.facing = 'left';
				    }
			    // Right
			    } else if (this.cursors.right.isDown) {
				    player.body.velocity.x = this.PLAYER_SPEED;

				    // Flipping sprite on horizontal axis
				    if (this.playerFacingLeft) {
				  		player.scale.x *= -1;
				  		this.playerFacingLeft = false;
				    }

				    if (this.facing != 'right') {
				      player.animations.play('right');
				      this.facing = 'right';
				    }
				// Idle
			    } else {
				    if (this.facing != 'idle') {
				      player.animations.play('idle');
				      this.facing = 'idle';
				    }
			    }
		    }
		
	
		    // Jumping
		    if (this.jumpButton.isDown && game.time.now > this.jumpTimer && player.body.onFloor()) {
			    player.body.velocity.y = -this.JUMP_SPEED;
			    player.animations.stop();
			    player.animations.frame = 12;
			    this.isJumping = true;
			    this.facing = 'none';
		    }

		    // Movement for jumping
		    if (this.isJumping) {
			    // Left
			    if (this.cursors.left.isDown) {
				    player.body.velocity.x = -this.PLAYER_SPEED;
				   	// Flipping sprite on horizontal axis
				    if (!this.playerFacingLeft) {
				  		player.scale.x *= -1;
				  		this.playerFacingLeft = true;
				    }
			    // Right
			    } else if (this.cursors.right.isDown) {
				    player.body.velocity.x = this.PLAYER_SPEED;

				    // Flipping sprite on horizontal axis
				    if (this.playerFacingLeft) {
				  		player.scale.x *= -1;
				  		this.playerFacingLeft = false;
				    }
			    }
		    }

		    // Jump animation frame for jump up
		    if (player.body.velocity.y > 0) {
		    	player.animations.frame = 14;
		    }

		    // jump animation change for end of jump
		    if (this.isJumping && player.body.velocity.y === 0) {
		    	player.animations.stop();
		    	this.isJumping = false;
		    }
		}
	};

	// Handling collisions from enemies
	this.collide = function(player, obj) {

		player.attributes.hurt(obj.attributes.damage);

		if (!player.attributes.alive) {
			console.log('player is dead');
		}

		// Bounce the player back
		if (player.body.facing === Phaser.LEFT) {
			// Bounce right
			player.attributes.bounceRight = true;
			player.attributes.bounceTime = player.game.time.now;
		} else if (player.body.facing === Phaser.RIGHT) {
			player.attributes.bounceLeft = true;
			player.attributes.bounceTime = player.game.time.now;
		} else if (player.body.facing === Phaser.DOWN) {
			player.attributes.bounceUp = true;
			player.attributes.bounceTime = player.game.time.now;
		}
	};

	this.hurt = function(damage) {

		this.health -= damage;

		if (this.health <= 0) {
			this.alive = false;
		}
	};
};
