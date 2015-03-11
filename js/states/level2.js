/*
* Level 2
*/
var Level2 = function(game) {};

Level2.prototype = {

  gameEnd: false,
  paused: false,
  didChestDialog: false,
  didDudeDialog: false,
  startEndDialog: false,
  isInitialLoad: true,

  showBossHealth: false,

  player: null,   // The Player of the game
  sword: null,

  oldMan: null,
  dude: null,
  chest: null,

  healthBar: null,
  miniBoss1Health: null,
  healthText: null,
  healthTextBoss: null,

  // Ground bunnies
  rats: [],
  ratLocations: [],

  archers: [],
  archerLocations: [],

  // Bats lvl 1
  bats1: [],
  batsLoc1: [],

  // Mini boss
  miniBoss1: null,
  smoke: null,

  // items
  items: [],
  sword: null,

  map: null,      // The game world map
  bg: null,       // The background image of the game
  layer: null,    // The layer that holds the tilemap

  dialogBox: null,
  okButton: null,
  noButton: null,
  text: null,
  bgMusic: null,

  create: function() {

    // Start the physics engine for the game
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Sets the gravity for the physics engine.
    this.game.physics.arcade.gravity.y = GRAVITY;

    // Color the background
    this.bg = this.game.add.tileSprite(this.game.camera.x, this.game.camera.y, 600, 800, 'castle_inside');
    this.bg.fixedToCamera = true;

    // Add the tilemap created with tiled to the map
    this.map = this.game.add.tilemap('tilemap2');

    // Adds the actual tilesheet to the map so the game can render it
    this.map.addTilesetImage('Castle2');

    // Set which tiles to collide on. Number in array corresponds to the tile on the sheet
    this.map.setCollisionByExclusion([20]);

    // This is the layer from tiled. It needs to be the same name as the JSON from tiled
    this.layer = this.map.createLayer('Platforms');

    // Resizes the world for the layer
    this.layer.resizeWorld();

    // Create the player and position in the world with given name 18 2032
    this.player = this.game.add.sprite(18, 2032, 'player');

    var playerStats = {
      hasGun_1: this.game.player.hasGun_1,
      hasGun_2: this.game.player.hasGun_2,
      hasKey: this.game.player.hasKey,
      hasArmour: false,
      hasDoubleJump: false
    };

    this.game.player = new Player();

    this.player.attributes = this.game.player;

    this.sword = this.game.add.sprite(18, 2032, 'sword');
    this.sword.visible = false;
    this.sword.attributes = new Sword();
    this.game.sword = this.sword;

    this.game.player.sword = this.game.sword;

    // Prepare the bunny locations
    this.ratLocations[0] = {x: 515, y: 2000};
    this.ratLocations[1] = {x: 1360, y: 2032};
    this.ratLocations[2] = {x: 1600, y: 1680};
    this.ratLocations[3] = {x: 2117, y: 2032};
    this.ratLocations[4] = {x: 2202, y: 1680};
    this.ratLocations[5] = {x: 2973, y: 1808};
    this.ratLocations[6] = {x: 3025, y: 1584};
    this.ratLocations[7] = {x: 3055, y: 1104};
    this.ratLocations[8] = {x: 2357, y: 1328};
    this.ratLocations[9] = {x: 2012, y: 1008};
    this.ratLocations[10] = {x: 1419, y: 976};
    this.ratLocations[11] = {x: 1064, y: 1328};
    this.ratLocations[12] = {x: 378, y: 1328};
    this.ratLocations[13] = {x: 667, y: 976};
    this.ratLocations[14] = {x: 539, y: 464};
    this.ratLocations[15] = {x: 1024, y: 304};
    this.ratLocations[16] = {x: 1556, y: 528};
    this.ratLocations[17] = {x: 2042, y: 400};
    this.ratLocations[18] = {x: 2536, y: 368};

    // Bat locations
    this.batsLoc1[0] = {x: 550, y: 1600};
    this.batsLoc1[1] = {x: 1800, y: 1550};
    this.batsLoc1[2] = {x: 2200, y: 850};
    this.batsLoc1[3] = {x: 523, y: 750};
    this.batsLoc1[4] = {x: 3360, y: 200};

    // Archer locations
    this.archerLocations[0] = {x: 580, y: 1840};
    this.archerLocations[1] = {x: 1787, y: 1872};
    this.archerLocations[2] = {x: 3270, y: 1808};
    this.archerLocations[3] = {x: 3197, y: 1360};
    this.archerLocations[4] = {x: 2558, y: 1072};
    this.archerLocations[5] = {x: 1553, y: 1328};
    this.archerLocations[6] = {x: 1425, y: 976};
    this.archerLocations[7] = {x: 112, y: 1328};
    this.archerLocations[8] = {x: 66, y: 688};
    this.archerLocations[9] = {x: 1797, y: 400};
    this.archerLocations[10] = {x: 2781, y: 240};

    // Create the archers and position
    for (var i = 0; i < this.archerLocations.length; i++) {
      this.archers[i] = this.game.add.sprite(this.archerLocations[i].x, this.archerLocations[i].y, 'archer');
      this.game.physics.enable(this.archers[i], Phaser.Physics.ARCADE);
      this.archers[i].attributes = new Archer();
      this.archers[i].attributes.create(this.archers[i], this.game);
    }

    // Create the ground bunnies and position them
    for (var i = 0; i < this.ratLocations.length; i++) {
      this.rats[i] = this.game.add.sprite(this.ratLocations[i].x, this.ratLocations[i].y, 'rat');
      this.game.physics.enable(this.rats[i], Phaser.Physics.ARCADE);
      this.rats[i].attributes = new GroundEnemy();
      this.rats[i].attributes.create(this.rats[i], this.game, 'rat');
    }

    // Create bats and position
    for (var i = 0; i < this.batsLoc1.length; i++) {
      this.bats1[i] = this.game.add.sprite(this.batsLoc1[i].x, this.batsLoc1[i].y, 'bat');
      this.game.physics.enable(this.bats1[i], Phaser.Physics.ARCADE);
      this.bats1[i].attributes = new Bat();
      this.bats1[i].attributes.create(this.bats1[i], this.game);
    }
    
    // Mini boss
    this.miniBoss1 = this.game.add.sprite(3628, 592, 'miniBoss2');

    this.miniBoss1.attributes = new MiniBoss2();

    this.game.physics.enable(this.miniBoss1, Phaser.Physics.ARCADE);

    this.miniBoss1.attributes.create(this.miniBoss1, this.game, false);

    // Enable physics on the player and sword
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.sword, Phaser.Physics.ARCADE);

    this.sword.attributes.create(this.sword, this.game);

    // Creates the player
    this.player.attributes.create(this.player, this.game, playerStats);

    // Set up npcs
    this.oldMan = this.game.add.sprite(0, 0, 'oldMan');
    
    this.game.physics.enable(this.oldMan, Phaser.Physics.ARCADE);
    this.oldMan.attributes = new OldMan();
    this.oldMan.attributes.create(this.oldMan, this.game);

    this.game.camera.follow(this.player);


    // The dude
    this.dude = this.game.add.sprite(3454, 702, 'dude');
    this.game.physics.enable(this.dude, Phaser.Physics.ARCADE);
    this.dude.attributes = new Dude();
    this.dude.attributes.create(this.dude, this.game);

    // Items
    this.game.items = this.items;

    // Add the chest
    this.chest = this.game.add.sprite(33, 1320, 'chest');
    this.game.physics.enable(this.chest, Phaser.Physics.ARCADE);
    this.chest.body.setSize(27, 26, 0, 0);

    // Music
    this.game.sound.removeByKey('titleMusic');
    this.bgMusic = this.game.add.audio('level2Music', 1, true);
    this.bgMusic.play();


    // The healthbar fixed to the camera
    this.healthBar = this.game.add.sprite(390, 32, 'healthBar');
    this.healthBar.fixedToCamera = true;
    this.healthBar.cropEnabled = true;
    this.healthBar.cropRect = new Phaser.Rectangle(0, 0, this.healthBar.width, this.healthBar.height);
    this.healthBar.startWidth = this.healthBar.width + 0;
    this.healthText = this.game.add.text(300, 36, "HEALTH: ", { font: "20px Arial", fill: "#f26c4f", align: "center" });
    this.healthText.fixedToCamera = true;

    // The mini boss health
    this.miniBoss1Health = this.game.add.sprite(78, 32, 'healthBarBoss');
    this.miniBoss1Health.fixedToCamera = true;
    this.miniBoss1Health.cropEnabled = true;
    this.miniBoss1Health.cropRect = new Phaser.Rectangle(0, 0, this.miniBoss1Health.width, this.miniBoss1Health.height);
    this.miniBoss1Health.startWidth = this.miniBoss1Health.width + 0;
    this.miniBoss1Health.visible = false;

    // pause initially
    this.paused = true;
  },

  initalDialog: function() {
    this.dialogBox = this.game.add.image(50, 1900, 'dialog');
    this.dialogBox.width = 410;
    this.dialogBox.height = 150;
    var style = { font: "14px Arial", fill: "#000", align: "left" };
    this.text = this.game.add.text(110, 1965, "You hear screaming off in the distance...", style);
    
    this.okButton = this.game.add.button(150, 2000, "okBtn", function() {
      this.text.destroy();
      this.okButton.destroy();
      this.dialogBox.destroy();
      this.paused = false;
    }, this);
  },

  // Helper functions
  endGame: function() {
    this.gameEnd = true;
  },

  checkForDead: function() {
    if (!this.player.attributes.alive) {
      this.bgMusic.stop();
      this.game.sound.stopAll();
      this.player.body = null;
      this.game.time.events.add(Phaser.Timer.SECOND+2, function(){this.game.state.start('GameOver');}, this);
    }
  },

  updateMiniBoss1Health: function() {
    var w = (this.miniBoss1.attributes.health / this.miniBoss1.attributes.MAX_HEALTH) * this.miniBoss1Health.startWidth;
    if (this.miniBoss1.attributes.wasAttacked) {
      this.miniBoss1Health.crop(new Phaser.Rectangle(0, 0, w, this.miniBoss1Health.height));
      this.miniBoss1Health.updateCrop();
      this.miniBoss1.attributes.wasAttacked = false;
      if (!this.miniBoss1.attributes.alive) {
        this.miniBoss1Health.kill();
        this.healthTextBoss.destroy();
        this.showBossHealth = false;
      }
    }
  },

  checkSpike: function(player, layer) {
    // Spike is index 19
    if (layer.index === 19) {
      player.attributes.collide(player, {
        attributes:{
          damage: 5,
        }
      });
    }
  },

  checkChest: function() {
    if (!(this.player.position.x < 71 && this.player.position.y <= 1328)) {
      return;
    }

    this.paused = true;
    this.bg.stopScroll();
    var hasKeyText = "You found a chest!\n Looks like the key the old man gave me fits...\n";
    var noKeyText = "You found a chest!\nNow only if you had a key...";
    this.dialogBox = this.game.add.image(this.game.camera.x + 80, this.game.camera.y + 100, 'dialog');
    this.dialogBox.width = 410;
    this.dialogBox.height = 150;
    this.player.animations.stop();
    this.player.body.velocity.x = 0;
    if (this.player.attributes.hasKey) {
      // Give the armour, destroy the chest
      var style = { font: "14px Arial", fill: "#000", align: "left" };
      this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, hasKeyText, style);
      this.game.player.hasKey = false;
      this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
        this.text.destroy();
        this.okButton.destroy();
        // Give the armor
        var style = { font: "14px Arial", fill: "#000", align: "left" };
        this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, "You got Armor!\nThis will reduce damage!", style);
        this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
          this.player.attributes.hasArmour = true;
          this.text.destroy();
          this.okButton.destroy();
          this.dialogBox.destroy();
          this.didChestDialog = true;
          this.paused = false;
          this.oldMan.position.x = 900;
          this.oldMan.position.y = 1300;
        }, this);
      }, this);
    } else {
      var style = { font: "14px Arial", fill: "#000", align: "left" };
      this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, noKeyText, style);
      this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
        this.text.destroy();
        this.okButton.destroy();
        this.dialogBox.destroy();
        this.didChestDialog = true;
        this.paused = false;
        this.oldMan.visible = true;
        this.oldMan.position.x = 900;
        this.oldMan.position.y = 1300;
      }, this)
    }
    this.didChestDialog = true;
  },

  checkOldMan: function() {

    if (!(this.player.position.x > 885 && this.player.position.y >= 1328)) {
      return;
    }
    this.player.attributes.hasDoubleJump = true;
    this.paused = true;
    this.bg.stopScroll();
    this.dialogBox = this.game.add.image(this.game.camera.x + 80, this.game.camera.y + 100, 'dialog');
    this.dialogBox.width = 410;
    this.dialogBox.height = 150;
    this.player.animations.stop();
    this.player.body.velocity.x = 0;
    var style = { font: "14px Arial", fill: "#000", align: "left" };
    this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.oldMan.attributes.GIVE_DOUBLE_JUMP, style);
    this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
      this.text.destroy();
      this.okButton.destroy();
      this.dialogBox.destroy();
      this.paused = false;
    }, this)
  },

  dudeDialog: function() {
    // Dude dialog

    this.paused = true;
    this.player.attributes.paused = true;
    this.player.animations.stop();
    this.player.body.velocity.x = 0;
    this.bg.stopScroll();

    this.dialogBox = this.game.add.image(this.game.camera.x + 80, this.game.camera.y + 100, 'dialog');
    this.dialogBox.width = 410;
    this.dialogBox.height = 150;

    var style = { font: "14px Arial", fill: "#000", align: "left" };
    this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.dude.attributes.CASTLE_SPEECH_1, style);
    this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
      this.text.destroy();
      this.okButton.destroy();
      var style = { font: "14px Arial", fill: "#000", align: "left" };
      this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.dude.attributes.CASTLE_SPEECH_2, style);
      this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
        this.smoke = this.game.add.sprite(this.dude.position.x, this.dude.position.y, 'smoke');
        this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
        this.smoke.animations.play('fire');
        this.dude.visible = false;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function() {
          this.smoke.destroy();
          this.dude.destroy();
          this.text.destroy();
          this.okButton.destroy();
          this.dialogBox.destroy();
          this.paused = false;
          this.player.attributes.paused = false;
          this.didDudeDialog = true;
          this.miniBoss1.attributes.paused = false;
        }, this)
      }, this)
    }, this)
  },

  endDialog: function() {

    this.startEndDialog = true;
    this.paused = true;
    this.player.attributes.paused = true;
    this.player.animations.stop();
    this.player.body.velocity.x = 0;
    this.bg.stopScroll();
    this.smoke = this.game.add.sprite(3300, 690, 'smoke');
      this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
      this.smoke.animations.play('fire');
      this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function() {
        this.smoke.destroy();
        this.oldMan.position.x = 3300;
        this.oldMan.position.y = 690;
        this.dialogBox = this.game.add.image(this.game.camera.x + 80, this.game.camera.y + 100, 'dialog');
        this.dialogBox.width = 410;
        this.dialogBox.height = 150;
        var style = { font: "14px Arial", fill: "#000", align: "left" };
        this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.oldMan.attributes.CASTLE_SPEECH_1, style);
        this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 230, "okBtn", function() {
          this.text.destroy();
          this.okButton.destroy();
          this.dialogBox.destroy();
           this.paused = false;
           this.player.attributes.paused = false;
        }, this)
      }, this)
  },

  update: function() {

    if (this.player.position.x > 2800 && this.player.position.y <= 720) {
      this.game.camera.reset();
      this.game.camera.focusOnXY(this.player.position.x, this.player.position.y - CAMERA_OFFSET_Y);
    }

    if (this.isInitialLoad) {
      this.initalDialog();
      this.isInitialLoad = false;
    }

    // check if player in position for boss fight dialog
    if (this.player.position.x > 3350 && this.player.position.y <= 720 && !this.didDudeDialog) {
      this.dudeDialog();
      this.didDudeDialog = true;
    }
    
    // Tell the physics engine to collide between the player and our layer for the world
    this.game.physics.arcade.collide(this.player, this.layer, this.checkSpike);

    this.game.physics.arcade.collide(this.oldMan, this.layer);

    // Collision with items
    for (var i = 0; i < this.items.length; i++) {
      this.game.physics.arcade.collide(this.items[i], this.layer);
      this.game.physics.arcade.collide(this.player, this.items[i], this.items[i].attributes.collide);
    }

    // Tell the physics engine to collide between the miniboss and our layer for the world
    this.game.physics.arcade.collide(this.miniBoss1, this.layer);

    // Collision with the players and the bunnies
    this.game.physics.arcade.collide(this.player, this.rats, this.player.attributes.collide);

    // collision player and bats
    this.game.physics.arcade.overlap(this.player, this.bats1, this.player.attributes.collide);

    // collision player and archers
    this.game.physics.arcade.collide(this.player, this.archers, this.player.attributes.collide);

    // Collision with the players and mini boss
    this.game.physics.arcade.overlap(this.player, this.miniBoss1, this.player.attributes.collide);

    // Collision player and old man
    this.game.physics.arcade.collide(this.oldMan, this.player, this.oldManQuest);

    // Set the collision for the bunnies and the world
    this.game.physics.arcade.collide(this.rats, this.layer);

    // Set the collision for the archers and the world
    this.game.physics.arcade.collide(this.archers, this.layer);

    // collision of bats
    this.game.physics.arcade.collide(this.bats1, this.layer);

    // collision chest
    this.game.physics.arcade.collide(this.chest, this.layer);

    // collision of chest
    this.game.physics.arcade.collide(this.player, this.chest);

    // Check if need to do chest dialog
    if (!this.didChestDialog) {
      this.checkChest();
    }

    // Check if need to do old man dialog
    if (this.didChestDialog && !this.player.attributes.hasDoubleJump) {
      this.checkOldMan();
    }

    if (!this.paused) {
      // Updates for the player
      if (this.player.attributes.alive && !this.player.attributes.won) {
        this.player.attributes.update(this.player, this.game);
        // Update the scrolling background
        if (!this.player.body.onWall() && this.player.body.velocity.x !== 0) {
          // Scroll the bg
          this.bg.autoScroll(-this.player.body.velocity.x/2, 0);
        } else {
          this.bg.stopScroll();
        }
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

      // Update mini boss 1 healthbar
      if (this.player.body && this.player.body.x >= 2800 && this.player.position.y <= 720) {
        if (!this.healthTextBoss) {
          this.healthTextBoss = this.game.add.text(10, 36, "BOSS: ", { font: "20px Arial", fill: "#003FB9", align: "center" });
          this.healthTextBoss.fixedToCamera = true;
          this.showBossHealth = true;
          this.miniBoss1Health.visible = true;
        }
      }

      if (this.showBossHealth) {
        this.updateMiniBoss1Health();
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

      // Update for the rockets
      for (var j = 0; j < this.miniBoss1.attributes.bullets.length; j++) {
        if (this.miniBoss1.alive && this.miniBoss1.attributes.bullets[j] !== null && this.miniBoss1.attributes.bullets[j].attributes !== null) {
          // Collision bullets with map layer
          //this.game.physics.arcade.collide(this.miniBoss1.attributes.bullets[j], this.layer, this.miniBoss1.attributes.bullets[j].attributes.collide);

          // Collision bullets with player
          this.game.physics.arcade.collide(this.miniBoss1.attributes.bullets[j], this.player, this.miniBoss1.attributes.bullets[j].attributes.collide);
        }
      }

      // Updates for the bullets from player
      for (var i = 0; i < this.player.attributes.bullets.length; i++) {
        if (this.player.attributes.bullets[i] !== null && this.player.attributes.bullets[i].attributes !== null) {
          // Collision bullets with map layer
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.layer, this.player.attributes.bullets[i].attributes.collide);

          // Collision bullets with bunnies
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.rats, this.player.attributes.bullets[i].attributes.collide);

          // collision bats1
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.bats1, this.player.attributes.bullets[i].attributes.collide);

          // collision archers
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.archers, this.player.attributes.bullets[i].attributes.collide);

          // Collision bullets with mini boss
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.miniBoss1, this.player.attributes.bullets[i].attributes.collide);
          
          // Update
          this.player.attributes.bullets[i].attributes.update(this.player.attributes.bullets[i], this.game);
        }
      }

      // Collision of the sword with the enemies
      this.game.physics.arcade.overlap(this.sword, this.rats, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.bats1, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.archers, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.miniBoss1, this.sword.attributes.collide);

      // Updates for the ground bunnies
      for (var i = 0; i < this.rats.length; i++) {
        if (this.rats[i].alive) {
          this.rats[i].attributes.update(this.rats[i], this.game, this.player);
        }
      }

      // Update for the mini boss
      if (this.miniBoss1.alive) {
        this.miniBoss1.attributes.update(this.miniBoss1, this.game, this.player);
      } else {
        if (!this.startEndDialog) {
          this.endDialog();
        }
      }
      
      if (!this.gameEnd) {
        // Check if dead
        this.checkForDead();
      }
    }

    // check if player in position for change state
    if (this.player.position.x > 3980 && this.player.position.y <= 208 && this.startEndDialog) {
      this.bgMusic.stop();
      this.player.attributes.paused = true;
      this.game.player.hasKey = this.player.attributes.hasKey;
      this.game.player.hasGun_1 = this.player.attributes.hasGun_1;
      this.game.player.hasGun_2 = this.player.attributes.hasGun_2;
      this.game.player.hasArmour = this.player.attributes.hasArmour;
      this.game.player.hasDoubleJump = this.player.attributes.hasDoubleJump;
      this.game.state.clearCurrentState();
      this.game.state.start('Level3');
    }
  },

  render: function() {
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //this.game.debug.spriteCoords(this.player, 32, 300);
  }
};