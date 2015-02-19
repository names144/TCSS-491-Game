/*
* Holds all the info for the enemies.
*/


// The evil ground bunny
function EvilGroundBunny() {
	
	this.MAX_IDLE = 1000;
	this.ATTACK_RANGE_X = 80;
	this.ATTACK_RANGE_Y = 40;
	this.JUMP_SPEED = 100;

	this.SPEED = 50;
	this.health = 15;
	this.damage = 5;
	this.direction = 'left';
	this.loc = 0;
	this.prevLoc = 0;
	this.idleTime = 0;
	this.isAttacking = false;
	this.playerLocX = 0;
	this.playerLocY = 0;



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
	};

	this.update = function(enemy, game, player) {
		

		// Attack if player is near
		var posX = player.position.x - enemy.position.x;
		var posY = player.position.y - enemy.position.y;
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

		
	};

	this.hurt = function(enemy, damage) {

		enemy.attributes.health -= damage;

		if (enemy.attributes.health <= 0) {
			enemy.kill();
		}
	}

};


/*
*	Mini Boss
*/
function MiniBoss() {

	this.MAX_IDLE = 1000;
	this.ATTACK_RANGE_X = 200;
	this.ATTACK_RANGE_Y = 100;

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

		miniBoss.attributes.health -= damage;
		if (miniBoss.attributes.health <= 0) {
			var g = miniBoss.game;
			var key = g.add.sprite(miniBoss.position.x, miniBoss.position.y - 10, 'items');
    	key.attributes = new Item();
    	g.physics.enable(key, Phaser.Physics.ARCADE);
    	key.attributes.create(key, g, 'key');
    	g.items.push(key);
    	miniBoss.kill();
		}
	}
};