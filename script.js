document.addEventListener('DOMContentLoaded', () => {
  showHome();
});

const subdomains = {
  "Project Management Fundamentals and Core Concepts": ["Project Life Cycles", "Project Management Planning"],
  "Predictive, Plan-Based Methodologies": ["Predictive Approach", "Plan-Based Scheduling"],
  "Agile Frameworks/Methodologies": ["Adaptive Approaches", "Project Iterations"],
  "Business Analysis Frameworks": ["BA Roles", "Stakeholder Communication"]
};

function showHome() {
  document.getElementById('home-screen').style.display = 'block';
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('footer').style.display = 'none'; // Hide footer on home screen
}

function navigateTo(section) {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('footer').style.display = 'flex'; // Show footer for other screens

  const titleMap = {
    practice: 'Practice Mistakes',
    review: 'Review Mode',
    flashcard: 'Flashcard Mode',
    random: 'Random Question'
  };
  document.getElementById('quiz-title').textContent = titleMap[section];
  displayRandomQuestion(); // Load content based on the section
}

function showSubdomains(domain) {
  document.getElementById('quiz-title').textContent = domain;
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('footer').style.display = 'flex';

  const domainSubdomains = subdomains[domain];
  document.getElementById('quiz-content').innerHTML = `
    <h3>Select a Subdomain</h3>
    ${domainSubdomains.map(sub => `<button onclick="showQuestions('${sub}')">${sub}</button>`).join('')}
  `;
}

function showQuestions(subdomain) {
  document.getElementById('quiz-title').textContent = `Questions on ${subdomain}`;
  document.getElementById('quiz-content').innerHTML = `
    <p>Sample question for ${subdomain}: What is a key benefit of this approach?</p>
    <button onclick="showAnswer(true)">Flexibility</button>
    <button onclick="showAnswer(false)">Cost-saving</button>
  `;
}

function showAnswer(isCorrect) {
  document.getElementById('quiz-content').innerHTML = isCorrect 
    ? '<p>Correct! The key benefit is flexibility.</p>' 
    : '<p>Incorrect. The key benefit is flexibility.</p>';
}

function displayRandomQuestion() {
  document.getElementById('quiz-title').textContent = 'Random Question';
  document.getElementById('quiz-content').innerHTML = `
    <p>Randomly selected question: What is a key benefit of agile methodologies?</p>
    <button onclick="showAnswer(true)">Flexibility</button>
    <button onclick="showAnswer(false)">Cost-saving</button>
  `;
}
