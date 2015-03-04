/*
* Game Win
*/
var GameWin = function(game) {};

GameWin.prototype = {

  create: function() {
    var win = this.game.add.audio('win', 1, false);
    win.play();
    var text = "You Win!";
    var style = { font: "65px Arial", fill: "#3FCC14", align: "center" };
    var t = this.game.add.text(this.game.camera.x + 165, this.game.camera.y + 100, text, style);
    this.game.time.events.add(Phaser.Timer.SECOND+2, this.callback, this);
  },

  callback: function() {
    var text = "Play Again?";
    var style = { font: "45px Arial", fill: "#3FCC14", align: "center" };
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