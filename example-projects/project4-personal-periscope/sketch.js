// EXAMPLE UNIT 4 PROJECT - DATA VISUALIZATION

let surfer;
let surfers = [];
let surfers_df;
let SURFER_DATA_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5j4VHxhZ73MCnZdoapYnVmIZmgd0dA__qBpJKzlXmIRiTkRYDhWbxzK2i8UbQI8GD5LMn-Exi2MhE/pub?gid=0&single=true&output=csv";
let SURFER_ICONS = ["🏄🏻‍♂️", "🏄🏻", "🏄🏽‍♀️"];

let WEATHER_DATA_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=10.823&longitude=106.6296&hourly=temperature_2m,windspeed_10m,winddirection_10m&current_weather=true&timezone=Asia%2FBangkok";
let weather_df;
let wind_speed, wind_direction;

function preload() {
  logo_img = loadImage("/assets/background.png");
  bg_img = loadImage("/assets/codesurfing_logo.png");
  surfers_df = loadTable(SURFER_DATA_URL, "csv", "header");
  weather_df = loadJSON(WEATHER_DATA_URL);
}

function setup() {
  angleMode(DEGREES);
  createCanvas(1000, 1000);

  // Get Weather Info
  wind_speed = weather_df.current_weather.windspeed;
  wind_direction = weather_df.current_weather.winddirection;

  // Get Surfers Info
  for (let i = 0; i < surfers_df.getRowCount(); i++) {
    surfer = new Surfer(surfers_df.getRow(i));
    surfers.push(surfer);
  }
}

function draw() {
  angleMode(DEGREES);
  background(255);
  image(bg_img, 0, 0, windowWidth, windowHeight);

  // Visualize Surfers
  for (let i = 0; i < surfers.length; i++) {
    surfers[i].update();
    surfers[i].checkEdges();
    surfers[i].draw();
  }

  // Visualize Info
  image(logo_img, 50, 500, 330, 300);

  textSize(24);
  fill(100);
  text("⏂ Wind Speed: " + str(wind_speed) + "km/h", 420, 580);
  text("⏅ Wind Direction: " + str(wind_direction) + "°", 420, 610);
  text(
    "Surfers are moving according to weather data in Ho Chi Minh City, Vietnam.",
    420,
    640,
    300,
    200
  );
}

class Surfer {
  constructor(row) {
    this.id = row.getString("id");
    this.name = row.getString("name");
    this.role = row.getString("role");
    this.date_enrolled = row.getString("date_enrolled");
    this.program = row.getString("program");
    this.boundary_x = windowWidth;
    this.boundary_y = windowHeight / 2;

    this.icon = SURFER_ICONS[Math.floor(Math.random() * SURFER_ICONS.length)];
    this.size = random(30, 100);

    this.location = createVector(
      random(windowWidth),
      random(windowHeight * 0.5)
    );

    // Calculate velocity_y based on wind_direction and velocity_x
    // this.velocity_x = random(0.5, 2);
    this.velocity_x = wind_speed * random(-0.05, -0.01);
    this.velocity_y = tan(wind_direction) * this.velocity_x;
    this.velocity = createVector(this.velocity_x, this.velocity_y);
  }

  update() {
    this.location.add(this.velocity);
  }

  draw() {
    textSize(this.size);
    fill(0);
    text(this.icon, this.location.x, this.location.y);
    textSize(10);
    text(
      this.name.split(" ")[0],
      this.location.x + this.size * 0.5,
      this.location.y + 10
    );
  }

  checkEdges() {
    if (this.location.x > this.boundary_x) {
      this.location.x = 0;
    } else if (this.location.x < 0) {
      this.location.x = this.boundary_x;
    }

    if (this.location.y > this.boundary_y) {
      this.location.y = 0;
    } else if (this.location.y < 0) {
      this.location.y = this.boundary_y;
    }
  }
}
