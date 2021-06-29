var PLAY = 1;
var END = 0;
var Over=2;
var gameState = PLAY;


var prince, princeRunning, princeCollided;
var ground;

var obstaclesGroup;

var score = 0;
var gameOverImg,restartImg,endImage,end,flag,flagImage, lampImg, treeImg, fortImg, dragonImg;
var jumpSound , checkPointSound, dieSound, bgSound;

function preload(){
  //loading animations for prince
  princeRunning = loadAnimation("image/b1.png","image/b2.png","image/b3.png",'image/b4.png','image/b5.png');
  princeCollided = loadAnimation("image/co6.png","image/co1.png","image/co2.png","image/co3.png",
	"image/co4.png","image/co5.png","image/co7.png","image/co8.png","image/co9.png",
	"image/co10.png","image/co11.png","image/co12.png","image/co13.png");
  
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
  // creating prince 
  prince = createSprite(100,220,10,10);
  prince.addAnimation("running", princeRunning);
  prince.addAnimation("collided", princeCollided);
  prince.setCollider("rectangle",0,0,150,250);
  prince.scale = 0.5;
  

  ground = createSprite(width/2,height-20,width*100,10);
  ground.visible= false;
  
  gameOver = createSprite(width/2-50,height/2,200,200);
  gameOver.addAnimation("Over",gameOverImg);
  gameOver.scale = 1;
  
  restart = createSprite(camera.position.x -100,100);
  restart.addImage(restartImg);
  restart.debug = false;
  restart.scale = 0.5;
  
  end = createSprite(600,200);
  end.addAnimation("the end",endImage);
  end.scale=1.5;

  fort = createSprite(10000,250);
  fort.addImage(fortImage);
  fort.scale=1;
  
  bgSound.loop()


  obstaclesGroup = createGroup();
 lampGroup = createGroup();
  
  score = 0;

 
}

function draw() {
  
  background(bgImg);  

  camera.position.x = prince.x;

  console.log(prince.x);

 ground.x=camera.position.x;
  ground.x=camera.position.x;



  end.x=camera.position.x;
  restart.x=camera.position.x-500;
  gameOver.x=camera.position.x-25;

  //displaying score
  fill("white")
  textFont("copperplate gothic");
  textSize(25);
  text("YOUR SCORE: "+ score,camera.position.x-350,28);

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    end.visible=false;

    //scoring
    score = score + Math.round(getFrameRate()/160);
    
  
    

    //jump when the space key is pressed
    if(keyDown("UP_ARROW")) {
      prince.velocityY = -20;
        jumpSound.play();
    }

    if(keyDown(RIGHT_ARROW)){
      prince.x= prince.x+20;
      score++
     
    }
    
    //add gravity
    prince.velocityY = prince.velocityY + 1.5
  
    //spawn the lamps
    spawnlamps();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(prince)){
        
        gameState = END;
        dieSound.play();
    }

    if(prince.x>9990){
      gameState=Over;
      checkPointSound.play()
    }

  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     prince.changeAnimation("collided", princeCollided);
    prince.scale=0.5
     prince.velocityY = 0
     prince.velocityX=0;
      ground.velocityX=0;
     
    
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
   var obstacle = createSprite(camera.position.x +800,410,10,40);
   obstacle.velocityX =0;
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addAnimation("firef",fireImg);
              obstacle.scale = 0.4;
              break;
      case 2: obstacle.addAnimation("dragon1",dragonImg);
              obstacle.scale=1.5
              break;
      
      default: break;
    }
   
         
    
    obstacle.lifetime = 800;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnlamps() {
  //write code here to spawn the lamps and trees
  if (frameCount % 160 === 0) {
    var lamp = createSprite(camera.position.x+Math.round(random(850,1000)),350,40,10);
   
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: lamp.addImage(lampImg);
              lamp.scale = 0.5;
              break;
      case 2: lamp.addImage(treeImg)
             lamp.scale= 0.93
              break;
      
      default: break;
    }
    
    lamp.velocityX = 0;
    
    
    //adjust the depth
    lamp.depth = prince.depth;
    prince.depth = prince.depth + 1;
    
    //add each cloud to the group
    lampGroup.add(lamp);
  }
}

