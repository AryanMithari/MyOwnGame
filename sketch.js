var PLAY = 1;
var END = 0;
var Over=2;
var gameState = PLAY;


var prince, princeRunning, princeCollided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg,endImage,end,flag,flagImage;
var jumpSound , checkPointSound, dieSound

function preload(){
  princeRunning = loadAnimation("image/b1.png","image/b2.png","image/b3.png",'image/b4.png','image/b5.png');
  princeCollided = loadAnimation("image/co6.png","image/co1.png","image/co2.png","image/co3.png",
	"image/co4.png","image/co5.png","image/co7.png","image/co8.png","image/co9.png",
	"image/co10.png","image/co11.png","image/co12.png","image/co13.png");
  
  // groundImage = loadImage("ground2.png");
  
  // cloudImage = loadImage("cloud.png");
  treeImg= loadImage('image/tree.png')
  bgImg= loadImage('image/bg.png')
  
  fireImg = loadAnimation("image/f1.gif");
  dragonImg=loadAnimation("image/d1.png",'image/d2.png','image/d3.png')
  
  restartImg = loadImage("image/reset.png");
  gameOverImg = loadAnimation("image/over.gif");
  endImage=loadAnimation("image/end.gif");
  fortImage = loadImage("image/fort.png")
  lampImg= loadImage("image/l1.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("gameover.mp3")
  checkPointSound = loadSound("gamend.mp3")
  bgSound= loadSound("bgm.mp3")

}

function setup() {
  createCanvas(1200,500);

  prince = createSprite(0,460,20,50);
  prince.addAnimation("running", princeRunning);
  prince.addAnimation("collided", princeCollided);
  
  prince.scale = 0.5;
  
  ground = createSprite(600,480,1200,20);
  ground.visible= false
  

  gameOver = createSprite(600,200);
  gameOver.addAnimation("Over",gameOverImg);
  
  restart = createSprite(60,70);
  restart.addImage(restartImg);
  
  end = createSprite(600,200);
  end.addAnimation("the end",endImage);
  end.scale=2;

  fort = createSprite(7000,250);
  fort.addImage(fortImage);
  fort.scale=1.5;
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  bgSound.loop()

  
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
 lampGroup = createGroup();

  
  prince.setCollider("rectangle",0,0,prince.width,prince.height);
  
  score = 0;

 
}

function draw() {
  
  background(bgImg);  

  camera.position.x = prince.x;

  console.log(prince.x);

 ground.x=camera.position.x;
  ground.x=camera.position.x;

  end.x=camera.position.x;
  restart.x=camera.position.x+150;
  gameOver.x=camera.position.x+150;

  //displaying score
  fill("black")
  text("Score: "+ score,camera.position.x+100,15);

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    end.visible=false;

    //scoring
    //score = score + Math.round(getFrameRate()/60);
    
  
    

    //jump when the space key is pressed
    if(keyDown("UP_ARROW")) {
      prince.velocityY = -20;
        jumpSound.play();
    }

    if(keyDown(RIGHT_ARROW)){
      prince.x= prince.x+12;
      score++
     
    }
    
    //add gravity
    prince.velocityY = prince.velocityY + 1
  
    //spawn the clouds
    spawnlamps();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(prince)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play();
    }

    if(prince.x>6990){
      gameState=Over;
      checkPointSound.play()
    }

  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
     prince.changeAnimation("collided", princeCollided);
    prince.scale=3
     prince.velocityY = 0
     prince.velocityX=0;
      ground.velocityX=0;
     
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    lampGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     lampGroup.setVelocityXEach(0); 

   }else if(gameState===Over){
   
    obstaclesGroup.destroyEach();
    lampGroup.destroyEach();
    prince.destroy();
    fort.destroy();
    end.visible=true;
    bgSound.stop()
   }

   
  
 
  //stop trex from falling down
  prince.collide(ground);
  
  if(mousePressedOver(restart)) {
      reset();
    }


    drawSprites();    
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  lampGroup.destroyEach();
  prince.changeAnimation("running",princeRunning);
  score=0;
  prince.x=0;
  prince.scale=0.5

}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(camera.position.x +800,470,10,40);
   obstacle.velocityX =0;
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(fireImg);
              obstacle.scale = 0.4;
              break;
      case 2: obstacle.addAnimation("dragon1",dragonImg);
              obstacle.scale=1.5
              break;
      
      default: break;
    }
   
         
    
    //obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnlamps() {
  //write code here to spawn the clouds
  if (frameCount % 160 === 0) {
    var lamp = createSprite(camera.position.x+Math.round(random(850,1000)),380,40,10);
    // cloud.y = Math.round(random(20,80));
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: lamp.addImage(lampImg);
              lamp.scale = 0.5;
              break;
      case 2: lamp.addImage(treeImg)
             lamp.scale=0.8
              break;
      
      default: break;
    }
    
    lamp.velocityX = 0;
    
     //assign lifetime to the variable
    //cloud.lifetime = 200;
    
    //adjust the depth
    lamp.depth = prince.depth;
    prince.depth = prince.depth + 1;
    
    //add each cloud to the group
    lampGroup.add(lamp);
  }
}

