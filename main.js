// Global Variables
var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game'),
  Main = function () {},
  gameOptions = {
    playSound: false,
    playMusic: false
  },
  musicPlayer;




Main.prototype = {

  preload: function () {
    game.load.image('menu',    'assets/images/menu.png');
    game.load.image('howToPlay',    'assets/images/howToPlay.png');
    game.load.image('loading',  'assets/images/loading.png');
    game.load.image('background', 'assets/images/background.png');
    game.load.image('gameover-bg', 'assets/images/gameover-bg.png');
    game.load.image('bound', 'assets/images/bound.png');
    game.load.image('U-boat', 'assets/images/U-boat.png');
    game.load.image('playerDead', 'assets/images/U-boatDead.png');
    game.load.image('torpedo', 'assets/images/torpedo.png');
    game.load.image('pointerRayVert', 'assets/images/pointerRayVert.png');
    game.load.image('pointerRayHoriz', 'assets/images/pointerRayHoriz.png');
    game.load.image('cruiser', 'assets/images/cruiser.png');
    game.load.image('cruiserDead', 'assets/images/cruiserDead.png');
    game.load.image('depthBomb', 'assets/images/depthBomb.png');
    game.load.image('bubble1', 'assets/images/bubble1.png');
    game.load.image('bubble2', 'assets/images/bubble2.png');
    game.load.image('bubble3', 'assets/images/bubble3.png');
    game.load.image('bubble4', 'assets/images/bubble4.png');
    game.load.image('blastWave', 'assets/images/blastWave.png');
    game.load.image('fire1', 'assets/images/fire1.png');
    game.load.image('fire2', 'assets/images/fire2.png');
    game.load.image('fire3', 'assets/images/fire3.png');
    game.load.image('torpedoesReloadIcon', 'assets/images/torpedoesReloadIcon.png');
    game.load.image('torpedoesReloadIconUnavailable', 'assets/images/torpedoesReloadIconUnavailable.png');
    game.load.image('flashRed', 'assets/images/flashRed.png');

    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/Splash.js');

    game.load.audio('game-bgm', 'assets/bgm/game-bgm.mp3');
    game.load.audio('gameover-bgm', 'assets/bgm/gameover-bgm.mp3');
    game.load.audio('bombExplosionSound', 'assets/bgm/bombExplosionSound.mp3');
    game.load.audio('cruiserExplosionSound', 'assets/bgm/cruiserExplosionSound.mp3');
    game.load.audio('submarineExplosionSound', 'assets/bgm/submarineExplosionSound.mp3');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');
