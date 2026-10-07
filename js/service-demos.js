(function () {
  'use strict';
  const dialog = document.querySelector('.service-dialog');
  if (!dialog) return;
  const body = dialog.querySelector('.service-dialog-body');
  const close = dialog.querySelector('.service-dialog-close');
  let opener;
  let savedScroll = 0;
  let previousBodyStyle;
  const select = (id, label, options) => `<label class="demo-field" for="${id}">${label}<select id="${id}">${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join('')}</select></label>`;
  const services = {
    web: {
      title: '網站與 Web App', intro: '把頁面做成能完成任務的工具，讓訪客依需求找到下一步。', use: '適合活動頁、服務選擇器、預約流程與客製表單。',
      content: select('web-purpose', '選擇訪客想做的事', [['visit', '認識服務'], ['book', '安排諮詢']]) + select('web-mode', '選擇頁面風格', [['simple', '簡潔清楚'], ['warm', '溫暖親切']]) + '<div class="demo-web-preview" data-web-preview><span class="demo-tag">頁面預覽</span><h4 data-web-title></h4><p data-web-copy></p><button class="demo-action" type="button" data-web-next></button><p class="demo-result" data-web-result role="status"></p></div>',
      setup() {
        const render = () => {
          const booking = body.querySelector('#web-purpose').value === 'book';
          body.querySelector('[data-web-preview]').classList.toggle('is-warm', body.querySelector('#web-mode').value === 'warm');
          body.querySelector('[data-web-title]').textContent = booking ? '安排一場需求諮詢' : '找到適合你的服務';
          body.querySelector('[data-web-copy]').textContent = booking ? '先確認想做的功能，再挑選合適的討論時段。' : '從品牌介紹到互動功能，依你的目標安排內容。';
          body.querySelector('[data-web-next]').textContent = booking ? '查看示範時段' : '查看建議內容';
          body.querySelector('[data-web-result]').textContent = '';
        };
        body.querySelectorAll('select').forEach(el => el.addEventListener('change', render));
        body.querySelector('[data-web-next]').addEventListener('click', () => {
          body.querySelector('[data-web-result]').textContent = body.querySelector('#web-purpose').value === 'book' ? '示範時段：週二 14:00、週四 10:00。這是流程預覽，尚未預約。' : '建議頁面：品牌介紹 → 服務內容 → 常見問題 → 聯絡入口。';
        }); render();
      }
    },
    platform: {
      title: '系統與管理平台', intro: '把分散的資料集中，讓不同角色看到該看的內容、執行該做的事。', use: '適合會員管理、內部後台、進度追蹤與資料權限。',
      content: select('platform-role', '切換使用者角色', [['admin', '管理員'], ['staff', '服務人員']]) + select('platform-filter', '篩選案件狀態', [['all', '全部'], ['pending', '待處理'], ['done', '已完成']]) + '<p class="demo-result" data-platform-summary role="status"></p><div class="demo-records" data-platform-records></div>',
      setup() {
        const records = [{name:'品牌網站諮詢',owner:'服務人員',status:'pending',budget:'30,000'}, {name:'會員資料整理',owner:'管理員',status:'pending',budget:'18,000'}, {name:'活動頁更新',owner:'服務人員',status:'done',budget:'8,000'}];
        const render = () => {
          const admin = body.querySelector('#platform-role').value === 'admin';
          const filter = body.querySelector('#platform-filter').value;
          const shown = records.filter(row => (admin || row.owner === '服務人員') && (filter === 'all' || row.status === filter));
          body.querySelector('[data-platform-summary]').textContent = `${admin ? '管理員可看全部案件與預算' : '服務人員只看指派案件，預算欄位隱藏'}。目前 ${shown.length} 筆。`;
          body.querySelector('[data-platform-records]').innerHTML = shown.length ? shown.map(row => `<article class="demo-record"><strong>${row.name}</strong><span>${row.status === 'pending' ? '待處理' : '已完成'} · ${row.owner}</span>${admin ? `<span>示範預算 NT$ ${row.budget}</span>` : ''}</article>`).join('') : '<p class="demo-empty">沒有符合條件的案件。</p>';
        }; body.querySelectorAll('select').forEach(el => el.addEventListener('change', render)); render();
      }
    },
    automation: {
      title: '自動化與工具開發', intro: '把重複的資料整理步驟交給工具，讓每次處理都有一致的結果。', use: '適合名單清整、報表彙整、檔案轉換與固定工作流程。',
      content: '<div class="demo-data"><h4>原始示範名單</h4><pre> 小安 , AN@example.com\n小安, an@example.com\n 小晴 , CHING@example.com\n小宇, （缺少信箱）</pre></div><div class="demo-options"><label><input type="checkbox" id="clean-space" checked> 去除空白、信箱轉小寫</label><label><input type="checkbox" id="clean-duplicate" checked> 合併重複信箱</label></div><button class="demo-action" type="button" data-clean>執行名單整理</button><div class="demo-result" data-clean-result role="status">選好規則，查看整理後的名單。</div>',
      setup() {
        body.querySelector('[data-clean]').addEventListener('click', () => {
          const normalize = body.querySelector('#clean-space').checked;
          const dedupe = body.querySelector('#clean-duplicate').checked;
          let rows = [[' 小安 ', ' AN@example.com'], ['小安', 'an@example.com'], [' 小晴 ', ' CHING@example.com']];
          if (normalize) rows = rows.map(([name,email]) => [name.trim(),email.trim().toLowerCase()]);
          if (dedupe) rows = rows.filter((row,index,all) => all.findIndex(item => item[1] === row[1]) === index);
          const result = body.querySelector('[data-clean-result]');
          result.replaceChildren();
          const summary = document.createElement('p'); summary.textContent = `可用 ${rows.length} 筆，缺少信箱 1 筆另列待補。${dedupe && !normalize ? '先統一大小寫與空白，才能辨識這份名單的重複信箱。' : ''}`;
          const pre = document.createElement('pre'); pre.textContent = rows.map(row => row.join(' | ')).join('\n'); result.append(summary, pre);
        });
        body.querySelectorAll('input').forEach(el => el.addEventListener('change', () => { body.querySelector('[data-clean-result]').textContent = '規則已變更，請重新執行整理。'; }));
      }
    },
    api: {
      title: 'API 與第三方整合', intro: '讓兩套系統用一致的欄位交換資料，並先找出缺漏，減少來回補填。', use: '適合表單接後台、訂單同步、會員資料交換與狀態更新。',
      content: '<div class="demo-data"><h4>來源：示範報名表</h4><p>姓名：小晴<br>電子郵件：ching@example.com<br>電話：未填</p></div>' + select('api-mapping', '後台的「聯絡方式」對應哪個欄位？', [['email', '電子郵件'], ['phone', '電話']]) + '<button class="demo-action" type="button" data-api-check>檢查並模擬匯入</button><div class="demo-result" data-api-result role="status">先選欄位，再檢查資料是否完整。</div>',
      setup() {
        body.querySelector('[data-api-check]').addEventListener('click', () => {
          body.querySelector('[data-api-result]').textContent = body.querySelector('#api-mapping').value === 'email' ? '檢查通過。模擬後台資料：姓名＝小晴；聯絡方式＝ching@example.com。可進入匯入步驟。' : '檢查未通過：電話沒有值。這筆資料暫不匯入；可改用電子郵件，或補齊電話後重試。';
        }); body.querySelector('select').addEventListener('change', () => { body.querySelector('[data-api-result]').textContent = '欄位對應已變更，請重新檢查。'; });
      }
    },
    ai: {
      title: 'AI 與新技術整合', intro: '把 AI 放進有明確規則的流程，先確認資料依據，再決定回答或交給人處理。', use: '適合 FAQ 助理、資料摘要與需要人工確認的輔助流程。',
      content: '<p class="demo-note">以下為預先寫好的情境與結果，沒有呼叫 AI 模型。</p>' + select('ai-scenario', '選擇顧客問題情境', [['hours', '你們的營業時間？'], ['refund', '我的訂單可以退款嗎？'], ['unknown', '可以保證明天送到嗎？']]) + '<button class="demo-action" type="button" data-ai-run>查看處理流程</button><div class="demo-result" data-ai-result role="status">選一個問題，看看資料依據與處理方式。</div>',
      setup() {
        const answers = {hours: '比對到已整理 FAQ → 提供固定答案：示範營業時間為週一至週五 09:00–18:00。依據：營業時間 FAQ。', refund: '涉及個別訂單 → 轉人工確認：請由服務人員查看訂單與退款條件，再回覆顧客。這個範例不讀取訂單。', unknown: '沒有可確認的配送資料 → 不做保證：請由服務人員確認配送進度，再提供可確認的時間。'};
        body.querySelector('[data-ai-run]').addEventListener('click', () => { body.querySelector('[data-ai-result]').textContent = answers[body.querySelector('#ai-scenario').value]; });
        body.querySelector('select').addEventListener('change', () => { body.querySelector('[data-ai-result]').textContent = '情境已變更，請查看新的處理流程。'; });
      }
    },
    custom: {
      title: '客製開發服務', intro: '從實際工作方式出發，討論功能、資料與使用流程。', use: '可討論預約報名流程、資料整理或內部工具；實際開發範圍依需求評估。',
      content: '<p class="demo-note">以下是需求討論示意，不會送出資料或建立預約。</p>' + select('custom-scenario', '選擇想討論的情境', [['registration', '預約或報名流程'], ['data', '資料整理流程']]) + '<button class="demo-action" type="button" data-custom-run>查看討論方向</button><div class="demo-result" data-custom-result role="status">選擇情境，看看可以先釐清哪些問題。</div>',
      setup() {
        const directions = {
          registration: '先釐清誰會填寫、需要收集哪些欄位、名額或時段如何管理，以及送出後由誰確認。',
          data: '先釐清資料從哪裡來、目前如何整理、哪些欄位需要核對，以及結果要交給誰使用。'
        };
        body.querySelector('[data-custom-run]').addEventListener('click', () => {
          body.querySelector('[data-custom-result]').textContent = directions[body.querySelector('#custom-scenario').value];
        });
        body.querySelector('#custom-scenario').addEventListener('change', () => {
          body.querySelector('[data-custom-result]').textContent = '情境已變更，請查看新的討論方向。';
        });
      }
    }
  };
  document.querySelectorAll('[data-service-demo]').forEach(button => button.addEventListener('click', () => {
    const service = services[button.dataset.serviceDemo];
    opener = button;
    body.innerHTML = `<h2 id="service-demo-title">${service.title}</h2><p id="service-demo-intro" class="service-demo-intro">${service.intro}</p><div class="service-demo-use"><h3>適用情境</h3><p>${service.use}</p></div><section class="service-demo-example" aria-labelledby="service-example-title"><div class="demo-heading"><h3 id="service-example-title">互動範例</h3><span>示範資料</span></div>${service.content}</section>`;
    service.setup(); body.scrollTop = 0;
    savedScroll = window.scrollY;
    previousBodyStyle = document.body.getAttribute('style');
    document.body.style.position = 'fixed'; document.body.style.top = `-${savedScroll}px`; document.body.style.width = '100%';
    dialog.showModal(); close.focus({preventScroll:true});
  }));
  // Keep Tab within the dialog, including the scrollable reading area.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialog.querySelectorAll('button, select, input, [tabindex="0"]')).filter(el => !el.disabled && el.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => {
    if (previousBodyStyle === null) document.body.removeAttribute('style'); else document.body.setAttribute('style', previousBodyStyle);
    const behavior = document.documentElement.style.scrollBehavior; document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, savedScroll); document.documentElement.style.scrollBehavior = behavior;
    opener?.focus({preventScroll:true});
  });
})();
