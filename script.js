document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();
  showHomeScreen();
});

let questions = [];
let currentQuestionIndex = 0;
let userStats = { correct: 0, incorrect: 0 };
let currentDomain = "";
let currentSubdomain = "";

// Load questions from Google Sheets
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
      domain: cols[7],
      subdomain: cols[8]
    });
  });
}

// Show Home Screen (Domain Selection)
function showHomeScreen() {
  document.getElementById('progressContainer').style.display = 'none'; // Hide progress bar
  const screen = document.getElementById('screen');
  screen.innerHTML = `
    <h2>Select a Domain</h2>
    ${['Project Management Fundamentals and Core Concepts', 'Predictive, Plan-Based Methodologies', 'Agile Frameworks/Methodologies', 'Business Analysis Frameworks']
      .map(domain => `<button class="domain" onclick="showSubdomains('${domain}')">${domain}</button>`).join('')}
  `;
}

// Show Subdomain Screen
function showSubdomains(domain) {
  currentDomain = domain;
  const screen = document.getElementById('screen');
  const subdomains = [...new Set(questions.filter(q => q.domain === domain).map(q => q.subdomain))];

  screen.innerHTML = `
    <h2>${domain}</h2>
    ${subdomains.map(sub => `<button class="subdomain" onclick="showQuestions('${sub}')">${sub}</button>`).join('')}
  `;
}

// Show Questions for Selected Subdomain
function showQuestions(subdomain) {
  currentSubdomain = subdomain;
  currentQuestionIndex = 0;
  document.getElementById('progressContainer').style.display = 'block'; // Show progress bar during questions
  displayQuestion();
}

// Display a Question
function displayQuestion() {
  const screen = document.getElementById('screen');
  const questionData = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain)[currentQuestionIndex];

  screen.innerHTML = `
    <p>Question ${currentQuestionIndex + 1} / ${questions.length}</p>
    <p>${questionData.question}</p>
    ${questionData.options.map((option) => `<button class="option" onclick="checkAnswer('${option}', this)">${option}</button>`).join('')}
    <p id="feedback"></p>
  `;
  updateProgressBar();
}

// Check Answer and Provide Feedback
function checkAnswer(selectedOption, button) {
  const questionData = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain)[currentQuestionIndex];
  const isCorrect = selectedOption === questionData.correctAnswer;
  
  // Highlight selected button
  document.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');

  // Display feedback and explanation
  document.getElementById('feedback').textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;

  // Update stats
  if (isCorrect) userStats.correct++;
  else userStats.incorrect++;
}

// Show Profile Screen (Stats)
function showProfile() {
  document.getElementById('progressContainer').style.display = 'none'; // Hide progress bar in profile
  const screen = document.getElementById('screen');
  screen.innerHTML = `
    <h2>Your Profile</h2>
    <p>Questions Correct: ${userStats.correct}</p>
    <p>Questions Incorrect: ${userStats.incorrect}</p>
  `;
}

// Update Progress Bar
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const totalQuestions = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain).length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
}

// Navigation Handlers
document.getElementById('homeButton').addEventListener('click', showHomeScreen);
document.getElementById('profileButton').addEventListener('click', showProfile);
