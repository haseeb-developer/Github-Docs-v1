const searchInput = document.querySelector('#articleSearch');
const sections = Array.from(document.querySelectorAll('.article-section'));
const noResults = document.querySelector('.no-results');
const quizCards = Array.from(document.querySelectorAll('.quiz-card'));
const tocLinks = Array.from(document.querySelectorAll('.toc-card a'));

const setActiveTopic = (id) => {
    tocLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', isActive);
        link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
};

if (searchInput && sections.length) {
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();
        let visibleCount = 0;

        sections.forEach((section) => {
            const content = section.textContent.toLowerCase();
            const keywords = section.dataset.keywords || '';
            const matches = content.includes(query) || keywords.includes(query);

            if (!query || matches) {
                section.classList.remove('is-hidden');
                visibleCount += 1;
            } else {
                section.classList.add('is-hidden');
            }
        });

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    });
}

if (sections.length && tocLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
            const activeHeading = visibleEntries[0].target.querySelector('h2');

            if (activeHeading?.id) {
                setActiveTopic(activeHeading.id);
            }
        }
    }, {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: '-18% 0px -45% 0px'
    });

    sections.forEach((section) => sectionObserver.observe(section));
    setActiveTopic(sections[0].querySelector('h2')?.id || '');
}

quizCards.forEach((quizCard) => {
    const answer = quizCard.dataset.answer;
    const options = Array.from(quizCard.querySelectorAll('.quiz-option'));
    const feedback = quizCard.querySelector('.quiz-feedback');

    options.forEach((option) => {
        option.addEventListener('click', () => {
            const selected = option.dataset.choice;
            const isCorrect = selected === answer;

            if (isCorrect) {
                feedback.textContent = 'Correct — that answer matches the lesson goal.';
                feedback.style.background = '#edfbf1';
                feedback.style.color = '#2f7b4d';
            } else {
                feedback.textContent = 'Not quite — review the lesson section again and try another answer.';
                feedback.style.background = '#fff2f5';
                feedback.style.color = '#9a4c5f';
            }
        });
    });
});