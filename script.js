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
