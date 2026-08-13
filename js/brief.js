(function attachBriefTools(root) {
  'use strict';

  const EMPTY_VALUE = '尚未確定';

  function normalizeField(value) {
    const normalized = String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim();

    return normalized || EMPTY_VALUE;
  }

  function formatBrief(fields) {
    const answers = fields || {};

    return [
      '你好，我想詢問一個軟體開發需求：',
      '',
      `① 想做什麼：${normalizeField(answers.project)}`,
      `② 想解決什麼問題：${normalizeField(answers.problem)}`,
      `③ 目前有沒有既有系統：${normalizeField(answers.existing)}`,
      `④ 希望什麼時候完成：${normalizeField(answers.timeline)}`,
      '',
      '想先請你協助評估可行性與開發方向，謝謝！',
    ].join('\n');
  }

  function resolveContactHref(url) {
    const normalized = String(url ?? '').trim();
    return normalized || '#contact';
  }

  function copyText(text, clipboard) {
    if (!clipboard || typeof clipboard.writeText !== 'function') {
      return Promise.reject(new Error('Clipboard API is unavailable'));
    }

    return Promise.resolve(clipboard.writeText(String(text)));
  }

  root.BriefTools = Object.freeze({
    formatBrief,
    resolveContactHref,
    copyText,
  });
})(typeof globalThis === 'undefined' ? window : globalThis);
