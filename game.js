// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusElement = document.getElementById('status');
const distanceElement = document.getElementById('distance');
const restartBtn = document.getElementById('restartBtn');

let police;
let thief;
let gameOver = false;
let gameWon = false;
let keys = {};
let score = 0;
let thiefEscapeTimer = 0;

// Initialize game
function initGame() {
    police = new Police(100, 300);
    thief = new Thief(canvas.width - 100, 300);
    gameOver = false;
    gameWon = false;
    score = 0;
    thiefEscapeTimer = 0;
    statusElement.textContent = 'Game Running...';
    statusElement.className = '';
    restartBtn.classList.add('hidden');
}

// Handle keyboard events
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Restart button
restartBtn.addEventListener('click', () => {
    initGame();
    gameLoop();
});

// Main game loop
function gameLoop() {
    if (gameOver || gameWon) {
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update game state
    police.handleInput(keys);
    police.update(canvas.width, canvas.height);

    thief.ai(police, canvas.width, canvas.height);
    thief.update(canvas.width, canvas.height);

    // Draw game objects
    police.draw(ctx);
    thief.draw(ctx);

    // Check collision (police catches thief)
    if (police.collidesWith(thief)) {
        gameWon = true;
        statusElement.textContent = '✅ YOU WIN! Thief Caught!';
        statusElement.classList.add('won');
        restartBtn.classList.remove('hidden');
        return;
    }

    // Check if thief escaped (reached right edge)
    if (thief.x + thief.width >= canvas.width) {
        thiefEscapeTimer++;
        if (thiefEscapeTimer > 60) { // 1 second at 60fps
            gameOver = true;
            statusElement.textContent = '❌ YOU LOST! Thief Escaped!';
            statusElement.classList.add('lost');
            restartBtn.classList.remove('hidden');
            return;
        }
    } else {
        thiefEscapeTimer = 0;
    }

    // Update score (distance between police and thief)
    score = Math.max(0, Math.round(thief.getDistance(police)));
    distanceElement.textContent = score;

    // Warning if thief is far
    if (score > 300) {
        statusElement.textContent = '⚠️ THIEF GETTING AWAY!';
        statusElement.classList.add('warning');
    } else {
        statusElement.textContent = 'Game Running...';
        statusElement.classList.remove('warning');
    }

    requestAnimationFrame(gameLoop);
}

// Draw instructions on canvas
function drawInstructions() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚔 POLICE vs THIEF CHASE 🏃', canvas.width / 2, 100);

    ctx.font = '18px Arial';
    ctx.fillText('🔵 Blue = Police (You)', canvas.width / 2, 200);
    ctx.fillText('🟠 Orange = Thief (AI)', canvas.width / 2, 250);

    ctx.font = '16px Arial';
    ctx.fillText('Controls: Arrow Keys or WASD', canvas.width / 2, 350);
    ctx.fillText('Catch the thief to WIN', canvas.width / 2, 400);
    ctx.fillText('If thief reaches the edge, you LOSE', canvas.width / 2, 450);

    ctx.font = 'bold 20px Arial';
    ctx.fillText('Click to Start Game', canvas.width / 2, 550);
}

// Draw initial instructions
drawInstructions();

// Start game on canvas click
canvas.addEventListener('click', () => {
    if (!gameOver && !gameWon && police === undefined) {
        initGame();
        gameLoop();
    }
});

// Initialize game when page loads
window.addEventListener('load', () => {
    // Game is ready, waiting for user click
});
