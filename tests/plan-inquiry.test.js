const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function load(writeText) {
  let click, focused = false, selected = false;
  const field = { value: '你好，我想了解「三頁形象網站」方案。', focus() { focused = true; }, select() { selected = true; } };
  const status = { textContent: '' };
  const message = { querySelector: (selector) => selector === 'textarea' ? field : status };
  const button = { disabled: false, closest: () => message, addEventListener: (event, callback) => { click = callback; } };
  const context = vm.createContext({ document: { querySelectorAll: () => [button] }, navigator: writeText ? { clipboard: { writeText } } : {} });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'plan-inquiry.js'), 'utf8'), context);
  return { click: () => click(), button, field, status, fallback: () => focused && selected };
}
test('copies exact plan inquiry and stays usable after repeated clicks', async () => {
  const copies = []; const q = load(async (value) => copies.push(value));
  await q.click(); await q.click();
  assert.deepEqual(copies, [q.field.value, q.field.value]);
  assert.match(q.status.textContent, /已複製/); assert.equal(q.button.disabled, false);
});
test('overlapping copy requests do not duplicate clipboard writes', async () => {
  let release, count = 0;
  const q = load(() => { count++; return new Promise(resolve => { release = resolve; }); });
  const pending = q.click(); await q.click(); assert.equal(count, 1); release(); await pending;
  assert.equal(q.button.disabled, false);
});
test('blocked clipboard exposes selected text for manual copy', async () => {
  const q = load(async () => { throw new Error('denied'); }); await q.click();
  assert.equal(q.fallback(), true); assert.match(q.status.textContent, /手動複製/); assert.equal(q.button.disabled, false);
});
test('missing clipboard still permits a manual inquiry', async () => {
  const q = load(); await q.click(); assert.equal(q.fallback(), true); assert.match(q.status.textContent, /LINE/);
});
