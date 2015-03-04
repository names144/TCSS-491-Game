/*
* Level 1
*/
var Level1 = function(game) {
  console.log('Loading Level 1');
};

Level1.prototype = {

  // Constants and Variables
  GRAVITY: 300,

  gameEnd: false,

  showBossHealth: false,

  player: null,   // The Player of the game
  sword: null,

  oldMan: null,

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

  map: null,      // The game world map
  bg: null,       // The background image of the game
  layer: null,    // The layer that holds the tilemap

  instructions: null,
  bgMusic: null,

  create: function() {

    // Start the physics engine for the game
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Sets the gravity for the physics engine.
    this.game.physics.arcade.gravity.y = this.GRAVITY;

    // Color the background
    var x = 0;
    var y = 0;
    for (var i = 0; i < 11; i++) {
      this.game.add.tileSprite(x, y, 600, 800, 'clouds').autoScroll(-5, 0);
      x += 600;
    }

    // Add the tilemap created with tiled to the map
    this.map = this.game.add.tilemap('tilemap');

    // Adds the actual tilesheet to the map so the game can render it
    this.map.addTilesetImage('map1');

    // Set which tiles to collide on. Number in array corresponds to the tile on the sheet
    this.map.setCollisionByExclusion([30,31,38,39,46,47,56,57,64,65,72,73,82]);

    // This is the layer from tiled. It needs to be the same name as the JSON from tiled
    this.layer = this.map.createLayer('Tile Layer 1');

    // Resizes the world for the layer
    this.layer.resizeWorld();

    // Create the player and position in the world with given name 48
    this.player = this.game.add.sprite(48, 752, 'player');

    this.game.player = new Player();

    this.player.attributes = this.game.player;

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
      this.groundBunnies[i].attributes = new EvilGroundBunny();
      this.groundBunnies[i].attributes.create(this.groundBunnies[i], this.game);
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

    // Enable physics on the player and sword
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    // Creates the player
    this.player.attributes.create(this.player, this.game);

    // Set the camera to follow the player
    this.game.camera.follow(this.player);

    // Set up npcs
    this.oldMan = this.game.add.sprite(88, 712, 'oldMan');

    this.game.physics.enable(this.oldMan, Phaser.Physics.ARCADE);
    this.oldMan.attributes = new OldMan();
    this.oldMan.attributes.create(this.oldMan, this.game);

    // Items
    this.game.items = this.items;
    
    // Instructions to play
    var text = "Move: Arrow Keys  |  Jump: Space  |  Attack: C  |  Shoot: X";
    var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
    this.instructions = this.game.add.text(30, 375, text, style);
    this.instructions.fixedToCamera = true;
    
    // Music
    this.game.sound.removeByKey('titleMusic');
    this.bgMusic = this.game.add.audio('bgMusic', 1, true);
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

  oldManQuest: function(obj) {
    var style = { font: "14px Arial", fill: "#000", align: "center" };
    var t = obj.game.add.text(obj.game.camera.x + 50, obj.game.camera.y + 150, obj.attributes.QUEST_LINE, style);
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

  update: function() {
    // Tell the physics engine to collide between the player and our layer for the world
    this.game.physics.arcade.collide(this.player, this.layer);

    this.game.physics.arcade.collide(this.oldMan, this.layer);

    // Collision with items
    for (var i = 0; i < this.items.length; i++) {
      this.game.physics.arcade.collide(this.items[i], this.layer);
      this.game.physics.arcade.collide(this.player, this.items[i], this.items[i].attributes.collide);
    }

    // Tell the physics engine to collide between the miniboss and our layer for the world
    this.game.physics.arcade.collide(this.miniBoss1, this.layer);

    // Collision with the players and the bunnies
    this.game.physics.arcade.collide(this.player, this.groundBunnies, this.player.attributes.collide);

    // collision player and bats
    this.game.physics.arcade.collide(this.player, this.bats1, this.player.attributes.collide);

    // Collision with the players and mini boss
    this.game.physics.arcade.collide(this.player, this.miniBoss1, this.player.attributes.collide);

    // Collision player and old man
    this.game.physics.arcade.collide(this.oldMan, this.player, this.oldManQuest);

    // Set the collision for the bunnies and the world
    this.game.physics.arcade.collide(this.groundBunnies, this.layer);

    // collision of bats
    this.game.physics.arcade.collide(this.bats1, this.layer);

    // Updates for the player
    if (this.player.attributes.alive && !this.player.attributes.won) {
      this.player.attributes.update(this.player, this.game);
    }
    

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

    // Updates for the ground bunnies
    for (var i = 0; i < 10; i++) {
      this.groundBunnies[i].attributes.update(this.groundBunnies[i], this.game, this.player);
    }

    // Update for the mini boss
    this.miniBoss1.attributes.update(this.miniBoss1, this.game, this.player);

    if (!this.gameEnd) {
      // Check if won the game
      this.checkForWin();

      // Check if dead
      this.checkForDead();
    }
  },

  render: function() {
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
    //this.game.debug.spriteCoords(this.player, 32, 300);
  }
};