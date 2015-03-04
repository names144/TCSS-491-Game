/*
* Title of the game.
*/
var Title = function(game) {
  console.log('Title Screen');
};

Title.prototype = {

  create: function() {
    this.game.sound.play('titleMusic', 1, true);
    var title = this.game.add.tileSprite(0, 0, 600, 400, 'titleScreen');
    var text = "Orange 3 Adventures";
    var style = { font: "48px monospace", fill: "#FC5F00", align: "center" };
    this.game.add.text(60, 100, text, style);

    var playButton = this.game.add.button(300,340,"play", this.playGame ,this);
    playButton.anchor.setTo(0.5,0.5);
  },

  playGame: function() {
    this.game.sound.stopAll();
    this.game.state.start('Level1');
  }
};