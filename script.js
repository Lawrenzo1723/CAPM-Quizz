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
    const playGameButton = document.getElementById('playGameButton'); // Play Game button

    homeButton.addEventListener('click', showHomeScreen);
    practiceButton.addEventListener('click', showMissedQuestions);
    reviewButton.addEventListener('click', showReviewMode);
    flashcardButton.addEventListener('click', showFlashcardMode);
    randomQuizButton.addEventListener('click', showRandomQuiz);
    playGameButton.addEventListener('click', startInteractiveGame); // Event listener for the new game
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

// New function to start the interactive bomb game
function startInteractiveGame() {
    // Hide the main content and show the game container
    document.getElementById("screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("footer").style.display = "none";  // Hide footer during the game

    // Start the game-specific loading and animation
    loadQuestions();  // This loads questions for the interactive game
    startBombAnimation();  // This initiates bomb animations in the game
}

// Show the home screen and restore visibility for main content and footer
function showHomeScreen() {
    const screen = document.getElementById('screen');
    if (!screen) {
        console.error("Element with ID 'screen' not found.");
        return;
    }

    screen.innerHTML = `<h2>Select a Domain</h2>
        ${Object.keys(domainStructure).map(domain => `<button class="domain-btn">${domain}</button>`).join('')}
        <button id="playGameButton">Play Quiz Game</button>
    `;
    document.querySelectorAll('.domain-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => showSubdomains(Object.keys(domainStructure)[index]));
    });
    
    // Show main content and hide game container
    document.getElementById("screen").style.display = "block";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("footer").style.display = "flex";  // Restore footer visibility
}

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

// Function to load progress (define this if it’s missing)
function loadProgress() {
    missedQuestions = JSON.parse(localStorage.getItem('missedQuestions') || '[]');
    sessionAnswers = JSON.parse(localStorage.getItem('sessionAnswers') || '[]');
}

// Other quiz-related functions like displayQuestion, showSubdomains, and showQuestions are left unchanged
