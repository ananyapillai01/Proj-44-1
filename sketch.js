
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var engine, world;
var boy, boy_running;
var obstaclesGroup, obstacle;
var fruitsGroup, fruit1, fruit2, fruit3, fruit4, fruit5;
var ground, invisibleGround;
var restart, restartImage;
var gameOver, gameOverImage;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var database;

function preload()
{
	boy_running = loadImage('Boy.png');

  ground = loadImage('Background1.png');

  fruit1 = loadImage('Apple.png');
  fruit2 = loadImage('Litchi.jpg');
  fruit3 = loadImage('Mango.jpg');
  fruit4 = loadImage('Orange.jpeg');
  fruit5 = loadImage('Strawberry.jpg');

  obstacle = loadImage('Stone.png');

  restartImage = loadImage('Restart.png');

  gameOverImage = loadImage('Gameover.png');
}

function setup() {
	createCanvas(displayWidth - 20, displayHeight - 30);
	engine = Engine.create();
	world = engine.world;

  	boy = createSprite(200, 200,20,50);
  	boy.addImage("running", boy_running);
  	boy.scale = 0.5;

    invisibleGround = createSprite(200,190,10,40);
    invisibleGround.visible = false;

	  restart = createSprite(200, 200, 20,20);
	  restart.addImage(restartImage);
	  restart.scale = 0.5;
	  restart.visible = false;
	  
	  gameOver = createSprite(300, 100, 20, 20);
	  gameOver.addImage(gameOverImage);
	  gameOver.scale = 0.5;
	  gameOver.visible = false;
  
	Engine.run(engine);
  
	fruitsGroup = new Group();
  obstaclesGroup = new Group();
  
  	score = 0;
}

function draw() {
  background(ground);
  camera.position.x = boy.x;
  camera.position.y = boy.y;

  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY) {
      score = score + Math.round(getFrameRate()/60);
    
      if(keyDown("space")) {
        boy.velocityY = -10;
      }
  
      boy.velocityY = boy.velocityY + 0.8

      spawnObstacles();
      spawnFruits();
      reset();
    
    if(obstaclesGroup.isTouching(boy)) {
       gameState = END;
    }

     }
  else if(gameState === END) {
    boy.velocityY = 0;
    
    fruitsGroup.setVelocityYEach(0);
    obstaclesGroup.setVelocityYEach(0);

    fruitsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
  
    restart.visible = true;
    gameOver.visible = true;} 
    
    boy.collide(invisibleGround);

    if(mousePressedOver(restart)) {
      reset();
    }
  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 30 === 0) {
    var obstacle = createSprite(200,200,40,10);
    obstacle.x = Math.round(random(80,120));
    obstacle.addImage(obstacle);
    obstacle.scale = 0.5;
    obstacle.velocityY = 3;
 
    obstacle.lifetime = 220;
    
    obstacle.depth = boy.depth;
    boy.depth = boy.depth + 1;
    
    ostaclesGroup.add(obstacle);
  }
  
}

function spawnFruits() {
  if(frameCount % 40 === 0) {
    var fruit = createSprite(200, 200, 10, 40);
    fruit.velocityY = -4;

    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: fruit.addImage(fruit1);
              break;
      case 2: fruit.addImage(fruit2);
              break;
      case 3: fruit.addImage(fruit3);
              break;
      case 4: fruit.addImage(fruit4);
              break;
      case 5: fruit.addImage(fruit5);
              break;
      default: break;
    }

    fruit.scale = 0.5;
    fruit.lifetime = 100;
    fruitsGroup.add(fruit);
  }
}

function update(state)
{
  database.ref('/').update({
    gameState: state
  });
}

function reset(){
	gameState = PLAY;
	
	gameOver.visible = false;
	restart.visible = false;
	
	obstaclesGroup.destroyEach();
	fruitsGroup.destroyEach();
	
	score = 0;
	
  }
