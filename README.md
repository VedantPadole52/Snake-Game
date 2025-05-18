# Snake-Game.
This is a exciting Snake Game
Sure! Here's a README file for the Snake Game using HTML, CSS, and JavaScript without any sample code:

---

# Snake Game - README

## Overview
This is a simple Snake Game built using HTML, CSS, and JavaScript. The player controls a snake on the screen that must eat food to grow. The game ends if the snake collides with the walls or its own body. The score increases each time the snake eats food.

## Features
- **Snake Movement**: The snake moves based on user input using the arrow keys.
- **Food**: Food appears at random positions on the screen, and the snake grows after eating it.
- **Collision Detection**: The game ends when the snake hits the wall or collides with its own body.
- **Score Display**: The score increases as the snake eats food and is displayed on the screen.
- **Game Restart**: Once the game ends, the player is prompted to restart the game.

## File Structure
- `index.html`: Contains the HTML structure for the game.
- `style.css`: Contains the CSS for styling the game layout and appearance.
- `script.js`: Contains the JavaScript code that handles the game logic, including snake movement, collision detection, food spawning, and score tracking.

## Prerequisites
- **Web Browser**: Any modern web browser (Google Chrome, Firefox, Safari, etc.) will work to run this game.

## How to Run the Game

### Step 1: Download the Game Files
You can download or clone the repository containing the following files:
- `index.html`
- `style.css`
- `script.js`

### Step 2: Open the Game
After downloading the files, open `index.html` in any web browser.

### Step 3: Play the Game
- Use the **arrow keys** (Up, Down, Left, Right) to control the snake.
- The snake must eat the food (red square) to grow longer.
- If the snake collides with the walls or its own body, the game will end and prompt you to restart.
- Your score is displayed at the top and increases each time the snake eats food.

## How the Game Works

1. **Snake Movement**: 
   - The snake moves based on arrow key inputs from the user. It continues moving in the selected direction until the user presses another key.

2. **Food**: 
   - Food appears at random positions on the canvas. When the snake eats the food, it grows longer, and the score increases.

3. **Collision Detection**: 
   - The game checks for collisions with the walls and the snake's body. If the snake collides with either, the game ends.

4. **Score**: 
   - The score starts at zero and increases by 10 points each time the snake eats a piece of food. The current score is displayed on the screen.

5. **Game Restart**: 
   - Once the game ends, an alert will notify the player, and the game will automatically restart with the initial settings.

## Customization
- You can change the game settings like the snake's speed, canvas size, or food behavior by modifying the JavaScript code.
- The appearance of the snake and food can be customized by adjusting the CSS.

  ## Live Demo Link
  https://snake-game-plum-theta.vercel.app/

## Conclusion
This Snake Game is a fun project that uses basic HTML, CSS, and JavaScript to create a working game. It's a great way to practice programming fundamentals like handling user input, using the canvas element, and detecting collisions.

---

