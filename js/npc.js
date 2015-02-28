/*
* Holds NPC data
*/

// Old man
function OldMan() {
  
  this.QUEST_LINE = "It seems I have lost my key young one.\nIf you return it to me I will give you my lucky pistol.\nHoHo! Take this sword, there's nasty little buns about.\nSmack them around with 'C'\nRemember to eat your apples!";

  this.create = function(oldMan, game) {
    // Sets the size of the enemy physics body.
    oldMan.body.setSize(24, 43, 0, 0);

    oldMan.body.allowGravity = true;

    // The oldMan should collide with the bounds of the world
    oldMan.body.collideWorldBounds = true;
      
    // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
    oldMan.animations.add('idle', [0], 20, false);
    oldMan.animations.add('talk', [1, 2], 15, true);
    oldMan.body.immovable = true;
  };

  this.update = function(oldMan, game) {
    oldMan.body.velocity.x = 0;
    oldMan.body.velocity.y = 0;
  };
};