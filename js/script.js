const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const character = {
  x: canvas.width / 2,
  y: 300,
  width: 40,
  height: 40,
  color: 'blue',
  isJumping: false,
  canJump: false,
  jumpHeight: 100,
  jumpSpeed: 5,
  jumpStartY: 0,
  gravity: 2,
  hasLost: false, // Флаг для отслеживания проигрыша
};

const platform = {
  x: 0,
  y: 350,
  width: canvas.width,
  height: 10,
  color: 'green',
};

const obstacles = [];

function createObstacle() {
  const obstacleWidth = 20;
  const obstacleHeight = 20;
  const obstacleColor = 'red';
  const obstacleX = canvas.width;
  const obstacleY = platform.y - obstacleHeight;
  obstacles.push({ x: obstacleX, y: obstacleY, width: obstacleWidth, height: obstacleHeight, color: obstacleColor });
}

function drawCharacter() {
  ctx.fillStyle = character.color;
  ctx.fillRect(character.x, character.y, character.width, character.height);
}

function drawPlatform() {
  ctx.fillStyle = platform.color;
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function updateObstacles() {
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width / 10) {
    createObstacle();
  }

  obstacles.forEach((obstacle) => {
    obstacle.x -= 2;
  });

  obstacles.forEach((obstacle, index) => {
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }
  });
}

function jumpAndFallCharacter() {
  if (character.isJumping) {
    if (character.y > character.jumpStartY - character.jumpHeight) {
      character.y -= character.jumpSpeed;
    } else {
      character.isJumping = false;
    }
  } else if (character.y < platform.y - character.height) {
    character.y += character.gravity;
  } else {
    character.canJump = true;
  }
}

function checkCollision() {
  if (character.hasLost) {
    return; // Если уже проиграли, не проверяем коллизии
  }

  if (
    character.x + character.width > platform.x &&
    character.x < platform.x + platform.width &&
    character.y + character.height > platform.y
  ) {
    character.y = platform.y - character.height;
    character.isJumping = false;
    character.canJump = true;
  }

  obstacles.forEach((obstacle, index) => {
    if (
      character.x + character.width > obstacle.x &&
      character.x < obstacle.x + obstacle.width &&
      character.y + character.height > obstacle.y
    ) {
      function lose() {
        console.log("Lose!");
        alert("Go on!")
        character.hasLost = true; // Устанавливаем флаг проигрыша
      }
      lose();
    }
  });

  // Добавим сброс флага hasLost после определенного времени
  if (character.hasLost) {
    setTimeout(() => {
      character.hasLost = false;
    }, 1000); // Сбрасываем флаг проигрыша через 1 секунду
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlatform();
  drawCharacter();
  jumpAndFallCharacter();
  checkCollision();
  drawObstacles();
  updateObstacles();

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ' && character.canJump) {
    character.isJumping = true;
    character.canJump = false;
    character.jumpStartY = character.y;
  }
});

gameLoop();
