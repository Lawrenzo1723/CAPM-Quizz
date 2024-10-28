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
  const screen = document.getElementById('screen');
  screen.innerHTML = `
    <h2>Select a Domain</h2>
    <ul>
      <li onclick="showSubdomains('Project Management Fundamentals and Core Concepts')">Domain 1: Project Management Fundamentals and Core Concepts</li>
      <li onclick="showSubdomains('Predictive, Plan-Based Methodologies')">Domain 2: Predictive, Plan-Based Methodologies</li>
      <li onclick="showSubdomains('Agile Frameworks/Methodologies')">Domain 3: Agile Frameworks/Methodologies</li>
      <li onclick="showSubdomains('Business Analysis Frameworks')">Domain 4: Business Analysis Frameworks</li>
    </ul>
  `;
}

// Show Subdomain Screen
function showSubdomains(domain) {
  currentDomain = domain;
  const screen = document.getElementById('screen');
  const subdomains = [...new Set(questions.filter(q => q.domain === domain).map(q => q.subdomain))];

  screen.innerHTML = `
    <h2>${domain}</h2>
    <ul>
      ${subdomains.map(sub => `<li onclick="showQuestions('${sub}')">${sub}</li>`).join('')}
    </ul>
  `;
}

// Show Questions for Selected Subdomain
function showQuestions(subdomain) {
  currentSubdomain = subdomain;
  currentQuestionIndex = 0;
  displayQuestion();
}

// Display a Question
function displayQuestion() {
  const screen = document.getElementById('screen');
  const questionData = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain)[currentQuestionIndex];

  screen.innerHTML = `
    <p>${questionData.question}</p>
    ${questionData.options.map((option, index) => `<button onclick="checkAnswer('${option}')">${option}</button>`).join('')}
    <p id="feedback"></p>
  `;
}

// Check Answer and Provide Feedback
function checkAnswer(selectedOption) {
  const questionData = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain)[currentQuestionIndex];
  const isCorrect = selectedOption === questionData.correctAnswer;
  
  document.getElementById('feedback').textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;
  
  // Update stats
  if (isCorrect) userStats.correct++;
  else userStats.incorrect++;
}

// Show Profile Screen (Stats)
function showProfile() {
  const screen = document.getElementById('screen');
  screen.innerHTML = `
    <h2>Your Profile</h2>
    <p>Questions Correct: ${userStats.correct}</p>
    <p>Questions Incorrect: ${userStats.incorrect}</p>
  `;
}

// Navigation Handlers
document.getElementById('homeButton').addEventListener('click', showHomeScreen);
document.getElementById('profileButton').addEventListener('click', showProfile);
