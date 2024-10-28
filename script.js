document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();
  showHomeScreen();

  // Create Home Button that stays at the bottom of the screen
  const homeButton = document.createElement('button');
  homeButton.textContent = "Home";
  homeButton.id = "homeButton";
  homeButton.addEventListener('click', showHomeScreen);
  document.body.appendChild(homeButton);

  // Create Practice Mistakes Button
  const practiceButton = document.createElement('button');
  practiceButton.textContent = "Practice Mistakes";
  practiceButton.id = "practiceButton";
  practiceButton.addEventListener('click', showMissedQuestions);
  document.body.appendChild(practiceButton);
});

let questions = [];
let currentDomain = "";
let currentSubdomain = "";
let currentQuestionIndex = 0;
let userStats = { correct: 0, incorrect: 0 };
let missedQuestions = []; // Array to store incorrectly answered questions

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
    ${Object.keys(domainStructure).map(domain => `<button class="domain-btn">${domain}</button>`).join('')}
  `;

  // Attach event listeners to domain buttons
  document.querySelectorAll('.domain-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => showSubdomains(Object.keys(domainStructure)[index]));
  });
}

// Show Subdomain Screen
function showSubdomains(domain) {
  currentDomain = domain;
  const screen = document.getElementById('screen');
  const subdomains = domainStructure[domain];

  screen.innerHTML = `
    <h2>${domain}</h2>
    ${subdomains.map(sub => `<button class="subdomain-btn">${sub}</button>`).join('')}
  `;

  // Attach event listeners to subdomain buttons
  document.querySelectorAll('.subdomain-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => showQuestions(subdomains[index]));
  });
}

// Show Questions for Selected Subdomain
function showQuestions(subdomain) {
  currentSubdomain = subdomain;
  currentQuestionIndex = 0;
  const filteredQuestions = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain);

  console.log("Filtered Questions:", filteredQuestions);

  if (filteredQuestions.length > 0) {
    displayQuestion(filteredQuestions);
  } else {
    document.getElementById('screen').innerHTML = `<p>No questions available for this subdomain.</p>`;
  }
}

// Display a Question with Previous and Next Buttons
function displayQuestion(filteredQuestions) {
  const screen = document.getElementById('screen');
  const questionData = filteredQuestions[currentQuestionIndex];

  screen.innerHTML = `
    <p>Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}</p>
    <p>${questionData.question}</p>
    <div id="options"></div>
    <p id="feedback"></p>
    <div id="navigation">
      <button id="prevButton">Previous</button>
      <button id="nextButton">Next</button>
    </div>
  `;

  // Display options with event listeners
  const optionsDiv = document.getElementById('options');
  questionData.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option-btn');
    button.addEventListener('click', () => checkAnswer(option, filteredQuestions));
    optionsDiv.appendChild(button);
  });

  // Add event listeners for Previous and Next buttons
  document.getElementById('prevButton').addEventListener('click', () => prevQuestion(filteredQuestions));
  document.getElementById('nextButton').addEventListener('click', () => nextQuestion(filteredQuestions));

  // Disable Previous button if on the first question
  document.getElementById('prevButton').disabled = currentQuestionIndex === 0;

  // Disable Next button if on the last question
  document.getElementById('nextButton').disabled = currentQuestionIndex === filteredQuestions.length - 1;
}

// Check Answer and Provide Feedback
function checkAnswer(selectedOption, filteredQuestions) {
  const questionData = filteredQuestions[currentQuestionIndex];
  const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();

  // Display feedback immediately
  const feedback = document.getElementById('feedback');
  feedback.textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;

  console.log("Selected Option:", selectedOption);
  console.log("Correct Answer:", questionData.correctAnswer);
  console.log("Is Correct:", isCorrect);

  // Update stats and add to missedQuestions if incorrect
  if (isCorrect) {
    userStats.correct++;
  } else {
    userStats.incorrect++;
    missedQuestions.push(questionData); // Store the missed question
  }
}

// Go to the Previous Question
function prevQuestion(filteredQuestions) {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(filteredQuestions);
  }
}

// Go to the Next Question
function nextQuestion(filteredQuestions) {
  if (currentQuestionIndex < filteredQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(filteredQuestions);
  }
}

// Show Missed Questions for Practice
function showMissedQuestions() {
  if (missedQuestions.length > 0) {
    currentQuestionIndex = 0; // Reset to the beginning
    displayQuestion(missedQuestions);
  } else {
    document.getElementById('screen').innerHTML = `<p>No missed questions to review!</p>`;
  }
}
