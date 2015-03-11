/*
* Level 1
*/
var Level1 = function(game) {};

Level1.prototype = {

  // Constants and Variables
  gameEnd: false,
  paused: false,
  canEnterCastle: false,

  showBossHealth: false,

  player: null,   // The Player of the game
  sword: null,

  oldMan: null,
  dude: null,
  smoke: null,

  healthBar: null,
  miniBoss1Health: null,
  healthText: null,
  healthTextBoss: null,

  // Ground bunnies
  groundBunnies: [],
  groundBunnyLocations: [],

  // Bats lvl 1
  bats1: [],
  batsLoc1: [],

  // Mini boss
  miniBoss1: null,

  // items
  items: [],
  sword: null,

  dialogBox: null,
  text: null,
  okButton: null,
  noButton: null,

  map: null,      // The game world map
  layer: null,    // The layer that holds the tilemap

  bgMusic: null,

  create: function() {

    // Start the physics engine for the game
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Sets the gravity for the physics engine.
    this.game.physics.arcade.gravity.y = GRAVITY;

    var clouds = this.game.add.tileSprite(this.game.camera.x, this.game.camera.y, 600, 800, 'clouds');
    clouds.autoScroll(-5, 0);
    clouds.fixedToCamera = true;

    // Add the tilemap created with tiled to the map
    this.map = this.game.add.tilemap('tilemap1');

    // Adds the actual tilesheet to the map so the game can render it
    this.map.addTilesetImage('map1');

    // Set which tiles to collide on. Number in array corresponds to the tile on the sheet
    this.map.setCollision([1,2,3,4,5,17,18,19,20,21,33,34,35,210,225,289,290]);

    // This is the layer from tiled. It needs to be the same name as the JSON from tiled
    this.layer = this.map.createLayer('Tile Layer 1');

    // Resizes the world for the layer
    this.layer.resizeWorld();

    // Prepare the bunny locations
    this.groundBunnyLocations[0] = {x: 515, y: 656};
    this.groundBunnyLocations[1] = {x: 987, y: 624};
    this.groundBunnyLocations[2] = {x: 1432, y: 464};
    this.groundBunnyLocations[3] = {x: 1772, y: 368};
    this.groundBunnyLocations[4] = {x: 2482, y: 656};
    this.groundBunnyLocations[5] = {x: 3338, y: 656};
    this.groundBunnyLocations[6] = {x: 3900, y: 752};
    this.groundBunnyLocations[7] = {x: 4500, y: 752};
    this.groundBunnyLocations[8] = {x: 3960, y: 560};
    this.groundBunnyLocations[9] = {x: 5000, y: 752};

    // Bat locations
    this.batsLoc1[0] = {x: 64, y: 500};
    this.batsLoc1[1] = {x: 1775, y: 310};
    this.batsLoc1[2] = {x: 4400, y: 240};
    this.batsLoc1[3] = {x: 5000, y: 400};
    this.batsLoc1[4] = {x: 6200, y: 530};

    // Create the ground bunnies and position them
    for (var i = 0; i < 10; i++) {
      this.groundBunnies[i] = this.game.add.sprite(this.groundBunnyLocations[i].x, this.groundBunnyLocations[i].y, 'evilGroundBunny');
      this.game.physics.enable(this.groundBunnies[i], Phaser.Physics.ARCADE);
      this.groundBunnies[i].attributes = new GroundEnemy();
      this.groundBunnies[i].attributes.create(this.groundBunnies[i], this.game, 'bunny');
    }

    // Create bats and position
    for (var i = 0; i < 5; i++) {
      this.bats1[i] = this.game.add.sprite(this.batsLoc1[i].x, this.batsLoc1[i].y, 'bat');
      this.game.physics.enable(this.bats1[i], Phaser.Physics.ARCADE);
      this.bats1[i].attributes = new Bat();
      this.bats1[i].attributes.create(this.bats1[i], this.game);
    }
    
    // Mini boss
    this.miniBoss1 = this.game.add.sprite(6200, 720, 'miniBoss1');

    this.miniBoss1.attributes = new MiniBoss();

    this.game.physics.enable(this.miniBoss1, Phaser.Physics.ARCADE);

    this.miniBoss1.attributes.create(this.miniBoss1, this.game);

    // Set up npcs
    this.oldMan = this.game.add.sprite(88, 725, 'oldMan');

    this.game.physics.enable(this.oldMan, Phaser.Physics.ARCADE);
    this.oldMan.attributes = new OldMan();
    this.oldMan.attributes.create(this.oldMan, this.game);

    // The dude
    this.dude = this.game.add.sprite(0, 0, 'dude');
    this.dude.visible = false;
    this.game.physics.enable(this.dude, Phaser.Physics.ARCADE);
    this.dude.attributes = new Dude();
    this.dude.attributes.create(this.dude, this.game);

    // Create the player and position in the world with given name 48
    this.player = this.game.add.sprite(48, 752, 'player');

    var playerStats = {
      hasGun_1: false,
      hasGun_2: false,
      hasKey: false,
      hasArmour: false,
      hasDoubleJump: false
    };

    this.game.player = new Player();

    this.player.attributes = this.game.player;

    this.sword = this.game.add.sprite(48, 752, 'sword');
    this.sword.visible = false;
    this.sword.attributes = new Sword();
    this.game.sword = this.sword.attributes;

    // Enable physics on the player and sword
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.sword, Phaser.Physics.ARCADE);

    this.sword.attributes.create(this.sword, this.game);

    // Creates the player
    this.player.attributes.create(this.player, this.game, playerStats);

    // Set the camera to follow the player
    this.game.camera.follow(this.player);

    // Items
    this.game.items = this.items;
    
    // Music
    this.game.sound.removeByKey('titleMusic');
    this.bgMusic = this.game.add.audio('bgMusic', 1, true);
    this.bgMusic.play();

    // Putting two apples at end for easier play through
    var apple1 = this.game.add.sprite(5600, 500, 'apple');
    apple1.attributes = new Item();
    this.game.physics.enable(apple1, Phaser.Physics.ARCADE);
    apple1.attributes.create(apple1, this.game, 'apple');
    this.game.items.push(apple1);
    var apple2 = this.game.add.sprite(5400, 500, 'apple');
    apple2.attributes = new Item();
    this.game.physics.enable(apple2, Phaser.Physics.ARCADE);
    apple1.attributes.create(apple2, this.game, 'apple');
    this.game.items.push(apple2);

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

    // Setup initial dialog
    this.dialogBox = this.game.add.image(40, 500, 'dialog');
    this.dialogBox.width = 400;
    this.dialogBox.height = 150;
    var style = { font: "14px Arial", fill: "#000", align: "left" };
    this.text = this.game.add.text(70, 520, this.oldMan.attributes.QUEST_LINE_1, style);

    this.okButton = this.game.add.button(320, 610, "okBtn", this.ok, this);

    this.paused = true;
  },

  ok: function() {
    this.dialogBox.destroy();
    this.text.destroy();
    this.okButton.destroy();
    this.paused = false;
    this.player.attributes.sword = this.sword;
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

  oldManQuest1: function(oldMan, player) {
    var game = oldMan.game;
    game.time.events.add(Phaser.Timer.SECOND * 8, function(text){text.destroy();dialogBox.destroy();}, this, t);
    game.player.sword = game.sword;
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

  finalDialogs: function() {
    // Remove the key
    for (var i = 0; i < this.player.attributes.items.length; i++) {
      if (this.player.attributes.items[i] === 'key') {
        this.player.attributes.items.splice(i, 1);
      }
    }

    this.sword.animations.stop();
    this.sword.visible = false;

    this.dude.visible = true;
    this.smoke = this.game.add.sprite(this.player.position.x - 50, this.player.position.y - 20, 'smoke');
    this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
    this.smoke.animations.play('fire');
    this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function(){
      this.smoke.destroy();
      // put the dude in
      this.dude.position.y = this.player.position.y - 20;
      this.dude.position.x = this.player.position.x - 50;
      this.dialogBox = this.game.add.image(this.game.camera.x + 100, this.game.camera.y + 100, 'dialog');
      this.dialogBox.width = 410;
      this.dialogBox.height = 150;
      // Dude dialog
      var style = { font: "14px Arial", fill: "#000", align: "left" };
      this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.dude.attributes.QUEST_LINE_1, style);

      // Giving key to dude
      this.okButton = this.game.add.button(this.game.camera.x + 250, this.game.camera.y + 220, "okBtn", function() {
        this.text.destroy();
        this.noButton.destroy();
        this.okButton.destroy();
        var style = { font: "14px Arial", fill: "#000", align: "left" };
        this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.dude.attributes.ACCEPT_QUEST_1, style);

        this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
          this.smoke = this.game.add.sprite(this.player.position.x - 50, this.player.position.y - 20, 'smoke');
          this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
          this.smoke.animations.play('fire');
          this.dude.visible = false;
          this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function() {
            this.smoke.destroy();
            this.dude.destroy();
            this.text.destroy();
            this.noButton.destroy();
            this.okButton.destroy();
            this.player.attributes.hasKey = false;
            this.player.attributes.hasGun_1 = false;
            this.player.attributes.hasGun_2 = true;
            this.oldMan.position.y = this.player.position.y - 25;
            this.oldMan.position.x = this.player.position.x - 50;

            // Old man
            var style = { font: "14px Arial", fill: "#000", align: "left" };
            this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.oldMan.attributes.DENY_QUEST_1, style);
            this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
              this.smoke.destroy();
              this.dude.destroy();
              this.text.destroy();
              this.noButton.destroy();
              this.okButton.destroy();
              this.dialogBox.destroy();
              this.canEnterCastle = true;
              // Animate player walking into the castle
              this.player.animations.play('walk');
              if (this.player.attributes.playerFacingLeft) {
                this.player.scale.x *= -1;
              }
              this.player.body.velocity.x = this.player.attributes.PLAYER_SPEED;
            }, this);
          }, this);
        }, this);
      }, this);

      // Giving key to old man
      this.noButton = this.game.add.button(this.game.camera.x + 310, this.game.camera.y + 220, "noBtn", function() {
        this.text.destroy();
        this.noButton.destroy();
        this.okButton.destroy();
        var style = { font: "14px Arial", fill: "#000", align: "left" };
        this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.dude.attributes.DENY_QUEST_1, style);

        this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
          this.smoke = this.game.add.sprite(this.player.position.x - 50, this.player.position.y - 20, 'smoke');
          this.smoke.animations.add('fire', [0,1,2,3,4], 10, false);
          this.smoke.animations.play('fire');
          this.dude.visible = false;
          this.game.time.events.add(Phaser.Timer.SECOND * 0.8, function() {
            this.smoke.destroy();
            this.dude.destroy();
            this.text.destroy();
            this.noButton.destroy();
            this.okButton.destroy();
            this.player.attributes.hasKey = true;
            this.player.attributes.hasGun_1 = true;
            this.player.attributes.hasGun_2 = false;
            this.oldMan.position.y = this.player.position.y - 25;
            this.oldMan.position.x = this.player.position.x - 50;

            // Old man
            var style = { font: "14px Arial", fill: "#000", align: "left" };
            this.text = this.game.add.text(this.game.camera.x + 120, this.game.camera.y + 120, this.oldMan.attributes.ACCEPT_QUEST_1, style);
            this.okButton = this.game.add.button(this.game.camera.x + 270, this.game.camera.y + 220, "okBtn", function() {
              this.smoke.destroy();
              this.dude.destroy();
              this.text.destroy();
              this.noButton.destroy();
              this.okButton.destroy();
              this.dialogBox.destroy();
              this.canEnterCastle = true;
              // Animate player walking into the castle
              this.player.animations.play('walk');
              if (this.player.attributes.playerFacingLeft) {
                this.player.scale.x *= -1;
              }
              this.player.body.velocity.x = this.player.attributes.PLAYER_SPEED;
            }, this);
          }, this);
        }, this);
      }, this);
    }, this);
  },

  checkForCastleEnter: function() {
    if (this.player.position.x >= 6320 && this.canEnterCastle) {
      this.game.player.hasKey = this.player.attributes.hasKey;
      this.game.player.hasGun_1 = this.player.attributes.hasGun_1;
      this.game.player.hasGun_2 = this.player.attributes.hasGun_2;
      this.game.player.hasArmour = this.player.attributes.hasArmour;
      this.game.player.hasDoubleJump = this.player.attributes.hasDoubleJump;
      this.bgMusic.stop();
      this.game.state.clearCurrentState();
      this.game.state.start('Level2');
    }
  },

  update: function() {

    // Check all collisions with layer
    this.game.physics.arcade.collide(this.player, this.layer);

    this.game.physics.arcade.collide(this.oldMan, this.layer);

    this.game.physics.arcade.collide(this.dude, this.layer);

    // Set the collision for the bunnies and the world
    this.game.physics.arcade.collide(this.groundBunnies, this.layer);

    this.game.physics.arcade.collide(this.player, this.oldMan);

    // collision of bats
    this.game.physics.arcade.collide(this.bats1, this.layer);

    // Tell the physics engine to collide between the miniboss and our layer for the world
    this.game.physics.arcade.collide(this.miniBoss1, this.layer);

    // Collision with items
    for (var i = 0; i < this.items.length; i++) {
      this.game.physics.arcade.collide(this.items[i], this.layer);
      this.game.physics.arcade.collide(this.player, this.items[i], this.items[i].attributes.collide);
    }

    if (!this.paused) {
      // Check for key
      for (var i = 0; i < this.player.attributes.items.length; i++) {
        if (this.player.attributes.items[i] === 'key') {
          this.paused = true;
          this.player.attributes.paused = true;

          // Do the final dialog scenes
          this.finalDialogs();
        }
      }

      // Collision with the players and the bunnies
      this.game.physics.arcade.collide(this.player, this.groundBunnies, this.player.attributes.collide);

      // collision player and bats
      this.game.physics.arcade.overlap(this.player, this.bats1, this.player.attributes.collide);

      // Collision with the players and mini boss
      this.game.physics.arcade.collide(this.player, this.miniBoss1, this.player.attributes.collide);

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

      // Update mini boss 1 healthbar
      if (this.player.body && this.player.body.x >= 4752) {
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

      // Updates for the bullets from player
      for (var i = 0; i < this.player.attributes.bullets.length; i++) {
        if (this.player.attributes.bullets[i] !== null && this.player.attributes.bullets[i].attributes !== null) {
          // Collision bullets with map layer
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.layer, this.player.attributes.bullets[i].attributes.collide);

          // Collision bullets with bunnies
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.groundBunnies, this.player.attributes.bullets[i].attributes.collide);

          // collision bats1
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.bats1, this.player.attributes.bullets[i].attributes.collide);

          // Collision bullets with mini boss
          this.game.physics.arcade.collide(this.player.attributes.bullets[i], this.miniBoss1, this.player.attributes.bullets[i].attributes.collide);
          
          // Update
          this.player.attributes.bullets[i].attributes.update(this.player.attributes.bullets[i], this.game);
        }
      }

      // Collision of the sword with the enemies
      this.game.physics.arcade.overlap(this.sword, this.groundBunnies, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.bats1, this.sword.attributes.collide);
      this.game.physics.arcade.overlap(this.sword, this.miniBoss1, this.sword.attributes.collide);

      // Updates for the ground bunnies
      for (var i = 0; i < 10; i++) {
        if (this.groundBunnies[i].alive) {
          this.groundBunnies[i].attributes.update(this.groundBunnies[i], this.game, this.player);
        }
      }

      // Update for the mini boss
      this.miniBoss1.attributes.update(this.miniBoss1, this.game, this.player);

      if (!this.gameEnd) {
        // Check if dead
        this.checkForDead();
      }
    } else {
      this.checkForCastleEnter();
    }
  },

  render: function() {
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //this.game.debug.spriteCoords(this.player, 32, 300);
  }
};