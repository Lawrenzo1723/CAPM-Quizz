document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    loadProgress();
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

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('missedQuestions', JSON.stringify(missedQuestions));
    localStorage.setItem('sessionAnswers', JSON.stringify(sessionAnswers));
}

// Load progress from localStorage
function loadProgress() {
    missedQuestions = JSON.parse(localStorage.getItem('missedQuestions') || '[]');
    sessionAnswers = JSON.parse(localStorage.getItem('sessionAnswers') || '[]');
}

// Display home screen with domains and Game Mode button
function showHomeScreen() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `<h2>Select a Domain</h2>
        ${Object.keys(domainStructure).map(domain => `<button class="domain-btn">${domain}</button>`).join('')}
        <button id="gameModeButton" class="domain-btn">Game Mode</button> <!-- New Game Mode button -->
    `;

    // Add event listeners for domain buttons
    document.querySelectorAll('.domain-btn').forEach((btn, index) => {
        if (btn.id !== "gameModeButton") { // Only add listener to domain buttons, not Game Mode button
            btn.addEventListener('click', () => showSubdomains(Object.keys(domainStructure)[index]));
        }
    });

    // Add event listener for the Game Mode button
    document.getElementById('gameModeButton').addEventListener('click', showGameMode);

    document.getElementById('footer').style.display = 'flex';
}

// Display subdomains for the selected domain
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

// Display questions for the selected subdomain
function showQuestions(subdomain) {
    currentSubdomain = subdomain;
    currentQuestionIndex = 0;

    // Filter and shuffle questions based on current domain and subdomain
    const filteredQuestions = shuffleArray(
        questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain)
    );

    if (filteredQuestions.length > 0) {
        displayQuestion(filteredQuestions);
    } else {
        document.getElementById('screen').innerHTML = `<p>No questions available for this subdomain.</p>`;
    }
}

// Display a question from the filtered questions
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
        button.addEventListener('click', () => checkAnswer(option, questionData));
        optionsDiv.appendChild(button);
    });

    document.getElementById('prevButton').addEventListener('click', () => prevQuestion(filteredQuestions));
    document.getElementById('nextButton').addEventListener('click', () => nextQuestion(filteredQuestions));

    document.getElementById('prevButton').disabled = currentQuestionIndex === 0;
    document.getElementById('nextButton').disabled = currentQuestionIndex === filteredQuestions.length - 1;
}

// Check if the answer is correct
function checkAnswer(selectedOption, questionData) {
    const isCorrect = selectedOption.trim() === questionData.correctAnswer.trim();
    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? `Correct! ${questionData.explanation}` : `Incorrect. ${questionData.explanation}`;

    if (!isCorrect) missedQuestions.push(questionData);

    // Add to sessionAnswers for Review Mode
    sessionAnswers.push({
        ...questionData,
        userAnswer: selectedOption,
        isCorrect
    });

    // Save progress after each answer
    saveProgress();
}

// Show the previous question
function prevQuestion(filteredQuestions) {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(filteredQuestions);
    }
}

// Show the next question
function nextQuestion(filteredQuestions) {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(filteredQuestions);
    }
}

// Practice Mistakes Mode
function showMissedQuestions() {
    if (missedQuestions.length > 0) {
        currentQuestionIndex = 0;
        displayQuestion(shuffleArray(missedQuestions));
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

// Game Mode - Placeholder for actual functionality
function showGameMode() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `<h2>Game Mode</h2><p>Welcome to Game Mode! Here’s where you can play...</p>`;
    // Add more logic here to define the actual game mode functionality.
}
