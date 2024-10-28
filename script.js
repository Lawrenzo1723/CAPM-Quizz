document.addEventListener('DOMContentLoaded', () => {
  loadQuestions(); // Load questions once
  showHomeScreen();
});

let questions = [];
let currentQuestionIndex = 0;
let userStats = { correct: 0, incorrect: 0 };
let currentDomain = "";
let currentSubdomain = "";

// Hardcoded domains and their subdomains
const domainStructure = {
  "Project Management Fundamentals and Core Concepts": [
    "Project Life Cycles and Processes",
    "Project Management Planning",
    "Project Roles and Responsibilities",
    "Following and Executing Planned Strategies or Frameworks"
  ],
  "Predictive, Plan-Based Methodologies": [
    "When to Use a Predictive, Plan-Based Approach",
    "Project Management Plan Scheduling",
    "Documentation and Controls for Predictive, Plan-Based Projects"
  ],
  "Agile Frameworks/Methodologies": [
    "Timing for Adaptive Approaches",
    "Planning Project Iterations",
    "Documentation and Controls for Adaptive Projects",
    "Components of an Adaptive Plan",
    "Task Management Preparation and Execution Steps"
  ],
  "Business Analysis Frameworks": [
    "Business Analysis (BA) Roles and Responsibilities",
    "Conducting Stakeholder Communication",
    "Gathering Requirements",
    "Product Roadmaps",
    "Influence of Project Methodologies on Business Analysis Processes",
    "Validating Requirements through Product Delivery"
  ]
};

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
      correctAnswer: cols[5].trim(),
      explanation: cols[6],
      domain: cols[7].trim(),
      subdomain: cols[8].trim()
    });
  });
}

// Show Home Screen (Domain Selection)
function showHomeScreen() {
  document.getElementById('progressContainer').style.display = 'none'; // Hide progress bar
  const screen = document.getElementById('screen');
  screen.innerHTML = `
    <h2>Select a Domain</h2>
    ${Object.keys(domainStructure).map(domain => `<button class="domain" onclick="showSubdomains('${domain}')">${domain}</button>`).join('')}
  `;
}

// Show Subdomain Screen
function showSubdomains(domain) {
  currentDomain = domain;
  const screen = document.getElementById('screen');
  const subdomains = domainStructure[domain];

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

  // Filter questions based on exact Domain and Subdomain match
  const filteredQuestions = questions.filter(q => {
    return q.domain === currentDomain && q.subdomain === currentSubdomain;
  });

  if (filteredQuestions.length > 0) {
    displayQuestion(filteredQuestions);
  } else {
    document.getElementById('screen').innerHTML = `<p>No questions available for this subdomain.</p>`;
  }
}

// Display a Question
function displayQuestion(filteredQuestions) {
  const screen = document.getElementById('screen');
  const questionData = filteredQuestions[currentQuestionIndex];

  screen.innerHTML = `
    <p>Question ${currentQuestionIndex + 1} / ${filteredQuestions.length}</p>
    <p>${questionData.question}</p>
    ${questionData.options.map((option) => `<button class="option" onclick="checkAnswer('${option}', this, filteredQuestions)">${option}</button>`).join('')}
    <p id="feedback"></p>
  `;
  updateProgressBar(filteredQuestions.length);
}

// Check Answer and Provide Feedback
function checkAnswer(selectedOption, button, filteredQuestions) {
  const questionData = filteredQuestions[currentQuestionIndex];
  const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();

  // Clear any previously selected button styles
  document.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
  
  // Highlight the selected button
  button.classList.add('selected');

  // Provide feedback based on correctness
  const feedback = document.getElementById('feedback');
  feedback.textContent = isCorrect 
    ? `Correct! ${questionData.explanation}` 
    : `Incorrect. ${questionData.explanation}`;

  // Update button color based on correctness
  button.style.backgroundColor = isCorrect ? '#4CAF50' : '#f44336';

  // Update stats for correct/incorrect answers
  if (isCorrect) userStats.correct++;
  else userStats.incorrect++;

  // Move to next question automatically after a delay
  setTimeout(() => {
    button.style.backgroundColor = ''; // Reset color for the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < filteredQuestions.length) {
      displayQuestion(filteredQuestions);
    } else {
      showHomeScreen(); // Return to home screen or end of subdomain questions
    }
  }, 2000); // 2-second delay to show feedback
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
function updateProgressBar(totalQuestions) {
  const progressBar = document.getElementById('progressBar');
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
}

// Navigation Handlers
document.getElementById('homeButton').addEventListener('click', showHomeScreen);
document.getElementById('profileButton').addEventListener('click', showProfile);
