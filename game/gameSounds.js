const backgroundMusic = new Audio('./assets/sounds/Sound_GameMusic.wav');
const explosionSound = new Audio('./assets/sounds/Sound_Explosion.wav');
const correctSound = new Audio('./assets/sounds/Sound_Correct_Answer.wav');

// Function to play background music in a loop
export function playBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

// Function to play explosion sound when an incorrect answer is chosen
export function playExplosionSound() {
    explosionSound.play();
}

// Function to play correct answer sound when a correct answer is chosen
export function playCorrectSound() {
    correctSound.play();
}
