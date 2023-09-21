let vid;
let playing = true;
let detector;

// Offset
let currentPositionX = 50;
let currentPositionY = 100;
let eachImageHeight = 50;
let lineSpacing = 5;

let button;

function preload() {
  vid = createVideo("assets/saigon_drive.mp4", function () {
    console.log("Video Loaded");
  });
}

function setup() {
  c = createCanvas(1280, 600);

  detector = ml5.objectDetector("cocossd", {}, modelLoaded);
  refreshIntervalId = setInterval(function () {
    results = detector.detect(vid, gotResult);
  }, 3000);

  button = createButton('Save Canvas');
  button.parent('save-btn')
  button.mousePressed(function () { saveCanvas(c, 'trace_of_a_city', 'jpg') });

  // vid.size(300, 200);
  vid.volume(0);
  vid.noLoop();
  vid.play();
  vid.hide();
  background(100);
}

function draw() {
  // image(vid, 0, 0);
  // text(vid.time(), 150, 100);
  // text(frameCount, 150, 130);
  // if (frameCount > 0 && frameCount % 240 == 0) {
  //   detect();
  // }
  if (vid.time() > vid.duration()) {
    clearInterval(refreshIntervalId);
    console.log("FINISHED!")
  }
}

function mousePressed() {
  // if (playing) {
  //   vid.pause();
  // } else {
  //   vid.play();
  // }
  // playing = !playing;
}

function modelLoaded() {
  console.log("Model Ready!");
}

function gotResult(err, results) {
  if (err) {
    console.log(err);
  }

  if (results) {
    im = vid.get();
    for (let i = 0; i < results.length; i++) {
      if (results[i].label == "person") {
        copy(
          im,
          int(results[i].x),
          int(results[i].y),
          int(results[i].width),
          int(results[i].height),
          int(currentPositionX),
          int(currentPositionY),
          int(results[i].width * eachImageHeight / results[i].height),
          int(eachImageHeight)
        );

        currentPositionX += results[i].width * eachImageHeight / results[i].height;
        if (currentPositionX > width - 50) {
          currentPositionX = 50;
          currentPositionY += eachImageHeight + lineSpacing;
        };

        console.log(vid.time())
      }
    }
  }
}
