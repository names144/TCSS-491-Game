/*
* Game Over
*/
var GameOver = function(game) {};

GameOver.prototype = {

  create: function() {
    var dead = this.game.add.audio('dead', 1, false);
    dead.play();
    var text = "GAME OVER";
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    var t = this.game.add.text(this.game.camera.x + 100, this.game.camera.y + 100, text, style);
    this.game.time.events.add(Phaser.Timer.SECOND+2, this.callback, this);
  },

  callback: function() {
    var text = "Play Again?";
    var style = { font: "45px Arial", fill: "#ff0044", align: "center" };
    var t = this.game.add.text(this.game.camera.x + 180, this.game.camera.y + 200, text, style);

    var playButton = this.game.add.button(300,340,"play", this.playAgain ,this);
    playButton.anchor.setTo(0.5,0.5);
  },

  playAgain: function() {
    this.game.state.remove('Level1');
    this.game.state.add('Level1', Level1);
    this.game.state.start('Level1');
  }
};