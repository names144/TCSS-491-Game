/*
* Holds the information for bullets from player.
*/

// Bullet class
function Bullet() {

  this.SPEED = 300;

  this.direction = 'left';
  this.alive = false;
  this.damage = 5;

  this.create = function(bullet, game, dir, type) {

    bullet.anchor.setTo(0.5,0.5);

    bullet.body.setSize(20, 20, 0, 0);

    if (type === 'bullet') {
      bullet.animations.add('fire', [0,1,2,3], 5, true);
    } else {
      bullet.animations.add('fire', [0,1], 5, true);
    }
    
    bullet.body.allowGravity = false;

    bullet.animations.play('fire');

    this.direction = dir;

    if (type) {
      this.damage = 10;
    }

    if (dir === 'left') {
      bullet.scale.x *= -1;
    }
  };

  this.update = function(bullet, game) {
    if (bullet.alive) {
      if (bullet.attributes.direction === 'left') {
        bullet.body.velocity.x = -bullet.attributes.SPEED;
      } else {
        bullet.body.velocity.x = bullet.attributes.SPEED;
      }
    }
  };

  this.collide = function(bullet, obj) {
    if (obj.attributes) {
      obj.attributes.touching = bullet.body.touching;
      obj.attributes.hurt(obj, bullet.attributes.damage);
    }
    // destroy bullet
    bullet.kill();
  };
};

/*
* Bone Archer Arrow
*/ 
function Arrow() {
  this.SPEED = 300;

  this.direction = 'right';
  this.alive = false;
  this.damage = 10;

  this.create = function(arrow, game, dir) {

    arrow.anchor.setTo(0.5,0.5);

    arrow.body.setSize(32, 16, 0, 0);

    arrow.animations.add('fire', [0,1], 15, true);

    arrow.body.allowGravity = false;

    arrow.animations.play('fire');

    this.direction = dir;

    if (dir === 'left') {
      arrow.scale.x *= -1;
    }
  };

  this.update = function(arrow, game) {
    if (arrow.alive) {
      if (arrow.attributes.direction === 'left') {
        arrow.body.velocity.x = -arrow.attributes.SPEED;
      } else {
        arrow.body.velocity.x = arrow.attributes.SPEED;
      }
    }
  };

  this.collide = function(arrow, obj) {
    if (obj.attributes) {
      obj.attributes.touching = arrow.body.touching;
      obj.attributes.hurt(arrow.attributes.damage);
    }
    // destroy bullet
    arrow.kill();
  };
};

/*
* Mini Boss Rocket
*/ 
function Rocket() {
  this.SPEED = 300;

  this.direction = 'left';
  this.alive = false;
  this.damage = 20;

  this.soundFX = {};

  this.create = function(rocket, game, dir, coords) {

    rocket.anchor.setTo(0.5,0.5);

    rocket.body.setSize(46, 32, 0, 0);

    rocket.animations.add('fire', [0,1,2,3], 5, false);

    rocket.body.allowGravity = false;

    rocket.animations.play('fire');

    this.direction = dir;

    if (dir === 'right') {
      rocket.scale.x *= -1;
    }

    this.soundFX.dead = game.add.audio('explode', 1, false);

    game.physics.arcade.moveToXY(rocket, coords.x, coords.y, this.SPEED);
  };

  this.collide = function(rocket, obj) {
    if (obj.attributes) {
      obj.attributes.touching = rocket.body.touching;
      obj.attributes.hurt(rocket.attributes.damage);
      rocket.attributes.soundFX.dead.play();
    }
    // destroy bullet
    rocket.kill();
  };
};


/*
* Boss Bomb
*/ 
function Bomb() {
  this.SPEED = 300;

  this.alive = false;
  this.damage = 15;

  this.soundFX = {};

  this.create = function(rocket, game, dir, coords) {

    rocket.anchor.setTo(0.5,0.5);

    rocket.body.setSize(17, 43, 0, 0);

    rocket.body.allowGravity = true;

    this.soundFX.dead = game.add.audio('bombSound', 1, false);
  };

  this.collide = function(rocket, obj) {
    rocket.attributes.soundFX.dead.play();
    if (obj.attributes) {
      obj.attributes.touching = rocket.body.touching;
      obj.attributes.hurt(rocket.attributes.damage);
    }
    // destroy bullet
    rocket.kill();
  };
};