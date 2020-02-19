let Camara;
let poseNet;
let poses = [];
let emoji = [];
let EmojiX;
let EmojiY;
let MiEmoji = [];
let Personas = 0;
let CanvasDibujos;

let yolo;
let objects = [];


function setup(){
  CanvasDibujos = createCanvas(640,480);
  emoji[0] = loadImage('poop.png');
  emoji[1] = loadImage('pigst.png');
  emoji[2] = loadImage('triste.png');
  emoji[3] = loadImage('diablo.png');
  emoji[4] = loadImage('gallina.png');



  Camara = createCapture(VIDEO);
  Camara.size(width, height);
  Camara.hide();

  poseNet = ml5.poseNet(Camara, ModeloListo);
  // Create a YOLO method
  yolo = ml5.YOLO(Camara, startDetecting);

  poseNet.on('pose',function(results){
    poses = results;
  });

}

function drawYolo() {
  //image(Camara, 0, 0, width, height);
  for (let i = 0; i < objects.length; i++) {
    noStroke();
    fill(0, 255, 0);
    text(objects[i].label, objects[i].x * width, objects[i].y * height - 5);
  console.log(objects[i].label);
    noFill();
    strokeWeight(4);
    stroke(0, 255, 0);
    rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
  }
}
function startDetecting() {
  detect();
}

function detect() {
  yolo.detect(function(err, results) {
    objects = results;

    detect();
  });
}

function draw(){
  image(Camara,0,0,width,height);
  drawKeypoints();
  drawSkeleton();
  //DibujarEmoji();
  drawYolo();
}

function ModeloListo(){
  console.log("Modelo Listo");
  select('#status').html('Modelo Listo');
}

function DibujarEmoji(){
  push();

  if (Personas != poses.length) {
    Personas = poses.length;
    for (let i = 0; i < Personas; i++) {
      MiEmoji[i] = int(random(emoji.length));
    }
  }

  for (let i = 0; i < poses.length; i++) {
    let PoseActual = poses[i].pose;
    fill(255,255,0);
    noStroke();
    //ellipse(PoseActual.nose.x,PoseActual.nose.y,20,20);
    imageMode(CENTER);
    /*EmojiY = PoseActual.nose.y;
    Emojix = PoseActual.nose.x;*/
    let D = dist(PoseActual.rightEar.x,PoseActual.rightEar.y,PoseActual.leftEar.x,PoseActual.leftEar.y);
    //Tamaño 0.4
    image(emoji[MiEmoji[i]],PoseActual.nose.x,PoseActual.nose.y,D*1.35,D*1.35);
  }
  pop();
}

function drawKeypoints() {
  //ssconsole.log("Candida de personas" + poses.length);
  for (let i = 0; i < poses.length; i++) {

    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.5) {
        fill(255, 255, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 20, 20);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function keyPressed(){
    if(key === 'f'){
      console.log("Tomar foto");
      saveCanvas(CanvasDibujos,'Emoji'+random(255),'jpg')
    }
}
