let particles = [];
let num = 4000;
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
    track = loadSound("youarenotgonnajump3.mp3");
    img_1 = loadImage("beach_1.jpeg")
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
    img_1.resize(width, 0);
}

function draw() {

    if (deviceOrientation == PORTRAIT) {
        background(0);

        push();
        fill(255);
        textAlign(CENTER);
        textSize(36);
        text("turn your phone to landscape to view 🔁", width/2, height/2);
        pop();
    } else {
        background(0, 25);
        // clear();
        durationBar();
        cursorHover();
        
        amp_ = amp.getLevel();
        spd = amp_*600;
        zScale = amp_*100;
    
        push();
        // imageMode(CENTER);
        // translate(width/2, height/2);
        let opacity = map(amp_, 0, 1, 0, 255);
        tint(255, opacity);
        image(img_1, 0, 0);
        pop();
        
        if (frameCount%300==0) {
            noiseSeed(millis());
        }
    
        if (width<1000) {
            num = 2000;
        }

        for (let i = 0; i < num; i++) {
            let p = particles[i];
            stroke(255, 255-opacity);
            // circle(p.x, p.y, 1);
            strokeWeight(2);
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
}

function mouseReleased() {
    // noiseSeed(millis());
    if (mouseY>height-30) {
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
    rect(0, height-30, width, height);
    progress = map(track.currentTime(), 0, duration_, 0, width)
    fill(0);
    rect(0, height-30, progress, height) 
}

function cursorHover () {
    if (mouseY>height-10) {
        cursor(CROSS);
    } else {
        cursor(ARROW);
    }
}

function deviceTurned() {
    redraw();
}