document.addEventListener('DOMContentLoaded', () => {
  showHomeScreen();
  loadQuestions(); // Load all questions into the questions array once
});

let questions = [];
let currentQuestionIndex = 0;
let missedQuestions = [];
let sessionAnswers = [];
let currentSubdomainQuestions = [];
let currentDomain = '';
let currentSubdomain = '';

const questionData = {
  "Project Management Fundamentals": {
    "Project Life Cycles": [
      { question: "What is a project charter?", options: ["Document goals", "Define scope", "Authorize PM", "Approve resources"], correctAnswer: "Authorize PM" },
      { question: "What is the project scope?", options: ["Define goals", "Set boundaries", "Authorize PM", "Schedule tasks"], correctAnswer: "Set boundaries" },
      // Additional questions for this subdomain
    ],
    "Project Management Planning": [
      { question: "What is project management?", options: ["Setting tasks", "Organizing plans", "Defining goals", "Monitoring progress"], correctAnswer: "Defining goals" }
      // Additional questions
    ]
  },
  "Predictive, Plan-Based Methodologies": {
    "Predictive Approach": [
      { question: "When is predictive approach used?", options: ["Dynamic requirements", "Fixed requirements", "Adaptive changes", "Small teams"], correctAnswer: "Fixed requirements" }
      // Additional questions
    ]
  },
  // Add remaining domains and subdomains with questions here
};

// Load questions from the data structure
function loadQuestions() {
  for (let domain in questionData) {
    for (let subdomain in questionData[domain]) {
      questions = questions.concat(questionData[domain][subdomain]);
    }
  }
}

// Display the main home screen with domain options
function showHomeScreen() {
  document.getElementById('screen').innerHTML = `
    <h2>Select a Domain</h2>
    ${Object.keys(questionData).map(domain => `<button class="domain-btn" onclick="showSubdomains('${domain}')">${domain}</button>`).join('')}
  `;
  document.getElementById('footer').style.display = 'none'; // Hide footer on home screen
}

// Display the subdomains of a selected domain
function showSubdomains(domain) {
  currentDomain = domain;
  const subdomains = Object.keys(questionData[domain]);

  document.getElementById('screen').innerHTML = `
    <h2>${domain}</h2>
    <h3>Select a Subdomain</h3>
    ${subdomains.map(subdomain => `<button class="subdomain-btn" onclick="loadQuestionsForSubdomain('${domain}', '${subdomain}')">${subdomain}</button>`).join('')}
  `;
  document.getElementById('footer').style.display = 'flex'; // Show footer after domain selection
}

// Load questions for the selected subdomain
function loadQuestionsForSubdomain(domain, subdomain) {
  currentSubdomain = subdomain;
  currentSubdomainQuestions = questionData[domain][subdomain];
  currentQuestionIndex = 0;
  displayQuestion();
}

// Display the current question with navigation buttons
function displayQuestion() {
  const questionData = currentSubdomainQuestions[currentQuestionIndex];
  document.getElementById('screen').innerHTML = `
    <p>Question ${currentQuestionIndex + 1} of ${currentSubdomainQuestions.length}</p>
    <p>${questionData.question}</p>
    ${questionData.options.map(option => `<button onclick="checkAnswer('${option}')">${option}</button>`).join('')}
    <p id="feedback"></p>
    <div id="navigation">
      <button onclick="prevQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
      <button onclick="nextQuestion()" ${currentQuestionIndex === currentSubdomainQuestions.length - 1 ? 'disabled' : ''}>Next</button>
    </div>
    <p>Progress: Question ${currentQuestionIndex + 1} of ${currentSubdomainQuestions.length}</p>
  `;
}

// Check if selected answer is correct, then provide feedback
function checkAnswer(selectedOption) {
  const questionData = currentSubdomainQuestions[currentQuestionIndex];
  const feedback = document.getElementById('feedback');
  
  if (selectedOption === questionData.correctAnswer) {
    feedback.textContent = "Correct!";
  } else {
    feedback.textContent = "Incorrect.";
    missedQuestions.push(currentSubdomainQuestions[currentQuestionIndex]);
  }
}

// Go to the previous question
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

// Go to the next question
function nextQuestion() {
  if (currentQuestionIndex < currentSubdomainQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  }
}

// Functions for footer navigation (Practice Mistakes, Review Mode, Flashcards, Random Quiz)
function showPracticeMistakes() {
  if (missedQuestions.length > 0) {
    currentSubdomainQuestions = missedQuestions;
    currentQuestionIndex = 0;
    displayQuestion();
  } else {
    document.getElementById('screen').innerHTML = "<p>No missed questions to practice.</p>";
  }
}

function showReviewMode() {
  currentSubdomainQuestions = questions;
  currentQuestionIndex = 0;
  displayQuestion();
}

function showFlashcards() {
  displayFlashcard();
}

function displayFlashcard() {
  const questionData = currentSubdomainQuestions[currentQuestionIndex];
  document.getElementById('screen').innerHTML = `
    <p>Flashcard: ${questionData.question}</p>
    <button onclick="revealAnswer()">Reveal Answer</button>
    <p id="answer" style="display:none;">Answer: ${questionData.correctAnswer}</p>
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

function showRandomQuiz() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentSubdomainQuestions = [questions[randomIndex]];
  currentQuestionIndex = 0;
  displayQuestion();
}
