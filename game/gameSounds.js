const backgroundMusic = new Audio('./assets/sounds/Sound_GameMusic.wav');
const explosionSound = new Audio('./assets/sounds/Sound_Explosion.wav');
const correctSound = new Audio('./assets/sounds/Sound_Correct_Answer.wav');

function playBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

function playExplosionSound() {
    explosionSound.play();
}

function playCorrectSound() {
    correctSound.play();
}

// Attach functions to window for global access
window.playBackgroundMusic = playBackgroundMusic;
window.playExplosionSound = playExplosionSound;
window.playCorrectSound = playCorrectSound;
