const BIRD_RADIUS = 10;
const NO_OF_BIRDS = 10;
const TIC_SPEED_MS = 100;
const VIEW_WIDTH = 500;
const VIEW_HEIGHT = 500;
const VELOCITY_MULTIPLIER = 1;

let ctx, birds, goalPosition;

// type Bird = {
//     position:[number, number]
//     velocity:{
//         speed:number;
//         direction:[number, number]
//     }
//     pBest: [number, number];
// }

function startup() {
  const canvas = document.getElementById("canvas");
  canvas.width = VIEW_WIDTH;
  canvas.height = VIEW_HEIGHT;
  ctx = canvas.getContext("2d");

  const resetButton = document.getElementById("reset-button");
  resetButton.onclick = startSimulation;

  startSimulation();
}

function startSimulation() {
  birds = [];
  for (let i = 0; i < NO_OF_BIRDS; i++) {
    birds.push(createNewBird());
  }

  goalPosition = [VIEW_WIDTH - 20, VIEW_HEIGHT / 2];

  setInterval(tic, TIC_SPEED_MS);
}

function tic() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBirdPositions();

  for (const bird of birds) {
    drawBird(bird);
  }

  drawGoal();

  updatePBests();
}

function updateBirdPositions() {
  birds = birds.map((bird) => {
    bird.position = getNextBirdPosition(bird);
    return bird;
  });
}

function drawBird(bird) {
  const position = bird.position;
  const velocity = bird.velocity;
  const lengthMultiplier = 20;

  ctx.fillStyle = "green";
  ctx.fillRect(position[0], position[1], BIRD_RADIUS, BIRD_RADIUS);

  // velocity marker
  ctx.beginPath();
  ctx.moveTo(position[0] + BIRD_RADIUS / 2, position[1] + BIRD_RADIUS / 2);
  ctx.lineTo(
    position[0] + velocity.direction[0] * lengthMultiplier,
    position[1] + velocity.direction[1] * lengthMultiplier
  );
  ctx.stroke(); // Render the path
}

function getNextBirdPosition(bird) {
  const nextVelocity = bird.velocity; // TODO
  const currentPosition = bird.position;

  const nextPosition = [
    currentPosition[0] + nextVelocity.direction[0] * nextVelocity.speed,
    currentPosition[1] + nextVelocity.direction[1] * nextVelocity.speed,
  ];

  return nextPosition;
}

function getNextBirdVelocity(bird) {
  // V^i(t+1) = w V^i(t) + c_1r_1(pbest^i – X^i(t)) + c_2r_2(gbest – X^i(t))

  const r1 = Math.random();
  const r2 = Math.random();
  const w = 0.8; // inertia weigh const
  const c1 = 0.1; // cognitive coeff
  const c2 = 0.1; // social coeff
  const pbest = bird.pBest;
  const gbest = getGBest();

  const a = 1;
  const b = c1 * r1 * vectorSubtract(pbest, bird.position);
  const c = c2 * r2 * vectorSubtract(gbest, bird.position);

  const nextVelocity = a + b + c;

  return nextVelocity;
}

function vectorSubtract(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function getGBest() {
  let gBest = [1000, 1000];

  for (const bird of birds) {
    const pBest = bird.pBest;
    const pDistance = pBest[0] + pBest[1];
    const gDistance = gBest[0] + gBest[1];
    if (pDistance < gDistance) {
      gBest = pBest;
    }
  }

  return pBest;
}

function updatePBests() {
  birds = birds.map((bird) => {
    const dx = Math.abs(bird.position[0] - goalPosition[0]);
    const dy = Math.abs(bird.position[1] - goalPosition[1]);
    const distanceToGoal = Math.sqrt(dx * dx + dy * dy);

    if (distanceToGoal < bird.pBest) {
      bird.pBest = bird.position;
    }

    return bird;
  });
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
      speed: VELOCITY_MULTIPLIER,
      direction: [1, 1],
    },
    pBest: [0, 0],
  };
}
