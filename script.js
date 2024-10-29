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
let sessionAnswers = []; // Array to store answered questions for review

const domainStructure = {
    "Project Management Fundamentals and Core Concepts": [
        "Project Life Cycles and Processes",
        "Project Management Planning",
        "Project Roles and Responsibilities",
        "Following and Executing Planned Strategies or Frameworks",
        "Common Problem-Solving Tools and Techniques"
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
        const response = await fetch('https://script.google.com/macros/s/AKfycbx74zavGBC63Jinhzc9hjTcJ7mj-hB-jM19vGBUDs2wZgvlmm2Ft1eQ0-XixNxo4fM/exec');
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

function showHomeScreen() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `<h2>Select a Domain</h2>
        ${Object.keys(domainStructure).map(domain => `<button class="domain-btn">${domain}</button>`).join('')}`;
    document.querySelectorAll('.domain-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => showSubdomains(Object.keys(domainStructure)[index]));
    });
    document.getElementById('footer').style.display = 'flex'; // Show footer on the home screen
}

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
    document.getElementById('footer').style.display = 'flex';
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

function checkAnswer(selectedOption, filteredQuestions) {
    const questionData = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();

    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;

    if (!isCorrect) missedQuestions.push(questionData);
    
    // Add question and user's answer to sessionAnswers
    sessionAnswers.push({
        ...questionData,
        userAnswer: selectedOption,
        isCorrect
    });
}

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

function showMissedQuestions() {
    if (missedQuestions.length > 0) {
        currentQuestionIndex = 0;
        displayQuestion(missedQuestions);
    } else {
        document.getElementById('screen').innerHTML = `<p>No missed questions to review!</p>`;
    }
    document.getElementById('footer').style.display = 'flex';
}

// Updated showReviewMode function
function showReviewMode() {
    const screen = document.getElementById('screen');
    if (sessionAnswers.length > 0) {
        currentQuestionIndex = 0;
        displayReviewQuestion();
        document.getElementById('footer').style.display = 'flex';
    } else {
        screen.innerHTML = `<p>No session data to review!</p>`;
    }
}

// Updated displayReviewQuestion function
function displayReviewQuestion() {
    const screen = document.getElementById('screen');
    const questionData = sessionAnswers[currentQuestionIndex];
    
    screen.innerHTML = `
        <p>Question ${currentQuestionIndex + 1} of ${sessionAnswers.length}</p>
        <p>${questionData.question}</p>
        <p>Your Answer: ${questionData.userAnswer} - ${questionData.isCorrect ? "Correct" : "Incorrect"}</p>
        <p>Explanation: ${questionData.explanation}</p>
        <div id="navigation">
            <button id="prevButton">Previous</button>
            <button id="nextButton">Next</button>
        </div>
    `;
    
    document.getElementById('prevButton').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayReviewQuestion();
        }
    });
    document.getElementById('nextButton').addEventListener('click', () => {
        if (currentQuestionIndex < sessionAnswers.length - 1) {
            currentQuestionIndex++;
            displayReviewQuestion();
        }
    });

    document.getElementById('prevButton').disabled = currentQuestionIndex === 0;
    document.getElementById('nextButton').disabled = currentQuestionIndex === sessionAnswers.length - 1;
}

function showFlashcardMode() {
    currentQuestionIndex = 0;
    displayFlashcard();
    document.getElementById('footer').style.display = 'flex';
}

function showRandomQuiz() {
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    displayQuestion(shuffledQuestions);
    document.getElementById('footer').style.display = 'flex';
}

function displayFlashcard() {
    const screen = document.getElementById('screen');
    const questionData = questions[currentQuestionIndex];
    screen.innerHTML = `
        <div id="flashcard" style="padding: 20px; text-align: center;">
            <p>Question: ${questionData.question}</p>
            <button id="revealAnswer">Reveal Answer</button>
            <p id="answer" style="display:none;">Answer: ${questionData.correctAnswer}<br>Explanation: ${questionData.explanation}</p>
            <div id="navigation">
                <button id="prevFlashcard">Previous</button>
                <button id="nextFlashcard">Next</button>
            </div>
        </div>
    `;
    document.getElementById('revealAnswer').addEventListener('click', () => {
        document.getElementById('answer').style.display = 'block';
    });
    document.getElementById('prevFlashcard').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayFlashcard();
        }
    });
    document.getElementById('nextFlashcard').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayFlashcard();
        }
    });
}
