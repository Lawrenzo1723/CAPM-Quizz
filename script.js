document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();
  showHomeScreen();
});

let questions = [];
let currentDomain = "";
let currentSubdomain = "";
let currentQuestionIndex = 0;
let userStats = { correct: 0, incorrect: 0 };

// Define domain and subdomain structure
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
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRyL8ZTnjPNQ0NabBoTUGhQI3m5zIoe7XI3HWzLfxbwcP1gYhsL4s11XGYCYzi2fLPKQ6M4ONri45a7/pub?output=csv');
    const data = await response.text();
    const rows = data.split('\n');

    rows.forEach(row => {
      const cols = row.split(',');
      if (cols.length >= 9) {
        questions.push({
          question: cols[0],
          options: [cols[1], cols[2], cols[3], cols[4]],
          correctAnswer: cols[5].trim(),
          explanation: cols[6],
          domain: cols[7].trim(),
          subdomain: cols[8].trim()
        });
      }
    });
    console.log("Questions Loaded:", questions); // Debugging
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// Show Home Screen
function showHomeScreen() {
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
  const filteredQuestions = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain);

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
    <p>${questionData.question}</p>
    ${questionData.options.map((option) => `<button class="option" onclick="checkAnswer('${option}', this, filteredQuestions)">${option}</button>`).join('')}
    <p id="feedback"></p>
  `;
}

// Check Answer and Provide Feedback
function checkAnswer(selectedOption, button, filteredQuestions) {
  const questionData = filteredQuestions[currentQuestionIndex];
  const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();

  button.classList.add(isCorrect ? 'correct' : 'incorrect');
  document.getElementById('feedback').textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;

  userStats[isCorrect ? 'correct' : 'incorrect']++;
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < filteredQuestions.length) displayQuestion(filteredQuestions);
    else showHomeScreen();
  }, 2000);
}
