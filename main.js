const BIRD_RADIUS = 10;
const NO_OF_BIRDS = 10;
const TIC_SPEED_MS = 200;
const VIEW_WIDTH = 500;
const VIEW_HEIGHT = 500;
const VELOCITY_MULTIPLIER = 1;

let ctx, birds, goalPosition;

// type Bird = {
//     position:[number, number]
//     velocity:[number, number]
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

  updateBirdVelocities();
  updateBirdPositions();
  updatePBests();

  for (const bird of birds) {
    drawBird(bird);
  }

  drawGoal();
}

function updateBirdVelocities() {
  birds = birds.map((bird) => {
    bird.velocity = getNextBirdVelocity(bird);
    return bird;
  });
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

  ctx.fillStyle = "green";
  ctx.fillRect(
    position[0] - BIRD_RADIUS / 2,
    position[1] - BIRD_RADIUS / 2,
    BIRD_RADIUS,
    BIRD_RADIUS
  );

  // velocity marker
  ctx.beginPath();
  ctx.moveTo(position[0], position[1]);
  const lineX = velocity[0];
  const lineY = velocity[1];
  ctx.lineTo(position[0] + lineX, position[1] + lineY);
  ctx.stroke(); // Render the path
}

function getNextBirdPosition(bird) {
  const nextPosition = vAdd(bird.position, bird.velocity);

  return nextPosition;
}

function getNextBirdVelocity(bird) {
  // V^i(t+1) = w V^i(t) + c_1r_1(pbest^i – X^i(t)) + c_2r_2(gbest – X^i(t))

  const r1 = Math.random();
  const r2 = Math.random();
  const w = 0.9; // inertia weigh const
  const c1 = 0.9; // cognitive coeff
  const c2 = 0.1; // social coeff
  const pbest = bird.pBest;
  const gbest = getGBest();

  const cognitiveCoef = c1 * r1;
  const socialCoef = c2 * r2;

  const inertiaPart = vFactor(bird.velocity, w);
  const cognitivePart = vFactor(vSubtract(pbest, bird.position), cognitiveCoef);
  const socialPart = vFactor(vSubtract(gbest, bird.position), socialCoef);

  const nextVelocity = vAdd(vAdd(inertiaPart, cognitivePart), socialPart);

  return vFactor(nextVelocity, VELOCITY_MULTIPLIER);
}

function vAdd(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

function vSubtract(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]];
}

function vFactor(v, f) {
  return [v[0] * f, v[1] * f];
}

function distanceBetween(v1, v2) {
  const diff = vSubtract(v1, v2);

  return Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);
}

function getGBest() {
  let gBest = [1000, 1000];

  for (const bird of birds) {
    const pBest = bird.pBest;
    const pDistance = distanceBetween(pBest, goalPosition);
    const gDistance = distanceBetween(gBest, goalPosition);

    if (pDistance < gDistance) {
      gBest = pBest;
    }
  }

  return gBest;
}

function updatePBests() {
  birds = birds.map((bird) => {
    const currentDistance = distanceBetween(bird.position, goalPosition);
    const bestDistance = distanceBetween(bird.pBest, goalPosition);

    if (currentDistance < bestDistance) {
      bird.pBest = bird.position;
    }

    return bird;
  });
}

function drawGoal() {
  const position = [VIEW_WIDTH - 20, VIEW_HEIGHT / 2];
  ctx.fillStyle = "red";
  ctx.fillRect(
    position[0] - BIRD_RADIUS / 2,
    position[1] - BIRD_RADIUS / 2,
    BIRD_RADIUS,
    BIRD_RADIUS
  );
}

function createNewBird() {
  const margin = 20;
  const xRange = VIEW_WIDTH / 2 - margin;
  const yRange = VIEW_HEIGHT - margin;
  const x = Math.random() * xRange;
  const y = Math.random() * yRange;

  return {
    position: [x, y],
    velocity: [1, 0],
    pBest: [x, y],
  };
}
