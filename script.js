document.addEventListener('DOMContentLoaded', () => {
  showHome();
  loadQuestions(); // Loads the questions into the array once
});

let questions = [];
let currentQuestionIndex = 0;
let missedQuestions = [];
let sessionAnswers = [];

// Sample data structure for questions
const questionData = {
  "Project Management Fundamentals": [
    { question: "What is a project charter?", options: ["Document goals", "Define scope", "Authorize PM", "Approve resources"], correctAnswer: "Authorize PM" }
    // Add more questions here
  ]
};

function loadQuestions() {
  for (let domain in questionData) {
    questions = questions.concat(questionData[domain]);
  }
}

function showHome() {
  document.getElementById('home-screen').style.display = 'block';
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('footer').style.display = 'none';
}

function showSubdomains(domain) {
  document.getElementById('quiz-title').textContent = domain;
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('footer').style.display = 'flex';

  const subdomains = questionData[domain];
  if (subdomains)
      document.getElementById('quiz-content').innerHTML = `
    <h3>Select a Subdomain in ${domain}</h3>
    ${subdomains.map((sub, index) => `<button onclick="showQuestions('${domain}', ${index})">${sub.question}</button>`).join('')}
  `;
}

function showQuestions(domain, subdomainIndex) {
  const subdomainQuestions = questionData[domain][subdomainIndex];
  currentQuestionIndex = 0;
  displayQuestion(subdomainQuestions);
}

function displayQuestion(questionsArray) {
  const question = questionsArray[currentQuestionIndex];
  document.getElementById('quiz-content').innerHTML = `
    <p>${question.question}</p>
    ${question.options.map(option => `<button onclick="checkAnswer('${option}', '${question.correctAnswer}')">${option}</button>`).join('')}
    <p id="feedback"></p>
    <div id="navigation">
      <button onclick="prevQuestion(${questionsArray})" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
      <button onclick="nextQuestion(${questionsArray})" ${currentQuestionIndex === questionsArray.length - 1 ? 'disabled' : ''}>Next</button>
    </div>
    <p id="progress-count">Question ${currentQuestionIndex + 1} of ${questionsArray.length}</p>
  `;
}

function checkAnswer(selectedOption, correctAnswer) {
  const feedback = document.getElementById('feedback');
  if (selectedOption === correctAnswer) {
    feedback.textContent = "Correct!";
  } else {
    feedback.textContent = "Incorrect.";
    missedQuestions.push(questions[currentQuestionIndex]);
  }
}

function prevQuestion(questionsArray) {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(questionsArray);
  }
}

function nextQuestion(questionsArray) {
  if (currentQuestionIndex < questionsArray.length - 1) {
    currentQuestionIndex++;
    displayQuestion(questionsArray);
  }
}

function navigateTo(mode) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('footer').style.display = 'flex';

  if (mode === 'practice') {
    displayQuestion(missedQuestions);
  } else if (mode === 'review') {
    displayQuestion(questions);
  } else if (mode === 'flashcard') {
    displayFlashcard();
  } else if (mode === 'random') {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    displayQuestion([randomQuestion]);
  }
}

function displayFlashcard() {
  const question = questions[currentQuestionIndex];
  document.getElementById('quiz-content').innerHTML = `
    <p>${question.question}</p>
    <button onclick="revealAnswer()">Reveal Answer</button>
    <p id="answer" style="display:none;">${question.correctAnswer}</p>
    <button onclick="nextFlashcard()">Next Flashcard</button>
  `;
}

function revealAnswer() {
  document.getElementById('answer').style.display = 'block';
}

function nextFlashcard() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
  } else {
    currentQuestionIndex = 0; // Loop back to the beginning
  }
  displayFlashcard();
}

