document.querySelector('.questions').addEventListener('click', (e) => {
  const element = e.target.closest('.question');
  if (element) {
    element.classList.toggle('question__answer-hidden');
  }
});
