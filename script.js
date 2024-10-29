document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    showHomeScreen();

    // Navigation Buttons
    const homeButton = document.getElementById('homeButton');
    const practiceButton = document.getElementById('practiceButton');
    const reviewButton = document.getElementById('reviewButton');
    const flashcardButton = document.getElementById('flashcardButton');
    const randomQuizButton = document.getElementById('randomQuizButton');

    homeButton.addEventListener('click', showHomeScreen);
    practiceButton.addEventListener('click', showMissedQuestions);
    reviewButton.addEventListener('click', showReviewMode);
    flashcardButton.addEventListener('click', showFlashcardMode);
    randomQuizButton.addEventListener('click', showRandomQuiz);
});

let questions = [];
let currentDomain = "";
let currentSubdomain = "";
let currentQuestionIndex = 0;
let missedQuestions = [];
let sessionAnswers = [];

// Updated domain structure based on user input
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
        console.log("Questions Loaded:", questions);
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

    document.querySelectorAll('.domain-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => showSubdomains(Object.keys(domainStructure)[index]));
    });
    document.getElementById('footer').style.display = 'none'; // Hide footer on Home Screen
}

// Show Subdomain Screen
function showSubdomains(domain) {
    currentDomain = domain;
    const screen = document.getElementById('screen');
    const subdomains = domainStructure[domain];

    screen.innerHTML = `
        <h2>${domain}</h2>
        <h3>Select a Subdomain</h3>
        ${subdomains.map(sub => `<button class="subdomain-btn">${sub}</button>`).join('')}
    `;

    document.querySelectorAll('.subdomain-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => showQuestions(subdomains[index]));
    });

    document.getElementById('footer').style.display = 'block'; // Show footer on Subdomain Screen
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

    const optionsDiv = document.getElementById('options');
    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => checkAnswer(option, filteredQuestions));
        optionsDiv.appendChild(button);
    });

    document.getElementById('prevButton').addEventListener('click', () => prevQuestion(filteredQuestions));
    document.getElementById('nextButton').addEventListener('click', () => nextQuestion(filteredQuestions));

    document.getElementById('prevButton').disabled = currentQuestionIndex === 0;
    document.getElementById('nextButton').disabled = currentQuestionIndex === filteredQuestions.length - 1;
}

// Check Answer and Provide Feedback
function checkAnswer(selectedOption, filteredQuestions) {
    const questionData = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();

    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;

    if (!isCorrect) missedQuestions.push(questionData);
}

// Navigation functions
function prevQuestion(filteredQuestions) {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(filteredQuestions);
    }
}

function nextQuestion(filteredQuestions) {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(filteredQuestions);
    }
}

// Show Missed Questions
function showMissedQuestions() {
    if (missedQuestions.length > 0) {
        currentQuestionIndex = 0;
        displayQuestion(missedQuestions);
    } else {
        document.getElementById('screen').innerHTML = `<p>No missed questions to review!</p>`;
    }
}

// Show Review Mode (Placeholder)
function showReviewMode() {
    document.getElementById('screen').innerHTML = "<p>Review Mode: Feature under construction.</p>";
}

// Show Flashcard Mode (Placeholder)
function showFlashcardMode() {
    document.getElementById('screen').innerHTML = "<p>Flashcard Mode: Feature under construction.</p>";
}

// Show Random Quiz (Placeholder)
function showRandomQuiz() {
    document.getElementById('screen').innerHTML = "<p>Random Quiz: Feature under construction.</p>";
}
