let particles = [];
const num = 1000;
const noiseScale = 0.01 / 2;
let spd = 1;
let mic;
let track;
let button;
let playing = false;
let amp_;
let amp;
let duration_;

function preload() {
    track = loadSound("youarenotgonnajump2.mp3");
    img_1 = loadImage("1_beach.jpeg")
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < num; i++) {
        particles.push(createVector(random(width), random(height)));
    }
    clear();

    button = createButton('play/pause')
    button.mousePressed(togglePlay)
    button.position(30, 30);
    button.style("border-radius: 10px")
    button.style("width: 100px")
    button.style("height: 50px")
    button.style("background-color: transparent")
    button.style("color: lightgray")
    amp = new p5.Amplitude();
    duration_ = track.duration();
}

function draw() {
    background(0, 50);
    durationBar();
    cursorHover();
    
    // push();
    // imageMode(CENTER);
    // translate(width/2, height/2);
    // image(img_1, 0, 0, 300, 200);
    // img_1.loadPixels();
    // pop();
    

    if (frameCount%300==0) {
        noiseSeed(millis());
    }
    amp_ = amp.getLevel();
    spd = amp_*600;
    zScale = amp_*100;

    // push();
    // translate(width/2, height/2);
    // textSize(32);
    // textAlign(CENTER);
    // fill(255);
    // noStroke();
    // text("tôi", 0, 0);
    // pop();

    for (let i = 0; i < num; i++) {
        let p = particles[i];
        stroke(255);
        // circle(p.x, p.y, 1);
        point(p.x, p.y);
        let n = noise(p.x * noiseScale, p.y * noiseScale, zScale);
        let a = TWO_PI * n;
        p.x = p.x - cos(a) * spd;
        p.y = p.y - sin(a) * spd;
        if (!onScreen(p)) {
            p.x = random(width);
            p.y = random(height);
        }
    }
}

function mouseReleased() {
    // noiseSeed(millis());
    if (mouseY>height-10) {
        jumpToPart = map(mouseX, 0, width, 0, duration_)
        if (track.isPlaying()){
            track.jump(jumpToPart);
        } else {
            track.play();
            track.jump(jumpToPart);
        };
        
    }
    
}

function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

function togglePlay() {
    if (track.isPlaying()) {
        track.pause();
    } else {
        track.play();
    }
}

function durationBar() {
    noStroke();
    fill(100);
    rect(0, height-10, width, height);
    progress = map(track.currentTime(), 0, duration_, 0, width)
    fill(0);
    rect(0, height-10, progress, height) 
}

function jumpTrack(){

}

function cursorHover () {
    if (mouseY>height-10) {
        cursor(CROSS);
    } else {
        cursor(ARROW);
    }
}