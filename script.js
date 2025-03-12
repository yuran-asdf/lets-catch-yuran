
// Game canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const player = {
  x: 50,
  y: 200,
  width: 30,
  height: 30,
  speed: 5,
  jumpForce: 10,
  velocityY: 0,
  isJumping: false
};

const platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 200, y: 250, width: 100, height: 20 },
  { x: 400, y: 200, width: 100, height: 20 },
  { x: 600, y: 250, width: 100, height: 20 }
];

// Game controls
const keys = {
  right: false,
  left: false,
  up: false
};

// Event listeners
window.addEventListener('keydown', function(e) {
  switch(e.key) {
    case 'ArrowRight':
      keys.right = true;
      break;
    case 'ArrowLeft':
      keys.left = true;
      break;
    case 'ArrowUp':
    case ' ': // Space bar
      keys.up = true;
      break;
  }
});

window.addEventListener('keyup', function(e) {
  switch(e.key) {
    case 'ArrowRight':
      keys.right = false;
      break;
    case 'ArrowLeft':
      keys.left = false;
      break;
    case 'ArrowUp':
    case ' ': // Space bar
      keys.up = false;
      break;
  }
});

// Game physics
const gravity = 0.5;

// Check collisions between player and platforms
function checkCollision(player, platform) {
  return player.x < platform.x + platform.width &&
         player.x + player.width > platform.x &&
         player.y < platform.y + platform.height &&
         player.y + player.height > platform.y;
}

// Update game state
function update() {
  // Apply gravity
  player.velocityY += gravity;
  
  // Move player horizontally
  if (keys.right) {
    player.x += player.speed;
  }
  if (keys.left) {
    player.x -= player.speed;
  }
  
  // Jump when on ground
  if (keys.up && !player.isJumping) {
    player.velocityY = -player.jumpForce;
    player.isJumping = true;
  }
  
  // Update player position
  player.y += player.velocityY;
  
  // Check platform collisions
  player.isJumping = true;
  for (let platform of platforms) {
    if (checkCollision(player, platform) && player.velocityY > 0 && 
        (player.y + player.height - player.velocityY) <= platform.y) {
      player.isJumping = false;
      player.velocityY = 0;
      player.y = platform.y - player.height;
    }
  }
  
  // Keep player within boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }
}

// Draw game objects
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw platforms
  ctx.fillStyle = '#8bc34a';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
  
  // Draw player
  ctx.fillStyle = '#ff5722';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
