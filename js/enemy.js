/*
* Holds all the info for the enemies.
*/


// The evil ground bunny
function EvilGroundBunny() {
	
	this.health = 100;
	this.damage = 5;


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
	};

	this.update = function(enemy, game) {

	};

};
