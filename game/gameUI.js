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

function startBombAnimation() {
    document.querySelectorAll('.bomb').forEach(bomb => {
        bomb.style.animationDuration = `${speed / 1000}s`;
        bomb.classList.add('bomb-animation');
    });
}
