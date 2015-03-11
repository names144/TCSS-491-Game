/*
* Holds all the info for the enemies.
*/
// The evil ground enemy
function GroundEnemy() {
	
	this.MAX_IDLE = 1000;
	this.ATTACK_RANGE_X = 100;
	this.BOUNCE_SPEED = 230;	// The bounce speed for collision with enemies
	this.MAX_BOUNCE_TIME = 150;// Maximum time to bounce on collision in ms
	this.ATTACK_RANGE_Y = 40;
	this.JUMP_SPEED = 100;

	this.bounceLeft = false;	// If the player should bounce to the left on collision
	this.bounceRight = false;	// If the player should bounce to the right on collision
	this.bounceTop = false;		// If the player should bounce up on collision
	this.bounceTime = 0;		// The time to bounce

	this.SPEED = 50;
	this.health = 5;
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
	this.create = function(enemy, game, type) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  enemy.anchor.setTo(0.5,0.5);

	   // Sets the size of the enemy physics body.
		enemy.body.setSize(24, 20, 0, 5);

		// The enemy should collide with the bounds of the world
	  enemy.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  if (type === 'bunny') {
	  	enemy.animations.add('idle', [0], 20, false);
			enemy.animations.add('walk', [0, 1, 2, 3, 4], 20, true);
			enemy.animations.add('attack', [5], 20, false);
	  } else {
	  	// rat
	  	enemy.animations.add('idle', [0], 20, false);
	  	enemy.animations.add('walk', [0, 1, 2], 20, true);
			enemy.animations.add('attack', [0, 1, 2], 20, true);
	  }

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

		enemy.attributes.playerLocX = posX;
		enemy.attributes.playerLocY = posY;

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
								enemy.animations.play('walk');
							} else {
								// face left and move
								enemy.scale.x *= -1;
								enemy.attributes.direction = 'left';
								enemy.animations.play('walk');
							}
						} else {
							enemy.animations.play('idle');
						}
					}
				}
			} else {

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

function Archer() {

	this.ATTACK_RANGE_X = 300;
	this.ATTACK_RANGE_Y = 40;
	this.MAX_SHOOT_INTERVAL = 1000;

	this.isAttacking = false;

	this.lastArrow = 0;

	this.playerLocX = 0;
	this.playerLocY = 0;

	this.damage = 8;

	this.arrows = [];

	this.health = 10;
	this.direction = 'left';
	this.soundFX = {hurt:null, dead:null, arrow:null};

	this.create = function(enemy, game) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  enemy.anchor.setTo(0.5,0.5);

	   // Sets the size of the enemy physics body.
		enemy.body.setSize(48, 48, 0, -5);

		enemy.body.bounce = 0;

		// The enemy should collide with the bounds of the world
	  enemy.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  enemy.animations.add('idle', [0], 20, false);
		enemy.animations.add('attack', [3,1,0,1,2], 5, true);

		enemy.attributes.soundFX.hurt = game.add.audio('hit', 1, false);
		enemy.attributes.soundFX.dead = game.add.audio('bones', 1, false);
		enemy.attributes.soundFX.arrow = game.add.audio('arrowFire', 0.8, false);
	};

	this.update = function(enemy, game, player) {
		// Attack if player is near
		var posX = player.position.x - enemy.position.x;
		var posY = player.position.y - enemy.position.y;

		enemy.attributes.playerLocX = posX;
		enemy.attributes.playerLocY = posY;

    if (Math.abs(posX) <= enemy.attributes.ATTACK_RANGE_X && Math.abs(posY) <= enemy.attributes.ATTACK_RANGE_Y && !enemy.attributes.isAttacking) {
			// attack the player
			enemy.animations.play('attack');
			enemy.attributes.isAttacking = true;
		} else {
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

			// if player out of bounds go back to normal
			if (Math.abs(player.position.x - enemy.position.x) > enemy.attributes.ATTACK_RANGE_X || Math.abs(player.position.y - enemy.position.y) > enemy.attributes.ATTACK_RANGE_Y) {
				enemy.attributes.isAttacking = false;
				enemy.animations.play('idle');
				enemy.idleTime = game.time.now;
			} 
		}

		if (this.isAttacking && (game.time.now - this.lastArrow) > this.MAX_SHOOT_INTERVAL) {
				this.lastArrow = game.time.now;
				var arrow = game.add.sprite(enemy.position.x, enemy.position.y, 'arrow');
				game.physics.enable(arrow, Phaser.Physics.ARCADE);
				arrow.attributes = new Arrow();
				arrow.attributes.create(arrow, game, enemy.attributes.direction);
				this.arrows.push(arrow);
				this.soundFX.arrow.play();
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
	};
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
		game.add.tween(enemy).to( { x: enemy.body.x + 500 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
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
*	Mini Boss 1
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
	this.damage = 7;
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

		miniBoss.body.bounce = 0;

		miniBoss.body.allowGravity = true;

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
		miniBoss.attributes.playerLocX = posX;
		miniBoss.attributes.playerLocY = posY;
		if (Math.abs(posX) <= miniBoss.attributes.ATTACK_RANGE_X && Math.abs(posY) <= miniBoss.attributes.ATTACK_RANGE_Y && !miniBoss.attributes.isAttacking) {
			// attack the player
			miniBoss.animations.play('attack');
			miniBoss.attributes.isAttacking = true;
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
		if (miniBoss.attributes.direction === 'left') {
			miniBoss.position.y = 739;
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

/*
*	Mini Boss 2
*/
function MiniBoss2() {

	this.MAX_IDLE = 1000;
	this.MAX_HEALTH = 75;
	this.MAX_SHOTS = 3;

	this.FIRE_RATE = 1500;

	this.lastShot = 0;

	this.paused = true;

	this.wasAttacked = false;

	this.hasShot = false;
	this.canAttack = true;

	this.alive = true;
	this.health = 75;
	this.damage = 7;
	this.direction = 'left';
	this.isAttacking = false;

	this.numShots = 0;

	this.tweens = [];
	this.tweenIndex = 0;
	this.tween = null;

	this.bullets = [];

	this.soundFX = {hurt:null,dead:null};

	this.create = function(miniBoss, game) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  miniBoss.anchor.setTo(0.5,0.5);

		miniBoss.body.setSize(67, 58, 0, 0);

		miniBoss.body.bounce = 0;

		// should collide with the bounds of the world
	  miniBoss.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  miniBoss.animations.add('idle', [0], 1, false);
		miniBoss.animations.add('fly', [13, 2], 5, false);
		miniBoss.animations.add('block', [1], 1, false);
		miniBoss.animations.add('attack', [12,10,0], 10, false);
		miniBoss.animations.add('die', [4,5,6], 5, false);

		miniBoss.animations.play('idle');

		miniBoss.attributes.soundFX.hurt = game.add.audio('hit', 1, false);
		miniBoss.attributes.soundFX.dead = game.add.audio('minibossDead', 1, false);
		miniBoss.attributes.soundFX.gun = game.add.audio('rocketSound', 1, false);
		miniBoss.attributes.alive = true;

		// Create the tweens
		this.tweens[0] = game.add.tween(miniBoss).to( { x: 3628, y: 585}, 2000, Phaser.Easing.Linear.None, false, 0, 0, false);
		this.tweens[1] = game.add.tween(miniBoss).to( { x: 2970, y: 710}, 2000, Phaser.Easing.Circular.Out, false, 0, 0, false);
		this.tweens[2] = game.add.tween(miniBoss).to( { x: 2960, y: 550}, 2000, Phaser.Easing.Linear.None, false, 0, 0, false);
	};

	this.update = function(miniBoss, game, player) {
		// Scripted attacks, randomly fly to new location
		// Will fire at players last know location
		
		if (!miniBoss.attributes.paused) {

			// Shoot, fly, repeat.
			// Max shots 3 min 1
			if (miniBoss.attributes.canAttack) {

				// Face the player
				var x = player.position.x - miniBoss.position.x;

				if (x < 0) {
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
				// Shoot at the player
				if ((game.time.now - miniBoss.attributes.lastShot) > miniBoss.attributes.FIRE_RATE && miniBoss.attributes.numShots < miniBoss.attributes.MAX_SHOTS && !miniBoss.attributes.hasShot) {
					var coords = {
						x: player.position.x,
						y: player.position.y
					};
					miniBoss.animations.play('attack');
					var bullet = game.add.sprite(miniBoss.position.x, miniBoss.position.y+5, 'rocket');
					game.physics.enable(bullet, Phaser.Physics.ARCADE);
					bullet.attributes = new Rocket();
					bullet.attributes.create(bullet, game, miniBoss.attributes.direction, coords);
					miniBoss.attributes.bullets.push(bullet);
					this.lastShoot = game.time.now;
					miniBoss.attributes.soundFX.gun.play();
					miniBoss.attributes.lastShot = game.time.now;
					miniBoss.attributes.numShots++;
				} else if (miniBoss.attributes.numShots === miniBoss.attributes.MAX_SHOTS) {
					miniBoss.attributes.numShots = 0;
					miniBoss.attributes.lastShot = 0;
					miniBoss.attributes.canAttack = false;
					miniBoss.animations.frame = 0;
					// Choose where to go
					// Don't fly through floors, etc.
					if (miniBoss.attributes.tweenIndex === 0) {
						// can fly to 1 or 2
						miniBoss.attributes.tweenIndex = Math.floor((Math.random() * 2) + 1);
					} else {
						// fly back to 0
						miniBoss.attributes.tweenIndex = 0;
					}

					// delay
					game.time.events.add(Phaser.Timer.SECOND, function(){miniBoss.attributes.hasShot = true}, this);

				}
			} else if (miniBoss.attributes.hasShot) {
				// Fly to new position
				miniBoss.attributes.tween = miniBoss.attributes.tweens[miniBoss.attributes.tweenIndex];
				miniBoss.animations.frame = 2;
				miniBoss.attributes.tween.start();
				miniBoss.attributes.hasShot = false;
				miniBoss.attributes.tween.onComplete.addOnce(function(){miniBoss.attributes.canAttack = true;}, this);
			}
		} 
	};

	this.hurt = function(miniBoss, damage) {
		miniBoss.attributes.wasAttacked = true;
		miniBoss.attributes.health -= damage;
		miniBoss.attributes.soundFX.hurt.play();
		if (miniBoss.attributes.health <= 0) {
    	miniBoss.kill();
		}
	};
};

/*
*	The final boss
*/
function Boss() {

	this.MAX_HEALTH = 100;
	this.BOMB_INTERVAL = 1200;

	this.ATTACK_TIME = 8000;

	this.lastRoll = 0;
	this.lastBomb = 0;

	this.wasAttacked = false;

	this.rolling = false;

	this.alive = true;
	this.health = 100;
	this.damage = 7;
	this.direction = 'left';

	this.tweens = [];
	this.tween = null;
	this.tweenLeft = true;

	this.bombs = [];

	this.soundFX = {hurt:null,dead:null};

	this.create = function(boss, game) {
		// Sets the anchor for the sprite. Easier to handle axis flips, etc.
	  boss.anchor.setTo(0.5,0.5);

		boss.body.setSize(70, 70, 0, 0);

		boss.body.bounce = 0;

		boss.body.allowGravity = false;

		// should collide with the bounds of the world
	  boss.body.collideWorldBounds = true;
	    
	  // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
	  boss.animations.add('move', [0,1,2,3,4,3,2,1], 5, true);
		boss.animations.add('dive', [19], 5, false);

		boss.animations.play('move');

		boss.attributes.soundFX.hurt = game.add.audio('hit', 1, false);
		boss.attributes.soundFX.dead = game.add.audio('minibossDead', 1, false);
		boss.attributes.alive = true;

		// Create the tweens
		this.tweens[0] = game.add.tween(boss).to( { x: 2392, y: 1600}, 2000, Phaser.Easing.Linear.None, false, 0, 0, false);
		this.tweens[1] = game.add.tween(boss).to( { x: 3080, y: 1600}, 2000, Phaser.Easing.Linear.None, false, 0, 0, false);
	};

	this.update = function(boss, game, player) {
		// Scripted attacks, randomly fly to new location
		// Will fire at players last know location
		
		if ((game.time.now - boss.attributes.lastRoll) > boss.attributes.ATTACK_TIME && !boss.attributes.rolling) {
			// do a roll
			// tween to center while rolling
			boss.animations.play('dive');
			boss.attributes.tween = game.add.tween(boss).to( { x: player.position.x, y: 1808}, 1000, Phaser.Easing.Linear.None, false, 0, 0, false);
			
			// make sure to face correct direction
			if (boss.position.x > player.position.x) {
				// face left
				if (boss.attributes.direction === 'right') {
					boss.attributes.direction = 'left';
					boss.scale.x *= -1;
				}
			} else {
				// face right
				if (boss.attributes.direction === 'left') {
					boss.attributes.direction = 'right';
					boss.scale.x *= -1;
				}
			}

			boss.attributes.tween.start();
			boss.attributes.rolling = true;
			boss.attributes.tween.onComplete.addOnce(function(){
				boss.attributes.rolling = false; 
				boss.attributes.rolling = false;
				boss.attributes.lastRoll = game.time.now;
			}, this); 
		} else if (!boss.attributes.rolling) {
			boss.animations.play('move');
			if (this.tweenLeft) {
				if (boss.attributes.direction === 'right') {
					boss.attributes.direction = 'left';
					boss.scale.x *= -1;
				}
				boss.attributes.tween = boss.attributes.tweens[0];
				boss.attributes.tween.start();
				boss.attributes.tween.onComplete.addOnce(function(){boss.attributes.tweenLeft = false;}, this); 
			} else {
				if (boss.attributes.direction === 'left') {
					boss.attributes.direction = 'right';
					boss.scale.x *= -1;
				}
				boss.attributes.tween = boss.attributes.tweens[1];
				boss.attributes.tween.start();
				boss.attributes.tween.onComplete.addOnce(function(){boss.attributes.tweenLeft = true;}, this); 
			}

			// drop bombs
			if ((game.time.now - boss.attributes.lastBomb) > boss.attributes.BOMB_INTERVAL) {

				var bomb = game.add.sprite(boss.position.x, boss.position.y+5, 'bomb');
				game.physics.enable(bomb, Phaser.Physics.ARCADE);
				bomb.attributes = new Bomb();
				bomb.attributes.create(bomb, game);
				boss.attributes.lastBomb = game.time.now;
				boss.attributes.bombs.push(bomb);
			}
		}
	};

	this.hurt = function(boss, damage) {
		boss.attributes.wasAttacked = true;
		boss.attributes.health -= damage;
		boss.attributes.soundFX.hurt.play();
		if (boss.attributes.health <= 0) {
    	boss.kill();
		}
	};
};