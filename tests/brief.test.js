const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadBriefTools() {
  const filename = path.join(__dirname, '..', 'js', 'brief.js');
  if (!fs.existsSync(filename)) return undefined;

  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  return context.BriefTools;
}

test('formats four consultation answers into a ready-to-send brief', () => {
  const tools = loadBriefTools();
  assert.ok(tools, 'BriefTools should exist');

  const actual = tools.formatBrief({
    project: ' 會員管理後台 ',
    problem: '減少人工整理',
    existing: '使用試算表',
    timeline: '三個月內 ',
  });

  assert.equal(
    actual,
    '你好，我想詢問一個軟體開發需求：\n\n' +
      '① 想做什麼：會員管理後台\n' +
      '② 想解決什麼問題：減少人工整理\n' +
      '③ 目前有沒有既有系統：使用試算表\n' +
      '④ 希望什麼時候完成：三個月內\n\n' +
      '想先請你協助評估可行性與開發方向，謝謝！'
  );
});

test('replaces blank consultation answers with a clear undecided state', () => {
  const tools = loadBriefTools();
  assert.ok(tools, 'BriefTools should exist');

  const actual = tools.formatBrief({ project: '', problem: '   ' });

  assert.match(actual, /① 想做什麼：尚未確定/);
  assert.match(actual, /② 想解決什麼問題：尚未確定/);
  assert.match(actual, /③ 目前有沒有既有系統：尚未確定/);
  assert.match(actual, /④ 希望什麼時候完成：尚未確定/);
});

test('routes an unset contact URL to the on-page consultation form', () => {
  const tools = loadBriefTools();
  assert.ok(tools, 'BriefTools should exist');

  assert.equal(tools.resolveContactHref(''), '#contact');
  assert.equal(tools.resolveContactHref('  '), '#contact');
  assert.equal(
    tools.resolveContactHref('https://example.com/contact'),
    'https://example.com/contact'
  );
});

test('copies the exact generated brief through the clipboard boundary', async () => {
  const tools = loadBriefTools();
  assert.ok(tools, 'BriefTools should exist');
  let copied = '';

  await tools.copyText('需求草稿', {
    writeText(text) {
      copied = text;
      return Promise.resolve();
    },
  });

  assert.equal(copied, '需求草稿');
});

test('rejects copy attempts when the browser clipboard is unavailable', async () => {
  const tools = loadBriefTools();
  assert.ok(tools, 'BriefTools should exist');

  await assert.rejects(
    () => tools.copyText('需求草稿'),
    /Clipboard API is unavailable/
  );
});
