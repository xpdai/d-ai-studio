(function initializeSite() {
  'use strict';

  const CONTACT_URL = 'https://line.me/R/ti/p/@373owkyu';
  const tools = globalThis.BriefTools;

  if (!tools) return;

  const header = document.querySelector('[data-header]');
  const form = document.querySelector('#brief-form');
  const output = document.querySelector('#brief-output');
  const copyButton = document.querySelector('#copy-brief');
  const copyStatus = document.querySelector('#copy-status');
  const fields = ['project', 'problem', 'existing', 'timeline'].map((id) =>
    document.getElementById(id)
  );

  document.querySelectorAll('[data-contact-link]').forEach((link) => {
    const href = tools.resolveContactHref(CONTACT_URL);
    link.setAttribute('href', href);
    if (href.startsWith('http')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer');
    }
  });

  const renderBrief = () => {
    if (!output) return;
    const values = Object.fromEntries(fields.map((field) => [field.id, field.value]));
    output.value = tools.formatBrief(values);
  };

  form?.addEventListener('input', renderBrief);
  renderBrief();

  document.querySelectorAll('[data-example-project]').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('project').value = button.dataset.exampleProject;
      document.getElementById('problem').value = button.dataset.exampleProblem;
      renderBrief();
      document.getElementById('existing').focus();
      document.querySelectorAll('[data-example-project]').forEach((chip) => {
        chip.classList.toggle('is-selected', chip === button);
      });
    });
  });

  let copyTimer;
  copyButton?.addEventListener('click', async () => {
    window.clearTimeout(copyTimer);
    try {
      await tools.copyText(output.value, navigator.clipboard);
      copyButton.classList.add('is-copied');
      copyButton.querySelector('span').textContent = '已複製需求草稿';
      copyStatus.textContent = '已複製。請開啟 LINE、貼上並自行按送出；本站尚未送出需求。';
      copyTimer = window.setTimeout(() => {
        copyButton.classList.remove('is-copied');
        copyButton.querySelector('span').textContent = '複製需求草稿';
      }, 2400);
    } catch (error) {
      output.focus();
      output.select();
      output.setSelectionRange(0, output.value.length);
      copyStatus.textContent = '瀏覽器無法自動複製，已替你選取文字，請手動複製。';
    }
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
