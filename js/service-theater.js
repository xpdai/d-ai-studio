(() => {
  const theater = document.querySelector('[data-service-theater]');
  if (!theater) return;

  const cards = [...theater.querySelectorAll('[data-service-card]')];
  const title = theater.querySelector('[data-service-title]');
  const copy = theater.querySelector('[data-service-copy]');
  const link = theater.querySelector('[data-service-link]');
  const count = theater.querySelector('[data-service-count]');
  let active = 0;
  let startX = null;
  let ignoreClick = false;

  function show(index) {
    active = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const distance = (i - active + cards.length) % cards.length;
      const position = distance === 0 ? 'active' : distance === 1 ? 'next' : distance === cards.length - 1 ? 'prev' : 'hidden';
      card.dataset.position = position;
      card.setAttribute('aria-pressed', String(i === active));
      card.tabIndex = position === 'hidden' ? -1 : 0;
    });
    const selected = cards[active];
    title.textContent = selected.dataset.title;
    copy.textContent = selected.dataset.copy;
    link.href = selected.dataset.link;
    link.textContent = selected.dataset.cta;
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }

  theater.classList.add('is-ready');
  cards.forEach((card, i) => card.addEventListener('click', () => {
    if (ignoreClick) { ignoreClick = false; return; }
    show(i);
  }));
  theater.querySelector('[data-service-prev]').addEventListener('click', () => show(active - 1));
  theater.querySelector('[data-service-next]').addEventListener('click', () => show(active + 1));
  theater.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(active + (event.key === 'ArrowRight' ? 1 : -1));
    cards[active].focus();
  });
  const stage = theater.querySelector('.service-stage');
  stage.addEventListener('pointerdown', (event) => { if (event.pointerType === 'touch') { startX = event.clientX; ignoreClick = false; } });
  stage.addEventListener('pointerup', (event) => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) < 45) return;
    ignoreClick = true;
    show(active + (distance < 0 ? 1 : -1));
    window.setTimeout(() => { ignoreClick = false; }, 400);
  });
  stage.addEventListener('pointercancel', () => { startX = null; });
  show(0);
})();
