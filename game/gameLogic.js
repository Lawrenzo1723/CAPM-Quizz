let currentQuestionIndex = 0;
let speed = 2000;  // Starting speed in milliseconds
let questions = [];

// Fetch questions from the JSON file on GitHub
async function loadQuestions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Lawrenzo1723/CAPM-Quizz/22490a63a18f2916d07f121220dfa1bc8449662a/question%20in%20Json.json');
        questions = await response.json();
        loadQuestion();  // Start with the first question after loading
    } catch (error) {
        console.error("Failed to load questions:", error);
    }
}

function loadQuestion() {
    if (questions.length === 0) return;
    
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = question.text;
    
    // Display answer options on the bombs
    document.getElementById('bomb-a').dataset.answer = question.options[0];
    document.getElementById('bomb-b').dataset.answer = question.options[1];
    document.getElementById('bomb-c').dataset.answer = question.options[2];
    document.getElementById('bomb-d').dataset.answer = question.options[3];
}

function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.correctAnswer) {
        playCorrectSound();
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            speed = Math.max(speed - 100, 500);  // Increase game speed
            loadQuestion();
        } else {
            alert('You completed the quiz!');
        }
    } else {
        playExplosionSound();
        alert('Incorrect! Game Over.');
        resetGame();
    }
}

function resetGame() {
    currentQuestionIndex = 0;
    speed = 2000;
    loadQuestion();
}

// Initialize game by loading questions from the JSON file
loadQuestions();

// Attach functions to window for global access
window.checkAnswer = checkAnswer;
