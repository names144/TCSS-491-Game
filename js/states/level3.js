/*
* Level 3
*/

var Level3 = function(game) {};

Level3.prototype = {

  gameEnd: false,
  isBossReady: false,
  inDialog: false,
  beatBoss: false,

  showBossHealth: false,

  player: null,   // The Player of the game
  sword: null,
  princess: null,

  oldMan: null,

  healthBar: null,
  bossHealth: null,
  healthText: null,
  healthTextBoss: null,

  // Ground bunnies
  groundBunnies: [],
  groundBunnyLocations: [],

  archers: [],
  archerLocations: [],

  // Bats lvl 1
  bats1: [],
  batsLoc1: [],

  // Mini boss
  boss: null,

  // items
  items: [],
  sword: null,

  map: null,      // The game world map
  bg: null,       // The background image of the game
  layer: null,    // The layer that holds the tilemap

  bgMusic: null,

  create: function() {

    // Start the physics engine for the game
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Sets the gravity for the physics engine.
    this.game.physics.arcade.gravity.y = GRAVITY;

    // Color the background
    var clouds = this.game.add.tileSprite(this.game.camera.x, this.game.camera.y, 600, 800, 'nightClouds');
    clouds.autoScroll(-5, 0);
    clouds.fixedToCamera = true;

    // Add the tilemap created with tiled to the map
    this.map = this.game.add.tilemap('tilemap3');

    // Adds the actual tilesheet to the map so the game can render it
    this.map.addTilesetImage('map1');

    // Set which tiles to collide on. Number in array corresponds to the tile on the sheet
    this.map.setCollision([1,2,3,4,5,17,18,19,20,21,33,34,35]);

    // This is the layer from tiled. It needs to be the same name as the JSON from tiled
    this.layer = this.map.createLayer('Tile Layer 1');

    // Resizes the world for the layer
    this.layer.resizeWorld();

    // Create the player and position in the world with given name 81 3040
    this.player = this.game.add.sprite(81, 3040, 'player');

    var playerStats = {
      hasGun_1: this.game.player.hasGun_1,
      hasGun_2: this.game.player.hasGun_2,
      hasKey: this.game.player.hasKey,
      hasArmour: this.game.player.hasArmour,
      hasDoubleJump: this.game.player.hasDoubleJump
    };

    this.game.player = new Player();

    this.player.attributes = this.game.player;

    this.sword = this.game.add.sprite(81, 3040, 'sword');
    this.sword.visible = false;
    this.sword.attributes = new Sword();
    this.game.sword = this.sword;

    this.game.player.sword = this.game.sword;

    // Prepare the bunny locations
    this.groundBunnyLocations[0] = {x: 680, y: 3152};
    this.groundBunnyLocations[1] = {x: 1355, y: 3125};
    this.groundBunnyLocations[2] = {x: 1785, y: 2896};
    this.groundBunnyLocations[3] = {x: 1640, y: 2288};
    this.groundBunnyLocations[4] = {x: 583, y: 2288};
    this.groundBunnyLocations[5] = {x: 1142, y: 1136};

    // Bat locations
    this.batsLoc1[0] = {x: 850, y: 2665};
    this.batsLoc1[1] = {x: 900, y: 2020};
    this.batsLoc1[2] = {x: 1300, y: 1000};

    // Archer locations
    this.archerLocations[0] = {x: 330, y: 3056};
    this.archerLocations[1] = {x: 2057, y: 2832};
    this.archerLocations[2] = {x: 1920, y: 2512};
    this.archerLocations[3] = {x: 63, y: 1520};
    this.archerLocations[4] = {x: 1987, y: 1200};

    // Create the archers and position
    for (var i = 0; i < this.archerLocations.length; i++) {
      this.archers[i] = this.game.add.sprite(this.archerLocations[i].x, this.archerLocations[i].y, 'archer');
      this.game.physics.enable(this.archers[i], Phaser.Physics.ARCADE);
      this.archers[i].attributes = new Archer();
      this.archers[i].attributes.create(this.archers[i], this.game);
    }

    // Create the ground bunnies and position them
    for (var i = 0; i < this.groundBunnyLocations.length; i++) {
      this.groundBunnies[i] = this.game.add.sprite(this.groundBunnyLocations[i].x, this.groundBunnyLocations[i].y, 'evilGroundBunny');
      this.game.physics.enable(this.groundBunnies[i], Phaser.Physics.ARCADE);
      this.groundBunnies[i].attributes = new GroundEnemy();
      this.groundBunnies[i].attributes.create(this.groundBunnies[i], this.game, 'bunny');
    }

    // Create bats and position
    for (var i = 0; i < this.batsLoc1.length; i++) {
      this.bats1[i] = this.game.add.sprite(this.batsLoc1[i].x, this.batsLoc1[i].y, 'bat');
      this.game.physics.enable(this.bats1[i], Phaser.Physics.ARCADE);
      this.bats1[i].attributes = new Bat();
      this.bats1[i].attributes.create(this.bats1[i], this.game);
    }
    
    // Enable physics on the player and sword
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.sword, Phaser.Physics.ARCADE);

    this.sword.attributes.create(this.sword, this.game);

    // Creates the player
    this.player.attributes.create(this.player, this.game, playerStats);

    // Set up npcs
    this.dude = this.game.add.sprite(2747, 1808, 'dude');
    this.dude.anchor.setTo(0.5,0.5);
    this.dude.scale.x *= -1;
    this.dude.visible = false;

    this.oldMan = this.game.add.sprite(2747, 1808, 'oldMan');
    this.oldMan.visible = false;

    this.game.camera.follow(this.player);

    this.boss = this.game.add.sprite(3080, 1600, 'boss');
    this.game.physics.enable(this.boss, Phaser.Physics.ARCADE);
    this.boss.attributes = new Boss();
    this.boss.attributes.create(this.boss, this.game);

    this.princess = this.game.add.sprite(0,0,'princess');
    this.princess.visible = false;

    // Items
    this.game.items = this.items;

    // Putting two apples at end for easier play through
    var apple1 = this.game.add.sprite(2490, 1710, 'apple');
    apple1.attributes = new Item();
    this.game.physics.enable(apple1, Phaser.Physics.ARCADE);
    apple1.attributes.create(apple1, this.game, 'apple');
    this.game.items.push(apple1);
    var apple2 = this.game.add.sprite(2942, 1710, 'apple');
    apple2.attributes = new Item();
    this.game.physics.enable(apple2, Phaser.Physics.ARCADE);
    apple1.attributes.create(apple2, this.game, 'apple');
    this.game.items.push(apple2);

    // Music
    this.game.sound.removeByKey('titleMusic');
    this.bgMusic = this.game.add.audio('level3Music', 0.8, true);
    this.bgMusic.play();

    // The healthbar fixed to the camera
    this.healthBar = this.game.add.sprite(390, 32, 'healthBar');
    this.healthBar.fixedToCamera = true;
    this.healthBar.cropEnabled = true;
    this.healthBar.cropRect = new Phaser.Rectangle(0, 0, this.healthBar.width, this.healthBar.height);
    this.healthBar.startWidth = this.healthBar.width + 0;
    this.healthText = this.game.add.text(300, 36, "HEALTH: ", { font: "20px Arial", fill: "#f26c4f", align: "center" });
    this.healthText.fixedToCamera = true;

    // The boss health
    this.bossHealth = this.game.add.sprite(78, 32, 'healthBarBoss');
    this.bossHealth.fixedToCamera = true;
    this.bossHealth.cropEnabled = true;
    this.bossHealth.cropRect = new Phaser.Rectangle(0, 0, this.bossHealth.width, this.bossHealth.height);
    this.bossHealth.startWidth = this.bossHealth.width + 0;
    this.bossHealth.visible = false;
  },

  // Helper functions
  endGame: function() {
    this.gameEnd = true;
  },

  checkForWin: function() {
    if (this.player.attributes.won) {
      // we won
      this.bgMusic.stop();
      // Change state
      this.game.sound.stopAll();
      this.player.body = null;
      this.game.state.clearCurrentState();
      this.game.time.events.add(Phaser.Timer.SECOND+2, function(){this.game.state.start('GameWin');}, this);     
    }
  },

  checkForDead: function() {
    if (!this.player.attributes.alive) {
      this.bgMusic.stop();
      this.game.sound.stopAll();
      this.player.body = null;
      this.game.time.events.add(Phaser.Timer.SECOND+2, function(){this.game.state.start('GameOver');}, this);
    }
  },

  updateBossHealth: function() {
    var w = (this.boss.attributes.health / this.boss.attributes.MAX_HEALTH) * this.bossHealth.startWidth;
    if (this.boss.attributes.wasAttacked) {
      this.bossHealth.crop(new Phaser.Rectangle(0, 0, w, this.bossHealth.height));
      this.bossHealth.updateCrop();
      this.boss.attributes.wasAttacked = false;
      if (!this.boss.attributes.alive) {
        this.bossHealth.kill();
        this.healthTextBoss.destroy();
        this.showBossHealth = false;
      }
    }
  },

  finalDialog: function() {

    var t = "You've made it quite far young one.\nToo bad it ends here. I have the princess in my ship.\nBut before I go, I'll show you a real battle...";

    this.paused = true;
    this.player.attributes.paused = true;
    this.player.animations.stop();
    this.player.body.velocity.x = 0;
    this.smoke = this.game.add.sprite(2727, 1790, 'smoke');
    this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
    this.smoke.animations.play('fire');
    this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function() {
      this.smoke.destroy();
      this.dude.visible = true;
      this.dude.position.x = 2747;
      this.dude.position.y = 1808;
      this.dialogBox = this.game.add.image(this.game.camera.x + 80, this.game.camera.y + 100, 'dialog');
      this.dialogBox.width = 410;
      this.dialogBox.height = 150;
      var style = { font: "14px Arial", fill: "#000", align: "left" };
      this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, t, style);
      this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 230, "okBtn", function() {
        this.text.destroy();
        this.okButton.destroy();
        this.dialogBox.destroy();
        this.smoke = this.game.add.sprite(2727, 1790, 'smoke');
        this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
        this.smoke.animations.play('fire');
        this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function() {
          this.smoke.destroy();
          this.dude.visible = false;
          this.paused = false;
          this.player.attributes.paused = false;
          this.isBossReady = true;
        }, this)
      }, this)
    }, this)
  },

  gameWinDialog: function() {

    var t1 = "Wow I can't believe it! You are a hero!\nHere comes the princess!";
    var t2 = "Thanks for saving me!\nI thought I would never see my home again.\n\nLet's have a pizza party!!!"

    this.paused = true;
    this.player.attributes.paused = true;
    this.player.animations.stop();
    this.player.body.velocity.x = 0;
    this.player.position.x = 2650;
    this.player.position.y = 1808;
    this.smoke = this.game.add.sprite(2727, 1790, 'smoke');
    this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
    this.smoke.animations.play('fire');
    this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function() {
      this.smoke.destroy();
      this.oldMan.visible = true;
      this.oldMan.position.x = 2747;
      this.oldMan.position.y = 1780;
      this.dialogBox = this.game.add.image(this.game.camera.x + 80, this.game.camera.y + 100, 'dialog');
      this.dialogBox.width = 410;
      this.dialogBox.height = 150;
      var style = { font: "14px Arial", fill: "#000", align: "left" };
      this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, t1, style);
      this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 230, "okBtn", function() {
        this.text.destroy();
        this.okButton.destroy();
        this.dialogBox.destroy();
        this.princess.position.x = 2575;
        this.princess.position.y = 1400;
        this.princess.visible = true;
        this.game.add.tween(this.princess).to( { x: 2575, y: this.player.position.y - 20}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false)
        .onComplete.addOnce(function(){
          this.dialogBox = this.game.add.image(this.game.camera.x + 80, this.game.camera.y + 100, 'dialog');
          this.dialogBox.width = 410;
          this.dialogBox.height = 150;
          var style = { font: "14px Arial", fill: "#000", align: "left" };
          this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, t2, style);
          this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 230, "okBtn", function() {
            this.text.destroy();
            this.okButton.destroy();
            this.dialogBox.destroy();
            this.player.attributes.won = true;
            this.checkForWin();
          }, this);
        }, this); 
      }, this);
    }, this);
  },

  update: function() {

    if (this.player.position.x > 2250 && this.player.position.y <= 1850) {
      this.game.camera.reset();
      this.game.camera.focusOnXY(this.player.position.x, this.player.position.y - CAMERA_OFFSET_Y);
    }

    if (this.player.position.x > 2650 && this.player.position.y <= 1850 && !this.inDialog) {
      this.finalDialog();
      this.inDialog = true;
    }

    if (!this.boss.alive && !this.beatBoss) {
      this.gameWinDialog();
      this.beatBoss = true;
    }

    // Tell the physics engine to collide between the player and our layer for the world
    this.game.physics.arcade.collide(this.player, this.layer);

    this.game.physics.arcade.collide(this.oldMan, this.layer);

    // Collision with items
    for (var i = 0; i < this.items.length; i++) {
      this.game.physics.arcade.collide(this.items[i], this.layer);
      this.game.physics.arcade.collide(this.player, this.items[i], this.items[i].attributes.collide);
    }

    // Tell the physics engine to collide between the boss and our layer for the world
    this.game.physics.arcade.collide(this.boss, this.layer);

    // Collision with the players and the bunnies
    this.game.physics.arcade.collide(this.player, this.groundBunnies, this.player.attributes.collide);

    // collision player and archers
    this.game.physics.arcade.collide(this.player, this.archers, this.player.attributes.collide);

    // collision player and bats
    this.game.physics.arcade.collide(this.player, this.bats1, this.player.attributes.collide);

    // Collision with the players and mini boss
    this.game.physics.arcade.overlap(this.player, this.boss, this.player.attributes.collide);

    // Collision player and old man
    this.game.physics.arcade.collide(this.oldMan, this.player, this.oldManQuest);

    // Set the collision for the archers and the world
    this.game.physics.arcade.collide(this.archers, this.layer);

    // Set the collision for the bunnies and the world
    this.game.physics.arcade.collide(this.groundBunnies, this.layer);

    // collision of bats
    this.game.physics.arcade.collide(this.bats1, this.layer);

    if (!this.paused) {
      // Updates for the player
      if (this.player.attributes.alive && !this.player.attributes.won) {
        this.player.attributes.update(this.player, this.game);
      }

      // Update the sword
      this.sword.attributes.update(this.sword, this.game, this.player);

      // Update healthbar
      var w = (this.player.attributes.health / this.player.attributes.MAX_HEALTH) * this.healthBar.startWidth;
      if (this.player.attributes.wasAttacked || this.player.attributes.gainedHealth) {
        this.healthBar.crop(new Phaser.Rectangle(0, 0, w, this.healthBar.height));
        this.healthBar.updateCrop();
        if (this.player.attributes.wasAttacked) {
          this.player.attributes.wasAttacked = false;
        } else {
          this.player.attributes.gainedHealth = false;
        }        
      }

      // Update archers
      for (var i = 0; i < this.archers.length; i++) {
        if (this.archers[i].alive) {
          this.archers[i].attributes.update(this.archers[i], this.game, this.player);
        }
      }

      // Update for the arrows
      for (var i = 0; i < this.archers.length; i++) {
        for (var j = 0; j < this.archers[i].attributes.arrows.length; j++) {
          if (this.archers[i].alive && this.archers[i].attributes.arrows[j] !== null && this.archers[i].attributes.arrows[j].attributes !== null) {
            // Collision bullets with map layer
            this.game.physics.arcade.collide(this.archers[i].attributes.arrows[j], this.layer, this.archers[i].attributes.arrows[j].attributes.collide);

            // Collision bullets with bunnies
            this.game.physics.arcade.collide(this.archers[i].attributes.arrows[j], this.player, this.archers[i].attributes.arrows[j].attributes.collide);
            
            // Update
            this.archers[i].attributes.arrows[j].attributes.update(this.archers[i].attributes.arrows[j], this.game);
          }
        }
      }

      // Updates for the bullets from player
      for (var i = 0; i < this.player.attributes.bullets.length; i++) {
        if (this.player.attributes.bullets[i] !== null && this.player.attributes.bullets[i].attributes !== null) {
          // Collision bullets with map layer
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.layer, this.player.attributes.bullets[i].attributes.collide);

          // Collision bullets with bunnies
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.groundBunnies, this.player.attributes.bullets[i].attributes.collide);

          // collision bats1
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.bats1, this.player.attributes.bullets[i].attributes.collide);

          // collision archers
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.archers, this.player.attributes.bullets[i].attributes.collide);

          // Collision bullets with mini boss
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.boss, this.player.attributes.bullets[i].attributes.collide);
          
          // Update
          this.player.attributes.bullets[i].attributes.update(this.player.attributes.bullets[i], this.game);
        }
      }

      // Updates for the bombs from boss
      for (var i = 0; i < this.boss.attributes.bombs.length; i++) {
        if (this.boss.attributes.bombs[i] !== null && this.boss.attributes.bombs[i].attributes !== null) {
          // Collision bullets with map layer
          this.game.physics.arcade.collide(this.boss.attributes.bombs[i], this.layer, this.boss.attributes.bombs[i].attributes.collide);

          // Collision bullets with bunnies
          this.game.physics.arcade.collide(this.boss.attributes.bombs[i], this.player, this.boss.attributes.bombs[i].attributes.collide);
        }
      }

      // Collision of the sword with the enemies
      this.game.physics.arcade.overlap(this.sword, this.groundBunnies, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.bats1, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.archers, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.boss, this.sword.attributes.collide);

      // Updates for the ground bunnies
      for (var i = 0; i < this.groundBunnies.length; i++) {
        this.groundBunnies[i].attributes.update(this.groundBunnies[i], this.game, this.player);
      }

      // update the boss
      if (this.isBossReady && this.boss.alive) {
        this.boss.attributes.update(this.boss, this.game, this.player);
      }

      if (this.player.position.x > 2250 && this.player.position.y <= 1850) {
        if (!this.healthTextBoss) {
          this.healthTextBoss = this.game.add.text(10, 36, "BOSS: ", { font: "20px Arial", fill: "#003FB9", align: "center" });
          this.healthTextBoss.fixedToCamera = true;
          this.showBossHealth = true;
          this.bossHealth.visible = true;
        }
      }

      if (this.showBossHealth) {
        this.updateBossHealth();
      }
      
      if (!this.gameEnd) {
        // Check if won the game
        this.checkForWin();

        // Check if dead
        this.checkForDead();
      }
    }
  },

  render: function() {
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //this.game.debug.spriteCoords(this.player, 32, 300);
  }
};