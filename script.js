document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    showHomeScreen();

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
let userStats = { correct: 0, incorrect: 0 };
let missedQuestions = [];
let sessionAnswers = [];

const domainStructure = {
    "Project Management Fundamentals": ["Project Life Cycles", "Project Management Planning"],
    "Predictive, Plan-Based Methodologies": ["When to Use Predictive Approaches", "Project Management Plan Scheduling"],
    "Agile Frameworks/Methodologies": ["Timing for Adaptive Approaches", "Planning Project Iterations"],
    "Business Analysis Frameworks": ["Business Analysis Roles", "Stakeholder Communication"]
};

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
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

function showHomeScreen() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <h2>Select a Domain</h2>
        ${Object.keys(domainStructure).map(domain => `<button class="domain-btn">${domain}</button>`).join('')}
    `;
    document.querySelectorAll('.domain-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => showSubdomains(Object.keys(domainStructure)[index]));
    });
    document.getElementById('footer').style.display = 'none';
}

function showSubdomains(domain) {
    currentDomain = domain;
    const screen = document.getElementById('screen');
    const subdomains = domainStructure[domain];
    screen.innerHTML = `
        <h2>${domain}</h2>
        ${subdomains.map(sub => `<button class="subdomain-btn">${sub}</button>`).join('')}
    `;
    document.querySelectorAll('.subdomain-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => showQuestions(subdomains[index]));
    });
    document.getElementById('footer').style.display = 'block';
}

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

function displayQuestion(filteredQuestions) {
    const screen = document.getElementById('screen');
    const questionData = filteredQuestions[currentQuestionIndex];
    screen.innerHTML = `
        <p>Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}</p>
        <p>${questionData.question}</p>
        <div id="options"></div>
        <p id="feedback"></p>
        <button id="prevButton">Previous</button>
        <button id="nextButton">Next</button>
    `;
    document.getElementById('prevButton').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(filteredQuestions);
        }
    });
    document.getElementById('nextButton').addEventListener('click', () => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(filteredQuestions);
        }
    });
}

function checkAnswer(selectedOption, filteredQuestions) {
    const questionData = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();
    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;
}

function showMissedQuestions() {
    if (missedQuestions.length > 0) {
        currentQuestionIndex = 0;
        displayQuestion(missedQuestions);
    } else {
        document.getElementById('screen').innerHTML = `<p>No missed questions to review!</p>`;
    }
}

function showReviewMode() {
    if (sessionAnswers.length > 0) {
        currentQuestionIndex = 0;
        displayReviewQuestion();
    } else {
        document.getElementById('screen').innerHTML = `<p>No session data to review!</p>`;
    }
}

function showFlashcardMode() {
    currentQuestionIndex = 0;
    displayFlashcard();
}

function displayFlashcard() {
    const screen = document.getElementById('screen');
    const questionData = questions[currentQuestionIndex];
    screen.innerHTML = `
        <p>Question: ${questionData.question}</p>
        <button id="revealAnswer">Reveal Answer</button>
        <p id="answer" style="display:none;">Answer: ${questionData.correctAnswer}</p>
        <button id="prevFlashcard">Previous</button>
        <button id="nextFlashcard">Next</button>
    `;
    document.getElementById('revealAnswer').addEventListener('click', () => {
        document.getElementById('answer').style.display = 'block';
    });
}

function showRandomQuiz() {
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    displayQuestion(shuffledQuestions);
}
