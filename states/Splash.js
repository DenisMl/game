var Splash = function() {};

Splash.prototype = {

   loadScripts: function() {
      game.load.script('style', 'lib/style.js');
      game.load.script('mixins', 'lib/mixins.js');
      game.load.script('WebFont', 'vendor/webfontloader.js');
      game.load.script('gamemenu', 'states/gamemenu.js');
      game.load.script('game', 'states/Game.js');
      game.load.script('gameover', 'states/gameover.js');
      game.load.script('credits', 'states/credits.js');
      game.load.script('options', 'states/options.js');
   },

   // loadBgm: function() {
   //    game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
   //    game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
   // },

   // loadFonts: function() {
   //    WebFontConfig = {
   //      custom: {
   //        families: ['TheMinion'],
   //        urls: ['assets/style/theminion.css']
   //      }
   //    }
   // },

   init: function() {
      this.titleText = game.make.text(game.world.centerX, 100, "DEEP HUNTER", {
         font: 'bold 60pt TheMinion',
         fill: '#FDFFB5',
         align: 'center'
      });
      this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
      this.titleText.anchor.set(0.5);
      this.loadingBar = game.make.sprite(game.world.centerX - (540 / 2), 550, "loading");
      // utils.centerGameObjects([this.logo, this.status]);
   },

   preload: function() {
      game.add.sprite(0, 0, 'menu');
      game.add.existing(this.loadingBar);
      this.load.setPreloadSprite(this.loadingBar);

      this.loadScripts();
      // this.loadImages();
      // this.loadFonts();
      // this.loadBgm();

   },

   addGameStates: function() {

      game.state.add("GameMenu", GameMenu);
      game.state.add("Game", Game);
      game.state.add("GameOver", GameOver);
      // game.state.add("Credits", Creions);
   },

   addGameMusic: function() {

      music = game.add.audio('game-bgm');
      music.loop = true;
      music.play();
   },

   create: function() {
      game.add.existing(this.titleText);

      this.addGameStates();
      this.addGameMusic();

      setTimeout(function() {
         game.state.start("GameMenu");
      }, 500);
   }
};
