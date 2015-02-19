/*
* Holds the information for bullets from player.
*/

// Bullet class
function Bullet() {

  this.SPEED = 300;

  this.direction = 'left';
  this.alive = false;
  this.damage = 5;

  this.create = function(bullet, game, dir) {

    bullet.anchor.setTo(0.5,0.5);

    bullet.body.setSize(20, 20, 0, 0);

    bullet.animations.add('fire', [0,1,2,3], 5, true);

    bullet.body.collideWorldBounds = true;

    bullet.body.allowGravity = false;

    bullet.animations.play('fire');

    this.direction = dir;

    if (dir === 'left') {
      bullet.scale.x *= -1;
    }
  };

  this.update = function(bullet, game) {
    if (bullet.attributes.direction === 'left') {
      bullet.body.velocity.x = -bullet.attributes.SPEED;
    } else {
      bullet.body.velocity.x = bullet.attributes.SPEED;
    }
  };

  this.collide = function(bullet, obj) {

    // destroy bullet
    bullet.kill();

    if (obj.attributes) {
      obj.attributes.hurt(obj, bullet.attributes.damage);
    }
  };
}