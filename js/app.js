(function initializeSite() {
  'use strict';
  const CONTACT_URL = 'https://line.me/R/ti/p/@373owkyu';
  const header = document.querySelector('[data-header]');
  document.querySelectorAll('[data-contact-link]').forEach((link) => {
    link.href = CONTACT_URL;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
  });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' }
    );
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
