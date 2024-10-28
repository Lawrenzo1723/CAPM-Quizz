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

  // Set quiz title and content based on section
  const titleMap = {
    practice: 'Practice Mistakes',
    review: 'Review Mode',
    flashcard: 'Flashcard Mode',
    random: 'Random Question'
  };
  document.getElementById('quiz-title').textContent = titleMap[section];
  document.getElementById('quiz-content').textContent = `You are now in ${titleMap[section]}.`; // Placeholder content
}

function showDomain(domain) {
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('footer').style.display = 'flex'; // Show footer for domain screens

  document.getElementById('quiz-title').textContent = domain;
  document.getElementById('quiz-content').textContent = `Welcome to the ${domain} section.`; // Placeholder content
}
