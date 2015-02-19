/*
* Holds information for the items
*/

function Item() {

  this.name;

  this.create = function(item, game, name) {
    item.body.setSize(32, 32, 0, 0);
    item.body.allowGravity = true;
    item.animations.add('idle', [5], 1, true);
    item.animations.play('idle');
    this.name = name;
  };

  this.collide = function(player, item) {
    player.attributes.addItem(item.attributes.name);
    item.kill();
  };
};