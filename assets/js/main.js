class Paddle {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 75;
    this.height = 30;
    this.canon = {
      height: 50,
      width: 25
    };

    this.maxSpeed = 5;
    this.speed = 0;
    this.position = {
      x: gameWidth / 2 - this.width / 2,
      y: gameHeight - this.height - 10
    };
  }

  shoot() {
    if (typeof bullet === "string") {
      bullet = new Bullet(paddle);
    }
  }
  stop() {
    this.speed = 0;
  }

  moveLeft() {
    this.speed = -this.maxSpeed;
  }

  moveRight() {
    this.speed = this.maxSpeed;
  }
  draw(ctx) {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillRect(
      `${this.position.x + 25}`,
      `${this.position.y - 25}`,
      this.canon.width,
      this.canon.height
    );
  }

  update(deltaTime) {
    this.position.x += this.speed;

    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
  }
}

// INPUT
class InputHandler {
  constructor(paddle) {
    document.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case 37:
          paddle.moveLeft();
          break;
        case 38:
          paddle.shoot();
          break;
        case 32:
          paddle.shoot();
          break;
        case 39:
          paddle.moveRight();
          break;

        default:
          break;
      }
    });

    document.addEventListener("keyup", event => {
      switch (event.keyCode) {
        case 37:
          if (paddle.speed < 0) paddle.stop();
          break;
        case 39:
          if (paddle.speed > 0) paddle.stop();
          break;
        default:
          break;
      }
    });
  }
}

// BULLET

class Bullet {
  constructor() {
    this.image = document.getElementById("img_bullet");

    this.position = { x: paddle.position.x + 30, y: paddle.position.y - 30 };
    this.speed = { y: 10 };
    this.width = 16;
    this.height = 16;

    this.gameHeight = paddle.gameHeight;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y - this.width + this.height,
      this.width,
      this.height
    );
  }

  update(deltaTime) {
    this.position.y -= this.speed.y;
    if (isCollide(target, bullet)) {
      score++;
      console.log(score);
      this.position.y = paddle.position.y;
      bullet = "";

      target.position.x = getRndInteger(0, target.gameWidth - target.width);
      target.position.y =
        target.gameHeight - getRndInteger(target.gameWidth, target.gameHeight);
    }

    if (this.gameHeight - this.position.y === this.gameHeight) bullet = "";
  }
}

class Target {
  constructor(gameWidth, gameHeight) {
    this.width = 25;
    this.height = 25;

    this.gameHeight = gameHeight - 50;
    this.gameWidth = gameWidth - 50;

    this.position = {
      x: getRndInteger(0, gameWidth - this.width),
      y: gameHeight - getRndInteger(gameWidth, gameHeight)
    };
  }

  draw(ctx) {
    ctx.fillStyle = "grey";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 800;

let paddle = new Paddle(GAME_WIDTH, GAME_HEIGHT);
let target = new Target(GAME_WIDTH, GAME_HEIGHT);
let bullet = "";
let score = 0;
new InputHandler(paddle);

let lastTime = 0;

function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  paddle.draw(ctx);
  paddle.update(deltaTime);

  target.draw(ctx);

  if (bullet) {
    bullet.draw(ctx);
    bullet.update(deltaTime);
  }

  showScore();

  requestAnimationFrame(gameLoop);
}

document.getElementById("play").addEventListener("click", startGame);
document.getElementById("restart").addEventListener("click", restart);

function restart() {
  location.reload();
}
function startGame() {
  requestAnimationFrame(gameLoop);
  document.getElementById("play").style.display = "none";
  document.getElementById("restart").style.display = "block";
}

function isCollide(a, b) {
  if (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.height + a.position.y > b.position.y
  ) {
    return true;
  }
}

function showScore() {
  document.getElementById("score").innerHTML = `SCORE : ${score}`;
}
