/*
* Handles the Player.
*/

// Our Player class
function Player() {
	// Player Globals
	this.PLAYER_SPEED = 150;	// Player movement speed
	this.JUMP_SPEED = 270;		// Player jump speed
	this.BOUNCE_SPEED = 230;	// The bounce speed for collision with enemies
	this.MAX_BOUNCE_TIME = 150;// Maximum time to bounce on collision in ms
	this.MAX_HEALTH = 100;
	this.SHOOT_INTERVAL = 500;

	this.jumpTimer = 0;			// The timer for jumping
	this.cursors = null;		// Used for holding the keyboard input and actions
	this.jumpButton = null;
	this.shootButton = null;
	this.meleeButton = null;
	this.isJumping = false;		// If the player is currently jummping
	this.playerFacingLeft = false;	// Used for flipping the player left/right based on direction
	this.facing = 'right';		// The direction the player is facing

	this.bounceLeft = false;	// If the player should bounce to the left on collision
	this.bounceRight = false;	// If the player should bounce to the right on collision
	this.bounceTop = false;		// If the player should bounce up on collision
	this.bounceTime = 0;		// The time to bounce
	this.canBounce = true;

	this.health = 100;			// Players health
	this.alive = true;			// True if the player is alive
	this.wasAttacked = false;
	this.isAttacking = false;
	this.meleeDamage = 7;
	this.gainedHealth = false;

	this.lastShoot = 0;
	this.bullets = [];
	this.bulletDir = 'right';

	this.items = [];

	this.won = false;

	this.soundFX = {sword:null,gun:null,jump:null};


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
		player.animations.add('dead', [8], 20, false);
		player.animations.add('melee', [18, 19], 15, false);

		// Creates the keys for detecting key input
		this.cursors = game.input.keyboard.createCursorKeys();
		this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.shootButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
		this.meleeButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

		this.soundFX.sword = game.add.audio('swordSound', 1, false);
		this.soundFX.gun = game.add.audio('shoot', 1, false);
		this.soundFX.jump = game.add.audio('jump', 0.75, false);
	};

	// Updates physics based on actions
	// player = Phaser Sprite for the player
	// game = the Phaser game instance
	this.update = function(player, game) {

		// Idle speed is 0
	  if (this.canBounce && this.bounceLeft && (game.time.now - this.bounceTime) <= this.MAX_BOUNCE_TIME) {
    	player.body.velocity.x = -this.BOUNCE_SPEED;
    } else if (this.canBounce && this.bounceRight && (game.time.now - this.bounceTime) <= this.MAX_BOUNCE_TIME) {
    	player.body.velocity.x = this.BOUNCE_SPEED;
    } else if (this.canBounce && this.bounceUp && (game.time.now - this.bounceTime) <= this.MAX_BOUNCE_TIME) {
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
			      this.bulletDir = 'left';
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
			      this.bulletDir = 'right';
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
		    this.soundFX.jump.play();
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
			  		this.bulletDir = 'left';
			    }
		    // Right
		    } else if (this.cursors.right.isDown) {
			    player.body.velocity.x = this.PLAYER_SPEED;

			    // Flipping sprite on horizontal axis
			    if (this.playerFacingLeft) {
			  		player.scale.x *= -1;
			  		this.playerFacingLeft = false;
			  		this.bulletDir = 'right';
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

		// Check if fired bullet
		if (((game.time.now - this.lastShoot) > this.SHOOT_INTERVAL) && this.shootButton.isDown && !this.meleeButton.isDown) {
			// add a new bullet sprite
			var bullet = game.add.sprite(player.position.x, player.position.y+5, 'bullet');
			game.physics.enable(bullet, Phaser.Physics.ARCADE);
			bullet.attributes = new Bullet();
			bullet.attributes.create(bullet, game, this.bulletDir);
			this.bullets.push(bullet);
			this.lastShoot = game.time.now;
			this.soundFX.gun.play();
		}

		// Check for melee
		if (this.meleeButton.isDown) {
			player.animations.play('melee');
			this.isAttacking = true;
			this.soundFX.sword.play();
		} else {
			this.isAttacking = false;
		}

		if (player.attributes.items.length > 0) {
			player.body.velocity.x = 0;
	    player.body.velocity.y = 0;
	    player.animations.stop();
	    player.body.allowGravity = false;
			this.won = true;			
		}

		if (!player.attributes.alive) {
			player.body.velocity.x = 0;
	    player.body.velocity.y = 0;
	    player.animations.stop();
	    player.body.allowGravity = false;
		}
	};

	// Handling collisions from enemies
	this.collide = function(player, obj) {
		if (obj.attributes instanceof EvilGroundBunny) {
			if (player.attributes.isAttacking) {
				player.attributes.canBounce = false;
			} else {
				player.attributes.canBounce = true;
			}
		} else if (obj.attributes instanceof MiniBoss) {
			player.attributes.canBounce = true;
		} else {
			player.attributes.canBounce = true;
		}

		if ((obj.attributes instanceof EvilGroundBunny) && player.game.physics.arcade.distanceBetween(player, obj) < 30) {
			player.attributes.hurt(obj.attributes.damage);
		} else {
			player.attributes.hurt(obj.attributes.damage);
		}
		
		

		if (player.attributes.isAttacking) {
			obj.attributes.hurt(obj, player.attributes.meleeDamage);
		}
		
		player.attributes.wasAttacked = true;

		if (!player.attributes.alive) {
			console.log('player is dead');
			player.animations.play('dead');
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

	this.addItem = function(item) {
		if (item.attributes.name === 'apple') {
			if (this.health < 100) {
				this.health += item.attributes.health;
				if (this.health > 100) {
					this.health = 100;
				}
				this.gainedHealth = true;
			}
		} else {
			//console.log(this.items);
			//console.log(item);
			this.items.push(item.attributes.name);
		}
		item.kill();
	};
};
