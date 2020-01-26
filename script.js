var FIELD_WIDTH = 400;
var FIELD_LENGTH = 400;
var FIELD_HEIGHT = 100;
var PONG_RADIUS = 10;
var BAR_WIDTH = FIELD_WIDTH/4;
var BAR_HEIGHT = FIELD_HEIGHT/3;
var barSpeedX = BAR_WIDTH/2.5;
var barSpeedY = BAR_HEIGHT;
var isRunning = false;
var lifeBoard = document.getElementById('lifeBoard');
var resultBoard = document.getElementById('resultBoard');
var life = [7,7];
var starTime;
var endTime;
var bestTime = 0;
var HITING = 1;
var barRotation = 0;

var views = ["topView","frontView","thirdPersonView"];
var actualView = 0;

var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);

var listener = new THREE.AudioListener();
camera.add( listener );

var pongSound = new THREE.Audio( listener );
var pongDragonSound = new THREE.Audio( listener );

var backgroundSound = new THREE.Audio( listener );

var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'sounds/pong.wav', function( buffer ) {
	pongSound.setBuffer( buffer );
	pongSound.setVolume( 1 );
});
audioLoader.load( 'sounds/dragon.wav', function( buffer ) {
	pongDragonSound.setBuffer( buffer );
	pongDragonSound.setVolume( 1 );
});
audioLoader.load( 'sounds/background.wav', function( buffer ) {
	backgroundSound.setBuffer( buffer );
    backgroundSound.setVolume( 0.1 );
    backgroundSound.play();
});

var textureLoader = new THREE.TextureLoader();

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();

var scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader({color: 0xffdddd });

var light = new THREE.AmbientLight( 0x404040 );
scene.add( light );

var group = new THREE.Group();
scene.add(group);

var fieldMaterial = new THREE.MeshStandardMaterial();
var field = new THREE.Mesh(new THREE.BoxGeometry(FIELD_WIDTH,FIELD_LENGTH,3), fieldMaterial);
field.lookAt(0,10,0);
field.position.y = -FIELD_HEIGHT/2-10;
field.rotateZ(1.57);
scene.add(field);

var wallMaterial = new THREE.MeshStandardMaterial();
var wall = new THREE.Mesh(new THREE.BoxGeometry(FIELD_WIDTH,FIELD_HEIGHT,3), wallMaterial);
wall.lookAt(10,0,0);
wall.position.x = FIELD_WIDTH/2;
scene.add(wall);

var barMaterial = new THREE.MeshStandardMaterial();
var bar1 = new THREE.Mesh(new THREE.BoxGeometry(BAR_WIDTH,BAR_HEIGHT,3), barMaterial);
bar1.position.z = -FIELD_LENGTH/2;
group.add(bar1);
var bar2 = new THREE.Mesh(new THREE.BoxGeometry(BAR_WIDTH,BAR_HEIGHT,3), barMaterial);
bar2.position.z = FIELD_LENGTH/2;
group.add(bar2);

var pongMaterial = new THREE.MeshStandardMaterial();
var pong = new THREE.Mesh(new THREE.SphereGeometry(PONG_RADIUS,10,10), pongMaterial);
scene.add(pong);
var projo1 = new THREE.SpotLight( 'white', 0.2 );
projo1.position.set(FIELD_WIDTH/2,FIELD_HEIGHT/2,FIELD_LENGTH/2);
projo1.lookAt(pong);
projo1.castShadow = true;
scene.add( projo1 );
var projo2 = new THREE.SpotLight( 'white', 0.2 );
projo2.position.set(FIELD_WIDTH/2,FIELD_HEIGHT/2,-FIELD_LENGTH/2);
projo2.lookAt(pong);
projo2.castShadow = true;
scene.add( projo2 );
var projo3 = new THREE.SpotLight( 'white', 0.2 );
projo3.position.set(-FIELD_WIDTH/2,FIELD_HEIGHT/2,FIELD_LENGTH/2);
projo3.lookAt(pong);
projo3.castShadow = true;
scene.add( projo3 );
var projo4 = new THREE.SpotLight( 'white', 0.2 );
projo4.position.set(-FIELD_WIDTH/2,FIELD_HEIGHT/2,-FIELD_LENGTH/2);
projo4.lookAt(pong);
projo4.castShadow = true;
scene.add( projo4 );

function axes(){
    var axesHelper = new THREE.AxesHelper( 50 );
    scene.add( axesHelper );

    var bar1AxesHelper = new THREE.AxesHelper( 50 );
    bar1.add( bar1AxesHelper );
    var bar2AxesHelper = new THREE.AxesHelper( 50 );
    bar2.add( bar2AxesHelper );
}
//axes();
function topView(){
    camera.position.z = 0;
    camera.position.y = 500;
    camera.position.x = 0;
    camera.lookAt(0,0,0);
    camera.rotateZ(-1.57);
}
function frontView(){
    camera.position.z=0;
    camera.position.y=100;
    camera.position.x=-FIELD_WIDTH-150;
    camera.lookAt(0,0,0);
}
function thirdPersonView(){
    camera.position.z = -FIELD_LENGTH-100;
    camera.position.y = 100;
    camera.position.x = 0;
    camera.lookAt(0, 0, FIELD_LENGTH/2);
}
frontView();
renderer.shadowMap.enabled = true;
field.receiveShadow = true;
wall.receiveShadow = true;
pong.receiveShadow = true;
bar1.receiveShadow = true;
bar2.receiveShadow = true;

textureLoader.load("textures/background.jpg", function(texture) {
    scene.background = texture;
    renderer.render(scene, camera);
});
textureLoader.load("textures/field.jpg", function(texture) {
    field.material.map = texture;
    field.material.needsUpdate = true;
    renderer.render(scene, camera);
});
textureLoader.load("textures/pong.png", function(texture) {
    pong.material.map = texture;
    pong.material.needsUpdate = true;
    renderer.render(scene, camera);
});
textureLoader.load("textures/wall.jpg", function(texture) {
    wall.material.map = texture;
    wall.material.needsUpdate = true;
    renderer.render(scene, camera);
});
textureLoader.load("textures/rakette.jpg", function(texture) {
    bar1.material.map = texture;
    bar1.material.needsUpdate = true;
    bar2.material.map = texture;
    bar2.material.needsUpdate = true;
    renderer.render(scene, camera);
});
function howtoplay(){
    alert('Move with z,q,s,d');
    alert('Hit the ball with spacebar to Smash');
    alert('Be the last one alive');
}
function init(){
    document.getElementById('startbtn').style.display = 'none';
    document.getElementById('howtoplaybtn').style.display = 'none';
    startTime = newDate();
    lifeBoard.innerHTML = 'Player 1: ' + life[0] + ' | ' + life[1] + ' : Player 2';
    resultBoard.innerHTML = "";
    startRender();
    document.addEventListener("keydown", barMove, false);
    renderer.domElement.style.cursor = 'none';
    
}
function cpuProcess() {
    let pongPos = pong.position;
    let cpuPos = bar2.position;
    
    if(cpuPos.x - 100 > pongPos.x) {
      cpuPos.x -= Math.min(cpuPos.x - pongPos.x, 6);
    }else if(cpuPos.x - 100 < pongPos.x) {
      cpuPos.x += Math.min(pongPos.x - cpuPos.x, 6);
    }
    if(cpuPos.y - 100 > pongPos.y) {
        cpuPos.y -= Math.min(cpuPos.y - pongPos.y, 6);
    }else if(cpuPos.y - 100 < pongPos.y) {
        cpuPos.y += Math.min(pongPos.y - cpuPos.y, 6);
    }
}
function newDate(){
    return Math.round(+new Date() / 1000);
}
function reset(){
    resultBoard.innerHTML = "";
    pong.position.set(0,0,0);
    pong.$velocity = null;
}
function startRender(){
    isRunning = true;
    render();
}
function stopRender() {
    isRunning = false;
} 
function render() {
    if(isRunning) {
      requestAnimationFrame(render);
      processPongMovement();
      cpuProcess();
      renderer.render(scene, camera);
    }
}
function losePoint(player){
    life[player]--;
    lifeBoard.innerHTML = 'Player 1 : ' + life[0] + ' | ' + life[1] + ' : Player 2';
    pong.$stopped = true;
    let isOver = false;
    if(life[0]==0){
        isOver = true;
        resultBoard.innerHTML = "You lose";
    }else if(life[1]==0){
        isOver = true;
        resultBoard.innerHTML = "You win";
    }else{
        setTimeout(reset, 2000);
    }
    setTimeout(function(){
        if(isOver){
            life = [7,7];
            endTime = newDate();
            let time = endTime - startTime;
            if(time>bestTime) bestTime = time;
            if(confirm("You played "+time+" sec, ready to play again?")){
                startTime = newDate();
                lifeBoard.innerHTML = 'Player 1: ' + life[0] + ' | ' + life[1] + ' : Player 2';
                setTimeout(reset, 2000);
            }
        }
    }, 100);
}
function barCanGoUp(){
    return bar1.position.y + barSpeedY < FIELD_HEIGHT/2;
}
function barCanGoDown(){
    return bar1.position.y - barSpeedY > -FIELD_HEIGHT/2;
}
function barCanGoLeft(){
    return bar1.position.x + barSpeedX < FIELD_WIDTH/2;
}
function barCanGoRight(){
    return bar1.position.x - barSpeedX > -FIELD_WIDTH/2;
}
function barMove(event){
    var keyCode = event.which;
    if (keyCode == 90) {
        //z
        if(barCanGoUp()){
            bar1.position.y += barSpeedY;
            //bar2.position.y += barSpeedY;
        }
    } else if (keyCode == 83) {
        //s
        if(barCanGoDown()){
            bar1.position.y -= barSpeedY;
            //bar2.position.y -= barSpeedY;
        }
    } else if (keyCode == 81) {
        //q
        if(camera.position.z<=0){
            if(barCanGoLeft()){
                bar1.position.x += barSpeedX;
                //bar2.position.x += barSpeedX;
            }
        }else{
            if(barCanGoRight()){
                bar1.position.x -= barSpeedX;
                //bar2.position.x -= barSpeedX;
            }
        }
        
    } else if (keyCode == 68) {
        //d
        if(camera.position.z>=0){
            if(barCanGoLeft()){
                bar1.position.x += barSpeedX;
                //bar2.position.x += barSpeedX;
            }
        }else{
            if(barCanGoRight()){
                bar1.position.x -= barSpeedX;
                //bar2.position.x -= barSpeedX;
            }
        }
    }
    if (keyCode == 32) {
        //spacebar
        coupDuDragonBar1();
    }
    if(keyCode == 86){
        actualView++;
        if(actualView>views.length){
            actualView=0;
        }
        if(views[actualView]=="topView"){
            topView();
        }else if(views[actualView]=="thirdPersonView"){
            thirdPersonView();
        }else if(views[actualView]=="frontView"){
            frontView();
        }
        renderer.render(scene, camera);
    }
};
function coupDuDragonBar1(){
    if(pong.position.x<0){
        bar1.rotateY(1.1);
        HITING = 2;
        setTimeout(function (){
            bar1.rotateY(-1.1);
            HITING = 1;
        }, 100);
    }else{
        bar1.rotateY(-1.1);
        HITING = 2;
        setTimeout(function (){
            bar1.rotateY(1.1);
            HITING = 1;
        }, 100);
    }   
}
function coupDuDragonBar2(){
    if(pong.position.x<0){
        bar2.rotateY(-1.1);
        HITING = 2;
        setTimeout(function (){
            bar2.rotateY(1.1);
            HITING = 1;
        }, 100);
    }else{
        bar2.rotateY(1.1);
        HITING = 2;
        setTimeout(function (){
            bar2.rotateY(-1.1);
            HITING = 1;
        }, 100);
    }
}
function startPongMovement() {
    var direction = Math.random() > 0.5 ? -1 : 1;
    pong.$velocity = {
      x: 0,
      z: direction * 1,
      y: direction * 1
    };
    pong.$stopped = false;
}
function updatePongPosition() {
    pong.position.x += pong.$velocity.x;
    pong.position.z += pong.$velocity.z;
    pong.position.y += pong.$velocity.y;
    rotatePong(2.2);
}
function rotatePong(t){
    pong.rotateY(t);
}
function isWallCollision(){
    let pX = pong.position.x;
    let fwby2 = FIELD_WIDTH /2;
    return pX - PONG_RADIUS < -fwby2 || pX + PONG_RADIUS > fwby2;
}
function isFloorCollision(){
    let pY = pong.position.y;
    let fhby2 = FIELD_HEIGHT /2;
    return pY - PONG_RADIUS < -fhby2 || pY + PONG_RADIUS > fhby2;
}
function isBar1Collision(){
    if(HITING==2) barRotation = 20;
    setTimeout(barRotation=0,100);
    return pong.position.z - PONG_RADIUS <= bar1.position.z + barRotation && isPongXBar(bar1) && pong.position.y - PONG_RADIUS <= bar1.position.y && isPongYBar(bar1);
}
function isBar2Collision(){
    if(HITING==2) barRotation = 20;
    setTimeout(barRotation=0,100);
    return pong.position.z + PONG_RADIUS >= bar2.position.z - barRotation && isPongXBar(bar2) && pong.position.y + PONG_RADIUS >= bar2.position.y && isPongYBar(bar2);
}
function isPongXBar(bar) {
    var bwby2 = BAR_WIDTH / 2;
    var bX = bar.position.x;
    var pX = pong.position.x;
    return pX > bX - bwby2 && pX < bX + bwby2;
}
function isPongYBar(bar) {
    var bhby2 = BAR_HEIGHT / 2;
    var bY = bar.position.y;
    var pY = pong.position.y;
    return pY > bY - bhby2 && pY < bY + bhby2;
}
function isPastBar1(){
    return pong.position.z + PONG_RADIUS < bar1.position.z;
}
function isPastBar2(){
    return pong.position.z - PONG_RADIUS > bar2.position.z;
}
function hitPong(bar) {
    if(!pongSound.isPlaying){
        pongSound.play();
    }
    if(HITING==2 && !pongDragonSound.isPlaying){
        pongDragonSound.play();
    }
    pong.$velocity.x = (pong.position.x - bar.position.x) / 5 * HITING;
    pong.$velocity.z *= -1*HITING;
}
function processPongMovement() {
    if(!pong.$velocity){
        startPongMovement();
    }
    
    if(pong.$stopped) {
        return;
    }
    
    updatePongPosition();
    
    if(isWallCollision()){
        pong.$velocity.x *= -1;
    }
    if(isFloorCollision()){
        pong.$velocity.y *= -1;
    }
    
    if(isBar1Collision()){
        hitPong(bar1);
    }
    
    if(isBar2Collision()){
        hitPong(bar2);
    }
    
    if(isPastBar1()){
        losePoint(0);
    }else if(isPastBar2()){
        losePoint(1);
    }
}