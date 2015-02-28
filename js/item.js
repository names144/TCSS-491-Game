/*
* Holds information for the items
*/

function Item() {

  this.name;
  this.health;

  this.create = function(item, game, name) {
    item.body.allowGravity = true;
    if (name === 'key') {
      item.body.setSize(32, 32, 0, 0);
      item.animations.add('idle', [3], 1, true);
      item.animations.play('idle');
    } else if (name === 'apple') {
      item.body.setSize(26, 26, 0, 0);
      item.animations.add('idle', [0], 1, true);
      item.animations.play('idle');
      item.attributes.health = 20;
    }
    item.attributes.name = name;
  };

  this.collide = function(player, item) {
    player.attributes.addItem(item);
  };
};