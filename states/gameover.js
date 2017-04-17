var GameOver = function(game) {};

GameOver.prototype = {

  preload: function () {
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: '#FDFFB5', align: 'center', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.width / 2, (this.optionCount * 80) + 300, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0)";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#ffd895";
      target.stroke = "rgba(253, 255, 181,0.1)";
      target.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "rgb(253, 255, 181)";
      target.stroke = "rgba(0,0,0,0)";
      target.setShadow(0, 0, 'rgba(0,0,0,0)', 0);
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;


  },

  create: function () {
    game.add.sprite(0, 0, 'gameover-bg');
    var titleStyle = { font: 'bold 60pt TheMinion', fill: '#FDFFB5', align: 'center'};
    var text = game.add.text(game.width / 2, 100, "Game Over", titleStyle);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    text.anchor.set(0.5);
    this.addMenuOption('Play Again', function (e) {
      this.game.state.start("Game");
    });
    this.addMenuOption('Main Menu', function (e) {
      this.game.state.start("GameMenu");
    })
  }
};
