/*
* Holds all the info for the enemies.
*/


// The evil ground bunny
function EvilGroundBunny() {
	
	this.MAX_IDLE = 1000;
	this.ATTACK_RANGE_X = 80;
	this.BOUNCE_SPEED = 230;	// The bounce speed for collision with enemies
	this.MAX_BOUNCE_TIME = 150;// Maximum time to bounce on collision in ms
	this.ATTACK_RANGE_Y = 40;
	this.JUMP_SPEED = 100;

	this.bounceLeft = false;	// If the player should bounce to the left on collision
	this.bounceRight = false;	// If the player should bounce to the right on collision
	this.bounceTop = false;		// If the player should bounce up on collision
	this.bounceTime = 0;		// The time to bounce

	this.SPEED = 50;
	this.health = 15;
	this.damage = 3;
	this.direction = 'left';
	this.loc = 0;
	this.prevLoc = 0;
	this.idleTime = 0;
	this.isAttacking = false;
	this.playerLocX = 0;
	this.playerLocY = 0;

	this.soundFX = {hurt:null, dead:null};



	// Methods
	this.create = function(enemy, game) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  enemy.anchor.setTo(0.5,0.5);

	   // Sets the size of the enemy physics body.
		enemy.body.setSize(24, 20, 0, 5);

		// The enemy should collide with the bounds of the world
	  enemy.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  enemy.animations.add('idle', [0], 20, false);
		enemy.animations.add('left', [0, 1, 2, 3, 4], 20, true);
		enemy.animations.add('right', [0, 1, 2, 3, 4], 20, true);
		enemy.animations.add('attack', [5], 20, false);

		enemy.attributes.prevLoc = enemy.position.x;

		var rand = Math.floor((Math.random() * 3) + 1);

		if (rand === 1) {
			enemy.attributes.direction = 'left';
		} else if (rand === 2) {
			enemy.attributes.direction = 'right';
			enemy.scale.x *= -1;
		} else {
			enemy.attributes.idleTime = game.time.now + 1;
		}

		enemy.attributes.soundFX.hurt = game.add.audio('hit', 1, false);
		enemy.attributes.soundFX.dead = game.add.audio('squish', 1, false);
	};

	this.update = function(enemy, game, player) {
		

		// Attack if player is near
		var posX = player.position.x - enemy.position.x;
		var posY = player.position.y - enemy.position.y;

		// bounce from attacks
	  if (enemy.attributes.bounceLeft && (game.time.now - enemy.attributes.bounceTime) <= enemy.attributes.MAX_BOUNCE_TIME) {
    	enemy.body.velocity.x = -enemy.attributes.BOUNCE_SPEED;
    } else if (enemy.attributes.bounceRight && (game.time.now - enemy.attributes.bounceTime) <= enemy.attributes.MAX_BOUNCE_TIME) {
    	enemy.body.velocity.x = enemy.attributes.BOUNCE_SPEED;
    } else if (this.bounceUp && (game.time.now - enemy.attributes.bounceTime) <= enemy.attributes.MAX_BOUNCE_TIME) {
    	enemy.body.velocity.y = -enemy.attributes.BOUNCE_SPEED;
    } else {
    	this.bounceTime = 0;
    	this.bounceLeft = false;
    	this.bounceRight = false;
    	if (Math.abs(posX) <= enemy.attributes.ATTACK_RANGE_X && Math.abs(posY) <= enemy.attributes.ATTACK_RANGE_Y && !enemy.attributes.isAttacking) {
				// attack the player
				enemy.animations.play('attack');
				enemy.attributes.isAttacking = true;
				enemy.attributes.playerLocX = posX;
				enemy.attributes.playerLocY = posY;

				if (enemy.attributes.playerLocX < 0) {
					if (enemy.attributes.direction !== 'left') {
						enemy.attributes.direction = 'left';
						enemy.scale.x *= -1;
					}
				} else {
					if (enemy.attributes.direction !== 'right') {
						enemy.attributes.direction = 'right';
						enemy.scale.x *= -1;
					}
				}

				// jump at player
				enemy.body.velocity.y = -enemy.attributes.JUMP_SPEED;

			} else if (!enemy.attributes.isAttacking) {
				if (Math.abs(enemy.attributes.prevLoc - enemy.position.x) >= 64) {
					enemy.attributes.prevLoc = enemy.position.x;
					enemy.body.velocity.x = 0;
					enemy.attributes.idleTime = game.time.now;

				} else {

					if (enemy.attributes.idleTime === 0) {
						if (enemy.attributes.direction === 'left') {
							enemy.body.velocity.x = -enemy.attributes.SPEED;
						} else {
							enemy.body.velocity.x = enemy.attributes.SPEED;
						}
					} else {
						if (game.time.now - enemy.attributes.idleTime > enemy.attributes.MAX_IDLE) {
							enemy.attributes.idleTime = 0;
							if (enemy.attributes.direction === 'left') {
								// face right and move
								enemy.scale.x *= -1;
								enemy.attributes.direction = 'right';
								enemy.animations.play('right');
							} else {
								// face left and move
								enemy.scale.x *= -1;
								enemy.attributes.direction = 'left';
								enemy.animations.play('left');
							}
						} else {
							enemy.animations.play('idle');
						}
					}
				}
			} else {
				if (enemy.attributes.playerLocX > 0) {
					enemy.body.velocity.x = 100;
				} else {
					enemy.body.velocity.x = -100;
				}

				if (enemy.body.onFloor()) {
					enemy.body.velocity.y = -enemy.attributes.JUMP_SPEED;
				}

				// if player out of bounds go back to normal
				if (Math.abs(player.position.x - enemy.position.x) > enemy.attributes.ATTACK_RANGE_X) {
					enemy.attributes.isAttacking = false;
					enemy.animations.play('idle');
					enemy.idleTime = game.time.now;
				} 
			}

    }
	};

	this.hurt = function(enemy, damage) {

		enemy.attributes.health -= damage;

		enemy.attributes.soundFX.hurt.play();

		if (enemy.attributes.health <= 0) {
			// randomly drop an apple
			var rand = Math.floor((Math.random() * 2) + 1);

			if (rand === 2) {
				enemy.attributes.soundFX.dead.play();
				var g = enemy.game;
				enemy.attributes.soundFX.dead.play();
				var apple = g.add.sprite(enemy.position.x, enemy.position.y - 10, 'apple');
	    	apple.attributes = new Item();
	    	g.physics.enable(apple, Phaser.Physics.ARCADE);
	    	apple.attributes.create(apple, g, 'apple');
	    	g.items.push(apple);
			}			
			enemy.kill();
		}
	}
};



function Bat() {

	this.health = 10;
	this.damage = 5;
	this.direction = 'left';
	this.soundFX = {hurt:null, dead:null};
	
	// Methods
	this.create = function(enemy, game) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  enemy.anchor.setTo(0.5,0.5);

	   // Sets the size of the enemy physics body.
		enemy.body.setSize(32, 32, 0, 0);

		enemy.body.allowGravity = false;

		enemy.body.bounce = 0;

		// The enemy should collide with the bounds of the world
	  enemy.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  enemy.animations.add('fly', [12,13,14], 15, true);

		var rand = Math.floor((Math.random() * 3) + 1);

		if (rand === 1) {
			enemy.attributes.direction = 'left';
		} else if (rand === 2) {
			enemy.attributes.direction = 'right';
			enemy.scale.x *= -1;
		}

		enemy.attributes.soundFX.hurt = game.add.audio('hit', 1, false);
		enemy.attributes.soundFX.dead = game.add.audio('squish', 1, false);

		// tween the bat
		game.add.tween(enemy).to( { x: enemy.x + 500 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
	};

	this.hurt = function(enemy, damage) {

		enemy.attributes.health -= damage;

		enemy.attributes.soundFX.hurt.play();

		if (enemy.attributes.health <= 0) {
			// randomly drop an apple
			var rand = Math.floor((Math.random() * 2) + 1);

			if (rand === 2) {
				enemy.attributes.soundFX.dead.play();
				var g = enemy.game;
				enemy.attributes.soundFX.dead.play();
				var apple = g.add.sprite(enemy.position.x, enemy.position.y - 10, 'apple');
	    	apple.attributes = new Item();
	    	g.physics.enable(apple, Phaser.Physics.ARCADE);
	    	apple.attributes.create(apple, g, 'apple');
	    	g.items.push(apple);
			}			
			enemy.kill();
		}
		// Bounce the enemy back
		if (enemy.attributes.touching !== undefined && enemy.attributes.touching.right) {
			// Bounce right
			enemy.attributes.bounceRight = true;
			enemy.attributes.bounceTime = enemy.game.time.now;
		} else if (enemy.attributes.touching !== undefined && enemy.attributes.touching.left) {
			enemy.attributes.bounceLeft = true;
			enemy.attributes.bounceTime = enemy.game.time.now;
		}
	}

};


/*
*	Mini Boss
*/
function MiniBoss() {

	this.MAX_IDLE = 1000;
	this.MAX_HEALTH = 50;
	this.ATTACK_RANGE_X = 200;
	this.ATTACK_RANGE_Y = 100;

	this.wasAttacked = false;

	this.alive = true;
	this.SPEED = 50;
	this.health = 50;
	this.damage = 10;
	this.direction = 'right';
	this.loc = 0;
	this.prevLoc = 0;
	this.idleTime = 0;
	this.isAttacking = false;
	this.playerLocX = 0;
	this.playerLocY = 0;

	this.soundFX = {hurt:null,dead:null};

	this.create = function(miniBoss, game) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  miniBoss.anchor.setTo(0.5,0.5);

		miniBoss.body.setSize(40, 64, 0, 0);

		// should collide with the bounds of the world
	  miniBoss.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  miniBoss.animations.add('idle', [0,4], 0.5, true);
		miniBoss.animations.add('walk', [0, 1, 2, 3], 5, true);
		miniBoss.animations.add('attack', [4,5,6,7,0], 5, true);
		miniBoss.animations.add('hit', [8,9,0], 5, false);
		miniBoss.animations.add('die', [12,13,14,15], 5, false);

		miniBoss.animations.play('idle');

		miniBoss.attributes.soundFX.hurt = game.add.audio('hit', 1, false);
		miniBoss.attributes.soundFX.dead = game.add.audio('minibossDead', 1, false);
		miniBoss.attributes.alive = true;
	};

	this.update = function(miniBoss, game, player) {
		// Attack if player is near
		var posX = player.position.x - miniBoss.position.x;
		var posY = player.position.y - miniBoss.position.y;
		if (Math.abs(posX) <= miniBoss.attributes.ATTACK_RANGE_X && Math.abs(posY) <= miniBoss.attributes.ATTACK_RANGE_Y && !miniBoss.attributes.isAttacking) {
			// attack the player
			miniBoss.animations.play('attack');
			miniBoss.attributes.isAttacking = true;
			miniBoss.attributes.playerLocX = posX;
			miniBoss.attributes.playerLocY = posY;

			if (miniBoss.attributes.playerLocX < 0) {
				if (miniBoss.attributes.direction !== 'left') {
					miniBoss.attributes.direction = 'left';
					miniBoss.scale.x *= -1;
				}
			} else {
				if (miniBoss.attributes.direction !== 'right') {
					miniBoss.attributes.direction = 'right';
					miniBoss.scale.x *= -1;
				}
			}
		} else if (!miniBoss.attributes.isAttacking) {
			if (Math.abs(miniBoss.attributes.prevLoc - miniBoss.position.x) >= 64) {
				miniBoss.attributes.prevLoc = miniBoss.position.x;
				miniBoss.body.velocity.x = 0;
				miniBoss.attributes.idleTime = game.time.now;
			} else {
				if (miniBoss.attributes.idleTime === 0) {
					if (miniBoss.attributes.direction === 'left') {
						miniBoss.body.velocity.x = -miniBoss.attributes.SPEED;
					} else {
						miniBoss.body.velocity.x = miniBoss.attributes.SPEED;
					}
				} else {
					if (game.time.now - miniBoss.attributes.idleTime > miniBoss.attributes.MAX_IDLE) {
						miniBoss.attributes.idleTime = 0;
						if (miniBoss.attributes.direction === 'left') {
							// face right and move
							miniBoss.scale.x *= -1;
							miniBoss.attributes.direction = 'right';
							miniBoss.animations.play('walk');
						} else {
							// face left and move
							miniBoss.scale.x *= -1;
							miniBoss.attributes.direction = 'left';
							miniBoss.animations.play('walk');
						}
					} else {
						miniBoss.animations.play('idle');
					}
				}
			}
		} else {
			if (miniBoss.attributes.playerLocX > 0) {
				miniBoss.body.velocity.x = 100;
			} else {
				miniBoss.body.velocity.x = -100;
			}

			// if player out of bounds go back to normal
			if (Math.abs(player.position.x - miniBoss.position.x) > miniBoss.attributes.ATTACK_RANGE_X) {
				miniBoss.attributes.isAttacking = false;
				miniBoss.animations.play('idle');
				miniBoss.idleTime = game.time.now;
			} 
		}
	};

	this.hurt = function(miniBoss, damage) {
		miniBoss.attributes.wasAttacked = true;
		miniBoss.attributes.health -= damage;
		miniBoss.attributes.soundFX.hurt.play();
		if (miniBoss.attributes.health <= 0) {
			var g = miniBoss.game;
			miniBoss.attributes.soundFX.dead.play();
			var key = g.add.sprite(miniBoss.position.x, miniBoss.position.y - 10, 'items');
    	key.attributes = new Item();
    	g.physics.enable(key, Phaser.Physics.ARCADE);
    	key.attributes.create(key, g, 'key');
    	g.items.push(key);
    	miniBoss.attributes.alive = false;
    	miniBoss.kill();
		}
	}
};