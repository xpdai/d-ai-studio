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
      title: 'Websites and web apps', intro: 'Build pages that help visitors complete a task and find the next step.', use: 'Useful for campaign pages, service selectors, booking flows and custom forms.',
      content: select('web-purpose', 'Choose what a visitor wants to do', [['visit', 'Explore services'], ['book', 'Arrange a consultation']]) + select('web-mode', 'Choose a page style', [['simple', 'Clear and simple'], ['warm', 'Warm and friendly']]) + '<div class="demo-web-preview" data-web-preview><span class="demo-tag">Page preview</span><h4 data-web-title></h4><p data-web-copy></p><button class="demo-action" type="button" data-web-next></button><p class="demo-result" data-web-result role="status"></p></div>',
      setup() {
        const render = () => {
          const booking = body.querySelector('#web-purpose').value === 'book';
          body.querySelector('[data-web-preview]').classList.toggle('is-warm', body.querySelector('#web-mode').value === 'warm');
          body.querySelector('[data-web-title]').textContent = booking ? 'Plan a consultation' : 'Find the right service';
          body.querySelector('[data-web-copy]').textContent = booking ? 'Start with the features you need, then choose a discussion time.' : 'Arrange the content around your goals, from brand story to interactive features.';
          body.querySelector('[data-web-next]').textContent = booking ? 'View sample times' : 'View suggested sections';
          body.querySelector('[data-web-result]').textContent = '';
        };
        body.querySelectorAll('select').forEach(el => el.addEventListener('change', render));
        body.querySelector('[data-web-next]').addEventListener('click', () => {
          body.querySelector('[data-web-result]').textContent = body.querySelector('#web-purpose').value === 'book' ? 'Sample times: Tuesday 14:00 and Thursday 10:00. This is only a process demo; no booking has been made.' : 'Suggested sections: brand story → services → FAQs → contact.';
        }); render();
      }
    },
    platform: {
      title: 'Systems and admin platforms', intro: 'Bring scattered data together so each role sees and does only what it needs to.', use: 'Useful for membership, internal dashboards, progress tracking and access control.',
      content: select('platform-role', 'Switch user role', [['admin', 'Admin'], ['staff', 'Staff']]) + select('platform-filter', 'Filter case status', [['all', 'All'], ['pending', 'Pending'], ['done', 'Done']]) + '<p class="demo-result" data-platform-summary role="status"></p><div class="demo-records" data-platform-records></div>',
      setup() {
        const records = [{name:'Brand website inquiry',owner:'Staff',status:'pending',budget:'30,000'}, {name:'Member data cleanup',owner:'Admin',status:'pending',budget:'18,000'}, {name:'Campaign page update',owner:'Staff',status:'done',budget:'8,000'}];
        const render = () => {
          const admin = body.querySelector('#platform-role').value === 'admin';
          const filter = body.querySelector('#platform-filter').value;
          const shown = records.filter(row => (admin || row.owner === 'Staff') && (filter === 'all' || row.status === filter));
          body.querySelector('[data-platform-summary]').textContent = `${admin ? 'Admin can view all cases and sample budgets' : 'Staff sees assigned cases only; budgets are hidden'}. Currently ${shown.length} records.`;
          body.querySelector('[data-platform-records]').innerHTML = shown.length ? shown.map(row => `<article class="demo-record"><strong>${row.name}</strong><span>${row.status === 'pending' ? 'Pending' : 'Done'} · ${row.owner}</span>${admin ? `<span>Sample budget TWD ${row.budget}</span>` : ''}</article>`).join('') : '<p class="demo-empty">No matching sample cases.</p>';
        }; body.querySelectorAll('select').forEach(el => el.addEventListener('change', render)); render();
      }
    },
    automation: {
      title: 'Automation and custom tools', intro: 'Automate repeatable data cleanup for consistent results.', use: 'Useful for list cleanup, reporting, file conversion and repeatable workflows.',
      content: '<div class="demo-data"><h4>Raw sample list</h4><pre> An , AN@example.com\nAn, an@example.com\n Ching , CHING@example.com\nYu, (missing email)</pre></div><div class="demo-options"><label><input type="checkbox" id="clean-space" checked> Trim spaces and lowercase emails</label><label><input type="checkbox" id="clean-duplicate" checked> Merge duplicate emails</label></div><button class="demo-action" type="button" data-clean>Clean sample list</button><div class="demo-result" data-clean-result role="status">Choose rules to preview the cleaned list.</div>',
      setup() {
        body.querySelector('[data-clean]').addEventListener('click', () => {
          const normalize = body.querySelector('#clean-space').checked;
          const dedupe = body.querySelector('#clean-duplicate').checked;
          let rows = [[' An ', ' AN@example.com'], ['An', 'an@example.com'], [' Ching ', ' CHING@example.com']];
          if (normalize) rows = rows.map(([name,email]) => [name.trim(),email.trim().toLowerCase()]);
          if (dedupe) rows = rows.filter((row,index,all) => all.findIndex(item => item[1] === row[1]) === index);
          const result = body.querySelector('[data-clean-result]');
          result.replaceChildren();
          const summary = document.createElement('p'); summary.textContent = `Usable: ${rows.length} entries; one missing email needs follow-up.${dedupe && !normalize ? ' Normalize case and spaces first to detect duplicates in this sample.' : ''}`;
          const pre = document.createElement('pre'); pre.textContent = rows.map(row => row.join(' | ')).join('\n'); result.append(summary, pre);
        });
        body.querySelectorAll('input').forEach(el => el.addEventListener('change', () => { body.querySelector('[data-clean-result]').textContent = 'Rules changed. Run cleanup again.'; }));
      }
    },
    api: {
      title: 'APIs and third-party integrations', intro: 'Map fields consistently between systems and catch missing values before importing.', use: 'Useful for form-to-admin flows, order syncing, member data exchange and status updates.',
      content: '<div class="demo-data"><h4>Source: sample registration form</h4><p>Name: Ching<br>Email: ching@example.com<br>Phone: missing</p></div>' + select('api-mapping', 'Which source field maps to Contact in the admin system?', [['email', 'Email'], ['phone', 'Phone']]) + '<button class="demo-action" type="button" data-api-check>Check and simulate import</button><div class="demo-result" data-api-result role="status">Choose a field, then check completeness.</div>',
      setup() {
        body.querySelector('[data-api-check]').addEventListener('click', () => {
          body.querySelector('[data-api-result]').textContent = body.querySelector('#api-mapping').value === 'email' ? 'Check passed. Sample admin record: name = Ching; contact = ching@example.com. Ready for the simulated import step.' : 'Check failed: phone is missing. The sample record is not imported; map the email instead or add a phone number.';
        }); body.querySelector('select').addEventListener('change', () => { body.querySelector('[data-api-result]').textContent = 'Field mapping changed. Check again.'; });
      }
    },
    ai: {
      title: 'AI and emerging technology', intro: 'Use AI inside a defined workflow: check source material before answering or handing off.', use: 'Useful for FAQ assistance, data summaries and workflows that need human review.',
      content: '<p class="demo-note">The following scenarios and outcomes are scripted. This demo does not call an AI model.</p>' + select('ai-scenario', 'Choose a sample customer question', [['hours', 'What are your hours?'], ['refund', 'Can my order be refunded?'], ['unknown', 'Can you guarantee delivery tomorrow?']]) + '<button class="demo-action" type="button" data-ai-run>View the handling flow</button><div class="demo-result" data-ai-result role="status">Choose a question to see the source and handling path.</div>',
      setup() {
        const answers = {hours: 'Approved FAQ found → show the fixed sample answer: Monday to Friday, 09:00–18:00. Source: sample hours FAQ.', refund: 'Individual order → human review. Staff checks the order and refund terms before replying. This demo does not access any order.', unknown: 'No verified delivery data → no guarantee. Staff checks progress before sharing a confirmed timeframe.'};
        body.querySelector('[data-ai-run]').addEventListener('click', () => { body.querySelector('[data-ai-result]').textContent = answers[body.querySelector('#ai-scenario').value]; });
        body.querySelector('select').addEventListener('change', () => { body.querySelector('[data-ai-result]').textContent = 'Scenario changed. View the new handling flow.'; });
      }
    },
    custom: {
      title: 'Custom Development', intro: 'Discuss features, data and user flows around the way your team actually works.', use: 'Booking or registration flows, data organization and internal tools can be discussed; the development scope depends on your needs.',
      content: '<p class="demo-note">This is a sample discovery flow. It does not submit data or create a booking.</p>' + select('custom-scenario', 'Choose a scenario to discuss', [['registration', 'Booking or registration flow'], ['data', 'Data organization flow']]) + '<button class="demo-action" type="button" data-custom-run>View discussion points</button><div class="demo-result" data-custom-result role="status">Choose a scenario to see what we would clarify first.</div>',
      setup() {
        const directions = {
          registration: 'Clarify who fills in the form, which fields are needed, how places or times are managed, and who confirms a submission.',
          data: 'Clarify where the data comes from, how it is currently organized, which fields need checking, and who uses the result.'
        };
        body.querySelector('[data-custom-run]').addEventListener('click', () => {
          body.querySelector('[data-custom-result]').textContent = directions[body.querySelector('#custom-scenario').value];
        });
        body.querySelector('#custom-scenario').addEventListener('change', () => {
          body.querySelector('[data-custom-result]').textContent = 'Scenario changed. View the new discussion points.';
        });
      }
    }
  };
  document.querySelectorAll('[data-service-demo]').forEach(button => button.addEventListener('click', () => {
    const service = services[button.dataset.serviceDemo];
    opener = button;
    body.innerHTML = `<h2 id="service-demo-title">${service.title}</h2><p id="service-demo-intro" class="service-demo-intro">${service.intro}</p><div class="service-demo-use"><h3>When it helps</h3><p>${service.use}</p></div><section class="service-demo-example" aria-labelledby="service-example-title"><div class="demo-heading"><h3 id="service-example-title">Interactive demo</h3><span>Sample data</span></div>${service.content}</section>`;
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
