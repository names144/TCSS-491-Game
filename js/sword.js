/*
* The players sword.
*/

function Sword() {

  this.SPEED = 300;

  this.ATTACK_INTERVAL = 300;

  this.lastHitTime = 0;

  this.direction = 'right';
  this.damage = 7;
  this.name = 'sword';

  this.create = function(sword, game) {

    sword.anchor.setTo(0.5,0.5);

    sword.body.setSize(32, 32, 0, 0);

    sword.body.bounce = 0;

    sword.animations.add('swing', [0,1], 10, true);

    sword.body.allowGravity = false;
  };

  this.update = function(sword, game, player) {
    if (sword.visible) {
      sword.body.enable = true;
      if (!player.attributes.playerFacingLeft) {
        // put sword where player is
        sword.position.x = player.position.x + 15;
        sword.position.y = player.position.y + 5;
        // Swing right
        if (this.direction === 'left') {
          sword.scale.x *= -1;
          sword.attributes.direction = 'right';
        }
        sword.animations.play('swing');
      } else {
        // put sword where player is
        sword.position.x = player.position.x - 15;
        sword.position.y = player.position.y + 5;
        // Swing left
        if (this.direction === 'right') {
          sword.scale.x *= -1;
          sword.attributes.direction = 'left';
        }
        sword.animations.play('swing');
      }
    } else {
      sword.animations.stop();
      sword.body.enable = false;
      sword.attributes.lasthitTime = 0;
    }
  };

  this.collide = function(sword, obj) {
    if (obj.attributes) {
      if ((obj.game.time.now - sword.attributes.lastHitTime) > 200) {
        obj.attributes.hurt(obj, sword.attributes.damage);
        sword.attributes.lastHitTime = obj.game.time.now;
      }
    }
  };
};