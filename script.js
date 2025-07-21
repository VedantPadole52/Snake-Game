// Wait for DOM to fully load before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements for better performance
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const gameMessageElement = document.getElementById('gameMessage');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Game constants
    const BOX_SIZE = 20;
    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;
    const GRID_WIDTH = CANVAS_WIDTH / BOX_SIZE;
    const GRID_HEIGHT = CANVAS_HEIGHT / BOX_SIZE;

    // Game state variables
    let snake = [];
    let food = {};
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let direction = '';
    let nextDirection = '';
    let gameInterval = null;
    let gameSpeed = 100; // milliseconds
    let isPaused = false;
    let isGameOver = false;

    // Initialize game
    function init() {
        // Reset game state
        snake = [{ x: Math.floor(GRID_WIDTH / 2) * BOX_SIZE, y: Math.floor(GRID_HEIGHT / 2) * BOX_SIZE }];
        direction = '';
        nextDirection = '';
        score = 0;
        gameSpeed = 100;
        isPaused = false;
        isGameOver = false;
        
        // Update UI
        scoreElement.textContent = score;
        highScoreElement.textContent = highScore;
        hideMessage();
        
        // Generate initial food
        generateFood();
        
        // Clear any existing interval
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        
        // Draw initial state
        draw();
    }

    // Generate food at random position (ensuring it's not on the snake)
    function generateFood() {
        let newFood;
        let foodOnSnake;
        
        do {
            foodOnSnake = false;
            newFood = {
                x: Math.floor(Math.random() * GRID_WIDTH) * BOX_SIZE,
                y: Math.floor(Math.random() * GRID_HEIGHT) * BOX_SIZE
            };
            
            // Check if food is on snake body
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
                    foodOnSnake = true;
                    break;
                }
            }
        } while (foodOnSnake);
        
        food = newFood;
    }

    // Handle keyboard controls with improved direction handling
    document.addEventListener('keydown', (event) => {
        // Prevent default behavior for arrow keys to avoid page scrolling
        if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
            event.preventDefault();
        }
        
        // Start game on first arrow key press if not started
        if (!gameInterval && !isPaused && !isGameOver && [37, 38, 39, 40].includes(event.keyCode)) {
            startGame();
        }
        
        // Only change direction if game is running
        if (!isPaused && !isGameOver) {
            switch (event.keyCode) {
                case 37: // Left
                    if (direction !== 'RIGHT') nextDirection = 'LEFT';
                    break;
                case 38: // Up
                    if (direction !== 'DOWN') nextDirection = 'UP';
                    break;
                case 39: // Right
                    if (direction !== 'LEFT') nextDirection = 'RIGHT';
                    break;
                case 40: // Down
                    if (direction !== 'UP') nextDirection = 'DOWN';
                    break;
                case 32: // Space - toggle pause
                    togglePause();
                    break;
            }
        }
    });

    // Check for collision with snake body or walls
    function checkCollision(x, y) {
        // Check wall collision
        if (x < 0 || y < 0 || x >= CANVAS_WIDTH || y >= CANVAS_HEIGHT) {
            return true;
        }
        
        // Check snake body collision (skip head)
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === x && snake[i].y === y) {
                return true;
            }
        }
        
        return false;
    }

    // Game loop
    function gameLoop() {
        if (isPaused || isGameOver) return;
        
        // Update direction from nextDirection
        if (nextDirection) direction = nextDirection;
        
        // If no direction is set, don't move
        if (!direction) return;
        
        // Calculate new head position
        let headX = snake[0].x;
        let headY = snake[0].y;
        
        // Move head based on direction
        switch (direction) {
            case 'LEFT': headX -= BOX_SIZE; break;
            case 'UP': headY -= BOX_SIZE; break;
            case 'RIGHT': headX += BOX_SIZE; break;
            case 'DOWN': headY += BOX_SIZE; break;
        }
        
        // Check for collision
        if (checkCollision(headX, headY)) {
            gameOver();
            return;
        }
        
        // Create new head
        const newHead = { x: headX, y: headY };
        
        // Check if snake eats food
        if (headX === food.x && headY === food.y) {
            // Increase score
            score++;
            scoreElement.textContent = score;
            
            // Update high score if needed
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Generate new food
            generateFood();
            
            // Increase speed every 5 points
            if (score % 5 === 0 && gameSpeed > 50) {
                gameSpeed -= 5;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        } else {
            // Remove tail if not eating
            snake.pop();
        }
        
        // Add new head to beginning of snake array
        snake.unshift(newHead);
        
        // Draw everything
        draw();
    }

    // Draw game elements
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#0f0f1a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw grid lines for better visibility
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 0.5;
        
        for (let x = 0; x < CANVAS_WIDTH; x += BOX_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
        
        for (let y = 0; y < CANVAS_HEIGHT; y += BOX_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }
        
        // Draw snake
        for (let i = 0; i < snake.length; i++) {
            // Create gradient for snake body
            if (i === 0) {
                // Snake head
                ctx.fillStyle = '#f72585';
            } else {
                // Snake body with gradient
                const gradient = ctx.createLinearGradient(
                    snake[i].x, snake[i].y,
                    snake[i].x + BOX_SIZE, snake[i].y + BOX_SIZE
                );
                gradient.addColorStop(0, '#4cc9f0');
                gradient.addColorStop(1, '#4361ee');
                ctx.fillStyle = gradient;
            }
            
            ctx.fillRect(snake[i].x, snake[i].y, BOX_SIZE, BOX_SIZE);
            
            // Add border to snake segments
            ctx.strokeStyle = '#e6e6e6';
            ctx.lineWidth = 1;
            ctx.strokeRect(snake[i].x, snake[i].y, BOX_SIZE, BOX_SIZE);
        }
        
        // Draw food with glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f72585';
        ctx.fillStyle = '#f72585';
        ctx.beginPath();
        ctx.arc(food.x + BOX_SIZE/2, food.y + BOX_SIZE/2, BOX_SIZE/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw game instructions if game hasn't started
        if (!gameInterval && !isGameOver) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press an arrow key or click Start to begin', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        }
    }

    // Game over function
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        gameInterval = null;
        showMessage(`Game Over! Score: ${score}`);
    }

    // Start game function
    function startGame() {
        if (isGameOver) {
            init();
        }
        
        if (!gameInterval && !isPaused) {
            // Set initial direction if none is set
            if (!direction && !nextDirection) {
                direction = 'RIGHT';
            }
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }

    // Toggle pause function
    function togglePause() {
        if (isGameOver || !gameInterval) return;
        
        isPaused = !isPaused;
        
        if (isPaused) {
            clearInterval(gameInterval);
            gameInterval = null;
            showMessage('Paused');
        } else {
            hideMessage();
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }

    // Reset game function
    function resetGame() {
        init();
    }

    // Show message function
    function showMessage(message) {
        gameMessageElement.textContent = message;
        gameMessageElement.classList.remove('hidden');
    }

    // Hide message function
    function hideMessage() {
        gameMessageElement.classList.add('hidden');
    }

    // Event listeners for buttons
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);

    // Initialize game on load
    init();
});
