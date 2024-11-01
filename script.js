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

// Helper function to load user progress from localStorage
function loadProgress() {
    const progressData = localStorage.getItem('quizProgress');
    if (progressData) {
        return JSON.parse(progressData);
    }
    return {
        completedQuestions: [],
        missedQuestions: [],
        score: 0
    };
}

// Helper function to save user progress to localStorage
function saveProgress() {
    localStorage.setItem('quizProgress', JSON.stringify(userProgress));
}

// Initialize user progress
let userProgress = loadProgress();

let questions = [];
let currentDomain = "";
let currentSubdomain = "";
let currentQuestionIndex = 0;
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

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Lawrenzo1723/CAPM-Quizz/refs/heads/main/question%20in%20Json.json');
        const data = await response.json();

        // Process the JSON data directly
        questions = data.map(row => ({
            question: row["Question"],
            options: [row["Option A"], row["Option B"], row["Option C"], row["Option D"]],
            correctAnswer: row["Correct Answer"].trim(),
            explanation: row["Explanation"],
            domain: row["Domain"].trim(),
            subdomain: row["Subdomain"].trim()
        }));

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
    document.getElementById('footer').style.display = 'flex';
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

    const filteredQuestions = shuffleArray(
        questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain && 
        !userProgress.completedQuestions.includes(q.question))
    );

    if (filteredQuestions.length > 0) {
        displayQuestion(filteredQuestions);
    } else {
        document.getElementById('screen').innerHTML = `<p>No questions available for this subdomain.</p>`;
    }
}

function displayQuestion(filteredQuestions) {
    const screen = document.getElementById('screen');
    const questionData = filteredQuestions[currentQuestionIndex];

    if (!questionData) {
        screen.innerHTML = `<p>Question data not found.</p>`;
        return;
    }

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
        button.addEventListener('click', () => checkAnswer(option, questionData, filteredQuestions));
        optionsDiv.appendChild(button);
    });

    document.getElementById('prevButton').addEventListener('click', () => prevQuestion(filteredQuestions));
    document.getElementById('nextButton').addEventListener('click', () => nextQuestion(filteredQuestions));

    document.getElementById('prevButton').disabled = currentQuestionIndex === 0;
    document.getElementById('nextButton').disabled = currentQuestionIndex === filteredQuestions.length - 1;
}

function checkAnswer(selectedOption, questionData, filteredQuestions) {
    const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();
    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;

    if (!isCorrect && !userProgress.missedQuestions.includes(questionData.question)) {
        userProgress.missedQuestions.push(questionData.question);
    }

    if (!userProgress.completedQuestions.includes(questionData.question)) {
        userProgress.completedQuestions.push(questionData.question);
    }

    saveProgress();
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

// Practice Mistakes Mode
function showMissedQuestions() {
    const missed = questions.filter(q => userProgress.missedQuestions.includes(q.question));
    if (missed.length > 0) {
        currentQuestionIndex = 0;
        displayQuestion(shuffleArray(missed));
    } else {
        document.getElementById('screen').innerHTML = `<p>No missed questions to review!</p>`;
    }
}

// Review Mode
function showReviewMode() {
    if (sessionAnswers.length > 0) {
        currentQuestionIndex = 0;
        displayReviewQuestion();
    } else {
        document.getElementById('screen').innerHTML = `<p>No session data to review!</p>`;
    }
}

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
}

// Flashcard Mode
function showFlashcardMode() {
    currentQuestionIndex = 0;
    displayFlashcard(shuffleArray([...questions]));
}

function displayFlashcard(shuffledQuestions) {
    const screen = document.getElementById('screen');
    const questionData = shuffledQuestions[currentQuestionIndex];

    screen.innerHTML = `
        <div id="flashcard">
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
            displayFlashcard(shuffledQuestions);
        }
    });
    document.getElementById('nextFlashcard').addEventListener('click', () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            currentQuestionIndex++;
            displayFlashcard(shuffledQuestions);
        }
    });
}

// Random Quiz Mode
function showRandomQuiz() {
    const shuffledQuestions = shuffleArray([...questions]);
    currentQuestionIndex = 0;
    displayQuestion(shuffledQuestions);
}
