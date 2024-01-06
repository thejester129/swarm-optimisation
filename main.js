const BIRD_RADIUS = 10;
const NO_OF_BIRDS = 10;
const TIC_SPEED_MS = 100;
const VIEW_WIDTH = 500;
const VIEW_HEIGHT = 500;
const VELOCITY_MULTIPLIER = 1;

let ctx;
let birds = [];

// type Bird = {
//     position:[number, number]
//     velocity:{
//         speed:number;
//         direction:[number, number]
//     }
// }

function startup() {
  const canvas = document.getElementById("canvas");
  canvas.width = VIEW_WIDTH;
  canvas.height = VIEW_HEIGHT;
  ctx = canvas.getContext("2d");

  for (let i = 0; i < NO_OF_BIRDS; i++) {
    birds.push(createNewBird());
  }

  setInterval(tic, TIC_SPEED_MS);
}

function tic() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const bird of birds) {
    drawBird(bird);
  }

  drawGoal();
}

function drawBird(bird) {
  const position = bird.position;

  ctx.fillStyle = "green";
  ctx.fillRect(position[0], position[1], BIRD_RADIUS, BIRD_RADIUS);
}

function drawGoal() {
  const position = [VIEW_WIDTH - 20, VIEW_HEIGHT / 2];
  ctx.fillStyle = "red";
  ctx.fillRect(position[0], position[1], BIRD_RADIUS, BIRD_RADIUS);
}

function createNewBird() {
  const margin = 20;
  const xRange = VIEW_WIDTH / 2 - margin;
  const yRange = VIEW_HEIGHT - margin;
  const x = Math.random() * xRange;
  const y = Math.random() * yRange;

  return {
    position: [x, y],
    velocity: {
      speed: 0,
      direction: [0, 0],
    },
  };
}
