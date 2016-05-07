var game = new Phaser.Game(800, 650, Phaser.AUTO, '', {
                                                         preload: preload,
                                                         create: create,
                                                         update: update,
                                                         render: render
                                                        });


function preload() {
//Using already provided png files from the phaser master zip file
//I have decided to use 6 total objects from them, 4 images and 2 sprites
//Be sure to always specify its a spritesheet and not an image other wise
//animations will not function.
  game.load.spritesheet('collector', 'assets/metalslug_monster39x40.png', 39, 40);
  game.load.image('ground', 'assets/ground_1x1.png');
  game.load.image('levelOne', 'assets/level1.png');
  game.load.image('scifiTiles', 'assets/sci-fi-tiles.png');
  game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
  game.load.image('pepper', 'assets/pepper.png');

}
//The variables I am using for this game are here

var coins;
var collector;
var cursors;
var pepper;
var platforms;
var Phaser;
var score = 0;
var scoreText;

//Within this function is the creation of the game, adding physics, sprites,
//animations, colors and backgrounds to the game.
function create() {
//enabling the arcade physics system for this amateur game.
  game.physics.startSystem(Phaser.Physics.ARCADE);
//adding levelOne giving it a bit of flare to the games as a background
//with its positioning at 0,0 this just centers it.
  game.add.sprite(0, 0, 'levelOne');

//using this method comes the creation of a few jump spots.
//side note- place s on platforms.
//grouping these allows for more than one creation of platforms, if I understood correctly
  platforms = game.add.group();
  platforms.enableBody = true;

// creating the games ground floor
  var ground = platforms.create(0, game.world.height - 64, 'ground');

// Scale the ground to fit the width of game
// without this being true, well there won't be a character on the ground, more
// like under it
  ground.scale.setTo(7, 7);
  ground.body.immovable = true;


// the creation of a few ledges with scifiTiles and ground 1x1 to create jump
//locations
  var ledge = platforms.create(450, 555, 'scifiTiles');
  ledge.body.immovable = true;

  ledge = platforms.create(200, 300, 'scifiTiles');
  ledge.body.immovable = true;

  ledge = platforms.create(-500, 150, 'ground');
  ledge.body.immovable = true;

  ledge = platforms.create(500, 450, 'ground');
  ledge.body.immovable = true;
//The creation of our lovely little pepper that bounces around
//side note - When able to find time, figure out a way to kill the player
//with the pepper
  pepper = game.add.sprite(130, game.world.height - 500, 'pepper');
  game.physics.arcade.enable(pepper);
  pepper.enableBody = true;

//create the character we will play as.
  collector = game.add.sprite(39, game.world.height - 150, 'collector');
  game.physics.arcade.enable(collector);


//physics of collector properties, allowing a slight bounce
  collector.body.bounce.y = 0.2;
  collector.body.gravity.y = 300;
  collector.body.collideWorldBounds = true;
//this is the physics of our consistently bouncing pepper
  pepper.body.bounce.y = 1.0;
  pepper.body.gravity.y = 1500;
  pepper.body.collideWorldBounds = true;

//player animations walking left and right
  collector.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8], 32, true);
  collector.animations.add('right', [9, 10, 11, 12, 13, 14, 15], 32, true);

//this is the score of the collector with the font size of 32px and white lettering
  scoreText = game.add.text(15, 15, 'score: ', { fontSize: '32px', fill: 'white'});

//adding the coin group to create a total of 12 coins right away using for
  coins = game.add.group();
  coins.enableBody = true;

  for (var i = 0; i < 12; i++) {
//this is what gives our coins a random location
    var coin = coins.create(game.world.randomX, game.world.randomY, 'coin', 0);
    coin.body.gravity.y = 6;
    createMoreCoins();
    coin.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

//this calls the spin animation for the coins
  coins.callAll('animations.add', 'animations', 'spin', [0,1,2,3,4,5], 10, true);
  coins.callAll('animations.play', 'animations', 'spin');

//This is the input from the users, cursors and clicking the screen
//Collector movement
  cursors = game.input.keyboard.createCursorKeys();
//Random coin production with the click of a screen
  game.input.onTap.add(createMoreCoins, this);
}

function update() {
//collide the collector, pepper and with the map
//to avoid falling through
  game.physics.arcade.collide(collector, platforms);
  game.physics.arcade.collide(coins, platforms);
  game.physics.arcade.collide(pepper, platforms);
  game.physics.arcade.collide(pepper, collector);
  game.physics.arcade.overlap(collector, coins, collectCoin, null, this);

//reset the players velocity (movement)
  collector.body.velocity.x = 0;
  if (cursors.left.isDown) {
//move to the left
      collector.body.velocity.x = -150;
      collector.animations.play('left');
  } else if (cursors.right.isDown) {
//move to the right
      collector.body.velocity.x = 150;
      collector.animations.play('right');
  } else {
//stand still
      collector.animations.stop();
      collector.frame = 4;
  }

//allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && collector.body.touching.down) {
      collector.body.velocity.y = -350;
  }
//with this little function, there is point value added to the coins
//when the collector walks through them.
function collectCoin (collector, coin) {
  coin.kill();
  score += 10;
  scoreText.text = 'Score: ' + score;
}


}

//this is when the coins will be created randomly when function is called
//calling coin animations as well
function createMoreCoins() {
  coins.create(game.world.randomX, game.world.randomY, 'coin', 0);
  coins.callAll('animations.add', 'animations', 'spin', [0,1,2,3,4,5], 10, true);
  coins.callAll('animations.play', 'animations', 'spin');
}

// this is just pointing out to the user that when and if they collect all the
//coins
//they can click on the screen to produce more coins
function render() {
  game.debug.text('Click or tap the screen to create new coins to collect.', 16, 24);
}
