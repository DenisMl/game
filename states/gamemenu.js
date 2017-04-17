var GameMenu = function() {};

GameMenu.prototype = {

   menuConfig: {
      startY: 260,
      startX: 30
   },

   init: function() {
      this.titleText = game.make.text(game.width / 2, 100, "DEEP HUNTER", {
         font: 'bold 60pt TheMinion',
         fill: '#FDFFB5',
         align: 'center'
      });
      this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
      this.titleText.anchor.set(0.5);
      this.optionCount = 1;

   },

   create: function() {
      if (music.name !== 'game-bgm') {
         music.stop();
         music = game.add.audio('game-bgm');
         music.loop = true;
         music.play();
      }
      // if (music.name !== "dangerous" && playMusic) {
      //   music.stop();
      //   music = game.add.audio('dangerous');
      //   music.loop = true;
      //   music.play();
      // }
      game.stage.disableVisibilityChange = true;
      game.add.sprite(0, 0, 'menu');
      game.add.sprite(0, 380, 'howToPlay');
      game.add.existing(this.titleText);
      this.addMenuOption('Start', function() {
         game.state.start("Game");
      });

      keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);


   },

   addMenuOption: function(text, callback) {
     var optionStyle = { font: '30pt TheMinion', fill: '#FDFFB5', align: 'center', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
     var txt = game.add.text(game.width / 2, (this.optionCount * 80) + 180, text, optionStyle);
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
       target.fill = "#FDFFB5";
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

   update: function() {
      if (keyEnter.isDown) {
         game.state.start("Game");
      }
   }
};

// Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
