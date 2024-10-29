document.addEventListener('DOMContentLoaded', () => {
  showHome();
});

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

  document.getElementById('quiz-content').innerHTML = `
    <p>Select a subdomain in ${domain}</p>
    <button onclick="showQuestions()">Subdomain 1</button>
    <button onclick="showQuestions()">Subdomain 2</button>
  `;
}

function showQuestions() {
  document.getElementById('quiz-title').textContent = 'Question 1';
  document.getElementById('quiz-content').innerHTML = `
    <p>What is a key benefit of agile methodologies?</p>
    <button onclick="showAnswer(true)">Flexibility</button>
    <button onclick="showAnswer(false)">Cost-saving</button>
  `;
}

function showAnswer(isCorrect) {
  document.getElementById('quiz-content').innerHTML = isCorrect 
    ? '<p>Correct! Agile offers flexibility in changing requirements.</p>' 
    : '<p>Incorrect. The key benefit of agile is flexibility.</p>';
}

function displayRandomQuestion() {
  document.getElementById('quiz-title').textContent = 'Random Question';
  document.getElementById('quiz-content').innerHTML = `
    <p>Randomly selected question goes here.</p>
  `;
}
