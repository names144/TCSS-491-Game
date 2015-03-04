window.onload = function() {
  var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'gameWindow');
  game.state.add('Loading', Loading);
  game.state.add('Preload', Preload);
  game.state.add('Title', Title);
  game.state.add('Level1', Level1);
  game.state.add('Level2', Level2);
  //game.state.add('Level3', Level3);
  game.state.add('GameWin', GameWin);
  game.state.add('GameOver', GameOver);
  game.state.start("Loading");
};