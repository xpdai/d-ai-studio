(function initializePlanInquiry() {
  'use strict';
  document.querySelectorAll('[data-copy-inquiry]').forEach((button) => {
    button.addEventListener('click', async () => {
      const message = button.closest('.plan-message');
      const field = message.querySelector('textarea');
      const status = message.querySelector('[role="status"]');
      if (button.disabled) return;
      button.disabled = true;
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(field.value);
        status.textContent = '已複製，可到 LINE 貼上詢問。';
      } catch {
        field.focus();
        field.select();
        status.textContent = '請手動複製已選取的文字，再到 LINE 貼上。';
      } finally {
        button.disabled = false;
      }
    });
  });
})();
