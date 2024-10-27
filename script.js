document.getElementById('startButton').addEventListener('click', startQuiz);

let questions = [];
let currentQuestionIndex = 0;

async function startQuiz() {
  document.getElementById('startButton').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';

  await loadQuestions();
  showQuestion();
}

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
      explanation: cols[6],
      domain: cols[7]
    });
  });
}

function showQuestion() {
  const questionData = questions[currentQuestionIndex];
  document.getElementById('question').textContent = questionData.question;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  questionData.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(button);
  });

  document.getElementById('feedback').textContent = '';
  document.getElementById('nextButton').style.display = 'none';
}

function checkAnswer(selectedIndex) {
  const questionData = questions[currentQuestionIndex];
  const isCorrect = questionData.options[selectedIndex] === questionData.correctAnswer;

  document.getElementById('feedback').textContent = isCorrect ? 'Correct!' : `Incorrect. ${questionData.explanation}`;
  document.getElementById('nextButton').style.display = 'inline';

  document.getElementById('nextButton').onclick = nextQuestion;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById('quizContainer').innerHTML = '<p>Quiz complete!</p>';
  }
}
