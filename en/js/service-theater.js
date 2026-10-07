(() => {
  'use strict';
  const theater = document.querySelector('[data-service-theater]');
  if (!theater) return;
  const cards = [...theater.querySelectorAll('[data-service-card]')];
  const picks = [...theater.querySelectorAll('[data-service-pick]')];
  const stage = theater.querySelector('.service-stage');
  const link = theater.querySelector('[data-service-link]');
  const demo = theater.querySelector('[data-service-demo]');
  const count = theater.querySelector('[data-service-count]');
  let active = 0;
  let pointerStart = null;
  let ignoreClick = false;
  let lastWheel = 0;

  function show(index) {
    active = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const distance = (i - active + cards.length) % cards.length;
      const position = distance === 0 ? 'active' : distance === 1 ? 'next' : distance === cards.length - 1 ? 'prev' : 'hidden';
      card.dataset.position = position;
      card.setAttribute('aria-pressed', String(i === active));
      card.setAttribute('aria-hidden', String(position === 'hidden'));
      card.tabIndex = position === 'hidden' ? -1 : 0;
    });
    picks.forEach((pick, i) => pick.setAttribute('aria-pressed', String(i === active)));
    const selected = cards[active];
    for (const field of ['title', 'type', 'lead', 'copy', 'detail']) {
      theater.querySelector(`[data-service-${field}]`).textContent = selected.dataset[field];
    }
    const isMain = Boolean(selected.dataset.link);
    link.hidden = !isMain;
    demo.hidden = isMain;
    if (isMain) {
      link.href = selected.dataset.link;
      link.replaceChildren(document.createTextNode(selected.dataset.cta + ' '));
      const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗'; link.append(arrow);
    } else {
      demo.dataset.serviceDemo = selected.dataset.serviceCard;
      demo.setAttribute('aria-label', `${selected.dataset.title}: try an interactive demo`);
    }
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }
  cards.forEach((card, i) => card.addEventListener('click', () => {
    if (ignoreClick) return;
    show(i);
  }));
  picks.forEach((pick, i) => pick.addEventListener('click', () => show(i)));
  theater.querySelector('[data-service-prev]').addEventListener('click', () => show(active - 1));
  theater.querySelector('[data-service-next]').addEventListener('click', () => show(active + 1));
  theater.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(active + (event.key === 'ArrowRight' ? 1 : -1));
    cards[active].focus({preventScroll:true});
  });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') pointerStart = {x:event.clientX, y:event.clientY};
  });
  stage.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    ignoreClick = true;
    show(active + (dx < 0 ? 1 : -1));
    window.setTimeout(() => { ignoreClick = false; }, 400);
  });
  stage.addEventListener('pointercancel', () => { pointerStart = null; });
  // Trackpads can move the cards horizontally while vertical scrolling stays on the page.
  stage.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) < 50 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (Date.now() - lastWheel < 350) return;
    lastWheel = Date.now();
    show(active + (event.deltaX > 0 ? 1 : -1));
  }, {passive:false});
  theater.classList.add('is-ready');
  show(0);
})();
