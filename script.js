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

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Lawrenzo1723/CAPM-Quizz/refs/heads/main/question%20in%20Json.json');
        const data = await response.json();

        console.log("Raw data from fetch:", data); // Debug line

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

// Placeholder function to avoid "not defined" error
function showMissedQuestions() {
    console.log("showMissedQuestions called");
    const screen = document.getElementById('screen');
    if (missedQuestions.length > 0) {
        currentQuestionIndex = 0;
        displayQuestion(missedQuestions);
    } else {
        screen.innerHTML = `<p>No missed questions to review!</p>`;
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

    // Filter questions based on current domain and subdomain
    const filteredQuestions = questions.filter(q => q.domain === currentDomain && q.subdomain === currentSubdomain);

    console.log("Current Domain:", currentDomain); // Debug line
    console.log("Current Subdomain:", currentSubdomain); // Debug line
    console.log("Filtered Questions:", filteredQuestions); // Debug line

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
        console.error("No question data found at index", currentQuestionIndex); // Debug line
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
        button.addEventListener('click', () => checkAnswer(option, filteredQuestions));
        optionsDiv.appendChild(button);
    });

    document.getElementById('prevButton').addEventListener('click', () => prevQuestion(filteredQuestions));
    document.getElementById('nextButton').addEventListener('click', () => nextQuestion(filteredQuestions));

    document.getElementById('prevButton').disabled = currentQuestionIndex === 0;
    document.getElementById('nextButton').disabled = currentQuestionIndex === filteredQuestions.length - 1;
}
