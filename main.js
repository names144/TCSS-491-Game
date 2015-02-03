window.onload = function() {

        var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Test', { preload: preload, create: create, update: update, render: render });

        function preload () {

    		
    		//  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
    		//  blank frames at the end, so we tell the loader how many to load

    		game.load.spritesheet('player', 'bmario.png', 32, 32, 18);

    		game.load.tilemap('tilemap', 'tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    		game.load.image('tiles', 'tiles.bmp');
    		game.load.image('background', 'sand.jpg');
        }

        var player;
        var rect;
		var cursors;
		var facing;
		var map;
		var tileset;
		var bg;
		var jumpTimer = 0;
		var layer;
		var jumpButton;

		function create() {

			game.physics.startSystem(Phaser.Physics.ARCADE);

		    bg = game.add.tileSprite(0, 0, 1920, 1920, 'background');
		    bg.fixedToCamera = true;

		    map = game.add.tilemap('tilemap');

   			map.addTilesetImage('tiles');

    		map.setCollisionByExclusion([41]);

    		layer = map.createLayer('Tile Layer 1');

    		layer.resizeWorld();

		    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

		    game.physics.arcade.gravity.y = 500;
		    game.physics.enable(player, Phaser.Physics.ARCADE);
		    player.body.collideWorldBounds = true;
    		player.body.setSize(32, 32, 0, 0);
		    //  Here we add a new animation called 'walk'
		    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
		    player.animations.add('ani', [0,1,2,3], 20, true);
			player.play('ani');// plays all the frames.

		    cursors = game.input.keyboard.createCursorKeys();

		    game.camera.follow(player);

		    cursors = game.input.keyboard.createCursorKeys();
    		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		}

		function update() {

		    game.physics.arcade.collide(player, layer);

		    player.body.velocity.x = 0;

		    if (cursors.left.isDown)
		    {
		        player.body.velocity.x = -150;

		        if (facing != 'left')
		        {
		            player.animations.play('left');
		            facing = 'left';
		        }
		    }
		    else if (cursors.right.isDown)
		    {
		        player.body.velocity.x = 150;

		        if (facing != 'right')
		        {
		            player.animations.play('right');
		            facing = 'right';
		        }
		    }
		    else
		    {
		        if (facing != 'idle')
		        {
		            player.animations.stop();

		            if (facing == 'left')
		            {
		                player.frame = 0;
		            }
		            else
		            {
		                player.frame = 5;
		            }

		            facing = 'idle';
		        }
		    }
		    
		    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
		    {
		        player.body.velocity.y = -270;
		        jumpTimer = game.time.now + 750;
		    }
		}

		function render() {

		    game.debug.cameraInfo(game.camera, 32, 32);
		    game.debug.spriteCoords(player, 32, 500);

		}

    };