document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();
});

let questions = [];
let currentQuestionIndex = 0;

async function loadQuestions() {
  const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRyL8ZTnjPNQ0NabBoTUGhQI3m5zIoe7XI3HWzLfxbwcP1gYhsL4s11XGYCYzi2fLPKQ6M4ONri45a7/pub?output=csv');
  const data = await response.text();

  const rows = data.split('\n');
  rows.forEach(row => {
    const cols = row.split(',');
    questions.push({
      question: cols[0],
      options: [cols[1], cols[2], cols[3], cols[4]],
      correctAnswer: cols[5],
      explanation: cols[6]
    });
  });

  showQuestion();
}

function showQuestion() {
  const questionData = questions[currentQuestionIndex];
  document.getElementById('questionNumber').textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
  document.getElementById('questionText').textContent = questionData.question;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  questionData.options.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });

  document.getElementById('feedback').textContent = '';
  updateProgressBar();
}

function checkAnswer(selectedOptionText) {
  const questionData = questions[currentQuestionIndex];
  const isCorrect = selectedOptionText === questionData.correctAnswer;

  document.getElementById('feedback').textContent = isCorrect ? 'Correct!' : `Incorrect. ${questionData.explanation}`;
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}
