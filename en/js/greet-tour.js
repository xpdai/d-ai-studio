(() => {
  const tabs = [...document.querySelectorAll('[data-greet-screen]')];
  const panel = document.getElementById('greet-panel');
  if (!tabs.length || !panel) return;

  const screens = {
    overview: {
      title: 'See today’s support status',
      copy: 'The overview brings together unanswered conversations, booking requests and connection status so your team can see what needs attention.',
      image: 'greet-dai-home.png',
      alt: 'Illustrative D.Ai greet overview with support status and requests awaiting confirmation',
      label: 'Overview'
    },
    conversations: {
      title: 'Give your team the full context',
      copy: 'Review messages and status in one place. When a person takes over, AI pauses for that conversation.',
      image: 'greet-dai-conversation.png',
      alt: 'Illustrative D.Ai greet screen showing conversation history and a human takeover state',
      label: 'Conversations'
    },
    faq: {
      title: 'Approve answers before using them',
      copy: 'Organize FAQs and reference documents. Test answers in a preview chat and review CSV imports before your team approves the final content.',
      image: 'greet-dai-faq.png',
      alt: 'Illustrative D.Ai greet knowledge base showing FAQs, test chat and document tools',
      label: 'Knowledge base'
    },
    bookings: {
      title: 'Collect a request, then confirm it',
      copy: 'Collect a preferred date, time and party size. The business accepts or declines before the customer receives a final result; the time shown is not a confirmed booking.',
      image: 'greet-dai-booking.png',
      alt: 'Illustrative D.Ai greet booking request with date, time, party size and pending confirmation',
      label: 'Booking requests'
    },
    settings: {
      title: 'Check the connection before going live',
      copy: 'Review the local Mac service, LINE webhook and on-device model status. Production setup still needs validation in each business environment.',
      image: 'greet-dai-settings.png',
      alt: 'Illustrative D.Ai greet connection settings with local service, LINE webhook and model status',
      label: 'Connection and setup'
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
    const url = '../assets/mvp/' + item.image;
    image.src = url;
    image.alt = item.alt;
    const link = document.getElementById('greet-panel-link');
    link.href = url;
    link.setAttribute('aria-label', 'Open' + item.label + 'illustrative screen image');
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
