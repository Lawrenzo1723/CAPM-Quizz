import { checkAnswer } from './gameLogic.js';
import { playBackgroundMusic } from './gameSounds.js';

document.addEventListener('DOMContentLoaded', () => {
    playBackgroundMusic();  // Start background music when game loads
    startBombAnimation();   // Initialize bomb animations
});

// Attach event listeners to each bomb for user interaction
document.querySelectorAll('.bomb').forEach(bomb => {
    bomb.addEventListener('click', (event) => {
        const selectedAnswer = event.target.dataset.answer;
        checkAnswer(selectedAnswer);  // Check if answer is correct
    });
});

// Function to handle bomb animations
export function startBombAnimation() {
    document.querySelectorAll('.bomb').forEach(bomb => {
        bomb.style.animationDuration = `${speed / 1000}s`;  // Adjust speed based on game speed
        bomb.classList.add('bomb-animation');  // Add animation class to bombs
    });
}
