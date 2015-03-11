/*
* Holds NPC data
*/

// Old man
function OldMan() {
  
  this.QUEST_LINE_1 = "It seems I have lost my key young one.\nIf you return it to me I will give you my lucky pistol.\nHoHo! Take this sword, there's nasty little buns about.\nSmack them around with 'C'\nRemember to eat your apples!";

  this.DENY_QUEST_1 = "I can't believe you took down that big brute!\nBut he didn't have my key...oh well, maybe it is lost forever...\nCould you check out the castle?\nI thought I heard something going on inside..."

  this.ACCEPT_QUEST_1 = "You defeated that big brute and found my key!\nHere is my blaster, try it out with X!\nYou should check out the castle.\nI heard something going on inside..."

  this.GIVE_DOUBLE_JUMP = "It seems you need to get up there!\nTake my sweet kicks!\nJump twice with SPACE to fly like Jordan!";

  this.CASTLE_SPEECH_1 = "I hope you are alright lad!\nThat was a dangerous battle!\nHurry and get to the princess!\nUse your double jump to climb out\nthe window towards the upper right!";

  this.create = function(oldMan, game) {
    // Sets the size of the enemy physics body.
    oldMan.body.setSize(24, 43, 0, 0);

    oldMan.body.allowGravity = false;

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

// Dude man
function Dude() {
  
  this.QUEST_LINE_1 = "Hey, nice job defeating that guy. Let me tell you a secret.\nI have a blaster that is a lot stronger than that old geezers.\nTrade me that key and I'll give it to you...";

  this.DENY_QUEST_1 = "Fine.\n\nGood luck storming the castle with that puny little blaster...";

  this.ACCEPT_QUEST_1 = "Thanks kid. This thing has some real kick...\nGo ahead and give it a try with X.";

  this.CASTLE_SPEECH_1 = "So it's you again. I see\nyou've become quite the little deviant...\nDon't worry about the princess I have her out back...";

  this.CASTLE_SPEECH_2 = "Why don't you meet my friend...\n\nHe has something exciting for you, ha ha ha...";

  this.create = function(dude, game) {
    // Sets the size of the enemy physics body.
    dude.body.setSize(32, 32, 0, 0);

    dude.body.allowGravity = false;

    // The oldMan should collide with the bounds of the world
    dude.body.collideWorldBounds = true;
      
    // Animations are built from spritesheet, numbers in the array indicate the index of the image on the sheet
    dude.animations.add('idle', [0], 20, false);
  };
};