document.addEventListener('DOMContentLoaded', () => {
  showHome();
  loadQuestions(); // Load all questions into the questions array once
});

let questions = [];
let currentQuestionIndex = 0;
let missedQuestions = [];
let sessionAnswers = [];
let currentSubdomainQuestions = [];

// Sample data structure for questions, organized by domains and subdomains
const questionData = {
  "Project Management Fundamentals": {
    "Project Life Cycles": [
      { question: "What is a project charter?", options: ["Document goals", "Define scope", "Authorize PM", "Approve resources"], correctAnswer: "Authorize PM" },
      // Add more questions here for this subdomain
    ],
    "Project Management Planning": [
      { question: "What is project scope?", options: ["Define goals", "Set resources", "Plan schedule", "Set project boundaries"], correctAnswer: "Set project boundaries" }
      // Add more questions here
    ]
  },
  "Predictive, Plan-Based Methodologies": {
    "Predictive Approach": [
      { question: "When is the predictive approach best?", options: ["In uncertain environments", "For fixed requirements", "For agile projects", "In small teams"], correctAnswer: "For fixed requirements" }
      // Add more questions here
    ],
    "Plan-Based Scheduling": [
      { question: "What is plan-based scheduling?", options: ["Flexible", "Unstructured", "Sequential", "Iterative"], correctAnswer: "Sequential" }
      // Add more questions here
    ]
  },
  "Agile Frameworks/Methodologies": {
    "Adaptive Approaches": [
      { question: "What is adaptive planning?", options: ["Fixed scope", "Incremental planning", "Single-phase", "Low engagement"], correctAnswer: "Incremental planning" }
      // Add more questions here
    ],
    "Project Iterations": [
      { question: "What is an iteration?", options: ["Single delivery", "Repeated cycle", "One-time plan", "Static process"], correctAnswer: "Repeated cycle" }
      // Add more questions here
    ]
  },
  "Business Analysis Frameworks": {
    "BA Roles": [
      { question: "What is a key role in business analysis?", options: ["Setting goals", "Identifying risks", "Defining scope", "Stakeholder communication"], correctAnswer: "Stakeholder communication" }
      // Add more questions here
    ],
    "Stakeholder Communication": [
      { question: "How often should stakeholders be updated?", options: ["Never", "Monthly", "As needed", "After project completion"], correctAnswer: "As needed" }
      // Add more questions here
    ]
  }
};

// Load questions into a structured format
function loadQuestions() {
  for (let domain in questionData) {
    for (let subdomain in questionData[domain]) {
      questions = questions.concat(questionData[domain][subdomain]);
    }
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

  const subdomains = Object.keys(questionData[domain]);
  document.getElementById('quiz-content').innerHTML = `
    <h3>Select a Subdomain in ${domain}</h3>
    ${subdomains.map(subdomain => `<button onclick="loadQuestionsForSubdomain('${domain}', '${subdomain}')">${subdomain}</button>`).join('')}
  `;
}

// Load questions for a selected subdomain and display the first question
function loadQuestionsForSubdomain(domain, subdomain) {
  currentSubdomainQuestions = questionData[domain][subdomain];
  currentQuestionIndex = 0;
  displayQuestion();
}

// Display a specific question with navigation and progress
function displayQuestion() {
  const questionData = currentSubdomainQuestions[currentQuestionIndex];
  document.getElementById('quiz-title').textContent = `Question ${currentQuestionIndex + 1} of ${currentSubdomainQuestions.length}`;
  document.getElementById('quiz-content').innerHTML = `
    <p>${questionData.question}</p>
    ${questionData.options.map(option => `<button onclick="checkAnswer('${option}', '${questionData.correctAnswer}')">${option}</button>`).join('')}
    <p id="feedback"></p>
    <div id="navigation">
      <button onclick="prevQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
      <button onclick="nextQuestion()" ${currentQuestionIndex === currentSubdomainQuestions.length - 1 ? 'disabled' : ''}>Next</button>
    </div>
    <p id="progress-count">Question ${currentQuestionIndex + 1} of ${currentSubdomainQuestions.length}</p>
  `;
}

function checkAnswer(selectedOption, correctAnswer) {
  const feedback = document.getElementById('feedback');
  if (selectedOption === correctAnswer) {
    feedback.textContent = "Correct!";
  } else {
    feedback.textContent = "Incorrect.";
    missedQuestions.push(currentSubdomainQuestions[currentQuestionIndex]);
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < currentSubdomainQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  }
}

function navigateTo(mode) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('footer').style.display = 'flex';

  if (mode === 'practice') {
    currentSubdomainQuestions = missedQuestions;
    currentQuestionIndex = 0;
    displayQuestion();
  } else if (mode === 'review') {
    currentSubdomainQuestions = questions;
    currentQuestionIndex = 0;
    displayQuestion();
  } else if (mode === 'flashcard') {
    displayFlashcard();
  } else if (mode === 'random') {
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentSubdomainQuestions = [questions[randomIndex]];
    currentQuestionIndex = 0;
    displayQuestion();
  }
}

function displayFlashcard() {
  const questionData = currentSubdomainQuestions[currentQuestionIndex];
  document.getElementById('quiz-content').innerHTML = `
    <p>${questionData.question}</p>
    <button onclick="revealAnswer()">Reveal Answer</button>
    <p id="answer" style="display:none;">${questionData.correctAnswer}</p>
    <button onclick="nextFlashcard()">Next Flashcard</button>
  `;
}

function revealAnswer() {
  document.getElementById('answer').style.display = 'block';
}

function nextFlashcard() {
  currentQuestionIndex = (currentQuestionIndex + 1) % currentSubdomainQuestions.length;
  displayFlashcard();
}
