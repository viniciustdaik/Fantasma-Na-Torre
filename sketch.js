var towerImg, tower;
var doorImg, door, doorsGroup;
var climberImg, climber, climbersGroup;
var ghost, ghostImg, ghostImg2, ghostImg2_2, ghostImg_2;
var invisibleBlockGroup, invisibleBlock, spookySound;
var gameState = "play";
var edges;
var score = 0;
var highscore = 0;
var left = false;
var right = false;

function preload(){
  towerImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadAnimation("ghost-standing.png");
  spookySound = loadSound("spooky.wav");
  ghostImg2 = loadAnimation("ghost-jumping.png");
  ghostImg_2 = loadAnimation("ghost-standing_2.png");
  ghostImg2_2 = loadAnimation("ghost-jumping_2.png");
}

function setup() {
  createCanvas(600, 600);
  tower = createSprite(300,300);
  tower.addImage("tower",towerImg);
  tower.velocityY = 1;
  
  ghost = createSprite(200, 200, 50, 50);
  ghost.addAnimation("standing", ghostImg);
  ghost.addAnimation("jumping", ghostImg2);
  ghost.addAnimation("jumping2", ghostImg2_2);
  ghost.addAnimation("standing2", ghostImg_2);
  ghost.scale = 0.3;
  ghost.setCollider("rectangle", -25, +30, 25, 245);
  //ghost.debug = true;
  
  spookySound.loop();
  
  doorsGroup = new Group();
  climbersGroup = new Group();
  invisibleBlockGroup = new Group();

  edges = createEdgeSprites();
}

function draw() {
  background('black');
  if(keyWentUp("left_arrow")||keyWentUp("A")){
      left = false;
    }
  if(keyWentUp("right_arrow")||keyWentUp("D")){
      right = false;
    }
  if(left == true&&ghost.velocityY >= 0.8){
    ghost.changeAnimation("standing", ghostImg);
    ghost.setCollider("rectangle", -25, +30, 25, 245);
  }
  if(right == true&&ghost.velocityY >= 0.8){
    ghost.changeAnimation("standing2", ghostImg_2);
    ghost.setCollider("rectangle", +25, +30, 25, 245);
  }
  if(gameState == "play"){
    createDoor();
    score = score+Math.round(getFrameRate()/30);
    
    if(keyDown("left_arrow")||keyDown("A")){
      ghost.x = ghost.x-3;
      left = true;
    }
    if(keyDown("right_arrow")||keyDown("D")){
      ghost.x = ghost.x+3;
      right = true;
    }
    if(keyDown("left_arrow")&&keyDown("right_arrow")
    ||keyDown("D")&&keyDown("A")
    ||keyDown("D")&&keyDown("left_arrow")
    ||keyDown("A")&&keyDown("right_arrow")){
      right = false;
      left = false;
    }
    if(keyDown("space")||keyDown("up_arrow")||keyDown("W")){
      ghost.velocityY = -10;
      if(left == true){
        ghost.changeAnimation("jumping", ghostImg2);
        ghost.setCollider("rectangle", -25, +30, 25, 245);
      }
      if(right == true){
        ghost.changeAnimation("jumping2", ghostImg2_2);
        ghost.setCollider("rectangle", +25, +30, 25, 245);
      }
    }
    ghost.velocityY = ghost.velocityY+0.8;
    //if(ghost.velocityY >= 0.8){
    //  ghost.changeAnimation("standing", ghostImg);
    //}
  }
  if(tower.y > 600){
      tower.y = 0;
    }
  if(climbersGroup.isTouching(ghost)){
    ghost.velocityY = 0;
    if(left == true){
      ghost.changeAnimation("standing", ghostImg);
      ghost.setCollider("rectangle", -25, +30, 25, 245);
    }
    if(right == true){
      ghost.changeAnimation("standing2", ghostImg_2);
      ghost.setCollider("rectangle", +25, +30, 25, 245);
    }
  }
  if(invisibleBlockGroup.isTouching(ghost)||ghost.y >600||ghost.isTouching(edges[0])||ghost.isTouching(edges[1])){
    //ghost.destroy();
    ghost.visible = false;
    ghost.velocityY = 0;
    gameState = "end";
  }
  if(gameState == "end"){
  tower.visible = false;
  doorsGroup.destroyEach();
  climbersGroup.destroyEach();
  invisibleBlockGroup.destroyEach();
  textSize(25);
  fill('cyan');
  text("Clique Para Jogar De Novo.", 150 ,160);
  textSize(25);
  fill('gold');
  text("Pontuação: "+score, 210, 220);
  textSize(25);
  fill('gold');
  text("Melhor Pontuação: "+highscore, 185, 190);
  textSize(25);
  fill('red');
  text("Fim De Jogo.", 230, 250);
  if(mousePressedOver(tower)||mousePressedOver(ghost)){
    reset();
  }
}
  console.log(gameState);
  console.log("left: "+left);
  console.log("right: "+right);
  drawSprites();
}



function createDoor(){
  if(frameCount%240==0){
    door = createSprite(200, -50);
    door.addImage("door", doorImg);
    door.x = Math.round(random(120, 400));
    door.velocityY = 1;
    door.lifetime = 800;
    door.depth = ghost.depth;
    ghost.depth = ghost.depth+1;
    climber = createSprite(200, 10);
    climber.addImage("climber", climberImg);
    climber.x = door.x;
    climber.velocityY = 1;
    climber.lifetime = 800;
    invisibleBlock = createSprite(200, 15);
    invisibleBlock.visible = false;
    invisibleBlock.width = climber.width;
    invisibleBlock.height = 2;
    invisibleBlock.velocityY = 1;
    invisibleBlock.x = door.x;
    //invisibleBlock.debug = true;
    invisibleBlockGroup.add(invisibleBlock);
    climbersGroup.add(climber);
    doorsGroup.add(door);
  }
}

function reset(){
  if(score>highscore){
    highscore = score;
  }
  tower.visible = true;
  score = 0;
  gameState = "play";
  ghost.x = 200;
  ghost.y = 200;
  ghost.visible = true;
  
}


