/*
* Handles the Player.
*/

// Our Player class
function Player() {
	// Player Globals
	this.PLAYER_SPEED = 150;	// Player movement speed
	this.JUMP_SPEED = 370;		// Player jump speed
	this.BOUNCE_SPEED = 230;	// The bounce speed for collision with enemies
	this.MAX_BOUNCE_TIME = 150;// Maximum time to bounce on collision in ms
	this.MAX_HEALTH = 100;
	this.SHOOT_INTERVAL = 500;

	// Decision based
	this.hasKey = false;
	this.hasGun_1 = false;
	this.hasGun_2 = false;
	this.hasDoubleJump = false;
	this.armour = false;

	this.jumpTimer = 0;			// The timer for jumping
	this.cursors = null;		// Used for holding the keyboard input and actions
	this.jumpButton = null;
	this.jumpKeyPresses = 0;
	this.canDoubleJump = false;
	this.hasDoubleJumped = false;
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

	this.health = this.MAX_HEALTH;			// Players health
	this.alive = true;			// True if the player is alive
	this.wasAttacked = false;
	this.isAttacking = false;
	this.gainedHealth = false;

	this.lastShoot = 0;
	this.lastHitTime = 0;
	this.bullets = [];
	this.bulletDir = 'right';

	this.paused = false;

	this.items = [];
	this.sword = null;

	this.won = false;

	this.soundFX = {sword:null,gun:null,jump:null};

	// Methods of the player
	this.create = function(player, game, playerStats) {

		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  player.anchor.setTo(0.5,0.5);

	  // Sets the size of the player physics body. 32px x 32px with 0 offsets
		player.body.setSize(22, 32, 0, 0);

		player.body.drag.set(0.1);

		// The player should collide with the bounds of the world
	  player.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  player.animations.add('idle', [0], 1, true);
		player.animations.add('walk', [1, 2, 3, 0], 20, true);

		player.animations.play('idle');

		this.hasArmour = playerStats.hasArmour;
		this.hasKey = playerStats.hasKey;
		this.hasGun_1 = playerStats.hasGun_1;
		this.hasGun_2 = playerStats.hasGun_2;
		this.hasDoubleJump = playerStats.hasDoubleJump;

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
	this.update = function(player, game) {

		if (!this.paused) {
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
				    player.animations.play('walk');
				    if (this.facing != 'left') {
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
				    player.animations.play('walk');
				    if (this.facing != 'right') {
				      this.facing = 'right';
				      this.bulletDir = 'right';
				    }
				// Idle
			    } else {
			    	player.animations.play('idle');
				    if (this.facing != 'idle') {
				      this.facing = 'idle';
				    }
			    }
		    }

		    // Jumping from floor
		    if (this.jumpButton.isDown && player.body.onFloor()) {
			    player.body.velocity.y = -this.JUMP_SPEED;
			    this.isJumping = true;
			    this.facing = 'none';
			    this.soundFX.jump.play();
			    this.jumpKeyPresses++;
		    }

		    if (player.body.velocity.y === 0 && player.body.onFloor()) {
					this.isJumping = false;
		    	this.canDoubleJump = false;
		    	this.hasDoubleJumped = false;
		    	this.jumpKeyPresses = 0;
		    }

		    // Movement for jumping
		    if (this.isJumping) {
		    	if (this.jumpButton.isUp) {
		    		this.canDoubleJump = true;
		    	}
		    	if (this.hasDoubleJump && this.canDoubleJump && this.jumpButton.isDown) {
		    		this.jumpKeyPresses++;
		    	}
		    	if (!this.hasDoubleJumped && this.canDoubleJump && this.jumpKeyPresses === 2) {
		    		
		    		player.body.velocity.y = -this.JUMP_SPEED;
		    		this.hasDoubleJumped = true;  
		    	}
			    // Left
			    if (this.cursors.left.isDown) {
				    player.body.velocity.x = -this.PLAYER_SPEED;
				   	// Flipping sprite on horizontal axis
				   	player.animations.play('walk');
				    if (!this.playerFacingLeft) {
				  		player.scale.x *= -1;
				  		this.playerFacingLeft = true;
				  		this.bulletDir = 'left';
				    }
			    // Right
			    } else if (this.cursors.right.isDown) {
				    player.body.velocity.x = this.PLAYER_SPEED;
				    player.animations.play('walk');
				    // Flipping sprite on horizontal axis
				    if (this.playerFacingLeft) {
				  		player.scale.x *= -1;
				  		this.playerFacingLeft = false;
				  		this.bulletDir = 'right';
				    }
			    } else {
			    	player.animations.play('idle');
			    	if (this.facing != 'idle') {
				      this.facing = 'idle';
				    }
			    }
		    }
			}

			// Check if fired bullet
			if ((this.hasGun_1 || this.hasGun_2) && ((game.time.now - this.lastShoot) > this.SHOOT_INTERVAL) && this.shootButton.isDown && !this.meleeButton.isDown) {
				// add a new bullet sprite
				var type = 0;
				var style = 'bullet';
				if (this.hasGun_2) {
					type = 1;
					style = 'bullet2';
				}
				var bullet = game.add.sprite(player.position.x, player.position.y+5, style);
				game.physics.enable(bullet, Phaser.Physics.ARCADE);
				bullet.attributes = new Bullet();
				bullet.attributes.create(bullet, game, this.bulletDir, type);
				this.bullets.push(bullet);
				this.lastShoot = game.time.now;
				this.soundFX.gun.play();
			}

			// Check for melee
			if (this.meleeButton.isDown) {
				if (this.meleeButton.downDuration(300)) {
					if (this.sword) {
						this.sword.visible = true;
						this.isAttacking = true;
						this.soundFX.sword.play();
					}
				} else {
					if (this.sword) {
						this.sword.visible = false
					}
				}
			} else {
				if (this.sword) {
					this.sword.visible = false
				}
				this.isAttacking = false;
			}

			if (!player.attributes.alive) {
				player.body.velocity.x = 0;
		    player.body.velocity.y = 0;
		    player.animations.stop();
		    player.body.allowGravity = false;
			}
		} else {
			if (player.body) {
				player.animations.play('idle');
				player.body.velocity.x = 0;
			  player.body.velocity.y = 0;
			}
		}
	};

	// Handling collisions from enemies
	this.collide = function(player, obj) {
		if (obj.attributes instanceof GroundEnemy) {
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

		// make sure we don't get spammed with hits on collision
		if ((player.game.time.now - player.attributes.lastHitTime) > 200) {
			if ((obj.attributes instanceof GroundEnemy) && player.game.physics.arcade.distanceBetween(player, obj) < 30) {
				player.attributes.hurt(obj.attributes.damage);
				player.attributes.lastHitTime = player.game.time.now;
			} else {
				player.attributes.hurt(obj.attributes.damage);
				player.attributes.lastHitTime = player.game.time.now;
			}
		}

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
		this.wasAttacked = true;
		if (this.hasArmour) {
			damage = damage / 3;
		}
		this.health -= damage;
		if (this.health <= 0) {
			this.alive = false;
		}
	};

	this.addItem = function(item) {
		if (item.attributes && item.attributes.name === 'sword') {
			this.sword = item;
			return;
		}
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
