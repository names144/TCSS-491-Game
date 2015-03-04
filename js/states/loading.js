/*
* Loading state for the game.
*/
var Loading = function(game) {
  console.log('Loading Game...');
};

Loading.prototype = {
  preload: function() {
    // Load the loading gif
    this.game.load.image('loading', 'images/loading.gif');
  },

  create: function() {
    // Loaded the gif, now start loading other assets
    this.game.state.start('Preload');
  }
};