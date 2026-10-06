(() => {
  const tabs = [...document.querySelectorAll('[data-greet-screen]')];
  const panel = document.getElementById('greet-panel');
  if (!tabs.length || !panel) return;

  const screens = {
    overview: {
      title: '先看今天的接待進度',
      copy: '首頁彙整待回覆對話、預約需求與連線狀態，先知道哪些事需要店家處理。',
      image: 'greet-dai-home.png',
      alt: 'D.Ai 示範畫面：greet 首頁的接待進度與待確認需求',
      label: '首頁'
    },
    conversations: {
      title: '把前後文交到人手上',
      copy: '在對話列表回看顧客訊息與接待狀態；需要判斷時由店家接手，AI 暫停這段對話。',
      image: 'greet-dai-conversation.png',
      alt: 'D.Ai 示範畫面：greet 顧客對話紀錄與店家接手狀態',
      label: '顧客對話'
    },
    faq: {
      title: '答案先核准，再拿來回覆',
      copy: '整理 FAQ 與參考文件；可先用試聊檢查回答，也能預覽 CSV 匯入內容。正式答案需由店家核准。',
      image: 'greet-dai-faq.png',
      alt: 'D.Ai 示範畫面：greet 知識庫的 FAQ、試聊與文件工具',
      label: '知識庫'
    },
    bookings: {
      title: '先收需求，店家再確認',
      copy: '收集顧客提出的日期、時間與人數。店家接受或婉拒後，顧客才收到最終結果；畫面中的時段尚未成立。',
      image: 'greet-dai-booking.png',
      alt: 'D.Ai 示範畫面：greet 預約收單中的日期、時間、人數與待確認狀態',
      label: '預約收單'
    },
    settings: {
      title: '開啟接待前，先檢查入口',
      copy: '查看 Mac 本機服務、LINE Webhook 與本地模型的設定狀態；正式上線仍需依店家環境驗證。',
      image: 'greet-dai-settings.png',
      alt: 'D.Ai 示範畫面：greet 連線與設定頁的本機服務、LINE 入口與模型項目',
      label: '連線與設定'
    }
  };

  function select(screen) {
    const item = screens[screen];
    if (!item) return;
    const current = tabs.find(tab => tab.dataset.greetScreen === screen);
    tabs.forEach(tab => {
      const active = tab === current;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const strip = current.parentElement;
    const tabBounds = current.getBoundingClientRect();
    const stripBounds = strip.getBoundingClientRect();
    if (tabBounds.left < stripBounds.left) strip.scrollLeft += tabBounds.left - stripBounds.left;
    else if (tabBounds.right > stripBounds.right) strip.scrollLeft += tabBounds.right - stripBounds.right;
    panel.setAttribute('aria-labelledby', current.id);
    document.getElementById('greet-panel-title').textContent = item.title;
    document.getElementById('greet-panel-copy').textContent = item.copy;
    const image = document.getElementById('greet-panel-image');
    const url = 'assets/mvp/' + item.image;
    image.src = url;
    image.alt = item.alt;
    const link = document.getElementById('greet-panel-link');
    link.href = url;
    link.setAttribute('aria-label', '開啟' + item.label + '示範畫面完整圖片');
    document.getElementById('greet-panel-open').href = url;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      select(tab.dataset.greetScreen);
      history.replaceState(null, '', '#' + tab.id);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  });

  function selectFromHash() {
    const screen = location.hash.slice(1);
    select(screens[screen] ? screen : 'conversations');
  }
  window.addEventListener('hashchange', selectFromHash);
  selectFromHash();
})();
