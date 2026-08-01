const gameEl = document.getElementById('game');
const playerEl = document.getElementById('player');
const obstaclesEl = document.getElementById('obstacles');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const controlButtons = Array.from(document.querySelectorAll('[data-control]'));

const playerConfig = {
  width: 44,
  height: 56,
  x: 90,
  y: 258,
  vy: 0,
  grounded: true,
};

const state = {
  status: 'ready',
  score: 0,
  spawnTimer: 0,
  obstacles: [],
};

const keys = {
  left: false,
  right: false,
  jump: false,
};

let lastTime = 0;

function startGame() {
  state.status = 'playing';
  state.score = 0;
  state.spawnTimer = 0.8;
  state.obstacles.forEach((obstacle) => obstacle.el.remove());
  state.obstacles = [];

  playerConfig.x = 90;
  playerConfig.y = 258;
  playerConfig.vy = 0;
  playerConfig.grounded = true;

  updateHud();
  messageEl.style.display = 'none';
  statusEl.textContent = 'プレイ中';
}

function endGame() {
  state.status = 'gameover';
  messageEl.textContent = 'ゲームオーバー\nEnter でもう一度';
  messageEl.style.display = 'grid';
  statusEl.textContent = 'ゲームオーバー';
}

function updateHud() {
  scoreEl.textContent = `スコア: ${Math.floor(state.score)}`;
}

function spawnObstacle() {
  const obstacleEl = document.createElement('div');
  obstacleEl.className = 'obstacle';
  obstaclesEl.appendChild(obstacleEl);

  state.obstacles.push({
    el: obstacleEl,
    x: 760,
  });
}

function update(delta) {
  if (state.status !== 'playing') {
    return;
  }

  if (keys.left) {
    playerConfig.x = Math.max(20, playerConfig.x - 280 * delta);
  }
  if (keys.right) {
    playerConfig.x = Math.min(300, playerConfig.x + 280 * delta);
  }

  if (playerConfig.grounded) {
    if (keys.jump) {
      playerConfig.vy = -440;
      playerConfig.grounded = false;
      keys.jump = false;
    }
  }

  playerConfig.vy += 1200 * delta;
  playerConfig.y += playerConfig.vy * delta;

  if (playerConfig.y >= 258) {
    playerConfig.y = 258;
    playerConfig.vy = 0;
    playerConfig.grounded = true;
  }

  state.score += delta * 16;
  updateHud();

  state.spawnTimer -= delta;
  if (state.spawnTimer <= 0) {
    spawnObstacle();
    state.spawnTimer = 0.7 + Math.random() * 0.35;
  }

  const nextObstacles = [];
  for (const obstacle of state.obstacles) {
    obstacle.x -= 330 * delta;
    obstacle.el.style.transform = `translateX(${obstacle.x}px)`;

    if (obstacle.x < -80) {
      obstacle.el.remove();
      continue;
    }

    const playerRect = {
      left: playerConfig.x,
      right: playerConfig.x + playerConfig.width,
      top: playerConfig.y,
      bottom: playerConfig.y + playerConfig.height,
    };

    const obstacleRect = {
      left: obstacle.x,
      right: obstacle.x + 36,
      top: 330,
      bottom: 374,
    };

    const hit =
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top;

    if (hit) {
      endGame();
      return;
    }

    nextObstacles.push(obstacle);
  }

  state.obstacles = nextObstacles;
}

function bindControlButtons() {
  controlButtons.forEach((button) => {
    const control = button.dataset.control;

    const press = () => {
      if (control === 'left') {
        keys.left = true;
      } else if (control === 'right') {
        keys.right = true;
      } else if (control === 'jump') {
        if (state.status === 'ready' || state.status === 'gameover') {
          startGame();
        }
        keys.jump = true;
      }
      button.classList.add('is-active');
    };

    const release = () => {
      if (control === 'left') {
        keys.left = false;
      } else if (control === 'right') {
        keys.right = false;
      } else if (control === 'jump') {
        keys.jump = false;
      }
      button.classList.remove('is-active');
    };

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      press();
    });
    button.addEventListener('pointerup', release);
    button.addEventListener('pointerleave', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  });
}

function render() {
  playerEl.style.transform = `translate(${playerConfig.x}px, ${playerConfig.y}px)`;
}

function frame(timestamp) {
  if (!lastTime) {
    lastTime = timestamp;
  }

  const delta = Math.min(0.03, (timestamp - lastTime) / 1000);
  lastTime = timestamp;

  update(delta);
  render();
  requestAnimationFrame(frame);
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    keys.left = true;
    event.preventDefault();
  }
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    keys.right = true;
    event.preventDefault();
  }
  if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') {
    keys.jump = true;
    if (state.status === 'ready') {
      startGame();
    }
    event.preventDefault();
  }
  if (event.code === 'Enter' && state.status === 'gameover') {
    startGame();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    keys.left = false;
  }
  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    keys.right = false;
  }
  if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') {
    keys.jump = false;
  }
});

restartBtn.addEventListener('click', startGame);
bindControlButtons();

updateHud();
requestAnimationFrame(frame);
