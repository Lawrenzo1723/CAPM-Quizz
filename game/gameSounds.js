const backgroundMusic = new Audio('game/assets/sounds/Sound_GameMusic.wav');
const explosionSound = new Audio('game/assets/sounds/Sound_Explosion.wav');
const correctSound = new Audio('game/assets/sounds/Sound_Correct_Answer.wav');

function playBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.play().catch(error => console.log("Background music play failed due to autoplay policy"));
}

function playExplosionSound() {
    explosionSound.play();
}

function playCorrectAnswerSound() {
    correctSound.play();
}

// Export sound functions
export { playBackgroundMusic, playExplosionSound, playCorrectAnswerSound };
