var Game = function(game) {};

// var step = Math.PI * 2 / 360;
// var counter = 0;

Game.prototype = {
   preload: function() {
      this.optionCount = 1;
   },

   create: function() {
      game.world.setBounds(0, 0, 2400, 900);
      game.physics.startSystem(Phaser.Physics.ARCADE);

      bg = game.add.sprite(0, 0, 'background');
      bg.width = game.world.width;
      game.stage.backgroundColor = "#4488AA";

      if (music.name !== 'game-bgm') {
         music.stop();
         music = game.add.audio('game-bgm');
         music.loop = true;
         music.play();
      }

      bombExplosionSound = game.add.audio('bombExplosionSound');
      submarineExplosionSound = game.add.audio('submarineExplosionSound');
      cruiserExplosionSound = game.add.audio('cruiserExplosionSound');

      platforms = game.add.group(); //PLATFORMS
      platforms.enableBody = true;

      boundBottom = platforms.create(-200, game.world.height - 2, 'bound');
      boundBottom.width = game.world.width + 300;
      boundBottom.body.immovable = true;

      boundWater = platforms.create(-200, 176, 'bound');
      boundWater.width = game.world.width + 300;
      boundWater.body.immovable = true;

      torpedoes = game.add.group(); //TORPEDOES
      torpedoes.enableBody = true;
      game.physics.arcade.enable(torpedoes);
      torpedoes.createMultiple(10, 'torpedo');
      torpedoes.setAll('anchor.x', 0.5);
      torpedoes.setAll('anchor.y', 0.5);
      torpedoes.setAll('checkWorldBounds', true);
      torpedoes.setAll('outOfBoundsKill', true);
      torpedoes.setAll('update', this.torpedoUpdate);

      playerTorpedoes = game.add.group(); //PLAYER TORPEDOES
      playerTorpedoes.enableBody = true;
      game.physics.arcade.enable(playerTorpedoes);
      playerTorpedoes.createMultiple(10, 'torpedo');
      playerTorpedoes.setAll('anchor.x', 0.5);
      playerTorpedoes.setAll('anchor.y', 0.5);
      playerTorpedoes.setAll('checkWorldBounds', true);
      playerTorpedoes.setAll('outOfBoundsKill', true);
      playerTorpedoes.setAll('update', this.torpedoUpdate);

      pointerRaysHoriz = game.add.group(); //RAYS
      pointerRaysHoriz.enableBody = true;
      game.physics.arcade.enable(pointerRaysHoriz);
      pointerRaysHoriz.createMultiple(20, 'pointerRayHoriz');
      // pointerRaysHoriz.setAll('anchor.x', 0.5);

      pointerRaysVert = game.add.group();
      pointerRaysVert.enableBody = true;
      game.physics.arcade.enable(pointerRaysVert);
      pointerRaysVert.createMultiple(20, 'pointerRayVert');
      pointerRaysVert.setAll('anchor.y', 1);

      depthBombs = game.add.group(); //DEPTHBOMBS
      depthBombs.enableBody = true;
      game.physics.arcade.enable(depthBombs);
      depthBombs.createMultiple(9, 'depthBomb');
      depthBombs.setAll('anchor.x', 0.5);
      depthBombs.setAll('anchor.y', 0.5);
      depthBombs.setAll('update', this.depthBombUpdate);

      cruisers = game.add.group(); //CRUISERS
      cruisers.enableBody = true;
      game.physics.arcade.enable(cruisers);
      cruisers.createMultiple(2, 'cruiser');
      cruisers.setAll('anchor.x', 0.5);
      cruisers.setAll('anchor.y', 0.5);
      cruisers.setAll('update', this.cruiserUpdate);
      cruisers.setAll('cruiserIsBusy', false, false, false, 0, true);
      cruisers.setAll('bombsReloaded', true, false, false, 0, true); //setAll(key, value, checkAlive, checkVisible, operation, force)
      cruisers.bombsReloadTime = 3000;
      cruisers.cruiserSpawnTime = 2000;
      cruisers.cruiserTimer = 2000;
      cruisers.availableCruiser = true; //true

      cruisersDead = game.add.group(); //CRUISERSDEAD
      cruisersDead.enableBody = true;
      game.physics.arcade.enable(cruisersDead);
      cruisersDead.createMultiple(10, 'cruiserDead');
      cruisersDead.setAll('anchor.x', 0.5);
      cruisersDead.setAll('anchor.y', 0.5);

      submarines = game.add.group(); //SUBMARINES
      submarines.enableBody = true;
      game.physics.arcade.enable(submarines);
      submarines.createMultiple(2, 'submarine');
      submarines.setAll('anchor.x', 0.5);
      submarines.setAll('anchor.y', 0.5);
      submarines.setAll('update', this.submarinesUpdate);
      submarines.setAll('submarineIsBusy', false, false, false, 0, true);
      submarines.setAll('torpedoesReloaded', true, false, false, 0, true); //setAll(key, value, checkAlive, checkVisible, operation, force)
      submarines.torpedoesReloadTime = 3000;
      submarines.submarineSpawnTime = 2000;
      submarines.submarineTimer = 2000;
      submarines.availableSubmarine = false;

      submarinesDead = game.add.group(); //SUBMARINESDEAD
      submarinesDead.enableBody = true;
      game.physics.arcade.enable(submarinesDead);
      submarinesDead.createMultiple(10, 'submarineDead');
      submarinesDead.setAll('anchor.x', 0.5);
      submarinesDead.setAll('anchor.y', 0.5);

      playerDead = game.add.group(); //PLAYERDEAD
      playerDead.enableBody = true;
      game.physics.arcade.enable(playerDead);
      playerDead.createMultiple(2, 'playerDead');
      playerDead.setAll('anchor.x', 0.5);
      playerDead.setAll('anchor.y', 0.5);

      // destroyers = game.add.group();
      // destroyers.enableBody = true;
      // game.physics.arcade.enable(destroyers);
      // destroyers.createMultiple(2, 'destroyer');
      // destroyers.setAll('anchor.x', 0.5);
      // destroyers.setAll('anchor.y', 0.5);

      torpedoEmitter = game.add.emitter(game.world.centerX, game.world.centerY, 200);
      torpedoEmitter.makeParticles(['bubble1', 'bubble2', 'bubble3']);
      torpedoEmitter.gravity = -100;
      torpedoEmitter.setXSpeed(0, 0);
      torpedoEmitter.setYSpeed(0, 0);
      torpedoEmitter.setAlpha(1, 0.4, 200);
      torpedoEmitter.setScale(0.3, 1, 0.3, 1, 200);
      torpedoEmitter.lifespan = 200;
      torpedoEmitter.frequency = 60;

      player = game.add.sprite(300, game.world.height / 2, 'U-boat'); //PLAYER
      player.anchor.set(0.5);
      game.physics.arcade.enable(player);
      player.body.drag.set(1700);
      player.health = 3;
      player.events.onKilled.add(this.playerKilled, player);
      player.cruisersKilled = 0;
      player.submarinesKilled = 0;

      torpedoesReloadIcons = game.add.group();
      torpedoesReloadIcons.fixedToCamera = true;
      torpedoesReloadIcons.create(30, game.height - 30, 'torpedoesReloadIcon');
      torpedoesReloadIcons.create(95, game.height - 30, 'torpedoesReloadIcon');
      torpedoesReloadIcons.create(160, game.height - 30, 'torpedoesReloadIcon');

      keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
      keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
      keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
      keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);

      cursors = game.input.keyboard.createCursorKeys();
      cursors.left.onDown.add(this.torpedoLeft, this);
      cursors.right.onDown.add(this.torpedoRight, this);
      cursors.up.onDown.add(this.torpedoUp, this);

      // game.camera.follow(player);
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

      score = 0;
      scoreText = game.add.text(16, 16, 'score: 0', {
         fontSize: '32px',
         fill: '#000'
      });
      scoreText.fixedToCamera = true;

      healthText = game.add.text(game.width - 100, 16, 'HP: 3', {
         fontSize: '32px',
         fill: '#000'
      });
      healthText.fixedToCamera = true;

      playerEmitter = game.add.emitter(game.world.centerX, game.world.centerY, 200);
      playerEmitter.makeParticles(['bubble1', 'bubble2', 'bubble3', 'bubble4']);
      playerEmitter.gravity = -100;
      playerEmitter.setYSpeed(-20, 20);
      playerEmitter.setAlpha(1, 0.3, 200);
      playerEmitter.setScale(0.3, 1, 0.3, 1, 200);
      playerEmitter.lifespan = 200;
      playerEmitter.frequency = 40;

      depthBombEmitter = game.add.emitter(game.world.centerX, game.world.centerY, 200);
      depthBombEmitter.makeParticles(['bubble2', 'bubble3']);
      depthBombEmitter.gravity = -100;
      depthBombEmitter.setXSpeed(-20, 20);
      depthBombEmitter.setYSpeed(0, 0);
      depthBombEmitter.setAlpha(0.4, 0.1, 100);
      depthBombEmitter.setScale(0.5, 1, 0.5, 1, 100);
      depthBombEmitter.lifespan = 50;

      depthBombExplosion = game.add.emitter(game.world.centerX, game.world.centerY, 200);
      depthBombExplosion.makeParticles(['bubble2', 'bubble3']);
      depthBombExplosion.gravity = -100;
      depthBombExplosion.setXSpeed(-30, 30);
      depthBombExplosion.setYSpeed(-30, 30);
      depthBombExplosion.setAlpha(1, 0, 1300);
      depthBombExplosion.setScale(1, 4, 1, 4, 1300);

      explosion = game.add.emitter(game.width / 2, game.height / 2, 200);
      explosion.makeParticles(['fire1', 'fire2', 'fire3']);
      explosion.gravity = -100;
      explosion.setXSpeed(-30, 30);
      explosion.setYSpeed(-30, 30);
      explosion.setAlpha(0.3, 0, 1300);
      explosion.setScale(1, 3, 1, 3, 1300);
      // explosion.start(true, 1300, null, 50);   //(explode, lifespan, frequency, quantity, forceQuantity)

      hugeExplosion = game.add.emitter(game.width / 2, game.height / 2, 200);
      hugeExplosion.makeParticles(['fire1', 'fire2', 'fire3']);
      hugeExplosion.gravity = -150;
      hugeExplosion.setXSpeed(-65, 65);
      hugeExplosion.setYSpeed(-50, 50);
      hugeExplosion.setAlpha(0.9, 0, 1000);
      hugeExplosion.setScale(1, 4, 1, 4, 1000);

      blastWave = game.add.emitter(game.width / 2, game.height / 2, 10);
      blastWave.makeParticles('blastWave');
      blastWave.enableBody = true;
      game.physics.arcade.enable(blastWave);
      // blastWave.gravity = 1;
      blastWave.setXSpeed(0, 0);
      blastWave.setYSpeed(0, 0);
      blastWave.setAlpha(0.1, 0, 200);
      blastWave.setScale(0.3, 1, 0.3, 1, 400);
      // blastWave.start(true, 300, null, 5);   //(explode, lifespan, frequency, quantity, forceQuantity)

      flashRed = game.add.sprite(0, 0, 'flashRed');
      flashRed.alpha = 0;

      this.stage.disableVisibilityChange = false;
   },

   update: function() {
      game.physics.arcade.collide(player, platforms);
      game.physics.arcade.collide(submarines, platforms);
      game.physics.arcade.collide(cruisersDead, platforms, this.cruiserDeadStop);
      game.physics.arcade.collide(submarinesDead, platforms, this.submarineDeadStop);
      game.physics.arcade.collide(torpedoes, platforms, this.torpedoKill);
      game.physics.arcade.collide(playerTorpedoes, platforms, this.torpedoKill);
      game.physics.arcade.collide(playerTorpedoes, submarines, this.submarineDamaged);
      game.physics.arcade.overlap(playerTorpedoes, cruisers, this.cruiserKill);
      game.physics.arcade.collide(player, depthBombs, this.damagedByDepthBomb);
      game.physics.arcade.collide(player, torpedoes, this.damagedByTorpedoes);
      game.physics.arcade.overlap(blastWave, player, this.damagedByDepthBombWave);
      game.physics.arcade.overlap(pointerRaysVert, cruisers, this.cruiserEvasion);
      game.physics.arcade.overlap(pointerRaysHoriz, submarines, this.submarineEvasion);

      if (keyW.isDown) {
         player.body.velocity.y = -150;
      } else if (keyS.isDown) {
         player.body.velocity.y = 150;
      }

      if (keyA.isDown && player.alive) {
         playerEmitter.emitX = player.x + 90;
         playerEmitter.emitY = player.y + 6;
         playerEmitter.emitParticle();
         player.body.velocity.x = -240;
         player.scale.x = -1;
      } else if (keyD.isDown && player.alive) {
         playerEmitter.emitX = player.x - 90;
         playerEmitter.emitY = player.y + 6;
         playerEmitter.emitParticle();
         player.body.velocity.x = 240;
         player.scale.x = 1;
      }

      game.world.wrap(player, 0, true, true, false);

      if (cruisers.availableCruiser && game.time.now > cruisers.cruiserTimer) {
         this.spawnCruiser();
      }

      if (submarines.availableSubmarine && game.time.now > submarines.submarineTimer) {
         this.spawnSubmarine();
      }

      if (flashRed.alpha > 0) {
         flashRed.alpha -= 0.05;
      }

      // Move sprite up and down smoothly for show -----------------------------------------------------
      // var tStep = Math.sin(counter);
      // player.body.y += tStep * 0.5;
      // counter += 4 * step;

   },

   torpedoesReloadIconKill: function(torpedoIcon) {
      torpedoIcon.loadTexture('torpedoesReloadIconUnavailable');
      torpedoIcon.alive = false;
   },

   torpedoesReloadIconAlive: function(torpedoIcon) {
      this.loadTexture('torpedoesReloadIcon');
      this.alive = true;
   },

   torpedoLeft: function() {
      let torpedoIcon = torpedoesReloadIcons.getFirstAlive();
      if (torpedoIcon && player.alive) {
         torpedo = playerTorpedoes.getFirstDead();
         pointerRay = pointerRaysHoriz.getFirstDead();
         torpedo.reset(player.x, player.y + 10);
         torpedo.scale.set(0.5, 0.5);
         torpedo.angle = 0;
         pointerRay.anchor.x = 1;
         pointerRay.reset(torpedo.x, torpedo.y);
         game.time.events.add(Phaser.Timer.SECOND * 1.5, this.pointerRaysKill, pointerRay);
         game.physics.arcade.accelerateToXY(torpedo, player.x - 10, player.y, 650, 1000, 0);
         this.torpedoesReloadIconKill(torpedoIcon);
         game.time.events.add(Phaser.Timer.SECOND * 3, this.torpedoesReloadIconAlive, torpedoIcon);

      }
   },

   torpedoRight: function() {
      let torpedoIcon = torpedoesReloadIcons.getFirstAlive();
      if (torpedoIcon && player.alive) {
         torpedo = playerTorpedoes.getFirstDead();
         pointerRay = pointerRaysHoriz.getFirstDead();
         torpedo.reset(player.x, player.y + 10);
         torpedo.scale.set(-0.5, 0.5);
         torpedo.angle = 0;
         pointerRay.anchor.x = 0;
         pointerRay.reset(torpedo.x, torpedo.y);
         game.time.events.add(Phaser.Timer.SECOND * 1.5, this.pointerRaysKill, pointerRay);
         game.physics.arcade.accelerateToXY(torpedo, player.x + 10, player.y, 650, 1000, 0);
         this.torpedoesReloadIconKill(torpedoIcon);
         game.time.events.add(Phaser.Timer.SECOND * 3, this.torpedoesReloadIconAlive, torpedoIcon);
      }
   },

   torpedoUp: function() {
      let torpedoIcon = torpedoesReloadIcons.getFirstAlive();
      if (torpedoIcon && player.alive) {
         torpedo = playerTorpedoes.getFirstDead();
         pointerRay = pointerRaysVert.getFirstDead();
         torpedo.reset(player.x, player.y);
         torpedo.scale.set(0.3, 0.4);
         torpedo.angle = 90;
         pointerRay.reset(torpedo.x, torpedo.y);
         game.time.events.add(Phaser.Timer.SECOND * 1.3, this.pointerRaysKill, pointerRay);
         game.physics.arcade.accelerateToXY(torpedo, player.x, player.y - 10, 650, 0, 1000);
         this.torpedoesReloadIconKill(torpedoIcon);
         game.time.events.add(Phaser.Timer.SECOND * 3, this.torpedoesReloadIconAlive, torpedoIcon);
      }
   },

   torpedoKill: function(torpedo) {
      torpedo.kill();
   },

   torpedoUpdate: function() {
      if (this.alive === true) {
         torpedoEmitter.emitX = this.x;
         torpedoEmitter.emitY = this.y;
         torpedoEmitter.emitParticle();
      }
   },

   spawnCruiser: function() {
      var cruiser = cruisers.getFirstDead();
      if (player.x + 960 < game.world.width) {
         cruiser.reset(player.x + 960, 163);
      } else {
         cruiser.reset(player.x - 960, 163);
      }
      cruisers.availableCruiser = false;
   },

   cruiserKill: function(torpedo, cruiser) {
      hugeExplosion.emitX = torpedo.x;
      hugeExplosion.emitY = torpedo.y - 20;
      hugeExplosion.start(true, 1300, null, 60);

      hugeExplosion.emitX = cruiser.x + game.rnd.between(-100, 100);
      hugeExplosion.emitY = cruiser.y + game.rnd.between(-15, 15);
      hugeExplosion.start(true, 1300, null, 60);

      hugeExplosion.emitX = cruiser.x + game.rnd.between(-100, 100);
      hugeExplosion.emitY = cruiser.y + game.rnd.between(-15, 15);
      hugeExplosion.start(true, 1300, null, 60);

      cruiser.kill();
      torpedo.kill();
      score += 10;
      scoreText.text = 'Score: ' + score;
      cruisers.cruiserTimer = game.time.now + cruisers.cruiserSpawnTime;
      player.cruisersKilled++;

      if (player.cruisersKilled === 1) {
         submarines.availableSubmarine = true;
      } else if (player.cruisersKilled > 1) {
         cruisers.availableCruiser = true;
      }
      cruiserDead = cruisersDead.getFirstDead();
      cruiserDead.body.gravity.y = game.rnd.between(60, 100);
      cruiserDead.reset(cruiser.x, cruiser.y);
      cruiser.scale.x > 0
         ? cruiserDead.scale.x = 1
         : cruiserDead.scale.x = -1;
      cruiserDead.body.angularVelocity = game.rnd.between(-50, 50);

      cruiserExplosionSound.play();

   },

   cruiserDeadStop: function(cruiserDead) {
      cruiserDead.body.angularVelocity = 0;
      game.time.events.add(Phaser.Timer.SECOND * 12, Game.prototype.cruiserDeadKill, cruiserDead);
   },

   cruiserDeadKill: function() {
      this.angle = 0;
      this.kill();
   },

   cruiserUpdate: function() {
      if (this.alive && player.alive && this.cruiserIsBusy === false && this.bombsReloaded === true && this.x > player.x - 100 && this.x < player.x + 100) {
         this.cruiserIsBusy = true;
         this.bombsReloaded = false;
         (this.scale.x > 0)
            ? Game.prototype.cruiserBombard.call(Game.prototype, 1, this)
            : Game.prototype.cruiserBombard.call(Game.prototype, -1, this);
      }

      if (this.cruiserIsBusy === false) {
         if (this.x < player.x - 15) {
            this.body.velocity.x = 160;
            this.scale.set(1, 1);
         } else if (this.x > player.x + 15) {
            this.body.velocity.x = -160;
            this.scale.set(-1, 1);
         } else {
            this.body.velocity.x = 0;
         }
      }
   },

   cruiserBombard: function(direction, cruiser) {
      game.physics.arcade.moveToXY(cruiser, cruiser.x + direction * 200, cruiser.y, 180);
      game.time.events.add(Phaser.Timer.SECOND * 30 / 180, this.cruiserDropBomb, cruiser); // (delay, callback, callbackContext, arguments)
      game.time.events.add(Phaser.Timer.SECOND * 100 / 180, this.cruiserDropBomb, cruiser);
      game.time.events.add(Phaser.Timer.SECOND * 170 / 180, this.cruiserDropBomb, cruiser);
      game.time.events.add(Phaser.Timer.SECOND * 200 / 180, this.cruiserFree, cruiser);
      game.time.events.add(Phaser.Timer.SECOND * (200 / 180 + cruisers.bombsReloadTime / 1000), this.cruiserBombsReload, cruiser);
   },

   cruiserDropBomb: function() {
      depthBomb = depthBombs.getFirstDead();
      depthBomb.reset(this.x, this.y);
      bombVel = 230;
      detTime = (player.y - this.y) / bombVel;
      game.physics.arcade.moveToXY(depthBomb, this.x, this.y + 10, bombVel);
      game.time.events.add(Phaser.Timer.SECOND * detTime, Game.prototype.detonateDepthBomb, depthBomb);

   },

   detonateDepthBomb: function() {
      if (this.alive === true) {
         explosion.emitX = this.x;
         explosion.emitY = this.y + 25;
         explosion.start(true, 1300, null, 20);

         depthBombExplosion.emitX = this.x;
         depthBombExplosion.emitY = this.y + 25;
         depthBombExplosion.start(true, 1300, null, 50); //(explode, lifespan, frequency, quantity, forceQuantity)

         blastWave.emitX = this.x;
         blastWave.emitY = this.y + 25;
         blastWave.start(true, 300, null, 1);

         bombExplosionSound.play();
         this.kill();
      }
   },

   depthBombUpdate: function() {
      if (this.alive === true) {
         depthBombEmitter.emitX = this.x;
         depthBombEmitter.emitY = this.y - 12;
         depthBombEmitter.emitParticle();
      }
   },

   cruiserBombsReload: function() {
      this.bombsReloaded = true;
   },

   cruiserEvasion: function(pointerRay, cruiser) {
      let dx = cruiser.x - pointerRay.x;
      if (cruiser.cruiserIsBusy === false) {
         if (dx > 0) {
            dx = 250 - dx;
            let evasionTime = (dx) / 180 * 1000; //ms
            game.physics.arcade.moveToXY(cruiser, cruiser.x + dx, cruiser.y, 180, evasionTime);
            cruiser.scale.set(1, 1);
            game.time.events.add(Phaser.Timer.SECOND * evasionTime / 1000, Game.prototype.cruiserFree, cruiser);
         } else if (dx <= 0) {
            dx = (dx - 250) * -1;
            let evasionTime = (dx) / 180 * 1000; //ms
            game.physics.arcade.moveToXY(cruiser, cruiser.x - dx, cruiser.y, 180, evasionTime);
            cruiser.scale.set(-1, 1);
            game.time.events.add(Phaser.Timer.SECOND * evasionTime / 1000, Game.prototype.cruiserFree, cruiser);
         }
      }
      cruiser.cruiserIsBusy = true;
   },

   cruiserFree: function() {
      this.cruiserIsBusy = false;
   },

   pointerRaysKill: function() {
      this.kill();
   },

   spawnSubmarine: function() {
      var submarine = submarines.getFirstDead();
      if (player.x + 960 < game.world.width) {
         submarine.reset(player.x + 960, game.rnd.between(200, 800));
      } else {
         submarine.reset(player.x - 960, game.rnd.between(200, 800));
      }
      submarine.health = 2;
      submarines.availableSubmarine = false;
   },

   submarinesUpdate: function() {
      if (this.alive && player.alive && this.submarineIsBusy === false && this.torpedoesReloaded === true && this.x > player.x - 480 && this.x < player.x + 480) {
         if (this.y > player.y - 30) {
            (this.x < player.x)
               ? Game.prototype.submarineTorpedo.call(Game.prototype, 1, -1, this)
               : Game.prototype.submarineTorpedo.call(Game.prototype, -1, -1, this); //directionX, directionY, submarine

         } else if (this.y < player.y + 30) {
            (this.x < player.x)
               ? Game.prototype.submarineTorpedo.call(Game.prototype, 1, 1, this)
               : Game.prototype.submarineTorpedo.call(Game.prototype, -1, 1, this);
         }
         this.submarineIsBusy = true;
         this.torpedoesReloaded = false;
      }

      if (this.submarineIsBusy === false) {
         if (this.x < player.x - 220) {
            if (this.x < player.x - 400) {
               this.body.velocity.x = 160;
               this.scale.set(1, 1);
            }
            if (this.y < player.y - 10) {
               this.body.velocity.y = 100;
            } else if (this.y > player.y + 15) {
               this.body.velocity.y = -100;
            } else {
               this.body.velocity.y = 0;
            }
         } else if (this.x > player.x + 220) {
            if (this.x > player.x + 400) {
               this.body.velocity.x = -160;
               this.scale.set(-1, 1);
            }
            if (this.y < player.y - 10) {
               this.body.velocity.y = 100;
            } else if (this.y > player.y + 15) {
               this.body.velocity.y = -100;
            } else {
               this.body.velocity.y = 0;
            }
         } else if (this.x < player.x + 220 && this.x > player.x) {
            this.body.velocity.x = 160;
            this.scale.set(1, 1);
            if (this.y < player.y - 10) {
               this.body.velocity.y = 100;
            } else if (this.y > player.y + 10) {
               this.body.velocity.y = -100;
            }
         } else if (this.x > player.x - 220 && this.x < player.x) {
            this.body.velocity.x = -160;
            this.scale.set(-1, 1);
            if (this.y < player.y - 10) {
               this.body.velocity.y = 100;
            } else if (this.y > player.y + 10) {
               this.body.velocity.y = -100;
            }
         }
      }
   },

   submarineTorpedo: function(directionX, directionY, submarine) {
      game.physics.arcade.moveToXY(submarine, submarine.x, submarine.y + directionY * 200, 100);
      game.time.events.add(Phaser.Timer.SECOND * 0, this.submarineLaunchTorpedo, submarine, directionX); // (delay, callback, callbackContext, arguments)
      game.time.events.add(Phaser.Timer.SECOND * 0.4, this.submarineLaunchTorpedo, submarine, directionX);
      game.time.events.add(Phaser.Timer.SECOND * 0.4, this.submarineFree, submarine);
      game.time.events.add(Phaser.Timer.SECOND * (0.4 + submarines.torpedoesReloadTime / 1000), this.submarineTorpedoesReload, submarine);
   },

   submarineLaunchTorpedo: function(scale) {
      torpedo = torpedoes.getFirstDead();
      torpedo.reset(this.x, this.y + 10);
      torpedo.scale.set(-1 * scale * 0.7, 0.7);
      torpedo.angle = 0;
      game.physics.arcade.accelerateToXY(torpedo, this.x + scale * 10, this.y, 650, 1000, 0); //displayObject, x, y, speed, xSpeedMax, ySpeedMax

   },

   submarineFree: function() {
      // this.body.drag.set(1500);
      this.submarineIsBusy = false;
   },

   submarineTorpedoesReload: function() {
      this.torpedoesReloaded = true;
   },

   submarineDamaged: function(torpedo, submarine) {
      submarine.damage(1);
      torpedo.kill();
      bombExplosionSound.play();

      depthBombExplosion.emitX = torpedo.x;
      depthBombExplosion.emitY = torpedo.y;
      depthBombExplosion.start(true, 1300, null, 50); //(explode, lifespan, frequency, quantity, forceQuantity)

      if (submarine.health === 0) {
         Game.prototype.submarineKilled(torpedo, submarine)
      }
   },

   submarineKilled: function(torpedo, submarine) {
      hugeExplosion.emitX = torpedo.x;
      hugeExplosion.emitY = torpedo.y - 20;
      hugeExplosion.start(true, 1300, null, 60);

      hugeExplosion.emitX = submarine.x + game.rnd.between(-100, 100);
      hugeExplosion.emitY = submarine.y + game.rnd.between(-15, 15);
      hugeExplosion.start(true, 1300, null, 60);

      hugeExplosion.emitX = submarine.x + game.rnd.between(-100, 100);
      hugeExplosion.emitY = submarine.y + game.rnd.between(-15, 15);
      hugeExplosion.start(true, 1300, null, 60);

      score += 20;
      scoreText.text = 'Score: ' + score;

      submarine.kill();
      torpedo.kill();
      player.submarinesKilled++;

      if (player.submarinesKilled === 1) {
         submarines.availableSubmarine = true;
         cruisers.availableCruiser = true;
      } else if (player.submarinesKilled > 1) {
         submarines.availableSubmarine = true;
      }

      submarines.submarineTimer = game.time.now + submarines.submarineSpawnTime;
      submarineDead = submarinesDead.getFirstDead();
      submarineDead.body.gravity.y = game.rnd.between(60, 100);
      submarineDead.reset(submarine.x, submarine.y);
      submarine.scale.x > 0
         ? submarineDead.scale.x = 1
         : submarineDead.scale.x = -1;
      submarineDead.body.angularVelocity = game.rnd.between(-50, 50);
      submarineExplosionSound.play();
   },

   submarineDeadStop: function(submarineDead) {
      submarineDead.body.angularVelocity = 0;
      game.time.events.add(Phaser.Timer.SECOND * 12, Game.prototype.submarineDeadKill, submarineDead);
   },

   submarineDeadKill: function() {
      this.angle = 0;
      this.kill();
   },

   submarineEvasion: function(pointerRay, submarine) {
      let dy = submarine.y - pointerRay.y;
      if (submarine.submarineIsBusy === false) {
         if (dy > 0) {
            dy = 100 - dy;
            let evasionTime = 800; //ms
            game.physics.arcade.moveToXY(submarine, submarine.x, submarine.y + 150, 100);
            game.time.events.add(Phaser.Timer.SECOND * evasionTime / 1000, Game.prototype.submarineFree, submarine);
         } else if (dy <= 0) {
            dy = (dy + 100);
            let evasionTime = 800; //ms
            game.physics.arcade.moveToXY(submarine, submarine.x, submarine.y - 150, 100);
            game.time.events.add(Phaser.Timer.SECOND * evasionTime / 1000, Game.prototype.submarineFree, submarine);
         }
         submarine.submarineIsBusy = true;
      }
   },

   damagedByDepthBomb: function(player, depthBomb) {
      Game.prototype.detonateDepthBomb.call(depthBomb);
   },

   damagedByDepthBombWave: function(player, blastWave) {
      if (blastWave.alive === true) {
         player.damage(1);
         healthText.text = 'HP: ' + player.health;
         flashRed.alpha = 1;
         // game.camera.flash(0xff0000, 500);
         // game.camera.shake(0.05, 500);
         blastWave.kill();
      }
   },

   damagedByTorpedoes: function(player, torpedo) {
      if (torpedo.alive === true) {
         player.damage(1);
         healthText.text = 'HP: ' + player.health;
         flashRed.alpha = 1;
         bombExplosionSound.play();
         torpedo.kill();

         depthBombExplosion.emitX = torpedo.x;
         depthBombExplosion.emitY = torpedo.y;
         depthBombExplosion.start(true, 1300, null, 50);

      }
   },

   playerKilled: function() {

      playerDeadObj = playerDead.getFirstDead();
      playerDeadObj.body.gravity.y = game.rnd.between(60, 80);
      playerDeadObj.reset(player.x, player.y);
      player.scale.x > 0
         ? playerDeadObj.scale.x = 1
         : playerDeadObj.scale.x = -1;
      playerDeadObj.body.angularVelocity = game.rnd.between(-50, 50);

      submarineExplosionSound.play();

      game.time.events.add(Phaser.Timer.SECOND * 3, game.state.start, game.state, 'GameOver');
   },

   // addMenuOption: function(text, callback) {
   //    var optionStyle = {
   //       font: '30pt TheMinion',
   //       fill: 'white',
   //       align: 'left',
   //       stroke: 'rgba(0,0,0,0)',
   //       srokeThickness: 4
   //    };
   //    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
   //    txt.anchor.setTo(0.5);
   //    txt.stroke = "rgba(0,0,0,0";
   //    txt.strokeThickness = 4;
   //    var onOver = function(target) {
   //       target.fill = "#FEFFD5";
   //       target.stroke = "rgba(200,200,200,0.5)";
   //       txt.useHandCursor = true;
   //    };
   //    var onOut = function(target) {
   //       target.fill = "white";
   //       target.stroke = "rgba(0,0,0,0)";
   //       txt.useHandCursor = false;
   //    };
   //    //txt.useHandCursor = true;
   //    txt.inputEnabled = true;
   //    txt.events.onInputUp.add(callback, this);
   //    txt.events.onInputOver.add(onOver, this);
   //    txt.events.onInputOut.add(onOut, this);
   //
   //    this.optionCount++;
   //
   // }
};
