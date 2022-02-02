var towerImg, tower;
var doorImg, door, doorsGroup;
var climberImg, climber, climbersGroup;
var ghost, ghostImg, ghostImg2, ghostImg2_2, ghostImg_2;
var invisibleBlockGroup, invisibleBlock, spookySound;
var gameState = "play";
var edges;
var score = 0;
var highscore = 0;
var left = true;
var right = false;
var left_arrow_button, left_arrow_buttonimg, 
right_arrow_button, right_arrow_buttonimg,
up_arrow_button, up_arrow_buttonimg;

function preload(){
  towerImg = loadImage("longer_width&height_tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadAnimation("ghost-standing.png");
  spookySound = loadSound("spooky.wav");
  ghostImg2 = loadAnimation("ghost-jumping.png");
  ghostImg_2 = loadAnimation("ghost-standing_2.png");
  ghostImg2_2 = loadAnimation("ghost-jumping_2.png");
  left_arrow_buttonimg = loadImage("left_arrow.png");
  right_arrow_buttonimg = loadImage("right_arrow.png");
  up_arrow_buttonimg = loadImage("up_arrow.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  tower = createSprite(width/2, height/2);
  tower.addImage("tower",towerImg);
  tower.velocityY = 1;
  
  left_arrow_button = createSprite(width/2-85, height-55, 15, 15);
  left_arrow_button.addImage("left_arrowimg", left_arrow_buttonimg);
  //left_arrow_button.scale = 1.5; width/2-125, height-65
  
  right_arrow_button = createSprite(width/2+85, height-55, 15, 15);
  right_arrow_button.addImage("right_arrowimg", right_arrow_buttonimg);
  //right_arrow_button.scale = 1.5; width/2+125, height-65
  
  up_arrow_button = createSprite(width/2, height-55, 15, 15);
  up_arrow_button.addImage("up_arrowimg", up_arrow_buttonimg);
  //up_arrow_button.scale = 1.5; width/2, height-65
  
  ghost = createSprite(width/2, height/2, 50, 50);
  ghost.addAnimation("standing", ghostImg);
  ghost.addAnimation("jumping", ghostImg2);
  ghost.addAnimation("jumping2", ghostImg2_2);
  ghost.addAnimation("standing2", ghostImg_2);
  ghost.scale = 0.3;
  ghost.setCollider("rectangle", -25, +30, 25, 245);
  //ghost.debug = true;
  
  //spookySound.loop();
  
  doorsGroup = new Group();
  climbersGroup = new Group();
  invisibleBlockGroup = new Group();

  edges = createEdgeSprites();
}

function draw() {
  textAlign("center");
  background('black');
  
  /*if(keyWentUp("left_arrow")||keyWentUp("A")){
      left = false;
    }
  if(keyWentUp("right_arrow")||keyWentUp("D")){
      right = false;
    }*/
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
    
    if(keyDown("left_arrow")||keyDown("A")){//||mousePressedOver(left_arrow_button)){
      ghost.x = ghost.x-3;
      left = true;
      right = false
    }else if(mouseIsOver(left_arrow_button)){
      ghost.x = ghost.x-3;
      left = true;
      right = false;
    }
    if(keyDown("right_arrow")||keyDown("D")){//||mousePressedOver(right_arrow_button)){
      ghost.x = ghost.x+3;
      right = true;
      left = false;
    }else if(mouseIsOver(right_arrow_button)){
      ghost.x = ghost.x+3;
      left = false;
      right = true;
    }
    
    if(keyDown("left_arrow")&&keyDown("right_arrow")
    ||keyDown("D")&&keyDown("A")
    ||keyDown("D")&&keyDown("left_arrow")
    ||keyDown("A")&&keyDown("right_arrow")){
      right = false;
      left = false;
    }
    if(keyDown("space")||keyDown("up_arrow")||keyDown("W")||mouseIsOver(up_arrow_button)){//||mousePressedOver(tower)||mousePressedOver(ghost)){||touches.length > 0){
      ghost.velocityY = -10;
      //touches = [];
      if(left == true){
        ghost.changeAnimation("jumping", ghostImg2);
        ghost.setCollider("rectangle", -25, +30, 25, 245);
      }
      if(right == true){
        ghost.changeAnimation("jumping2", ghostImg2_2);
        ghost.setCollider("rectangle", +25, +30, 25, 245);
      }
      //if(right == false&&left == false){
      //  ghost.changeAnimation("jumping", ghostImg2);
      //  ghost.setCollider("rectangle", -25, +30, 25, 245);
      //}
    }
    ghost.velocityY = ghost.velocityY+0.8;
    //if(ghost.velocityY >= 0.8){
    //  ghost.changeAnimation("standing", ghostImg);
    //}
  }
  
  console.log("Height: "+windowHeight); 
  console.log("Width: "+windowWidth);

  if(tower.y > 864){//600
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
  if(invisibleBlockGroup.isTouching(ghost)||ghost.isTouching(edges[3])||ghost.isTouching(edges[0])||ghost.isTouching(edges[1])){
    //ghost.destroy();
    tower.visible = false;
    ghost.visible = false;
    ghost.velocityY = 0;
    gameState = "end";
  }
  if(gameState == "end"){
  tower.visible = false;
  ghost.visible = false;
  left_arrow_button.visible = false;
  right_arrow_button.visible = false;
  up_arrow_button.visible = false;
  doorsGroup.destroyEach();
  climbersGroup.destroyEach();
  invisibleBlockGroup.destroyEach();
  textSize(25);
  fill('cyan');
  stroke('green');
  text("Toque/Clique Para Jogar De Novo.", windowWidth/2, windowHeight/2-160);//150, 160
  textSize(25);
  fill('gold');
  text("Pontuação: "+score, windowWidth/2, windowHeight/2-220);//210, 220
  textSize(25);
  fill('gold');
  text("Melhor Pontuação: "+highscore, windowWidth/2, windowHeight/2-190);//185, 190
  textSize(25);
  fill('red');
  stroke('darkred');
  text("Fim De Jogo.", windowWidth/2, windowHeight/2-250);//230, 250
  if(mousePressedOver(tower)||mousePressedOver(ghost)||touches.length > 0
  ||mousePressedOver(up_arrow_button)||mousePressedOver(right_arrow_button)||mousePressedOver(left_arrow_button)){
    touches = [];
    reset();
  }
}
  console.log(gameState);
  console.log("left: "+left);
  console.log("right: "+right);
  console.log("ghostX: "+ghost.x);
  drawSprites();
}



function createDoor(){
  if(frameCount%240==0){
    door = createSprite(200, -50);
    door.addImage("door", doorImg);
    door.x = Math.round(random(265, 1285));
    door.velocityY = 1;
    door.lifetime = 950;
    door.depth = ghost.depth;
    ghost.depth = ghost.depth+1;
    climber = createSprite(200, 10);
    climber.addImage("climber", climberImg);
    climber.x = door.x;
    climber.velocityY = 1;
    climber.lifetime = 950;
    invisibleBlock = createSprite(200, 15);
    invisibleBlock.visible = false;
    invisibleBlock.width = climber.width;
    invisibleBlock.lifetime = 950;
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
  ghost.x = width/2;
  ghost.y = height/2;
  ghost.visible = true;
  left_arrow_button.visible = true;
  right_arrow_button.visible = true;
  up_arrow_button.visible = true;
  
}


